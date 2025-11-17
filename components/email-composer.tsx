'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

interface EmailComposerProps {
  venueName: string
  venueEmail: string
  creditsBalance: number
  onSend: (subject: string, body: string) => Promise<void>
  onClose: () => void
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

export function EmailComposer({ venueName, venueEmail, creditsBalance, onSend, onClose }: EmailComposerProps) {
  const [tab, setTab] = useState<'compose' | 'templates' | 'ai'>('compose')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  const fillTemplate = (text: string) => {
    return text
      .replace(/{{venue_name}}/g, venueName)
      .replace(/{{band_name}}/g, '[Your Band Name]')
      .replace(/{{user_name}}/g, '[Your Name]')
  }

  const useTemplate = (template: typeof TEMPLATES[0]) => {
    setSubject(fillTemplate(template.subject))
    setBody(fillTemplate(template.body))
    setTab('compose')
  }

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return

    const toastId = toast.loading('Generating email with AI...')
    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          venueName,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubject(data.subject)
        setBody(data.body)
        setTab('compose')
        toast.success('Email generated!', { id: toastId })
      } else {
        toast.error(data.error || 'Failed to generate email', { id: toastId })
      }
    } catch (error) {
      toast.error('Failed to generate email', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error('Please fill in subject and body')
      return
    }

    if (creditsBalance < 1) {
      toast.error('Insufficient credits')
      return
    }

    setLoading(true)
    try {
      await onSend(subject, body)
      // Success toast is handled by parent component
      onClose()
    } catch (error) {
      toast.error('Failed to send email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-brutalist shadow-brutalist max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b-3 border-black">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-black">SEND EMAIL</h2>
              <p className="text-sm">To: {venueEmail}</p>
            </div>
            <button
              onClick={onClose}
              className="text-2xl font-black hover:bg-black hover:text-white px-3 py-1 border-2 border-black"
            >
              ×
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setTab('compose')}
              className={`px-4 py-2 font-bold border-2 border-black ${
                tab === 'compose' ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              COMPOSE
            </button>
            <button
              onClick={() => setTab('templates')}
              className={`px-4 py-2 font-bold border-2 border-black ${
                tab === 'templates' ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              TEMPLATES
            </button>
            <button
              onClick={() => setTab('ai')}
              className={`px-4 py-2 font-bold border-2 border-black ${
                tab === 'ai' ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              AI
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'compose' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-2">SUBJECT</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border-2 border-black p-3 font-mono"
                  placeholder="Subject line..."
                />
              </div>
              <div>
                <label className="block font-bold mb-2">BODY</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full border-2 border-black p-3 font-mono h-64"
                  placeholder="Email body..."
                />
              </div>
              <div className="border-2 border-yellow-400 bg-yellow-100 p-3">
                <p className="font-bold">⚠️ This will cost 1 credit</p>
                <p className="text-sm">Current balance: {creditsBalance} credits</p>
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
              <div>
                <label className="block font-bold mb-2">DESCRIBE YOUR EMAIL</label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full border-2 border-black p-3 font-mono h-32"
                  placeholder="Example: Write a professional email introducing my jazz trio for a weekend booking..."
                />
              </div>
              <button
                onClick={generateWithAI}
                disabled={loading || !aiPrompt.trim()}
                className="w-full border-2 border-black bg-black text-white px-6 py-3 font-bold hover:bg-white hover:text-black transition-colors disabled:opacity-50"
              >
                {loading ? 'GENERATING...' : 'GENERATE EMAIL'}
              </button>
              <p className="text-xs text-gray-600">
                Powered by Claude AI. The generated email will appear in the Compose tab.
              </p>
            </div>
          )}
        </div>

        {tab === 'compose' && (
          <div className="p-6 border-t-3 border-black">
            <button
              onClick={handleSend}
              disabled={loading || creditsBalance < 1}
              className="w-full border-2 border-black bg-black text-white px-6 py-4 font-bold text-lg hover:bg-white hover:text-black transition-colors disabled:opacity-50"
            >
              {loading ? 'SENDING...' : 'SEND EMAIL (1 CREDIT)'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
