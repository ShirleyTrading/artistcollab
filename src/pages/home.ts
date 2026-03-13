import { shell, closeShell, publicNav, siteFooter, waveform } from '../layout';
import { users, listings, formatPrice, formatListeners } from '../data';

export function homePage(): string {
  const featured = users.filter(u => u.verified).slice(0, 4);
  const topListings = listings.filter(l => l.active).slice(0, 3);

  // Seeded waveform heights for the hero
  const heroWave = [0.2,0.5,0.8,0.6,0.9,0.7,0.4,1.0,0.75,0.55,0.85,0.65,0.45,0.95,0.7,0.5,0.8,0.6,0.3,0.9,0.7,0.5,0.65,0.8,0.4,0.7,0.5,0.3,0.6,0.9,0.7,0.45,0.8,0.55,0.7];

  return shell('The Remote Studio for Artists', `

  /* ─────────────────────────────────────────────────────────────────────
     HOME: page-specific styles, all using AC/1 tokens
     ───────────────────────────────────────────────────────────────────── */

  /* ── Hero ── */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    background: var(--c-void);
  }

  /* DAW-grid background: fine horizontal track lanes */
  .hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 0%, transparent 100%);
    pointer-events: none;
  }

  /* Two-tone light bleed: signal + warm */
  .hero-glow-1 {
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(200,255,0,0.055) 0%, transparent 65%);
    top: -200px; right: 5%;
    filter: blur(60px);
    pointer-events: none;
  }
  .hero-glow-2 {
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,194,255,0.04) 0%, transparent 65%);
    bottom: -80px; left: 8%;
    filter: blur(80px);
    pointer-events: none;
  }

  /* Traveling scan dot on horizontal path */
  .hero-scan {
    position: absolute;
    left: 0; right: 0;
    top: 38%;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--c-rim) 20%, var(--c-rim) 80%, transparent 100%);
    pointer-events: none;
  }
  .hero-scan::after {
    content: '';
    position: absolute;
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--signal);
    top: -2px;
    box-shadow: 0 0 10px var(--signal), 0 0 20px var(--signal-glow);
    animation: travel 4s linear infinite;
  }

  .hero-inner {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center;
    max-width: 1280px;
    margin: 0 auto;
    padding: 100px 24px 80px;
  }

  /* Eyebrow */
  .hero-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 4px 12px 4px 4px;
    background: var(--signal-dim);
    border: 1px solid rgba(200,255,0,0.22);
    border-radius: var(--r-full);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--signal);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 28px;
    width: fit-content;
  }
  .hero-pill-dot {
    width: 18px; height: 18px;
    border-radius: 50%;
    background: var(--signal);
    display: flex; align-items: center; justify-content: center;
    font-size: 9px;
    color: #000;
  }

  /* Display headline */
  .hero-headline {
    font-family: var(--font-display);
    font-size: clamp(3.4rem, 7.5vw, 7rem);
    font-weight: 800;
    line-height: 0.92;
    letter-spacing: -0.03em;
    margin-bottom: 28px;
  }
  .hero-h-dim  { color: var(--t3); }
  .hero-h-main { color: var(--t1); }
  .hero-h-grad {
    background: linear-gradient(110deg, var(--signal) 0%, var(--patch) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    font-style: italic;
  }

  /* Hero CTA row */
  .hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 44px; }

  /* Social proof strip */
  .hero-proof { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .hero-proof-avs { display: flex; }
  .hero-proof-avs img { border: 2px solid var(--c-void); margin-left: -9px; }
  .hero-proof-avs img:first-child { margin-left: 0; }
  .hero-proof-divider { width: 1px; height: 32px; background: var(--c-wire); }

  /* ── Hero right: DAW workspace preview ── */
  .hero-preview {
    border-radius: var(--r-lg);
    overflow: hidden;
    background: var(--c-panel);
    border: 1px solid rgba(255,255,255,0.07);
    box-shadow:
      0 32px 80px rgba(0,0,0,0.8),
      0 0 0 1px rgba(255,255,255,0.04),
      0 0 60px rgba(200,255,0,0.04);
    position: relative;
  }
  /* Window chrome bar */
  .preview-chrome {
    background: var(--c-sub);
    padding: 10px 14px;
    border-bottom: 1px solid var(--c-wire);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .preview-dot { width: 10px; height: 10px; border-radius: 50%; }

  /* Track lanes inside preview */
  .preview-tracks { padding: 14px 14px 10px; display: flex; flex-direction: column; gap: 4px; }
  .track-lane {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 8px;
    height: 38px;
  }
  .track-label {
    display: flex; align-items: center; gap: 6px;
    background: var(--c-raised);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-sm);
    padding: 0 8px;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--t3);
    white-space: nowrap;
    overflow: hidden;
  }
  .track-color-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .track-body {
    background: var(--c-sub);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-sm);
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: 0 6px;
    gap: 2px;
  }

  /* Waveform inside track */
  .mini-wave-bar {
    width: 2px;
    border-radius: 1px;
    flex-shrink: 0;
  }

  .preview-footer {
    padding: 10px 14px;
    border-top: 1px solid var(--c-wire);
    background: var(--c-sub);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* Floating stat badges */
  .float-badge {
    position: absolute;
    border-radius: var(--r-md);
    padding: 10px 14px;
    box-shadow: var(--sh-lg);
    backdrop-filter: blur(12px);
  }
  .float-badge-tl {
    top: -18px; right: -20px;
    background: rgba(16,24,16,0.95);
    border: 1px solid rgba(200,255,0,0.3);
  }
  .float-badge-bl {
    bottom: -18px; left: -20px;
    background: rgba(10,14,26,0.95);
    border: 1px solid rgba(0,194,255,0.25);
  }

  /* ── Stats bar ── */
  .stats-bar {
    background: var(--c-base);
    border-top: 1px solid var(--c-wire);
    border-bottom: 1px solid var(--c-wire);
  }
  .stats-bar-inner {
    max-width: 1280px; margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
  .stat-cell {
    padding: 28px 20px;
    border-right: 1px solid var(--c-wire);
    text-align: center;
  }
  .stat-cell:last-child { border-right: none; }
  .stat-val {
    font-family: var(--font-display);
    font-size: 2.25rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 4px;
  }
  .stat-lbl {
    font-size: 0.75rem;
    color: var(--t4);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 600;
  }

  /* ── How It Works (3 steps) ── */
  .steps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    background: var(--c-wire);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    overflow: hidden;
  }
  .step-card {
    background: var(--c-panel);
    padding: 36px 28px;
    position: relative;
    transition: background var(--t-base) var(--ease);
  }
  .step-card:hover { background: var(--c-raised); }
  .step-number {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: var(--t4);
    margin-bottom: 20px;
  }
  .step-icon-wrap {
    width: 44px; height: 44px;
    border-radius: var(--r-sm);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.125rem;
    margin-bottom: 20px;
  }
  /* Step connector: signal path line on right edge */
  .step-card:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -1px;
    top: 50%;
    width: 2px; height: 20px;
    background: var(--signal);
    transform: translateY(-50%);
    box-shadow: 0 0 8px var(--signal-glow);
    opacity: 0.6;
  }

  /* ── Feature grid ── */
  .feat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .feat-card {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    padding: 28px 24px;
    transition: all var(--t-base) var(--ease);
    cursor: pointer;
  }
  .feat-card:hover {
    background: var(--c-raised);
    border-color: rgba(255,255,255,0.09);
    transform: translateY(-2px);
    box-shadow: var(--sh);
  }
  /* Channel strip: left-border identity */
  .feat-card.strip-signal { border-left: 2px solid var(--signal); }
  .feat-card.strip-patch  { border-left: 2px solid var(--patch); }
  .feat-card.strip-warm   { border-left: 2px solid var(--warm); }
  .feat-icon {
    width: 40px; height: 40px;
    border-radius: var(--r-sm);
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem;
    margin-bottom: 18px;
  }

  /* ── Artist cards ── */
  .artist-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  .artist-card {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    overflow: hidden;
    cursor: pointer;
    transition: all var(--t-slow) var(--ease);
  }
  .artist-card:hover {
    border-color: rgba(200,255,0,0.2);
    transform: translateY(-4px);
    box-shadow: var(--sh-lg), 0 0 0 1px rgba(200,255,0,0.1);
  }
  .artist-cover {
    height: 110px;
    position: relative;
    overflow: hidden;
  }
  .artist-cover img {
    width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0.45;
    transition: opacity var(--t-slow), transform var(--t-slow);
  }
  .artist-card:hover .artist-cover img { opacity: 0.6; transform: scale(1.04); }
  .artist-cover-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 0%, var(--c-panel) 100%);
  }
  .artist-body { padding: 0 16px 18px; }

  /* ── Testimonials ── */
  .quote-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .quote-card {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    padding: 24px;
    transition: border-color var(--t-base);
  }
  .quote-card:hover { border-color: rgba(255,255,255,0.09); }

  /* ── CTA ── */
  .cta-band {
    background: var(--c-base);
    border-top: 1px solid var(--c-wire);
    border-bottom: 1px solid var(--c-wire);
    position: relative;
    overflow: hidden;
    padding: 80px 24px;
    text-align: center;
  }
  .cta-band::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 70% at 50% 100%, rgba(200,255,0,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  /* ── Section rhythm ── */
  .section { padding: 96px 24px; }
  .section-sm { padding: 72px 24px; }

  /* Signal path divider for section headings */
  .section-label {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  .section-label-line {
    height: 1px;
    width: 32px;
    background: var(--signal);
    box-shadow: 0 0 6px var(--signal-glow);
  }
  .section-label-text {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--signal);
  }

  @media (max-width: 1024px) {
    .hero-inner { grid-template-columns: 1fr; gap: 48px; padding: 88px 20px 64px; }
    .hero-preview { display: none; }
    .artist-grid { grid-template-columns: repeat(2, 1fr); }
    .feat-grid { grid-template-columns: repeat(2, 1fr); }
    .steps-grid { grid-template-columns: 1fr; gap: 1px; }
    .step-card:not(:last-child)::after { display: none; }
    .quote-grid { grid-template-columns: 1fr; }
    .float-badge { display: none; }
  }
  @media (max-width: 768px) {
    .hero-inner { padding: 72px 16px 48px; }
    .hero-headline { font-size: clamp(2.6rem, 11vw, 3.8rem); }
    .hero-ctas { flex-direction: column; gap: 10px; }
    .hero-ctas .btn { width: 100%; justify-content: center; }
    .hero-proof { gap: 10px; }
    .hero-proof-divider { display: none; }
    .stats-bar-inner { grid-template-columns: repeat(2, 1fr); }
    .stat-cell:nth-child(3) { border-top: 1px solid var(--c-wire); }
    .stat-cell:nth-child(4) { border-top: 1px solid var(--c-wire); border-right: none; }
    .section { padding: 56px 16px; }
    .section-sm { padding: 40px 16px; }
    .cta-band { padding: 56px 16px; }
    .feat-grid { grid-template-columns: 1fr; }
    .artist-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .quote-grid { gap: 12px; }
    .step-card { padding: 24px 20px; }
    .stat-val { font-size: 1.75rem; }
  }
  @media (max-width: 480px) {
    .artist-grid { grid-template-columns: 1fr; }
    .hero-headline { font-size: clamp(2.4rem, 10vw, 3.2rem); }
    .stats-bar-inner { grid-template-columns: 1fr 1fr; }
  }

`) + publicNav() + `

<!-- ══════════════════════════════════════════════════════════════════════════ -->
<!-- HERO                                                                       -->
<!-- ══════════════════════════════════════════════════════════════════════════ -->
<section class="hero">
  <div class="hero-grid"></div>
  <div class="hero-glow-1"></div>
  <div class="hero-glow-2"></div>
  <div class="hero-scan"></div>

  <div class="hero-inner">

    <!-- LEFT: editorial copy -->
    <div>

      <!-- Eyebrow pill -->
      <div class="hero-pill">
        <span class="hero-pill-dot"><i class="fas fa-signal" style="font-size:7px;"></i></span>
        Remote Studio Infrastructure
      </div>

      <!-- Display headline with three lines -->
      <h1 class="hero-headline">
        <span class="hero-h-dim">Make<br></span>
        <span class="hero-h-main">Records<br></span>
        <span class="hero-h-grad">Together</span>
      </h1>

      <p class="body-lg" style="max-width:440px; margin-bottom:36px;">
        Artist Collab is the platform where independent artists book features,
        share stems, and build music — all in one secure workspace. No DMs. No ghost files.
      </p>

      <div class="hero-ctas">
        <a href="/signup" class="btn btn-primary btn-lg">
          <i class="fas fa-microphone-alt" style="font-size:13px;"></i>
          Start Your Session
        </a>
        <a href="/explore" class="btn btn-secondary btn-lg">
          Browse Artists
        </a>
      </div>

      <!-- Social proof -->
      <div class="hero-proof">
        <div class="hero-proof-avs">
          ${featured.slice(0,4).map((u,i) => `<img src="${u.profileImage}" class="av av-sm" alt="${u.artistName}" style="border:2px solid var(--c-void);">`).join('')}
        </div>
        <div>
          <div style="font-size:0.875rem;font-weight:600;letter-spacing:-0.01em;">12,000+ artists signed up</div>
          <div style="font-size:0.75rem;color:var(--t4);">Rappers · Singers · Producers · Songwriters</div>
        </div>
        <div class="hero-proof-divider"></div>
        <div style="display:flex;align-items:center;gap:5px;">
          <span style="color:var(--signal);font-size:0.875rem;letter-spacing:2px;">★★★★★</span>
          <span class="mono-sm" style="color:var(--t3);">4.9</span>
        </div>
      </div>
    </div>

    <!-- RIGHT: DAW workspace preview -->
    <div style="position:relative;">
      <div class="hero-preview">

        <!-- Window chrome -->
        <div class="preview-chrome">
          <div class="preview-dot" style="background:#ef4444;opacity:0.7;"></div>
          <div class="preview-dot" style="background:#f59e0b;opacity:0.7;"></div>
          <div class="preview-dot" style="background:var(--signal);opacity:0.7;"></div>
          <span style="margin-left:auto;font-family:var(--font-mono);font-size:0.65rem;color:var(--t4);letter-spacing:0.1em;">PROJECT WORKSPACE · AC/1</span>
        </div>

        <!-- Session info bar -->
        <div style="padding:10px 14px;border-bottom:1px solid var(--c-wire);background:var(--c-panel);display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div class="node node-signal" style="animation:pulse 2s infinite;"></div>
            <div>
              <div style="font-size:0.8125rem;font-weight:700;letter-spacing:-0.01em;">XAVI × Nova Lee</div>
              <div style="font-size:0.69rem;color:var(--t4);font-family:var(--font-mono);">Hook Feature · In Progress</div>
            </div>
          </div>
          <span class="badge badge-signal"><i class="fas fa-circle" style="font-size:5px;"></i> LIVE</span>
        </div>

        <!-- Track lanes: the core motif -->
        <div class="preview-tracks">

          ${[
            { label:'VOX MAIN', color:'var(--signal)',   active: true,  heights:[0.3,0.6,0.9,0.8,1.0,0.85,0.6,0.4,0.7,0.9,0.8,0.6,0.4,0.7,0.5,0.8,0.9,0.65,0.5,0.75,0.85,0.55,0.7,0.4,0.6,0.8,0.5,0.3] },
            { label:'VOX HARM', color:'var(--patch)',    active: true,  heights:[0.2,0.4,0.6,0.5,0.7,0.55,0.4,0.6,0.5,0.7,0.55,0.4,0.6,0.5,0.7,0.55,0.4,0.6,0.5,0.7,0.55,0.65,0.45,0.55,0.4,0.6,0.5,0.3] },
            { label:'REF BEAT', color:'var(--warm)',     active: false, heights:[0.5,0.5,0.5,0.5,0.8,0.5,0.5,0.5,0.5,0.8,0.5,0.5,0.5,0.5,0.8,0.5,0.5,0.5,0.5,0.8,0.5,0.5,0.5,0.5,0.8,0.5,0.5,0.5] },
            { label:'MIX BUS', color:'var(--channel)',   active: false, heights:[0.15,0.3,0.2,0.25,0.2,0.3,0.15,0.25,0.2,0.3,0.2,0.25,0.2,0.3,0.15,0.25,0.2,0.3,0.2,0.25,0.2,0.3,0.15,0.25,0.2,0.3,0.2,0.25] },
          ].map(t => `
          <div class="track-lane">
            <div class="track-label">
              <div class="track-color-dot" style="background:${t.color};${t.active ? `box-shadow:0 0 5px ${t.color};` : 'opacity:0.3;'}"></div>
              <span>${t.label}</span>
            </div>
            <div class="track-body">
              ${t.heights.map(h => `<div class="mini-wave-bar" style="height:${Math.round(h*100)}%;background:${t.color};opacity:${t.active ? '0.7' : '0.25'};"></div>`).join('')}
            </div>
          </div>`).join('')}

        </div>

        <!-- File row -->
        <div style="padding:10px 14px;background:var(--c-panel);border-top:1px solid var(--c-wire);display:flex;gap:8px;">
          ${[
            {name:'golden_hook_v2.wav', type:'WAV', new:true},
            {name:'harmony_stems.zip', type:'ZIP', new:false},
          ].map(f => `
          <div style="flex:1;display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--c-raised);border:1px solid var(--c-wire);border-radius:var(--r-sm);">
            <div style="width:26px;height:26px;background:${f.type==='WAV' ? 'var(--signal-dim)' : 'rgba(0,194,255,0.1)'};border-radius:var(--r-xs);display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;">${f.type==='WAV' ? '🎵' : '📦'}</div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:0.69rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${f.name}</div>
              <div style="font-size:0.6rem;color:var(--t4);font-family:var(--font-mono);">${f.type}</div>
            </div>
            ${f.new ? '<span class="badge badge-signal" style="font-size:0.6rem;flex-shrink:0;">NEW</span>' : ''}
          </div>`).join('')}
        </div>

        <!-- Preview footer: escrow status -->
        <div class="preview-footer">
          <div style="display:flex;align-items:center;gap:8px;">
            <div class="node node-ok"></div>
            <span style="font-size:0.69rem;font-family:var(--font-mono);color:var(--t3);">ESCROW SECURED</span>
          </div>
          <span style="font-family:var(--font-mono);font-size:0.8125rem;font-weight:700;color:var(--s-ok);">$900.00</span>
        </div>
      </div>

      <!-- Floating badges -->
      <div class="float-badge float-badge-tl">
        <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--t4);margin-bottom:3px;">PAYMENT HELD</div>
        <div style="font-size:1.0625rem;font-weight:800;letter-spacing:-0.02em;color:var(--signal);">$900 <span style="font-size:0.69rem;font-weight:500;color:var(--t4);">secured</span></div>
      </div>

      <div class="float-badge float-badge-bl" style="display:flex;align-items:center;gap:10px;">
        <div class="node node-ok" style="animation:pulse 2s infinite;"></div>
        <div>
          <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--t4);">DELIVERY APPROVED</div>
          <div style="font-size:0.8125rem;font-weight:600;">3 stems delivered</div>
        </div>
      </div>
    </div>

  </div>

  <!-- Scroll indicator -->
  <div style="position:absolute;bottom:28px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:6px;z-index:2;pointer-events:none;">
    <span class="eyebrow" style="color:var(--t4);">Scroll</span>
    <div style="width:1px;height:28px;background:linear-gradient(to bottom,var(--signal),transparent);"></div>
  </div>
</section>


<!-- ══════════════════════════════════════════════════════════════════════════ -->
<!-- STATS BAR                                                                  -->
<!-- ══════════════════════════════════════════════════════════════════════════ -->
<div class="stats-bar">
  <div class="stats-bar-inner">
    ${[
      { val: '12K+',   lbl: 'Artists & Producers', color: 'var(--signal)' },
      { val: '$2.1M',  lbl: 'Paid Out to Artists',  color: 'var(--patch)' },
      { val: '98%',    lbl: 'On-Time Delivery',      color: 'var(--s-ok)' },
      { val: '4.9★',   lbl: 'Average Rating',         color: 'var(--warm)' },
    ].map(s => `
    <div class="stat-cell">
      <div class="stat-val" style="color:${s.color};">${s.val}</div>
      <div class="stat-lbl">${s.lbl}</div>
    </div>`).join('')}
  </div>
</div>


<!-- ══════════════════════════════════════════════════════════════════════════ -->
<!-- HOW IT WORKS (3-step signal path)                                          -->
<!-- ══════════════════════════════════════════════════════════════════════════ -->
<section class="section" style="background:var(--c-void);">
  <div style="max-width:1280px;margin:0 auto;">

    <div class="section-label">
      <div class="section-label-line"></div>
      <span class="section-label-text">Signal Path</span>
    </div>

    <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:52px;flex-wrap:wrap;gap:16px;">
      <h2 class="d3" style="max-width:480px;">Three steps from idea<br>to finished record</h2>
      <a href="/how-it-works" class="btn btn-ghost btn-sm" style="color:var(--t3);">See full breakdown <i class="fas fa-arrow-right" style="font-size:11px;margin-left:4px;"></i></a>
    </div>

    <div class="steps-grid">
      ${[
        { n:'01', icon:'fa-search', bg:'var(--signal-dim)', color:'var(--signal)', title:'Find your artist', desc:'Browse 12,000+ verified artists by genre, style, price, and availability. Every profile has audio samples and real reviews.' },
        { n:'02', icon:'fa-layer-group', bg:'rgba(0,194,255,0.08)', color:'var(--patch)', title:'Book a session', desc:'Select your package, submit your brief, and fund the escrow. Payment is only released when you approve the delivery.' },
        { n:'03', icon:'fa-check-circle', bg:'rgba(45,202,114,0.08)', color:'var(--s-ok)', title:'Deliver & get paid', desc:'Collaborate in the workspace, share stems securely, approve the final delivery, and receive instant payout.' },
      ].map(s => `
      <div class="step-card">
        <div class="step-number">STEP ${s.n}</div>
        <div class="step-icon-wrap" style="background:${s.bg};">
          <i class="fas ${s.icon}" style="color:${s.color};font-size:1rem;"></i>
        </div>
        <h3 style="font-size:1.125rem;font-weight:700;margin-bottom:10px;letter-spacing:-0.01em;">${s.title}</h3>
        <p class="body-sm">${s.desc}</p>
      </div>`).join('')}
    </div>

  </div>
</section>


<!-- ══════════════════════════════════════════════════════════════════════════ -->
<!-- FEATURED ARTISTS (identity cards)                                          -->
<!-- ══════════════════════════════════════════════════════════════════════════ -->
<section class="section" style="background:var(--c-base);border-top:1px solid var(--c-wire);">
  <div style="max-width:1280px;margin:0 auto;">

    <div class="section-label">
      <div class="section-label-line"></div>
      <span class="section-label-text">Featured Artists</span>
    </div>

    <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:40px;flex-wrap:wrap;gap:16px;">
      <h2 class="d3">Artists ready<br>to collaborate</h2>
      <a href="/explore" class="btn btn-secondary btn-sm">Browse All Artists</a>
    </div>

    <div class="artist-grid">
      ${featured.map((u, i) => {
        const stripColors = ['var(--signal)', 'var(--patch)', 'var(--warm)', 'var(--channel)'];
        const color = stripColors[i % stripColors.length];
        return `
      <div class="artist-card" data-href="/artist/${u.id}" style="border-left:3px solid ${color};">
        <div class="artist-cover">
          <img src="${u.coverImage || u.profileImage}" alt="${u.artistName}">
          <div class="artist-cover-overlay"></div>
          <!-- Avatar overlapping cover -->
          <div style="position:absolute;bottom:-18px;left:16px;">
            <div style="position:relative;">
              <img src="${u.profileImage}" class="av av-md" style="border:2px solid var(--c-panel);" alt="${u.artistName}">
              ${u.verified ? `<div style="position:absolute;bottom:0;right:0;width:16px;height:16px;background:var(--signal);border-radius:50%;border:2px solid var(--c-panel);display:flex;align-items:center;justify-content:center;"><i class="fas fa-check" style="font-size:7px;color:#000;"></i></div>` : ''}
            </div>
          </div>
        </div>
        <div class="artist-body" style="padding-top:28px;">
          <div style="font-weight:700;font-size:0.9375rem;letter-spacing:-0.01em;margin-bottom:2px;">${u.artistName}</div>
          <div style="font-family:var(--font-mono);font-size:0.69rem;color:var(--t4);margin-bottom:10px;">@${u.username}</div>
          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px;">
            ${u.genre.slice(0,2).map(g => `<span class="badge badge-muted">${g}</span>`).join('')}
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div>
              <div style="font-size:0.69rem;color:var(--t4);font-family:var(--font-mono);margin-bottom:2px;">FROM</div>
              <div style="font-size:1rem;font-weight:800;letter-spacing:-0.02em;color:${color};">${formatPrice(u.startingPrice)}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:0.75rem;font-weight:600;margin-bottom:1px;">
                <span style="color:var(--signal);">★</span> ${u.rating.toFixed(1)}
              </div>
              <div class="mono-sm" style="color:var(--t4);">${u.reviewCount} reviews</div>
            </div>
          </div>
        </div>
      </div>`}).join('')}
    </div>

  </div>
</section>


<!-- ══════════════════════════════════════════════════════════════════════════ -->
<!-- FEATURES (why AC is different)                                             -->
<!-- ══════════════════════════════════════════════════════════════════════════ -->
<section class="section" style="background:var(--c-void);border-top:1px solid var(--c-wire);">
  <div style="max-width:1280px;margin:0 auto;">

    <div class="section-label">
      <div class="section-label-line"></div>
      <span class="section-label-text">Platform Features</span>
    </div>

    <h2 class="d3" style="max-width:500px;margin-bottom:48px;">Built for how<br>music actually gets made</h2>

    <div class="feat-grid">
      ${[
        { strip:'strip-signal', bg:'var(--signal-dim)', color:'var(--signal)', icon:'fa-shield-alt', title:'Escrow Protection', desc:'Every collaboration is protected by built-in escrow. Your payment is held until you approve the final delivery. No risk, full control.' },
        { strip:'strip-patch', bg:'rgba(0,194,255,0.08)', color:'var(--patch)', icon:'fa-file-audio', title:'Stem Vault', desc:'A secure file locker for every project. Version history, delivery confirmation, and organized stems — no more lost files in DMs.' },
        { strip:'strip-warm', bg:'var(--warm-dim)', color:'var(--warm)', icon:'fa-comments', title:'Project Messaging', desc:'All communication happens in the project workspace. No switching apps, no lost context. Every conversation tied to the work.' },
        { strip:'strip-signal', bg:'var(--signal-dim)', color:'var(--signal)', icon:'fa-star', title:'Verified Reviews', desc:'Real ratings from real collaborations. Every review is verified and tied to a completed project. Find the right artist, confidently.' },
        { strip:'strip-patch', bg:'rgba(0,194,255,0.08)', color:'var(--patch)', icon:'fa-bolt', title:'Instant Payout', desc:'Artists get paid the moment a delivery is approved. No holds, no delays, no waiting weeks. Your earnings, your timeline.' },
        { strip:'strip-warm', bg:'var(--warm-dim)', color:'var(--warm)', icon:'fa-headphones', title:'Live Sessions', desc:'Some artists offer live studio sessions for real-time collaboration. Schedule, show up, make music together.' },
      ].map(f => `
      <div class="feat-card ${f.strip}">
        <div class="feat-icon" style="background:${f.bg};">
          <i class="fas ${f.icon}" style="color:${f.color};"></i>
        </div>
        <h3 style="font-size:1rem;font-weight:700;letter-spacing:-0.01em;margin-bottom:8px;">${f.title}</h3>
        <p class="body-sm">${f.desc}</p>
      </div>`).join('')}
    </div>

  </div>
</section>


<!-- ══════════════════════════════════════════════════════════════════════════ -->
<!-- TESTIMONIALS                                                               -->
<!-- ══════════════════════════════════════════════════════════════════════════ -->
<section class="section" style="background:var(--c-base);border-top:1px solid var(--c-wire);">
  <div style="max-width:1280px;margin:0 auto;">

    <div class="section-label">
      <div class="section-label-line"></div>
      <span class="section-label-text">Artist Reviews</span>
    </div>

    <h2 class="d3" style="max-width:440px;margin-bottom:44px;">From artists<br>who've been in the session</h2>

    <div class="quote-grid">
      ${[
        { img:'https://images.unsplash.com/photo-1516981442399-a91139e20ff8?w=80&h=80&fit=crop&crop=face', name:'Nova Lee', handle:'@novalee', color:'var(--signal)', text:'"Artist Collab changed how I approach features. I got my hook delivered in 3 days, stems were clean, escrow released the same day. This is the standard."', stars:5 },
        { img:'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=80&h=80&fit=crop&crop=face', name:'Marcus X', handle:'@marcusx', color:'var(--patch)', text:'"The project workspace is exactly what I needed. No more lost voice memos, no more confusion about versions. Everything tracked, everything clean."', stars:5 },
        { img:'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop&crop=face', name:'XAVI', handle:'@xavi_official', color:'var(--warm)', text:'"I\'ve done 14 collabs on AC. The escrow gives buyers confidence and it gives me confidence as an artist. This is how it should work."', stars:5 },
      ].map(q => `
      <div class="quote-card" style="border-left:2px solid ${q.color};">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
          <img src="${q.img}" class="av av-sm" alt="${q.name}" style="border:1.5px solid var(--c-rim);">
          <div>
            <div style="font-size:0.875rem;font-weight:700;">${q.name}</div>
            <div class="mono-sm" style="color:var(--t4);">${q.handle}</div>
          </div>
          <div style="margin-left:auto;color:${q.color};font-size:0.8125rem;letter-spacing:2px;">${'★'.repeat(q.stars)}</div>
        </div>
        <p style="font-size:0.9375rem;line-height:1.7;color:var(--t2);font-style:italic;">${q.text}</p>
      </div>`).join('')}
    </div>

  </div>
</section>


<!-- ══════════════════════════════════════════════════════════════════════════ -->
<!-- CTA                                                                        -->
<!-- ══════════════════════════════════════════════════════════════════════════ -->
<section class="cta-band">
  <!-- Waveform spine across the section -->
  <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;opacity:0.06;">
    <div style="display:flex;align-items:center;gap:3px;height:80px;width:100%;max-width:800px;">
      ${heroWave.map(h => `<div style="flex:1;height:${Math.round(h*100)}%;background:var(--signal);border-radius:2px;"></div>`).join('')}
    </div>
  </div>

  <div style="position:relative;z-index:1;max-width:600px;margin:0 auto;">
    <div class="section-label" style="justify-content:center;margin-bottom:20px;">
      <div class="section-label-line"></div>
      <span class="section-label-text">Get Started</span>
      <div class="section-label-line"></div>
    </div>
    <h2 class="d2" style="margin-bottom:20px;letter-spacing:-0.03em;">Your next collab<br>is one click away</h2>
    <p class="body-lg" style="margin-bottom:36px;">Join 12,000+ artists already building their music on Artist Collab.</p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
      <a href="/signup" class="btn btn-primary btn-xl">
        <i class="fas fa-microphone-alt" style="font-size:14px;"></i>
        Join as an Artist
      </a>
      <a href="/explore" class="btn btn-outline btn-xl">Browse Artists</a>
    </div>
  </div>
</section>

${siteFooter()}
${closeShell()}
`;
}
