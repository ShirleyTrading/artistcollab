# Artist Collab — AC/1

## Project Overview
- **Name**: Artist Collab
- **Goal**: A trusted, transparent platform for fair collaboration among artists — connecting vocalists, producers, songwriters, and feature artists with iron-clad legal and payment protection.
- **Design System**: AC/1 — "The Session" (obsidian dark, DAW-inspired, signal green accent)

## Live URL (Sandbox)
- **Dev Server**: https://3000-i2srrgbgb2n1nsa45e1mz-3844e1b6.sandbox.novita.ai

---

## Completed Features

### Core Platform
- ✅ **Home Page** — Hero, value props, social proof, CTA
- ✅ **Explore / Artist Discovery** — Search, genre filters, artist cards with stats
- ✅ **Marketplace** — Browse all services, filter by category / collab type
- ✅ **Booking Flow** — Per-listing package selection, collab-type picker (Pay-for-Hire vs Ownership Split), escrow initiation
- ✅ **Order Confirmation** — Post-booking confirmation with next steps

### Artist Profiles (Enhanced)
- ✅ **Streaming Links** — Spotify, Apple Music, SoundCloud, YouTube, TikTok, Instagram, Twitter
- ✅ **PRO Affiliation** — ASCAP / BMI / SESAC / GMR / SOCAN / PRS / GEMA / SACEM / APRA with IPI/CAE number display
- ✅ **Management Contact** — Name, email, company (conditionally shown)
- ✅ **Collaboration Preferences** — Feature rate, split minimum %, preferred collab types, genre preferences, custom notes
- ✅ **About / Listings / Reviews / Music tabs**
- ✅ **Booking sidebar** with availability, rates, CTA

### Dashboard (Authenticated)
- ✅ **Overview** — Stats tiles, recent projects, quick actions
- ✅ **Projects** — Project list with status, escrow, collab type
- ✅ **Messages** — Conversation list + chat view
- ✅ **Orders** — Order history, status tracking
- ✅ **Earnings** — Payout history, pending escrow
- ✅ **My Listings** — Manage service listings
- ✅ **Settings** — Profile, PRO info, notifications

### Digital Split Sheet System
- ✅ **Split Sheet Page** (`/split-sheet/:id`) — Song title, master ownership %, publishing ownership %, visual bar charts
- ✅ **Collaborators & Approvals** — Per-collaborator approval status (Approved / Pending / Rejected) with PRO affiliation + IPI number
- ✅ **Release Gate** — LOCKED (blocked) or OPEN (all approved) — cannot export/release until all parties sign off
- ✅ **Split Sheet List** (`/split-sheets`, `/dashboard/split-sheets`) — All sheets for the user, mini-bar previews
- ✅ **Print / Export** — Button triggers `window.print()`

### Collaboration Approval Before Release
- ✅ Workspace shows **Release Gate** banner — locked until all `releaseApprovals` are `true`
- ✅ **Approve Release** button in workspace header
- ✅ Split sheet `releasable` flag gates the "Proceed to Release" CTA

### Project Collaboration Workspace
- ✅ **Stem Vault** tab — Upload / view / download stems, BPM + key display, per-stem approval, track type badges (vox, beat, instrument, mix, master)
- ✅ **Lyrics / Co-write** tab — Collaborative lyrics editor, version history, PDF export
- ✅ **Chat** tab — Real-time-style project messaging, Enter-to-send
- ✅ **Files** tab — Project file management with upload
- ✅ **Activity** tab — Full timestamped project timeline
- ✅ **Right sidebar** — Escrow status, split sheet widget, agreement widget, project details

### Two Collaboration Options
- ✅ **Pay-for-Hire** — Flat fee, buyer retains full ownership, no split sheet required
- ✅ **Ownership / Royalty Split** — Triggers split sheet creation, publishing + master percentages negotiated upfront
- ✅ Collab type shown on: booking page, workspace, project list, transparency dashboard

### Escrow Payment Protection
- ✅ Payment status: **held / released / refunded** tracked per project
- ✅ Workspace escrow widget shows held amount, fee, payout
- ✅ "Approve Delivery" releases escrow; "Request Revision" blocks release
- ✅ Transparency dashboard shows total in-escrow and total paid out

