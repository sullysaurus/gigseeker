begin;

-- =====================================================
-- EMAIL RATE LIMITING
-- =====================================================
-- Add daily email tracking to prevent abuse
-- Limits:
-- - Free: 0 emails (already blocked by tier check)
-- - Pro: 100 emails/day
-- - Agency: 500 emails/day

-- Add email tracking columns to profiles
alter table public.profiles
  add column if not exists daily_email_count integer not null default 0;

alter table public.profiles
  add column if not exists last_email_date date not null default current_date;

-- Create index for email tracking queries
create index if not exists profiles_last_email_date_idx on public.profiles (last_email_date);

-- Function to get daily email limit for a user
create or replace function public.get_daily_email_limit(p_user_id uuid)
returns integer
language plpgsql
security definer
as $$
declare
  v_tier text;
begin
  select subscription_tier into v_tier
  from public.profiles
  where user_id = p_user_id;

  -- Return limits based on tier
  return case v_tier
    when 'free' then 0
    when 'pro' then 100
    when 'agency' then 500
    else 0
  end;
end;
$$;

-- Function to check if user can send email (with rate limiting)
create or replace function public.can_send_email_with_limit(p_user_id uuid)
returns boolean
language plpgsql
security definer
as $$
declare
  v_tier text;
  v_daily_count integer;
  v_last_email_date date;
  v_daily_limit integer;
begin
  -- Get user's subscription tier and email stats
  select
    subscription_tier,
    daily_email_count,
    last_email_date
  into v_tier, v_daily_count, v_last_email_date
  from public.profiles
  where user_id = p_user_id;

  -- Check tier allows emails
  if v_tier not in ('pro', 'agency') then
    return false;
  end if;

  -- Get daily limit
  v_daily_limit := public.get_daily_email_limit(p_user_id);

  -- Reset counter if it's a new day
  if v_last_email_date < current_date then
    update public.profiles
    set
      daily_email_count = 0,
      last_email_date = current_date
    where user_id = p_user_id;

    return true; -- First email of new day
  end if;

  -- Check if under daily limit
  return v_daily_count < v_daily_limit;
end;
$$;

-- Function to increment email counter
create or replace function public.increment_email_count(p_user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  -- Update counter, resetting if it's a new day
  update public.profiles
  set
    daily_email_count = case
      when last_email_date < current_date then 1
      else daily_email_count + 1
    end,
    last_email_date = current_date
  where user_id = p_user_id;
end;
$$;

-- Update the record_email_send function to include rate limiting
create or replace function public.record_email_send(
  p_user_id uuid,
  p_email_campaign_id uuid,
  p_venue_id uuid,
  p_recipient_email text,
  p_subject text,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_email_usage_id uuid;
begin
  -- Check if user can send email (tier check + rate limit)
  if not public.can_send_email_with_limit(p_user_id) then
    raise exception 'Daily email limit reached or Pro subscription required.';
  end if;

  -- Record email usage
  insert into public.email_usage (
    user_id,
    email_campaign_id,
    venue_id,
    recipient_email,
    subject,
    metadata
  ) values (
    p_user_id,
    p_email_campaign_id,
    p_venue_id,
    p_recipient_email,
    p_subject,
    p_metadata
  )
  returning id into v_email_usage_id;

  -- Increment counter
  perform public.increment_email_count(p_user_id);

  return v_email_usage_id;
end;
$$;

-- Helper function to get remaining emails for today
create or replace function public.get_remaining_emails(p_user_id uuid)
returns integer
language plpgsql
security definer
as $$
declare
  v_daily_limit integer;
  v_daily_count integer;
  v_last_email_date date;
begin
  -- Get user's email stats
  select
    daily_email_count,
    last_email_date
  into v_daily_count, v_last_email_date
  from public.profiles
  where user_id = p_user_id;

  -- Get daily limit
  v_daily_limit := public.get_daily_email_limit(p_user_id);

  -- If it's a new day, they have full limit
  if v_last_email_date < current_date then
    return v_daily_limit;
  end if;

  -- Return remaining
  return greatest(0, v_daily_limit - v_daily_count);
end;
$$;

-- Grant execute permissions
grant execute on function public.get_daily_email_limit(uuid) to authenticated;
grant execute on function public.can_send_email_with_limit(uuid) to authenticated;
grant execute on function public.increment_email_count(uuid) to authenticated;
grant execute on function public.get_remaining_emails(uuid) to authenticated;

commit;
