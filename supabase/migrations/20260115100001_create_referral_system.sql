begin;

-- Add referral_code column to profiles
alter table public.profiles
  add column if not exists referral_code text unique;

-- Create function to generate unique referral codes
create or replace function public.generate_referral_code()
returns text
language plpgsql
as $$
declare
  v_code text;
  v_exists boolean;
begin
  loop
    -- Generate a random 8-character alphanumeric code
    v_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));

    -- Check if code already exists
    select exists(select 1 from public.profiles where referral_code = v_code) into v_exists;

    -- If code is unique, return it
    if not v_exists then
      return v_code;
    end if;
  end loop;
end;
$$;

-- Create trigger to auto-generate referral codes for new users
create or replace function public.set_referral_code()
returns trigger
language plpgsql
as $$
begin
  if new.referral_code is null then
    new.referral_code := public.generate_referral_code();
  end if;
  return new;
end;
$$;

create trigger profiles_set_referral_code
  before insert on public.profiles
  for each row
  execute function public.set_referral_code();

-- Backfill referral codes for existing users
update public.profiles
set referral_code = public.generate_referral_code()
where referral_code is null;

-- Create referrals table to track who referred whom
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid references auth.users(id) on delete cascade not null, -- person who sent the invite
  referee_id uuid references auth.users(id) on delete cascade not null, -- person who signed up
  referral_code text not null, -- the code that was used
  credits_awarded boolean default false, -- whether the referrer has been awarded credits
  credits_awarded_at timestamptz,
  status text not null default 'pending'
    check (status in ('pending', 'completed', 'expired')),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  unique(referee_id) -- each user can only be referred once
);

-- Create indexes
create index if not exists referrals_referrer_id_idx on public.referrals (referrer_id);
create index if not exists referrals_referee_id_idx on public.referrals (referee_id);
create index if not exists referrals_status_idx on public.referrals (status);
create index if not exists referrals_created_at_idx on public.referrals (created_at desc);
create index if not exists profiles_referral_code_idx on public.profiles (referral_code);

-- Enable RLS
alter table public.referrals enable row level security;

-- Create policies for referrals
create policy "Users can view their own referrals (as referrer)"
  on public.referrals
  for select
  using (auth.uid() = referrer_id);

create policy "Users can view referrals where they are the referee"
  on public.referrals
  for select
  using (auth.uid() = referee_id);

-- Admins can view all referrals
create policy "Admins can view all referrals"
  on public.referrals
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
grant select on public.referrals to authenticated;
grant insert on public.referrals to authenticated;

-- Add foreign key to credit_transactions for referral tracking
alter table public.credit_transactions
  add constraint credit_transactions_referral_id_fkey
  foreign key (related_referral_id)
  references public.referrals(id)
  on delete set null;

-- Create function to process referral signup
create or replace function public.process_referral_signup(
  p_referee_id uuid,
  p_referral_code text
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_referrer_id uuid;
  v_referral_id uuid;
  v_existing_referral uuid;
begin
  -- Check if referee already has a referral record
  select id into v_existing_referral
  from public.referrals
  where referee_id = p_referee_id;

  if v_existing_referral is not null then
    -- User was already referred, don't create duplicate
    return v_existing_referral;
  end if;

  -- Find the referrer by their referral code
  select user_id into v_referrer_id
  from public.profiles
  where referral_code = upper(p_referral_code);

  if v_referrer_id is null then
    -- Invalid referral code
    return null;
  end if;

  if v_referrer_id = p_referee_id then
    -- Can't refer yourself
    return null;
  end if;

  -- Create referral record
  insert into public.referrals (
    referrer_id,
    referee_id,
    referral_code,
    status
  ) values (
    v_referrer_id,
    p_referee_id,
    upper(p_referral_code),
    'pending'
  )
  returning id into v_referral_id;

  return v_referral_id;
end;
$$;

-- Create function to complete referral and award credits
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

  -- Award 10 credits to referrer
  perform public.add_credits(
    v_referrer_id,
    10,
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

-- Create function to get referral stats for a user
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
    'total_credits_earned', count(*) filter (where credits_awarded = true) * 10
  )
  into v_stats
  from public.referrals
  where referrer_id = p_user_id;

  return v_stats;
end;
$$;

commit;
