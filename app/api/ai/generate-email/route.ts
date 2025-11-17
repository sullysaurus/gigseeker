import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: Request) {
  try {
    const { prompt, venueName } = await request.json()

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: `You are an expert music industry email writer. Write professional, personalized venue booking emails for musicians.

Always respond with valid JSON in this exact format:
{"subject": "Email subject line", "body": "Email body text"}

Keep emails concise (under 200 words), professional but friendly, and include a clear call-to-action.`,
      messages: [
        {
          role: 'user',
          content: `Write a venue booking email for ${venueName}.

User request: ${prompt}

Return JSON only.`,
        },
      ],
    })

    const firstContent = message.content[0]
    if (!firstContent || firstContent.type !== 'text') {
      throw new Error('Invalid response from AI')
    }

    const responseText = firstContent.text

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

    return NextResponse.json({
      subject: emailData.subject,
      body: emailData.body,
    })
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate email' },
      { status: 500 }
    )
  }
}
