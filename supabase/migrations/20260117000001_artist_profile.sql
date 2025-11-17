-- Artist Profile Migration
-- Store artist/band information for email templates and AI personalization

-- Create artist_profile table
create table if not exists public.artist_profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  -- Basic Info
  artist_name text not null,
  contact_name text,
  city text,
  state text,
  bio text,

  -- Genre (array for multiple genres)
  genres text[] default array[]::text[],

  -- Links
  website text,
  spotify_url text,
  instagram_url text,
  facebook_url text,
  youtube_url text,
  tiktok_url text,
  bandcamp_url text,
  soundcloud_url text,
  epk_url text,

  -- Experience
  typical_audience_size text,
  years_active integer,
  notable_venues text,
  awards_achievements text,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- One profile per user
  unique(user_id)
);

-- Enable RLS
alter table public.artist_profile enable row level security;

-- Policies
create policy "Users can view own artist profile"
  on public.artist_profile
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own artist profile"
  on public.artist_profile
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own artist profile"
  on public.artist_profile
  for update
  using (auth.uid() = user_id);

create policy "Users can delete own artist profile"
  on public.artist_profile
  for delete
  using (auth.uid() = user_id);

-- Function to update updated_at timestamp
create or replace function public.handle_artist_profile_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for updated_at
create trigger handle_artist_profile_updated_at
  before update on public.artist_profile
  for each row
  execute function public.handle_artist_profile_updated_at();

-- Grant permissions
grant all on public.artist_profile to authenticated;

-- Create index for faster lookups
create index artist_profile_user_id_idx on public.artist_profile(user_id);

-- Function to get artist profile with all fields
create or replace function public.get_artist_profile(p_user_id uuid)
returns table(
  id uuid,
  artist_name text,
  contact_name text,
  city text,
  state text,
  bio text,
  genres text[],
  website text,
  spotify_url text,
  instagram_url text,
  facebook_url text,
  youtube_url text,
  tiktok_url text,
  bandcamp_url text,
  soundcloud_url text,
  epk_url text,
  typical_audience_size text,
  years_active integer,
  notable_venues text,
  awards_achievements text
)
language sql
security definer
as $$
  select
    id,
    artist_name,
    contact_name,
    city,
    state,
    bio,
    genres,
    website,
    spotify_url,
    instagram_url,
    facebook_url,
    youtube_url,
    tiktok_url,
    bandcamp_url,
    soundcloud_url,
    epk_url,
    typical_audience_size,
    years_active,
    notable_venues,
    awards_achievements
  from public.artist_profile
  where user_id = p_user_id;
$$;
