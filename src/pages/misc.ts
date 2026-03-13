import { shell, closeShell, publicNav, siteFooter } from '../layout';

// ─── How It Works ─────────────────────────────────────────────────────────────
export function howItWorksPage(): string {
  const steps = [
    {
      num:'01', icon:'fa-search', color:'var(--signal)', bg:'var(--signal-dim)',
      title:'Find your collaborator',
      sub:'Browse. Filter. Book.',
      desc:'Search 12,000+ verified artists, rappers, singers, songwriters, and producers. Filter by genre, price, availability, and ratings. Every profile has real reviews, audio samples, and a clear work history.',
      features:['Genre & mood filters','Verified identity badges','Audio portfolio samples','Response time indicators','Rating & review system'],
    },
    {
      num:'02', icon:'fa-box', color:'var(--warm)', bg:'var(--warm-dim)',
      title:'Book a session package',
      sub:'Clear pricing. No DMs.',
      desc:'Select from transparently-priced packages. See exactly what\'s included: delivery days, revisions, file formats. Submit your brief and book in under 5 minutes — no negotiating, no guessing.',
      features:['Fixed-price packages','Delivery timeline upfront','Secure escrow payment','Brief & reference upload','Add-on customizations'],
    },
    {
      num:'03', icon:'fa-folder-open', color:'var(--patch)', bg:'rgba(0,194,255,0.08)',
      title:'Work in your workspace',
      sub:'One space. All files.',
      desc:'The moment you book, a private project workspace is created. Direct messaging, stem vault with version history, delivery tracking — everything in one place. No email chains. No lost files.',
      features:['Private project messaging','Stem locker & version history','Real-time status tracking','Activity log','File delivery confirmation'],
    },
    {
      num:'04', icon:'fa-shield-halved', color:'var(--s-ok)', bg:'rgba(45,202,114,0.08)',
      title:'Pay securely, get paid fast',
      sub:'Escrow. Protected.',
      desc:'Your payment is held in escrow from the moment you book. It releases to the artist only when you approve the delivery. Revision requests are protected. Artists receive instant payouts on acceptance.',
      features:['Stripe-powered escrow','Revision requests covered','Dispute resolution team','10% transparent fee','Instant artist payouts'],
    },
  ];

  return shell('How It Works', `
  .hiw-hero { padding: 100px 24px 80px; text-align: center; position: relative; overflow: hidden; }
  .hiw-hero-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(200,255,0,0.05) 0%, transparent 60%);
    pointer-events: none;
  }
  .hiw-hero-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse at center, black 20%, transparent 80%);
    pointer-events: none;
  }
  .hiw-step {
    display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;
    max-width: 1100px; margin: 0 auto; padding: 80px 24px;
    border-bottom: 1px solid var(--c-wire);
  }
  .hiw-step:last-child { border-bottom: none; }
  .hiw-step.flip { direction: rtl; }
  .hiw-step.flip > * { direction: ltr; }
  .step-visual {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-xl);
    aspect-ratio: 4/3;
    display: flex; align-items: center; justify-content: center;
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
  <div class="hiw-hero-bg"></div>
  <div class="hiw-hero-grid"></div>
  <div style="position:relative;z-index:1;max-width:700px;margin:0 auto;">
    <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:20px;">
      <div style="height:1px;width:24px;background:var(--signal);box-shadow:0 0 6px var(--signal-glow);"></div>
      <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--signal);">The Signal Path</span>
      <div style="height:1px;width:24px;background:var(--signal);"></div>
    </div>
    <h1 class="d1" style="margin-bottom:20px;">Music collaboration,<br><span style="color:var(--t3);">structured.</span></h1>
    <p class="body-lg" style="max-width:520px;margin:0 auto 36px;">Artist Collab handles everything from discovery to payout — so you can focus on the music.</p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
      <a href="/signup" class="btn btn-primary btn-xl">
        <i class="fas fa-microphone-alt" style="font-size:13px;"></i>
        Start Collaborating
      </a>
      <a href="/explore" class="btn btn-outline btn-xl">Browse Artists</a>
    </div>
  </div>
</section>

<!-- Step sections -->
${steps.map((s, i) => `
<section class="hiw-step ${i % 2 !== 0 ? 'flip' : ''}">

  <!-- Visual side -->
  <div class="step-visual" style="border-top:2px solid ${s.color};">
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,${s.bg} 0%,transparent 70%);"></div>

    <!-- Step number watermark -->
    <div style="position:absolute;top:16px;left:20px;font-family:var(--font-display);font-size:4rem;font-weight:800;letter-spacing:-0.05em;color:rgba(255,255,255,0.03);line-height:1;">${s.num}</div>

    <!-- Center content -->
    <div style="position:relative;z-index:1;text-align:center;">
      <div style="width:72px;height:72px;background:${s.bg};border:1px solid ${s.color}33;border-radius:var(--r-xl);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;box-shadow:0 0 40px ${s.bg};">
        <i class="fas ${s.icon}" style="font-size:1.75rem;color:${s.color};"></i>
      </div>

      <!-- Mini UI mockup (product preview) -->
      <div style="background:var(--c-raised);border:1px solid var(--c-wire);border-radius:var(--r-lg);padding:14px 18px;max-width:260px;text-align:left;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
          <div style="width:22px;height:22px;border-radius:50%;background:${s.color};opacity:0.7;"></div>
          <div style="height:7px;width:80px;background:var(--c-rim);border-radius:3px;"></div>
          <span class="badge" style="background:${s.bg};color:${s.color};border:1px solid ${s.color}33;font-size:0.6rem;margin-left:auto;">Step ${s.num}</span>
        </div>
        <div style="height:5px;width:100%;background:var(--c-rim);border-radius:2px;margin-bottom:5px;"></div>
        <div style="height:5px;width:85%;background:var(--c-rim);border-radius:2px;margin-bottom:5px;"></div>
        <div style="height:5px;width:70%;background:var(--c-rim);border-radius:2px;margin-bottom:12px;"></div>
        <div style="height:28px;background:${s.color};border-radius:var(--r);opacity:0.85;display:flex;align-items:center;justify-content:center;">
          <div style="height:5px;width:60%;background:rgba(0,0,0,0.2);border-radius:2px;"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Content side -->
  <div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
      <div style="height:1px;width:24px;background:${s.color};box-shadow:0 0 5px ${s.color};"></div>
      <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${s.color};">Step ${s.num}</span>
    </div>
    <h2 class="d3" style="margin-bottom:8px;">${s.title}</h2>
    <p style="font-size:1rem;font-weight:600;color:${s.color};margin-bottom:18px;letter-spacing:-0.01em;">${s.sub}</p>
    <p class="body-lg" style="margin-bottom:28px;">${s.desc}</p>
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${s.features.map(f => `
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:20px;height:20px;border-radius:50%;background:${s.bg};border:1px solid ${s.color}33;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i class="fas fa-check" style="font-size:8px;color:${s.color};"></i>
        </div>
        <span style="font-size:0.9375rem;color:var(--t2);">${f}</span>
      </div>`).join('')}
    </div>
  </div>

</section>`).join('')}

<!-- Roadmap -->
<section style="padding:80px 24px;background:var(--c-base);border-top:1px solid var(--c-wire);">
  <div style="max-width:900px;margin:0 auto;text-align:center;">
    <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:16px;">
      <div style="height:1px;width:24px;background:var(--patch);"></div>
      <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--patch);">Roadmap</span>
      <div style="height:1px;width:24px;background:var(--patch);"></div>
    </div>
    <h2 class="d3" style="margin-bottom:14px;">What's next</h2>
    <p class="body-lg" style="max-width:500px;margin:0 auto 40px;">We're building the future of remote music creation. Here's what's on the horizon.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;text-align:left;">
      ${[
        {icon:'fa-video', label:'Virtual Studio Rooms', sub:'Live video collab sessions', color:'var(--signal)'},
        {icon:'fa-microchip', label:'AI Artist Matching', sub:'Smart recommendations', color:'var(--patch)'},
        {icon:'fa-file-signature', label:'Split-Sheet Generator', sub:'Automatic rights management', color:'var(--warm)'},
        {icon:'fa-chart-line', label:'Artist Analytics', sub:'Track your career growth', color:'var(--s-ok)'},
        {icon:'fa-campground', label:'Songwriting Camps', sub:'Group creative sessions', color:'var(--signal)'},
        {icon:'fa-tag', label:'Label & A&R Tools', sub:'Sign and discover talent', color:'var(--warm)'},
      ].map(f => `
      <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);padding:18px;display:flex;align-items:flex-start;gap:12px;transition:border-color 0.2s;" onmouseover="this.style.borderColor='${f.color}33'" onmouseout="this.style.borderColor='var(--c-wire)'">
        <div style="width:34px;height:34px;background:${f.color}12;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i class="fas ${f.icon}" style="color:${f.color};font-size:0.875rem;"></i>
        </div>
        <div>
          <div style="font-weight:700;font-size:0.875rem;margin-bottom:2px;">${f.label}</div>
          <div class="mono-sm" style="color:var(--t4);">${f.sub}</div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- CTA -->
