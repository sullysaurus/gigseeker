-- Insert North Carolina music venues from CSV
-- Total NC venues: 61

begin;

-- Insert NC venues
insert into public.venues (
  id,
  name,
  email,
  phone,
  website,
  city,
  state,
  description,
  capacity,
  music_focus,
  venue_type,
  is_verified
) values
-- Aberdeen venues
('0167341c-6f25-4793-bcbf-bdc65bd966ef', 'The Neon Rooster', 'booking@theneonrooster.com', 'None', 'https://www.theneonrooster.com', 'Aberdeen', 'NC', 'Local music venue and bar hosting live performances.', 200, ARRAY['original', 'covers'], 'bar', true),

-- Apex venues
('ce7b2c02-21dd-41bb-93e2-52c23b764c76', 'Abbey Road Tavern & Grill', 'info@abbeyroadnc.com', '919-267-9976', 'https://www.abbeyroadnc.com', 'Apex', 'NC', 'Restaurant and bar featuring live music on weekends.', 150, ARRAY['covers'], 'bar', true),
('bec59e3d-1917-438a-94e2-dc3f56d8a979', 'Southern Peak Brewery', 'events@southernpeakbrewery.com', '919-267-7766', 'https://www.southernpeakbrewery.com', 'Apex', 'NC', 'Craft brewery with outdoor stage hosting live music events.', 150, ARRAY['singer songwriter'], 'brewery', true),

-- Asheville venues
('11a5f26d-5463-4408-ac80-7d6830af0ffc', 'Asheville Music Hall', 'booking@ashevillemusichall.com', '828-772-2033', 'https://www.ashevillemusichall.com', 'Asheville', 'NC', 'Multi-level music venue in downtown Asheville featuring diverse acts.', 500, ARRAY['original'], 'venue', true),
('caffd7d9-cf22-442d-bef2-4264d33976c0', 'Eulogy (AVL)', 'booking@eulogyavl.com', 'None', 'https://www.eulogyavl.com', 'Asheville', 'NC', 'Intimate venue and bar in West Asheville hosting local and touring acts.', 200, ARRAY['original'], 'bar', true),
('b2bd3a38-fd1c-491b-bd70-bdb92261750e', 'The Orange Peel', 'booking@theorangepeel.net', '828-225-5851', 'https://www.theorangepeel.net', 'Asheville', 'NC', 'Historic music hall hosting national and regional touring acts.', 1050, ARRAY['original'], 'venue', true),

-- Carrboro venues
('fcfc65b7-8cfd-4f1a-a16c-b1073a386e97', 'Steel String Brewery', 'info@steelstringbrewery.com', '919-240-7215', 'https://www.steelstringbrewery.com', 'Carrboro', 'NC', 'Craft brewery with regular live music performances.', 125, ARRAY['singer songwriter'], 'brewery', true),

-- Cary venues
('b6e10b6b-21b0-48a5-afff-e87933eaa09f', 'Bond Bros.', 'events@bondbrothersbeer.com', '919-342-2739', 'https://www.bondbrothersbeer.com', 'Cary', 'NC', 'Original Bond Brothers location with live music and food trucks.', 200, ARRAY['singer songwriter'], 'brewery', true),
('68c132da-8970-4a5d-a1b6-9ae7ad00fd89', 'Bond Brothers Eastside', 'events@bondbrothersbeer.com', '919-342-2739', 'https://www.bondbrothersbeer.com', 'Cary', 'NC', 'Eastside location of Bond Brothers featuring live music and events.', 200, ARRAY['singer songwriter'], 'brewery', true),
('91e31189-89a4-4035-8357-4bef95a15455', 'Fortnight Brewing', 'info@fortnightbrewing.com', '919-373-1161', 'https://www.fortnightbrewing.com', 'Cary', 'NC', 'Craft brewery with outdoor space hosting live music.', 150, ARRAY['singer songwriter'], 'brewery', true),
('e999ab41-a22f-467d-a4d4-f4336dc6dff5', 'The Cary Theater', 'info@thecarytheater.com', '919-462-2051', 'https://www.thecarytheater.com', 'Cary', 'NC', 'Historic downtown theater hosting concerts, films, and performing arts.', 300, ARRAY['original', 'covers'], 'venue', true),

