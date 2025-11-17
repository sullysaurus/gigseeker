'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface EmailComposerProps {
  venueName?: string
  venueEmail?: string
  venueId?: string
  pipelineVenueId?: string
  creditsBalance: number
  onSend: (recipientEmail: string, subject: string, body: string) => Promise<void>
  onClose: () => void
  onCreditsUpdate?: (newBalance: number) => void
}

interface ArtistProfile {
  artist_name: string
  contact_name: string
  city: string
  state: string
  bio: string
  genres: string[]
  typical_audience_size: string
  epk_url: string
  spotify_url: string
}

const TEMPLATES = [
  {
    id: 'cold-outreach',
    name: 'Cold Outreach',
    subject: 'Booking Inquiry - {{band_name}}',
    body: `Hi there,

My name is {{user_name}} and I'm reaching out on behalf of {{band_name}}. We're currently booking shows for the upcoming months and would love to perform at {{venue_name}}.

Our sound is [describe your music] and we typically draw [audience size] to our shows. We have [experience details].

Would you be interested in having us perform? I'd be happy to send over our EPK, music samples, and discuss available dates.

Looking forward to hearing from you!

Best,
{{user_name}}
{{band_name}}`
  },
  {
    id: 'follow-up',
    name: 'Follow-Up',
    subject: 'Following up - {{band_name}}',
    body: `Hi there,

I wanted to follow up on my previous email about booking a show at {{venue_name}}.

We're still very interested in performing at your venue and would love to discuss potential dates.

Please let me know if you'd like more information about our band.

Thanks,
{{user_name}}`
  },
  {
    id: 'short-sweet',
    name: 'Short & Sweet',
    subject: '{{band_name}} - Booking Inquiry',
    body: `Hey!

I'm {{user_name}} from {{band_name}}. We'd love to play at {{venue_name}}.

Can we chat about booking a show?

Thanks!
{{user_name}}`
  }
]

