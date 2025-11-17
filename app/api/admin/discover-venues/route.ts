import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * POST /api/admin/discover-venues
 * Uses Claude + WebSearch to discover new venues in a location
 */
export async function POST(request: Request) {
  try {
    const { city, state, limit = 10 } = await request.json()

    if (!city || !state) {
      return NextResponse.json({ error: 'City and state required' }, { status: 400 })
    }

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

    // Get existing venues in this location to avoid duplicates
    const { data: existingVenues } = await supabase
      .from('venues')
      .select('name, email')
      .eq('city', city)
      .eq('state', state)

    const existingNames = existingVenues?.map(v => v.name.toLowerCase()) || []
    const existingEmails = existingVenues?.map(v => v.email?.toLowerCase()).filter(Boolean) || []

    // Build prompt for Claude
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
${existingNames.length > 0 ? existingNames.slice(0, 20).join(', ') : 'None'}

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
    "facebook_url": "https://facebook.com/musichall",
    "confidence": 95
  }
]

Return valid JSON only, no markdown formatting.`

    // Call Claude with web search
    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 8192,
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
        }
      } catch (e) {
        console.error('Failed to parse discovery JSON:', e)
      }
    }

    // Filter out duplicates by name and email
    const newVenues = discoveredVenues.filter(venue => {
      const isDuplicateName = existingNames.includes(venue.name?.toLowerCase())
      const isDuplicateEmail = venue.email && existingEmails.includes(venue.email.toLowerCase())
      return !isDuplicateName && !isDuplicateEmail
    })

    return NextResponse.json({
      success: true,
      venues: newVenues,
      total: newVenues.length,
      skipped: discoveredVenues.length - newVenues.length,
    })
  } catch (error: any) {
    console.error('Discovery error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to discover venues' },
      { status: 500 }
    )
  }
}
