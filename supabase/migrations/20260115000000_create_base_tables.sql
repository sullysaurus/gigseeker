begin;

-- =====================================================
-- PROFILES TABLE
-- =====================================================
create table if not exists public.profiles (
  user_id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  booking_email text,
  bio text,
  website text,
  location text,
  avatar_url text,
  is_admin boolean default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles
  for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = user_id);

-- Create index for performance
create index if not exists profiles_user_id_idx on public.profiles (user_id);
create index if not exists profiles_updated_at_idx on public.profiles (updated_at desc);

-- Grant permissions
grant select on public.profiles to authenticated, anon;
grant insert, update on public.profiles to authenticated;

-- =====================================================
-- VENUES TABLE
-- =====================================================
create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  website text,

  -- Location
  address text,
  city text,
  state text,
  zip_code text,
  country text default 'US',

  -- Details
  description text,
  capacity integer,
  music_focus text[], -- array of genres: Rock, Jazz, etc
  venue_type text check (venue_type in ('bar', 'club', 'theater', 'amphitheater', 'stadium', 'festival', 'other')),

  -- Booking info
  booking_email text,
  booking_phone text,
  booking_notes text,

  -- Social
  instagram_handle text,
  facebook_url text,

  -- Metadata
  venue_score integer default 50 check (venue_score >= 0 and venue_score <= 100),
  is_verified boolean default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.venues enable row level security;

-- Venues policies - public read, authenticated write
create policy "Venues are viewable by everyone"
  on public.venues
  for select
  using (true);

create policy "Authenticated users can create venues"
  on public.venues
  for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update venues"
  on public.venues
  for update
  to authenticated
  using (true);

-- Indexes for performance
create index if not exists venues_city_idx on public.venues (city);
create index if not exists venues_state_idx on public.venues (state);
create index if not exists venues_music_focus_idx on public.venues using gin (music_focus);
create index if not exists venues_venue_score_idx on public.venues (venue_score desc);
create index if not exists venues_created_at_idx on public.venues (created_at desc);

-- Full text search index
create index if not exists venues_name_idx on public.venues using gin (to_tsvector('english', name));
create index if not exists venues_description_idx on public.venues using gin (to_tsvector('english', coalesce(description, '')));

-- Grant permissions
grant select on public.venues to authenticated, anon;
grant insert, update on public.venues to authenticated;

-- =====================================================
-- PIPELINES TABLE
-- =====================================================
create table if not exists public.pipelines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  is_default boolean default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.pipelines enable row level security;

-- Pipelines policies
create policy "Users can view their own pipelines"
  on public.pipelines
  for select
  using (auth.uid() = user_id);

create policy "Users can create their own pipelines"
  on public.pipelines
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own pipelines"
  on public.pipelines
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own pipelines"
  on public.pipelines
  for delete
  using (auth.uid() = user_id);

-- Indexes
create index if not exists pipelines_user_id_idx on public.pipelines (user_id);
create index if not exists pipelines_created_at_idx on public.pipelines (created_at desc);

-- Grant permissions
grant all on public.pipelines to authenticated;

-- =====================================================
-- PIPELINE_VENUES TABLE (join table with metadata)
-- =====================================================
create table if not exists public.pipeline_venues (
  id uuid primary key default gen_random_uuid(),
  pipeline_id uuid references public.pipelines(id) on delete cascade not null,
  venue_id uuid references public.venues(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,

  -- Pipeline stage
  status text not null default 'discovered'
    check (status in ('discovered', 'approved', 'contacted', 'opened', 'responded', 'booked', 'declined', 'archived')),

  -- Priority: 1 = low, 2 = medium, 3 = high
  priority integer default 2 check (priority in (1, 2, 3)),

  -- Contact tracking
  contact_attempts integer default 0,
  last_contact_at timestamptz,
  email_opened_at timestamptz,

  -- Notes
  notes text,

  -- Metadata
  custom_fields jsonb default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Ensure venue is only added once per pipeline
  unique(pipeline_id, venue_id)
);

-- Enable RLS
alter table public.pipeline_venues enable row level security;

-- Pipeline_venues policies
create policy "Users can view their own pipeline venues"
  on public.pipeline_venues
  for select
  using (auth.uid() = user_id);

create policy "Users can create their own pipeline venues"
  on public.pipeline_venues
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own pipeline venues"
  on public.pipeline_venues
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own pipeline venues"
  on public.pipeline_venues
  for delete
  using (auth.uid() = user_id);

-- Indexes
create index if not exists pipeline_venues_pipeline_id_idx on public.pipeline_venues (pipeline_id);
create index if not exists pipeline_venues_venue_id_idx on public.pipeline_venues (venue_id);
create index if not exists pipeline_venues_user_id_idx on public.pipeline_venues (user_id);
create index if not exists pipeline_venues_status_idx on public.pipeline_venues (status);
create index if not exists pipeline_venues_priority_idx on public.pipeline_venues (priority desc);
create index if not exists pipeline_venues_created_at_idx on public.pipeline_venues (created_at desc);

-- Grant permissions
grant all on public.pipeline_venues to authenticated;

-- =====================================================
-- EMAIL_CAMPAIGNS TABLE
-- =====================================================
create table if not exists public.email_campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  pipeline_venue_id uuid references public.pipeline_venues(id) on delete set null,
  venue_id uuid references public.venues(id) on delete set null not null,

  -- Email content
  subject text not null,
  body_text text not null,
  body_html text,

  -- Recipient
  recipient_email text not null,
  recipient_name text,

  -- Sending info
  sent_at timestamptz default now(),

  -- Tracking
  status text not null default 'draft'
    check (status in ('draft', 'queued', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),

  -- Open/click tracking
  opened_at timestamptz,
  open_count integer default 0,
  clicked_at timestamptz,
  click_count integer default 0,

  -- Bounce info
  bounce_reason text,

  -- Metadata
  metadata jsonb default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.email_campaigns enable row level security;

-- Email_campaigns policies
create policy "Users can view their own email campaigns"
  on public.email_campaigns
  for select
  using (auth.uid() = user_id);

create policy "Users can create their own email campaigns"
  on public.email_campaigns
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own email campaigns"
  on public.email_campaigns
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own email campaigns"
  on public.email_campaigns
  for delete
  using (auth.uid() = user_id);

-- Indexes
create index if not exists email_campaigns_user_id_idx on public.email_campaigns (user_id);
create index if not exists email_campaigns_pipeline_venue_id_idx on public.email_campaigns (pipeline_venue_id);
create index if not exists email_campaigns_venue_id_idx on public.email_campaigns (venue_id);
create index if not exists email_campaigns_status_idx on public.email_campaigns (status);
create index if not exists email_campaigns_sent_at_idx on public.email_campaigns (sent_at desc);
create index if not exists email_campaigns_created_at_idx on public.email_campaigns (created_at desc);

-- Grant permissions
grant all on public.email_campaigns to authenticated;

-- =====================================================
-- TRIGGER: Auto-create profile on user signup
-- =====================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
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

  return new;
end;
$$;

-- Create trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- =====================================================
-- TRIGGER: Update updated_at timestamp
-- =====================================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply to all tables
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger venues_updated_at before update on public.venues
  for each row execute function public.handle_updated_at();

create trigger pipelines_updated_at before update on public.pipelines
  for each row execute function public.handle_updated_at();

create trigger pipeline_venues_updated_at before update on public.pipeline_venues
  for each row execute function public.handle_updated_at();

create trigger email_campaigns_updated_at before update on public.email_campaigns
  for each row execute function public.handle_updated_at();

commit;
