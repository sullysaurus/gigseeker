#!/usr/bin/env python3
"""
Script to clean venues.csv - remove duplicates and identify missing data
"""

import csv
import json
from collections import defaultdict
from datetime import datetime

def normalize_name(name):
    """Normalize venue name for comparison"""
    # Remove common prefixes and punctuation for better matching
    name = name.lower().strip()
    name = name.replace("the ", "").replace("'", "").replace("'", "")
    name = name.replace(" music hall", "").replace(" music house", "")
    name = name.replace(" theatre", "").replace(" theater", "")
    name = name.replace(" tavern", "").replace(" bar", "").replace(" club", "")
    name = name.replace(" brewery", "").replace(" brewing", "")
    name = name.replace("  ", " ").strip()
    return name

def load_venues(filepath):
    """Load venues from CSV"""
    venues = []
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            venues.append(row)
    return venues

def find_duplicates(venues):
    """Find duplicate venues by name+city or email"""
    name_city_map = defaultdict(list)
    email_map = defaultdict(list)

    for idx, venue in enumerate(venues):
        # Check name + city
        if venue['name'] and venue['city']:
            key = f"{normalize_name(venue['name'])}|{venue['city'].lower()}"
            name_city_map[key].append((idx, venue))

        # Check email
        if venue['email'] and venue['email'] != 'null':
            email_map[venue['email'].lower()].append((idx, venue))

    duplicates = []

    # Find name+city duplicates
    for key, venue_list in name_city_map.items():
        if len(venue_list) > 1:
            duplicates.append(('name_city', venue_list))

    # Find email duplicates
    for email, venue_list in email_map.items():
        if len(venue_list) > 1:
            duplicates.append(('email', venue_list))

    return duplicates

def analyze_missing_data(venues):
    """Analyze missing fields"""
    missing_stats = defaultdict(int)
    total = len(venues)

    important_fields = ['email', 'phone', 'website', 'address', 'zip_code', 'capacity']

    for venue in venues:
        for field in important_fields:
            if not venue.get(field) or venue.get(field) == 'null':
                missing_stats[field] += 1

    return {field: (count, f"{count/total*100:.1f}%") for field, count in missing_stats.items()}

def merge_venue_data(existing, new_venue):
    """Merge two venue records, preferring non-null values"""
    merged = existing.copy()

    for key, value in new_venue.items():
        if key in ['id', 'created_at', 'updated_at']:
            # Keep original ID and timestamps
            continue

        # If existing field is empty/null and new field has data, use new data
        if (not merged.get(key) or merged.get(key) == 'null') and value and value != 'null':
            merged[key] = value

        # For capacity, use the larger number
        elif key == 'capacity' and value and value != 'null':
            try:
                existing_cap = int(merged.get('capacity', 0) or 0)
                new_cap = int(value)
                if new_cap > existing_cap:
                    merged['capacity'] = str(new_cap)
            except:
                pass

        # For music_focus, merge genre arrays
        elif key == 'music_focus' and value and value != 'null':
            try:
                existing_genres = set(json.loads(merged.get('music_focus', '[]')))
                new_genres = set(json.loads(value))
                merged_genres = list(existing_genres | new_genres)
                if merged_genres:
                    merged['music_focus'] = json.dumps(sorted(merged_genres))
            except:
                pass

    return merged

def deduplicate_venues(venues):
    """Remove duplicates, merging all data from duplicate records"""
    seen_name_city = {}
    seen_email = {}
    clean_venues = []
    removed = []

    for venue in venues:
        # Create keys
        name_city_key = f"{normalize_name(venue['name'])}|{venue['city'].lower()}" if venue['name'] and venue['city'] else None
        email_key = venue['email'].lower() if venue['email'] and venue['email'] != 'null' else None

        # Check if we've seen this venue
        is_duplicate = False

        if name_city_key and name_city_key in seen_name_city:
            existing = seen_name_city[name_city_key]
            # Merge the data from both records
            merged = merge_venue_data(existing, venue)

            # Update the existing venue in clean_venues
            idx = clean_venues.index(existing)
            clean_venues[idx] = merged
            seen_name_city[name_city_key] = merged
            if email_key:
                seen_email[email_key] = merged

            removed.append(venue)
            is_duplicate = True

        elif email_key and email_key in seen_email:
            existing = seen_email[email_key]
            # Merge the data from both records
            merged = merge_venue_data(existing, venue)

            # Update the existing venue in clean_venues
            idx = clean_venues.index(existing)
            clean_venues[idx] = merged
            if name_city_key:
                seen_name_city[name_city_key] = merged
            seen_email[email_key] = merged

            removed.append(venue)
            is_duplicate = True

        if not is_duplicate:
            # Set all venues to verified
            venue['is_verified'] = 'true'
            clean_venues.append(venue)
            if name_city_key:
                seen_name_city[name_city_key] = venue
            if email_key:
                seen_email[email_key] = venue

    # Ensure all venues are verified
    for venue in clean_venues:
        venue['is_verified'] = 'true'

    return clean_venues, removed

def main():
    input_file = 'supabase/seeds/venues.csv'

    print("Loading venues...")
    venues = load_venues(input_file)
    print(f"Total venues: {len(venues)}\n")

    print("Finding duplicates...")
    duplicates = find_duplicates(venues)
    print(f"Found {len(duplicates)} duplicate groups\n")

    for dup_type, dup_list in duplicates[:5]:  # Show first 5
        print(f"Duplicate ({dup_type}):")
        for idx, venue in dup_list:
            print(f"  - {venue['name']} ({venue['city']}) - {venue['email']}")
        print()

    print("Analyzing missing data...")
    missing = analyze_missing_data(venues)
    for field, (count, pct) in sorted(missing.items(), key=lambda x: x[1][0], reverse=True):
        print(f"  {field}: {count} missing ({pct})")
    print()

    print("Deduplicating...")
    clean_venues, removed = deduplicate_venues(venues)
    print(f"Cleaned venues: {len(clean_venues)}")
    print(f"Removed duplicates: {len(removed)}\n")

    # Save cleaned data
    output_file = 'supabase/seeds/venues_cleaned.csv'
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        if clean_venues:
            writer = csv.DictWriter(f, fieldnames=clean_venues[0].keys())
            writer.writeheader()
            writer.writerows(clean_venues)

    print(f"Cleaned data saved to: {output_file}")

    # Show removed venues
    print(f"\nRemoved {len(removed)} duplicate venues:")
    for venue in removed[:10]:  # Show first 10
        print(f"  - {venue['name']} ({venue['city']})")

if __name__ == '__main__':
    main()
