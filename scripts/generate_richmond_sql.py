#!/usr/bin/env python3
"""
Generate SQL script to insert Richmond venues into Supabase
"""

import csv
import json

def escape_sql_string(s):
    """Escape string for SQL"""
    if not s or s == 'null':
        return 'NULL'
    # Escape single quotes
    s = s.replace("'", "''")
    return f"'{s}'"

def normalize_venue_type(vtype):
    """Normalize venue_type to match schema constraints"""
    if not vtype or vtype == 'null':
        return 'NULL'

    # Schema allows: 'bar', 'club', 'theater', 'amphitheater', 'stadium', 'festival', 'other'
    vtype = vtype.lower().strip()

    mapping = {
        'venue': "'other'",
        'brewery': "'bar'",
        'winery': "'bar'",
        'restaurant': "'bar'",
        'coffee_shop': "'other'",
        'bar': "'bar'",
        'club': "'club'",
        'theater': "'theater'",
        'theatre': "'theater'",
        'amphitheater': "'amphitheater'",
        'stadium': "'stadium'",
        'festival': "'festival'",
        'other': "'other'",
    }

    return mapping.get(vtype, "'other'")

def parse_json_array(s):
    """Parse JSON array string and convert to PostgreSQL text array"""
    if not s or s == 'null':
        return 'NULL'
    try:
        # It's already a valid JSON string
        arr = json.loads(s)
        # Convert to lowercase for consistency
        arr = [genre.lower() for genre in arr]
        # Format as PostgreSQL array: ARRAY['item1', 'item2']
        escaped_items = [item.replace("'", "''") for item in arr]
        items_str = ', '.join(f"'{item}'" for item in escaped_items)
        return f"ARRAY[{items_str}]::text[]"
    except:
        return 'NULL'

def generate_sql(csv_file, output_file):
    """Generate SQL INSERT statements"""

    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        venues = list(reader)

    sql_lines = []
    sql_lines.append("-- Richmond, VA Venues Insert Script")
    sql_lines.append("-- 50 venues with complete data")
    sql_lines.append(f"-- Total venues: {len(venues)}")
    sql_lines.append("-- Generated: " + str(__import__('datetime').datetime.now()))
    sql_lines.append("")
    sql_lines.append("BEGIN;")
    sql_lines.append("")

    # Group by city for better organization
    by_city = {}
    for venue in venues:
        city = venue.get('city', 'Unknown')
        if city not in by_city:
            by_city[city] = []
        by_city[city].append(venue)

    for city in sorted(by_city.keys()):
        state = by_city[city][0].get('state', 'VA')
        sql_lines.append(f"-- {city}, {state} venues ({len(by_city[city])} venues)")

        for venue in by_city[city]:
            # Build INSERT statement
            fields = []
            values = []

            # Basic info
            if venue.get('name'):
                fields.append('name')
                values.append(escape_sql_string(venue['name']))

            if venue.get('email') and venue['email'] != 'null':
                fields.append('email')
                values.append(escape_sql_string(venue['email']))

            if venue.get('phone') and venue['phone'] != 'null':
                fields.append('phone')
                values.append(escape_sql_string(venue['phone']))

            if venue.get('website') and venue['website'] != 'null':
                fields.append('website')
                values.append(escape_sql_string(venue['website']))

            # Location
            if venue.get('address') and venue['address'] != 'null':
                fields.append('address')
                values.append(escape_sql_string(venue['address']))

            if venue.get('city'):
                fields.append('city')
                values.append(escape_sql_string(venue['city']))

            if venue.get('state'):
                fields.append('state')
                values.append(escape_sql_string(venue['state']))

            if venue.get('zip_code') and venue['zip_code'] != 'null':
                fields.append('zip_code')
                values.append(escape_sql_string(venue['zip_code']))

            if venue.get('country'):
                fields.append('country')
                values.append(escape_sql_string(venue['country']))

            # Details
            if venue.get('description') and venue['description'] != 'null':
                fields.append('description')
                values.append(escape_sql_string(venue['description']))

            if venue.get('capacity') and venue['capacity'] != 'null':
                fields.append('capacity')
                values.append(venue['capacity'])

            # Music Focus (text array)
            if venue.get('music_focus') and venue['music_focus'] != 'null':
                fields.append('music_focus')
                values.append(parse_json_array(venue['music_focus']))

            if venue.get('venue_type') and venue['venue_type'] != 'null':
                fields.append('venue_type')
                values.append(normalize_venue_type(venue['venue_type']))

            if venue.get('instagram_handle') and venue['instagram_handle'] != 'null':
                fields.append('instagram_handle')
                values.append(escape_sql_string(venue['instagram_handle']))

            if venue.get('facebook_url') and venue['facebook_url'] != 'null':
                fields.append('facebook_url')
                values.append(escape_sql_string(venue['facebook_url']))

            if venue.get('is_verified'):
                fields.append('is_verified')
                values.append('true' if venue['is_verified'].lower() == 'true' else 'false')

            # Build INSERT (using email as conflict key since we don't have IDs yet)
            insert_sql = f"INSERT INTO public.venues ({', '.join(fields)})\n"
            insert_sql += f"VALUES ({', '.join(values)})\n"
            insert_sql += "ON CONFLICT (email) DO UPDATE SET\n"

            # Update existing records with new data
            updates = []
            for i, field in enumerate(fields):
                if field != 'id' and field != 'email' and field != 'created_at':
                    updates.append(f"  {field} = EXCLUDED.{field}")

            insert_sql += ',\n'.join(updates) + ";"

            sql_lines.append(insert_sql)
            sql_lines.append("")

    sql_lines.append("COMMIT;")
    sql_lines.append("")
    sql_lines.append("-- Verify results")
    sql_lines.append("SELECT city, state, COUNT(*) as venue_count")
    sql_lines.append("FROM public.venues")
    sql_lines.append("WHERE state = 'VA'")
    sql_lines.append("GROUP BY city, state")
    sql_lines.append("ORDER BY venue_count DESC;")

    # Write to file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_lines))

    print(f"✅ SQL script generated: {output_file}")
    print(f"   Total venues: {len(venues)}")
    print(f"   Cities: {len(by_city)}")
    print(f"\n📋 To use:")
    print(f"   1. Copy the SQL from {output_file}")
    print(f"   2. Run it in your Supabase SQL editor")
    print(f"   3. Or run: psql <connection_string> -f {output_file}")

    # Also print to stdout
    print(f"\n{'='*80}")
    print("SQL READY TO COPY:")
    print(f"{'='*80}\n")
    print('\n'.join(sql_lines))

if __name__ == '__main__':
    generate_sql(
        'richmond_venues_50.csv',
        'richmond_venues_insert.sql'
    )
