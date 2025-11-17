#!/usr/bin/env python3
"""Generate enriched SQL seed script from venues CSV for NC venues"""

import csv
import json

def parse_json_array(value):
    """Parse JSON array string, return Python list"""
    if not value or value == 'null':
        return []
    try:
        return json.loads(value)
    except:
        return []

def escape_sql_string(value):
    """Escape single quotes for SQL"""
    if value is None or value == 'null':
        return None
    return value.replace("'", "''")

def clean_value(value):
    """Clean and validate a value, return None for empty/invalid"""
    if not value or value in ['null', '', 'None', 'undefined']:
        return None
    return value

def format_sql_value(value):
    """Format a value for SQL, handling None/null properly"""
    if value is None:
        return 'null'
    return f"'{escape_sql_string(str(value))}'"

def format_array(items):
    """Format Python list as PostgreSQL array"""
    if not items:
        return "ARRAY[]::text[]"
    escaped = [f"'{escape_sql_string(str(item))}'" for item in items]
    return f"ARRAY[{', '.join(escaped)}]"

# Enriched descriptions for well-known venues
ENRICHED_DESCRIPTIONS = {
    'The Pour House': 'Iconic Raleigh music venue operating since 1993. Known for hosting both emerging and established artists across rock, indie, and alternative genres. Features a full bar, stage, and intimate atmosphere.',
    'Lincoln Theatre': 'Historic theater in downtown Raleigh featuring diverse programming from concerts to comedy. Beautifully restored venue with excellent acoustics and classic architecture.',
    'Transfer Co Ballroom': 'Stunning historic ballroom venue in downtown Raleigh. Features soaring ceilings, elegant architecture, and hosts concerts, weddings, and special events.',
    'Motorco': 'Premier music hall in Durham featuring multiple spaces including a showroom, garage bar, and outdoor patio. Full bar and restaurant with diverse programming.',
    'The Orange Peel': 'Legendary Asheville music venue that has hosted countless national acts. Known for its intimate setting and excellent sound quality.',
    'Neighborhood Theatre': 'Mid-sized venue in Charlotte\'s NoDa arts district. Has been a staple of the Charlotte music scene for decades, hosting touring and local acts.',
}

# Enhanced music focus based on venue type and characteristics
VENUE_TYPE_DEFAULT_GENRES = {
    'bar': ['rock', 'blues', 'country', 'covers'],
    'brewery': ['indie', 'folk', 'acoustic', 'singer songwriter'],
    'venue': ['rock', 'indie', 'alternative', 'original'],
    'theater': ['jazz', 'blues', 'folk', 'original'],
    'club': ['rock', 'punk', 'metal', 'electronic'],
    'amphitheater': ['rock', 'country', 'alternative'],
    'winery': ['jazz', 'acoustic', 'folk'],
    'restaurant': ['jazz', 'acoustic', 'covers'],
}

# Enriched music focus for well-known venues
ENRICHED_MUSIC_FOCUS = {
    'The Pour House': ['rock', 'indie', 'alternative', 'punk', 'original'],
    'Lincoln Theatre': ['rock', 'indie', 'folk', 'jazz', 'original'],
    'Transfer Co Ballroom': ['rock', 'indie', 'electronic', 'original'],
    'Motorco': ['rock', 'indie', 'alternative', 'original'],
    'The Orange Peel': ['rock', 'indie', 'alternative', 'jam band', 'original'],
    'Neighborhood Theatre': ['rock', 'indie', 'metal', 'punk', 'original'],
    'Asheville Music Hall': ['rock', 'jam band', 'bluegrass', 'original'],
    'Deep South the Bar': ['country', 'southern rock', 'americana', 'covers'],
    'The Kraken': ['metal', 'punk', 'hardcore', 'rock', 'original'],
    'Slim\'s Downtown': ['blues', 'rock', 'jazz', 'original'],
    'Spillway 421': ['rock', 'country', 'blues', 'covers'],
}