-- Chapel Hill venues
('edded298-bd35-4601-b51c-2f7f40c276e3', 'Fridays on the Front Porch (Carolina Inn)', 'events@carolinainn.com', '919-918-2777', 'https://www.carolinainn.com', 'Chapel Hill', 'NC', 'Weekly outdoor concert series at historic Carolina Inn.', 200, ARRAY['singer songwriter'], 'venue', true),

-- Charlotte venues
('64193236-6848-4b90-817f-c61c140eb4a9', 'Amos'' Southend', 'booking@amossouthend.com', '704-377-6874', 'https://www.amossouthend.com', 'Charlotte', 'NC', 'Southend music venue and restaurant featuring regional and national acts.', 500, ARRAY['original', 'covers'], 'bar', true),
('ea448a41-3b00-4c14-a009-3a5e4791ab26', 'Evening Muse', 'info@eveningmuse.com', '704-376-3737', 'https://www.eveningmuse.com', 'Charlotte', 'NC', 'Intimate listening room in NoDa featuring singer-songwriters and small acts.', 150, ARRAY['singer songwriter'], 'venue', true),
('4ca411f7-9a97-4dcc-8f32-b0c0a5b5782b', 'Neighborhood Theatre', 'booking@neighborhoodtheatre.com', '704-358-9298', 'https://www.neighborhoodtheatre.com', 'Charlotte', 'NC', 'Mid-sized venue in NoDa arts district hosting touring acts.', 1000, ARRAY['original'], 'venue', true),
('7b44888e-26d4-4e46-b755-a619f7f05fcf', 'The Music Yard', 'booking@themusicyard.com', '704-445-9273', 'https://www.themusicyard.com', 'Charlotte', 'NC', 'Outdoor music venue with covered stage and full bar.', 400, ARRAY['original', 'covers'], 'bar', true),
('8f4ee7e7-080a-4a1f-b523-581935a42730', 'Visulite Theater', 'info@visulitetheatre.com', '704-358-9200', 'https://www.visulitetheatre.com', 'Charlotte', 'NC', 'Historic theater in Elizabeth neighborhood hosting concerts and events.', 700, ARRAY['original'], 'venue', true),

-- Clayton venues
('28a1455a-18e0-44c6-af31-ce68c1e97c84', 'First Street Tavern', 'info@firststreettavern.com', 'None', 'https://www.firststreettavern.com', 'Clayton', 'NC', 'Local tavern featuring live music and community events.', 150, ARRAY['singer songwriter'], 'bar', true),

-- Cornelius venues
('833489c6-fe21-4a9f-a1ac-fafdbfa1dc54', 'Boatyard', 'events@boatyardlkn.com', '704-896-9266', 'https://www.boatyardlkn.com', 'Cornelius', 'NC', 'Lakeside restaurant and bar with live music on the waterfront.', 200, ARRAY['covers'], 'venue', true),

