import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'
import { AdminDashboard } from '@/components/admin-dashboard'

export default async function AdminPage() {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) {
    redirect('/sign-in')
  }

  // Check admin status
  const admin = await isAdmin()
  if (!admin) {
    redirect('/pipeline')
  }

  // Get user's profile for the dashboard
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <AdminDashboard
      user={{ email: user.email, id: user.id }}
      profile={profile}
    />
  )
}
