import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { recipientEmail, subject, body } = await request.json()

    if (!recipientEmail || !subject || !body) {
      return NextResponse.json(
        { error: 'Missing required fields: recipientEmail, subject, body' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check subscription tier and rate limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, display_name, booking_email, daily_email_count, last_email_date')
      .eq('user_id', user.id)
      .single()

    if (!profile || !['pro', 'agency'].includes(profile.subscription_tier)) {
      return NextResponse.json({
        error: 'Email sending requires Pro or Agency subscription',
        requiresUpgrade: true
      }, { status: 402 })
    }

    // Check rate limits
    const { data: canSendData, error: canSendError } = await supabase.rpc('can_send_email_with_limit', {
      p_user_id: user.id
    })

    if (canSendError || !canSendData) {
      const { data: remainingData } = await supabase.rpc('get_remaining_emails', {
        p_user_id: user.id
      })

      const remaining = remainingData || 0
      const limit = profile.subscription_tier === 'pro' ? 100 : 500

      return NextResponse.json({
        error: `Daily email limit reached (${limit} emails/day). ${remaining} remaining today.`,
        dailyLimit: limit,
        remaining: remaining,
        rateLimitExceeded: true
      }, { status: 429 })
    }

    // Send email via Resend
    const fromEmail = process.env.FROM_EMAIL || 'bookings@booking.gigseeker.pro'
    const replyToEmail = profile.booking_email || user.email

    // Convert plain text to HTML with clickable links for tracking
    const htmlBody = body
      .split('\n')
      .map((line: string) => line.trim())
      .map((line: string) => {
        // Convert URLs to clickable links
        const urlRegex = /(https?:\/\/[^\s]+)/g
        return line.replace(urlRegex, '<a href="$1">$1</a>')
      })
      .map((line: string) => line ? `<p>${line}</p>` : '<br>')
      .join('\n')

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      replyTo: replyToEmail,
      subject: subject,
      html: htmlBody,  // HTML for click tracking
      text: body,      // Plain text fallback
    })

    if (emailError || !emailData) {
      return NextResponse.json(
        { error: emailError?.message || 'Failed to send email' },
        { status: 500 }
      )
    }

    // Record email usage
    await supabase.rpc('record_email_send', {
      p_user_id: user.id,
      p_email_campaign_id: null,
      p_venue_id: null,
      p_recipient_email: recipientEmail,
      p_subject: subject,
      p_metadata: {
        resend_email_id: emailData.id,
        blank_email: true
      }
    })

    return NextResponse.json({
      success: true,
      emailId: emailData.id
    })
  } catch (error: any) {
    console.error('Failed to send email:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    )
  }
}
