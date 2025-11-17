import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ isAdmin: false })
    }

    const { data, error } = await supabase.rpc('is_user_admin', {
      p_user_id: user.id
    })

    if (error) {
      console.error('Admin check error:', error)
      return NextResponse.json({ isAdmin: false })
    }

    return NextResponse.json({ isAdmin: data === true })
  } catch (error) {
    console.error('Admin check error:', error)
    return NextResponse.json({ isAdmin: false })
  }
}
