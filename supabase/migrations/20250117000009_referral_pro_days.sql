-- Change referral reward from AI credits to 7 days of Pro subscription
-- Simpler, more valuable reward system

-- Add column to track pro subscription expiry
alter table public.profiles
  add column if not exists pro_until timestamptz;

-- Update the complete_referral function to award 7 days of Pro instead of credits
create or replace function public.complete_referral(p_referral_id uuid)
returns boolean
language plpgsql
security definer
as $$
declare
  v_referrer_id uuid;
  v_referee_id uuid;
  v_already_awarded boolean;
  v_current_pro_until timestamptz;
  v_new_pro_until timestamptz;
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
    -- Reward already awarded
    return true;
  end if;

  -- Get referrer's current pro subscription end date
  select pro_until into v_current_pro_until
  from public.profiles
  where user_id = v_referrer_id;

  -- Calculate new pro_until date (7 days from now or current expiry, whichever is later)
  if v_current_pro_until is null or v_current_pro_until < now() then
    v_new_pro_until := now() + interval '7 days';
  else
    v_new_pro_until := v_current_pro_until + interval '7 days';
  end if;

  -- Update referrer's profile with extended Pro access
  update public.profiles
  set
    pro_until = v_new_pro_until,
    subscription_tier = 'pro' -- Set to pro if not already
  where user_id = v_referrer_id;

  -- Update referral record
  update public.referrals
  set
    status = 'completed',
    credits_awarded = true, -- Keep this field name for compatibility
    credits_awarded_at = now(),
    completed_at = now()
  where id = p_referral_id;

  return true;
end;
$$;

-- Update get_referral_stats to calculate pro days instead of credits
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
    'total_credits_earned', count(*) filter (where credits_awarded = true) * 7 -- 7 days per referral
  )
  into v_stats
  from public.referrals
  where referrer_id = p_user_id;

  return v_stats;
end;
$$;

comment on column public.profiles.pro_until is 'When the user''s Pro subscription expires (null = no active Pro from referrals)';
