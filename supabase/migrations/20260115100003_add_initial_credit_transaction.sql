begin;

-- Update handle_new_user function to create initial credit transaction
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Create profile with 10 free credits
  insert into public.profiles (user_id, display_name, booking_email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.email
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
    'Welcome bonus - 10 free credits'
  );

  return new;
end;
$$;

commit;
