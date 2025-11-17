import Anthropic from '@anthropic-ai/sdk'
import * as fs from 'fs'
import * as path from 'path'

// Check for required environment variable
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

if (!ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY environment variable is required')
  console.error('Usage: ANTHROPIC_API_KEY=your_key npx tsx scripts/discover-la-venues-simple.ts')
  process.exit(1)
}

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
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
- Include venues from different LA areas: Downtown LA, West Hollywood, Hollywood, Silver Lake, Echo Park, Santa Monica, Venice, Long Beach, Pasadena, etc.

**Exclude:**
- Sports stadiums (unless they regularly host concerts)
- Movie theaters
- General event spaces without regular music programming
- Venues already found: ${existingVenues.slice(0, 30).join(', ')}

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
- Brief description (1-2 sentences about what makes this venue notable)
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

  console.log(`Discovering ${limit} venues in ${city}, ${state}...`)

  try {
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
          console.log(`✓ Found ${venues.length} venues`)
          return venues
        }
      } catch (e) {
        console.error('Failed to parse JSON:', e)
        console.error('Response text:', textContent.text.substring(0, 500))
      }
    }
  } catch (error: any) {
    console.error(`Error discovering venues: ${error.message}`)
  }

  return []
}

async function main() {
  console.log('=== Los Angeles Venue Discovery ===\n')

  let allDiscoveredVenues: Venue[] = []
  const targetCount = 100
  const batchSize = 25 // Discover 25 at a time

  // Make multiple discovery calls until we have 100 unique venues
  let attempts = 0
  const maxAttempts = 5 // Max 5 batches

  while (allDiscoveredVenues.length < targetCount && attempts < maxAttempts) {
    attempts++
    console.log(`\n--- Batch ${attempts}/${maxAttempts} ---`)

    const alreadyFound = allDiscoveredVenues.map(v => v.name)

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

    if (uniqueVenues.length > 0) {
      allDiscoveredVenues.push(...uniqueVenues)
      console.log(`Added ${uniqueVenues.length} new venues`)
      console.log(`Total discovered: ${allDiscoveredVenues.length}/${targetCount}`)
    } else {
      console.log('No new unique venues found in this batch')
    }

    // Small delay between batches to avoid rate limits
    if (attempts < maxAttempts && allDiscoveredVenues.length < targetCount) {
      console.log('Waiting 3 seconds before next batch...')
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
  }

  console.log(`\n=== Discovery Complete ===`)
  console.log(`Total venues discovered: ${allDiscoveredVenues.length}`)

  if (allDiscoveredVenues.length === 0) {
    console.log('No new venues found.')
    return
  }

  // Save to JSON file
  const outputPath = path.join(__dirname, 'la-venues.json')
  fs.writeFileSync(outputPath, JSON.stringify(allDiscoveredVenues, null, 2))
  console.log(`\n✓ Saved venues to: ${outputPath}`)

  // Show some examples
  console.log(`\n=== Sample Venues ===`)
  allDiscoveredVenues.slice(0, 10).forEach((v, i) => {
    console.log(`\n${i + 1}. ${v.name}`)
    console.log(`   Location: ${v.city}, ${v.state}`)
    console.log(`   Address: ${v.address || 'N/A'}`)
    console.log(`   Type: ${v.venue_type} | Capacity: ${v.capacity || 'Unknown'}`)
    console.log(`   Genres: ${v.music_focus?.join(', ') || 'N/A'}`)
    console.log(`   Website: ${v.website || 'N/A'}`)
  })

  // Show summary statistics
  console.log(`\n=== Summary Statistics ===`)

  const venueTypes = allDiscoveredVenues.reduce((acc, v) => {
    const type = v.venue_type || 'unknown'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  console.log('\nVenues by type:')
  Object.entries(venueTypes).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`)
  })

  const withEmail = allDiscoveredVenues.filter(v => v.email).length
  const withPhone = allDiscoveredVenues.filter(v => v.phone).length
  const withWebsite = allDiscoveredVenues.filter(v => v.website).length

  console.log(`\nContact info completeness:`)
  console.log(`  With email: ${withEmail}`)
  console.log(`  With phone: ${withPhone}`)
  console.log(`  With website: ${withWebsite}`)

  console.log(`\n✓ Next step: Import the venues to the database using the import script`)
}

main().catch(console.error)
