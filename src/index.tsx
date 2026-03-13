import { Hono } from 'hono'
import { users, listings, projects, getUserById, getListingById, getProjectById } from './data'
import { homePage } from './pages/home'
import { explorePage } from './pages/explore'
import { artistProfilePage } from './pages/artist'
import { marketplacePage, listingDetailPage } from './pages/marketplace'
import { loginPage, signupPage, forgotPasswordPage } from './pages/auth'
import { dashboardPage, projectsPage, workspacePage } from './pages/dashboard'
import { messagesPage, earningsPage, listingsPage, ordersPage } from './pages/messaging'
import { bookingPage, orderConfirmationPage } from './pages/booking'
import { adminPage } from './pages/admin'
import { howItWorksPage, termsPage, privacyPage, contactPage, settingsPage } from './pages/misc'

const app = new Hono()

// ─── Public Pages ─────────────────────────────────────────────────────────────
app.get('/', (c) => c.html(homePage()))
app.get('/explore', (c) => c.html(explorePage()))
app.get('/marketplace', (c) => c.html(marketplacePage()))
app.get('/how-it-works', (c) => c.html(howItWorksPage()))
app.get('/terms', (c) => c.html(termsPage()))
app.get('/privacy', (c) => c.html(privacyPage()))
app.get('/contact', (c) => c.html(contactPage()))

// ─── Auth ─────────────────────────────────────────────────────────────────────
app.get('/login', (c) => c.html(loginPage()))
app.get('/signup', (c) => c.html(signupPage()))
app.get('/forgot-password', (c) => c.html(forgotPasswordPage()))
app.get('/logout', (c) => c.redirect('/login'))

// ─── Artist Profiles ─────────────────────────────────────────────────────────
app.get('/artist/:id', (c) => {
  const user = getUserById(c.req.param('id'))
  if (!user) return c.html('<h1 style="font-family:sans-serif;color:white;background:#0a0a0f;min-height:100vh;display:flex;align-items:center;justify-content:center;">Artist not found</h1>', 404)
  return c.html(artistProfilePage(user))
})

// ─── Listings ─────────────────────────────────────────────────────────────────
app.get('/listing/:id', (c) => {
  const listing = getListingById(c.req.param('id'))
  if (!listing) return c.html('Listing not found', 404)
  return c.html(listingDetailPage(listing))
})

// ─── Booking ─────────────────────────────────────────────────────────────────
app.get('/booking/:artistId', (c) => {
  const listingId = c.req.query('listing')
  return c.html(bookingPage(c.req.param('artistId'), listingId))
})
app.get('/booking', (c) => {
  const listingId = c.req.query('listing')
  const listing = listingId ? getListingById(listingId) : listings[0]
  if (!listing) return c.redirect('/marketplace')
  return c.html(bookingPage(listing.userId, listingId))
})
app.get('/order-confirmation', (c) => c.html(orderConfirmationPage()))

// ─── Dashboard / Authenticated ───────────────────────────────────────────────
app.get('/dashboard', (c) => c.html(dashboardPage()))
app.get('/dashboard/projects', (c) => c.html(projectsPage()))
app.get('/dashboard/messages', (c) => c.html(messagesPage()))
app.get('/dashboard/orders', (c) => c.html(ordersPage()))
app.get('/dashboard/earnings', (c) => c.html(earningsPage()))
app.get('/dashboard/listings', (c) => c.html(listingsPage()))
app.get('/dashboard/settings', (c) => c.html(settingsPage()))

// Profile shortcuts
app.get('/profile/me', (c) => c.html(artistProfilePage(users[0])))

// Workspace
app.get('/workspace/:id', (c) => {
  const project = getProjectById(c.req.param('id'))
  if (!project) return c.redirect('/dashboard/projects')
  return c.html(workspacePage(project))
})

// ─── Admin ───────────────────────────────────────────────────────────────────
app.get('/admin', (c) => c.html(adminPage()))
app.get('/admin/*', (c) => c.html(adminPage()))

// ─── Catch-all redirect ──────────────────────────────────────────────────────
app.get('/settings', (c) => c.html(settingsPage()))
app.get('/messages', (c) => c.redirect('/dashboard/messages'))
app.get('/projects', (c) => c.redirect('/dashboard/projects'))

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.notFound((c) => c.html(`
<!DOCTYPE html>
<html>
<head>
  <title>404 — Artist Collab</title>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
  <style>
    body{background:#0a0a0f;color:white;font-family:sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;}
    h1{font-family:'Space Grotesk',sans-serif;font-size:5rem;color:#7c3aed;margin-bottom:16px;}
    p{color:#9999b0;margin-bottom:32px;}
    a{display:inline-flex;align-items:center;gap:8px;padding:12px 24px;background:linear-gradient(135deg,#7c3aed,#9d5bf5);color:white;border-radius:12px;text-decoration:none;font-weight:600;}
  </style>
</head>
<body>
  <div>
    <h1>404</h1>
    <p style="font-size:1.2rem;">This page doesn't exist — yet.</p>
    <p>Looks like you wandered off the setlist.</p>
    <a href="/">🎵 Back to Artist Collab</a>
  </div>
</body>
</html>
`, 404))

export default app
