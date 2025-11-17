import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
  is_verified: boolean
}

async function discoverVenues(city: string, state: string, limit: number): Promise<Venue[]> {
  console.log(`\n🔍 Discovering ${limit} venues in ${city}, ${state}...`)

  // Get existing venues to avoid duplicates
  const { data: existingVenues } = await supabase
    .from('venues')
    .select('name, email')
    .eq('city', city)
    .eq('state', state)

  const existingNames = existingVenues?.map(v => v.name.toLowerCase()) || []
  const existingEmails = existingVenues?.map(v => v.email?.toLowerCase()).filter(Boolean) || []

  console.log(`📊 Found ${existingNames.length} existing venues in database`)

  const prompt = `You are a venue discovery assistant. Find live music venues in ${city}, ${state}.

**Task:**
Find ${limit} music venues that host live performances (bands, artists, DJs, etc.) in ${city}, ${state}.

**Venue Types to Find:**
- Music clubs
- Bars with live music
- Concert halls
- Theaters
- Amphitheaters
- Breweries with live music
- Restaurants with live music stages
- Music festivals (recurring)
- Jazz clubs
- Rock venues
- Dive bars with bands
- Rooftop venues

**Exclude:**
- Sports stadiums (unless they regularly host concerts)
- Movie theaters
- General event spaces without regular music programming

**Required Information for Each Venue:**
- Name
- Email (booking/contact email if available)
- Phone
- Website
- Address (street address, city, state, zip code)
- Capacity (approximate if not exact)
- Venue type (bar, club, theater, amphitheater, other)
- Music genres they feature
- Brief description

**Existing Venues to Skip:**
${existingNames.length > 0 ? existingNames.slice(0, 50).join(', ') : 'None'}

**Return Format:**
Return a JSON array of venue objects. Only include venues you can verify exist and host live music.

Example:
[
  {
    "name": "The Music Hall",
    "email": "booking@musichall.com",
    "phone": "555-1234",
    "website": "https://musichall.com",
    "address": "123 Main St",
    "city": "${city}",
    "state": "${state}",
    "zip_code": "12345",
    "capacity": 500,
    "venue_type": "club",
    "music_focus": ["rock", "indie", "alternative"],
    "description": "Live music venue featuring local and touring artists.",
    "instagram_handle": "@musichall",
    "facebook_url": "https://facebook.com/musichall"
  }
]

Return valid JSON only, no markdown formatting.`

  console.log('\n🤖 Calling Claude AI with web search...')

  // Call Claude with web search
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 16000,
    messages: [{
      role: 'user',
      content: prompt
    }],
    // Enable web search
    tools: [{
      type: 'web_search_20250305' as any,
      name: 'web_search' as any,
    }],
  })

  // Extract discovered venues from Claude's response
  let discoveredVenues: any[] = []

  // Find text content in response
  const textContent = message.content.find((block: any) => block.type === 'text')
  if (textContent && 'text' in textContent) {
    try {
      // Try to parse JSON array from response
      const jsonMatch = textContent.text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        discoveredVenues = JSON.parse(jsonMatch[0])
        console.log(`✅ Claude discovered ${discoveredVenues.length} venues`)
      }
    } catch (e) {
      console.error('❌ Failed to parse discovery JSON:', e)
      console.log('Response:', textContent.text)
      return []
    }
  }

  // Filter out duplicates by name and email
  const newVenues = discoveredVenues.filter(venue => {
    const isDuplicateName = existingNames.includes(venue.name?.toLowerCase())
    const isDuplicateEmail = venue.email && existingEmails.includes(venue.email.toLowerCase())
    return !isDuplicateName && !isDuplicateEmail
  })

  console.log(`🆕 Found ${newVenues.length} new venues (${discoveredVenues.length - newVenues.length} duplicates skipped)`)

  return newVenues.map(v => ({
    ...v,
    is_verified: true,
  }))
}

async function saveVenues(venues: Venue[]) {
  if (venues.length === 0) {
    console.log('⚠️  No venues to save')
    return
  }

  console.log(`\n💾 Saving ${venues.length} venues to database...`)

  const { data, error } = await supabase
    .from('venues')
    .insert(venues)
    .select()

  if (error) {
    console.error('❌ Error saving venues:', error)
    throw error
  }

  console.log(`✅ Successfully saved ${data?.length || 0} venues`)

  // Display summary
  console.log('\n📋 Venue Summary:')
  venues.forEach((v, i) => {
    console.log(`${i + 1}. ${v.name} - ${v.venue_type || 'unknown'} - ${v.city}, ${v.state}`)
  })
}

async function main() {
  try {
    console.log('🎵 NYC Venue Discovery Script')
    console.log('================================')

    const CITY = 'New York'
    const STATE = 'NY'
    const TARGET_VENUES = 100

    // Discover venues in batches to avoid token limits
    const BATCH_SIZE = 50
    const batches = Math.ceil(TARGET_VENUES / BATCH_SIZE)

    let allVenues: Venue[] = []

    for (let i = 0; i < batches; i++) {
      const batchNum = i + 1
      const venuesInBatch = Math.min(BATCH_SIZE, TARGET_VENUES - allVenues.length)

      console.log(`\n\n🔄 Batch ${batchNum}/${batches} (requesting ${venuesInBatch} venues)`)
      console.log('='.repeat(50))

      const venues = await discoverVenues(CITY, STATE, venuesInBatch)

      if (venues.length > 0) {
        await saveVenues(venues)
        allVenues = allVenues.concat(venues)
      }

      if (allVenues.length >= TARGET_VENUES) {
        console.log(`\n✅ Reached target of ${TARGET_VENUES} venues!`)
        break
      }

      // Wait a bit between batches to avoid rate limits
      if (i < batches - 1) {
        console.log('\n⏳ Waiting 2 seconds before next batch...')
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    console.log('\n\n🎉 Discovery Complete!')
    console.log('================================')
    console.log(`Total venues discovered: ${allVenues.length}`)
    console.log(`Target: ${TARGET_VENUES}`)

  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

main()
