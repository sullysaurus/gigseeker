import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * POST /api/admin/enrich-venue
 * Uses Claude + WebSearch to enrich venue data
 */
export async function POST(request: Request) {
  try {
    const { venueId } = await request.json()

    if (!venueId) {
      return NextResponse.json({ error: 'Venue ID required' }, { status: 400 })
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

    // Get venue data
    const { data: venue, error: venueError } = await supabase
      .from('venues')
      .select('*')
      .eq('id', venueId)
      .single()

    if (venueError || !venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
    }

    // Build prompt for Claude
    const prompt = `You are a data enrichment assistant. Find missing information about this music venue:

**Current Data:**
- Name: ${venue.name}
- City: ${venue.city}, ${venue.state}
- Email: ${venue.email || 'MISSING'}
- Phone: ${venue.phone || 'MISSING'}
- Website: ${venue.website || 'MISSING'}
- Address: ${venue.address || 'MISSING'}
- Zip Code: ${venue.zip_code || 'MISSING'}
- Capacity: ${venue.capacity || 'MISSING'}
- Venue Type: ${venue.venue_type || 'MISSING'}
- Music Focus: ${venue.music_focus?.join(', ') || 'MISSING'}
- Description: ${venue.description || 'MISSING'}
- Instagram: ${venue.instagram_handle || 'MISSING'}
- Facebook: ${venue.facebook_url || 'MISSING'}

**Task:**
Use web search to find any MISSING information. Return ONLY valid, verified data you find from official sources.

**Instructions:**
1. Search for the venue's official website
2. Look for contact information (phone, email)
3. Find social media handles (Instagram, Facebook)
4. Determine venue type (bar, club, theater, amphitheater, stadium, festival, other)
5. Identify music genres they feature
6. Find capacity if mentioned
7. Get complete address with zip code

**Return Format:**
Return a JSON object with ONLY the fields you successfully found. Use null for fields you couldn't verify.
Include a "confidence" field (0-100) for each piece of data.

**IMPORTANT**: Use these EXACT field names to match the database schema:
- phone (string)
- email (string)
- website (string)
- address (string)
- zip_code (string)
- capacity (number)
- venue_type (string: bar, club, theater, amphitheater, stadium, festival, or other)
- music_focus (array of strings)
- description (string)
- instagram_handle (string - the @handle or full URL)
- facebook_url (string - the full Facebook URL)

Example:
{
  "phone": { "value": "555-1234", "confidence": 95 },
  "website": { "value": "https://example.com", "confidence": 100 },
  "capacity": { "value": 500, "confidence": 80 },
  "venue_type": { "value": "club", "confidence": 90 },
  "music_focus": { "value": ["rock", "indie", "alternative"], "confidence": 85 },
  "instagram_handle": { "value": "@venuename", "confidence": 90 },
  "facebook_url": { "value": "https://facebook.com/venuename", "confidence": 90 },
  "description": { "value": "Live music venue...", "confidence": 85 }
}

Return valid JSON only, no markdown formatting.`

    // Call Claude with web search
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
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

    // Extract enrichment data from Claude's response
    let enrichmentData: any = {}

    // Find text content in response
    const textContent = message.content.find((block: any) => block.type === 'text')
    if (textContent && 'text' in textContent) {
      try {
        // Try to parse JSON from response
        const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          enrichmentData = JSON.parse(jsonMatch[0])
        }
      } catch (e) {
        console.error('Failed to parse enrichment JSON:', e)
      }
    }

    // Update enrichment tracking
    await supabase
      .from('venues')
      .update({
        last_enriched_at: new Date().toISOString(),
        enrichment_attempts: venue.enrichment_attempts + 1,
        enrichment_status: Object.keys(enrichmentData).length > 0 ? 'enriched' : 'failed',
      })
      .eq('id', venueId)

    return NextResponse.json({
      success: true,
      enrichmentData,
      currentData: venue,
    })
  } catch (error: any) {
    console.error('Enrichment error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to enrich venue' },
      { status: 500 }
    )
  }
}
