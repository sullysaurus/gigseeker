-- Admin Role Migration
-- Add admin role to profiles table

-- Add is_admin column
alter table public.profiles add column if not exists is_admin boolean default false;

-- Create index for faster admin lookups
create index if not exists profiles_is_admin_idx on public.profiles(is_admin) where is_admin = true;

-- Set dsully15@gmail.com as admin
update public.profiles
set is_admin = true, subscription_tier = 'pro'
where user_id in (
  select id from auth.users where email = 'dsully15@gmail.com'
);

-- Function to check if user is admin
create or replace function public.is_user_admin(p_user_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select coalesce(
    (select is_admin from public.profiles where user_id = p_user_id),
    false
  );
$$;

-- Admin function to update user subscription tier
create or replace function public.admin_update_user_tier(
  p_admin_user_id uuid,
  p_target_user_id uuid,
  p_new_tier text
)
returns json
language plpgsql
security definer
as $$
declare
  v_is_admin boolean;
begin
  -- Check if caller is admin
  select is_admin into v_is_admin
  from public.profiles
  where user_id = p_admin_user_id;

  if not v_is_admin then
    raise exception 'Unauthorized: Admin access required';
  end if;

  -- Update target user's tier
  update public.profiles
  set subscription_tier = p_new_tier
  where user_id = p_target_user_id;

  return json_build_object(
    'success', true,
    'user_id', p_target_user_id,
    'new_tier', p_new_tier
  );
end;
$$;

-- Admin function to get all users
create or replace function public.admin_get_users(p_admin_user_id uuid)
returns table(
  user_id uuid,
  email text,
  display_name text,
  subscription_tier text,
  ai_credits_balance integer,
  is_admin boolean,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
language plpgsql
security definer
as $$
declare
  v_is_admin boolean;
begin
  -- Check if caller is admin
  select profiles.is_admin into v_is_admin
  from public.profiles
  where profiles.user_id = p_admin_user_id;

  if not v_is_admin then
    raise exception 'Unauthorized: Admin access required';
  end if;

  -- Return all users with their profile data
  return query
  select
    p.user_id,
    u.email,
    p.display_name,
    p.subscription_tier,
    p.ai_credits_balance,
    p.is_admin,
    p.created_at,
    u.last_sign_in_at
  from public.profiles p
  join auth.users u on u.id = p.user_id
  order by p.created_at desc;
end;
$$;

-- Admin function to update user credits
create or replace function public.admin_update_user_credits(
  p_admin_user_id uuid,
  p_target_user_id uuid,
  p_new_balance integer
)
returns json
language plpgsql
security definer
as $$
declare
  v_is_admin boolean;
begin
  -- Check if caller is admin
  select is_admin into v_is_admin
  from public.profiles
  where user_id = p_admin_user_id;

  if not v_is_admin then
    raise exception 'Unauthorized: Admin access required';
  end if;

  -- Update target user's credits
  update public.profiles
  set ai_credits_balance = p_new_balance
  where user_id = p_target_user_id;

  return json_build_object(
    'success', true,
    'user_id', p_target_user_id,
    'new_balance', p_new_balance
  );
end;
$$;

-- Grant execute permissions
grant execute on function public.is_user_admin(uuid) to authenticated;
grant execute on function public.admin_update_user_tier(uuid, uuid, text) to authenticated;
grant execute on function public.admin_get_users(uuid) to authenticated;
grant execute on function public.admin_update_user_credits(uuid, uuid, integer) to authenticated;
