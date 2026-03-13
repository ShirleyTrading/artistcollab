import { shell, closeShell, publicNav, siteFooter, appSidebar, authedNav } from '../layout';

// ─── How It Works ─────────────────────────────────────────────────────────────
export function howItWorksPage(): string {
  const steps = [
    {
      num: '01', 
      title: 'Discover the Right Collaborator',
      sub: 'Browse. Filter. Connect.',
      desc: 'Search our curated marketplace of independent artists, rappers, singers, songwriters, and producers. Filter by genre, location, price range, verified status, and more. Every profile shows real work history, ratings, and sample tracks.',
      features: ['Advanced genre & mood filters', 'Verified identity badges', 'Rating & review system', 'Audio portfolio samples', 'Response time indicators'],
      accent: 'var(--uv-bright)',
      accentBg: 'rgba(139,92,246,0.1)',
      icon: 'fa-search',
    },
    {
      num: '02',
      title: 'Book a Feature Package',
      sub: 'Clear pricing. No DM negotiations.',
      desc: 'Select from transparently-priced packages. See exactly what\'s included: delivery timeline, revision count, file formats, and add-ons. No back-and-forth. Submit your brief, upload a reference, and book in under 5 minutes.',
      features: ['Productized service packages', 'Transparent delivery timelines', 'Secure Stripe checkout', 'Brief & reference uploads', 'Add-on customizations'],
      accent: 'var(--ember)',
      accentBg: 'rgba(245,158,11,0.1)',
      icon: 'fa-box',
    },
    {
      num: '03',
      title: 'Work in Your Private Workspace',
      sub: 'Your studio. Your project. Your space.',
      desc: 'The moment you book, a dedicated collaboration workspace is created. This is your secure home base for the full project — direct messaging, stem uploads, version history, status tracking, and delivery. No email chains. No lost files.',
      features: ['Private encrypted messaging', 'Stem locker with version history', 'Real-time project tracking', 'File delivery system', 'Activity log & notifications'],
      accent: 'var(--arc)',
      accentBg: 'rgba(34,211,238,0.1)',
      icon: 'fa-folder-open',
    },
    {
      num: '04',
      title: 'Pay Securely, Receive Confidently',
      sub: 'Escrow-protected. Dispute-covered.',
      desc: 'Your payment is held in platform escrow from the moment you book. It only releases to the artist when you approve the delivery. Request revisions if needed. If there\'s a dispute, our team steps in. Artists receive fast payouts once accepted.',
      features: ['Stripe-powered escrow', 'Revision requests protected', 'Dispute resolution team', '10% transparent platform fee', 'Fast artist payouts'],
      accent: 'var(--ok)',
      accentBg: 'rgba(16,185,129,0.1)',
      icon: 'fa-shield-halved',
    },
  ];

  return shell('How It Works', `
    .hiw-page {}
    .hiw-hero { padding: 100px 24px 80px; text-align: center; position: relative; overflow: hidden; }
    .hiw-step {
      display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;
      max-width: 1100px; margin: 0 auto; padding: 80px 24px;
      border-bottom: 1px solid var(--hairline);
    }
    .hiw-step:last-child { border-bottom: none; }
    .hiw-step.flip { direction: rtl; }
    .hiw-step.flip > * { direction: ltr; }
    .step-visual {
      background: var(--surface); border: 1px solid var(--hairline); border-radius: var(--r-xl);
      aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center;
      position: relative; overflow: hidden;
    }
    @media (max-width: 900px) {
      .hiw-step { grid-template-columns: 1fr; gap: 40px; padding: 60px 24px; }
      .hiw-step.flip { direction: ltr; }
      .hiw-hero { padding: 72px 24px 56px; }
    }
  `) + publicNav('how') + `

  <!-- Hero -->
  <section class="hiw-hero">
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% -20%,rgba(139,92,246,0.18) 0%,transparent 60%);pointer-events:none;"></div>
    <div style="position:relative;z-index:1;">
      <span class="badge badge-uv" style="margin-bottom:20px;font-size:0.78rem;">The Process</span>
      <h1 class="display-2" style="max-width:700px;margin:0 auto 20px;">Music Collaboration,<br><span class="text-gradient">Finally Structured</span></h1>
      <p class="body-lg" style="max-width:540px;margin:0 auto 36px;">
        Artist Collab handles everything from discovery to payout — so you can focus on making the music.
      </p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
        <a href="/signup" class="btn btn-primary btn-lg">Start Collaborating <i class="fas fa-arrow-right"></i></a>
        <a href="/explore" class="btn btn-outline btn-lg">Browse Artists</a>
      </div>
    </div>
  </section>

  <!-- Step Sections -->
  ${steps.map((s, i) => `
  <section class="hiw-step ${i % 2 !== 0 ? 'flip' : ''}">
    <!-- Visual Side -->
    <div class="step-visual">
      <!-- Atmospheric glow -->
      <div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,${s.accentBg} 0%,transparent 70%);"></div>
      <!-- Step number watermark -->
      <div style="position:absolute;top:20px;left:24px;font-size:4rem;font-weight:800;letter-spacing:-0.05em;color:rgba(255,255,255,0.04);line-height:1;font-family:'DM Sans',sans-serif;">${s.num}</div>
      <!-- Center icon -->
      <div style="position:relative;z-index:1;text-align:center;">
        <div style="width:80px;height:80px;background:${s.accentBg};border:1px solid ${s.accent}33;border-radius:var(--r-xl);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;box-shadow:0 0 40px ${s.accentBg};">
          <i class="fas ${s.icon}" style="font-size:1.75rem;color:${s.accent};"></i>
        </div>
        <!-- Mini UI mockup -->
        <div style="background:rgba(255,255,255,0.04);border:1px solid var(--hairline);border-radius:var(--r-lg);padding:12px 16px;max-width:260px;text-align:left;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <div style="width:24px;height:24px;border-radius:50%;background:${s.accent};opacity:0.8;"></div>
            <div style="height:8px;width:80px;background:rgba(255,255,255,0.12);border-radius:4px;"></div>
            <div class="badge" style="background:${s.accentBg};color:${s.accent};border-color:${s.accent}33;font-size:0.65rem;margin-left:auto;">Active</div>
          </div>
          ${['',''].map(() => `<div style="height:6px;width:100%;background:rgba(255,255,255,0.06);border-radius:3px;margin-bottom:6px;"></div>`).join('')}
          <div style="height:6px;width:70%;background:rgba(255,255,255,0.06);border-radius:3px;"></div>
          <div style="height:24px;background:${s.accent};border-radius:6px;margin-top:10px;opacity:0.8;"></div>
        </div>
      </div>
    </div>

    <!-- Content Side -->
    <div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;">
        <span style="font-size:0.78rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${s.accent};">Step ${s.num}</span>
        <span style="width:40px;height:1px;background:${s.accent};opacity:0.4;"></span>
      </div>
      <h2 class="display-3" style="margin-bottom:10px;">${s.title}</h2>
      <p style="font-size:1rem;font-weight:600;color:${s.accent};margin-bottom:16px;letter-spacing:-0.01em;">${s.sub}</p>
      <p class="body-lg" style="margin-bottom:28px;">${s.desc}</p>
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${s.features.map(f => `
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:20px;height:20px;border-radius:50%;background:${s.accentBg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="fas fa-check" style="font-size:9px;color:${s.accent};"></i>
          </div>
          <span style="font-size:0.9375rem;color:var(--t2);">${f}</span>
        </div>`).join('')}
      </div>
    </div>
  </section>`).join('')}

  <!-- Phase 2 Teaser -->
  <section style="padding:80px 24px;background:var(--ink);border-top:1px solid var(--hairline);">
    <div style="max-width:900px;margin:0 auto;text-align:center;">
      <span class="badge badge-muted" style="margin-bottom:20px;">Coming Soon</span>
      <h2 class="display-3" style="margin-bottom:16px;">What's Next for Artist Collab</h2>
      <p class="body-lg" style="max-width:560px;margin:0 auto 40px;">
        We're building the future of creative collaboration. Here's what's on the roadmap.
      </p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;text-align:left;">
        ${[
          { icon: 'fa-video', label: 'Virtual Studio Rooms', sub: 'Live video collab sessions', color: 'var(--uv-bright)' },
          { icon: 'fa-microchip', label: 'AI Artist Matching', sub: 'Smart collab recommendations', color: 'var(--arc)' },
          { icon: 'fa-file-signature', label: 'Split-Sheet Generator', sub: 'Automatic rights management', color: 'var(--ember)' },
          { icon: 'fa-chart-line', label: 'Artist Analytics', sub: 'Track your career growth', color: 'var(--ok)' },
          { icon: 'fa-campground', label: 'Songwriting Camps', sub: 'Group creative sessions', color: 'var(--uv-bright)' },
          { icon: 'fa-tag', label: 'Label & A&R Tools', sub: 'Sign and discover talent', color: 'var(--ember)' },
        ].map(f => `
        <div style="background:var(--surface);border:1px solid var(--hairline);border-radius:var(--r-lg);padding:18px 20px;display:flex;align-items:flex-start;gap:12px;">
          <div style="width:36px;height:36px;background:rgba(255,255,255,0.05);border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="fas ${f.icon}" style="color:${f.color};font-size:0.875rem;"></i>
          </div>
          <div>
            <div style="font-weight:700;font-size:0.875rem;">${f.label}</div>
            <div style="font-size:0.75rem;color:var(--t4);margin-top:3px;">${f.sub}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- Final CTA -->
  <section style="padding:100px 24px;background:radial-gradient(ellipse at 50% 100%,rgba(139,92,246,0.15) 0%,transparent 60%);">
    <div style="max-width:640px;margin:0 auto;text-align:center;">
      <h2 class="display-2" style="margin-bottom:16px;">Ready to Build Something Real?</h2>
      <p class="body-lg" style="margin-bottom:36px;">Join thousands of artists already using Artist Collab to create, book, and deliver professional-grade music.</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <a href="/signup" class="btn btn-primary btn-xl">Create Your Profile <i class="fas fa-arrow-right"></i></a>
        <a href="/explore" class="btn btn-outline btn-xl">Browse Artists</a>
      </div>
      <p style="font-size:0.8125rem;color:var(--t4);margin-top:20px;">Free to join · No subscription required · First collab on us</p>
    </div>
  </section>

