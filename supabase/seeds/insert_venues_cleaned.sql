-- Generated Venues Insert Script
-- Cleaned and deduplicated venue data
-- Total venues: 127
-- Generated: 2025-11-17 15:03:10.700691

BEGIN;

-- Delete existing venues (optional - comment out if you want to keep existing)
-- DELETE FROM public.venues;

-- Aberdeen, NC venues (1 venues)
INSERT INTO public.venues (id, name, email, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('0167341c-6f25-4793-bcbf-bdc65bd966ef', 'The Neon Rooster', 'booking@theneonrooster.com', 'https://www.theneonrooster.com', 'Aberdeen', 'NC', 'US', 'Local music venue and bar hosting live performances.', 200, ARRAY['original', 'covers']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Apex, NC venues (3 venues)
INSERT INTO public.venues (id, name, website, city, state, zip_code, country, description, capacity, music_focus, venue_type, facebook_url, is_verified)
VALUES ('68c3f69f-fafb-4a01-9259-7e269a38240c', 'Salem Street Pub', 'https://www.salemstreetpub.com', 'Apex', 'NC', '27502', 'USA', 'Family-owned pub featuring Saturday night live music in Moonshine Room.', 100, ARRAY['rock', 'country', 'blues', 'folk']::text[], 'bar', 'https://www.facebook.com/p/Salem-Street-Pub-100063627880342', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('ce7b2c02-21dd-41bb-93e2-52c23b764c76', 'Abbey Road Tavern & Grill', 'info@abbeyroadnc.com', '919-267-9976', 'https://www.abbeyroadnc.com', 'Apex', 'NC', 'US', 'Restaurant and bar featuring live music on weekends.', 150, ARRAY['covers', 'rock', 'blues', 'country']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('bec59e3d-1917-438a-94e2-dc3f56d8a979', 'Southern Peak Brewery', 'events@southernpeakbrewery.com', '919-267-7766', 'https://www.southernpeakbrewery.com', 'Apex', 'NC', 'US', 'Craft brewery with outdoor stage hosting live music events.', 150, ARRAY['singer songwriter', 'indie', 'folk', 'acoustic']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Asheville, NC venues (12 venues)
INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('11a5f26d-5463-4408-ac80-7d6830af0ffc', 'Asheville Music Hall', 'booking@ashevillemusichall.com', '828-772-2033', 'https://www.ashevillemusichall.com', 'Asheville', 'NC', 'US', 'Multi-level music venue in downtown Asheville featuring diverse acts.', 500, ARRAY['rock', 'jam band', 'bluegrass', 'original']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('caffd7d9-cf22-442d-bef2-4264d33976c0', 'Eulogy (AVL)', 'booking@eulogyavl.com', 'https://www.eulogyavl.com', 'Asheville', 'NC', 'US', 'Intimate venue and bar in West Asheville hosting local and touring acts.', 200, ARRAY['original', 'rock', 'blues', 'country', 'covers']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, instagram_handle, facebook_url, is_verified)
VALUES ('2a266472-f2e1-4780-87af-fbc10af29c60', 'The Orange Peel', 'info@theorangepeel.net', '828-398-1837', 'https://theorangepeel.net', '101 Biltmore Avenue', 'Asheville', 'NC', '28801', 'USA', 'Named one of top 5 rock clubs in nation by Rolling Stone, premier Asheville music venue since reopening in 2002.', 1050, ARRAY['bluegrass', 'electronic', 'hip-hop', 'indie', 'rock', 'alternative', 'indie', 'jam band', 'original', 'rock']::text[], 'other', 'National Booking: AC Entertainment - info@acentertainment.com', '@the_orange_peel', 'https://www.facebook.com/TheOrangePeelAsheville', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  instagram_handle = EXCLUDED.instagram_handle,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, instagram_handle, facebook_url, is_verified)
VALUES ('8c723225-9a65-40c3-8e35-7c241bfb7bf2', 'Grey Eagle', '828-232-5800', 'https://www.thegreyeagle.com', '185 Clingman Avenue', 'Asheville', 'NC', '28801', 'USA', 'Asheville''s longest-running all-ages venue in River Arts District, features roomy outdoor patio.', 550, ARRAY['bluegrass', 'folk', 'rock', 'americana', 'jazz']::text[], 'other', '250 seated / 550 SRO capacity', '@thegreyeagle', 'https://facebook.com/greyeagleasheville', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  instagram_handle = EXCLUDED.instagram_handle,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, facebook_url, is_verified)
VALUES ('3889461d-5d3f-4d1c-ba6a-9409b4832e92', 'Highland Brewing Company', '828-299-3370', 'https://highlandbrewing.com', '12 Old Charlotte Highway, Suite 200', 'Asheville', 'NC', '28803', 'USA', 'Asheville''s original craft brewery with indoor/outdoor stages, live music 5x per week.', 450, ARRAY['rock', 'bluegrass', 'folk', 'americana']::text[], 'bar', 'Features 2 stages - indoor and outdoor meadow. Space for thousands of visitors.', 'https://www.facebook.com/HighlandBrewingCompany', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, facebook_url, is_verified)
VALUES ('731b57f6-787f-490f-9045-735270cf3168', 'Salvage Station', '828-407-0521', 'https://salvagestation.com', '466 Riverside Drive', 'Asheville', 'NC', '28801', 'USA', 'Outdoor music venue in River Arts District. Currently closed due to Hurricane Helene damage and I-26 connector project.', 500, ARRAY['rock', 'bluegrass', 'jam bands', 'folk']::text[], 'other', 'Venue currently closed. Contact for future booking information.', 'https://www.facebook.com/SalvageStation', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, facebook_url, is_verified)
VALUES ('736a596a-19d3-46da-a3db-7c4732dd6d2e', 'Wortham Center for the Performing Arts', 'info@worthamarts.org', '828-257-4530', 'https://www.worthamarts.org', '18 Biltmore Avenue', 'Asheville', 'NC', '28801', 'USA', 'Three-venue complex in Pack Square: Diana Wortham Theatre, Tina McGuire Theatre, Henry LaBrun Studio.', 500, ARRAY['classical', 'jazz', 'world', 'folk']::text[], 'other', 'https://www.facebook.com/worthamarts', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('fd7ca5c1-21dd-4233-8b7f-aedba4085054', 'Eulogy at Burial Beer', 'info@eulogyavl.com', 'https://eulogyavl.com', '10 Buxton Avenue', 'Asheville', 'NC', '28801', 'USA', 'Mid-sized live music venue by Burial Beer Co., full bar with cocktails, beer, wine, non-alcoholic options.', 400, ARRAY['rock', 'indie', 'electronic', 'hip-hop']::text[], 'other', '@eulogyavl', 'https://www.facebook.com/eulogyavl', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  instagram_handle = EXCLUDED.instagram_handle,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, is_verified)
VALUES ('ca9ed90b-157e-4b0a-9838-d46453ea466d', 'New Belgium Brewing', '828-333-6900', 'https://www.newbelgium.com/visit/asheville', '21 Craven Street', 'Asheville', 'NC', '28806', 'USA', 'Large brewery along French Broad River in River Arts District, regular live music events.', 300, ARRAY['rock', 'folk', 'americana', 'bluegrass']::text[], 'bar', 'Free 90-minute brewery tours require reservations.', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('41d3a190-c93d-4abb-8f19-b3b0f093969b', 'The Funkatorium', 'funkatorium@wickedweedbrewing.com', '828-552-3203', 'https://www.wickedweedbrewing.com/location/funkatorium', '147 Coxe Avenue', 'Asheville', 'NC', '28801', 'USA', 'Wicked Weed''s sour and funky beer dedicated taproom in South Slope, East Coast''s first sour beer taproom.', 150, ARRAY['jazz', 'funk', 'soul']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('21765da1-dd45-431d-9ac7-15ca57344d34', 'One World Brewing West', '828-575-9992', 'https://oneworldbrewing.com', '520 Haywood Road', 'Asheville', 'NC', '28806', 'USA', 'West Asheville brewery with spacious outdoor stage, seating, and bar area.', 200, ARRAY['rock', 'folk', 'bluegrass']::text[], 'bar', '@oneworldbrewing', 'https://www.facebook.com/oneworldbrewingwest', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  instagram_handle = EXCLUDED.instagram_handle,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, website, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, is_verified)
VALUES ('d158895b-8f30-47b1-b57b-4569a6f1e45e', 'Biltmore Winery', 'https://www.biltmore.com/visit/winery', 'Asheville', 'NC', '28803', 'USA', 'America''s most visited winery on Biltmore Estate, live music on Scholar''s Walk and Friday afternoons.', 300, ARRAY['jazz', 'classical', 'folk']::text[], 'bar', '40th Anniversary in 2025. Open 365 days a year.', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  is_verified = EXCLUDED.is_verified;

-- Black Mountain, NC venues (1 venues)
INSERT INTO public.venues (id, name, website, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, is_verified)
VALUES ('db0d096b-f709-4274-880b-2c8ab08f92e0', 'Pisgah Brewing Company', 'https://www.pisgahbrewing.com', 'Black Mountain', 'NC', '28711', 'USA', 'Brewery with indoor taproom stages and outdoor concert venue, extensive event programming.', 500, ARRAY['bluegrass', 'rock', 'jam bands', 'folk']::text[], 'bar', 'Currently booking for 2025 outdoor Spring & Summer concerts.', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  is_verified = EXCLUDED.is_verified;

-- Boone, NC venues (2 venues)
INSERT INTO public.venues (id, name, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('02f88fc1-f649-4dd9-bfe9-00845bebb00a', 'Appalachian Theatre', '559 W King Street', 'Boone', 'NC', '28607', 'USA', 'Historic theatre in downtown Boone hosting concerts and performances.', 629, ARRAY['folk', 'bluegrass', 'rock', 'classical']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, website, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('d657385d-4aee-4396-9fae-464977b801f8', 'Schaefer Center for the Performing Arts', 'https://schaefercenter.appstate.edu', 'Boone', 'NC', '28608', 'USA', 'Appalachian State University''s premier performance venue with orchestra and balcony seating.', 1664, ARRAY['classical', 'jazz', 'world', 'folk']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Bynum, NC venues (1 venues)
INSERT INTO public.venues (id, name, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('6dccc9f9-ae73-4d6f-afbb-6941b2d6a027', 'Bynum Front Porch', '919-542-0394', 'http://www.bynumfrontporch.org', '950 Bynum Road', 'Bynum', 'NC', '27228', 'USA', 'Music series, storytelling, and bluegrass jam sessions at historic general store.', 100, ARRAY['bluegrass', 'folk', 'americana', 'storytelling']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Carrboro, NC venues (3 venues)
INSERT INTO public.venues (id, name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, is_verified)
VALUES ('1963f54e-4127-48bd-b3d0-708a26f06774', 'Cats Cradle', 'booking@catscradle.com', '919-967-9053', 'https://catscradle.com', '300 E Main Street', 'Carrboro', 'NC', '27510', 'US', 'Legendary Triangle area venue (near Raleigh). Historic club that has hosted countless iconic acts. Essential stop for touring indie and alternative bands.', 750, ARRAY['alternative', 'electronic', 'indie', 'punk', 'rock']::text[], 'other', 'ONLY accept booking via email to booking@catscradle.com', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, facebook_url, is_verified)
VALUES ('2e25cf4d-b9ea-4702-bd8f-966c338e980c', 'The ArtsCenter', 'info@artscenterlive.org', '919-929-2787', 'https://artscenterlive.org', '400 Roberson Street', 'Carrboro', 'NC', '27510', 'USA', '501(c)(3) Arts Education non-profit with two performance spaces, art gallery, and year-round programming.', 355, ARRAY['jazz', 'folk', 'world', 'classical']::text[], 'other', 'Earl & Rhoda Wynn Theater: 355 capacity; West End Theater: 106 capacity', 'https://www.facebook.com/theartscentercarrboro', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('fcfc65b7-8cfd-4f1a-a16c-b1073a386e97', 'Steel String Brewery', 'info@steelstringbrewery.com', '919-240-7215', 'https://www.steelstringbrewery.com', 'Carrboro', 'NC', 'US', 'Craft brewery with regular live music performances.', 125, ARRAY['singer songwriter', 'indie', 'folk', 'acoustic']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Cary, NC venues (4 venues)
INSERT INTO public.venues (id, name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, facebook_url, is_verified)
VALUES ('66cdb90e-5dbc-4798-b45d-a2349beea482', 'Koka Booth Amphitheatre', 'info@boothamp.com', '919-462-2052', 'https://www.boothamphitheatre.com', '8003 Regency Parkway', 'Cary', 'NC', '27518', 'USA', 'Premier outdoor performing arts venue by Symphony Lake, seating on lawn and Crescent Deck.', 7000, ARRAY['classical', 'rock', 'pop', 'country', 'jazz']::text[], 'amphitheater', 'Box Office: 919-462-2025, Tickets: 800-514-3849', 'https://www.facebook.com/BoothAmphitheatre', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('b6e10b6b-21b0-48a5-afff-e87933eaa09f', 'Bond Bros.', 'events@bondbrothersbeer.com', '919-342-2739', 'https://www.bondbrothersbeer.com', 'Cary', 'NC', 'US', 'Original Bond Brothers location with live music and food trucks.', 200, ARRAY['acoustic', 'folk', 'indie', 'singer songwriter']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('91e31189-89a4-4035-8357-4bef95a15455', 'Fortnight Brewing', 'info@fortnightbrewing.com', '919-373-1161', 'https://www.fortnightbrewing.com', 'Cary', 'NC', 'US', 'Craft brewery with outdoor space hosting live music.', 150, ARRAY['singer songwriter', 'indie', 'folk', 'acoustic']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('e999ab41-a22f-467d-a4d4-f4336dc6dff5', 'The Cary Theater', 'info@thecarytheater.com', '919-462-2051', 'https://www.thecarytheater.com', 'Cary', 'NC', 'US', 'Historic downtown theater hosting concerts, films, and performing arts.', 300, ARRAY['original', 'covers']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Chapel Hill, NC venues (5 venues)
INSERT INTO public.venues (id, name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, facebook_url, is_verified)
VALUES ('849220e1-1e26-49aa-8159-757596340226', 'Local 506', 'booking@local506.com', '919-942-5506', 'https://local506.com', '506 W Franklin Street', 'Chapel Hill', 'NC', '27516', 'USA', 'Dedicated live music venue operating since 1992 in downtown Chapel Hill.', 200, ARRAY['rock', 'indie', 'alternative', 'punk']::text[], 'other', 'Call after 7 PM. Email booking@local506.com or glenn@local506.com', 'https://www.facebook.com/Local506', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('f85ea1f6-1477-4508-bab9-a0b9e1fe83c7', 'The Cave', '984-234-0293', 'https://caverntavern.com', '452 1/2 W Franklin Street', 'Chapel Hill', 'NC', '27516', 'USA', 'Chapel Hill''s oldest bar and music venue, established 1968, featuring music almost nightly.', 150, ARRAY['rock', 'indie', 'alternative', 'punk']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, website, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, is_verified)
VALUES ('66a630cc-183d-4c0e-b980-49c4876eee35', 'He''s Not Here', 'henry@southendentertains.com', 'https://hesnotherenc.com', 'Chapel Hill', 'NC', '27516', 'USA', 'Chapel Hill''s legendary bar, home of the Blue Cup, with live music on weekends.', 200, ARRAY['rock', 'pop', 'country']::text[], 'bar', 'Contact henry@southendentertains.com for bookings.', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('81c505e3-0338-42b1-8a0e-3c83ef39717c', 'Top of the Hill', '919-929-8676', 'https://www.thetopofthehill.com', '100 East Franklin Street', 'Chapel Hill', 'NC', '27514', 'USA', 'Restaurant and brewery featuring live music in their Back Bar venue.', 150, ARRAY['rock', 'jazz', 'blues']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('edded298-bd35-4601-b51c-2f7f40c276e3', 'Fridays on the Front Porch (Carolina Inn)', 'events@carolinainn.com', '919-918-2777', 'https://www.carolinainn.com', 'Chapel Hill', 'NC', 'US', 'Weekly outdoor concert series at historic Carolina Inn.', 200, ARRAY['singer songwriter', 'rock', 'indie', 'alternative', 'original']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Charlotte, NC venues (17 venues)
INSERT INTO public.venues (id, name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, instagram_handle, facebook_url, is_verified)
VALUES ('3e4d23a1-7cb6-46d3-9191-9ae1e2f97699', 'The Fillmore Charlotte', 'FillmoreCLT.info@livenation.com', '980-266-6454', 'https://www.fillmorenc.com', '820 Hamilton Street', 'Charlotte', 'NC', '28206', 'USA', 'Multi-level music venue housed in a 100-year-old fiber mill, part of the NC Music Factory entertainment complex.', 2000, ARRAY['rock', 'alternative', 'indie', 'hip-hop', 'electronic']::text[], 'other', 'Operated by Live Nation. Contact for private events and bookings.', '@fillmorenc', 'https://www.facebook.com/FillmoreNC', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  instagram_handle = EXCLUDED.instagram_handle,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, instagram_handle, facebook_url, is_verified)
VALUES ('342ca5b1-db1f-493c-b27c-b46bdfb68d67', 'Neighborhood Theatre', 'booking@neighborhoodtheatre.com', '704-942-7997', 'https://neighborhoodtheatre.com', '511 E 36th Street', 'Charlotte', 'NC', '28205', 'USA', 'Charlotte''s premier independent music venue since 1997, located in the NoDa Art District with unique multi-tiered seating.', 1000, ARRAY['alternative', 'electronic', 'hip-hop', 'indie', 'rock', 'indie', 'metal', 'original', 'punk', 'rock']::text[], 'other', 'Email booking@neighborhoodtheatre.com for booking inquiries.', '@neighborhoodtheatre', 'https://www.facebook.com/NeighborhoodTheatre', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  instagram_handle = EXCLUDED.instagram_handle,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, instagram_handle, facebook_url, is_verified)
VALUES ('3a8ce4d3-65ef-4e55-8b68-6e210ca9bf9f', 'Amos'' Southend', 'booking@amossouthend.com', '704-595-7585', 'https://amossouthend.com', '1423 S Tryon Street', 'Charlotte', 'NC', '28203', 'USA', 'Popular live music venue in South End featuring local and touring artists.', 500, ARRAY['alternative', 'blues', 'country', 'indie', 'rock', 'covers', 'original']::text[], 'other', 'Contact booking@amossouthend.com for booking opportunities.', '@amossouthend', 'https://www.facebook.com/amossouthend', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  instagram_handle = EXCLUDED.instagram_handle,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, is_verified)
VALUES ('2142cc50-6dcb-469a-9e54-6105eeeb3ee1', 'The Evening Muse', 'booking@eveningmuse.com', '704-376-3737', 'https://www.eveningmuse.com', '3227 N Davidson Street', 'Charlotte', 'NC', '28205', 'USA', 'Intimate listening room in NoDa Arts District, specializing in original music across multiple genres.', 150, ARRAY['americana', 'blues', 'folk', 'jazz', 'singer-songwriter', 'alternative', 'indie', 'original', 'rock', 'singer songwriter']::text[], 'other', 'Email with requested date and band name in subject line. Original bands only, no cover bands.', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('824d9bf1-7e75-4fc9-ac2a-31adde3e0ccd', 'Visulite Theatre', 'https://visulite.com', '1615 Elizabeth Avenue', 'Charlotte', 'NC', '28204', 'USA', 'Historic theatre in Elizabeth neighborhood with unique multi-tiered stage and seating arrangement.', 540, ARRAY['rock', 'indie', 'alternative', 'electronic']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, website, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, is_verified)
VALUES ('9ef78be4-d128-4f71-ae00-af400aab425b', 'Snug Harbor', 'https://snugrock.com', 'Charlotte', 'NC', '28205', 'USA', 'Plaza Midwood live music club with pirate-themed decor, showcasing local talent since 2007.', 150, ARRAY['rock', 'alternative', 'indie', 'metal']::text[], 'bar', 'Shows typically start at 9 PM. Karaoke Thursdays and Sundays.', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, is_verified)
VALUES ('e322cb7c-f17e-415a-9270-b68cfe1aa9dc', 'Petra''s Bar', 'https://petrasbar.com', '1919 Commonwealth Avenue', 'Charlotte', 'NC', '28203', 'USA', 'Piano bar and cabaret in Plaza Midwood featuring live piano performances.', 100, ARRAY['piano bar', 'cabaret', 'jazz']::text[], 'bar', '@petrasbar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  instagram_handle = EXCLUDED.instagram_handle,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, instagram_handle, is_verified)
VALUES ('53d2e89d-662b-4d24-8bb5-c8a5748e73fb', 'NoDa Brewing Company', '704-900-6851', 'https://www.nodabrewing.com', '150 W 32nd Street', 'Charlotte', 'NC', '28206', 'USA', 'Award-winning brewery with spacious indoor/outdoor areas, featuring Live Music Fridays.', 300, ARRAY['rock', 'indie', 'folk', 'country']::text[], 'bar', 'Regularly scheduled live music at North End location.', '@nodabrewing', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  instagram_handle = EXCLUDED.instagram_handle,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, website, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, is_verified)
VALUES ('dd79d393-1587-4301-a492-b134e495a150', 'Triple C Brewing Company', 'https://www.triplecbrewing.com', 'Charlotte', 'NC', '28203', 'USA', 'South End brewery featuring live music on Saturdays and open mic nights.', 200, ARRAY['rock', 'folk', 'americana', 'indie']::text[], 'bar', 'Check website calendar for live music schedule.', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('cd53e3e3-3ee5-4aac-a416-cbe78ce9450d', 'Sycamore Brewing', 'https://sycamorebrewing.com', '2161 Hawkins Street', 'Charlotte', 'NC', '28203', 'USA', '21,000 square foot taproom with indoor and outdoor spaces hosting regular live music events.', 450, ARRAY['rock', 'indie', 'electronic', 'folk']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, website, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('a1dc9eab-7bc6-4cb4-a1ef-7cb720d41935', 'Protagonist Beer', 'https://protagonistbeer.com', 'Charlotte', 'NC', '28205', 'USA', 'NoDa brewery with production facility and New York style pizza, hosting live music events.', 200, ARRAY['indie', 'rock', 'folk']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, facebook_url, is_verified)
VALUES ('c66541db-55fa-4d84-9dfe-dee91d61a9aa', 'Growlers Pourhouse', '704-910-6566', 'https://growlerspourhouse.com', '3120 North Davidson Street', 'Charlotte', 'NC', '28205', 'USA', 'NoDa beer bar featuring craft beers and live music.', 150, ARRAY['rock', 'blues', 'country']::text[], 'bar', 'https://www.facebook.com/GrowlersPourHouse', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, facebook_url, is_verified)
VALUES ('c0d1ca99-96dc-4e0b-9613-c02a5894efa4', 'QC Pour House', '980-219-7303', 'https://www.qcpourhouse.com', '200 W Tremont Avenue #101', 'Charlotte', 'NC', '28203', 'USA', 'Craft beer bar featuring live music.', 150, ARRAY['rock', 'blues', 'country']::text[], 'bar', 'https://www.facebook.com/qcpourhouse', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('cb4e7e13-b31d-40c5-a2e1-1cb40b536a75', 'The Comedy Zone', 'https://www.cltcomedyzone.com', '900 N Carolina Music Factory Boulevard', 'Charlotte', 'NC', '28206', 'USA', 'Full service comedy theater and special event facility in NC Music Factory basement.', 400, ARRAY['comedy']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, is_verified)
VALUES ('c75fe069-ebd9-4c4b-858b-46d78db48111', 'U.S. National Whitewater Center', 'https://usnwc.org', '5000 Whitewater Center Parkway', 'Charlotte', 'NC', '28214', 'USA', 'Outdoor adventure center hosting free River Jam concerts Thursday-Saturday evenings May-September.', 2000, ARRAY['americana', 'bluegrass', 'folk', 'funk', 'rock']::text[], 'amphitheater', 'River Jam concerts 7-10 PM, parking $12.', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('7b44888e-26d4-4e46-b755-a619f7f05fcf', 'The Music Yard', 'booking@themusicyard.com', '704-445-9273', 'https://www.themusicyard.com', 'Charlotte', 'NC', 'US', 'Outdoor music venue with covered stage and full bar.', 400, ARRAY['original', 'covers']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('8f4ee7e7-080a-4a1f-b523-581935a42730', 'Visulite Theater', 'info@visulitetheatre.com', '704-358-9200', 'https://www.visulitetheatre.com', 'Charlotte', 'NC', 'US', 'Historic theater in Elizabeth neighborhood hosting concerts and events.', 700, ARRAY['original', 'rock', 'indie', 'alternative']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Clayton, NC venues (1 venues)
INSERT INTO public.venues (id, name, email, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('28a1455a-18e0-44c6-af31-ce68c1e97c84', 'First Street Tavern', 'info@firststreettavern.com', 'https://www.firststreettavern.com', 'Clayton', 'NC', 'US', 'Local tavern featuring live music and community events.', 150, ARRAY['singer songwriter', 'rock', 'blues', 'country', 'covers']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Cornelius, NC venues (1 venues)
INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('833489c6-fe21-4a9f-a1ac-fafdbfa1dc54', 'Boatyard', 'events@boatyardlkn.com', '704-896-9266', 'https://www.boatyardlkn.com', 'Cornelius', 'NC', 'US', 'Lakeside restaurant and bar with live music on the waterfront.', 200, ARRAY['covers', 'rock', 'indie', 'alternative', 'original']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Durham, NC venues (13 venues)
INSERT INTO public.venues (id, name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, instagram_handle, is_verified)
VALUES ('35bff74f-3d97-4e4d-b9d8-6298bf4cae5f', 'Motorco Music Hall', 'booking@motorcomusic.com', '919-901-0875', 'https://motorcomusic.com', '723 Rigsbee Avenue', 'Durham', 'NC', '27701', 'US', 'Just outside Raleigh in Durham. Converted garage space with industrial vibe. Hosts indie, rock, and experimental music. Great local scene.', 450, ARRAY['electronic', 'hip-hop', 'indie', 'punk', 'rock']::text[], 'other', 'Email is best way to communicate.', '@motorcomh', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  instagram_handle = EXCLUDED.instagram_handle,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, facebook_url, is_verified)
VALUES ('b849695d-5cbf-4de6-b4f4-26e55674563d', 'The Fruit', 'durhamfruit@gmail.com', 'https://www.durhamfruit.com', '305 S Dillard Street', 'Durham', 'NC', '27701', 'USA', '22,000 sqft warehouse complex, voted ''Best Place to Dance'' in Triangle, multi-stage concert and arts venue.', 500, ARRAY['electronic', 'hip-hop', 'dance', 'indie']::text[], 'other', 'https://www.facebook.com/305sdillardst', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('17783a77-57ca-4833-ac17-3b25942ed844', 'The Pinhook', '117 W Main Street', 'Durham', 'NC', '27701', 'USA', 'Durham''s premier live music and event space with great sound, stage lighting, projector, and live-stream capabilities.', 250, ARRAY['indie', 'rock', 'punk', 'electronic']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('510dd0ff-515c-4699-9210-1a635175ea84', 'Rubies on Five Points', '919-381-4349', 'https://rubiesnc.com', '347B W Main Street', 'Durham', 'NC', '27701', 'USA', 'Live music venue, bar and event space in downtown Durham.', 90, ARRAY['jazz', 'blues', 'rock', 'indie']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, is_verified)
VALUES ('7ddace13-0dfa-412c-9ebe-d62c45caf459', 'Bull City Ciderworks', 'Durham.Taproom@BullCityCiderworks.com', '919-237-2357', 'https://bullcityciderworks.com', '305 S Roxboro Street', 'Durham', 'NC', '27701', 'USA', 'Cidery taproom hosting regular events and live music throughout the year.', 150, ARRAY['folk', 'indie', 'acoustic']::text[], 'bar', 'Check Facebook and Instagram for event updates.', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, facebook_url, is_verified)
VALUES ('4c3948a3-9ccd-4d36-91fc-8c9b156e5539', 'Cocoa Cinnamon', 'Engage@CocoaCinnamon.com', '919-697-8990', 'https://cocoacinnamon.square.site', '420 West Geer Street', 'Durham', 'NC', '27701', 'USA', 'Coffee shop occasionally hosting live music and community events.', 75, ARRAY['jazz', 'folk', 'acoustic']::text[], 'other', 'https://www.facebook.com/CCHillsboroughRoad', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('920b8d80-7929-4f26-8950-85c3c5bd9acd', 'Clouds Brewing', 'info@cloudsbrewing.com', '919-682-2568', 'https://www.cloudsbrewing.com', 'Durham', 'NC', 'US', 'Downtown Durham brewery with regular live music and food options.', 200, ARRAY['singer songwriter', 'indie', 'folk', 'acoustic']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('9c1aaef3-fd5a-430b-9cbf-4eb937d0c959', 'Durham Beer Garden', 'info@durhambeergarden.com', 'https://www.durhambeergarden.com', 'Durham', 'NC', 'US', 'Outdoor beer garden with live music and rotating food trucks.', 300, ARRAY['singer songwriter', 'rock', 'indie', 'alternative', 'original']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('c825222c-2c19-4a8e-b830-0235cdd4435c', 'Glass Jug Beer Lab', 'events@glassjugbeerlab.com', '919-680-8466', 'https://www.glassjugbeerlab.com', 'Durham', 'NC', 'US', 'Craft brewery in downtown Durham hosting live music and events.', 150, ARRAY['original', 'singer songwriter']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('404ed402-2ec3-4fdb-9ec5-9b94c8ea925d', 'Growler Grlz', 'info@growlergrlz.com', 'https://www.growlergrlz.com', 'Durham', 'NC', 'US', 'Craft beer bar and bottle shop with live music events.', 100, ARRAY['singer songwriter', 'rock', 'blues', 'country', 'covers']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('6bc14caa-3495-4a0d-b2a3-07e81ab651ed', 'Motorco', 'artist@motorcomusic.com', '919.901.0875', 'https://motorcomusic.com/', 'Durham', 'NC', 'US', 'Premier music hall in Durham featuring multiple spaces including a showroom, garage bar, and outdoor patio. Full bar and restaurant with diverse programming.', 400, ARRAY['rock', 'indie', 'alternative', 'original']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('e523507d-26e2-421b-a4ef-ada338ed0cf9', 'The Streets at Southpoint (Music on Main)', 'events@streetsatsouthpoint.com', '919-572-8808', 'https://www.streetsatsouthpoint.com', 'Durham', 'NC', 'US', 'Outdoor concert series at shopping center featuring local and regional acts.', 500, ARRAY['original', 'covers']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, music_focus, venue_type, is_verified)
VALUES ('d1d04b23-709b-46e4-a8e2-fc395779a431', 'Zinchouse', 'info@zinchouse.com', '(833) 494-9463', 'https://www.zinchouse.com/', 'Durham', 'NC', 'US', 'Experience the best of the Triangle winery and brewery good times at ZincHouse, nestled on 87 acres of vineyards and treetop views, offering adults 21+a wide beverage selection of 400+ exquisite wines, our own ZincHouse and local brewery’s craft beers, and a robust offering of bourbon and cigars. The story of our farm and vision continues and grows in 2024!

Open Wednesday – Sunday and featuring live music and food trucks, ZincHouse is the best of good times in the Triangle. See our FAQs.

Step inside one of the three floors of our main building – the ZincHouse. Or sit on the Veranda near the vineyards and take in the beauty, Next door at the beautiful Pavilion, a music stage and the Z-House of Bourbon & Cigar Bar awaits. Two smoking verandas outside the back also feature firepits and the same captivating views. Our Carriage House, nestled in privacy, hosts public dinners, tastings and events.

Our calendar is updated monthly with our live music, food trucks, ticketed events and festivals.
Welcome to ZincHouse. The Triangle areas premier destination.', ARRAY['original', 'covers']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Fayetteville, NC venues (1 venues)
INSERT INTO public.venues (id, name, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, facebook_url, is_verified)
VALUES ('b55ba6cc-dc17-4fa5-961b-a17c63035bb0', 'Paddy''s Irish Public House', '910-568-5654', 'https://paddysirishpub.com', '2606 Raeford Road, Suite B', 'Fayetteville', 'NC', '28303', 'USA', 'Award-winning Irish pub and premier music venue/dance club. Live music Thu-Sat.', 200, ARRAY['rock', 'country', 'blues', 'irish']::text[], 'bar', 'Hours: Wed-Sat 6pm-2am', 'https://www.facebook.com/paddyspubnc', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

-- Fuquay-Varina, NC venues (1 venues)
INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('6d8354e1-5b8b-4490-a44b-64c1161aa055', 'Mason Jar Lager Company', 'events@masonjarlagers.com', '919-552-0550', 'https://www.masonjarlagers.com', 'Fuquay-Varina', 'NC', 'US', 'Lager-focused brewery with outdoor space for live music.', 200, ARRAY['singer songwriter', 'indie', 'folk', 'acoustic']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Greensboro, NC venues (5 venues)
INSERT INTO public.venues (id, name, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, is_verified)
VALUES ('da41a458-c9f0-4c00-be5d-20f59c68ab41', 'Carolina Theatre', '336-333-2600', 'https://carolinatheatre.com', '310 South Greene Street', 'Greensboro', 'NC', '27401', 'USA', 'Historic theatre with 793 orchestra seats and 302 mezzanine seats, available for rentals.', 1130, ARRAY['classical', 'jazz', 'rock', 'folk']::text[], 'other', 'Box Office: Mon-Fri noon-3pm, 30 min before performances', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, facebook_url, is_verified)
VALUES ('c843d650-3f93-4fd3-83c2-666df7444454', 'Flat Iron', 'theflatironproduction@gmail.com', 'https://flatirongso.com', '221 Summit Avenue', 'Greensboro', 'NC', '27401', 'USA', 'Live music venue and cocktail bar. Shows Tue-Sun, Wed and Sun reserved for residencies.', 250, ARRAY['blues', 'indie', 'jazz', 'rock', 'blues', 'country', 'covers', 'original', 'rock']::text[], 'bar', 'Also email: abbeyspoon.flatiron@gmail.com', 'https://www.facebook.com/flatirongso', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, phone, website, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('26ac0a59-992f-4931-a5e9-22a8203a3134', 'Hangar 1819', '336-579-6480', 'https://hangar1819.com', 'Greensboro', 'NC', '27403', 'USA', 'Live music venue with capacity up to 7 nights per week.', 529, ARRAY['rock', 'indie', 'country', 'electronic']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('bb4ecd4e-cd58-4532-ba92-83bc6e2d7efa', 'Dirty Dan''s Bar', 'booking@dirtydansbar.com', 'https://www.facebook.com/dirtydansbar', 'Greensboro', 'NC', 'US', 'Dive bar and music venue hosting local and touring acts.', 250, ARRAY['original', 'rock', 'blues', 'country', 'covers']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('4d123bd8-372e-42e5-8851-2b28cd407c9a', 'The Grand GSO', 'info@thegrandgso.com', '336-272-4663', 'https://www.thegrandgso.com', 'Greensboro', 'NC', 'US', 'Historic theater in downtown Greensboro hosting concerts and events.', 1000, ARRAY['tribute', 'rock', 'indie', 'alternative', 'original']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Greenville, NC venues (6 venues)
INSERT INTO public.venues (id, name, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('f0095e0a-2e17-45cf-9120-9a75d845020e', 'Pitt Street Brewing Company', 'Greenville', 'NC', '27858', 'USA', 'Housed in historic restored Coca-Cola bottling plant near ECU, traditional to experimental brews.', 200, ARRAY['rock', 'folk', 'blues']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('56b8be49-3427-4c85-a128-755c378c5fe0', 'AJ McMurphy''s', 'info@ajmcmurphys.com', '252-551-9627', 'https://www.ajmcmurphys.com', 'Greenville', 'NC', 'US', 'Irish pub and restaurant with live music on weekends.', 250, ARRAY['singer songwriter', 'covers']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('1a336edc-758f-45d1-9676-0724cb88a269', 'Buccaneer Music Hall', 'booking@buccaneermusichall.com', 'https://www.buccaneermusichall.com', 'Greenville', 'NC', 'US', 'Mid-sized venue hosting national and regional touring acts.', 700, ARRAY['original', 'covers']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('313c31a1-4d73-40c0-9ff5-229c67879ea6', 'Pantana Bob''s', 'info@pantanabobs.com', '252-757-1777', 'https://www.pantanabobs.com', 'Greenville', 'NC', 'US', 'College town bar featuring live music and DJ nights.', 350, ARRAY['covers', 'rock', 'blues', 'country']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('78b13aa0-5659-4bea-b09d-aca633c01b0d', 'State Theatre', 'info@statetheatrenc.com', '252-208-7779', 'https://www.statetheatrenc.com', 'Greenville', 'NC', 'US', 'Historic theater hosting concerts, comedy, and special events.', 500, ARRAY['original', 'covers']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('43efcb44-f060-4659-96f6-6c2c46bc0f0b', 'Uptown Brewing Company', 'Greenville', 'NC', '27858', 'USA', 'Spacious taproom brewing traditional to innovative beers.', 200, ARRAY['rock', 'country', 'blues']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Hickory, NC venues (2 venues)
INSERT INTO public.venues (id, name, website, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('b34089d7-50f2-47e9-80d4-1962dab68028', 'Hickory Premier', 'https://www.hickorypremier.com', 'Hickory', 'NC', '28601', 'USA', '8,000 sqft indoor venue with bar, state of art sound and lighting.', 600, ARRAY['rock', 'country', 'hip-hop']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('a2f85d09-5c02-4d4b-98e6-d9c13afb10a2', 'Olde Hickory Tap Room', '828-322-1965', 'https://oldehickorytaproom.com', '222 Union Square', 'Hickory', 'NC', '28601', 'USA', 'Taproom featuring live music events.', 150, ARRAY['rock', 'blues', 'country']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Hope Mills, NC venues (1 venues)
INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('2bde05f1-7e65-4177-85a6-80b4bd709422', 'Dirtbag Ales', 'events@dirtbagales.com', '910-426-9016', 'https://www.dirtbagales.com', 'Hope Mills', 'NC', 'US', 'Craft brewery with outdoor space hosting live music and food trucks.', 200, ARRAY['singer songwriter', 'indie', 'folk', 'acoustic']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Jacksonville, NC venues (1 venues)
INSERT INTO public.venues (id, name, website, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('58a1f61e-4205-47c3-822b-6f7854273a4d', 'Limelight', 'https://limelightjville.com', 'Jacksonville', 'NC', '28540', 'USA', 'Jacksonville''s largest dance floor, 4 bars, large stage, VIP seating, live concerts and in-house DJ.', 800, ARRAY['rock', 'hip-hop', 'electronic', 'country']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Kill Devil Hills, NC venues (1 venues)
INSERT INTO public.venues (id, name, website, city, state, zip_code, country, description, capacity, music_focus, venue_type, facebook_url, is_verified)
VALUES ('dc9efb80-a6ea-421e-8d19-859969f21f5c', 'Avalon Pier', 'https://avalonpier.com', 'Kill Devil Hills', 'NC', '27948', 'USA', 'Outer Banks pier offering live music on select evenings, serving vacationers for over 60 years.', 300, ARRAY['rock', 'country', 'beach music', 'blues']::text[], 'other', 'https://www.facebook.com/avalonpier', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

-- New Bern, NC venues (4 venues)
INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('1e9a9ca9-8246-48bd-8d86-81ba0669ab76', 'Baxter''s 1892', 'info@baxters1892.com', '252-638-5595', 'https://www.baxters1892.com', 'New Bern', 'NC', 'US', 'Historic restaurant and bar with live music in downtown New Bern.', 150, ARRAY['singer songwriter', 'rock', 'indie', 'alternative', 'original']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('ba5bb92d-5256-4208-90bc-1ff5d69f3fa7', 'The Brown Pelican', 'info@thebrownpelican.com', '252-637-2525', 'https://www.thebrownpelican.com', 'New Bern', 'NC', 'US', 'Waterfront bar featuring live music and outdoor seating.', 200, ARRAY['singer songwriter', 'rock', 'blues', 'country', 'covers']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, website, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('3c070f18-ab34-4774-b415-de2ba7dfde4f', 'The Chelsea', 'https://www.thechelsea.com', 'New Bern', 'NC', '28560', 'USA', 'Historic 1912 gathering place featuring live music, mezzanine bar overlooks main dining and music.', 150, ARRAY['jazz', 'blues', 'rock']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, website, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('6498c040-f71e-416a-bc6a-c94b6f7aadea', 'Persimmons Waterfront Restaurant', 'https://www.persimmonsrestaurant.net', 'New Bern', 'NC', '28560', 'USA', 'Waterfront restaurant featuring live music, modern American cuisine on banks of Neuse River.', 150, ARRAY['jazz', 'blues', 'acoustic']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Pinehurst, NC venues (1 venues)
INSERT INTO public.venues (id, name, email, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('744ff280-1203-4348-8a14-8e8d930ca0f5', 'Drum and Quill', 'booking@drumandquill.com', 'https://www.drumandquill.com', 'Pinehurst', 'NC', 'US', 'Intimate venue in historic Pinehurst hosting singer-songwriters and small acts.', 125, ARRAY['singer songwriter', 'rock', 'blues', 'country', 'covers']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Pittsboro, NC venues (1 venues)
INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('872e5188-ff92-46bd-bac7-3e5cb8d6fa57', 'BMC Brewing', 'events@bmcbrewing.com', '919-533-9977', 'https://www.bmcbrewing.com', 'Pittsboro', 'NC', 'US', 'Craft brewery with live music and food truck events.', 150, ARRAY['singer songwriter', 'indie', 'folk', 'acoustic']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Raleigh, NC venues (23 venues)
INSERT INTO public.venues (id, name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('124831f7-38c0-4b3c-b24a-b1f95267f842', 'The Pour House Music Hall', 'booking@pourhouseraleigh.com', '919-821-1120', 'https://pourhouseraleigh.com', '224 S Blount Street', 'Raleigh', 'NC', '27601', 'US', 'Raleigh''s home for all things music featuring local and nationally touring bands. 20+ years showcasing rock, soul, jazz, hip-hop and Americana. Over 1,000 bands perform annually.', 400, ARRAY['alternative rock', 'americana', 'hip hop', 'indie', 'jam bands', 'jazz', 'metal', 'rock']::text[], 'other', '@thepourhouse', 'https://www.facebook.com/thepourhousemusichall', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  instagram_handle = EXCLUDED.instagram_handle,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('ed58a4fd-c942-4b0c-b983-06f7eec78985', 'Lincoln Theatre', 'info@lincolntheatre.com', '919-821-4111', 'https://lincolntheatre.com', '126 E Cabarrus Street', 'Raleigh', 'NC', '27601', 'US', 'Historic music venue in downtown Raleigh featuring diverse live music including rock, indie, and alternative. Intimate setting with great acoustics.', 700, ARRAY['alternative', 'electronic', 'hip-hop', 'indie', 'rock', 'folk', 'indie', 'jazz', 'original', 'rock']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, city, state, country, description, music_focus, is_verified)
VALUES ('434090f2-e39f-4df8-89aa-eee78c88124a', 'The Ritz', 'booking@ritzraleigh.com', 'Raleigh', 'NC', 'US', 'Popular 12,000-square-foot live music venue known for industrial-style space. Multiple bars, VIP seating. Hosts rock, hip-hop, and electronic music.', ARRAY['rock', 'hip hop', 'electronic']::text[], true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  music_focus = EXCLUDED.music_focus,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, instagram_handle, facebook_url, is_verified)
VALUES ('8e23ece6-fe5c-4911-88c8-b6a3a3d38db7', 'Slims Downtown', 'slims@slimsraleigh.com', 'https://slimsraleigh.com', '227 S Wilmington Street', 'Raleigh', 'NC', '27601', 'US', 'Downtown Raleigh''s oldest music venue (est. 1999). Authentic dive bar with 100-person capacity for intimate concerts. Weekly open mic nights and local acts.', 100, ARRAY['folk', 'indie', 'metal', 'punk', 'rock']::text[], 'bar', 'Open mic with live band on Tuesdays.', '@slims_tagrams', 'https://www.facebook.com/SlimsRaleigh', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  instagram_handle = EXCLUDED.instagram_handle,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('483d7240-a6bb-499e-b656-fd6b750d8fb1', 'Tin Roof', 'raleigh@tinroof.com', '919-747-4930', 'https://www.tinroof.com/raleigh', 'Raleigh', 'NC', 'US', 'Live music every night featuring local, regional and national acts across all genres. Great food and drinks in a fun atmosphere.', 500, ARRAY['alternative', 'blues', 'country', 'rock', 'covers', 'original']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('10d92ed0-5c65-4841-af5d-0f5abc4994db', 'Kings', 'booking@kings-raleigh.com', '919-719-8611', 'https://www.kingsraleigh.com', '14 W Martin Street', 'Raleigh', 'NC', '27601', 'US', 'Premier live music venue in downtown Raleigh. Known for eclectic programming and top-notch sound system. Hosts touring acts and local favorites.', 600, ARRAY['alternative', 'electronic', 'hip-hop', 'indie', 'rock', 'covers', 'original']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('7e8b1540-0906-4fc0-948e-1e84138d2ddc', 'Red Hat Amphitheater', 'info@redhatamphitheater.com', 'https://www.redhatamphitheater.com', '500 South McDowell Street', 'Raleigh', 'NC', '27601', 'US', 'Outdoor amphitheater in Glenwood South with 5,000 capacity. Premier venue for major touring artists in an intimate downtown setting.', 5990, ARRAY['alternative', 'country', 'hip hop', 'hip-hop', 'pop', 'rock']::text[], 'amphitheater', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, city, state, country, description, music_focus, is_verified)
VALUES ('88c5118e-2923-444b-9cac-bae90aa2d1d4', 'The Maywood', 'info@themaywood.com', 'Raleigh', 'NC', 'US', 'Cozy neighborhood bar and music venue. Focus on local and regional acts. Great for emerging artists and intimate shows.', ARRAY['indie', 'folk', 'americana', 'jazz']::text[], true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  music_focus = EXCLUDED.music_focus,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('6bc94c59-4a2f-48e8-b59f-60563c083852', 'Blackbird Beer', 'info@blackbirdraleigh.com', 'https://www.blackbirdraleigh.com', 'Raleigh', 'NC', 'US', 'Beer garden and bar with live music in downtown Raleigh.', 200, ARRAY['original', 'singer songwriter']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, phone, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('3a467c60-ef37-4433-aaaf-9501a90e156d', 'Neptune''s Parlour', '919-896-7063', '14 W Martin Street, Basement', 'Raleigh', 'NC', '27601', 'USA', 'Intimate basement cocktail bar underneath Garland, oriented towards DJs and recorded music.', 100, ARRAY['dj', 'electronic']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, facebook_url, is_verified)
VALUES ('caa86910-a48f-498e-950f-826d6b319325', 'Transfer Co. Ballroom', 'https://www.transfercoballroom.com', '500 E Davie Street', 'Raleigh', 'NC', '27601', 'USA', 'Live music venue attached to Transfer Co. Food Hall in historic Carolina Coach Garage.', 350, ARRAY['rock', 'indie', 'electronic', 'hip-hop']::text[], 'other', 'https://www.facebook.com/TransferCoBallroom', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('e2c0b816-718e-422c-a2b4-0af43828ded7', 'Watts and Ward', 'https://www.wattsandward.com', '200 S Blount Street', 'Raleigh', 'NC', '27601', 'USA', '1920s speakeasy-inspired cocktail bar with three authentic bars, can hold 300 inside or 380 with courtyard.', 380, ARRAY['jazz', 'blues']::text[], 'bar', '@wattsandward', 'https://www.facebook.com/wattsandward', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  instagram_handle = EXCLUDED.instagram_handle,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, website, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('b7a5a569-35ea-432f-8927-d8c40ca4c0f7', 'Brewery Bhavana', 'https://brewerybhavana.com', 'Raleigh', 'NC', '27601', 'USA', 'Four-in-one concept: brewery, dim sum restaurant, flower shop, and bookstore with occasional live music.', 200, ARRAY['jazz', 'folk', 'indie']::text[], 'bar', '@brewerybhavana', 'https://www.facebook.com/brewerybhavana', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  instagram_handle = EXCLUDED.instagram_handle,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('df2cbe15-edb0-4501-8ef8-6bfa591db482', 'Crank Arm Brewing', 'https://crankarmbrewing.com', '319 W Davie Street', 'Raleigh', 'NC', '27601', 'USA', 'Warehouse District brewery combining bikes and beer, hosts run clubs, cycling clubs, trivia nights, and music events.', 200, ARRAY['rock', 'indie', 'folk']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('8395fa7b-9a94-4397-ac1d-2ceafa7e0265', 'Bowstring', 'booking@bowstringraleigh.com', '919-803-0520', 'https://www.bowstringraleigh.com', 'Raleigh', 'NC', 'US', 'Intimate music venue in downtown Raleigh featuring singer-songwriters.', 150, ARRAY['singer songwriter', 'rock', 'blues', 'country', 'covers']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('40cc6872-c4eb-44ba-80a2-e12e81be858c', 'Compass Rose Brewery', 'events@compassrosebrewery.com', '919-803-2290', 'https://www.compassrosebrewery.com', 'Raleigh', 'NC', 'US', 'Craft brewery in North Raleigh with live music events.', 200, ARRAY['singer songwriter', 'indie', 'folk', 'acoustic']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('e98cbb9e-dd53-4b8b-b13a-54b59f951ae8', 'Gizmo Brew Works', 'events@gizmobrewworks.com', '919-251-9381', 'https://www.gizmobrewworks.com', 'Raleigh', 'NC', 'US', 'Craft brewery in Five Points with regular live music.', 200, ARRAY['original', 'singer songwriter']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('1c344467-6d2f-4d03-a709-347d08f0f0a9', 'Raleigh Brewing Company', 'events@raleighbrewingcompany.com', '919-803-7887', 'https://www.raleighbrewingcompany.com', 'Raleigh', 'NC', 'US', 'Craft brewery with outdoor beer garden hosting live music.', 300, ARRAY['singer songwriter', 'indie', 'folk', 'acoustic']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('09e9a0a1-d663-43cc-afe6-11d9391b2cfb', 'Tap Yard', 'events@tapyardraleigh.com', 'https://www.tapyardraleigh.com', 'Raleigh', 'NC', 'US', 'Outdoor beer garden and event space with live music.', 400, ARRAY['covers', 'rock', 'indie', 'alternative', 'original']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('f19f5157-c28c-49a9-a3d5-43f0b0cfb6df', 'The Pour House', 'booking@thepourhousemusichall.com', '919-821-1120', 'https://www.thepourhousemusichall.com', 'Raleigh', 'NC', 'US', 'Iconic Raleigh music venue operating since 1993. Known for hosting both emerging and established artists across rock, indie, and alternative genres. Features a full bar, stage, and intimate atmosphere.', 600, ARRAY['rock', 'indie', 'alternative', 'punk', 'original']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('8148acde-4e35-4503-8e59-cb2cdcc9f653', 'Transfer Co Ballroom', 'booking@transfercoballroom.com', '919-900-5070', 'https://www.transfercoballroom.com', 'Raleigh', 'NC', 'US', 'Stunning historic ballroom venue in downtown Raleigh. Features soaring ceilings, elegant architecture, and hosts concerts, weddings, and special events.', 900, ARRAY['rock', 'indie', 'electronic', 'original']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('f1b512d7-c9cd-4d6f-954e-ea207dd471cb', 'Westin Raleigh (Rooftop)', 'events@westinraleigh.com', 'https://www.marriott.com/hotels/travel/rduwi-the-westin-raleigh-durham-airport-brier-creek', 'Raleigh', 'NC', 'US', 'Rooftop venue at downtown Westin hotel with live music events.', 200, ARRAY['singer songwriter', 'rock', 'indie', 'alternative', 'original']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('dc0c076b-3222-4365-ad15-91f82ae173be', 'Whiskey Rose', 'booking@whiskeyroseraleigh.com', 'https://www.whiskeyroseraleigh.com', 'Raleigh', 'NC', 'US', 'Dive bar in downtown Raleigh hosting local and touring rock acts.', 250, ARRAY['original', 'covers']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Rocky Mount, NC venues (1 venues)
INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('456a3926-3155-4dc7-a939-4e2951c19a52', 'Rocky Mount Mills', 'events@rockymountmills.com', '252-883-1140', 'https://www.rockymountmills.com', 'Rocky Mount', 'NC', 'US', 'Historic mill complex hosting concerts and community events.', 500, ARRAY['singer songwriter', 'rock', 'indie', 'alternative', 'original']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Saxapahaw, NC venues (1 venues)
INSERT INTO public.venues (id, name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, facebook_url, is_verified)
VALUES ('257fee46-474f-451c-9e36-70482e8de879', 'Haw River Ballroom', 'Karina@hawriverballroom.com', '336-525-2314', 'https://www.hawriverballroom.com', '1711 Saxapahaw Bethlehem Church Road', 'Saxapahaw', 'NC', '27340', 'USA', 'Riverside music venue in former Dye House of historic Saxapahaw mill village.', 750, ARRAY['rock', 'folk', 'americana', 'indie']::text[], 'other', 'Phone is Cup 22 box office, open 7am-5pm weekdays, 8am-5pm weekends', 'https://www.facebook.com/hawriverballroom', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

-- Wake Forest, NC venues (3 venues)
INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('1172535d-c2ce-4af7-8658-8fbd3f5fef29', 'Lonerider Brewing', 'events@loneriderbeer.com', '919-442-4699', 'https://www.loneriderbeer.com', 'Wake Forest', 'NC', 'US', 'Large craft brewery with outdoor stage and event space.', 300, ARRAY['original', 'covers']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('f193e671-63cb-428c-8d03-838222938e17', 'Real McCoy''s', 'info@realmccoyswf.com', 'https://www.realmccoyswf.com', 'Wake Forest', 'NC', 'US', 'Bar and grill featuring live music on weekends.', 200, ARRAY['covers', 'rock', 'blues', 'country']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('3c32d910-3550-4307-86cb-e4aa58a9edcd', 'White Street Brewing', 'events@whitestreetbrewing.com', '919-570-9700', 'https://www.whitestreetbrewing.com', 'Wake Forest', 'NC', 'US', 'Downtown Wake Forest brewery with live music and food trucks.', 200, ARRAY['singer songwriter', 'indie', 'folk', 'acoustic']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Washington, NC venues (2 venues)
INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('38376475-fdf2-423c-b8b9-518cb6ac7a24', 'Backwater Jacks Tiki Bar and Grill', 'info@backwaterjacks.com', '252-975-1828', 'https://www.backwaterjacks.com', 'Washington', 'NC', 'US', 'Waterfront tiki bar with live music and outdoor seating.', 200, ARRAY['original', 'covers']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('1c55bdce-bb4a-4251-a7c7-ce0756c834c9', 'The Mulberry House', 'info@themulberryhousenc.com', 'https://www.themulberryhousenc.com', 'Washington', 'NC', 'US', 'Historic restaurant featuring live music in downtown Washington.', 125, ARRAY['singer songwriter', 'rock', 'indie', 'alternative', 'original']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Wendell, NC venues (1 venues)
INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('12dcd823-5aa5-420d-8b72-ad6516246d3f', 'Bearded Bee Brewing', 'events@beardedbeebrewing.com', '919-404-9663', 'https://www.beardedbeebrewing.com', 'Wendell', 'NC', 'US', 'Craft brewery with outdoor space hosting live music events.', 200, ARRAY['singer songwriter', 'indie', 'folk', 'acoustic']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Wilmington, NC venues (5 venues)
INSERT INTO public.venues (id, name, email, phone, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, facebook_url, is_verified)
VALUES ('1ea19d26-eac4-4257-8d39-4be4795f3e2c', 'Bourgie Nights', 'wilmington.unplugged@gmail.com', '910-763-5252', '127 Princess Street', 'Wilmington', 'NC', '28401', 'USA', 'Intimate listening room lounge hosting traveling and local musicians.', 100, ARRAY['folk', 'jazz', 'blues', 'singer-songwriter']::text[], 'other', 'https://www.facebook.com/bourgienights', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('371d6470-e714-4a9e-93d0-db4c34a6d80b', 'Reggie''s 42nd Street Tavern', '1415 S 42nd Street', 'Wilmington', 'NC', '28403', 'USA', 'Live music venue with full bar and dance floor in heart of Wilmington.', 200, ARRAY['rock', 'blues', 'country']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('a7839169-78ef-48ab-bf07-207074bb8fe2', 'Dead Crow Comedy Room', 'https://www.deadcrowcomedy.com', '511 N 3rd Street', 'Wilmington', 'NC', '28401', 'USA', 'Comedy room sharing space with Lush Garden Bar, relocated to Third Street in 2021.', 150, ARRAY['comedy']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, is_verified)
VALUES ('34934365-7e47-45e4-9f21-2fbabfdbbd33', 'Greenfield Lake Amphitheater', 'https://www.greenfieldlakeamphitheater.com', '1941 Amphitheater Drive', 'Wilmington', 'NC', '28401', 'USA', 'Recently renovated outdoor venue surrounded by cypress trees and pines, 180 degrees of water views.', 1200, ARRAY['rock', 'country', 'pop', 'blues']::text[], 'amphitheater', 'Available for rental through Live Nation. Free parking.', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, city, state, zip_code, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('3dd5d63e-6e72-40d9-afc0-cfa296f47701', 'Brooklyn Arts Center', 'Wilmington', 'NC', '28401', 'USA', 'Renovated 1888 church hosting musical concerts, events and festivals year-round.', 250, ARRAY['jazz', 'classical', 'folk', 'world']::text[], 'other', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

-- Winston-Salem, NC venues (3 venues)
INSERT INTO public.venues (id, name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, facebook_url, is_verified)
VALUES ('338b5a41-bd0e-4664-95f2-3ce83e504472', 'The Ramkat', 'info@theramkat.com', '336-754-9714', 'https://www.theramkat.com', '170 W 9th Street', 'Winston-Salem', 'NC', '27101', 'USA', 'Two-level 11,670 sqft venue opened 2018, handicap-accessible with three bars. Upstairs Gas Hill lounge holds 100.', 1000, ARRAY['country', 'electronic', 'hip-hop', 'indie', 'rock', 'alternative', 'indie', 'original', 'rock']::text[], 'other', 'Mailing: PO Box 20333 Winston-Salem, NC 27120', 'https://www.facebook.com/theramkat', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  facebook_url = EXCLUDED.facebook_url,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, is_verified)
VALUES ('1091907b-a039-4747-9fc0-656ab62c7961', 'Foothills Brewing - Downtown Brewpub', 'hello@foothillsbrewing.com', '336-777-3348', 'https://www.foothillsbrewing.com', '638 W Fourth Street', 'Winston-Salem', 'NC', '27101', 'USA', 'Live music Wed-Sun nights. Wednesdays reserved for Bluegrass, Sundays for Jazz.', 250, ARRAY['bluegrass', 'country', 'folk', 'jazz', 'rock']::text[], 'bar', 'Mailing: P.O. Box 1687, Clemmons, NC 27012', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  zip_code = EXCLUDED.zip_code,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  booking_notes = EXCLUDED.booking_notes,
  is_verified = EXCLUDED.is_verified;

INSERT INTO public.venues (id, name, email, phone, website, city, state, country, description, capacity, music_focus, venue_type, is_verified)
VALUES ('dab1217f-f3d1-4f6a-9b1e-9bed83a2ab25', 'Ziggy''s', 'booking@ziggysrocks.com', '336-480-8326', 'https://www.ziggysrocks.com', 'Winston-Salem', 'NC', 'US', 'Legendary Winston-Salem venue featuring rock and alternative music.', 700, ARRAY['original', 'rock', 'blues', 'country', 'covers']::text[], 'bar', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  music_focus = EXCLUDED.music_focus,
  venue_type = EXCLUDED.venue_type,
  is_verified = EXCLUDED.is_verified;

COMMIT;

-- Verify results
SELECT city, state, COUNT(*) as venue_count
FROM public.venues
GROUP BY city, state
ORDER BY venue_count DESC;