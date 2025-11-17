-- Seed script for 10 Raleigh, NC music venues
-- Run this in your Supabase SQL Editor or via migration

INSERT INTO venues (id, name, email, city, state, description, music_focus, venue_score, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'The Pour House Music Hall',
    'booking@pourhouseraleigh.com',
    'Raleigh',
    'NC',
    'Raleigh''s home for all things music featuring local and nationally touring bands. 20+ years showcasing rock, soul, jazz, hip-hop and Americana. Over 1,000 bands perform annually.',
    ARRAY['Rock', 'Jazz', 'Hip Hop', 'Americana', 'Indie'],
    95,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Lincoln Theatre',
    'info@lincolntheatre.com',
    'Raleigh',
    'NC',
    'Historic music venue in downtown Raleigh featuring diverse live music including rock, indie, and alternative. Intimate setting with great acoustics.',
    ARRAY['Rock', 'Indie', 'Alternative'],
    90,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'The Ritz',
    'booking@ritzraleigh.com',
    'Raleigh',
    'NC',
    'Popular 12,000-square-foot live music venue known for industrial-style space. Multiple bars, VIP seating. Hosts rock, hip-hop, and electronic music.',
    ARRAY['Rock', 'Hip Hop', 'Electronic'],
    88,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Slims Downtown',
    'slims@slimsraleigh.com',
    'Raleigh',
    'NC',
    'Downtown Raleigh''s oldest music venue (est. 1999). Authentic dive bar with 100-person capacity for intimate concerts. Weekly open mic nights and local acts.',
    ARRAY['Rock', 'Indie', 'Folk', 'Punk'],
    82,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Tin Roof',
    'raleigh@tinroof.com',
    'Raleigh',
    'NC',
    'Live music every night featuring local, regional and national acts across all genres. Great food and drinks in a fun atmosphere.',
    ARRAY['Rock', 'Country', 'Blues', 'Alternative'],
    85,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Kings',
    'booking@kings-raleigh.com',
    'Raleigh',
    'NC',
    'Premier live music venue in downtown Raleigh. Known for eclectic programming and top-notch sound system. Hosts touring acts and local favorites.',
    ARRAY['Rock', 'Indie', 'Electronic', 'Alternative'],
    92,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Red Hat Amphitheater',
    'info@redhatamphitheater.com',
    'Raleigh',
    'NC',
    'Outdoor amphitheater in Glenwood South with 5,000 capacity. Premier venue for major touring artists in an intimate downtown setting.',
    ARRAY['Rock', 'Country', 'Hip Hop', 'Alternative'],
    94,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Motorco Music Hall',
    'booking@motorcomusic.com',
    'Durham',
    'NC',
    'Just outside Raleigh in Durham. Converted garage space with industrial vibe. Hosts indie, rock, and experimental music. Great local scene.',
    ARRAY['Indie', 'Rock', 'Punk', 'Electronic'],
    87,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'The Maywood',
    'info@themaywood.com',
    'Raleigh',
    'NC',
    'Cozy neighborhood bar and music venue. Focus on local and regional acts. Great for emerging artists and intimate shows.',
    ARRAY['Indie', 'Folk', 'Americana', 'Jazz'],
    80,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Cats Cradle',
    'booking@catscradle.com',
    'Carrboro',
    'NC',
    'Legendary Triangle area venue (near Raleigh). Historic club that has hosted countless iconic acts. Essential stop for touring indie and alternative bands.',
    ARRAY['Indie', 'Rock', 'Alternative', 'Punk'],
    96,
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- Verify the insert
SELECT
  name,
  city,
  state,
  email,
  music_focus,
  venue_score
FROM venues
WHERE city IN ('Raleigh', 'Durham', 'Carrboro')
ORDER BY venue_score DESC;