### NDA & Platform Agreement
- ✅ **NDA page** (`/nda`) — Full AMNDAA v2.1 legal text, E-SIGN Act checkbox, electronic signature
- ✅ **Platform Agreement** — Co-signed with NDA in single flow
- ✅ **PRO Affiliation block** — Update PRO + IPI from same page
- ✅ Signed status shown in workspace Agreement widget and Transparency dashboard

### Transparency Dashboard
- ✅ **Summary tiles** — In Escrow, Total Paid Out, Split Projects, Release Gate Open
- ✅ **Per-project accordion** — Click to expand: Master Ownership %, Publishing %, Collaborator Approvals, Release Approvals, Payment & Legal
- ✅ **Split Sheet Summary table** — My % on each sheet, status, release gate
- ✅ **Legal & IP Protection Status** — Platform NDA, Platform Agreement, PRO Affiliation cards

### Legal & Admin
- ✅ **Agreement Page** (`/agreement/:projectId`) — Signatories, NDA status, terms, linked split sheet
- ✅ **Terms of Service**, **Privacy Policy**, **Contact**
- ✅ **How It Works** — 4-step explainer
- ✅ **Admin Panel**

---

## Page / Route Map

| Route | Page |
|---|---|
| `/` | Home |
| `/explore` | Artist Discovery |
| `/marketplace` | Service Marketplace |
| `/artist/:id` | Artist Profile |
| `/listing/:id` | Listing Detail |
| `/booking/:artistId` | Booking |
| `/order-confirmation` | Post-booking |
| `/dashboard` | Overview Dashboard |
| `/dashboard/projects` | Projects |
| `/dashboard/messages` | Messages |
| `/dashboard/orders` | Orders |
| `/dashboard/earnings` | Earnings |
| `/dashboard/listings` | My Listings |
| `/dashboard/settings` | Settings |
| `/workspace/:projectId` | Collaboration Workspace |
| `/split-sheet/:id` | Split Sheet |
| `/split-sheets` | My Split Sheets |
| `/nda` | NDA & Platform Agreement |
| `/agreement/:projectId` | Collaboration Agreement |
| `/transparency` | Transparency Dashboard |
| `/how-it-works` | How It Works |
| `/terms` | Terms of Service |
| `/privacy` | Privacy Policy |
| `/contact` | Contact |
| `/admin` | Admin Panel |

---

## Data Architecture

### Storage
- **Runtime data**: In-memory TypeScript arrays (demo/prototype)
- **For production**: Replace with Cloudflare D1 (SQLite) for all models

### Core Models
| Model | Key Fields |
|---|---|
| `User` | artistName, proAffiliation, proIpiNumber, managementContact, collabPreferences, ndaStatus |
| `Listing` | collabTypes (pay_for_hire / ownership_split), packages, fileFormats |
| `Project` | collabType, paymentStatus (held/released/refunded), releaseApprovals, stems, lyrics |
| `SplitSheet` | masterOwnership[], publishingOwnership[], collaborators[], releasable |
| `CollaborationAgreement` | signatories[], ndaRequired, ndaSignedByAll, status |
| `NdaRecord` | userId, projectId, signedAt, version |
| `Review` | professionalism, deliveryTime, quality, communication |

---

## Tech Stack
- **Runtime**: Hono on Cloudflare Workers
- **Build**: Vite + `@hono/vite-cloudflare-pages`
- **Frontend**: Server-side rendered HTML + Tailwind-like utility CSS (AC/1 design system)
- **Fonts**: Syne (display), Inter (body), JetBrains Mono (data)
- **Icons**: FontAwesome 6

---

## Deployment
- **Platform**: Cloudflare Pages
- **Status**: ✅ Dev server active
- **Build**: `npm run build` → `dist/_worker.js` (430 KB)
- **Last Build**: 2026-03-13

---

## Outstanding / Future Work
- [ ] Real-time messaging via Cloudflare Durable Objects
- [ ] File upload to Cloudflare R2
- [ ] D1 database integration (replace in-memory data)
- [ ] Stripe escrow integration
- [ ] Email notifications (SendGrid / Resend)
- [ ] User authentication (JWT or Cloudflare Access)
- [ ] Split sheet PDF generation (server-side)
- [ ] ISRC/UPC code registration integration
- [ ] Mobile PWA / push notifications
