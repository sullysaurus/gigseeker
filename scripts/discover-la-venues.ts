import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

// Check for required environment variables
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY environment variable is required')
  process.exit(1)
}

if (!SUPABASE_URL) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL environment variable is required')
  process.exit(1)
}

if (!SUPABASE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required')
  process.exit(1)
}

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
})

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

interface Venue {
  name: string
  email?: string
  phone?: string
  website?: string
  address?: string
  city: string
  state: string
  zip_code?: string
  capacity?: number
  venue_type?: string
  music_focus?: string[]
  description?: string
  instagram_handle?: string
  facebook_url?: string
  confidence?: number
}

async function discoverVenues(
  city: string,
  state: string,
  limit: number = 20,
  existingVenues: string[] = []
): Promise<Venue[]> {
  const prompt = `You are a venue discovery assistant. Find live music venues in ${city}, ${state}.

**Task:**
Find ${limit} music venues that host live performances (bands, artists, DJs, etc.) in ${city}, ${state}.

**Venue Types to Find:**
- Music clubs and nightclubs
- Bars with live music
- Concert halls
- Theaters
- Amphitheaters
- Stadiums that regularly host concerts
- Breweries with live music
- Wineries with live music
- Restaurants with live music stages
- Coffee shops with live music
- Hotels with music venues
- Music festivals (recurring)
- Famous iconic music venues

**Prioritize:**
- Well-known, established venues
- Venues that regularly book touring artists
- Iconic or historic music venues
- Venues with diverse music programming

**Exclude:**
- Sports stadiums (unless they regularly host concerts)
- Movie theaters
- General event spaces without regular music programming
- Venues already found: ${existingVenues.join(', ')}

**Required Information for Each Venue:**
- Name (official venue name)
- Email (booking/contact email if available)
- Phone number
- Website URL
- Full street address
- City, State, ZIP code
- Capacity (approximate if not exact)
- Venue type (bar, club, theater, amphitheater, stadium, brewery, winery, restaurant, hotel, coffee_shop, festival, other)
- Music genres they typically feature
- Brief description (1-2 sentences about what makes this venue notable)
- Social media (Instagram handle, Facebook URL if available)

**Return Format:**
Return a JSON array of venue objects. Only include venues you can verify exist and host live music.

Example:
[
  {
    "name": "The Troubadour",
    "email": "booking@troubadour.com",
    "phone": "310-276-1158",
    "website": "https://troubadour.com",
    "address": "9081 Santa Monica Blvd",
    "city": "West Hollywood",
    "state": "CA",
    "zip_code": "90069",
    "capacity": 500,
    "venue_type": "club",
    "music_focus": ["rock", "indie", "alternative"],
    "description": "Iconic West Hollywood music club that launched the careers of countless artists since 1957.",
    "instagram_handle": "@troubadourla",
    "facebook_url": "https://facebook.com/troubadour",
    "confidence": 95
  }
]

Return ONLY valid JSON, no markdown formatting or code blocks.`

  console.log(`Discovering ${limit} venues in ${city}, ${state}...`)

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 16000,
    messages: [{
      role: 'user',
      content: prompt
    }],
    tools: [{
      type: 'web_search_20250305' as any,
      name: 'web_search' as any,
    }],
  })

  // Extract venues from Claude's response
  const textContent = message.content.find((block: any) => block.type === 'text')
  if (textContent && 'text' in textContent) {
    try {
      // Try to parse JSON array from response
      let jsonText = textContent.text.trim()

      // Remove markdown code blocks if present
      jsonText = jsonText.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '')

      // Find JSON array
      const jsonMatch = jsonText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const venues = JSON.parse(jsonMatch[0])
        console.log(`Found ${venues.length} venues`)
        return venues
      }
    } catch (e) {
      console.error('Failed to parse JSON:', e)
      console.error('Response text:', textContent.text)
    }
  }

  return []
}

