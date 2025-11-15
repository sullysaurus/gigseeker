# Gigseeker

A venue booking pipeline tool for musicians and bands.

## Features

- **Kanban Pipeline Board**: Track venue outreach through 6 stages (Discovered, Ready to Contact, Email Sent, Opened, Responded, Booked)
- **Credits System**: 10 free credits on signup, 1 credit per email sent
- **Referral Program**: Unique referral codes, earn 10 credits per successful referral
- **Email Tracking**: Auto-progression based on email opens, clicks, bounces via Resend webhooks
- **AI Email Writer**: Claude-powered email generation for professional venue outreach
- **Email Templates**: 6 pre-built professional venue booking templates
- **Venue Search**: Filter by city, state, and music genre
- **Magic Link Auth**: Passwordless authentication via Supabase

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Magic Link
- **Email**: Resend API with webhook tracking
- **AI**: Anthropic Claude 3.5 Sonnet
- **Styling**: Tailwind CSS (Brutalist design)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

### 3. Apply Database Migrations

In your Supabase SQL Editor, run the migrations in order:

1. `supabase/migrations/20260115100000_create_credits_system.sql`
2. `supabase/migrations/20260115100001_create_referral_system.sql`
3. `supabase/migrations/20260115100002_create_email_events_table.sql`

### 4. Configure Resend Webhook

In your Resend dashboard, add a webhook endpoint:

- **URL**: `https://your-domain.com/api/webhooks/resend`
- **Events**: `email.sent`, `email.delivered`, `email.opened`, `email.clicked`, `email.bounced`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
gigseeker/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── pipeline/          # Main pipeline/kanban view
│   ├── api/               # API routes
│   └── page.tsx           # Landing page
├── components/            # React components
│   └── pipeline/          # Pipeline-specific components
├── lib/                   # Utilities and helpers
│   └── supabase.ts       # Supabase client setup
└── supabase/
    └── migrations/        # Database migrations
```

## Key Features Implementation

### Auto-Progression

When Resend sends webhook events, the `/api/webhooks/resend` endpoint calls the `process_email_event()` database function which automatically updates the venue card status:

- Email sent → moves to "Email Sent" column
- Email opened → moves to "Opened" column
- Email bounced → moves to "Archived"

### Credits System

- Atomic credit deduction using PostgreSQL functions
- Transaction rollback if email send fails
- Full audit trail in `credit_transactions` table

### Referral System

- Unique 8-character codes auto-generated on signup
- Tracks referral relationships in `referrals` table
- Awards 10 credits when referee completes onboarding

## Deployment

### Vercel (Recommended)

```bash
npm run build
vercel deploy
```

Make sure to set all environment variables in Vercel project settings.

## License

MIT
