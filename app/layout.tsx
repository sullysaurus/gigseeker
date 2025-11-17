import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'Gigseeker - Book More Gigs',
    template: '%s | Gigseeker',
  },
  description: 'Get more gigs with less effort. Organize your venue outreach in one simple tool.',
  keywords: ['gigs', 'booking', 'music', 'venues', 'artists', 'musicians'],
  authors: [{ name: 'Gigseeker' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    title: 'Gigseeker - Book More Gigs',
    description: 'Get more gigs with less effort. Organize your venue outreach in one simple tool.',
    siteName: 'Gigseeker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gigseeker - Book More Gigs',
    description: 'Get more gigs with less effort. Organize your venue outreach in one simple tool.',
  },
  robots: {
    index: true,
    follow: true,
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
