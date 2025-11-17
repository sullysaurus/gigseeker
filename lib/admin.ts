import { createClient } from '@/lib/supabase/server'

export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data, error } = await supabase.rpc('is_user_admin', {
    p_user_id: user.id
  })

  return data === true
}

export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Unauthorized: Admin access required')
  }
}