<section style="padding:96px 24px;text-align:center;position:relative;overflow:hidden;">
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse 60% 70% at 50% 100%,rgba(200,255,0,0.06) 0%,transparent 60%);pointer-events:none;"></div>
  <div style="position:relative;z-index:1;max-width:600px;margin:0 auto;">
    <h2 class="d2" style="margin-bottom:16px;">Ready to build<br>something real?</h2>
    <p class="body-lg" style="margin-bottom:36px;">Join thousands of artists already using Artist Collab to create, book, and deliver professional music.</p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
      <a href="/signup" class="btn btn-primary btn-xl">
        <i class="fas fa-microphone-alt" style="font-size:13px;"></i>
        Create Your Profile
      </a>
      <a href="/explore" class="btn btn-outline btn-xl">Browse Artists</a>
    </div>
    <p class="mono-sm" style="color:var(--t4);margin-top:20px;">Free to join · No subscription required · Escrow protected</p>
  </div>
</section>

${siteFooter()}${closeShell()}`;
}

// ─── Terms ────────────────────────────────────────────────────────────────────
export function termsPage(): string {
  return shell('Terms of Service', `
  .legal-page { padding: 80px 24px; max-width: 760px; margin: 0 auto; }
  .legal-section { margin-bottom: 36px; }
  .legal-section h2 { font-size: 1.125rem; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 12px; }
  .legal-section p, .legal-section li { font-size: 0.9375rem; color: var(--t3); line-height: 1.8; margin-bottom: 10px; }
  .legal-section ul { padding-left: 20px; }
  .legal-section a { color: var(--signal); }
