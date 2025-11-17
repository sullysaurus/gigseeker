-- Simplify venues table by removing redundant columns
-- Drop booking_email, booking_phone (use email/phone instead)
-- Drop venue_score (not needed for MVP)

begin;

-- Drop redundant booking columns
alter table public.venues
  drop column if exists booking_email,
  drop column if exists booking_phone,
  drop column if exists venue_score;

commit;