` + siteFooter() + closeShell();
}

// ─── Settings Page ────────────────────────────────────────────────────────────
export function settingsPage(): string {
  return shell('Settings', `
    .dash-page { padding: 32px 40px; max-width: 800px; }
    .settings-section { background: var(--surface); border: 1px solid var(--hairline); border-radius: var(--r-xl); padding: 28px; margin-bottom: 20px; }
    .settings-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.04); gap: 16px; }
    .settings-row:last-child { border-bottom: none; }
    .toggle { width: 44px; height: 24px; background: var(--rim); border-radius: 12px; position: relative; cursor: pointer; transition: background 0.2s; border: none; flex-shrink: 0; }
    .toggle.on { background: var(--uv); }
    .toggle::after { content: ''; position: absolute; width: 18px; height: 18px; background: white; border-radius: 50%; top: 3px; left: 3px; transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.4); }
    .toggle.on::after { left: 23px; }
    @media (max-width: 900px) { .dash-page { padding: 24px 16px; } }
  `) + authedNav('settings') + `
<div class="app-shell">
  ${appSidebar('settings')}
  <main class="app-main">
    <div class="dash-page">
      <div style="margin-bottom:28px;">
        <div class="label" style="margin-bottom:6px;color:var(--t3);">Preferences</div>
        <h1 style="font-size:clamp(1.4rem,2.5vw,1.875rem);letter-spacing:-0.025em;">Settings</h1>
      </div>

      <!-- Profile -->
      <div class="settings-section">
        <h2 style="font-size:1rem;letter-spacing:-0.01em;margin-bottom:20px;">Profile Information</h2>
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;">
          <div style="position:relative;">
            <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=face" class="av av-xl" style="border:3px solid rgba(139,92,246,0.3);" alt="Profile">
            <button style="position:absolute;bottom:0;right:0;width:28px;height:28px;background:var(--uv);border:2px solid var(--surface);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;" onclick="alert('Photo upload coming soon')">
              <i class="fas fa-camera" style="color:white;font-size:10px;"></i>
            </button>
          </div>
          <div>
            <div style="font-weight:700;font-size:1rem;">XAVI</div>
            <div style="font-size:0.8125rem;color:var(--t3);margin-bottom:8px;">@xavi_official</div>
            <button class="btn btn-secondary btn-xs" onclick="alert('Upload photo')">Change Photo</button>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
          <div class="field">
            <label class="field-label">Artist Name</label>
            <input class="field-input" type="text" value="XAVI">
          </div>
          <div class="field">
            <label class="field-label">Username</label>
            <input class="field-input" type="text" value="xavi_official">
          </div>
          <div class="field" style="grid-column:span 2;">
            <label class="field-label">Bio</label>
            <textarea class="field-input" rows="3">Rapper & songwriter from Atlanta. Creating authentic music for the culture.</textarea>
          </div>
          <div class="field">
            <label class="field-label">Genre</label>
            <input class="field-input" type="text" value="Hip-Hop, Trap, R&B">
          </div>
          <div class="field">
            <label class="field-label">Location</label>
            <input class="field-input" type="text" value="Atlanta, GA">
          </div>
        </div>
        <div style="margin-top:16px;">
          <button class="btn btn-primary btn-sm" onclick="alert('Profile saved!')">Save Changes</button>
        </div>
      </div>

      <!-- Notifications -->
      <div class="settings-section">
        <h2 style="font-size:1rem;letter-spacing:-0.01em;margin-bottom:20px;">Notifications</h2>
        ${[
          { label: 'New messages', sub: 'When someone sends you a message', on: true },
          { label: 'Order updates', sub: 'Delivery, revisions, and status changes', on: true },
          { label: 'New bookings', sub: 'When someone books your service', on: true },
          { label: 'Payment released', sub: 'When escrow payment is released', on: true },
          { label: 'Review received', sub: 'When a collaborator leaves a review', on: false },
          { label: 'Platform announcements', sub: 'Product updates and news', on: false },
        ].map(n => `
        <div class="settings-row">
          <div>
            <div style="font-weight:600;font-size:0.9rem;">${n.label}</div>
            <div style="font-size:0.78rem;color:var(--t3);margin-top:2px;">${n.sub}</div>
          </div>
          <button class="toggle ${n.on ? 'on' : ''}" onclick="this.classList.toggle('on')"></button>
        </div>`).join('')}
      </div>

      <!-- Security -->
      <div class="settings-section">
        <h2 style="font-size:1rem;letter-spacing:-0.01em;margin-bottom:20px;">Security</h2>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div class="field">
            <label class="field-label">Current Password</label>
            <input class="field-input" type="password" placeholder="••••••••••">
          </div>
          <div class="field">
            <label class="field-label">New Password</label>
            <input class="field-input" type="password" placeholder="Min. 8 characters">
          </div>
          <div class="field">
            <label class="field-label">Confirm New Password</label>
            <input class="field-input" type="password" placeholder="Repeat password">
          </div>
          <button class="btn btn-primary btn-sm" style="width:fit-content;" onclick="alert('Password updated!')">Update Password</button>
        </div>
        <hr class="divider" style="margin:20px 0;">
        <div class="settings-row">
          <div>
            <div style="font-weight:600;font-size:0.9rem;">Two-Factor Authentication</div>
            <div style="font-size:0.78rem;color:var(--t3);">Add an extra layer of security to your account</div>
          </div>
          <button class="btn btn-secondary btn-xs" onclick="alert('2FA setup coming soon')">Enable 2FA</button>
        </div>
      </div>

      <!-- Payout / Banking -->
      <div class="settings-section">
        <h2 style="font-size:1rem;letter-spacing:-0.01em;margin-bottom:20px;">Payout Method</h2>
        <div style="background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.2);border-radius:var(--r-lg);padding:16px 18px;margin-bottom:16px;display:flex;align-items:center;gap:12px;">
          <i class="fas fa-university" style="color:var(--uv-bright);font-size:1.25rem;"></i>
          <div>
            <div style="font-weight:700;font-size:0.875rem;">No payout method connected</div>
            <div style="font-size:0.78rem;color:var(--t3);">Connect your bank account or debit card to receive payouts.</div>
          </div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="alert('Bank connection via Stripe coming soon')">
          <i class="fas fa-plus"></i> Connect Payout Method
        </button>
      </div>

      <!-- Danger Zone -->
      <div class="settings-section" style="border-color:rgba(244,63,94,0.2);">
        <h2 style="font-size:1rem;letter-spacing:-0.01em;margin-bottom:16px;color:var(--err);">Danger Zone</h2>
        <div class="settings-row">
          <div>
            <div style="font-weight:600;font-size:0.9rem;">Delete Account</div>
            <div style="font-size:0.78rem;color:var(--t3);">Permanently delete your account and all data. This cannot be undone.</div>
          </div>
          <button class="btn btn-ghost btn-sm" style="color:var(--err);border:1px solid rgba(244,63,94,0.25);" onclick="confirm('Are you sure? This is permanent.')">Delete Account</button>
        </div>
      </div>

    </div>
  </main>
