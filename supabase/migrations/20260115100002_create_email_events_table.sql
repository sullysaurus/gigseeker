begin;

-- Add resend_email_id to email_campaigns for tracking
alter table public.email_campaigns
  add column if not exists resend_email_id text unique; -- Resend's unique email ID

-- Create email_events table for detailed Resend webhook tracking
create table if not exists public.email_events (
  id uuid primary key default gen_random_uuid(),
  email_campaign_id uuid references public.email_campaigns(id) on delete cascade not null,
  resend_email_id text not null,
  event_type text not null
    check (event_type in ('email.sent', 'email.delivered', 'email.delivery_delayed', 'email.complained', 'email.bounced', 'email.opened', 'email.clicked')),
  occurred_at timestamptz not null,
  recipient_email text not null,

  -- Event-specific data
  bounce_type text, -- for bounced events: 'hard' or 'soft'
  bounce_reason text, -- for bounced events
  click_url text, -- for clicked events
  user_agent text, -- for opened/clicked events
  ip_address text, -- for opened/clicked events

  -- Raw webhook payload for debugging
  raw_payload jsonb,

  created_at timestamptz not null default now()
);

-- Create indexes for performance
create index if not exists email_events_campaign_id_idx on public.email_events (email_campaign_id);
create index if not exists email_events_resend_email_id_idx on public.email_events (resend_email_id);
create index if not exists email_events_event_type_idx on public.email_events (event_type);
create index if not exists email_events_occurred_at_idx on public.email_events (occurred_at desc);

-- Enable RLS
alter table public.email_events enable row level security;

-- Create policies for email_events
create policy "Users can view events for their own campaigns"
  on public.email_events
  for select
  using (
    exists (
      select 1 from public.email_campaigns ec
      where ec.id = email_campaign_id
      and ec.user_id = auth.uid()
    )
  );

-- Admins can view all email events
create policy "Admins can view all email events"
  on public.email_events
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.user_id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- Grant permissions
grant select on public.email_events to authenticated;
grant insert on public.email_events to service_role; -- Only service role can insert (from webhooks)

-- Create function to process email events and auto-progress pipeline
create or replace function public.process_email_event(
  p_resend_email_id text,
  p_event_type text,
  p_occurred_at timestamptz,
  p_recipient_email text,
  p_bounce_type text default null,
  p_bounce_reason text default null,
  p_click_url text default null,
  p_user_agent text default null,
  p_ip_address text default null,
  p_raw_payload jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
as $$
declare
  v_email_campaign_id uuid;
  v_pipeline_venue_id uuid;
  v_new_status text;
begin
  -- Find the email campaign by resend_email_id
  select id into v_email_campaign_id
  from public.email_campaigns
  where resend_email_id = p_resend_email_id;

  if v_email_campaign_id is null then
    -- Email campaign not found, log warning and return
    raise warning 'Email campaign not found for resend_email_id: %', p_resend_email_id;
    return;
  end if;

  -- Insert email event record
  insert into public.email_events (
    email_campaign_id,
    resend_email_id,
    event_type,
    occurred_at,
    recipient_email,
    bounce_type,
    bounce_reason,
    click_url,
    user_agent,
    ip_address,
    raw_payload
  ) values (
    v_email_campaign_id,
    p_resend_email_id,
    p_event_type,
    p_occurred_at,
    p_recipient_email,
    p_bounce_type,
    p_bounce_reason,
    p_click_url,
    p_user_agent,
    p_ip_address,
    p_raw_payload
  );

  -- Update email_campaigns table based on event type
  case p_event_type
    when 'email.sent' then
      update public.email_campaigns
      set status = 'sent'
      where id = v_email_campaign_id;

    when 'email.delivered' then
      update public.email_campaigns
      set status = 'delivered'
      where id = v_email_campaign_id;

    when 'email.opened' then
      update public.email_campaigns
      set
        status = 'opened',
        opened_at = coalesce(opened_at, p_occurred_at),
        open_count = open_count + 1
      where id = v_email_campaign_id;

    when 'email.clicked' then
      update public.email_campaigns
      set
        status = 'clicked',
        clicked_at = coalesce(clicked_at, p_occurred_at),
        click_count = click_count + 1
      where id = v_email_campaign_id;

    when 'email.bounced' then
      update public.email_campaigns
      set
        status = 'bounced',
        bounce_reason = p_bounce_reason
      where id = v_email_campaign_id;

    else
      -- No action for other event types
      null;
  end case;

  -- Get the pipeline_venue_id from email_campaigns
  select pipeline_venue_id into v_pipeline_venue_id
  from public.email_campaigns
  where id = v_email_campaign_id;

  -- Auto-progress pipeline_venues status based on email events
  case p_event_type
    when 'email.sent' then
      v_new_status := 'contacted';

    when 'email.opened' then
      v_new_status := 'opened';

      -- Update email_opened_at timestamp
      update public.pipeline_venues
      set email_opened_at = coalesce(email_opened_at, p_occurred_at)
      where id = v_pipeline_venue_id;

    when 'email.clicked' then
      v_new_status := 'opened'; -- Keep as 'opened' but they're highly engaged

    when 'email.bounced' then
      v_new_status := 'archived'; -- Auto-archive bounced emails

    else
      v_new_status := null;
  end case;

  -- Update pipeline_venues status if we determined a new status
  if v_new_status is not null then
    update public.pipeline_venues
    set
      status = v_new_status,
      updated_at = now()
    where id = v_pipeline_venue_id
    -- Only update if current status is earlier in the pipeline
    and status in ('discovered', 'approved', 'contacted', 'opened')
    -- Don't regress status (e.g., from 'responded' back to 'opened')
    and case v_new_status
      when 'contacted' then status in ('discovered', 'approved')
      when 'opened' then status in ('discovered', 'approved', 'contacted')
      when 'archived' then true -- Can always archive
      else false
    end;
  end if;

end;
$$;

-- Create view for email analytics
create or replace view public.email_campaign_analytics as
select
  ec.id as campaign_id,
  ec.user_id,
  ec.pipeline_venue_id,
  ec.venue_id,
  ec.subject,
  ec.sent_at,
  ec.status as campaign_status,
  ec.open_count,
  ec.click_count,

  -- Aggregate event data
  count(ee.id) filter (where ee.event_type = 'email.sent') as sent_events,
  count(ee.id) filter (where ee.event_type = 'email.delivered') as delivered_events,
  count(ee.id) filter (where ee.event_type = 'email.opened') as opened_events,
  count(ee.id) filter (where ee.event_type = 'email.clicked') as clicked_events,
  count(ee.id) filter (where ee.event_type = 'email.bounced') as bounced_events,

  -- First event times
  min(ee.occurred_at) filter (where ee.event_type = 'email.delivered') as first_delivered_at,
  min(ee.occurred_at) filter (where ee.event_type = 'email.opened') as first_opened_at,
  min(ee.occurred_at) filter (where ee.event_type = 'email.clicked') as first_clicked_at,

  -- Most recent event
  max(ee.occurred_at) as last_event_at

from public.email_campaigns ec
left join public.email_events ee on ee.email_campaign_id = ec.id
group by ec.id;

-- Grant access to the view
grant select on public.email_campaign_analytics to authenticated;

commit;
