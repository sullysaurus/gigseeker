-- Richmond, VA Venues Insert Script
-- 50 venues with complete data
-- Total venues: 50
-- Generated: 2025-11-18 00:39:03.494255

BEGIN;

-- Ashland, VA venues (1 venues)
INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Ashland Coffee & Tea', 'info@ashlandcoffeeandtea.com', '(804) 798-1702', 'https://www.ashlandcoffeeandtea.com', '100 N Railroad Ave', 'Ashland', 'VA', '23005', 'USA', 'Coffee shop in historic Ashland with intimate performances', 80, ARRAY['folk', 'acoustic', 'indie', 'jazz']::text[], 'other', '@ashlandcoffeeandtea', 'https://facebook.com/ashlandcoffeeandtea', true)
ON CONFLICT (email) DO UPDATE SET
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

-- Richmond, VA venues (49 venues)
INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('The National', 'info@thenationalva.com', '(804) 612-1900', 'https://www.thenationalva.com', '708 E Broad St', 'Richmond', 'VA', '23219', 'USA', 'Historic theater hosting national touring acts and local shows', 1500, ARRAY['rock', 'indie', 'alternative', 'electronic']::text[], 'theater', '@thenationalrva', 'https://facebook.com/thenationalva', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('The Broadberry', 'info@thebroadberry.com', '(804) 353-1384', 'https://www.thebroadberry.com', '2729 W Broad St', 'Richmond', 'VA', '23220', 'USA', 'Popular venue for emerging and established indie artists', 450, ARRAY['indie', 'rock', 'punk', 'alternative']::text[], 'club', '@thebroadberry', 'https://facebook.com/thebroadberry', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('The Camel', 'info@thecamel.org', '(804) 353-4901', 'https://www.thecamel.org', '1621 W Broad St', 'Richmond', 'VA', '23220', 'USA', 'Intimate bar and music venue in the Fan District', 200, ARRAY['indie', 'rock', 'folk', 'experimental']::text[], 'bar', '@thecamelrva', 'https://facebook.com/thecamelrva', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Brown''s Island Amphitheater', 'events@venturerichmond.com', '(804) 788-6466', 'https://www.venturerichmond.com', '7 Tredegar St', 'Richmond', 'VA', '23219', 'USA', 'Outdoor amphitheater on the James River hosting festivals and concerts', 10000, ARRAY['rock', 'pop', 'country', 'folk', 'jazz']::text[], 'amphitheater', '@venturerichmond', 'https://facebook.com/venturerichmond', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('The Tin Pan', 'info@tinpanrva.com', '(804) 447-8189', 'https://www.tinpanrva.com', '8982 Quioccasin Rd', 'Richmond', 'VA', '23229', 'USA', 'Music venue and bar featuring local and touring bands', 350, ARRAY['rock', 'indie', 'alternative', 'metal']::text[], 'club', '@tinpanrva', 'https://facebook.com/tinpanrva', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('The Jefferson Theater', 'info@jeffersontheaterrva.com', '(434) 979-1333', 'https://www.jeffersontheaterrva.com', '110 E Main St', 'Richmond', 'VA', '23219', 'USA', 'Historic theater in downtown Richmond', 600, ARRAY['rock', 'indie', 'folk', 'blues']::text[], 'theater', '@jeffersontheaterrva', 'https://facebook.com/jeffersontheaterrva', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Strangeways Brewing', 'info@strangewaysbrewing.com', '(804) 303-4576', 'https://www.strangewaysbrewing.com', '2277A Dabney Rd', 'Richmond', 'VA', '23230', 'USA', 'Craft brewery with regular live music events', 150, ARRAY['indie', 'folk', 'rock', 'acoustic']::text[], 'bar', '@strangewaysbrewing', 'https://facebook.com/strangewaysbrewing', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('The Spectrum Gallery', 'booking@spectrum-gallery.com', '(804) 644-2582', 'https://www.spectrum-gallery.com', '1508 Belleville St', 'Richmond', 'VA', '23223', 'USA', 'All-ages DIY venue supporting underground music', 300, ARRAY['punk', 'hardcore', 'metal', 'indie']::text[], 'other', '@spectrumgalleryrva', 'https://facebook.com/spectrumgallery', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Hardywood Park Craft Brewery', 'info@hardywood.com', '(804) 420-2420', 'https://www.hardywood.com', '2408 Ownby Ln', 'Richmond', 'VA', '23220', 'USA', 'Popular brewery with outdoor music events', 400, ARRAY['folk', 'bluegrass', 'indie', 'acoustic']::text[], 'bar', '@hardywood', 'https://facebook.com/hardywood', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Capital Ale House', 'info@capitalalehouse.com', '(804) 780-2537', 'https://www.capitalalehouse.com', '623 E Main St', 'Richmond', 'VA', '23219', 'USA', 'Downtown bar with live music and extensive beer selection', 250, ARRAY['rock', 'blues', 'jazz', 'folk']::text[], 'bar', '@capitalalehouse', 'https://facebook.com/capitalalehouse', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Balliceaux', 'info@balliceaux.com', '(804) 353-2210', 'https://www.balliceaux.com', '203 N Lombardy St', 'Richmond', 'VA', '23220', 'USA', 'Trendy bar and music venue in the Fan', 200, ARRAY['indie', 'electronic', 'hip-hop', 'rock']::text[], 'bar', '@balliceaux', 'https://facebook.com/balliceaux', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Innsbrook After Hours', 'info@innsbrookafterhours.com', '(804) 965-6400', 'https://www.innsbrookafterhours.com', '4901 Lake Brook Dr', 'Richmond', 'VA', '23060', 'USA', 'Outdoor concert series in Innsbrook corporate park', 8000, ARRAY['rock', 'pop', 'country', 'alternative']::text[], 'amphitheater', '@innsbrookafterhours', 'https://facebook.com/innsbrookafterhours', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('The Locker Room', 'booking@lockerroomrva.com', '(804) 340-1166', 'https://www.lockerroomrva.com', '3101 W Clay St', 'Richmond', 'VA', '23230', 'USA', 'Intimate music venue and bar', 180, ARRAY['indie', 'rock', 'punk', 'alternative']::text[], 'bar', '@lockerroomrva', 'https://facebook.com/lockerroomrva', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('The Southern Cafe and Music Hall', 'info@southerncafe.net', '(434) 977-5590', 'https://www.southerncafe.net', '103 S 1st St', 'Richmond', 'VA', '23219', 'USA', 'Restaurant and music hall featuring roots music', 400, ARRAY['bluegrass', 'folk', 'americana', 'country']::text[], 'club', '@southerncafemusicall', 'https://facebook.com/southerncafe', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('GWARbar', 'info@gwarbar.com', '(804) 231-4428', 'https://www.gwarbar.com', '217 W Clay St', 'Richmond', 'VA', '23220', 'USA', 'Metal-themed bar owned by GWAR members', 200, ARRAY['metal', 'punk', 'rock', 'hardcore']::text[], 'bar', '@gwarbar', 'https://facebook.com/gwarbar', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('The Hof Garden', 'events@thehofgarden.com', '(804) 658-4466', 'https://www.thehofgarden.com', '5410 Lakeside Ave', 'Richmond', 'VA', '23228', 'USA', 'German beer garden with live music', 300, ARRAY['rock', 'country', 'blues', 'folk']::text[], 'bar', '@thehofgarden', 'https://facebook.com/thehofgarden', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Penny Lane Pub', 'info@pennylanepub.com', '(804) 780-1682', 'https://www.pennylanepub.com', '207 W 7th St', 'Richmond', 'VA', '23224', 'USA', 'British-style pub with local music scene', 150, ARRAY['rock', 'indie', 'punk', 'alternative']::text[], 'bar', '@pennylanepubrva', 'https://facebook.com/pennylanepub', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Triple Crossing Beer', 'info@triplecrossingbeer.com', '(804) 767-3280', 'https://www.triplecrossingbeer.com', '5203 W Broad St', 'Richmond', 'VA', '23230', 'USA', 'Craft brewery with frequent live music', 200, ARRAY['indie', 'folk', 'rock', 'acoustic']::text[], 'bar', '@triplecrossingbeer', 'https://facebook.com/triplecrossingbeer', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('The Answer Brewpub', 'info@theanswerbrewpub.com', '(804) 427-3673', 'https://www.theanswerbrewpub.com', '6008 W Broad St', 'Richmond', 'VA', '23230', 'USA', 'Brewpub with live music on weekends', 180, ARRAY['rock', 'indie', 'folk', 'jazz']::text[], 'bar', '@theanswerbrewpub', 'https://facebook.com/theanswerbrewpub', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Firehouse Theatre', 'info@firehousetheatre.org', '(804) 355-2001', 'https://www.firehousetheatre.org', '1609 W Broad St', 'Richmond', 'VA', '23220', 'USA', 'Historic firehouse converted to intimate performance space', 125, ARRAY['folk', 'acoustic', 'indie', 'jazz']::text[], 'theater', '@firehousetheatre', 'https://facebook.com/firehousetheatre', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Richmond Music Hall', 'booking@richmondmusichall.com', '(804) 231-1808', 'https://www.richmondmusichall.com', '1807 E Main St', 'Richmond', 'VA', '23223', 'USA', 'Multi-level music venue in Shockoe Bottom', 900, ARRAY['rock', 'electronic', 'hip-hop', 'metal']::text[], 'club', '@richmondmusichall', 'https://facebook.com/richmondmusichall', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Sticky Rice', 'info@stickyricerestaurant.com', '(804) 358-7870', 'https://www.stickyricerestaurant.com', '2232 W Main St', 'Richmond', 'VA', '23220', 'USA', 'Sushi restaurant with punk rock vibe and occasional shows', 100, ARRAY['punk', 'indie', 'rock', 'alternative']::text[], 'bar', '@stickyricerestaurant', 'https://facebook.com/stickyricerestaurant', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('The Hofheimer Building', 'events@hofheimerbuilding.com', '(804) 234-1150', 'https://www.hofheimerbuilding.com', '1401 Roseneath Rd', 'Richmond', 'VA', '23230', 'USA', 'Historic event space hosting concerts and festivals', 500, ARRAY['rock', 'indie', 'electronic', 'alternative']::text[], 'other', '@hofheimerbuilding', 'https://facebook.com/hofheimerbuilding', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Cobra Burger', 'info@cobraburger.com', '(804) 359-2627', 'https://www.cobraburger.com', '6028 W Broad St', 'Richmond', 'VA', '23230', 'USA', 'Burger joint with punk rock atmosphere and live music', 120, ARRAY['punk', 'rock', 'metal', 'hardcore']::text[], 'bar', '@cobraburger', 'https://facebook.com/cobraburger', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Vasen Brewing Company', 'info@vasenbrewing.com', '(804) 231-8274', 'https://www.vasenbrewing.com', '2709 E Broad St', 'Richmond', 'VA', '23223', 'USA', 'Church Hill brewery with live music events', 150, ARRAY['indie', 'folk', 'rock', 'acoustic']::text[], 'bar', '@vasenbrewing', 'https://facebook.com/vasenbrewing', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('The Laurel', 'info@thelaurelrva.com', '(804) 404-1870', 'https://www.thelaurelrva.com', '2501 W Main St', 'Richmond', 'VA', '23220', 'USA', 'Music venue and bar in the Museum District', 175, ARRAY['indie', 'rock', 'electronic', 'experimental']::text[], 'bar', '@thelaurelrva', 'https://facebook.com/thelaurelrva', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Basic City Beer Co', 'info@basiccitybeer.com', '(540) 213-2644', 'https://www.basiccitybeer.com', '2210 E Clay St', 'Richmond', 'VA', '23223', 'USA', 'Brewery taproom with regular live music', 140, ARRAY['folk', 'bluegrass', 'rock', 'indie']::text[], 'bar', '@basiccitybeer', 'https://facebook.com/basiccitybeer', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('The Warehouse', 'info@thewarehouserva.com', '(804) 231-9876', 'https://www.thewarehouserva.com', '1508 Williamsburg Rd', 'Richmond', 'VA', '23231', 'USA', 'Large warehouse venue for concerts and events', 600, ARRAY['hip-hop', 'electronic', 'r&b', 'indie']::text[], 'other', '@thewarehouserva', 'https://facebook.com/thewarehouserva', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Galley Restaurant', 'info@galleyrva.com', '(804) 918-6260', 'https://www.galleyrva.com', '1007 N Boulevard', 'Richmond', 'VA', '23230', 'USA', 'Upscale restaurant with jazz and acoustic performances', 100, ARRAY['jazz', 'blues', 'folk', 'acoustic']::text[], 'bar', '@galleyrva', 'https://facebook.com/galleyrva', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('The Veil Brewing Co', 'info@theveilbrewing.com', '(804) 269-7100', 'https://www.theveilbrewing.com', '1301 Roseneath Rd', 'Richmond', 'VA', '23230', 'USA', 'Popular brewery with outdoor music events', 250, ARRAY['indie', 'electronic', 'rock', 'experimental']::text[], 'bar', '@theveilbrewing', 'https://facebook.com/theveilbrewing', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('The Circuit Arcade Bar', 'info@circuitarcadebar.com', '(804) 353-2500', 'https://www.circuitarcadebar.com', '3121 W Leigh St', 'Richmond', 'VA', '23230', 'USA', 'Arcade bar with DJs and live music', 160, ARRAY['electronic', 'indie', 'rock', 'hip-hop']::text[], 'bar', '@circuitarcadebar', 'https://facebook.com/circuitarcadebar', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Stone Brewing Tap Room', 'richmond@stonebrewing.com', '(804) 687-7468', 'https://www.stonebrewing.com/visit/richmond', '4300 Williamsburg Ave', 'Richmond', 'VA', '23231', 'USA', 'Large brewery with outdoor space for live music', 300, ARRAY['rock', 'indie', 'folk', 'blues']::text[], 'bar', '@stonebrewing', 'https://facebook.com/stonebrewing', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Carytown Burgers & Fries', 'info@carytownburgers.com', '(804) 358-0001', 'https://www.carytownburgers.com', '3500 W Cary St', 'Richmond', 'VA', '23221', 'USA', 'Burger restaurant with occasional live music', 90, ARRAY['rock', 'indie', 'punk', 'alternative']::text[], 'bar', '@carytownburgers', 'https://facebook.com/carytownburgers', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Legend Brewing Company', 'info@legendbrewing.com', '(804) 232-3871', 'https://www.legendbrewing.com', '321 W 7th St', 'Richmond', 'VA', '23224', 'USA', 'Richmond''s oldest craft brewery with riverside patio and live music', 220, ARRAY['rock', 'folk', 'blues', 'country']::text[], 'bar', '@legendbrewing', 'https://facebook.com/legendbrewing', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Mainline Bar & Grill', 'info@mainlinerva.com', '(804) 355-8468', 'https://www.mainlinerva.com', '5704 Grove Ave', 'Richmond', 'VA', '23226', 'USA', 'Neighborhood bar with live music nights', 130, ARRAY['rock', 'indie', 'blues', 'jazz']::text[], 'bar', '@mainlinerva', 'https://facebook.com/mainlinerva', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('The Boathouse at Sunday Park', 'info@boathouseatsundaypark.com', '(804) 622-2628', 'https://www.boathouseatsundaypark.com', '4602 E Old Main St', 'Richmond', 'VA', '23231', 'USA', 'Waterfront restaurant with outdoor live music', 180, ARRAY['rock', 'country', 'blues', 'folk']::text[], 'bar', '@boathousesundaypark', 'https://facebook.com/boathousesundaypark', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Ardent Craft Ales', 'info@ardentcraftales.com', '(804) 359-1605', 'https://www.ardentcraftales.com', '3200 W Leigh St', 'Richmond', 'VA', '23230', 'USA', 'Scott''s Addition brewery with music events', 170, ARRAY['indie', 'folk', 'rock', 'acoustic']::text[], 'bar', '@ardentcraftales', 'https://facebook.com/ardentcraftales', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('The Hole in the Wall', 'info@holeinthewall rva.com', '(804) 231-5505', 'https://www.holeinthewallrva.com', '2024 W Broad St', 'Richmond', 'VA', '23220', 'USA', 'Dive bar with punk rock shows', 110, ARRAY['punk', 'rock', 'indie', 'metal']::text[], 'bar', '@holeinthewallrva', 'https://facebook.com/holeinthewallrva', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Three Notch''d Brewing RVA Collab House', 'richmond@threenotchdbrewing.com', '(804) 398-8623', 'https://www.threenotchdbrewing.com', '2930 W Broad St', 'Richmond', 'VA', '23230', 'USA', 'Brewery with large outdoor space for live music', 200, ARRAY['rock', 'indie', 'folk', 'country']::text[], 'bar', '@threenotchdbrewing', 'https://facebook.com/threenotchdbrewing', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Rosie Connolly''s Pub', 'info@rosieconnollyspub.com', '(804) 353-3921', 'https://www.rosieconnollyspub.com', '1548 W Main St', 'Richmond', 'VA', '23220', 'USA', 'Irish pub with traditional music sessions', 140, ARRAY['rock', 'folk', 'irish', 'blues']::text[], 'bar', '@rosieconnollyspub', 'https://facebook.com/rosieconnollyspub', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Isley Brewing Company', 'info@isleybrewing.com', '(804) 325-1278', 'https://www.isleybrewing.com', '1715 Summit Ave', 'Richmond', 'VA', '23230', 'USA', 'Family-friendly brewery with live music weekends', 190, ARRAY['rock', 'indie', 'folk', 'country']::text[], 'bar', '@isleybrewing', 'https://facebook.com/isleybrewing', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('The Meadow', 'info@themeadowrva.com', '(804) 254-4411', 'https://www.themeadowrva.com', '2700 W Broad St', 'Richmond', 'VA', '23220', 'USA', 'Event space hosting concerts and music events', 600, ARRAY['indie', 'rock', 'electronic', 'alternative']::text[], 'other', '@themeadowrva', 'https://facebook.com/themeadowrva', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Buskey Cider', 'info@buskeycider.com', '(804) 231-4007', 'https://www.buskeycider.com', '2910 W Leigh St', 'Richmond', 'VA', '23230', 'USA', 'Cidery with outdoor seating and live music', 160, ARRAY['folk', 'indie', 'acoustic', 'bluegrass']::text[], 'bar', '@buskeycider', 'https://facebook.com/buskeycider', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Final Gravity Brewing', 'info@finalgravitybrewing.com', '(804) 405-1025', 'https://www.finalgravitybrewing.com', '2818 W Broad St', 'Richmond', 'VA', '23230', 'USA', 'Scott''s Addition brewery with live music', 145, ARRAY['rock', 'indie', 'folk', 'jazz']::text[], 'bar', '@finalgravitybrewing', 'https://facebook.com/finalgravitybrewing', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Blue Bee Cider', 'info@bluebeecider.com', '(804) 231-0280', 'https://www.bluebeecider.com', '1320 Summit Ave', 'Richmond', 'VA', '23230', 'USA', 'Urban cidery with music events', 135, ARRAY['folk', 'acoustic', 'indie', 'bluegrass']::text[], 'bar', '@bluebeecider', 'https://facebook.com/bluebeecider', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Garden Grove Brewing & Urban Winery', 'info@gardengrovebrewing.com', '(804) 231-0307', 'https://www.gardengrovebrewing.com', '1305 Summit Ave', 'Richmond', 'VA', '23230', 'USA', 'Brewery and winery with live performances', 155, ARRAY['rock', 'indie', 'folk', 'jazz']::text[], 'bar', '@gardengrovebrewing', 'https://facebook.com/gardengrovebrewing', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Tabol Brewing', 'info@tabolbrewing.com', '(804) 767-8222', 'https://www.tabolbrewing.com', '5505 Patterson Ave', 'Richmond', 'VA', '23226', 'USA', 'Neighborhood brewery with acoustic sessions', 125, ARRAY['folk', 'acoustic', 'indie', 'jazz']::text[], 'bar', '@tabolbrewing', 'https://facebook.com/tabolbrewing', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('Sabai', 'info@sabairva.com', '(804) 658-1888', 'https://www.sabairva.com', '2727 W Broad St', 'Richmond', 'VA', '23220', 'USA', 'Thai restaurant with jazz and world music performances', 110, ARRAY['jazz', 'world', 'acoustic', 'indie']::text[], 'bar', '@sabairva', 'https://facebook.com/sabairva', true)
ON CONFLICT (email) DO UPDATE SET
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

INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, instagram_handle, facebook_url, is_verified)
VALUES ('The Basement at The National', 'basement@thenationalva.com', '(804) 612-1900', 'https://www.thenationalva.com', '708 E Broad St', 'Richmond', 'VA', '23219', 'USA', 'Intimate basement venue under The National for emerging artists', 300, ARRAY['hip-hop', 'electronic', 'r&b', 'indie']::text[], 'club', '@thenationalrva', 'https://facebook.com/thenationalva', true)
ON CONFLICT (email) DO UPDATE SET
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

COMMIT;

-- Verify results
SELECT city, state, COUNT(*) as venue_count
FROM public.venues
WHERE state = 'VA'
GROUP BY city, state
ORDER BY venue_count DESC;