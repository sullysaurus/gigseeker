import { NextResponse } from 'next/server'
import { generateAIResponse, isAIMockMode, getAICreditCost } from '@/lib/ai/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { emailBody, venueName, style, venueId, pipelineVenueId } = await request.json()

    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check user's AI credit balance
    const { data: profile } = await supabase
      .from('profiles')
      .select('ai_credits_balance')
      .eq('user_id', user.id)
      .single()

    const creditCost = getAICreditCost('subject_line_generator')

    if (!profile || profile.ai_credits_balance < creditCost) {
      return NextResponse.json({
        error: `Insufficient AI credits. Need ${creditCost} credit, have ${profile?.ai_credits_balance || 0}.`,
        requiresCredits: true,
        creditsNeeded: creditCost,
        creditsAvailable: profile?.ai_credits_balance || 0
      }, { status: 402 })
    }

    // Log if we're in mock mode
    if (isAIMockMode()) {
      console.log('🧪 [TESTING MODE] Using mock AI responses - no API costs!')
    }

    const fullPrompt = `You are an expert at writing compelling email subject lines. Generate 5 different subject line options for this venue booking email.

Email Body:
${emailBody}

Venue: ${venueName}
${style ? `Style preference: ${style}` : 'Style: Professional and engaging'}

Instructions:
- Generate exactly 5 diverse subject line options
- Keep subject lines between 30-60 characters
- Make them compelling and professional
- Avoid spam trigger words
- Vary the approach (direct, intriguing, personalized, etc.)

Always respond with valid JSON in this exact format:
{
  "suggestions": [
    "Subject line option 1",
    "Subject line option 2",
    "Subject line option 3",
    "Subject line option 4",
    "Subject line option 5"
  ]
}

Return JSON only.`

    const responseText = await generateAIResponse({
      actionType: 'subject_line_generator',
      prompt: fullPrompt,
      temperature: 0.8,
      maxTokens: 512,
    })

    // Try to extract JSON from response (handle code blocks)
    let subjectData
    const jsonMatch =
      responseText.match(/```json\n([\s\S]+?)\n```/) ||
      responseText.match(/\{[\s\S]+\}/)

    if (jsonMatch) {
      const jsonString = jsonMatch[1] || jsonMatch[0]
      subjectData = JSON.parse(jsonString)
    } else {
      subjectData = JSON.parse(responseText)
    }

    // Record AI action and deduct credits
    try {
      await supabase.rpc('record_ai_action', {
        p_user_id: user.id,
        p_action_type: 'subject_line_generator',
        p_credits_cost: creditCost,
        p_venue_id: venueId || null,
        p_pipeline_venue_id: pipelineVenueId || null,
        p_success: true,
        p_metadata: {
          venue_name: venueName,
          style: style,
          mock_mode: isAIMockMode()
        }
      })
    } catch (creditError) {
      console.error('Failed to record AI action:', creditError)
    }

    // Get updated credit balance
    const { data: updatedProfile } = await supabase
      .from('profiles')
      .select('ai_credits_balance')
      .eq('user_id', user.id)
      .single()

    return NextResponse.json({
      suggestions: subjectData.suggestions || [
        'Booking Inquiry - ' + venueName,
        'Show Opportunity for ' + venueName,
        'Performance Request',
        'Interested in Performing',
        'Available Dates for Show'
      ],
      mockMode: isAIMockMode(),
      creditsRemaining: updatedProfile?.ai_credits_balance || 0,
      creditsUsed: creditCost
    })
  } catch (error) {
    console.error('AI subject line generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate subject lines' },
      { status: 500 }
    )
  }
}
