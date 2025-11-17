import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/email/limits
 * Returns the user's email limits and current usage
 */
export async function GET() {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, daily_email_count, last_email_date')
      .eq('user_id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Get daily limit based on tier
    const { data: dailyLimit } = await supabase.rpc('get_daily_email_limit', {
      p_user_id: user.id
    })

    // Get remaining emails
    const { data: remaining } = await supabase.rpc('get_remaining_emails', {
      p_user_id: user.id
    })

    // Check if it's a new day (client-side check)
    const today = new Date().toISOString().split('T')[0]
    const lastEmailDate = profile.last_email_date
    const isNewDay = lastEmailDate !== today

    return NextResponse.json({
      subscription_tier: profile.subscription_tier,
      daily_limit: dailyLimit || 0,
      used_today: isNewDay ? 0 : (profile.daily_email_count || 0),
      remaining: remaining || (dailyLimit || 0),
      can_send_emails: ['pro', 'agency'].includes(profile.subscription_tier),
      last_reset: lastEmailDate,
    })
  } catch (error: any) {
    console.error('Failed to get email limits:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get email limits' },
      { status: 500 }
    )
  }
}
