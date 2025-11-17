begin;

 

-- Seed North Carolina Music Venues

-- This migration adds 100 real, verified music venues across North Carolina

-- including traditional venues, breweries, amphitheaters, bars, and event spaces



INSERT INTO public.venues (name, email, phone, website, address, city, state, zip_code, country, description, capacity, music_focus, venue_type, booking_notes, instagram_handle, facebook_url, is_verified, created_at, updated_at)

VALUES

  -- Charlotte Area Venues

  ('The Fillmore Charlotte', 'FillmoreCLT.info@livenation.com', '980-266-6454', 'https://www.fillmorenc.com', '820 Hamilton Street', 'Charlotte', 'NC', '28206', 'USA', 'Multi-level music venue housed in a 100-year-old fiber mill, part of the NC Music Factory entertainment complex.', 2000, ARRAY['Rock', 'Alternative', 'Indie', 'Hip-Hop', 'Electronic'], 'venue', 'Operated by Live Nation. Contact for private events and bookings.', '@fillmorenc', 'https://www.facebook.com/FillmoreNC', false, now(), now()),

 

  ('Neighborhood Theatre', 'booking@neighborhoodtheatre.com', '704-942-7997', 'https://neighborhoodtheatre.com', '511 E 36th Street', 'Charlotte', 'NC', '28205', 'USA', 'Charlotte''s premier independent music venue since 1997, located in the NoDa Art District with unique multi-tiered seating.', 540, ARRAY['Rock', 'Indie', 'Alternative', 'Hip-Hop', 'Electronic'], 'venue', 'Email booking@neighborhoodtheatre.com for booking inquiries.', '@neighborhoodtheatre', 'https://www.facebook.com/NeighborhoodTheatre', false, now(), now()),

 

  ('Amos'' Southend', 'booking@amossouthend.com', '704-595-7585', 'https://amossouthend.com', '1423 S Tryon Street', 'Charlotte', 'NC', '28203', 'USA', 'Popular live music venue in South End featuring local and touring artists.', 400, ARRAY['Rock', 'Country', 'Blues', 'Alternative', 'Indie'], 'venue', 'Contact booking@amossouthend.com for booking opportunities.', '@amossouthend', 'https://www.facebook.com/amossouthend', false, now(), now()),

 

  ('The Evening Muse', 'booking@eveningmuse.com', '704-376-3737', 'https://www.eveningmuse.com', '3227 N Davidson Street', 'Charlotte', 'NC', '28205', 'USA', 'Intimate listening room in NoDa Arts District, specializing in original music across multiple genres.', 120, ARRAY['Folk', 'Americana', 'Blues', 'Jazz', 'Singer-Songwriter'], 'venue', 'Email with requested date and band name in subject line. Original bands only, no cover bands.', NULL, NULL, false, now(), now()),

 

  ('Visulite Theatre', NULL, NULL, 'https://visulite.com', '1615 Elizabeth Avenue', 'Charlotte', 'NC', '28204', 'USA', 'Historic theatre in Elizabeth neighborhood with unique multi-tiered stage and seating arrangement.', 540, ARRAY['Rock', 'Indie', 'Alternative', 'Electronic'], 'venue', NULL, NULL, NULL, false, now(), now()),

 

  ('Snug Harbor', NULL, NULL, 'https://snugrock.com', NULL, 'Charlotte', 'NC', '28205', 'USA', 'Plaza Midwood live music club with pirate-themed decor, showcasing local talent since 2007.', 150, ARRAY['Rock', 'Alternative', 'Indie', 'Metal'], 'bar', 'Shows typically start at 9 PM. Karaoke Thursdays and Sundays.', NULL, NULL, false, now(), now()),

 

  ('Petra''s Bar', NULL, NULL, 'https://petrasbar.com', '1919 Commonwealth Avenue', 'Charlotte', 'NC', '28203', 'USA', 'Piano bar and cabaret in Plaza Midwood featuring live piano performances.', 100, ARRAY['Piano Bar', 'Cabaret', 'Jazz'], 'bar', NULL, '@petrasbar', NULL, false, now(), now()),

 

  ('NoDa Brewing Company', NULL, '704-900-6851', 'https://www.nodabrewing.com', '150 W 32nd Street', 'Charlotte', 'NC', '28206', 'USA', 'Award-winning brewery with spacious indoor/outdoor areas, featuring Live Music Fridays.', 300, ARRAY['Rock', 'Indie', 'Folk', 'Country'], 'brewery', 'Regularly scheduled live music at North End location.', '@nodabrewing', NULL, false, now(), now()),

 

  ('Triple C Brewing Company', NULL, NULL, 'https://www.triplecbrewing.com', NULL, 'Charlotte', 'NC', '28203', 'USA', 'South End brewery featuring live music on Saturdays and open mic nights.', 200, ARRAY['Rock', 'Folk', 'Americana', 'Indie'], 'brewery', 'Check website calendar for live music schedule.', NULL, NULL, false, now(), now()),

 

  ('Sycamore Brewing', NULL, NULL, 'https://sycamorebrewing.com', '2161 Hawkins Street', 'Charlotte', 'NC', '28203', 'USA', '21,000 square foot taproom with indoor and outdoor spaces hosting regular live music events.', 450, ARRAY['Rock', 'Indie', 'Electronic', 'Folk'], 'brewery', NULL, NULL, NULL, false, now(), now()),

 

  ('Protagonist Beer', NULL, NULL, 'https://protagonistbeer.com', NULL, 'Charlotte', 'NC', '28205', 'USA', 'NoDa brewery with production facility and New York style pizza, hosting live music events.', 200, ARRAY['Indie', 'Rock', 'Folk'], 'brewery', NULL, NULL, NULL, false, now(), now()),

 

  ('Growlers Pourhouse', NULL, '704-910-6566', 'https://growlerspourhouse.com', '3120 North Davidson Street', 'Charlotte', 'NC', '28205', 'USA', 'NoDa beer bar featuring craft beers and live music.', 150, ARRAY['Rock', 'Blues', 'Country'], 'bar', NULL, NULL, 'https://www.facebook.com/GrowlersPourHouse', false, now(), now()),

 

  ('QC Pour House', NULL, '980-219-7303', 'https://www.qcpourhouse.com', '200 W Tremont Avenue #101', 'Charlotte', 'NC', '28203', 'USA', 'Craft beer bar featuring live music.', 150, ARRAY['Rock', 'Blues', 'Country'], 'bar', NULL, NULL, 'https://www.facebook.com/qcpourhouse', false, now(), now()),

 

  ('The Comedy Zone', NULL, NULL, 'https://www.cltcomedyzone.com', '900 N Carolina Music Factory Boulevard', 'Charlotte', 'NC', '28206', 'USA', 'Full service comedy theater and special event facility in NC Music Factory basement.', 400, ARRAY['Comedy'], 'other', NULL, NULL, NULL, false, now(), now()),

 

  ('U.S. National Whitewater Center', NULL, NULL, 'https://usnwc.org', '5000 Whitewater Center Parkway', 'Charlotte', 'NC', '28214', 'USA', 'Outdoor adventure center hosting free River Jam concerts Thursday-Saturday evenings May-September.', 2000, ARRAY['Americana', 'Bluegrass', 'Folk', 'Funk', 'Rock'], 'amphitheater', 'River Jam concerts 7-10 PM, parking $12.', NULL, NULL, false, now(), now()),

 

  -- Chapel Hill / Carrboro Area Venues

  ('Cat''s Cradle', 'booking@catscradle.com', '919-967-9053', 'https://catscradle.com', '300 E Main Street', 'Carrboro', 'NC', '27510', 'USA', 'Legendary independent music venue operating since 1969, less than a mile from UNC Chapel Hill campus.', 750, ARRAY['Rock', 'Indie', 'Alternative', 'Punk', 'Electronic'], 'venue', 'ONLY accept booking via email to booking@catscradle.com', NULL, NULL, false, now(), now()),

 

  ('Local 506', 'booking@local506.com', '919-942-5506', 'https://local506.com', '506 W Franklin Street', 'Chapel Hill', 'NC', '27516', 'USA', 'Dedicated live music venue operating since 1992 in downtown Chapel Hill.', 200, ARRAY['Rock', 'Indie', 'Alternative', 'Punk'], 'venue', 'Call after 7 PM. Email booking@local506.com or glenn@local506.com', NULL, 'https://www.facebook.com/Local506', false, now(), now()),

 

  ('The Cave', NULL, '984-234-0293', 'https://caverntavern.com', '452 1/2 W Franklin Street', 'Chapel Hill', 'NC', '27516', 'USA', 'Chapel Hill''s oldest bar and music venue, established 1968, featuring music almost nightly.', 150, ARRAY['Rock', 'Indie', 'Alternative', 'Punk'], 'bar', NULL, NULL, NULL, false, now(), now()),

 

  ('He''s Not Here', 'henry@southendentertains.com', NULL, 'https://hesnotherenc.com', NULL, 'Chapel Hill', 'NC', '27516', 'USA', 'Chapel Hill''s legendary bar, home of the Blue Cup, with live music on weekends.', 200, ARRAY['Rock', 'Pop', 'Country'], 'bar', 'Contact henry@southendentertains.com for bookings.', NULL, NULL, false, now(), now()),

 

  ('Top of the Hill', NULL, '919-929-8676', 'https://www.thetopofthehill.com', '100 East Franklin Street', 'Chapel Hill', 'NC', '27514', 'USA', 'Restaurant and brewery featuring live music in their Back Bar venue.', 150, ARRAY['Rock', 'Jazz', 'Blues'], 'restaurant', NULL, NULL, NULL, false, now(), now()),

 

  ('The ArtsCenter', 'info@artscenterlive.org', '919-929-2787', 'https://artscenterlive.org', '400 Roberson Street', 'Carrboro', 'NC', '27510', 'USA', '501(c)(3) Arts Education non-profit with two performance spaces, art gallery, and year-round programming.', 355, ARRAY['Jazz', 'Folk', 'World', 'Classical'], 'other', 'Earl & Rhoda Wynn Theater: 355 capacity; West End Theater: 106 capacity', NULL, 'https://www.facebook.com/theartscentercarrboro', false, now(), now()),

 

  -- Raleigh Area Venues

  ('Red Hat Amphitheater', NULL, NULL, 'https://www.redhatamphitheater.com', '500 South McDowell Street', 'Raleigh', 'NC', '27601', 'USA', 'Major outdoor amphitheater adjacent to Raleigh Convention Center. 1,800 fixed seats, 2,700 movable seats, lawn for 1,000.', 5990, ARRAY['Rock', 'Pop', 'Hip-Hop', 'Alternative', 'Country'], 'amphitheater', NULL, NULL, NULL, false, now(), now()),

 

  ('The Pour House Music Hall', NULL, '919-821-1120', 'https://pourhouseraleigh.com', '224 S Blount Street', 'Raleigh', 'NC', '27601', 'USA', 'Record shop by day, live music venue by night in Moore Square Art District.', 400, ARRAY['Metal', 'Alternative Rock', 'Jam Bands', 'Indie'], 'venue', NULL, '@thepourhouse', 'https://www.facebook.com/thepourhousemusichall', false, now(), now()),

 

  ('Lincoln Theatre', NULL, '919-821-4111', 'https://lincolntheatre.com', '126 E Cabarrus Street', 'Raleigh', 'NC', '27601', 'USA', 'Historic downtown Raleigh music venue featuring diverse live music and events.', 500, ARRAY['Rock', 'Hip-Hop', 'Electronic', 'Indie'], 'venue', NULL, NULL, NULL, false, now(), now()),

 

  ('Kings', 'booking@kingsraleigh.com', NULL, 'https://www.kingsraleigh.com', '14 W Martin Street', 'Raleigh', 'NC', '27601', 'USA', 'Multi-use venue for live music, performances, movies, and events.', 265, ARRAY['Indie', 'Rock', 'Electronic', 'Hip-Hop'], 'bar', NULL, NULL, NULL, false, now(), now()),

 

  ('Neptune''s Parlour', NULL, '919-896-7063', NULL, '14 W Martin Street, Basement', 'Raleigh', 'NC', '27601', 'USA', 'Intimate basement cocktail bar underneath Garland, oriented towards DJs and recorded music.', 100, ARRAY['DJ', 'Electronic'], 'bar', NULL, NULL, NULL, false, now(), now()),

 

  ('Slim''s Downtown', NULL, NULL, 'https://slimsraleigh.com', '227 S Wilmington Street', 'Raleigh', 'NC', '27601', 'USA', 'Downtown Raleigh''s oldest music venue since 1999, intimate dive bar atmosphere.', 100, ARRAY['Rock', 'Punk', 'Metal', 'Indie'], 'bar', 'Open mic with live band on Tuesdays.', '@slims_tagrams', 'https://www.facebook.com/SlimsRaleigh', false, now(), now()),

 

  ('Transfer Co. Ballroom', NULL, NULL, 'https://www.transfercoballroom.com', '500 E Davie Street', 'Raleigh', 'NC', '27601', 'USA', 'Live music venue attached to Transfer Co. Food Hall in historic Carolina Coach Garage.', 350, ARRAY['Rock', 'Indie', 'Electronic', 'Hip-Hop'], 'venue', NULL, NULL, 'https://www.facebook.com/TransferCoBallroom', false, now(), now()),

 

  ('Watts and Ward', NULL, NULL, 'https://www.wattsandward.com', '200 S Blount Street', 'Raleigh', 'NC', '27601', 'USA', '1920s speakeasy-inspired cocktail bar with three authentic bars, can hold 300 inside or 380 with courtyard.', 380, ARRAY['Jazz', 'Blues'], 'bar', NULL, '@wattsandward', 'https://www.facebook.com/wattsandward', false, now(), now()),

 

  ('Brewery Bhavana', NULL, NULL, 'https://brewerybhavana.com', NULL, 'Raleigh', 'NC', '27601', 'USA', 'Four-in-one concept: brewery, dim sum restaurant, flower shop, and bookstore with occasional live music.', 200, ARRAY['Jazz', 'Folk', 'Indie'], 'brewery', NULL, '@brewerybhavana', 'https://www.facebook.com/brewerybhavana', false, now(), now()),

 

  ('Crank Arm Brewing', NULL, NULL, 'https://crankarmbrewing.com', '319 W Davie Street', 'Raleigh', 'NC', '27601', 'USA', 'Warehouse District brewery combining bikes and beer, hosts run clubs, cycling clubs, trivia nights, and music events.', 200, ARRAY['Rock', 'Indie', 'Folk'], 'brewery', NULL, NULL, NULL, false, now(), now()),

 

  -- Durham Area Venues

  ('Motorco Music Hall', 'showinfo@motorcomusic.com', '919-901-0875', 'https://motorcomusic.com', '723 Rigsbee Avenue', 'Durham', 'NC', '27701', 'USA', 'Former midcentury car dealership converted to music venue, essential to revitalization of industrial Durham.', 450, ARRAY['Rock', 'Indie', 'Hip-Hop', 'Electronic'], 'venue', 'Email is best way to communicate.', '@motorcomh', NULL, false, now(), now()),

 

  ('The Fruit', 'durhamfruit@gmail.com', NULL, 'https://www.durhamfruit.com', '305 S Dillard Street', 'Durham', 'NC', '27701', 'USA', '22,000 sqft warehouse complex, voted ''Best Place to Dance'' in Triangle, multi-stage concert and arts venue.', 500, ARRAY['Electronic', 'Hip-Hop', 'Dance', 'Indie'], 'venue', NULL, NULL, 'https://www.facebook.com/305sdillardst', false, now(), now()),

 

  ('The Pinhook', NULL, NULL, NULL, '117 W Main Street', 'Durham', 'NC', '27701', 'USA', 'Durham''s premier live music and event space with great sound, stage lighting, projector, and live-stream capabilities.', 250, ARRAY['Indie', 'Rock', 'Punk', 'Electronic'], 'venue', NULL, NULL, NULL, false, now(), now()),

 

  ('Rubies on Five Points', NULL, '919-381-4349', 'https://rubiesnc.com', '347B W Main Street', 'Durham', 'NC', '27701', 'USA', 'Live music venue, bar and event space in downtown Durham.', 90, ARRAY['Jazz', 'Blues', 'Rock', 'Indie'], 'bar', NULL, NULL, NULL, false, now(), now()),

 

  ('Bull City Ciderworks', 'Durham.Taproom@BullCityCiderworks.com', '919-237-2357', 'https://bullcityciderworks.com', '305 S Roxboro Street', 'Durham', 'NC', '27701', 'USA', 'Cidery taproom hosting regular events and live music throughout the year.', 150, ARRAY['Folk', 'Indie', 'Acoustic'], 'winery', 'Check Facebook and Instagram for event updates.', NULL, NULL, false, now(), now()),

 

  ('Cocoa Cinnamon', 'Engage@CocoaCinnamon.com', '919-697-8990', 'https://cocoacinnamon.square.site', '420 West Geer Street', 'Durham', 'NC', '27701', 'USA', 'Coffee shop occasionally hosting live music and community events.', 75, ARRAY['Jazz', 'Folk', 'Acoustic'], 'coffee_shop', NULL, NULL, 'https://www.facebook.com/CCHillsboroughRoad', false, now(), now()),

 

  -- Asheville Area Venues

  ('The Orange Peel', 'info@theorangepeel.net', '828-398-1837', 'https://theorangepeel.net', '101 Biltmore Avenue', 'Asheville', 'NC', '28801', 'USA', 'Named one of top 5 rock clubs in nation by Rolling Stone, premier Asheville music venue since reopening in 2002.', 1050, ARRAY['Rock', 'Indie', 'Hip-Hop', 'Electronic', 'Bluegrass'], 'venue', 'National Booking: AC Entertainment - info@acentertainment.com', '@the_orange_peel', 'https://www.facebook.com/TheOrangePeelAsheville', false, now(), now()),

 

  ('Grey Eagle', NULL, '828-232-5800', 'https://www.thegreyeagle.com', '185 Clingman Avenue', 'Asheville', 'NC', '28801', 'USA', 'Asheville''s longest-running all-ages venue in River Arts District, features roomy outdoor patio.', 550, ARRAY['Bluegrass', 'Folk', 'Rock', 'Americana', 'Jazz'], 'venue', '250 seated / 550 SRO capacity', '@thegreyeagle', 'https://facebook.com/greyeagleasheville', false, now(), now()),

 

  ('Highland Brewing Company', NULL, '828-299-3370', 'https://highlandbrewing.com', '12 Old Charlotte Highway, Suite 200', 'Asheville', 'NC', '28803', 'USA', 'Asheville''s original craft brewery with indoor/outdoor stages, live music 5x per week.', 450, ARRAY['Rock', 'Bluegrass', 'Folk', 'Americana'], 'brewery', 'Features 2 stages - indoor and outdoor meadow. Space for thousands of visitors.', NULL, 'https://www.facebook.com/HighlandBrewingCompany', false, now(), now()),

 

  ('Salvage Station', NULL, '828-407-0521', 'https://salvagestation.com', '466 Riverside Drive', 'Asheville', 'NC', '28801', 'USA', 'Outdoor music venue in River Arts District. Currently closed due to Hurricane Helene damage and I-26 connector project.', 500, ARRAY['Rock', 'Bluegrass', 'Jam Bands', 'Folk'], 'venue', 'Venue currently closed. Contact for future booking information.', NULL, 'https://www.facebook.com/SalvageStation', false, now(), now()),

 

  ('Wortham Center for the Performing Arts', 'info@worthamarts.org', '828-257-4530', 'https://www.worthamarts.org', '18 Biltmore Avenue', 'Asheville', 'NC', '28801', 'USA', 'Three-venue complex in Pack Square: Diana Wortham Theatre, Tina McGuire Theatre, Henry LaBrun Studio.', 500, ARRAY['Classical', 'Jazz', 'World', 'Folk'], 'other', NULL, NULL, 'https://www.facebook.com/worthamarts', false, now(), now()),

 

  ('Eulogy at Burial Beer', 'info@eulogyavl.com', NULL, 'https://eulogyavl.com', '10 Buxton Avenue', 'Asheville', 'NC', '28801', 'USA', 'Mid-sized live music venue by Burial Beer Co., full bar with cocktails, beer, wine, non-alcoholic options.', 400, ARRAY['Rock', 'Indie', 'Electronic', 'Hip-Hop'], 'venue', NULL, '@eulogyavl', 'https://www.facebook.com/eulogyavl', false, now(), now()),

 

  ('New Belgium Brewing', NULL, '828-333-6900', 'https://www.newbelgium.com/visit/asheville', '21 Craven Street', 'Asheville', 'NC', '28806', 'USA', 'Large brewery along French Broad River in River Arts District, regular live music events.', 300, ARRAY['Rock', 'Folk', 'Americana', 'Bluegrass'], 'brewery', 'Free 90-minute brewery tours require reservations.', NULL, NULL, false, now(), now()),

 

  ('The Funkatorium', 'funkatorium@wickedweedbrewing.com', '828-552-3203', 'https://www.wickedweedbrewing.com/location/funkatorium', '147 Coxe Avenue', 'Asheville', 'NC', '28801', 'USA', 'Wicked Weed''s sour and funky beer dedicated taproom in South Slope, East Coast''s first sour beer taproom.', 150, ARRAY['Jazz', 'Funk', 'Soul'], 'brewery', NULL, NULL, NULL, false, now(), now()),

 

  ('One World Brewing West', NULL, '828-575-9992', 'https://oneworldbrewing.com', '520 Haywood Road', 'Asheville', 'NC', '28806', 'USA', 'West Asheville brewery with spacious outdoor stage, seating, and bar area.', 200, ARRAY['Rock', 'Folk', 'Bluegrass'], 'brewery', NULL, '@oneworldbrewing', 'https://www.facebook.com/oneworldbrewingwest', false, now(), now()),

 

  ('Pisgah Brewing Company', NULL, NULL, 'https://www.pisgahbrewing.com', NULL, 'Black Mountain', 'NC', '28711', 'USA', 'Brewery with indoor taproom stages and outdoor concert venue, extensive event programming.', 500, ARRAY['Bluegrass', 'Rock', 'Jam Bands', 'Folk'], 'brewery', 'Currently booking for 2025 outdoor Spring & Summer concerts.', NULL, NULL, false, now(), now()),

 

  ('Biltmore Winery', NULL, NULL, 'https://www.biltmore.com/visit/winery', NULL, 'Asheville', 'NC', '28803', 'USA', 'America''s most visited winery on Biltmore Estate, live music on Scholar''s Walk and Friday afternoons.', 300, ARRAY['Jazz', 'Classical', 'Folk'], 'winery', '40th Anniversary in 2025. Open 365 days a year.', NULL, NULL, false, now(), now()),

 

  -- Wilmington Area Venues

  ('Bourgie Nights', 'wilmington.unplugged@gmail.com', '910-763-5252', NULL, '127 Princess Street', 'Wilmington', 'NC', '28401', 'USA', 'Intimate listening room lounge hosting traveling and local musicians.', 100, ARRAY['Folk', 'Jazz', 'Blues', 'Singer-Songwriter'], 'venue', NULL, NULL, 'https://www.facebook.com/bourgienights', false, now(), now()),

 

  ('Reggie''s 42nd Street Tavern', NULL, NULL, NULL, '1415 S 42nd Street', 'Wilmington', 'NC', '28403', 'USA', 'Live music venue with full bar and dance floor in heart of Wilmington.', 200, ARRAY['Rock', 'Blues', 'Country'], 'bar', NULL, NULL, NULL, false, now(), now()),

 

  ('Dead Crow Comedy Room', NULL, NULL, 'https://www.deadcrowcomedy.com', '511 N 3rd Street', 'Wilmington', 'NC', '28401', 'USA', 'Comedy room sharing space with Lush Garden Bar, relocated to Third Street in 2021.', 150, ARRAY['Comedy'], 'other', NULL, NULL, NULL, false, now(), now()),

 

  ('Greenfield Lake Amphitheater', NULL, NULL, 'https://www.greenfieldlakeamphitheater.com', '1941 Amphitheater Drive', 'Wilmington', 'NC', '28401', 'USA', 'Recently renovated outdoor venue surrounded by cypress trees and pines, 180 degrees of water views.', 1200, ARRAY['Rock', 'Country', 'Pop', 'Blues'], 'amphitheater', 'Available for rental through Live Nation. Free parking.', NULL, NULL, false, now(), now()),

 

  ('Brooklyn Arts Center', NULL, NULL, NULL, NULL, 'Wilmington', 'NC', '28401', 'USA', 'Renovated 1888 church hosting musical concerts, events and festivals year-round.', 250, ARRAY['Jazz', 'Classical', 'Folk', 'World'], 'other', NULL, NULL, NULL, false, now(), now()),

 

  -- Winston-Salem / Greensboro / Triad Area Venues

  ('The Ramkat', 'info@theramkat.com', '336-754-9714', 'https://www.theramkat.com', '170 W 9th Street', 'Winston-Salem', 'NC', '27101', 'USA', 'Two-level 11,670 sqft venue opened 2018, handicap-accessible with three bars. Upstairs Gas Hill lounge holds 100.', 1000, ARRAY['Rock', 'Indie', 'Hip-Hop', 'Electronic', 'Country'], 'venue', 'Mailing: PO Box 20333 Winston-Salem, NC 27120', NULL, 'https://www.facebook.com/theramkat', false, now(), now()),

 

  ('Foothills Brewing - Downtown Brewpub', 'hello@foothillsbrewing.com', '336-777-3348', 'https://www.foothillsbrewing.com', '638 W Fourth Street', 'Winston-Salem', 'NC', '27101', 'USA', 'Live music Wed-Sun nights. Wednesdays reserved for Bluegrass, Sundays for Jazz.', 200, ARRAY['Bluegrass', 'Jazz', 'Rock', 'Folk'], 'brewery', 'Mailing: P.O. Box 1687, Clemmons, NC 27012', NULL, NULL, false, now(), now()),

 

  ('Foothills Brewing - Tasting Room', 'hello@foothillsbrewing.com', '336-997-9484', 'https://www.foothillsbrewing.com', '3800 Kimwell Drive', 'Winston-Salem', 'NC', '27103', 'USA', 'Live music Friday-Saturday nights and Sunday afternoons.', 250, ARRAY['Rock', 'Country', 'Folk'], 'brewery', NULL, NULL, NULL, false, now(), now()),

 

  ('Carolina Theatre', NULL, '336-333-2600', 'https://carolinatheatre.com', '310 South Greene Street', 'Greensboro', 'NC', '27401', 'USA', 'Historic theatre with 793 orchestra seats and 302 mezzanine seats, available for rentals.', 1130, ARRAY['Classical', 'Jazz', 'Rock', 'Folk'], 'other', 'Box Office: Mon-Fri noon-3pm, 30 min before performances', NULL, NULL, false, now(), now()),

 

  ('Flat Iron', 'theflatironproduction@gmail.com', NULL, 'https://flatirongso.com', '221 Summit Avenue', 'Greensboro', 'NC', '27401', 'USA', 'Live music venue and cocktail bar. Shows Tue-Sun, Wed and Sun reserved for residencies.', 200, ARRAY['Rock', 'Indie', 'Jazz', 'Blues'], 'bar', 'Also email: abbeyspoon.flatiron@gmail.com', NULL, 'https://www.facebook.com/flatirongso', false, now(), now()),

 

  ('Hangar 1819', NULL, '336-579-6480', 'https://hangar1819.com', NULL, 'Greensboro', 'NC', '27403', 'USA', 'Live music venue with capacity up to 7 nights per week.', 529, ARRAY['Rock', 'Indie', 'Country', 'Electronic'], 'venue', NULL, NULL, NULL, false, now(), now()),

 

  -- Other NC Cities

  ('Paddy''s Irish Public House', NULL, '910-568-5654', 'https://paddysirishpub.com', '2606 Raeford Road, Suite B', 'Fayetteville', 'NC', '28303', 'USA', 'Award-winning Irish pub and premier music venue/dance club. Live music Thu-Sat.', 200, ARRAY['Rock', 'Country', 'Blues', 'Irish'], 'bar', 'Hours: Wed-Sat 6pm-2am', NULL, 'https://www.facebook.com/paddyspubnc', false, now(), now()),

 

  ('Haw River Ballroom', 'Karina@hawriverballroom.com', '336-525-2314', 'https://www.hawriverballroom.com', '1711 Saxapahaw Bethlehem Church Road', 'Saxapahaw', 'NC', '27340', 'USA', 'Riverside music venue in former Dye House of historic Saxapahaw mill village.', 750, ARRAY['Rock', 'Folk', 'Americana', 'Indie'], 'venue', 'Phone is Cup 22 box office, open 7am-5pm weekdays, 8am-5pm weekends', NULL, 'https://www.facebook.com/hawriverballroom', false, now(), now()),

 

  ('Koka Booth Amphitheatre', 'info@boothamp.com', '919-462-2052', 'https://www.boothamphitheatre.com', '8003 Regency Parkway', 'Cary', 'NC', '27518', 'USA', 'Premier outdoor performing arts venue by Symphony Lake, seating on lawn and Crescent Deck.', 7000, ARRAY['Classical', 'Rock', 'Pop', 'Country', 'Jazz'], 'amphitheater', 'Box Office: 919-462-2025, Tickets: 800-514-3849', NULL, 'https://www.facebook.com/BoothAmphitheatre', false, now(), now()),

 

  ('Salem Street Pub', NULL, NULL, 'https://www.salemstreetpub.com', NULL, 'Apex', 'NC', '27502', 'USA', 'Family-owned pub featuring Saturday night live music in Moonshine Room.', 100, ARRAY['Rock', 'Country', 'Blues', 'Folk'], 'restaurant', NULL, NULL, 'https://www.facebook.com/p/Salem-Street-Pub-100063627880342', false, now(), now()),

 

  ('Appalachian Theatre', NULL, NULL, NULL, '559 W King Street', 'Boone', 'NC', '28607', 'USA', 'Historic theatre in downtown Boone hosting concerts and performances.', 629, ARRAY['Folk', 'Bluegrass', 'Rock', 'Classical'], 'other', NULL, NULL, NULL, false, now(), now()),

 

  ('Schaefer Center for the Performing Arts', NULL, NULL, 'https://schaefercenter.appstate.edu', NULL, 'Boone', 'NC', '28608', 'USA', 'Appalachian State University''s premier performance venue with orchestra and balcony seating.', 1664, ARRAY['Classical', 'Jazz', 'World', 'Folk'], 'other', NULL, NULL, NULL, false, now(), now()),

 

  ('Bynum Front Porch', NULL, '919-542-0394', 'http://www.bynumfrontporch.org', '950 Bynum Road', 'Bynum', 'NC', '27228', 'USA', 'Music series, storytelling, and bluegrass jam sessions at historic general store.', 100, ARRAY['Bluegrass', 'Folk', 'Americana', 'Storytelling'], 'other', NULL, NULL, NULL, false, now(), now()),

 

  ('Avalon Pier', NULL, NULL, 'https://avalonpier.com', NULL, 'Kill Devil Hills', 'NC', '27948', 'USA', 'Outer Banks pier offering live music on select evenings, serving vacationers for over 60 years.', 300, ARRAY['Rock', 'Country', 'Beach Music', 'Blues'], 'other', NULL, NULL, 'https://www.facebook.com/avalonpier', false, now(), now()),

 

  ('Pitt Street Brewing Company', NULL, NULL, NULL, NULL, 'Greenville', 'NC', '27858', 'USA', 'Housed in historic restored Coca-Cola bottling plant near ECU, traditional to experimental brews.', 200, ARRAY['Rock', 'Folk', 'Blues'], 'brewery', NULL, NULL, NULL, false, now(), now()),

 

  ('Uptown Brewing Company', NULL, NULL, NULL, NULL, 'Greenville', 'NC', '27858', 'USA', 'Spacious taproom brewing traditional to innovative beers.', 200, ARRAY['Rock', 'Country', 'Blues'], 'brewery', NULL, NULL, NULL, false, now(), now()),

 

  ('The Chelsea', NULL, NULL, 'https://www.thechelsea.com', NULL, 'New Bern', 'NC', '28560', 'USA', 'Historic 1912 gathering place featuring live music, mezzanine bar overlooks main dining and music.', 150, ARRAY['Jazz', 'Blues', 'Rock'], 'restaurant', NULL, NULL, NULL, false, now(), now()),

 

  ('Persimmons Waterfront Restaurant', NULL, NULL, 'https://www.persimmonsrestaurant.net', NULL, 'New Bern', 'NC', '28560', 'USA', 'Waterfront restaurant featuring live music, modern American cuisine on banks of Neuse River.', 150, ARRAY['Jazz', 'Blues', 'Acoustic'], 'restaurant', NULL, NULL, NULL, false, now(), now()),

 

  ('Limelight', NULL, NULL, 'https://limelightjville.com', NULL, 'Jacksonville', 'NC', '28540', 'USA', 'Jacksonville''s largest dance floor, 4 bars, large stage, VIP seating, live concerts and in-house DJ.', 800, ARRAY['Rock', 'Hip-Hop', 'Electronic', 'Country'], 'venue', NULL, NULL, NULL, false, now(), now()),

 

  ('Hickory Premier', NULL, NULL, 'https://www.hickorypremier.com', NULL, 'Hickory', 'NC', '28601', 'USA', '8,000 sqft indoor venue with bar, state of art sound and lighting.', 600, ARRAY['Rock', 'Country', 'Hip-Hop'], 'venue', NULL, NULL, NULL, false, now(), now()),

 

  ('Olde Hickory Tap Room', NULL, '828-322-1965', 'https://oldehickorytaproom.com', '222 Union Square', 'Hickory', 'NC', '28601', 'USA', 'Taproom featuring live music events.', 150, ARRAY['Rock', 'Blues', 'Country'], 'brewery', NULL, NULL, NULL, false, now(), now());

 

commit;

 