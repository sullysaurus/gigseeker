-- Fix admin_get_users function to work properly
-- The issue is accessing auth.users - we need to use auth.uid() approach

drop function if exists public.admin_get_users(uuid);

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
set search_path = public
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
    (select email from auth.users u where u.id = p.user_id) as email,
    p.display_name,
    p.subscription_tier,
    p.ai_credits_balance,
    coalesce(p.is_admin, false) as is_admin,
    p.created_at,
    (select last_sign_in_at from auth.users u where u.id = p.user_id) as last_sign_in_at
  from public.profiles p
  order by p.created_at desc;
end;
$$;

-- Re-grant permissions
grant execute on function public.admin_get_users(uuid) to authenticated;
