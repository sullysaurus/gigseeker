-- Add enrichment tracking columns to venues
alter table public.venues
  add column if not exists last_enriched_at timestamp with time zone;

alter table public.venues
  add column if not exists enrichment_attempts integer not null default 0;

alter table public.venues
  add column if not exists enrichment_status text check (enrichment_status in ('pending', 'enriched', 'failed', null));

-- Add index for finding venues that need enrichment
create index if not exists idx_venues_enrichment_status on public.venues(enrichment_status);
create index if not exists idx_venues_last_enriched on public.venues(last_enriched_at);

-- Comment on columns
comment on column public.venues.last_enriched_at is 'Timestamp of last enrichment attempt';
comment on column public.venues.enrichment_attempts is 'Number of enrichment attempts made';
comment on column public.venues.enrichment_status is 'Current enrichment status: pending, enriched, failed, or null';