async function saveVenues(venues: Venue[]): Promise<number> {
  console.log(`\nSaving ${venues.length} venues to database...`)

  let savedCount = 0

  for (const venue of venues) {
    try {
      const { data, error } = await supabase
        .from('venues')
        .insert({
          name: venue.name,
          email: venue.email || null,
          phone: venue.phone || null,
          website: venue.website || null,
          address: venue.address || null,
          city: venue.city,
          state: venue.state,
          zip_code: venue.zip_code || null,
          country: 'US',
          capacity: venue.capacity || null,
          venue_type: venue.venue_type || 'other',
          music_focus: venue.music_focus || [],
          description: venue.description || null,
          instagram_handle: venue.instagram_handle || null,
          facebook_url: venue.facebook_url || null,
          is_verified: false,
        })
        .select()

      if (error) {
        console.error(`Error saving ${venue.name}:`, error.message)
      } else {
        savedCount++
        console.log(`✓ Saved: ${venue.name}`)
      }
    } catch (e: any) {
      console.error(`Error saving ${venue.name}:`, e.message)
    }
  }

  return savedCount
}

async function main() {
  console.log('=== Los Angeles Venue Discovery ===\n')

  // Get existing LA venues to avoid duplicates
  const { data: existingVenues } = await supabase
    .from('venues')
    .select('name, city')
    .eq('state', 'CA')
    .ilike('city', '%Los Angeles%')
    .or('city.ilike.%West Hollywood%,city.ilike.%Hollywood%,city.ilike.%Santa Monica%')

  const existingNames = existingVenues?.map(v => v.name) || []
  console.log(`Found ${existingNames.length} existing LA-area venues in database\n`)

  let allDiscoveredVenues: Venue[] = []
  const targetCount = 100
  const batchSize = 25 // Discover 25 at a time

  // Make multiple discovery calls until we have 100 unique venues
  let attempts = 0
  const maxAttempts = 6 // Max 6 batches

  while (allDiscoveredVenues.length < targetCount && attempts < maxAttempts) {
    attempts++
    console.log(`\n--- Batch ${attempts}/${maxAttempts} ---`)

    const alreadyFound = [...existingNames, ...allDiscoveredVenues.map(v => v.name)]

    const newVenues = await discoverVenues(
      'Los Angeles',
      'CA',
      batchSize,
      alreadyFound
    )

    // Filter out duplicates
    const uniqueVenues = newVenues.filter(venue => {
      const isDuplicate = allDiscoveredVenues.some(
        existing => existing.name.toLowerCase() === venue.name.toLowerCase()
      )
      return !isDuplicate
    })

    allDiscoveredVenues.push(...uniqueVenues)
    console.log(`Total discovered: ${allDiscoveredVenues.length}/${targetCount}`)

    // Small delay between batches to avoid rate limits
    if (attempts < maxAttempts && allDiscoveredVenues.length < targetCount) {
      console.log('Waiting 2 seconds before next batch...')
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  console.log(`\n=== Discovery Complete ===`)
  console.log(`Total venues discovered: ${allDiscoveredVenues.length}`)

  if (allDiscoveredVenues.length === 0) {
    console.log('No new venues found.')
    return
  }

  // Save to database
  const savedCount = await saveVenues(allDiscoveredVenues)

  console.log(`\n=== Summary ===`)
  console.log(`Venues discovered: ${allDiscoveredVenues.length}`)
  console.log(`Venues saved: ${savedCount}`)
  console.log(`Errors: ${allDiscoveredVenues.length - savedCount}`)

  // Show some examples
  console.log(`\n=== Sample Venues ===`)
  allDiscoveredVenues.slice(0, 5).forEach(v => {
    console.log(`\n${v.name}`)
    console.log(`  Location: ${v.address}, ${v.city}, ${v.state} ${v.zip_code}`)
    console.log(`  Type: ${v.venue_type} | Capacity: ${v.capacity || 'Unknown'}`)
    console.log(`  Genres: ${v.music_focus?.join(', ') || 'N/A'}`)
    console.log(`  Website: ${v.website || 'N/A'}`)
  })
}

main().catch(console.error)
