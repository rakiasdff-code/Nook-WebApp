# Nook - Your Reading Sanctuary

A reading tracking web app with immersive atmospheric environments.

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS 3** - Styling
- **Firebase** - Authentication, Firestore, Storage
- **Radix UI** - Component library
- **Google Books API** - Book metadata
- **Stripe** - Subscription management

## Features

- 🔐 User authentication (email/password)
- 📚 Book search & cataloging (Google Books API)
- 📖 Personal library with reading states:
  - Reading
  - Read  
  - Want to Read
  - Abandoned
- ⭐ Book ratings, notes, and custom lists
- 🎨 **Atmospheres**: Immersive environments with background videos + ambient audio
- 📥 Goodreads import capability  
- 💳 Subscription system (Free + Premium tiers)

## Project Structure

```
/app                      # Next.js App Router
  /(auth)                # Auth pages (login, register)
  /(main)                # Main app pages (home, my-nook, bookshelf)
  layout.tsx             # Root layout with fonts
  page.tsx               # Root redirect
  globals.css            # Global styles and Tailwind

/components              # React components
  /ui                    # Radix UI components
  Header.tsx             # Main header/navigation
  Logo.tsx               # Logo component

/lib                     # Utilities and configurations
  firebase.ts            # Firebase initialization
  auth.ts                # Authentication functions
  utils.ts               # Utility functions

/types                   # TypeScript type definitions
  index.ts               # Shared types

/public                  # Static assets
```

## Firebase Collections

### `users/{userId}`
- `uid`: string
- `email`: string
- `displayName`: string
- `subscription`: "free" | "premium"
- `createdAt`: timestamp

### `userLibraries/{userId}/books/{bookId}`
- `status`: "reading" | "read" | "want-to-read" | "abandoned"
- `rating`: number (1-5)
- `progress`: number (0-100)
- `notes`: string
- `startDate`: timestamp
- `finishDate`: timestamp
- `addedDate`: timestamp

### `books/{bookId}`
- Cached metadata from Google Books API
- `title`, `author`, `coverUrl`, `isbn`, etc.

### `atmospheres/{id}`
- `name`: string
- `videoUrl`: string
- `audioUrl`: string
- `isPremium`: boolean
- `category`: string

## Typography

- **Headers**: Vollkorn (serif)
- **Body**: Inter (sans-serif)

## Getting Started

### Prerequisites

- Node.js 18+ or 22+ (recommended)
- pnpm package manager
- Firebase account
- Google Books API key
- Stripe account (for payments)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd neon-field
```

2. Install dependencies with Node.js v22
```bash
# Make sure you're using Node.js v22 (required for Vite 7)
nvm use 22  # or nvm install 22 if not installed

pnpm install
```

3. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_FIREBASE_*` - Firebase configuration
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `GOOGLE_BOOKS_API_KEY` - Google Books API key

4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Enable Storage
5. Copy your Firebase config to `.env.local`

### Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Dashboard
3. Create products for Free and Premium tiers
4. Add webhook endpoint for subscription management

## Development

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm typecheck    # Run TypeScript type checking
```

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy!

### Netlify

1. Build the project: `pnpm build`
2. Deploy the `.next` folder to Netlify
3. Add environment variables in Netlify dashboard

## Color Palette

- **Brand Forest**: `#566033` - Primary brand color
- **Nook Green**: `#5F6B39` - Headers and highlights
- **Nook Green Dark**: `#47502B` - Hover states
- **Surface Paper**: `#EFEDEB` - Background
- **Surface Paper Light**: `#FCFBF8` - Cards and containers
- **Nook Brown**: `#4D453F` - Body text

## Contributing

This is a private project. Contact the owner for contribution guidelines.

## License

All rights reserved.

