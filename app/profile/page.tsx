'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface ArtistProfile {
  id?: string
  artist_name: string
  contact_name: string
  city: string
  state: string
  bio: string
  genres: string[]
  website: string
  spotify_url: string
  instagram_url: string
  facebook_url: string
  youtube_url: string
  tiktok_url: string
  bandcamp_url: string
  soundcloud_url: string
  epk_url: string
  typical_audience_size: string
  years_active: number | null
  notable_venues: string
  awards_achievements: string
}

const EMPTY_PROFILE: ArtistProfile = {
  artist_name: '',
  contact_name: '',
  city: '',
  state: '',
  bio: '',
  genres: [],
  website: '',
  spotify_url: '',
  instagram_url: '',
  facebook_url: '',
  youtube_url: '',
  tiktok_url: '',
  bandcamp_url: '',
  soundcloud_url: '',
  epk_url: '',
  typical_audience_size: '',
  years_active: null,
  notable_venues: '',
  awards_achievements: ''
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<ArtistProfile>(EMPTY_PROFILE)
  const [genreInput, setGenreInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [credits, setCredits] = useState(0)
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'pro' | 'agency'>('free')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const supabase = createClient()

    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
      window.location.href = '/sign-in'
      return
    }
    setUser(currentUser)

    // Get AI credits and subscription tier
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('ai_credits_balance, subscription_tier')
      .eq('user_id', currentUser.id)
      .maybeSingle()

    if (userProfile) {
      setCredits(userProfile.ai_credits_balance)
      setSubscriptionTier(userProfile.subscription_tier || 'free')
    }

    // Get artist profile
    const { data: artistProfile } = await supabase
      .from('artist_profile')
      .select('*')
      .eq('user_id', currentUser.id)
      .maybeSingle()

    if (artistProfile) {
      setProfile(artistProfile)
    }

    setLoading(false)
  }

  const handleSave = async () => {
    if (!profile.artist_name.trim()) {
      toast.error('Artist/Band name is required')
      return
    }

    setSaving(true)
    const supabase = createClient()

    try {
      if (profile.id) {
        // Update existing profile
        const { error } = await supabase
          .from('artist_profile')
          .update({
            artist_name: profile.artist_name,
            contact_name: profile.contact_name,
            city: profile.city,
            state: profile.state,
            bio: profile.bio,
            genres: profile.genres,
            website: profile.website,
            spotify_url: profile.spotify_url,
            instagram_url: profile.instagram_url,
            facebook_url: profile.facebook_url,
            youtube_url: profile.youtube_url,
            tiktok_url: profile.tiktok_url,
            bandcamp_url: profile.bandcamp_url,
            soundcloud_url: profile.soundcloud_url,
            epk_url: profile.epk_url,
            typical_audience_size: profile.typical_audience_size,
            years_active: profile.years_active,
            notable_venues: profile.notable_venues,
            awards_achievements: profile.awards_achievements,
          })
          .eq('id', profile.id)

        if (error) throw error
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from('artist_profile')
          .insert({
            user_id: user.id,
            ...profile
          })
          .select()
          .single()

        if (error) throw error
        if (data) setProfile(data)
      }

      toast.success('Artist profile saved!')
    } catch (error: any) {
      console.error('Failed to save profile:', error)
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const addGenre = () => {
    if (genreInput.trim() && !profile.genres.includes(genreInput.trim())) {
      setProfile({ ...profile, genres: [...profile.genres, genreInput.trim()] })
      setGenreInput('')
    }
  }

  const removeGenre = (genre: string) => {
    setProfile({ ...profile, genres: profile.genres.filter(g => g !== genre) })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation user={user} aiCreditsBalance={credits} subscriptionTier={subscriptionTier} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 font-bold text-xl">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} aiCreditsBalance={credits} subscriptionTier={subscriptionTier} />

      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black mb-2">ARTIST PROFILE</h1>
            <p className="text-lg text-gray-600">
              This info will auto-fill templates and personalize AI-generated emails
            </p>
          </div>

          <div className="space-y-8">
            {/* Basic Info */}
            <div className="border-4 border-black bg-white shadow-brutalist">
              <div className="border-b-4 border-black p-6 bg-accent-yellow">
                <h2 className="text-2xl font-black">BASIC INFO</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-2 text-sm">ARTIST/BAND NAME *</label>
                    <input
                      type="text"
                      value={profile.artist_name}
                      onChange={(e) => setProfile({ ...profile, artist_name: e.target.value })}
                      className="w-full border-2 border-black p-3 font-mono"
                      placeholder="Your band name"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-2 text-sm">YOUR NAME</label>
                    <input
                      type="text"
                      value={profile.contact_name}
                      onChange={(e) => setProfile({ ...profile, contact_name: e.target.value })}
                      className="w-full border-2 border-black p-3 font-mono"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-2 text-sm">CITY</label>
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      className="w-full border-2 border-black p-3 font-mono"
                      placeholder="Raleigh"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-2 text-sm">STATE</label>
                    <input
                      type="text"
                      value={profile.state}
                      onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                      className="w-full border-2 border-black p-3 font-mono"
                      placeholder="NC"
                      maxLength={2}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-2 text-sm">GENRES</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={genreInput}
                      onChange={(e) => setGenreInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGenre())}
                      className="flex-1 border-2 border-black p-3 font-mono"
                      placeholder="Add genre and press Enter"
                    />
                    <button
                      onClick={addGenre}
                      className="border-2 border-black bg-black text-white px-6 py-3 font-bold hover:bg-white hover:text-black transition-colors"
                    >
                      ADD
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {profile.genres.map((genre) => (
                      <span
                        key={genre}
                        className="border-2 border-black px-3 py-1 font-bold text-sm flex items-center gap-2"
                      >
                        {genre}
                        <button
                          onClick={() => removeGenre(genre)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-2 text-sm">BIO</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full border-2 border-black p-3 font-mono h-32"
                    placeholder="Describe your sound, style, and what makes you unique..."
                  />
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="border-4 border-black bg-white shadow-brutalist">
              <div className="border-b-4 border-black p-6 bg-accent-blue text-white">
                <h2 className="text-2xl font-black">EXPERIENCE</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-2 text-sm">TYPICAL AUDIENCE SIZE</label>
                    <input
                      type="text"
                      value={profile.typical_audience_size}
                      onChange={(e) => setProfile({ ...profile, typical_audience_size: e.target.value })}
                      className="w-full border-2 border-black p-3 font-mono"
                      placeholder="50-100 people"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-2 text-sm">YEARS ACTIVE</label>
                    <input
                      type="number"
                      value={profile.years_active || ''}
                      onChange={(e) => setProfile({ ...profile, years_active: e.target.value ? parseInt(e.target.value) : null })}
                      className="w-full border-2 border-black p-3 font-mono"
                      placeholder="5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-2 text-sm">NOTABLE VENUES</label>
                  <textarea
                    value={profile.notable_venues}
                    onChange={(e) => setProfile({ ...profile, notable_venues: e.target.value })}
                    className="w-full border-2 border-black p-3 font-mono h-24"
                    placeholder="List venues you've played at..."
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2 text-sm">AWARDS & ACHIEVEMENTS</label>
                  <textarea
                    value={profile.awards_achievements}
                    onChange={(e) => setProfile({ ...profile, awards_achievements: e.target.value })}
                    className="w-full border-2 border-black p-3 font-mono h-24"
                    placeholder="Any awards, press mentions, or achievements..."
                  />
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="border-4 border-black bg-white shadow-brutalist">
              <div className="border-b-4 border-black p-6 bg-accent-purple text-white">
                <h2 className="text-2xl font-black">LINKS & SOCIAL MEDIA</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block font-bold mb-2 text-sm">WEBSITE</label>
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    className="w-full border-2 border-black p-3 font-mono"
                    placeholder="https://yourband.com"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2 text-sm">EPK (ELECTRONIC PRESS KIT)</label>
                  <input
                    type="url"
                    value={profile.epk_url}
                    onChange={(e) => setProfile({ ...profile, epk_url: e.target.value })}
                    className="w-full border-2 border-black p-3 font-mono"
                    placeholder="https://link-to-your-epk.com"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-2 text-sm">SPOTIFY</label>
                    <input
                      type="url"
                      value={profile.spotify_url}
                      onChange={(e) => setProfile({ ...profile, spotify_url: e.target.value })}
                      className="w-full border-2 border-black p-3 font-mono"
                      placeholder="https://open.spotify.com/artist/..."
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-2 text-sm">INSTAGRAM</label>
                    <input
                      type="url"
                      value={profile.instagram_url}
                      onChange={(e) => setProfile({ ...profile, instagram_url: e.target.value })}
                      className="w-full border-2 border-black p-3 font-mono"
                      placeholder="https://instagram.com/yourband"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-2 text-sm">FACEBOOK</label>
                    <input
                      type="url"
                      value={profile.facebook_url}
                      onChange={(e) => setProfile({ ...profile, facebook_url: e.target.value })}
                      className="w-full border-2 border-black p-3 font-mono"
                      placeholder="https://facebook.com/yourband"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-2 text-sm">YOUTUBE</label>
                    <input
                      type="url"
                      value={profile.youtube_url}
                      onChange={(e) => setProfile({ ...profile, youtube_url: e.target.value })}
                      className="w-full border-2 border-black p-3 font-mono"
                      placeholder="https://youtube.com/@yourband"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-2 text-sm">TIKTOK</label>
                    <input
                      type="url"
                      value={profile.tiktok_url}
                      onChange={(e) => setProfile({ ...profile, tiktok_url: e.target.value })}
                      className="w-full border-2 border-black p-3 font-mono"
                      placeholder="https://tiktok.com/@yourband"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-2 text-sm">BANDCAMP</label>
                    <input
                      type="url"
                      value={profile.bandcamp_url}
                      onChange={(e) => setProfile({ ...profile, bandcamp_url: e.target.value })}
                      className="w-full border-2 border-black p-3 font-mono"
                      placeholder="https://yourband.bandcamp.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-2 text-sm">SOUNDCLOUD</label>
                  <input
                    type="url"
                    value={profile.soundcloud_url}
                    onChange={(e) => setProfile({ ...profile, soundcloud_url: e.target.value })}
                    className="w-full border-2 border-black p-3 font-mono"
                    placeholder="https://soundcloud.com/yourband"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full border-4 border-black bg-black text-white px-8 py-4 font-black text-xl hover:bg-white hover:text-black transition-colors shadow-brutalist disabled:opacity-50"
            >
              {saving ? 'SAVING...' : 'SAVE PROFILE'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
