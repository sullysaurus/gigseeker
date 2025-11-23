import Link from 'next/link'
import { CheckoutButton } from '@/components/checkout-button'
import { Navigation } from '@/components/navigation'

export default function Home() {
  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Gigseeker',
    applicationCategory: 'BusinessApplication',
    offers: [
      {
        '@type': 'Offer',
        name: 'Free',
        price: '0',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        price: '29',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'Agency',
        price: '129',
        priceCurrency: 'USD',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
    },
    description: 'Pre-verified venues with booking contacts. Track link clicks, use AI writing assists, and book more shows.',
    operatingSystem: 'Web',
    url: 'https://gigseeker.vercel.app',
  }

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none"></div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-block mb-6">
              <span className="border-2 border-black px-4 py-2 font-bold text-sm bg-accent-yellow">
                ✨ START FREE - NO CREDIT CARD
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-6 leading-tight">
              BOOK MORE
              <br />
              <span className="text-gradient">GIGS</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl font-bold mb-4 max-w-2xl mx-auto px-4">
              Stop wasting time on email.<br />Start booking shows.
            </p>

            <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
              Pre-verified venues with booking contacts. No more googling. No more hunting for emails. Just organized outreach that actually books shows.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/sign-up" className="btn-primary shadow-brutalist">
                GET STARTED FREE
              </Link>
              <Link href="/sign-in" className="btn-secondary shadow-brutalist">
                SIGN IN
              </Link>
            </div>
          </div>

          {/* Feature Preview */}
          <div className="mt-16 animate-slide-up">
            <div className="border-brutalist shadow-brutalist-lg bg-white p-4 md:p-8 max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-accent-yellow"></div>
                <div className="w-3 h-3 rounded-full bg-accent-green"></div>
                <span className="ml-auto font-mono text-xs md:text-sm">gigseeker.app</span>
              </div>

              <div className="bg-gray-50 border-2 border-black p-3 md:p-6">
                {/* Mock pipeline table */}
                <div className="bg-white border-2 border-black overflow-x-auto">
                  <table className="w-full font-mono text-[10px] md:text-xs min-w-[500px]">
                    <thead className="border-b-2 border-black bg-gray-100">
                      <tr>
                        <th className="p-1.5 md:p-2 text-left font-black">NAME</th>
                        <th className="p-1.5 md:p-2 text-left font-black hidden sm:table-cell">CITY</th>
                        <th className="p-1.5 md:p-2 text-left font-black">STATUS</th>
                        <th className="p-1.5 md:p-2 text-left font-black hidden md:table-cell">PRIORITY</th>
                        <th className="p-1.5 md:p-2 text-left font-black hidden lg:table-cell">CONTACT</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="p-1.5 md:p-2 whitespace-nowrap">The Pour House</td>
                        <td className="p-1.5 md:p-2 hidden sm:table-cell">Raleigh</td>
                        <td className="p-1.5 md:p-2"><span className="bg-yellow-100 border border-black px-1.5 md:px-2 py-0.5 text-[10px] md:text-xs whitespace-nowrap">Contacted</span></td>
                        <td className="p-1.5 md:p-2 hidden md:table-cell"><span className="bg-red-500 text-white border border-black px-1.5 md:px-2 py-0.5 text-[10px] md:text-xs">High</span></td>
                        <td className="p-1.5 md:p-2 hidden lg:table-cell">2x</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-1.5 md:p-2 whitespace-nowrap">Lincoln Theatre</td>
                        <td className="p-1.5 md:p-2 hidden sm:table-cell">Raleigh</td>
                        <td className="p-1.5 md:p-2"><span className="bg-purple-100 border border-black px-1.5 md:px-2 py-0.5 text-[10px] md:text-xs whitespace-nowrap">Opened</span></td>
                        <td className="p-1.5 md:p-2 hidden md:table-cell"><span className="bg-yellow-500 border border-black px-1.5 md:px-2 py-0.5 text-[10px] md:text-xs">Med</span></td>
                        <td className="p-1.5 md:p-2 hidden lg:table-cell">1x</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-1.5 md:p-2 whitespace-nowrap">Motorco Hall</td>
                        <td className="p-1.5 md:p-2 hidden sm:table-cell">Durham</td>
                        <td className="p-1.5 md:p-2"><span className="bg-green-100 border border-black px-1.5 md:px-2 py-0.5 text-[10px] md:text-xs whitespace-nowrap">Booked</span></td>
                        <td className="p-1.5 md:p-2 hidden md:table-cell"><span className="bg-red-500 text-white border border-black px-1.5 md:px-2 py-0.5 text-[10px] md:text-xs">High</span></td>
                        <td className="p-1.5 md:p-2 hidden lg:table-cell">3x</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-1.5 md:p-2 whitespace-nowrap">Deep South</td>
                        <td className="p-1.5 md:p-2 hidden sm:table-cell">Raleigh</td>
                        <td className="p-1.5 md:p-2"><span className="bg-blue-100 border border-black px-1.5 md:px-2 py-0.5 text-[10px] md:text-xs whitespace-nowrap">Approved</span></td>
                        <td className="p-1.5 md:p-2 hidden md:table-cell"><span className="bg-green-500 text-white border border-black px-1.5 md:px-2 py-0.5 text-[10px] md:text-xs">Low</span></td>
                        <td className="p-1.5 md:p-2 hidden lg:table-cell">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16">
            EVERYTHING YOU NEED
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="card-hover animate-slide-up bg-accent-green">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl md:text-2xl font-black mb-3">VERIFIED VENUE DATA</h3>
              <p className="text-base md:text-lg">
                No more googling for booking contacts. Every venue includes verified email addresses, genres, and capacity. Pre-researched and ready to contact.
              </p>
            </div>

            <div className="card-hover animate-slide-up bg-accent-blue" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl md:text-2xl font-black mb-3">AI WRITING ASSISTS</h3>
              <p className="text-base md:text-lg">
                Get past writer's block with AI-powered email improvements, subject lines, and followups. You stay in control—AI just helps you write faster.
              </p>
            </div>

            <div className="card-hover animate-slide-up bg-accent-yellow sm:col-span-2 lg:col-span-1" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl md:text-2xl font-black mb-3">SMART TRACKING</h3>
              <p className="text-base md:text-lg">
                Track every venue from discovery to booking. See link clicks, manage followups, and never lose track of a potential gig.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
              SIMPLE PRICING
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Start free. Upgrade when you're ready to book more shows.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <div className="border-3 border-black bg-white p-6 md:p-8 hover:shadow-brutalist transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-black mb-2">FREE</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-black">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-700">Build your pipeline</p>
              </div>

              <Link
                href="/sign-up"
                className="block w-full border-2 border-black bg-white text-black px-6 py-3 font-bold text-center hover:bg-gray-100 transition-colors mb-6"
              >
                GET STARTED
              </Link>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Verified venue database</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Booking contact emails</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Organize pipeline</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Up to 20 venues</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Track notes & status</span>
                </div>
                <div className="flex items-start gap-2 opacity-40">
                  <span className="font-bold">✗</span>
                  <span>Send emails</span>
                </div>
              </div>
            </div>

            {/* Pro Tier - Most Popular */}
            <div className="border-3 border-black bg-accent-yellow p-6 md:p-8 relative hover:shadow-brutalist transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 bg-black text-white px-3 md:px-4 py-1 text-xs font-bold whitespace-nowrap">
                MOST POPULAR
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-black mb-2">PRO</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-black">$29</span>
                  <span className="text-gray-700">/month</span>
                </div>
                <p className="text-gray-900 font-bold">Actually book shows</p>
              </div>

              <CheckoutButton
                priceId={process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!}
                tierName="Pro"
                className="block w-full border-2 border-black bg-black text-white px-6 py-3 font-bold text-center hover:bg-white hover:text-black transition-colors mb-6"
              >
                START PRO TRIAL
              </CheckoutButton>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Everything in Free</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Send emails to venues</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Track link clicks</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>AI writing assists</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Unlimited venues</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Email improvement suggestions</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Subject line generator</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Auto follow-up reminders</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Email analytics</span>
                </div>
              </div>
            </div>

            {/* Agency Tier */}
            <div className="border-3 border-black bg-white p-6 md:p-8 hover:shadow-brutalist transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-black mb-2">AGENCY</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-black">$129</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-700">For managers & agencies</p>
              </div>

              <CheckoutButton
                priceId={process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID!}
                tierName="Agency"
                className="block w-full border-2 border-black bg-white text-black px-6 py-3 font-bold text-center hover:bg-gray-100 transition-colors mb-6"
              >
                GO AGENCY
              </CheckoutButton>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Everything in Pro</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>3-5 team members</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Multi-artist management</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Bulk venue imports</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Advanced analytics</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Tour routing optimization</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Priority support</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Custom integrations</span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ or note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600">
              All plans include verified venue database and CRM pipeline access.
              <br />
              Pro and Agency include email sending, link tracking, and AI features.
              <br />
              No credit card required. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-12 md:mb-16">
            HOW IT WORKS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { step: '1', title: 'SEARCH VENUES', desc: 'Pre-verified venues with booking contacts ready to go' },
              { step: '2', title: 'ADD TO PIPELINE', desc: 'Organize venues by status and priority' },
              { step: '3', title: 'SEND EMAILS', desc: 'Craft personalized emails with templates' },
              { step: '4', title: 'TRACK & BOOK', desc: 'See link clicks, track responses, confirm gigs' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 border-brutalist bg-black text-white text-xl md:text-2xl font-black mb-3 md:mb-4 shadow-brutalist">
                  {item.step}
                </div>
                <h3 className="text-base md:text-xl font-black mb-2">{item.title}</h3>
                <p className="text-sm md:text-base text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 md:mb-6">
            READY TO BOOK MORE SHOWS?
          </h2>
          <p className="text-lg md:text-xl mb-8 md:mb-10">
            Start free. No credit card required.
          </p>
          <Link
            href="/sign-up"
            className="inline-block border-brutalist bg-accent-yellow text-black px-8 md:px-12 py-4 md:py-5 font-bold text-lg md:text-xl hover:bg-white transition-all shadow-brutalist"
          >
            GET STARTED FREE →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-3 border-black bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="font-black text-xl mb-4">GIGSEEKER</div>
          <p className="text-sm text-gray-600">
            © 2025 Gigseeker. Book more gigs with less effort.
          </p>
        </div>
      </footer>
    </div>
  )
}
