# Artist Collab — AC/1

## Project Overview
- **Name**: Artist Collab
- **Goal**: A trusted, transparent platform for fair collaboration among artists — connecting vocalists, producers, songwriters, and feature artists with iron-clad legal and payment protection.
- **Design System**: AC/1 — "The Session" (obsidian dark, DAW-inspired, signal green accent)
- **Architecture**: ArtistCollab owns the collaboration workflow, not the DAW. The DAW records. AC controls who approves the take, who owns the file, and when the money moves.

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

### Phase 1 — Live Session Room (/session/:id)
- ✅ **WebRTC Session Room** — Full live session UI with video grid, waveform visualiser, transport controls
- ✅ **Role-Based Access** — Host / Artist / Engineer / Audience roles with per-role audio routing
- ✅ **Who Is In the Room** — Participant roster with live speaking indicators, level meters, mute/cam status
- ✅ **Audience Mode** — Host-controlled toggle; audience sees the session stream without file/chat access
- ✅ **Engineer Talkback** — Hold-to-talk button; engineer speaks to artists without bleeding into the main mix
- ✅ **Takes & Approvals** — Record takes, approve/reject per-collaborator; one rejection blocks release
- ✅ **Stem Vault** — Per-session stem upload/download with approval status
- ✅ **Split Sheet Widget** — Inline ownership split display with per-collaborator approval status
- ✅ **Escrow Widget** — Live escrow amount, split bar, release conditions
- ✅ **Session Chat** — Real-time chat inside the room, enter-to-send
- ✅ **Bounce & Export** — One-click export modal: WAV/Stems/MIDI to project Stem Vault
- ✅ **Transport** — Play/pause/loop, BPM + key display, record button with timer
- ✅ **Session Timer** — Live session duration counter

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

### Escrow Payment Protection
- ✅ Payment status: **held / released / refunded** tracked per project
- ✅ Workspace escrow widget shows held amount, fee, payout
- ✅ "Approve Delivery" releases escrow; "Request Revision" blocks release
- ✅ Transparency dashboard shows total in-escrow and total paid out

### NDA & Platform Agreement
- ✅ **NDA page** (`/nda`) — Full AMNDAA v2.1 legal text, E-SIGN Act checkbox, electronic signature
- ✅ **Platform Agreement** — Co-signed with NDA in single flow
- ✅ **PRO Affiliation block** — Update PRO + IPI from same page

### Transparency Dashboard
- ✅ **Summary tiles** — In Escrow, Total Paid Out, Split Projects, Release Gate Open
- ✅ **Per-project accordion** — Click to expand: Master Ownership %, Publishing %, Collaborator Approvals, Release Approvals, Payment & Legal
- ✅ **Split Sheet Summary table** — My % on each sheet, status, release gate
- ✅ **Legal & IP Protection Status** — Platform NDA, Platform Agreement, PRO Affiliation cards

### Phase 2 — DAW Companion (/daw-companion)
- ✅ **Desktop App Landing** — Platform overview, waitlist CTA, feature matrix
- ✅ **Audio Routing Diagram** — DAW → Bridge → ArtistCollab signal flow diagram
- ✅ **What AC Controls** — The 7 pillars: room access, audio routing, official files, take approvals, ownership, payment release, audience
- ✅ **Session Playback Sync UI** — Live sync status panel mockup (DAW, BPM, transport, participants)
- ✅ **One-Click Bounce** — Bounce panel mockup: export formats, destination, collaborator notification
- ✅ **Engineer Talkback** — Feature explanation with hold-to-talk, cue channel, hardware binding
- ✅ **Release Roadmap** — Phase 1 (done) → Phase 2 (in dev) → Phase 3 (roadmap) timeline

### Phase 3 — DAW Bridge Architecture (/daw-bridge)
- ✅ **Architecture Stack Diagram** — DAW Layer / Bridge Layer / ArtistCollab Layer with full component breakdown
- ✅ **User Journey Flow** — 8-step collaboration journey from start to escrow release
- ✅ **Pro Tools** — AAX strategy, scripting automation, bounce hook, session metadata extraction
- ✅ **Ableton Live** — Link SDK integration, tempo/session sync, VST3, Max for Live device
- ✅ **Logic Pro** — AU plug-in, Core Audio virtual device, stem push, control surface mapping
- ✅ **FL Studio** — VST3/AU, FL pattern export hook, producer-first async approval flow
- ✅ **Plug-in Format Strategy** — AAX (Pro Tools), AU (Logic/GarageBand), VST3 (Ableton/FL/Reaper)
- ✅ **Plug-in Licensing Framework** — Free/Pro/Studio/Enterprise tiers
- ✅ **6 Platform Priorities** — Design principles from live session → DAW integrations

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
| `/session/:id` | **Live Session Room (Phase 1)** |
| `/session` | Live Session Room (demo) |
| `/daw-companion` | **DAW Companion — Phase 2 Landing** |
| `/companion` | → redirect to /daw-companion |
| `/daw-bridge` | **DAW Bridge Architecture — Phase 3** |
| `/integrations` | → redirect to /daw-bridge |
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

## Roadmap Item #21 — DAW Bridge + Immersive Session Architecture

ArtistCollab is built as a collaboration layer that connects to major DAW workflows instead of trying to fully recreate or replace each DAW inside the platform.

**The most important product decision:** ArtistCollab owns the collaboration workflow, not the DAW. The platform controls:
- Who is in the room
- Who can hear what
- What files are official
- Who approved the take
- Who owns what
- When payment releases
- Whether the audience can watch

**Integration paths:**
- Pro Tools — AAX-compatible strategy + scripting automation
- Logic — Audio Units (AU)
- Ableton — Link SDK for tempo/session sync
- FL Studio — VST3 / AU workflow support

**Phase priorities:**
1. Real-time low-latency session rooms ✅
2. Clean audio routing by role ✅
3. Stem and session file exchange ✅
4. Synchronized review/playback ✅
5. DAW companion tools (Phase 2 — in development)
6. Deeper DAW-specific integrations (Phase 3 — roadmap)

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
- **Build**: `npm run build` → `dist/_worker.js` (533 KB, 44 modules)
- **Last Build**: 2026-03-18
- **GitHub**: https://github.com/ShirleyTrading/artistcollab

---

## Outstanding / Future Work
- [ ] Real WebRTC via Cloudflare Calls API (Phase 1 production)
- [ ] File upload to Cloudflare R2 (stems, bounces)
- [ ] D1 database integration (replace in-memory data)
- [ ] Stripe escrow integration
- [ ] Email notifications (SendGrid / Resend)
- [ ] User authentication (JWT or Cloudflare Access)
- [ ] Split sheet PDF generation (server-side)
- [ ] ISRC/UPC code registration integration
- [ ] Mobile PWA / push notifications
- [ ] DAW Companion desktop app (Phase 2 — Electron/Tauri)
- [ ] Virtual audio device (Core Audio / ASIO) for local routing
- [ ] Ableton Link SDK integration
- [ ] AAX plug-in certification (Avid dev program)
- [ ] VST3 plug-in build (Steinberg SDK)
- [ ] AU plug-in build (Apple AUv3)
