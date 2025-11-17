import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Gigseeker - Book More Gigs with Verified Venue Data',
    template: '%s | Gigseeker',
  },
  description: 'Pre-verified venues with booking contacts. No more googling. Track link clicks, use AI writing assists, and book more shows. Start free.',
  keywords: [
    'gig booking',
    'venue database',
    'music booking',
    'band booking',
    'venue contacts',
    'musician CRM',
    'gig management',
    'booking agent software',
    'tour booking',
    'venue finder',
  ],
  authors: [{ name: 'Gigseeker' }],
  creator: 'Gigseeker',
  publisher: 'Gigseeker',
  applicationName: 'Gigseeker',
  category: 'Music',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Gigseeker - Book More Gigs with Verified Venue Data',
    description: 'Pre-verified venues with booking contacts. No more googling. Track link clicks, use AI writing assists, and book more shows. Start free.',
    siteName: 'Gigseeker',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Gigseeker - Book More Gigs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gigseeker - Book More Gigs with Verified Venue Data',
    description: 'Pre-verified venues with booking contacts. Track link clicks, use AI assists, book more shows. Start free.',
    images: ['/og-image.png'],
    creator: '@gigseeker',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              border: '3px solid #000',
              padding: '16px',
              fontWeight: 'bold',
              fontFamily: 'inherit',
            },
            success: {
              style: {
                background: '#00FF88',
              },
              iconTheme: {
                primary: '#000',
                secondary: '#00FF88',
              },
            },
            error: {
              style: {
                background: '#FF006B',
                color: '#fff',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#FF006B',
              },
            },
            loading: {
              style: {
                background: '#FFE500',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
