import Anthropic from '@anthropic-ai/sdk'

const USE_MOCK = process.env.USE_MOCK_AI === 'true'

// Initialize real Claude client (only used when not mocking)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Mock responses for testing
const MOCK_RESPONSES = {
  email_generation: `Subject: Excited to Perform at Your Venue

Hi [Venue Name] Team,

I hope this email finds you well! My name is [Artist Name], and I'm a [genre] musician based in [location]. I've been following your venue for a while and love the diverse lineup of artists you feature.

I'm reaching out to see if you have any availability for a show in the coming months. My music blends [style elements], and I think it would resonate well with your audience. I've been performing regularly at venues like [similar venues] and have built a strong following in the area.

I'd love to discuss potential dates and learn more about your booking process. I can send over my EPK, recent recordings, and social media links if you're interested.

Thanks for considering, and I look forward to hearing from you!

Best regards,
[Artist Name]
[Contact Info]`,

  email_personalization: `Subject: Perfect Fit for [Venue Name]'s [Genre] Nights

Hi [Venue Contact],

I noticed you recently hosted [Similar Artist] - their sound is right in line with what we do! I'm [Artist Name], a [genre] artist who's been building momentum in the [region] scene.

We'd be a great match for your [specific night/series] lineup. Our last show at [similar venue] drew [number] people, and we've got an engaged local following that would love to discover [Venue Name].

Would love to chat about booking a show in [timeframe]. I can send our EPK and recent live footage if you'd like to check us out.

Cheers,
[Artist Name]`,

  email_improvement: JSON.stringify({
    subject: "[Your Band Name] - Booking Inquiry for [Month]",
    body: `Hi [Venue Name],

I'm reaching out to inquire about booking opportunities at your venue. We're a [genre] band with a growing following in the [area] music scene, and we believe our sound would be a great fit for your lineup.

Our recent shows at [venues] have been well-received, with strong audience engagement and consistent turnout. We have professional-quality recordings, an active social media presence, and a dedicated mailing list we promote shows to.

Would you have any availability in [timeframe]? I'm happy to provide our EPK, references from other venues, and discuss how we can help promote the show.

Thank you for your consideration. Looking forward to connecting!

Best,
[Your Name]
[Contact Information]`
  }),

  followup_generator: `Subject: Following Up - [Your Band Name] Booking

Hi [Venue Contact],

I wanted to follow up on my email from [date] about potential booking opportunities. I understand you're likely busy with your current schedule, so I thought I'd check in.

We're currently booking dates for [month/season] and would still love to perform at [Venue Name]. Since reaching out, we've [recent achievement - new release, successful show, press coverage, etc.].

If the timing isn't right now, I'd be happy to discuss opportunities further out. Would it be helpful if I sent over our latest EPK or live footage?

Thanks again for your time!

Best,
[Your Name]`,

  subject_line_generator: JSON.stringify({
    suggestions: [
      "[Your Band] - [Genre] Show Inquiry for [Month]",
      "Booking Request: [Your Band] at [Venue Name]",
      "Perfect Fit for Your [Day] Night Lineup",
      "[Referred By]: [Your Band] Looking to Book at [Venue]",
      "New [Genre] Artist Seeking Show Opportunity"
    ]
  }),
}

export type AIActionType =
  | 'email_generation'
  | 'email_personalization'
  | 'email_improvement'
  | 'followup_generator'
  | 'subject_line_generator'

interface GenerateOptions {
  actionType: AIActionType
  prompt: string
  temperature?: number
  maxTokens?: number
}

/**
 * Generate AI response using Claude API or mock data
 * When USE_MOCK_AI=true, returns mock responses instantly without API calls
 */
export async function generateAIResponse(options: GenerateOptions): Promise<string> {
  const { actionType, prompt, temperature = 0.7, maxTokens = 1024 } = options

  // Return mock response if in testing mode
  if (USE_MOCK) {
    console.log(`[MOCK AI] Action: ${actionType}`)
    console.log(`[MOCK AI] Prompt: ${prompt.substring(0, 100)}...`)

    // Simulate API delay (200-500ms)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

    const mockResponse = MOCK_RESPONSES[actionType] || MOCK_RESPONSES.email_generation
    console.log(`[MOCK AI] Returning mock response (${mockResponse.length} chars)`)

    return mockResponse
  }

  // Make real Claude API call
  console.log(`[REAL AI] Calling Claude API for ${actionType}`)

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: maxTokens,
      temperature,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const textContent = message.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in Claude response')
    }

    return textContent.text
  } catch (error) {
    console.error('[AI ERROR]', error)
    throw new Error('Failed to generate AI response')
  }
}

/**
 * Check if AI is in mock mode
 */
export function isAIMockMode(): boolean {
  return USE_MOCK
}

/**
 * Get credit cost for an AI action
 */
export function getAICreditCost(actionType: AIActionType): number {
  const costs: Record<AIActionType, number> = {
    email_generation: 2,
    email_personalization: 1,
    email_improvement: 1,
    followup_generator: 1,
    subject_line_generator: 1, // Changed from 0.5 to 1 for simplicity
  }

  return costs[actionType]
}
