-- Fix admin functions to work with auth schema access
-- Drop existing functions if they exist
drop function if exists public.admin_get_users(uuid);
drop function if exists public.admin_update_user_tier(uuid, uuid, text);
drop function if exists public.admin_update_user_credits(uuid, uuid, integer);

-- Admin function to get all users (fixed version)
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
set search_path = public, auth
as $$
declare
  v_is_admin boolean;
begin
  -- Check if caller is admin
  select p.is_admin into v_is_admin
  from public.profiles p
  where p.user_id = p_admin_user_id;

  if not coalesce(v_is_admin, false) then
    raise exception 'Unauthorized: Admin access required';
  end if;

  -- Return all users with their profile data
  return query
  select
    p.user_id,
    (select u.email::text from auth.users u where u.id = p.user_id),
    p.display_name,
    p.subscription_tier,
    p.ai_credits_balance,
    coalesce(p.is_admin, false) as is_admin,
    p.created_at,
    (select u.last_sign_in_at from auth.users u where u.id = p.user_id)
  from public.profiles p
  order by p.created_at desc;
end;
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
set search_path = public
as $$
declare
  v_is_admin boolean;
begin
  -- Check if caller is admin
  select is_admin into v_is_admin
  from public.profiles
  where user_id = p_admin_user_id;

  if not coalesce(v_is_admin, false) then
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

-- Admin function to update user credits
create or replace function public.admin_update_user_credits(
  p_admin_user_id uuid,
  p_target_user_id uuid,
  p_new_balance integer
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_is_admin boolean;
begin
  -- Check if caller is admin
  select is_admin into v_is_admin
  from public.profiles
  where user_id = p_admin_user_id;

  if not coalesce(v_is_admin, false) then
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
grant execute on function public.admin_get_users(uuid) to authenticated;
grant execute on function public.admin_update_user_tier(uuid, uuid, text) to authenticated;
grant execute on function public.admin_update_user_credits(uuid, uuid, integer) to authenticated;