-- Durham venues
('920b8d80-7929-4f26-8950-85c3c5bd9acd', 'Clouds Brewing', 'info@cloudsbrewing.com', '919-682-2568', 'https://www.cloudsbrewing.com', 'Durham', 'NC', 'Downtown Durham brewery with regular live music and food options.', 200, ARRAY['singer songwriter'], 'brewery', true),
('9c1aaef3-fd5a-430b-9cbf-4eb937d0c959', 'Durham Beer Garden', 'info@durhambeergarden.com', 'None', 'https://www.durhambeergarden.com', 'Durham', 'NC', 'Outdoor beer garden with live music and rotating food trucks.', 300, ARRAY['singer songwriter'], 'venue', true),
('c825222c-2c19-4a8e-b830-0235cdd4435c', 'Glass Jug Beer Lab', 'events@glassjugbeerlab.com', '919-680-8466', 'https://www.glassjugbeerlab.com', 'Durham', 'NC', 'Craft brewery in downtown Durham hosting live music and events.', 150, ARRAY['original', 'singer songwriter'], 'brewery', true),
('404ed402-2ec3-4fdb-9ec5-9b94c8ea925d', 'Growler Grlz', 'info@growlergrlz.com', 'None', 'https://www.growlergrlz.com', 'Durham', 'NC', 'Craft beer bar and bottle shop with live music events.', 100, ARRAY['singer songwriter'], 'bar', true),
('6bc14caa-3495-4a0d-b2a3-07e81ab651ed', 'Motorco', 'artist@motorcomusic.com', '919.901.0875', 'https://motorcomusic.com/', 'Durham', 'NC', 'Motorco Music Hall is an entertainment and events space in Durham, North Carolina. Motorco consists of a large, state of the art Showroom, the Garage Bar and restaurant Parts & Labor with a giant outdoor patio and the Veranda, a covered patio with its own bar and a Parrilla. We have full NC Liquor licenses and have a wide variety of beers, liquors, wines and specialty cocktails (fresh squeezed juices, housemade syrups!). We are located in the Central Park district, within short walking distance to the restaurants and bars of Downtown.', 400, ARRAY['original'], 'bar', true),
('e523507d-26e2-421b-a4ef-ada338ed0cf9', 'The Streets at Southpoint (Music on Main)', 'events@streetsatsouthpoint.com', '919-572-8808', 'https://www.streetsatsouthpoint.com', 'Durham', 'NC', 'Outdoor concert series at shopping center featuring local and regional acts.', 500, ARRAY['original', 'covers'], 'venue', true),
('d1d04b23-709b-46e4-a8e2-fc395779a431', 'Zinchouse', 'info@zinchouse.com', '(833) 494-9463', 'https://www.zinchouse.com/', 'Durham', 'NC', 'Experience the best of the Triangle winery and brewery good times at ZincHouse, nestled on 87 acres of vineyards and treetop views, offering adults 21+a wide beverage selection of 400+ exquisite wines, our own ZincHouse and local brewery’s craft beers, and a robust offering of bourbon and cigars. The story of our farm and vision continues and grows in 2024!

Open Wednesday – Sunday and featuring live music and food trucks, ZincHouse is the best of good times in the Triangle. See our FAQs.

Step inside one of the three floors of our main building – the ZincHouse. Or sit on the Veranda near the vineyards and take in the beauty, Next door at the beautiful Pavilion, a music stage and the Z-House of Bourbon & Cigar Bar awaits. Two smoking verandas outside the back also feature firepits and the same captivating views. Our Carriage House, nestled in privacy, hosts public dinners, tastings and events.

Our calendar is updated monthly with our live music, food trucks, ticketed events and festivals.
Welcome to ZincHouse. The Triangle areas premier destination.', null, ARRAY['original', 'covers'], 'bar', true),

-- Fuquay-Varina venues
('6d8354e1-5b8b-4490-a44b-64c1161aa055', 'Mason Jar Lager Company', 'events@masonjarlagers.com', '919-552-0550', 'https://www.masonjarlagers.com', 'Fuquay-Varina', 'NC', 'Lager-focused brewery with outdoor space for live music.', 200, ARRAY['singer songwriter'], 'brewery', true),

-- Greensboro venues
('bb4ecd4e-cd58-4532-ba92-83bc6e2d7efa', 'Dirty Dan''s Bar', 'booking@dirtydansbar.com', 'None', 'https://www.facebook.com/dirtydansbar', 'Greensboro', 'NC', 'Dive bar and music venue hosting local and touring acts.', 250, ARRAY['original'], 'bar', true),
('3d4696ac-e750-4e27-a41e-454f6eddab40', 'Flat Iron', 'booking@flatirongreensboro.com', 'None', 'https://www.flatirongreensboro.com', 'Greensboro', 'NC', 'Downtown Greensboro venue featuring local and regional music.', 250, ARRAY['original'], 'bar', true),
('4d123bd8-372e-42e5-8851-2b28cd407c9a', 'The Grand GSO', 'info@thegrandgso.com', '336-272-4663', 'https://www.thegrandgso.com', 'Greensboro', 'NC', 'Historic theater in downtown Greensboro hosting concerts and events.', 1000, ARRAY['tribute'], 'venue', true),

-- Greenville venues
('56b8be49-3427-4c85-a128-755c378c5fe0', 'AJ McMurphy''s', 'info@ajmcmurphys.com', '252-551-9627', 'https://www.ajmcmurphys.com', 'Greenville', 'NC', 'Irish pub and restaurant with live music on weekends.', 250, ARRAY['singer songwriter', 'covers'], 'bar', true),
('1a336edc-758f-45d1-9676-0724cb88a269', 'Buccaneer Music Hall', 'booking@buccaneermusichall.com', 'None', 'https://www.buccaneermusichall.com', 'Greenville', 'NC', 'Mid-sized venue hosting national and regional touring acts.', 700, ARRAY['original', 'covers'], 'venue', true),
('313c31a1-4d73-40c0-9ff5-229c67879ea6', 'Pantana Bob''s', 'info@pantanabobs.com', '252-757-1777', 'https://www.pantanabobs.com', 'Greenville', 'NC', 'College town bar featuring live music and DJ nights.', 350, ARRAY['covers'], 'bar', true),
('78b13aa0-5659-4bea-b09d-aca633c01b0d', 'State Theatre', 'info@statetheatrenc.com', '252-208-7779', 'https://www.statetheatrenc.com', 'Greenville', 'NC', 'Historic theater hosting concerts, comedy, and special events.', 500, ARRAY['original', 'covers'], 'venue', true),

-- Hope Mills venues
('2bde05f1-7e65-4177-85a6-80b4bd709422', 'Dirtbag Ales', 'events@dirtbagales.com', '910-426-9016', 'https://www.dirtbagales.com', 'Hope Mills', 'NC', 'Craft brewery with outdoor space hosting live music and food trucks.', 200, ARRAY['singer songwriter'], 'brewery', true),

-- New Bern venues
('1e9a9ca9-8246-48bd-8d86-81ba0669ab76', 'Baxter''s 1892', 'info@baxters1892.com', '252-638-5595', 'https://www.baxters1892.com', 'New Bern', 'NC', 'Historic restaurant and bar with live music in downtown New Bern.', 150, ARRAY['singer songwriter'], 'venue', true),
('ba5bb92d-5256-4208-90bc-1ff5d69f3fa7', 'The Brown Pelican', 'info@thebrownpelican.com', '252-637-2525', 'https://www.thebrownpelican.com', 'New Bern', 'NC', 'Waterfront bar featuring live music and outdoor seating.', 200, ARRAY['singer songwriter'], 'bar', true),

-- Pinehurst venues
('744ff280-1203-4348-8a14-8e8d930ca0f5', 'Drum and Quill', 'booking@drumandquill.com', 'None', 'https://www.drumandquill.com', 'Pinehurst', 'NC', 'Intimate venue in historic Pinehurst hosting singer-songwriters and small acts.', 125, ARRAY['singer songwriter'], 'bar', true),

-- Pittsboro venues
('872e5188-ff92-46bd-bac7-3e5cb8d6fa57', 'BMC Brewing', 'events@bmcbrewing.com', '919-533-9977', 'https://www.bmcbrewing.com', 'Pittsboro', 'NC', 'Craft brewery with live music and food truck events.', 150, ARRAY['singer songwriter'], 'brewery', true),

-- Raleigh venues
('6bc94c59-4a2f-48e8-b59f-60563c083852', 'Blackbird Beer', 'info@blackbirdraleigh.com', 'None', 'https://www.blackbirdraleigh.com', 'Raleigh', 'NC', 'Beer garden and bar with live music in downtown Raleigh.', 200, ARRAY['original', 'singer songwriter'], 'bar', true),
('8395fa7b-9a94-4397-ac1d-2ceafa7e0265', 'Bowstring', 'booking@bowstringraleigh.com', '919-803-0520', 'https://www.bowstringraleigh.com', 'Raleigh', 'NC', 'Intimate music venue in downtown Raleigh featuring singer-songwriters.', 150, ARRAY['singer songwriter'], 'bar', true),
('40cc6872-c4eb-44ba-80a2-e12e81be858c', 'Compass Rose Brewery', 'events@compassrosebrewery.com', '919-803-2290', 'https://www.compassrosebrewery.com', 'Raleigh', 'NC', 'Craft brewery in North Raleigh with live music events.', 200, ARRAY['singer songwriter'], 'brewery', true),
('e98cbb9e-dd53-4b8b-b13a-54b59f951ae8', 'Gizmo Brew Works', 'events@gizmobrewworks.com', '919-251-9381', 'https://www.gizmobrewworks.com', 'Raleigh', 'NC', 'Craft brewery in Five Points with regular live music.', 200, ARRAY['original', 'singer songwriter'], 'brewery', true),
('70381293-1343-44bb-a432-efaa70939ee5', 'Kings', 'info@kingsraleigh.com', '919-719-8611', 'https://www.kingsraleigh.com', 'Raleigh', 'NC', 'Downtown Raleigh venue and restaurant featuring live music and DJ nights.', 600, ARRAY['original', 'covers'], 'bar', true),
('88cc8f0d-41d5-4d8d-8a5c-148d03de76a5', 'Lincoln Theatre', 'info@lincolntheatre.com', '919-821-4111', 'https://www.lincolntheatre.com', 'Raleigh', 'NC', 'Historic theater on Wilmington Street hosting concerts and performing arts.', 700, ARRAY['tribute'], 'venue', true),
('1c344467-6d2f-4d03-a709-347d08f0f0a9', 'Raleigh Brewing Company', 'events@raleighbrewingcompany.com', '919-803-7887', 'https://www.raleighbrewingcompany.com', 'Raleigh', 'NC', 'Craft brewery with outdoor beer garden hosting live music.', 300, ARRAY['singer songwriter'], 'brewery', true),
('09e9a0a1-d663-43cc-afe6-11d9391b2cfb', 'Tap Yard', 'events@tapyardraleigh.com', 'None', 'https://www.tapyardraleigh.com', 'Raleigh', 'NC', 'Outdoor beer garden and event space with live music.', 400, ARRAY['covers'], 'venue', true),
('f19f5157-c28c-49a9-a3d5-43f0b0cfb6df', 'The Pour House', 'booking@thepourhousemusichall.com', '919-821-1120', 'https://www.thepourhousemusichall.com', 'Raleigh', 'NC', 'Long-running Raleigh venue hosting rock and alternative acts.', 600, ARRAY['original'], 'bar', true),
('ea78c632-2e45-49c1-9341-c72bd1c2f3c4', 'Tin Roof', 'raleigh@tinroof.com', '919-747-4930', 'https://www.tinroof.com/raleigh', 'Raleigh', 'NC', 'Live music venue and restaurant featuring local and touring acts.', 500, ARRAY['original', 'covers'], 'bar', true),
('8148acde-4e35-4503-8e59-cb2cdcc9f653', 'Transfer Co Ballroom', 'booking@transfercoballroom.com', '919-900-5070', 'https://www.transfercoballroom.com', 'Raleigh', 'NC', 'Historic ballroom venue in downtown Raleigh hosting concerts and events.', 900, ARRAY['original'], 'venue', true),
('f1b512d7-c9cd-4d6f-954e-ea207dd471cb', 'Westin Raleigh (Rooftop)', 'events@westinraleigh.com', 'None', 'https://www.marriott.com/hotels/travel/rduwi-the-westin-raleigh-durham-airport-brier-creek', 'Raleigh', 'NC', 'Rooftop venue at downtown Westin hotel with live music events.', 200, ARRAY['singer songwriter'], 'venue', true),
('dc0c076b-3222-4365-ad15-91f82ae173be', 'Whiskey Rose', 'booking@whiskeyroseraleigh.com', 'None', 'https://www.whiskeyroseraleigh.com', 'Raleigh', 'NC', 'Dive bar in downtown Raleigh hosting local and touring rock acts.', 250, ARRAY['original', 'covers'], 'bar', true),

-- Rocky Mount venues
('456a3926-3155-4dc7-a939-4e2951c19a52', 'Rocky Mount Mills', 'events@rockymountmills.com', '252-883-1140', 'https://www.rockymountmills.com', 'Rocky Mount', 'NC', 'Historic mill complex hosting concerts and community events.', 500, ARRAY['singer songwriter'], 'venue', true),

-- Wake Forest venues
('1172535d-c2ce-4af7-8658-8fbd3f5fef29', 'Lonerider Brewing', 'events@loneriderbeer.com', '919-442-4699', 'https://www.loneriderbeer.com', 'Wake Forest', 'NC', 'Large craft brewery with outdoor stage and event space.', 300, ARRAY['original', 'covers'], 'brewery', true),
('f193e671-63cb-428c-8d03-838222938e17', 'Real McCoy''s', 'info@realmccoyswf.com', 'None', 'https://www.realmccoyswf.com', 'Wake Forest', 'NC', 'Bar and grill featuring live music on weekends.', 200, ARRAY['covers'], 'bar', true),
('3c32d910-3550-4307-86cb-e4aa58a9edcd', 'White Street Brewing', 'events@whitestreetbrewing.com', '919-570-9700', 'https://www.whitestreetbrewing.com', 'Wake Forest', 'NC', 'Downtown Wake Forest brewery with live music and food trucks.', 200, ARRAY['singer songwriter'], 'brewery', true),

-- Washington venues
('38376475-fdf2-423c-b8b9-518cb6ac7a24', 'Backwater Jacks Tiki Bar and Grill', 'info@backwaterjacks.com', '252-975-1828', 'https://www.backwaterjacks.com', 'Washington', 'NC', 'Waterfront tiki bar with live music and outdoor seating.', 200, ARRAY['original', 'covers'], 'bar', true),
('1c55bdce-bb4a-4251-a7c7-ce0756c834c9', 'The Mulberry House', 'info@themulberryhousenc.com', 'None', 'https://www.themulberryhousenc.com', 'Washington', 'NC', 'Historic restaurant featuring live music in downtown Washington.', 125, ARRAY['singer songwriter'], 'venue', true),

-- Wendell venues
('12dcd823-5aa5-420d-8b72-ad6516246d3f', 'Bearded Bee Brewing', 'events@beardedbeebrewing.com', '919-404-9663', 'https://www.beardedbeebrewing.com', 'Wendell', 'NC', 'Craft brewery with outdoor space hosting live music events.', 200, ARRAY['singer songwriter'], 'brewery', true),

-- Winston-Salem venues
('6af4038a-fe49-4911-9c66-8cd8df469286', 'The Ramkat', 'booking@theramkat.com', '336-793-0700', 'https://www.theramkat.com', 'Winston-Salem', 'NC', 'Premier music venue in Winston-Salem hosting national and regional acts.', 900, ARRAY['original'], 'venue', true),
('dab1217f-f3d1-4f6a-9b1e-9bed83a2ab25', 'Ziggy''s', 'booking@ziggysrocks.com', '336-480-8326', 'https://www.ziggysrocks.com', 'Winston-Salem', 'NC', 'Legendary Winston-Salem venue featuring rock and alternative music.', 700, ARRAY['original'], 'bar', true)

on conflict (id) do update set
  name = excluded.name,
  email = excluded.email,
  phone = excluded.phone,
  website = excluded.website,
  city = excluded.city,
  state = excluded.state,
  description = excluded.description,
  capacity = excluded.capacity,
  music_focus = excluded.music_focus,
  venue_type = excluded.venue_type,
  is_verified = excluded.is_verified,
  updated_at = now();

commit;