`) + publicNav() + `
<div style="background:var(--c-base);border-bottom:1px solid var(--c-wire);padding:52px 24px 44px;text-align:center;">
  <span class="badge badge-muted" style="margin-bottom:16px;">Legal</span>
  <h1 class="d2" style="margin-bottom:8px;">Terms of Service</h1>
  <p class="body-sm">Last updated: March 1, 2026</p>
</div>
<div class="legal-page">
  <div class="legal-section"><h2>1. Acceptance of Terms</h2><p>By creating an account or using Artist Collab ("the Platform"), you agree to be bound by these Terms of Service and all applicable laws. If you do not agree with these terms, you may not use the Platform.</p></div>
  <div class="legal-section"><h2>2. Platform Overview</h2><p>Artist Collab is a remote music collaboration marketplace that facilitates connections between music creators and provides tools for booking, project management, file sharing, and payment processing.</p></div>
  <div class="legal-section"><h2>3. User Accounts</h2><p>You must be 18 years or older to create an account. You are responsible for maintaining the security of your credentials and may not impersonate others or create accounts for fraudulent purposes.</p></div>
  <div class="legal-section"><h2>4. Payments & Escrow</h2><p>All payments are processed through Stripe. Funds are held in escrow and released to the seller only upon delivery acceptance. Artist Collab charges a 10% platform fee on all transactions.</p><ul><li>Buyers may request revisions before releasing payment.</li><li>Refunds are available within 24 hours if work has not begun.</li><li>Disputes are reviewed by the Artist Collab Trust & Safety team.</li></ul></div>
  <div class="legal-section"><h2>5. Intellectual Property</h2><p>All deliverables are subject to the licensing terms agreed upon by both parties at booking. Unless otherwise specified, buyers receive a non-exclusive license to the delivered work.</p></div>
  <div class="legal-section"><h2>6. Prohibited Conduct</h2><ul><li>Fraudulent or illegal use of the platform</li><li>Conducting transactions off-platform to avoid fees</li><li>Uploading copyrighted material you don't have rights to</li><li>Harassment or abusive behavior toward other users</li><li>Creating fake reviews or manipulating ratings</li></ul></div>
  <div class="legal-section"><h2>7. Limitation of Liability</h2><p>Artist Collab is not liable for the quality, legality, or ownership of content delivered through the platform. Our liability is limited to the amount of the platform fee collected for the transaction in question.</p></div>
  <div class="legal-section"><h2>8. Contact</h2><p>For questions about these terms: <a href="mailto:legal@artistcollab.studio">legal@artistcollab.studio</a></p></div>
