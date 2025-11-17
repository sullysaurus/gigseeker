begin;

-- =====================================================
-- ADD STRIPE FIELDS TO PROFILES
-- =====================================================
-- Add Stripe customer ID and subscription ID for payment processing

-- Add stripe_customer_id column
alter table public.profiles
  add column if not exists stripe_customer_id text;

-- Add stripe_subscription_id column
alter table public.profiles
  add column if not exists stripe_subscription_id text;

-- Create index for Stripe customer ID lookups
create index if not exists profiles_stripe_customer_id_idx on public.profiles (stripe_customer_id);

-- Create index for Stripe subscription ID lookups
create index if not exists profiles_stripe_subscription_id_idx on public.profiles (stripe_subscription_id);

commit;
