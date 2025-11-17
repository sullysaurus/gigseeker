import { NextResponse } from 'next/server'
import { generateAIResponse, isAIMockMode, getAICreditCost } from '@/lib/ai/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { emailDraft, venueName, improvementFocus, venueId, pipelineVenueId } = await request.json()

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

    const creditCost = getAICreditCost('email_improvement')

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

    const fullPrompt = `You are an expert music industry email writer. Improve this venue booking email draft.

Current Draft:
Subject: ${emailDraft.subject}

Body:
${emailDraft.body}

Venue: ${venueName}

${improvementFocus ? `Focus on improving: ${improvementFocus}` : 'Focus on: clarity, professionalism, and persuasiveness'}

Instructions:
- Keep the core message and intent
- Make it more professional and compelling
- Fix any grammar or tone issues
- Keep it concise (under 200 words)
- Maintain authenticity (sound like a real person, not robotic)

Always respond with valid JSON in this exact format:
{"subject": "Improved subject line", "body": "Improved email body"}

Return JSON only.`

    const responseText = await generateAIResponse({
      actionType: 'email_improvement',
      prompt: fullPrompt,
      temperature: 0.7,
      maxTokens: 1024,
    })

    // Try to extract JSON from response (handle code blocks)
    let emailData
    const jsonMatch =
      responseText.match(/```json\n([\s\S]+?)\n```/) ||
      responseText.match(/\{[\s\S]+\}/)

    if (jsonMatch) {
      const jsonString = jsonMatch[1] || jsonMatch[0]
      emailData = JSON.parse(jsonString)
    } else {
      emailData = JSON.parse(responseText)
    }

    // Record AI action and deduct credits
    try {
      await supabase.rpc('record_ai_action', {
        p_user_id: user.id,
        p_action_type: 'email_improvement',
        p_credits_cost: creditCost,
        p_venue_id: venueId || null,
        p_pipeline_venue_id: pipelineVenueId || null,
        p_success: true,
        p_metadata: {
          venue_name: venueName,
          improvement_focus: improvementFocus,
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
      subject: emailData.subject || emailDraft.subject,
      body: emailData.body || responseText,
      mockMode: isAIMockMode(),
      creditsRemaining: updatedProfile?.ai_credits_balance || 0,
      creditsUsed: creditCost
    })
  } catch (error) {
    console.error('AI improvement error:', error)
    return NextResponse.json(
      { error: 'Failed to improve email' },
      { status: 500 }
    )
  }
}