</div>
${siteFooter()}${closeShell()}`;
}

// ─── Privacy ──────────────────────────────────────────────────────────────────
export function privacyPage(): string {
  return shell('Privacy Policy', `
  .legal-page { padding: 80px 24px; max-width: 760px; margin: 0 auto; }
  .legal-section { margin-bottom: 36px; }
  .legal-section h2 { font-size: 1.125rem; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 12px; }
  .legal-section p, .legal-section li { font-size: 0.9375rem; color: var(--t3); line-height: 1.8; margin-bottom: 10px; }
  .legal-section ul { padding-left: 20px; }
  .legal-section a { color: var(--signal); }
`) + publicNav() + `
<div style="background:var(--c-base);border-bottom:1px solid var(--c-wire);padding:52px 24px 44px;text-align:center;">
  <span class="badge badge-muted" style="margin-bottom:16px;">Legal</span>
  <h1 class="d2" style="margin-bottom:8px;">Privacy Policy</h1>
  <p class="body-sm">Last updated: March 1, 2026</p>
</div>
<div class="legal-page">
  <div class="legal-section"><h2>Information We Collect</h2><p>We collect information you provide when creating an account, including your name, email address, profile information, and payment details. We also collect usage data about how you interact with the Platform.</p></div>
  <div class="legal-section"><h2>How We Use Your Information</h2><ul><li>To provide and improve the Platform</li><li>To process payments and prevent fraud</li><li>To send transactional emails and notifications</li><li>To comply with legal obligations</li></ul></div>
  <div class="legal-section"><h2>Data Sharing</h2><p>We do not sell your personal data. We share information with service providers (Stripe for payments) only as necessary to provide the service. We may share data when required by law.</p></div>
  <div class="legal-section"><h2>Cookies</h2><p>We use cookies for authentication and analytics. You can disable cookies in your browser settings, though some features may not work correctly.</p></div>
  <div class="legal-section"><h2>Your Rights</h2><p>You have the right to access, correct, or delete your personal data. Contact us at <a href="mailto:privacy@artistcollab.studio">privacy@artistcollab.studio</a> to exercise these rights.</p></div>
</div>
${siteFooter()}${closeShell()}`;
}

// ─── Contact ──────────────────────────────────────────────────────────────────
export function contactPage(): string {
  return shell('Contact', `
  .contact-page { padding: 80px 24px; }
  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; max-width: 1000px; margin: 0 auto; align-items: start; }
  @media (max-width: 800px) { .contact-grid { grid-template-columns: 1fr; gap: 40px; } }
`) + publicNav() + `

