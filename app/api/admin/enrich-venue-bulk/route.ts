import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * POST /api/admin/enrich-venue-bulk
 * Uses Claude + WebSearch to enrich specific fields for a venue
 */
export async function POST(request: Request) {
  try {
    const { venueId, fields } = await request.json()

    if (!venueId || !fields || fields.length === 0) {
      return NextResponse.json({ error: 'Venue ID and fields required' }, { status: 400 })
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

    // Build a targeted prompt for only the requested fields
    const fieldDescriptions: { [key: string]: string } = {
      email: 'Contact email address',
      phone: 'Contact phone number',
      website: 'Official website URL',
      address: 'Full street address',
      zip_code: 'ZIP/postal code',
      capacity: 'Venue capacity (number of people)',
      venue_type: 'Type of venue (bar, club, theater, amphitheater, stadium, festival, or other)',
      music_focus: 'Music genres/styles featured (array of strings)',
      description: 'Brief description of the venue',
      instagram_handle: 'Instagram handle or URL',
      facebook_url: 'Facebook page URL',
    }

    const requestedFields = fields.map((f: string) => `- ${fieldDescriptions[f] || f}`).join('\n')

    const prompt = `You are a data enrichment assistant. Find ONLY the following specific information about this music venue:

**Venue:**
- Name: ${venue.name}
- City: ${venue.city}, ${venue.state}

**Find these fields ONLY:**
${requestedFields}

**Instructions:**
1. Search for the venue's official website and social media
2. Find ONLY the requested information listed above
3. Return verified data from official sources only
4. If you cannot find a specific field, omit it from the response

**IMPORTANT**: Use these EXACT field names to match the database schema:
${fields.map((f: string) => `- ${f}`).join('\n')}

**Return Format:**
Return a JSON object with ONLY the fields you successfully found. Include a "confidence" field (0-100) for each piece of data.

Example:
{
  "phone": { "value": "555-1234", "confidence": 95 },
  "website": { "value": "https://example.com", "confidence": 100 }
}

Return valid JSON only, no markdown formatting.`

    // Call Claude with web search (using Haiku for cost efficiency)
    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 2048,
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

    // Build update object from enrichment data
    const updates: any = {}
    Object.keys(enrichmentData).forEach(key => {
      // Map social media field variations to correct database columns
      let mappedKey = key
      if (key === 'facebook_handle' || key === 'facebook' || key === 'facebook_url') {
        mappedKey = 'facebook_url'
      } else if (key === 'instagram' || key === 'instagram_url') {
        mappedKey = 'instagram_handle'
      }

      // Only update if the field was requested
      if (fields.includes(mappedKey)) {
        updates[mappedKey] = enrichmentData[key]?.value
      }
    })

    // Update venue with enriched data
    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from('venues')
        .update({
          ...updates,
          last_enriched_at: new Date().toISOString(),
          enrichment_attempts: venue.enrichment_attempts + 1,
          enrichment_status: 'enriched',
        })
        .eq('id', venueId)

      if (updateError) {
        console.error('Failed to update venue:', updateError)
        return NextResponse.json({ error: 'Failed to update venue' }, { status: 500 })
      }
    } else {
      // Update enrichment tracking even if no data found
      await supabase
        .from('venues')
        .update({
          last_enriched_at: new Date().toISOString(),
          enrichment_attempts: venue.enrichment_attempts + 1,
          enrichment_status: 'failed',
        })
        .eq('id', venueId)
    }

    return NextResponse.json({
      success: true,
      fieldsFound: Object.keys(updates),
      enrichmentData,
    })
  } catch (error: any) {
    console.error('Bulk enrichment error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to enrich venue' },
      { status: 500 }
    )
  }
}
