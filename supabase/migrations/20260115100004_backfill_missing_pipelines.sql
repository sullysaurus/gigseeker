begin;

-- Backfill default pipelines for any users missing them
-- This handles cases where users signed up before the pipeline creation trigger

insert into public.pipelines (user_id, name, description, is_default)
select
  p.user_id,
  'My Pipeline',
  'Default pipeline for tracking venue outreach',
  true
from public.profiles p
where not exists (
  select 1 from public.pipelines pl
  where pl.user_id = p.user_id
  and pl.is_default = true
)
on conflict do nothing;

commit;
