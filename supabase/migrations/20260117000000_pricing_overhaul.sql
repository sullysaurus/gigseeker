begin;

-- =====================================================
-- PRICING OVERHAUL MIGRATION
-- =====================================================
-- Changes:
-- 1. Rename credits_balance → ai_credits_balance (credits only for AI, not emails)
-- 2. Add subscription_tier column (free/pro/agency)
-- 3. Add max_pipeline_venues column (free: 20, pro/agency: unlimited)
-- 4. Update credit transaction types for AI actions
-- 5. Create email_usage table to track email sends (Pro tier feature)
-- 6. Create ai_action_usage table to track AI feature usage
-- 7. Update referral bonus from 10 → 50 AI credits

-- =====================================================
-- 1. UPDATE PROFILES TABLE
-- =====================================================

-- Add subscription_tier column
alter table public.profiles
  add column if not exists subscription_tier text not null default 'free'
    check (subscription_tier in ('free', 'pro', 'agency'));

-- Add max_pipeline_venues column (NULL = unlimited)
alter table public.profiles
  add column if not exists max_pipeline_venues integer;

-- Set default max_pipeline_venues for free tier
update public.profiles
set max_pipeline_venues = 20
where subscription_tier = 'free' and max_pipeline_venues is null;

-- Rename credits_balance to ai_credits_balance
alter table public.profiles
  rename column credits_balance to ai_credits_balance;

-- Create index for subscription tier
create index if not exists profiles_subscription_tier_idx on public.profiles (subscription_tier);

-- =====================================================
-- 2. UPDATE CREDIT_TRANSACTIONS TABLE
-- =====================================================

-- Drop old check constraint
alter table public.credit_transactions
  drop constraint if exists credit_transactions_transaction_type_check;

-- Add new check constraint with AI action types
alter table public.credit_transactions
  add constraint credit_transactions_transaction_type_check
  check (transaction_type in (
    'initial_signup',
    'referral_bonus',
    'purchase',
    'admin_adjustment',
    'refund',
    'ai_email_generation',
    'ai_email_personalization',
    'ai_email_improvement',
    'ai_followup_generation',
    'ai_subject_line_generation'
  ));

-- Rename old 'email_sent' transactions to a deprecated type
-- (We'll keep them for historical data but won't create new ones)
update public.credit_transactions
set transaction_type = 'refund',
    description = concat('[MIGRATED] Original type: email_sent. ', coalesce(description, ''))
where transaction_type = 'email_sent';

-- =====================================================
-- 3. CREATE EMAIL_USAGE TABLE
-- =====================================================
-- Track email sends separately from credits
-- Email sending is now a Pro tier feature, not a credit-based feature

create table if not exists public.email_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  email_campaign_id uuid references public.email_campaigns(id) on delete set null,
  venue_id uuid references public.venues(id) on delete set null,

  -- Email details
  recipient_email text not null,
  subject text not null,

  -- Tracking
  sent_at timestamptz not null default now(),
  opened_at timestamptz,
  clicked_at timestamptz,

  -- Metadata
  metadata jsonb default '{}'::jsonb,

  created_at timestamptz not null default now()
);

-- Create indexes
create index if not exists email_usage_user_id_idx on public.email_usage (user_id);
create index if not exists email_usage_email_campaign_id_idx on public.email_usage (email_campaign_id);
create index if not exists email_usage_sent_at_idx on public.email_usage (sent_at desc);
create index if not exists email_usage_created_at_idx on public.email_usage (created_at desc);

-- Enable RLS
alter table public.email_usage enable row level security;

-- Create policies for email_usage
create policy "Users can view their own email usage"
  on public.email_usage
  for select
  using (auth.uid() = user_id);

-- Admins can view all email usage
create policy "Admins can view all email usage"
  on public.email_usage
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
grant select on public.email_usage to authenticated;
grant insert on public.email_usage to authenticated;

-- =====================================================
-- 4. CREATE AI_ACTION_USAGE TABLE
-- =====================================================
-- Track AI feature usage and costs

create table if not exists public.ai_action_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  credit_transaction_id uuid references public.credit_transactions(id) on delete set null,

  -- Action details
  action_type text not null
    check (action_type in (
      'email_generation',
      'email_personalization',
      'email_improvement',
      'followup_generator',
      'subject_line_generator'
    )),
  credits_cost integer not null,

  -- Context
  venue_id uuid references public.venues(id) on delete set null,
  pipeline_venue_id uuid references public.pipeline_venues(id) on delete set null,

  -- Result (optional, for analytics)
  success boolean default true,
  error_message text,

  -- Metadata
  metadata jsonb default '{}'::jsonb,

  created_at timestamptz not null default now()
);

