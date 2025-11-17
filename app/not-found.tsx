import Link from 'next/link'
import { Navigation } from '@/components/navigation'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex items-center justify-center px-4 py-20">
        <div className="border-brutalist p-12 shadow-brutalist-lg max-w-md w-full text-center bg-white animate-slide-up">
          <div className="text-8xl font-black mb-4 text-gradient">404</div>
          <p className="mb-2 text-3xl font-black">PAGE NOT FOUND</p>
          <p className="mb-8 text-gray-600">
            Looks like this venue doesn't exist (yet!)
          </p>
          <Link
            href="/"
            className="btn-primary shadow-brutalist inline-block"
          >
            GO HOME
          </Link>
        </div>
      </main>
    </div>
  )
}