<div style="background:var(--c-base);border-bottom:1px solid var(--c-wire);padding:56px 24px 48px;text-align:center;">
  <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:14px;">
    <div style="height:1px;width:24px;background:var(--signal);box-shadow:0 0 6px var(--signal-glow);"></div>
    <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--signal);">Support</span>
    <div style="height:1px;width:24px;background:var(--signal);"></div>
  </div>
  <h1 class="d2" style="margin-bottom:10px;">Get in touch</h1>
  <p class="body-base" style="max-width:440px;margin:0 auto;">We're a small team that cares deeply about the music community. Reach out and we'll get back to you within 24 hours.</p>
</div>

<div class="contact-page">
  <div class="contact-grid">

    <!-- Form -->
    <div>
      <h2 style="font-size:1.25rem;font-weight:700;letter-spacing:-0.02em;margin-bottom:20px;">Send a message</h2>
      <form style="display:flex;flex-direction:column;gap:14px;" onsubmit="event.preventDefault();document.getElementById('contact-success').style.display='block';this.style.display='none';">
        <div class="field"><label class="field-label">Your Name</label><input class="field-input" type="text" placeholder="Your name" required></div>
        <div class="field"><label class="field-label">Email</label><input class="field-input" type="email" placeholder="you@email.com" required></div>
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
        <div class="field"><label class="field-label">Message</label><textarea class="field-input" rows="5" placeholder="Describe your issue or question…"></textarea></div>
        <button type="submit" class="btn btn-primary btn-lg" style="width:fit-content;">
          Send Message
          <i class="fas fa-arrow-right" style="font-size:12px;"></i>
        </button>
      </form>
      <div id="contact-success" style="display:none;padding:20px;background:rgba(45,202,114,0.08);border:1px solid rgba(45,202,114,0.2);border-radius:var(--r-lg);text-align:center;">
        <i class="fas fa-check-circle" style="color:var(--s-ok);font-size:1.5rem;margin-bottom:8px;display:block;"></i>
        <div style="font-weight:700;margin-bottom:4px;">Message sent!</div>
        <p class="body-sm">We'll reply within 24 hours.</p>
      </div>
    </div>

    <!-- Other channels -->
    <div>
      <h2 style="font-size:1.25rem;font-weight:700;letter-spacing:-0.02em;margin-bottom:20px;">Other ways to reach us</h2>
      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:32px;">
        ${[
          {icon:'fa-envelope', label:'Email Support', val:'support@artistcollab.studio', sub:'Replies within 24hrs', color:'var(--signal)'},
          {icon:'fa-brands fa-instagram', label:'Instagram', val:'@artistcollab', sub:'DMs open for quick questions', color:'var(--warm)'},
          {icon:'fa-brands fa-twitter', label:'X / Twitter', val:'@artistcollab', sub:'Announcements & updates', color:'var(--patch)'},
        ].map(c => `
        <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);border-left:2px solid ${c.color};">
          <div style="width:36px;height:36px;background:${c.color}12;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="${c.icon}" style="color:${c.color};font-size:0.875rem;"></i>
          </div>
          <div>
            <div style="font-size:0.875rem;font-weight:700;margin-bottom:2px;">${c.label}</div>
            <div style="font-size:0.8125rem;color:var(--signal);font-weight:500;">${c.val}</div>
            <div class="mono-sm" style="color:var(--t4);">${c.sub}</div>
          </div>
        </div>`).join('')}
      </div>

      <!-- Response time card -->
      <div style="background:var(--signal-dim);border:1px solid rgba(200,255,0,0.2);border-radius:var(--r-lg);padding:20px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <div class="node node-signal"></div>
          <span class="mono-sm" style="color:var(--signal);">RESPONSE TIMES</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;">
          ${[
            {label:'General inquiries', time:'Within 24 hours'},
            {label:'Payment disputes', time:'Within 4 hours'},
            {label:'Trust & Safety', time:'Within 2 hours'},
          ].map(r => `
          <div style="display:flex;justify-content:space-between;font-size:0.8125rem;">
            <span style="color:var(--t2);">${r.label}</span>
            <span style="font-weight:600;color:var(--signal);">${r.time}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>

  </div>
</div>
${siteFooter()}${closeShell()}`;
}