-- Create indexes
create index if not exists ai_action_usage_user_id_idx on public.ai_action_usage (user_id);
create index if not exists ai_action_usage_action_type_idx on public.ai_action_usage (action_type);
create index if not exists ai_action_usage_created_at_idx on public.ai_action_usage (created_at desc);
create index if not exists ai_action_usage_credit_transaction_id_idx on public.ai_action_usage (credit_transaction_id);

-- Enable RLS
alter table public.ai_action_usage enable row level security;

-- Create policies for ai_action_usage
create policy "Users can view their own AI action usage"
  on public.ai_action_usage
  for select
  using (auth.uid() = user_id);

-- Admins can view all AI action usage
create policy "Admins can view all AI action usage"
  on public.ai_action_usage
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
grant select on public.ai_action_usage to authenticated;
grant insert on public.ai_action_usage to authenticated;

-- =====================================================
-- 5. UPDATE EXISTING FUNCTIONS
-- =====================================================

-- Update deduct_credits to use ai_credits_balance
create or replace function public.deduct_credits(
  p_user_id uuid,
  p_amount integer,
  p_transaction_type text,
  p_description text default null,
  p_related_email_campaign_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns boolean
language plpgsql
security definer
as $$
declare
  v_current_balance integer;
begin
  -- Get current balance with row lock
  select ai_credits_balance into v_current_balance
  from public.profiles
  where user_id = p_user_id
  for update;

  -- Check if user has enough credits
  if v_current_balance < p_amount then
    return false;
  end if;

  -- Deduct credits from profile
  update public.profiles
  set ai_credits_balance = ai_credits_balance - p_amount
  where user_id = p_user_id;

  -- Record transaction (negative amount)
  insert into public.credit_transactions (
    user_id,
    amount,
    transaction_type,
    description,
    related_email_campaign_id,
    metadata
  ) values (
    p_user_id,
    -p_amount,
    p_transaction_type,
    p_description,
    p_related_email_campaign_id,
    p_metadata
  );

  return true;
end;
$$;

-- Update add_credits to use ai_credits_balance
create or replace function public.add_credits(
  p_user_id uuid,
  p_amount integer,
  p_transaction_type text,
  p_description text default null,
  p_related_referral_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
as $$
begin
  -- Add credits to profile
  update public.profiles
  set ai_credits_balance = ai_credits_balance + p_amount
  where user_id = p_user_id;

  -- Record transaction (positive amount)
  insert into public.credit_transactions (
    user_id,
    amount,
    transaction_type,
    description,
    related_referral_id,
    metadata
  ) values (
    p_user_id,
    p_amount,
    p_transaction_type,
    p_description,
    p_related_referral_id,
    p_metadata
  );
end;
$$;

-- Update get_credit_balance to use ai_credits_balance
create or replace function public.get_credit_balance(p_user_id uuid)
returns integer
language plpgsql
security definer
as $$
declare
  v_balance integer;
begin
  select ai_credits_balance into v_balance
  from public.profiles
  where user_id = p_user_id;

  return coalesce(v_balance, 0);
end;
$$;

-- Update complete_referral to award 50 credits instead of 10
create or replace function public.complete_referral(p_referral_id uuid)
returns boolean
language plpgsql
security definer
as $$
declare
  v_referrer_id uuid;
  v_referee_id uuid;
  v_already_awarded boolean;
begin
  -- Get referral details
  select referrer_id, referee_id, credits_awarded
  into v_referrer_id, v_referee_id, v_already_awarded
  from public.referrals
  where id = p_referral_id;

  if v_referrer_id is null then
    return false;
  end if;

  if v_already_awarded then
    -- Credits already awarded
    return true;
  end if;

  -- Award 50 AI credits to referrer (updated from 10)
  perform public.add_credits(
    v_referrer_id,
    50,
    'referral_bonus',
    'Referral bonus for inviting a new user',
    p_referral_id,
    jsonb_build_object('referee_id', v_referee_id)
  );

  -- Update referral record
  update public.referrals
  set
    status = 'completed',
    credits_awarded = true,
    credits_awarded_at = now(),
    completed_at = now()
  where id = p_referral_id;

  return true;
end;
$$;

-- Update get_referral_stats to show correct credit amounts (50 instead of 10)
create or replace function public.get_referral_stats(p_user_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_stats jsonb;
begin
  select jsonb_build_object(
    'total_referrals', count(*),
    'completed_referrals', count(*) filter (where status = 'completed'),
    'pending_referrals', count(*) filter (where status = 'pending'),
    'total_credits_earned', count(*) filter (where credits_awarded = true) * 50
  )
  into v_stats
  from public.referrals
  where referrer_id = p_user_id;

  return v_stats;
end;
$$;

-- =====================================================
-- 6. CREATE NEW FUNCTIONS FOR EMAIL SENDING
-- =====================================================

-- Check if user can send email (Pro/Agency tier)
create or replace function public.can_send_email(p_user_id uuid)
returns boolean
language plpgsql
security definer
as $$
declare
  v_tier text;
begin
  select subscription_tier into v_tier
  from public.profiles
  where user_id = p_user_id;

  return v_tier in ('pro', 'agency');
end;
$$;

-- Check if user can add venue to pipeline (based on max_pipeline_venues)
create or replace function public.can_add_venue_to_pipeline(p_user_id uuid)
returns boolean
language plpgsql
security definer
as $$
declare
  v_max_venues integer;
  v_current_count integer;
begin
  -- Get max venues allowed for user's tier
  select max_pipeline_venues into v_max_venues
  from public.profiles
  where user_id = p_user_id;

  -- NULL means unlimited (Pro/Agency tier)
  if v_max_venues is null then
    return true;
  end if;

  -- Count current venues in user's pipelines
  select count(distinct venue_id) into v_current_count
  from public.pipeline_venues
  where user_id = p_user_id;

  return v_current_count < v_max_venues;
end;
$$;

-- Get current pipeline venue count
create or replace function public.get_pipeline_venue_count(p_user_id uuid)
returns integer
language plpgsql
security definer
as $$
declare
  v_count integer;
begin
  select count(distinct venue_id) into v_count
  from public.pipeline_venues
  where user_id = p_user_id;

  return coalesce(v_count, 0);
end;
$$;

-- Record email send (for Pro tier users)
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
  -- Check if user can send email
  if not public.can_send_email(p_user_id) then
    raise exception 'User does not have permission to send emails. Upgrade to Pro tier.';
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

  return v_email_usage_id;
end;
$$;

-- Record AI action usage and deduct credits
create or replace function public.record_ai_action(
  p_user_id uuid,
  p_action_type text,
  p_credits_cost integer,
  p_venue_id uuid default null,
  p_pipeline_venue_id uuid default null,
  p_success boolean default true,
  p_error_message text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_transaction_id uuid;
  v_ai_action_id uuid;
  v_deducted boolean;
begin
  -- Try to deduct credits
  v_deducted := public.deduct_credits(
    p_user_id,
    p_credits_cost,
    'ai_' || p_action_type,
    'AI action: ' || p_action_type,
    null,
    p_metadata
  );

  if not v_deducted then
    raise exception 'Insufficient AI credits. Please purchase more credits or upgrade to Pro tier.';
  end if;

  -- Get the transaction ID
  select id into v_transaction_id
  from public.credit_transactions
  where user_id = p_user_id
    and transaction_type = 'ai_' || p_action_type
  order by created_at desc
  limit 1;

  -- Record AI action usage
  insert into public.ai_action_usage (
    user_id,
    credit_transaction_id,
    action_type,
    credits_cost,
    venue_id,
    pipeline_venue_id,
    success,
    error_message,
    metadata
  ) values (
    p_user_id,
    v_transaction_id,
    p_action_type,
    p_credits_cost,
    p_venue_id,
    p_pipeline_venue_id,
    p_success,
    p_error_message,
    p_metadata
  )
  returning id into v_ai_action_id;

  return v_ai_action_id;
end;
$$;

-- =====================================================
-- 7. UPDATE INITIAL SIGNUP CREDITS
-- =====================================================

-- Update handle_new_user to give 10 AI credits on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    user_id,
    display_name,
    booking_email,
    subscription_tier,
    max_pipeline_venues,
    ai_credits_balance
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.email,
    'free',
    20,
    10
  );

  -- Create default pipeline
  insert into public.pipelines (user_id, name, description, is_default)
  values (
    new.id,
    'My Pipeline',
    'Default pipeline for tracking venue outreach',
    true
  );

  -- Record initial credit transaction
  insert into public.credit_transactions (
    user_id,
    amount,
    transaction_type,
    description
  ) values (
    new.id,
    10,
    'initial_signup',
    'Welcome bonus: 10 free AI credits'
  );

  return new;
end;
$$;

commit;
