# Venue Discovery Scripts

This directory contains scripts and data for discovering and importing music venues into the GigSeeker database.

## Files

### Venue Discovery Scripts

- **`discover-la-venues-simple.ts`** - Standalone TypeScript script that uses the Anthropic API to discover venues and save them to a JSON file (doesn't require database access)
- **`discover-la-venues.ts`** - Full-featured script that discovers venues and saves them directly to the Supabase database
- **`run-discover-la-venues.sh`** - Bash wrapper script with environment variable checking

### Data Files

- **`../data/la-venues-100.json`** - Curated list of 100 Los Angeles area venues with complete information
- **`../supabase/seeds/insert_la_venues.sql`** - SQL script to import the 100 LA venues into the database

## Usage

### Option 1: Import Pre-Researched Venues (Recommended)

The fastest way to add 100 LA venues to your database:

```bash
# Using psql
psql -h your_supabase_host -U postgres -d postgres -f supabase/seeds/insert_la_venues.sql

# Or using Supabase CLI
supabase db reset
# This will run all seed scripts including insert_la_venues.sql
```

### Option 2: Discover New Venues with AI

To discover additional venues using Claude AI:

```bash
# Set your Anthropic API key
export ANTHROPIC_API_KEY='your-api-key-here'

# Run the discovery script
./scripts/run-discover-la-venues.sh

# Or run directly with TypeScript
ANTHROPIC_API_KEY='your-key' npx tsx scripts/discover-la-venues-simple.ts
```

This will:
1. Use Claude Sonnet 4.5 with web search to find venues
2. Discover up to 100 venues in batches of 25
3. Save results to `scripts/la-venues.json`

### Option 3: Use the API Endpoint

The application includes an admin API endpoint for venue discovery:

```bash
# Start the development server
npm run dev

# Call the admin endpoint (requires admin authentication)
curl -X POST http://localhost:3000/api/admin/discover-la-venues \
  -H "Cookie: your-auth-cookie" \
  -H "Content-Type: application/json"
```

This endpoint will:
- Discover 100 venues across 5 batches
- Automatically save them to the database
- Return a summary of discovered and saved venues

## The 100 LA Venues Dataset

The curated dataset includes:

**Venue Types:**
- Major amphitheaters (Hollywood Bowl, Greek Theatre)
- Historic theaters (Wiltern, Fonda, El Rey)
- Iconic clubs (Troubadour, Whisky a Go Go, The Roxy)
- Intimate venues (Hotel Cafe, Blue Whale, The Echo)
- Breweries with live music (Arts District Brewing, Boomtown)
- Jazz clubs (Vibrato, The Baked Potato, Harvelle's)
- Neighborhood bars (Silverlake Lounge, Short Stop)
- And many more!

**Geographic Coverage:**
- West Hollywood & Sunset Strip
- Downtown LA & Arts District
- Echo Park & Silver Lake
- Hollywood
- Santa Monica & Venice
- Long Beach
- Pasadena
- Orange County
- And surrounding areas

**Data Completeness:**
- All venues have: name, address, city, state, capacity (estimate), venue type
- Most venues have: phone, website, music genres, description
- Some venues have: email, social media handles

## Environment Variables

Required for AI discovery scripts:

- `ANTHROPIC_API_KEY` - Your Anthropic API key for Claude
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (for database scripts)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for database scripts)

## Venue Data Schema

Each venue includes:

```typescript
{
  name: string              // Venue name
  address: string           // Street address
  city: string              // City
  state: string             // State (CA)
  zip_code: string          // ZIP code
  country: string           // Country (US)
  phone?: string            // Phone number
  email?: string            // Contact email
  website?: string          // Website URL
  capacity?: number         // Approximate capacity
  venue_type: string        // bar, club, theater, amphitheater, etc.
  music_focus: string[]     // Array of genres
  description?: string      // Brief description
  instagram_handle?: string // Instagram handle (without @)
  facebook_url?: string     // Facebook page URL
}
```

## Notes

- The SQL script uses `ON CONFLICT DO NOTHING` to prevent duplicate entries
- Venue names are based on official names as of 2025
- Some venues may have multiple locations or sister venues
- Capacity numbers are approximate and may vary
- Contact information is current as of research date but should be verified

## Future Enhancements

- Add venue enrichment script to fill in missing data
- Create scripts for other major cities
- Add venue verification and update workflows
- Implement deduplication and merge strategies
