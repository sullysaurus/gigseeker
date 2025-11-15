import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gigseeker - Book More Gigs',
  description: 'Get more gigs with less effort. Organize your venue outreach in one simple tool.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
