import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="border-brutalist p-8 shadow-brutalist">
          <h1 className="text-6xl font-black mb-4">GIGSEEKER</h1>
          <p className="text-2xl font-bold mb-8">
            Get more gigs with less effort.
          </p>
          <p className="text-lg mb-6">
            Book shows consistently by organizing your venue outreach in one simple tool.
          </p>
          <ul className="space-y-2 mb-8 text-lg">
            <li>✓ No more spreadsheets</li>
            <li>✓ No more forgetting follow-ups</li>
            <li>✓ No more missed opportunities</li>
          </ul>
          <div className="space-x-4">
            <Link
              href="/sign-up"
              className="inline-block border-brutalist bg-black text-white px-8 py-4 font-bold text-lg hover:bg-white hover:text-black transition-colors"
            >
              GET STARTED FREE
            </Link>
            <Link
              href="/sign-in"
              className="inline-block border-brutalist bg-white text-black px-8 py-4 font-bold text-lg hover:bg-black hover:text-white transition-colors"
            >
              SIGN IN
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="border-brutalist p-6">
            <h3 className="text-xl font-black mb-2">10 FREE CREDITS</h3>
            <p>Start sending emails to venues immediately</p>
          </div>
          <div className="border-brutalist p-6">
            <h3 className="text-xl font-black mb-2">AUTO-TRACKING</h3>
            <p>See when venues open your emails</p>
          </div>
          <div className="border-brutalist p-6">
            <h3 className="text-xl font-black mb-2">AI ASSISTANT</h3>
            <p>Write professional emails with Claude AI</p>
          </div>
        </div>
      </div>
    </main>
  )
}
