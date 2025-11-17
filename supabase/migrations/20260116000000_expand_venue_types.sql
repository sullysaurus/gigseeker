-- Expand venue_type enum to support more specific venue categories
-- This allows us to preserve the exact venue type from imported data

begin;

-- Drop the existing constraint
alter table public.venues
  drop constraint if exists venues_venue_type_check;

-- Add new constraint with expanded venue types
alter table public.venues
  add constraint venues_venue_type_check
  check (venue_type in (
    'bar',
    'brewery',
    'winery',
    'club',
    'theater',
    'amphitheater',
    'stadium',
    'festival',
    'restaurant',
    'hotel',
    'coffee_shop',
    'venue',
    'other'
  ));

commit;
