begin;

-- Add credits_balance column to profiles
alter table public.profiles
  add column if not exists credits_balance integer not null default 10;

-- Create credit_transactions table for tracking all credit changes
create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  amount integer not null, -- positive for credits added, negative for credits spent
  transaction_type text not null
    check (transaction_type in ('initial_signup', 'referral_bonus', 'email_sent', 'purchase', 'admin_adjustment', 'refund')),
  description text,
  related_email_campaign_id uuid references public.email_campaigns(id) on delete set null,
  related_referral_id uuid, -- will be linked after referrals table is created
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Create index for performance
create index if not exists credit_transactions_user_id_idx on public.credit_transactions (user_id);
create index if not exists credit_transactions_created_at_idx on public.credit_transactions (created_at desc);
create index if not exists credit_transactions_type_idx on public.credit_transactions (transaction_type);

-- Enable RLS
alter table public.credit_transactions enable row level security;

-- Create policies for credit_transactions
create policy "Users can view their own credit transactions"
  on public.credit_transactions
  for select
  using (auth.uid() = user_id);

-- Admins can view all credit transactions
create policy "Admins can view all credit transactions"
  on public.credit_transactions
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.user_id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- Admins can create admin adjustments
create policy "Admins can create credit adjustments"
  on public.credit_transactions
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where profiles.user_id = auth.uid()
      and profiles.is_admin = true
    )
    and transaction_type = 'admin_adjustment'
  );

-- Grant permissions
grant select on public.credit_transactions to authenticated;
grant insert on public.credit_transactions to authenticated;

-- Create function to safely deduct credits
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
  select credits_balance into v_current_balance
  from public.profiles
  where user_id = p_user_id
  for update;

  -- Check if user has enough credits
  if v_current_balance < p_amount then
    return false;
  end if;

  -- Deduct credits from profile
  update public.profiles
  set credits_balance = credits_balance - p_amount
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

-- Create function to add credits
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
  set credits_balance = credits_balance + p_amount
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

-- Create function to get user's credit balance
create or replace function public.get_credit_balance(p_user_id uuid)
returns integer
language plpgsql
security definer
as $$
declare
  v_balance integer;
begin
  select credits_balance into v_balance
  from public.profiles
  where user_id = p_user_id;

  return coalesce(v_balance, 0);
end;
$$;

commit;