</div>
` + closeShell();
}

// ─── Terms ────────────────────────────────────────────────────────────────────
export function termsPage(): string {
  return shell('Terms of Service', `
    .legal-page { padding: 80px 24px; max-width: 760px; margin: 0 auto; }
    .legal-section { margin-bottom: 36px; }
    .legal-section h2 { font-size: 1.125rem; letter-spacing: -0.01em; margin-bottom: 12px; color: var(--t1); }
    .legal-section p, .legal-section li { font-size: 0.9375rem; color: var(--t3); line-height: 1.8; margin-bottom: 10px; }
    .legal-section ul { padding-left: 20px; }
  `) + publicNav() + `
<div style="background:var(--ink);border-bottom:1px solid var(--hairline);padding:48px 24px 40px;text-align:center;">
  <span class="badge badge-muted" style="margin-bottom:16px;">Legal</span>
  <h1 style="font-size:clamp(1.75rem,4vw,2.5rem);letter-spacing:-0.03em;">Terms of Service</h1>
  <p style="color:var(--t3);margin-top:12px;font-size:0.9375rem;">Last updated: March 1, 2026</p>
</div>
<div class="legal-page">
  <div class="legal-section">
    <h2>1. Acceptance of Terms</h2>
    <p>By creating an account or using Artist Collab ("the Platform"), you agree to be bound by these Terms of Service and all applicable laws. If you do not agree with these terms, you may not use the Platform.</p>
  </div>
  <div class="legal-section">
    <h2>2. Platform Overview</h2>
    <p>Artist Collab is a remote music collaboration marketplace. The Platform facilitates connections between music creators (artists, producers, songwriters, engineers) and provides tools for booking, project management, file sharing, and payment processing.</p>
  </div>
  <div class="legal-section">
    <h2>3. User Accounts</h2>
    <p>You must be 18 years or older to create an account. You are responsible for maintaining the security of your account credentials. You may not impersonate others or create accounts for fraudulent purposes.</p>
  </div>
  <div class="legal-section">
    <h2>4. Payments & Escrow</h2>
    <p>All payments are processed through Stripe. When you place an order, funds are held in escrow by Artist Collab and released to the seller only upon delivery acceptance. Artist Collab charges a 10% platform fee on all transactions.</p>
    <ul>
      <li>Buyers may request revisions before releasing payment.</li>
      <li>Refunds are available within 24 hours of order placement if work has not begun.</li>
      <li>Disputes are reviewed by the Artist Collab Trust & Safety team.</li>
    </ul>
  </div>
  <div class="legal-section">
    <h2>5. Intellectual Property</h2>
    <p>All deliverables are subject to the licensing terms agreed upon by both parties at the time of booking. Unless otherwise specified, buyers receive a non-exclusive license to the delivered work. Full transfer of rights requires explicit written agreement.</p>
  </div>
  <div class="legal-section">
    <h2>6. Prohibited Conduct</h2>
    <ul>
      <li>Using the platform for fraudulent or illegal purposes</li>
      <li>Attempting to conduct transactions off-platform to avoid fees</li>
      <li>Uploading copyrighted material you don't have rights to</li>
      <li>Harassment, threats, or abusive behavior toward other users</li>
      <li>Creating fake reviews or manipulating ratings</li>
    </ul>
  </div>
  <div class="legal-section">
    <h2>7. Limitation of Liability</h2>
    <p>Artist Collab is not liable for the quality, legality, or ownership of any content delivered through the platform. Our liability is limited to the amount paid for the transaction in question, not exceeding the platform fee collected.</p>
  </div>
  <div class="legal-section">
    <h2>8. Contact</h2>
    <p>For questions about these terms, contact us at <a href="mailto:legal@artistcollab.studio" style="color:var(--uv-bright);">legal@artistcollab.studio</a></p>
  </div>
