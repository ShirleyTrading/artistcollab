# Artist Collab — Remote Music Collaboration Platform

**Platform Name:** Artist Collab  
**Domain:** artistcollab.studio  
**Tagline:** Collaborate Anywhere. Create Together.

---

## Project Overview

Artist Collab is a professional remote music collaboration marketplace and workspace where independent artists, singers, rappers, songwriters, and producers can discover each other, book paid features, securely exchange stems, communicate inside private project rooms, and manage collaboration delivery from start to finish.

---

## Live URLs (Development)

- **Homepage:** `http://localhost:3000/`
- **Explore Artists:** `http://localhost:3000/explore`
- **Feature Marketplace:** `http://localhost:3000/marketplace`
- **Artist Profile (XAVI):** `http://localhost:3000/artist/u1`
- **Service Listing:** `http://localhost:3000/listing/l1`
- **Booking Flow:** `http://localhost:3000/booking/u1`
- **Dashboard:** `http://localhost:3000/dashboard`
- **Project Workspace:** `http://localhost:3000/workspace/p1`
- **Messages:** `http://localhost:3000/dashboard/messages`
- **Earnings:** `http://localhost:3000/dashboard/earnings`
- **Admin Panel:** `http://localhost:3000/admin`
- **Login:** `http://localhost:3000/login`
- **Sign Up:** `http://localhost:3000/signup`

---

## Completed Features (MVP)

### ✅ Landing Page
- Full homepage with hero, how-it-works, featured artists, marketplace preview, testimonials, CTA banner, and footer
- Premium dark-mode design with purple gradient brand aesthetic

### ✅ Authentication
- Login page with demo credentials (xavi@demo.com / demo123)
- Sign up page with account type selection (Artist vs Producer)
- Forgot password flow with confirmation

### ✅ Artist Profiles
- Full public profile with cover image, profile photo, verified badge
- Bio, genre, tags, social links, monthly listeners
- Stats bar (rating, completed projects, response time, availability)
- Service listings with package cards
- Review system with category breakdown
- Featured songs section

### ✅ Artist Discovery / Search
- Grid browse with real-time client-side filtering
- Filters: genre, account type, price range, verified only, live sessions
- Sort: top rated, price, listeners, reviews
- Artist cards with availability status

### ✅ Feature Marketplace
- Service listing browse with category pills and filters
- Detailed listing pages with 3-tier package cards (Basic/Standard/Premium)
- Add-ons section, file format display, order stats

### ✅ Booking / Order Flow
- Full booking form (package selection, project notes, reference upload)
- Payment form UI with Stripe-styled inputs
- Live order summary with platform fee calculation (10%)
- Order confirmation page with next-step guidance

### ✅ Project Workspace
- Private collaboration room per project
- Order summary + escrow payment status
- Interactive project timeline with step progress
- Stem Locker with drag-and-drop file upload
- In-workspace messaging with real-time message sending
- Activity feed with timestamped events
- Deliver/Accept/Revision action buttons

### ✅ Messaging System
- Conversation list sidebar
- Direct message interface with typing indicators
- Unread notification badges
- Project-linked conversation context

### ✅ User Dashboard
- Stats overview (active projects, earnings, ratings)
- Active projects list with quick-open workspace links
- Quick action cards
- Profile completion tracker

### ✅ Admin Panel
- Platform overview with key metrics
- Recent signups and recent orders
- Verification queue with approve/deny actions
- Featured artist management

### ✅ Additional Pages
- My Listings (with create listing modal)
- My Orders (with role-based view)
- Earnings (with visual chart and transaction history)
- Settings (profile + collaboration settings)
- How It Works (full walkthrough)
- Terms of Service, Privacy Policy, Contact

---

## Demo Data

**Artists:**
- `u1` XAVI — Hip-Hop/Trap, Atlanta, GA (★4.9, Verified, 284K listeners)
- `u2` NOVA LEE — R&B/Soul, LA, CA (★5.0, Verified, 512K listeners)
- `u3` BEATSMITH — Trap Producer, NYC (★4.8, Verified, 98K listeners)
- `u4` KALI ROSE — Afrobeats/Pop, London (★4.7, Verified, 1.2M listeners)
- `u5` CIPHER 7 — Conscious Hip-Hop, Chicago (★4.6, 67K listeners)
- `u6` MELODICA — Pop/Indie, Nashville (★4.9, Verified, 340K listeners)
- `u7` SOULWAV — Neo-Soul Producer, Detroit (★4.8, Verified, 145K listeners)
- `u8` DRIP KAYO — Drill, Houston (★4.5, 89K listeners)

**Service Listings:** 5 listings across Feature Verse, Hook/Chorus, Custom Beat, Songwriter categories

**Projects:** 3 sample projects (In Progress, Delivered, Completed)

---

## Tech Stack

- **Framework:** Hono v4 (TypeScript)
- **Runtime:** Cloudflare Pages / Workers
- **Build:** Vite + @hono/vite-build
- **Frontend:** Pure HTML/CSS with Inter + Space Grotesk fonts, Font Awesome icons
- **Data:** In-memory seed data (ready for Supabase/D1 migration)
- **Dev Server:** wrangler pages dev via PM2

---

## Architecture

```
src/
├── index.tsx          # Main Hono router (30+ routes)
├── layout.ts          # Shared HTML layout, nav, sidebar, footer
├── data.ts            # TypeScript seed data + helper functions
└── pages/
    ├── home.ts        # Landing page
    ├── explore.ts     # Artist discovery with client-side filtering
    ├── artist.ts      # Artist profile pages
    ├── marketplace.ts # Service marketplace + listing detail
    ├── auth.ts        # Login, signup, forgot password
    ├── dashboard.ts   # Dashboard, projects list, workspace
    ├── messaging.ts   # Messages, earnings, listings, orders
    ├── booking.ts     # Booking flow + order confirmation
    ├── admin.ts       # Admin panel
    └── misc.ts        # How it works, terms, privacy, contact, settings
```

---

## Phase 2 Roadmap (Planned)

- [ ] Supabase/D1 database integration (real persistence)
- [ ] Stripe payment processing (real escrow)
- [ ] Supabase Auth (real authentication)
- [ ] Supabase Storage (real file uploads)
- [ ] Email notifications (project updates, bookings)
- [ ] Live virtual studio rooms (WebRTC)
- [ ] AI artist matching
- [ ] Split sheet generator
- [ ] Publishing metadata export
- [ ] Label / A&R scout tools
- [ ] Collaboration analytics
- [ ] Mobile app

---

## Deployment

**Platform:** Cloudflare Pages  
**Status:** 🔧 Development (localhost:3000)  
**Production Deploy:** `npm run deploy`

```bash
# Development
npm run build
pm2 start ecosystem.config.cjs

# Production  
npm run build && wrangler pages deploy dist --project-name artist-collab
```

---

**Built for real artists. 🎵 artistcollab.studio**
