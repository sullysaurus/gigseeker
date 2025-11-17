#!/usr/bin/env python3
"""
Discover 50 venues in Richmond, VA with complete data using Claude + Web Search
"""

import os
import json
import anthropic
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def discover_richmond_venues():
    """Use Claude + Web Search to discover venues in Richmond, VA"""

    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

    city = "Richmond"
    state = "VA"
    limit = 50

    prompt = f"""You are a venue discovery assistant. Find live music venues in {city}, {state}.

**Task:**
Find {limit} music venues that host live performances (bands, artists, DJs, etc.) in {city}, {state}.

**Venue Types to Find:**
- Music clubs
- Bars with live music
- Concert halls
- Theaters
- Amphitheaters
- Breweries with live music
- Restaurants with live music stages
- Music festivals (recurring)

**Exclude:**
- Sports stadiums (unless they regularly host concerts)
- Movie theaters
- General event spaces without regular music programming

**Required Information for Each Venue (COMPLETE DATA):**
- Name (required)
- Email (booking/contact email - REQUIRED)
- Phone (REQUIRED)
- Website (REQUIRED)
- Address (street address with zip code - REQUIRED)
- Capacity (approximate if not exact - REQUIRED)
- Venue type (bar, club, theater, amphitheater, brewery, restaurant, etc.)
- Music genres they feature
- Brief description
- Social media (Instagram, Facebook if available)

**IMPORTANT:** Only include venues where you can find COMPLETE contact information (email, phone, website, full address with zip code). Skip venues with incomplete data.

**Return Format:**
Return a JSON array of venue objects. Only include venues you can verify exist and host live music with complete contact information.

Example:
[
  {{
    "name": "The Music Hall",
    "email": "booking@musichall.com",
    "phone": "(555) 123-4567",
    "website": "https://musichall.com",
    "address": "123 Main St",
    "city": "{city}",
    "state": "{state}",
    "zip_code": "23220",
    "capacity": 500,
    "venue_type": "club",
    "music_focus": ["rock", "indie", "alternative"],
    "description": "Live music venue featuring local and touring artists.",
    "instagram_handle": "@musichall",
    "facebook_url": "https://facebook.com/musichall",
    "confidence": 95
  }}
]

Return valid JSON only, no markdown formatting. Aim for {limit} venues with complete data."""

    print(f"🔍 Discovering venues in {city}, {state}...")
    print(f"   Target: {limit} venues with complete data\n")

    # Call Claude with web search
    message = client.messages.create(
        model='claude-sonnet-4-5-20250929',
        max_tokens=16000,
        messages=[{
            'role': 'user',
            'content': prompt
        }],
        # Enable web search
        tools=[{
            'type': 'web_search_20250305',
            'name': 'web_search',
        }],
    )

    # Extract discovered venues from Claude's response
    discovered_venues = []

    # Find text content in response
    for block in message.content:
        if block.type == 'text':
            try:
                # Try to parse JSON array from response
                text = block.text
                json_match = text[text.find('['):text.rfind(']')+1] if '[' in text and ']' in text else None
                if json_match:
                    discovered_venues = json.loads(json_match)
                    break
            except Exception as e:
                print(f"⚠️  Failed to parse JSON: {e}")
                print(f"Response text: {block.text[:500]}")

    # Filter venues with complete data
    complete_venues = []
    incomplete_venues = []

    required_fields = ['name', 'email', 'phone', 'website', 'address', 'zip_code', 'capacity']

    for venue in discovered_venues:
        missing_fields = []
        for field in required_fields:
            value = venue.get(field)
            if not value or value == '' or value == 'null' or value is None:
                missing_fields.append(field)

        if not missing_fields:
            complete_venues.append(venue)
        else:
            incomplete_venues.append({
                'venue': venue.get('name', 'Unknown'),
                'missing': missing_fields
            })

    # Print results
    print(f"✅ Found {len(complete_venues)} venues with COMPLETE data")
    print(f"⚠️  Found {len(incomplete_venues)} venues with incomplete data\n")

    if incomplete_venues:
        print("📊 Incomplete venues:")
        for item in incomplete_venues[:10]:
            print(f"   - {item['venue']}: missing {', '.join(item['missing'])}")
        if len(incomplete_venues) > 10:
            print(f"   ... and {len(incomplete_venues) - 10} more\n")

    # Save complete venues to JSON
    output_file = 'richmond_venues_complete.json'
    with open(output_file, 'w') as f:
        json.dump(complete_venues, f, indent=2)

    print(f"💾 Saved {len(complete_venues)} complete venues to {output_file}")

    # Print sample venues
    if complete_venues:
        print(f"\n📍 Sample venues found:")
        for venue in complete_venues[:5]:
            print(f"\n   {venue['name']}")
            print(f"   📧 {venue.get('email', 'N/A')}")
            print(f"   📞 {venue.get('phone', 'N/A')}")
            print(f"   🌐 {venue.get('website', 'N/A')}")
            print(f"   📍 {venue.get('address', 'N/A')}, {venue.get('city', 'N/A')}, {venue.get('state', 'N/A')} {venue.get('zip_code', 'N/A')}")
            print(f"   👥 Capacity: {venue.get('capacity', 'N/A')}")
            print(f"   🎵 Genres: {', '.join(venue.get('music_focus', []))}")

    # Generate CSV output
    csv_file = 'richmond_venues_complete.csv'
    with open(csv_file, 'w') as f:
        # Write header
        headers = ['name', 'email', 'phone', 'website', 'address', 'city', 'state', 'zip_code',
                   'capacity', 'venue_type', 'music_focus', 'description', 'instagram_handle',
                   'facebook_url', 'confidence']
        f.write(','.join(headers) + '\n')

        # Write venues
        for venue in complete_venues:
            row = []
            for header in headers:
                value = venue.get(header, '')
                # Handle arrays (music_focus)
                if isinstance(value, list):
                    value = json.dumps(value)
                # Escape quotes and commas
                value = str(value).replace('"', '""')
                if ',' in str(value) or '"' in str(value):
                    value = f'"{value}"'
                row.append(str(value))
            f.write(','.join(row) + '\n')

    print(f"💾 Saved {len(complete_venues)} complete venues to {csv_file}")

    # Print summary statistics
    print(f"\n📊 Data Completeness Summary:")
    print(f"   Total discovered: {len(discovered_venues)}")
    print(f"   Complete data: {len(complete_venues)}")
    print(f"   Incomplete data: {len(incomplete_venues)}")

    if complete_venues:
        # Calculate average confidence
        avg_confidence = sum(v.get('confidence', 0) for v in complete_venues) / len(complete_venues)
        print(f"   Average confidence: {avg_confidence:.1f}%")

        # Count venue types
        venue_types = {}
        for venue in complete_venues:
            vtype = venue.get('venue_type', 'unknown')
            venue_types[vtype] = venue_types.get(vtype, 0) + 1

        print(f"\n   Venue types:")
        for vtype, count in sorted(venue_types.items(), key=lambda x: x[1], reverse=True):
            print(f"      {vtype}: {count}")

    return complete_venues

if __name__ == '__main__':
    discover_richmond_venues()