</div>
` + siteFooter() + closeShell();
}

// ─── Privacy ──────────────────────────────────────────────────────────────────
export function privacyPage(): string {
  return shell('Privacy Policy', `
    .legal-page { padding: 80px 24px; max-width: 760px; margin: 0 auto; }
    .legal-section { margin-bottom: 36px; }
    .legal-section h2 { font-size: 1.125rem; letter-spacing: -0.01em; margin-bottom: 12px; }
    .legal-section p, .legal-section li { font-size: 0.9375rem; color: var(--t3); line-height: 1.8; margin-bottom: 10px; }
    .legal-section ul { padding-left: 20px; }
  `) + publicNav() + `
<div style="background:var(--ink);border-bottom:1px solid var(--hairline);padding:48px 24px 40px;text-align:center;">
  <span class="badge badge-muted" style="margin-bottom:16px;">Legal</span>
  <h1 style="font-size:clamp(1.75rem,4vw,2.5rem);letter-spacing:-0.03em;">Privacy Policy</h1>
  <p style="color:var(--t3);margin-top:12px;font-size:0.9375rem;">Last updated: March 1, 2026</p>
</div>
<div class="legal-page">
  <div class="legal-section">
    <h2>Information We Collect</h2>
    <p>We collect information you provide when creating an account, including your name, email address, profile information, and payment details. We also collect usage data including how you interact with the Platform.</p>
  </div>
  <div class="legal-section">
    <h2>How We Use Your Information</h2>
    <ul>
      <li>To provide and improve the Platform</li>
      <li>To process payments and prevent fraud</li>
      <li>To send transactional emails and notifications</li>
      <li>To comply with legal obligations</li>
    </ul>
  </div>
  <div class="legal-section">
    <h2>Data Sharing</h2>
    <p>We do not sell your personal data. We share information with service providers (Stripe for payments, Supabase for data storage) only as necessary to provide the service. We may share data when required by law.</p>
  </div>
  <div class="legal-section">
    <h2>Cookies</h2>
    <p>We use cookies for authentication and analytics. You can disable cookies in your browser settings, though some features may not work correctly.</p>
  </div>
  <div class="legal-section">
    <h2>Your Rights</h2>
    <p>You have the right to access, correct, or delete your personal data. Contact us at <a href="mailto:privacy@artistcollab.studio" style="color:var(--uv-bright);">privacy@artistcollab.studio</a> to exercise these rights.</p>
  </div>
