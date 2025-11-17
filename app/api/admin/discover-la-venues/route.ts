import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

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

async function discoverVenueBatch(
  city: string,
  state: string,
  limit: number,
  existingNames: string[]
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
- Include venues from different LA areas: Downtown LA, West Hollywood, Hollywood, Silver Lake, Echo Park, Santa Monica, Venice, Long Beach, Pasadena, Glendale, Burbank, Culver City, etc.

**Exclude:**
- Sports stadiums (unless they regularly host concerts)
- Movie theaters
- General event spaces without regular music programming
${existingNames.length > 0 ? `- Venues already found: ${existingNames.slice(0, 30).join(', ')}` : ''}

**Required Information for Each Venue:**
- Name (official venue name)
- Email (booking/contact email if available)
- Phone number
- Website URL
- Full street address
- City, State, ZIP code
- Capacity (approximate if not exact)
- Venue type (bar, club, theater, amphitheater, stadium, brewery, winery, restaurant, hotel, coffee_shop, festival, other)
- Music genres they typically feature (use: rock, indie, alternative, punk, metal, jazz, blues, country, folk, hip hop, electronic, r&b, soul, reggae, latin, world, experimental, singer songwriter, acoustic)
- Brief description (1-2 sentences)
- Social media (Instagram handle without @, Facebook URL if available)

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
    "instagram_handle": "troubadourla",
    "facebook_url": "https://facebook.com/troubadour",
    "confidence": 95
  }
]

Return ONLY valid JSON, no markdown formatting or code blocks.`

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

  // Extract venues from response
  const textContent = message.content.find((block: any) => block.type === 'text')
  if (textContent && 'text' in textContent) {
    try {
      let jsonText = textContent.text.trim()
      jsonText = jsonText.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '')
      const jsonMatch = jsonText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (e) {
      console.error('Failed to parse JSON:', e)
    }
  }

  return []
}

/**
 * POST /api/admin/discover-la-venues
 * Discovers and saves 100 venues in Los Angeles
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Verify admin access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    console.log('Starting LA venue discovery...')

    // Get existing LA-area venues
    const { data: existingVenues } = await supabase
      .from('venues')
      .select('name, city')
      .eq('state', 'CA')
      .or('city.ilike.%Los Angeles%,city.ilike.%West Hollywood%,city.ilike.%Hollywood%,city.ilike.%Santa Monica%,city.ilike.%Venice%,city.ilike.%Long Beach%,city.ilike.%Pasadena%')

    const existingNames = existingVenues?.map(v => v.name) || []
    console.log(`Found ${existingNames.length} existing LA venues`)

    const allDiscoveredVenues: Venue[] = []
    const targetCount = 100
    const batchSize = 25
    const maxBatches = 5

    // Discover venues in batches
    for (let batch = 0; batch < maxBatches && allDiscoveredVenues.length < targetCount; batch++) {
      console.log(`Batch ${batch + 1}/${maxBatches}...`)

      const alreadyFound = [...existingNames, ...allDiscoveredVenues.map(v => v.name)]
      const venues = await discoverVenueBatch('Los Angeles', 'CA', batchSize, alreadyFound)

      // Filter duplicates
      const uniqueVenues = venues.filter(venue => {
        const isDuplicate = allDiscoveredVenues.some(
          existing => existing.name.toLowerCase() === venue.name.toLowerCase()
        ) || existingNames.some(name => name.toLowerCase() === venue.name.toLowerCase())
        return !isDuplicate
      })

      allDiscoveredVenues.push(...uniqueVenues)
      console.log(`Found ${uniqueVenues.length} new venues. Total: ${allDiscoveredVenues.length}`)

      // Small delay between batches
      if (batch < maxBatches - 1 && allDiscoveredVenues.length < targetCount) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    console.log(`Discovery complete. Found ${allDiscoveredVenues.length} venues`)

    // Save venues to database
    let savedCount = 0
    const errors: string[] = []

    for (const venue of allDiscoveredVenues) {
      try {
        const { error } = await supabase
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

        if (error) {
          errors.push(`${venue.name}: ${error.message}`)
          console.error(`Error saving ${venue.name}:`, error.message)
        } else {
          savedCount++
        }
      } catch (e: any) {
        errors.push(`${venue.name}: ${e.message}`)
        console.error(`Error saving ${venue.name}:`, e.message)
      }
    }

    console.log(`Saved ${savedCount}/${allDiscoveredVenues.length} venues`)

    return NextResponse.json({
      success: true,
      discovered: allDiscoveredVenues.length,
      saved: savedCount,
      errors: errors.length,
      errorDetails: errors.slice(0, 10), // First 10 errors
      sampleVenues: allDiscoveredVenues.slice(0, 5).map(v => ({
        name: v.name,
        city: v.city,
        venue_type: v.venue_type,
        capacity: v.capacity,
      })),
    })
  } catch (error: any) {
    console.error('Discovery error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to discover venues' },
      { status: 500 }
    )
  }
}