export function EmailComposer({ venueName, venueEmail, venueId, pipelineVenueId, creditsBalance, onSend, onClose, onCreditsUpdate }: EmailComposerProps) {
  const [tab, setTab] = useState<'compose' | 'templates' | 'ai'>('compose')
  const [recipientEmail, setRecipientEmail] = useState(venueEmail || '')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [artistProfile, setArtistProfile] = useState<ArtistProfile | null>(null)

  // Load artist profile on mount
  useEffect(() => {
    const loadArtistProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('artist_profile')
        .select('artist_name, contact_name, city, state, bio, genres, typical_audience_size, epk_url, spotify_url')
        .eq('user_id', user.id)
        .maybeSingle()

      if (data) {
        setArtistProfile(data)
      }
    }

    loadArtistProfile()
  }, [])

  const fillTemplate = (text: string) => {
    let filled = text
      .replace(/{{venue_name}}/g, venueName || '[Venue Name]')
      .replace(/{{band_name}}/g, artistProfile?.artist_name || '[Your Band Name]')
      .replace(/{{user_name}}/g, artistProfile?.contact_name || '[Your Name]')
      .replace(/{{city}}/g, artistProfile?.city || '[Your City]')
      .replace(/{{state}}/g, artistProfile?.state || '[State]')
      .replace(/{{bio}}/g, artistProfile?.bio || '[Your Bio]')
      .replace(/{{genres}}/g, artistProfile?.genres?.join(', ') || '[Your Genres]')
      .replace(/{{audience_size}}/g, artistProfile?.typical_audience_size || '[Audience Size]')
      .replace(/{{epk_url}}/g, artistProfile?.epk_url || '[EPK URL]')
      .replace(/{{spotify_url}}/g, artistProfile?.spotify_url || '[Spotify URL]')

    return filled
  }

  const useTemplate = (template: typeof TEMPLATES[0]) => {
    setSubject(fillTemplate(template.subject))
    setBody(fillTemplate(template.body))
    setTab('compose')
  }

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return

    const toastId = toast.loading('Generating email with AI... (2 credits)')
    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          venueName,
          venueId,
          pipelineVenueId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubject(data.subject)
        setBody(data.body)
        setTab('compose')
        toast.success(`Email generated! ${data.mockMode ? '(Test Mode)' : ''} ${data.creditsRemaining} credits remaining`, { id: toastId })
        if (onCreditsUpdate && data.creditsRemaining !== undefined) {
          onCreditsUpdate(data.creditsRemaining)
        }
      } else {
        if (data.requiresCredits) {
          toast.error(`Insufficient credits. Need ${data.creditsNeeded}, have ${data.creditsAvailable}`, { id: toastId })
        } else {
          toast.error(data.error || 'Failed to generate email', { id: toastId })
        }
      }
    } catch (error) {
      toast.error('Failed to generate email', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  const improveEmail = async () => {
    if (!body.trim()) {
      toast.error('Write an email draft first')
      return
    }

    const toastId = toast.loading('Improving email with AI... (1 credit)')
    setLoading(true)
    try {
      const response = await fetch('/api/ai/improve-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailDraft: { subject, body },
          venueName,
          venueId,
          pipelineVenueId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubject(data.subject)
        setBody(data.body)
        toast.success(`Email improved! ${data.mockMode ? '(Test Mode)' : ''} ${data.creditsRemaining} credits remaining`, { id: toastId })
        if (onCreditsUpdate && data.creditsRemaining !== undefined) {
          onCreditsUpdate(data.creditsRemaining)
        }
      } else {
        if (data.requiresCredits) {
          toast.error(`Insufficient credits. Need ${data.creditsNeeded}, have ${data.creditsAvailable}`, { id: toastId })
        } else {
          toast.error(data.error || 'Failed to improve email', { id: toastId })
        }
      }
    } catch (error) {
      toast.error('Failed to improve email', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  const generateSubjectLines = async () => {
    if (!body.trim()) {
      toast.error('Write an email body first')
      return
    }

    const toastId = toast.loading('Generating subject lines... (1 credit)')
    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate-subject-lines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailBody: body,
          venueName,
          venueId,
          pipelineVenueId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Show suggestions in a modal or as a list
        const suggestions = data.suggestions || []
        const selected = await showSubjectSuggestions(suggestions)
        if (selected) {
          setSubject(selected)
        }
        toast.success(`Subject lines generated! ${data.mockMode ? '(Test Mode)' : ''} ${data.creditsRemaining} credits remaining`, { id: toastId })
        if (onCreditsUpdate && data.creditsRemaining !== undefined) {
          onCreditsUpdate(data.creditsRemaining)
        }
      } else {
        if (data.requiresCredits) {
          toast.error(`Insufficient credits. Need ${data.creditsNeeded}, have ${data.creditsAvailable}`, { id: toastId })
        } else {
          toast.error(data.error || 'Failed to generate subject lines', { id: toastId })
        }
      }
    } catch (error) {
      toast.error('Failed to generate subject lines', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  const showSubjectSuggestions = async (suggestions: string[]): Promise<string | null> => {
    // Simple implementation: show first suggestion, user can regenerate for more
    if (suggestions.length > 0 && suggestions[0]) {
      return suggestions[0]
    }
    return null
  }

  const handleSend = async () => {
    if (!recipientEmail.trim()) {
      toast.error('Please enter a recipient email')
      return
    }
    if (!subject.trim() || !body.trim()) {
      toast.error('Please fill in subject and body')
      return
    }

    setLoading(true)
    try {
      await onSend(recipientEmail, subject, body)
      // Success toast is handled by parent component
      onClose()
    } catch (error: any) {
      // Error handling is done in the parent component
      // which will show subscription upgrade prompts if needed
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white border-brutalist shadow-brutalist max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-3 sm:p-6 border-b-3 border-black">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-black mb-2 sm:mb-3">SEND EMAIL</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <label className="font-bold text-xs sm:text-sm whitespace-nowrap">TO:</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="flex-1 border-2 border-black p-1.5 sm:p-2 font-mono text-xs sm:text-sm"
                  placeholder="recipient@email.com"
                />
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-xl sm:text-2xl font-black hover:bg-black hover:text-white px-2 sm:px-3 py-1 border-2 border-black ml-2 sm:ml-4 flex-shrink-0"
            >
              ×
            </button>
          </div>

          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={() => setTab('compose')}
              className={`flex-1 px-2 sm:px-4 py-1.5 sm:py-2 font-bold text-xs sm:text-base border-2 border-black ${
                tab === 'compose' ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              COMPOSE
            </button>
            <button
              onClick={() => setTab('templates')}
              className={`flex-1 px-2 sm:px-4 py-1.5 sm:py-2 font-bold text-xs sm:text-base border-2 border-black ${
                tab === 'templates' ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              TEMPLATES
            </button>
            <button
              onClick={() => setTab('ai')}
              className={`flex-1 px-2 sm:px-4 py-1.5 sm:py-2 font-bold text-xs sm:text-base border-2 border-black ${
                tab === 'ai' ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              AI
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          {tab === 'compose' && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block font-bold">SUBJECT</label>
                  <button
                    onClick={generateSubjectLines}
                    disabled={loading || !body.trim() || creditsBalance < 1}
                    className="border-2 border-black bg-accent-blue text-white px-3 py-1 font-bold text-xs hover:bg-accent-purple transition-colors disabled:opacity-50"
                    title="Generate 5 subject line options (1 AI credit)"
                  >
                    ✨ AI SUBJECT (1 CREDIT)
                  </button>
                </div>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border-2 border-black p-3 font-mono"
                  placeholder="Subject line..."
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block font-bold">BODY</label>
                  <button
                    onClick={improveEmail}
                    disabled={loading || !body.trim() || creditsBalance < 1}
                    className="border-2 border-black bg-accent-blue text-white px-3 py-1 font-bold text-xs hover:bg-accent-purple transition-colors disabled:opacity-50"
                    title="Polish and improve your email (1 AI credit)"
                  >
                    ✨ IMPROVE (1 CREDIT)
                  </button>
                </div>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full border-2 border-black p-3 font-mono h-64"
                  placeholder="Email body..."
                />
              </div>

              {/* AI Credits Info */}
              <div className="border-2 border-accent-blue bg-blue-50 p-3">
                <p className="font-bold">💳 AI CREDITS: {creditsBalance}</p>
                <p className="text-xs text-gray-600 mt-1">
                  • Email Sending requires Pro subscription (not AI credits)<br />
                  • AI features cost 1-2 credits each<br />
                  • Get 50 credits per referral
                </p>
              </div>
            </div>
          )}

          {tab === 'templates' && (
            <div className="space-y-4">
              {TEMPLATES.map(template => (
                <div key={template.id} className="border-2 border-black p-4">
                  <h3 className="font-black mb-2">{template.name}</h3>
                  <p className="text-sm mb-2 font-mono">{fillTemplate(template.subject)}</p>
                  <p className="text-sm text-gray-700 mb-3 whitespace-pre-line">
                    {fillTemplate(template.body).slice(0, 150)}...
                  </p>
                  <button
                    onClick={() => useTemplate(template)}
                    className="border-2 border-black bg-black text-white px-4 py-2 font-bold hover:bg-white hover:text-black transition-colors"
                  >
                    USE THIS TEMPLATE
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === 'ai' && (
            <div className="space-y-4">
              <div className="border-3 border-accent-yellow bg-yellow-50 p-4">
                <h3 className="font-black mb-2">✨ AI EMAIL GENERATOR</h3>
                <p className="text-sm font-bold mb-2">Costs 2 AI credits</p>
                <p className="text-xs text-gray-600">
                  Powered by Claude AI. Describe what you want and we'll generate a complete email.
                </p>
              </div>

              <div>
                <label className="block font-bold mb-2">DESCRIBE YOUR EMAIL</label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full border-2 border-black p-3 font-mono h-32"
                  placeholder="Example: Write a professional email introducing my jazz trio for a weekend booking. Mention our experience playing at similar venues and our strong local following..."
                />
              </div>

              <button
                onClick={generateWithAI}
                disabled={loading || !aiPrompt.trim() || creditsBalance < 2}
                className="w-full border-2 border-black bg-black text-white px-6 py-3 font-bold hover:bg-white hover:text-black transition-colors disabled:opacity-50"
              >
                {loading ? 'GENERATING...' : 'GENERATE EMAIL (2 CREDITS)'}
              </button>

              <div className="border-2 border-accent-blue bg-blue-50 p-3">
                <p className="font-bold text-sm">OTHER AI FEATURES:</p>
                <ul className="text-xs mt-2 space-y-1">
                  <li>• <strong>Improve</strong> (1 credit) - Polish your draft in the Compose tab</li>
                  <li>• <strong>AI Subject</strong> (1 credit) - Generate subject lines in the Compose tab</li>
                  <li>• <strong>Templates</strong> (Free) - Start with proven templates</li>
                </ul>
              </div>

              <p className="text-xs text-gray-600 text-center">
                💡 Tip: Start with a template (free), then use AI to improve it (1 credit)
              </p>
            </div>
          )}
        </div>

        {tab === 'compose' && (
          <div className="p-6 border-t-3 border-black">
            <button
              onClick={handleSend}
              disabled={loading}
              className="w-full border-2 border-black bg-black text-white px-6 py-4 font-bold text-lg hover:bg-white hover:text-black transition-colors disabled:opacity-50"
            >
              {loading ? 'SENDING...' : 'SEND EMAIL'}
            </button>
            <p className="text-xs text-center mt-2 text-gray-600">
              Email sending requires Pro subscription (not AI credits)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