</div>
` + siteFooter() + closeShell();
}

// ─── Contact ──────────────────────────────────────────────────────────────────
export function contactPage(): string {
  return shell('Contact', `
    .contact-page { padding: 80px 24px; }
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; max-width: 1000px; margin: 0 auto; align-items: start; }
    @media (max-width: 800px) { .contact-grid { grid-template-columns: 1fr; gap: 40px; } }
  `) + publicNav() + `
<div style="background:var(--ink);border-bottom:1px solid var(--hairline);padding:60px 24px 52px;text-align:center;">
  <span class="badge badge-muted" style="margin-bottom:16px;">Support</span>
  <h1 style="font-size:clamp(1.75rem,4vw,2.5rem);letter-spacing:-0.03em;">Get in Touch</h1>
  <p style="color:var(--t3);margin-top:12px;font-size:0.9375rem;max-width:460px;margin:12px auto 0;">We're a small team that cares deeply about the music community. Reach out and we'll get back to you.</p>
</div>
<div class="contact-page">
  <div class="contact-grid">
    <div>
      <h2 style="font-size:1.5rem;letter-spacing:-0.02em;margin-bottom:24px;">Send us a message</h2>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div class="field"><label class="field-label">Name</label><input class="field-input" type="text" placeholder="Your name"></div>
        <div class="field"><label class="field-label">Email</label><input class="field-input" type="email" placeholder="you@email.com"></div>
        <div class="field">
          <label class="field-label">Subject</label>
          <select class="field-select">
            <option>General Inquiry</option>
            <option>Technical Issue</option>
            <option>Payment Problem</option>
            <option>Report a User</option>
            <option>Partnership</option>
            <option>Press</option>
          </select>
        </div>
        <div class="field"><label class="field-label">Message</label><textarea class="field-input" rows="5" placeholder="Describe your issue or question in detail…"></textarea></div>
        <button class="btn btn-primary btn-lg" style="width:fit-content;" onclick="alert('Message sent! We\'ll reply within 24 hours.')">
          Send Message <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
    <div>
      <h2 style="font-size:1.5rem;letter-spacing:-0.02em;margin-bottom:24px;">Other ways to reach us</h2>
      <div style="display:flex;flex-direction:column;gap:16px;">
        ${[
          { icon: 'fa-envelope', label: 'Email Support', val: 'support@artistcollab.studio', sub: 'Replies within 24hrs', color: 'var(--uv-bright)' },
          { icon: 'fa-brands fa-instagram', label: 'Instagram', val: '@artistcollab', sub: 'DMs open for quick questions', color: 'var(--ember)' },
          { icon: 'fa-brands fa-twitter', label: 'X (Twitter)', val: '@artistcollab', sub: 'For announcements & updates', color: 'var(--arc)' },
        ].map(c => `
        <div style="background:var(--surface);border:1px solid var(--hairline);border-radius:var(--r-lg);padding:18px 20px;display:flex;align-items:center;gap:14px;transition:border-color 0.18s;" onmouseover="this.style.borderColor='rgba(255,255,255,0.14)'" onmouseout="this.style.borderColor='var(--hairline)'">
          <div style="width:40px;height:40px;background:rgba(255,255,255,0.05);border-radius:var(--r);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="fas ${c.icon}" style="color:${c.color};"></i>
          </div>
          <div>
            <div style="font-weight:700;font-size:0.875rem;">${c.label}</div>
            <div style="font-size:0.875rem;color:${c.color};margin-top:2px;">${c.val}</div>
            <div style="font-size:0.75rem;color:var(--t4);margin-top:2px;">${c.sub}</div>
          </div>
        </div>`).join('')}
      </div>
      <div style="margin-top:28px;background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.18);border-radius:var(--r-lg);padding:20px;">
        <div style="font-weight:700;margin-bottom:6px;">Based in Atlanta, GA</div>
        <p style="font-size:0.875rem;color:var(--t3);line-height:1.7;">Artist Collab is built by a small team of music fans, artists, and engineers who believe the creative process deserves better infrastructure.</p>
      </div>
    </div>
  </div>
</div>
` + siteFooter() + closeShell();
}