def main():
    csv_file = '/Users/daniel-sullivan/projects/gigseeker/supabase/seeds/venues.csv'

    nc_venues = []

    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Only include NC venues
            if row['state'] != 'NC':
                continue

            # Skip permanently closed or rejected venues
            if row['permanently_closed'] == 'true' or row['rejected'] == 'true':
                continue

            nc_venues.append(row)

    # Sort by city then name
    nc_venues.sort(key=lambda x: (x['city'], x['title']))

    print("-- =====================================================")
    print("-- NORTH CAROLINA MUSIC VENUES - ENRICHED SEED DATA")
    print("-- =====================================================")
    print(f"-- Total NC venues: {len(nc_venues)}")
    print("-- Generated with enriched descriptions, proper null handling,")
    print("-- and complete venue information")
    print()
    print("begin;")
    print()
    print("insert into public.venues (")
    print("  id,")
    print("  name,")
    print("  email,")
    print("  phone,")
    print("  website,")
    print("  city,")
    print("  state,")
    print("  description,")
    print("  capacity,")
    print("  music_focus,")
    print("  venue_type,")
    print("  is_verified")
    print(") values")

    current_city = None
    for i, venue in enumerate(nc_venues):
        # Add city header comment
        if venue['city'] != current_city:
            if i > 0:
                print()
            print(f"-- {venue['city']}, NC venues")
            current_city = venue['city']

        # Parse fields
        venue_id = venue['id']
        name = escape_sql_string(venue['title'])

        # Email - use booking_email
        email = clean_value(venue['booking_email'])

        # Phone
        phone = clean_value(venue['phone'])

        # Website
        website = clean_value(venue['website'])

        city = escape_sql_string(venue['city'])
        state = escape_sql_string(venue['state'])

        # Description - enrich if available
        description = clean_value(venue['description'])
        if venue['title'] in ENRICHED_DESCRIPTIONS:
            description = ENRICHED_DESCRIPTIONS[venue['title']]
        elif not description:
            # Generate description based on venue type and city
            venue_type_desc = venue['venue_type'].replace('_', ' ').title() if venue['venue_type'] else 'Music venue'
            city_name = venue['city']

            # Add specific details based on type
            if venue['venue_type'] == 'brewery':
                description = f"Craft brewery in {city_name}, NC with live music and events. Great atmosphere with local beers and regular performances."
            elif venue['venue_type'] == 'bar':
                description = f"Live music bar in {city_name}, NC featuring local and touring acts. Full bar and great atmosphere."
            elif venue['venue_type'] == 'venue':
                description = f"Music venue in {city_name}, NC hosting concerts and live performances. Quality sound and production."
            elif venue['venue_type'] == 'theater':
                description = f"Theater in {city_name}, NC featuring concerts, performing arts, and special events."
            else:
                description = f"{venue_type_desc} in {city_name}, NC featuring live music and entertainment."

        # Capacity - use capacity_max
        capacity = venue['capacity_max'] if clean_value(venue['capacity_max']) else None

        # Music focus - enrich and normalize
        venue_name = venue['title']
        venue_type_raw = venue['venue_type'].lower() if venue['venue_type'] else 'other'

        # Start with enriched genres if available for this venue
        if venue_name in ENRICHED_MUSIC_FOCUS:
            music_focus = ENRICHED_MUSIC_FOCUS[venue_name]
        else:
            # Parse from CSV
            music_focus = parse_json_array(venue['music_focus'])

            # Normalize to lowercase
            music_focus = [g.lower().strip() for g in music_focus if g]

            # If empty or minimal, add defaults based on venue type
            if len(music_focus) < 2:
                venue_type_for_defaults = venue_type_raw if venue_type_raw in VENUE_TYPE_DEFAULT_GENRES else 'bar'
                defaults = VENUE_TYPE_DEFAULT_GENRES.get(venue_type_for_defaults, ['rock', 'covers'])

                # Merge existing with defaults (no duplicates)
                existing_set = set(music_focus)
                for genre in defaults:
                    if genre not in existing_set:
                        music_focus.append(genre)

        # Final normalization pass - ensure all lowercase and deduplicate
        normalized_focus = []
        seen = set()
        for genre in music_focus:
            genre_normalized = genre.lower().strip()
            if genre_normalized and genre_normalized not in seen:
                normalized_focus.append(genre_normalized)
                seen.add(genre_normalized)

        music_focus_sql = format_array(normalized_focus)

        # Venue type
        valid_types = ['bar', 'brewery', 'winery', 'club', 'theater', 'amphitheater',
                       'stadium', 'festival', 'restaurant', 'hotel', 'coffee_shop', 'venue', 'other']
        venue_type = venue['venue_type'].lower() if venue['venue_type'] else 'other'
        if venue_type not in valid_types:
            venue_type = 'other'

        # Is verified
        is_verified = 'true' if venue['is_verified_music_venue'] == 'true' else 'false'

        # Build SQL values
        values = [
            f"'{venue_id}'",
            f"'{name}'",
            format_sql_value(email),
            format_sql_value(phone),
            format_sql_value(website),
            f"'{city}'",
            f"'{state}'",
            format_sql_value(description),
            str(capacity) if capacity else 'null',
            music_focus_sql,
            f"'{venue_type}'",
            is_verified
        ]

        # Determine if this is the last venue
        is_last = (i == len(nc_venues) - 1)
        terminator = '' if is_last else ','

        print(f"({', '.join(values)}){terminator}")

    print()
    print("on conflict (id) do update set")
    print("  name = excluded.name,")
    print("  email = excluded.email,")
    print("  phone = excluded.phone,")
    print("  website = excluded.website,")
    print("  city = excluded.city,")
    print("  state = excluded.state,")
    print("  description = excluded.description,")
    print("  capacity = excluded.capacity,")
    print("  music_focus = excluded.music_focus,")
    print("  venue_type = excluded.venue_type,")
    print("  is_verified = excluded.is_verified,")
    print("  updated_at = now();")
    print()
    print("commit;")
    print()
    print("-- =====================================================")
    print("-- Venue Summary by City:")
    print("-- =====================================================")

    # Count by city
    city_counts = {}
    for venue in nc_venues:
        city = venue['city']
        city_counts[city] = city_counts.get(city, 0) + 1

    for city in sorted(city_counts.keys()):
        print(f"-- {city}: {city_counts[city]} venues")

if __name__ == '__main__':
    main()
