import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface ResendWebhookEvent {
  type: 'email.sent' | 'email.delivered' | 'email.opened' | 'email.clicked' | 'email.bounced' | 'email.complained'
  created_at: string
  data: {
    email_id: string
    to: string[]
    from: string
    subject: string
    bounce_type?: string
    click?: {
      link: string
    }
  }
}

export async function POST(request: Request) {
  try {
    const event: ResendWebhookEvent = await request.json()

    const supabase = await createClient()

    // Call database function to process the event
    const { error } = await supabase.rpc('process_email_event', {
      p_resend_email_id: event.data.email_id,
      p_event_type: event.type,
      p_occurred_at: event.created_at,
      p_recipient_email: event.data.to[0],
      p_bounce_type: event.data.bounce_type || null,
      p_click_url: event.data.click?.link || null,
      p_raw_payload: event,
    })

    if (error) {
      console.error('Webhook processing error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}
