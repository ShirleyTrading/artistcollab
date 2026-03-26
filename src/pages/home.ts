import { shell, closeShell, publicNav, siteFooter, waveform } from '../layout';
import { users, listings, formatPrice, formatListeners } from '../data';

export function homePage(): string {
  const featured = users.filter(u => u.verified).slice(0, 4);

  const heroWave = [0.2,0.5,0.8,0.6,0.9,0.7,0.4,1.0,0.75,0.55,0.85,0.65,0.45,0.95,0.7,
                    0.5,0.8,0.6,0.3,0.9,0.7,0.5,0.65,0.8,0.4,0.7,0.5,0.3,0.6,0.9];

  return shell('ArtistCollab — Collaborate, Create, Get Paid', `

  /* ══ HOME PAGE STYLES ═══════════════════════════════════════════════════════ */

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
  .hero-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 0%, transparent 100%);
    pointer-events: none;
  }
  .hero-glow {
    position: absolute;
    width: 700px; height: 700px; border-radius: 50%;
    background: radial-gradient(circle, rgba(200,255,0,0.06) 0%, transparent 65%);
    top: -200px; right: 0%;
    filter: blur(80px); pointer-events: none;
  }
  .hero-glow-2 {
    position: absolute;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,194,255,0.04) 0%, transparent 65%);
    bottom: -80px; left: 5%;
    filter: blur(80px); pointer-events: none;
  }
  .hero-inner {
    position: relative; z-index: 2;
    max-width: 1160px; margin: 0 auto;
    padding: 80px 32px 60px;
    display: grid;
    grid-template-columns: 1fr 480px;
    gap: 64px;
    align-items: center;
  }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--signal-dim);
    border: 1px solid rgba(200,255,0,0.2);
    border-radius: var(--r-full);
    padding: 5px 14px;
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    color: var(--signal);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 24px;
  }
  .hero-eyebrow-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--signal);
    animation: pulse-dot 2s ease-in-out infinite;
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }
  .hero-h1 {
    font-family: var(--font-display);
    font-size: clamp(2.6rem, 5vw, 4.5rem);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: var(--t1);
    margin-bottom: 20px;
  }
  .hero-h1 em {
    font-style: normal;
    color: var(--signal);
  }
  .hero-sub {
    font-size: 1.125rem;
    line-height: 1.65;
    color: var(--t2);
    max-width: 520px;
    margin-bottom: 36px;
  }
  .hero-cta-row {
    display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
    margin-bottom: 40px;
  }
  .hero-trust {
    display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
  }
  .hero-trust-item {
    display: flex; align-items: center; gap: 7px;
    font-size: 0.8125rem; color: var(--t3);
  }
  .hero-trust-item i { color: var(--s-ok); font-size: 11px; }

  /* ── Hero Card (right side) ── */
  .hero-card {
    background: var(--c-panel);
    border: 1px solid var(--c-rim);
    border-radius: var(--r-xl);
    overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px var(--c-wire);
  }
  .hero-card-head {
    background: var(--c-raised);
    border-bottom: 1px solid var(--c-wire);
    padding: 12px 16px;
    display: flex; align-items: center; gap: 8px;
  }
  .hero-card-dot {
    width: 8px; height: 8px; border-radius: 50%;
  }
  .hero-card-body { padding: 20px; }
  .hc-project-title {
    font-family: var(--font-mono); font-size: 0.6875rem;
    color: var(--t3); letter-spacing: 0.08em; text-transform: uppercase;
    margin-bottom: 14px;
  }
  .hc-collab-row {
    display: flex; align-items: center; gap: 10px;
    background: var(--c-sub);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-md);
    padding: 10px 14px;
    margin-bottom: 12px;
  }
  .hc-collab-row img {
    width: 36px; height: 36px; border-radius: 50%;
    object-fit: cover; border: 1.5px solid var(--c-rim);
  }
  .hc-collab-info { flex: 1; }
  .hc-collab-name { font-size: 0.875rem; font-weight: 600; color: var(--t1); }
  .hc-collab-role { font-size: 0.75rem; color: var(--t3); }
  .hc-collab-badge {
    font-family: var(--font-mono); font-size: 0.625rem;
    padding: 3px 8px; border-radius: var(--r-full);
    font-weight: 700; letter-spacing: 0.06em;
  }
  .hc-track {
    background: var(--c-sub);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-md);
    padding: 10px 14px;
    margin-bottom: 10px;
  }
  .hc-track-label {
    font-family: var(--font-mono); font-size: 0.625rem;
    color: var(--t4); letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 6px;
  }
  .hc-waveform { display: flex; align-items: flex-end; gap: 2px; height: 32px; }
  .hc-wb {
    flex: 1; border-radius: 1px;
    background: rgba(200,255,0,0.18);
    transition: background 0.1s;
  }
  .hc-wb.active { background: var(--signal); }
  .hc-escrow {
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(45,202,114,0.08);
    border: 1px solid rgba(45,202,114,0.2);
    border-radius: var(--r-md);
    padding: 10px 14px;
    margin-top: 12px;
  }
  .hc-escrow-label { font-size: 0.75rem; color: var(--s-ok); font-weight: 600; }
  .hc-escrow-amount {
    font-family: var(--font-mono); font-size: 0.9375rem;
    font-weight: 700; color: var(--t1);
  }

  /* ── Stats bar ── */
  .stats-bar {
    background: var(--c-panel);
    border-top: 1px solid var(--c-wire);
    border-bottom: 1px solid var(--c-wire);
    padding: 28px 32px;
  }
  .stats-bar-inner {
    max-width: 1160px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-around;
    gap: 16px; flex-wrap: wrap;
  }
  .stat-item { text-align: center; }
  .stat-num {
    font-family: var(--font-display);
    font-size: 2rem; font-weight: 800;
    color: var(--t1); letter-spacing: -0.02em;
    margin-bottom: 4px;
  }
  .stat-label {
    font-size: 0.8125rem; color: var(--t3);
  }
  .stat-sep {
    width: 1px; height: 40px;
    background: var(--c-rim);
  }

  /* ── How it works ── */
  .hiw-section {
    max-width: 1160px; margin: 0 auto;
    padding: 80px 32px;
  }
  .section-eyebrow {
    font-family: var(--font-mono); font-size: 0.6875rem;
    color: var(--signal); letter-spacing: 0.15em; text-transform: uppercase;
    margin-bottom: 12px;
  }
  .section-h2 {
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    font-weight: 700; letter-spacing: -0.02em;
    color: var(--t1); margin-bottom: 12px;
  }
  .section-sub { font-size: 1rem; color: var(--t2); max-width: 560px; margin-bottom: 48px; }

  .hiw-steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    background: var(--c-rim);
    border-radius: var(--r-xl);
    overflow: hidden;
  }
  .hiw-step {
    background: var(--c-panel);
    padding: 36px 32px;
    position: relative;
  }
  .hiw-step:first-child { border-radius: var(--r-xl) 0 0 var(--r-xl); }
  .hiw-step:last-child { border-radius: 0 var(--r-xl) var(--r-xl) 0; }
  .hiw-num {
    font-family: var(--font-mono);
    font-size: 0.6875rem; color: var(--signal);
    letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 20px;
  }
  .hiw-icon {
    width: 48px; height: 48px; border-radius: var(--r-md);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.25rem;
    margin-bottom: 16px;
  }
  .hiw-title {
    font-family: var(--font-display); font-size: 1.125rem;
    font-weight: 700; color: var(--t1); margin-bottom: 8px;
  }
  .hiw-desc { font-size: 0.875rem; line-height: 1.65; color: var(--t2); }
  .hiw-connector {
    position: absolute; right: -1px; top: 50%;
    transform: translateY(-50%);
    width: 0; height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 10px solid var(--c-panel);
    z-index: 2;
  }

  /* ── Featured Artists ── */
  .featured-section {
    padding: 80px 32px;
    background: var(--c-sub);
    border-top: 1px solid var(--c-wire);
    border-bottom: 1px solid var(--c-wire);
  }
  .featured-inner { max-width: 1160px; margin: 0 auto; }
  .featured-header {
    display: flex; align-items: flex-end; justify-content: space-between;
    margin-bottom: 36px; gap: 16px; flex-wrap: wrap;
  }
  .featured-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  .ac {
    background: var(--c-panel);
    border: 1px solid var(--c-rim);
    border-radius: var(--r-xl);
    overflow: hidden;
    transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
    cursor: pointer;
    text-decoration: none;
    display: block;
  }
  .ac:hover {
    transform: translateY(-4px);
    border-color: rgba(200,255,0,0.25);
    box-shadow: 0 16px 40px rgba(0,0,0,0.4);
  }
  .ac-cover {
    position: relative;
    height: 160px; overflow: hidden;
    background: var(--c-raised);
  }
  .ac-cover img {
    width: 100%; height: 100%; object-fit: cover;
    opacity: 0.6; transition: opacity 0.3s, transform 0.3s;
  }
  .ac:hover .ac-cover img { opacity: 0.8; transform: scale(1.03); }
  .ac-cover-grad {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 40%, var(--c-panel) 100%);
  }
  .ac-avt {
    position: absolute;
    bottom: -20px; left: 16px;
    width: 48px; height: 48px; border-radius: 50%;
    border: 2px solid var(--c-panel); overflow: hidden;
    background: var(--c-raised);
  }
  .ac-avt img { width: 100%; height: 100%; object-fit: cover; }
  .ac-body { padding: 28px 16px 16px; }
  .ac-name {
    font-family: var(--font-display); font-size: 1rem;
    font-weight: 700; color: var(--t1); margin-bottom: 2px;
  }
  .ac-meta {
    font-size: 0.75rem; color: var(--t3); margin-bottom: 10px;
    display: flex; align-items: center; gap: 6px;
  }
  .ac-meta-sep { color: var(--t4); }
  .ac-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 12px; }
  .ac-tag {
    font-size: 0.6875rem; padding: 2px 8px;
    border-radius: var(--r-full);
    background: var(--c-lift); border: 1px solid var(--c-rim);
    color: var(--t3); font-family: var(--font-mono);
  }
  .ac-foot {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 10px; border-top: 1px solid var(--c-wire);
  }
  .ac-price { font-family: var(--font-mono); font-size: 0.875rem; font-weight: 700; color: var(--signal); }
  .ac-rating { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; color: var(--t2); }
  .ac-rating i { color: var(--s-warn); font-size: 10px; }

  /* ── Flow section (full booking flow visual) ── */
  .flow-section {
    max-width: 1160px; margin: 0 auto;
    padding: 80px 32px;
  }
  .flow-steps {
    display: flex; align-items: flex-start;
    gap: 0; position: relative;
    margin-top: 48px;
  }
  .flow-step {
    flex: 1;
    display: flex; flex-direction: column; align-items: center;
    text-align: center;
    position: relative;
    padding: 0 12px;
  }
  .flow-step::after {
    content: '';
    position: absolute;
    top: 20px; left: 50%; right: -50%;
    height: 1px;
    background: linear-gradient(90deg, var(--signal) 0%, var(--c-rim) 100%);
  }
  .flow-step:last-child::after { display: none; }
  .flow-circle {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--c-raised); border: 1px solid var(--c-rim);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700;
    color: var(--signal); margin-bottom: 14px; position: relative; z-index: 2;
    transition: background 0.2s, border-color 0.2s;
  }
  .flow-step.done .flow-circle {
    background: var(--signal-dim); border-color: var(--signal);
  }
  .flow-name { font-size: 0.8125rem; font-weight: 600; color: var(--t1); margin-bottom: 4px; }
  .flow-desc { font-size: 0.75rem; color: var(--t3); line-height: 1.5; }

  /* ── Features ── */
  .features-section {
    padding: 80px 32px;
  }
  .features-inner { max-width: 1160px; margin: 0 auto; }
  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 48px;
  }
  .feat-card {
    background: var(--c-panel);
    border: 1px solid var(--c-rim);
    border-radius: var(--r-xl);
    padding: 28px 24px;
    transition: border-color 0.2s, transform 0.2s;
  }
  .feat-card:hover { border-color: var(--c-lift); transform: translateY(-2px); }
  .feat-icon {
    width: 44px; height: 44px; border-radius: var(--r-md);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; margin-bottom: 16px;
  }
  .feat-title {
    font-family: var(--font-display); font-size: 1rem;
    font-weight: 700; color: var(--t1); margin-bottom: 8px;
  }
  .feat-desc { font-size: 0.875rem; color: var(--t2); line-height: 1.6; }

  /* ── Testimonials ── */
  .testi-section {
    padding: 80px 32px;
    background: var(--c-sub);
    border-top: 1px solid var(--c-wire);
    border-bottom: 1px solid var(--c-wire);
  }
  .testi-inner { max-width: 1160px; margin: 0 auto; }
  .testi-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 16px; margin-top: 48px;
  }
  .testi-card {
    background: var(--c-panel); border: 1px solid var(--c-rim);
    border-radius: var(--r-xl); padding: 28px 24px;
  }
  .testi-stars { color: var(--s-warn); font-size: 0.75rem; margin-bottom: 14px; }
  .testi-quote { font-size: 0.9375rem; line-height: 1.65; color: var(--t2); margin-bottom: 20px; }
  .testi-author { display: flex; align-items: center; gap: 12px; }
  .testi-avt { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; background: var(--c-raised); }
  .testi-avt img { width: 100%; height: 100%; object-fit: cover; }
  .testi-name { font-size: 0.875rem; font-weight: 600; color: var(--t1); }
  .testi-role { font-size: 0.75rem; color: var(--t3); }

  /* ── Final CTA band ── */
  .cta-band {
    padding: 100px 32px;
    text-align: center;
    position: relative; overflow: hidden;
  }
  .cta-band-glow {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 60% at 50% 50%, rgba(200,255,0,0.06) 0%, transparent 70%);
    pointer-events: none;
  }
  .cta-band-h2 {
    font-family: var(--font-display);
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 800; letter-spacing: -0.02em;
    color: var(--t1); margin-bottom: 16px;
  }
  .cta-band-sub { font-size: 1.0625rem; color: var(--t2); max-width: 500px; margin: 0 auto 36px; }
  .cta-band-btns { display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .hero-inner { grid-template-columns: 1fr; gap: 40px; }
    .hero-card { max-width: 480px; }
    .featured-grid { grid-template-columns: repeat(2, 1fr); }
    .hiw-steps { grid-template-columns: 1fr; }
    .flow-steps { flex-direction: column; align-items: stretch; gap: 8px; }
    .flow-step::after { display: none; }
    .features-grid { grid-template-columns: repeat(2, 1fr); }
    .testi-grid { grid-template-columns: repeat(2, 1fr); }
    .stats-bar-inner .stat-sep { display: none; }
  }
  @media (max-width: 768px) {
    .hero-inner { padding: 60px 20px 40px; }
    .featured-section { padding: 56px 20px; }
    .hiw-section, .flow-section, .features-section { padding: 56px 20px; }
    .featured-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .features-grid { grid-template-columns: 1fr; }
    .testi-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 480px) {
    .hero-h1 { font-size: 2.2rem; }
    .featured-grid { grid-template-columns: 1fr; }
    .hero-cta-row { flex-direction: column; align-items: stretch; }
    .hero-cta-row .btn { text-align: center; justify-content: center; }
  }

  `, publicNav() + `

  <!-- ══ HERO ════════════════════════════════════════════════════════════════ -->
  <section class="hero" aria-label="Hero">
    <div class="hero-grid"></div>
    <div class="hero-glow"></div>
    <div class="hero-glow-2"></div>

    <div class="hero-inner">
      <!-- Left: copy -->
      <div>
        <div class="hero-eyebrow">
          <span class="hero-eyebrow-dot"></span>
          The Studio for Remote Collabs
        </div>
        <h1 class="hero-h1">Make Music.<br><em>Get Paid.</em><br>Together.</h1>
        <p class="hero-sub">
          Book verified artists, sign agreements, secure payments in escrow —
          and collaborate in a shared project room. From first track to final master.
        </p>
        <div class="hero-cta-row">
          <a href="/signup" class="btn btn-primary btn-lg">
            <i class="fas fa-rocket"></i> Start Free
          </a>
          <a href="/explore" class="btn btn-secondary btn-lg">
            <i class="fas fa-search"></i> Find Artists
          </a>
        </div>
        <div class="hero-trust">
          <div class="hero-trust-item">
            <i class="fas fa-check-circle"></i>
            <span>12,000+ verified artists</span>
          </div>
          <div class="hero-trust-item">
            <i class="fas fa-check-circle"></i>
            <span>Escrow protected payments</span>
          </div>
          <div class="hero-trust-item">
            <i class="fas fa-check-circle"></i>
            <span>Free to join</span>
          </div>
        </div>
      </div>

      <!-- Right: project card preview -->
      <div class="hero-card">
        <div class="hero-card-head">
          <div class="hero-card-dot" style="background:#FF5F57;"></div>
          <div class="hero-card-dot" style="background:#FEBC2E;"></div>
          <div class="hero-card-dot" style="background:#28C840;"></div>
          <span style="margin-left:6px;font-family:var(--font-mono);font-size:0.625rem;color:var(--t4);">ARTIST COLLAB — PROJECT ROOM</span>
        </div>
        <div class="hero-card-body">
          <div class="hc-project-title">COLLAB PROJECT · ACTIVE</div>

          <!-- Collaborators -->
          <div class="hc-collab-row">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" alt="Artist">
            <div class="hc-collab-info">
              <div class="hc-collab-name">Nova Lee</div>
              <div class="hc-collab-role">Vocalist · NYC</div>
            </div>
            <span class="hc-collab-badge" style="background:var(--signal-dim);color:var(--signal);">SELLER</span>
          </div>
          <div class="hc-collab-row">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" alt="Artist">
            <div class="hc-collab-info">
              <div class="hc-collab-name">Marcus X</div>
              <div class="hc-collab-role">Producer · LA</div>
            </div>
            <span class="hc-collab-badge" style="background:var(--patch-dim);color:var(--patch);">BUYER</span>
          </div>

          <!-- Waveform -->
          <div class="hc-track">
            <div class="hc-track-label">VOX MAIN — TAKE 3</div>
            <div class="hc-waveform">
              ${heroWave.map((h, i) => `<div class="hc-wb${i >= 15 && i <= 22 ? ' active' : ''}" style="height:${Math.round(h * 32)}px;"></div>`).join('')}
            </div>
          </div>

          <!-- Escrow status -->
          <div class="hc-escrow">
            <div>
              <div class="hc-escrow-label"><i class="fas fa-shield-alt" style="margin-right:5px;"></i>HELD IN ESCROW</div>
              <div style="font-size:0.6875rem;color:var(--t3);margin-top:2px;">Releases on delivery approval</div>
            </div>
            <div class="hc-escrow-amount">$900</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ══ STATS BAR ═══════════════════════════════════════════════════════════ -->
  <div class="stats-bar">
    <div class="stats-bar-inner">
      <div class="stat-item">
        <div class="stat-num">12K+</div>
        <div class="stat-label">Artists & Producers</div>
      </div>
      <div class="stat-sep"></div>
      <div class="stat-item">
        <div class="stat-num">$2.1M</div>
        <div class="stat-label">Paid to Artists</div>
      </div>
      <div class="stat-sep"></div>
      <div class="stat-item">
        <div class="stat-num">98%</div>
        <div class="stat-label">On-Time Delivery</div>
      </div>
      <div class="stat-sep"></div>
      <div class="stat-item">
        <div class="stat-num">4.9★</div>
        <div class="stat-label">Average Rating</div>
      </div>
    </div>
  </div>

  <!-- ══ HOW IT WORKS ════════════════════════════════════════════════════════ -->
  <section aria-label="How it works">
    <div class="hiw-section">
      <div class="section-eyebrow">How it works</div>
      <h2 class="section-h2">Book a collab in under 30 seconds</h2>
      <p class="section-sub">No contracts to negotiate, no awkward DMs. Three simple steps.</p>

      <div class="hiw-steps">
        <div class="hiw-step">
          <div class="hiw-num">01 / DISCOVER</div>
          <div class="hiw-icon" style="background:var(--signal-dim);">
            <i class="fas fa-search" style="color:var(--signal);"></i>
          </div>
          <div class="hiw-title">Find Your Artist</div>
          <div class="hiw-desc">Search 12,000+ verified producers, vocalists, and engineers. Filter by genre, price, availability, and style.</div>
          <div class="hiw-connector"></div>
        </div>
        <div class="hiw-step">
          <div class="hiw-num">02 / BOOK</div>
          <div class="hiw-icon" style="background:var(--patch-dim);">
            <i class="fas fa-calendar-check" style="color:var(--patch);"></i>
          </div>
          <div class="hiw-title">Book & Pay Safely</div>
          <div class="hiw-desc">Choose a package, sign a digital agreement, and pay. Your money is held in escrow until you approve the work.</div>
          <div class="hiw-connector"></div>
        </div>
        <div class="hiw-step">
          <div class="hiw-num">03 / CREATE</div>
          <div class="hiw-icon" style="background:var(--warm-dim);">
            <i class="fas fa-music" style="color:var(--warm);"></i>
          </div>
          <div class="hiw-title">Collaborate & Deliver</div>
          <div class="hiw-desc">Work together in a shared project room. Chat, share files, run live sessions, and sign your split sheet.</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ══ BOOKING FLOW VISUAL ════════════════════════════════════════════════ -->
  <section aria-label="Booking flow" style="padding: 20px 32px 80px; border-top: 1px solid var(--c-wire);">
    <div style="max-width:1160px;margin:0 auto;">
      <div class="section-eyebrow">The booking flow</div>
      <h2 class="section-h2">Every step, handled.</h2>
      <div class="flow-steps" style="margin-top:48px;">
        ${[
          { n: '01', name: 'Select Package',   desc: 'Pick what you need', done: true },
          { n: '02', name: 'Upload Track',      desc: 'Share your reference', done: true },
          { n: '03', name: 'Sign Agreement',    desc: 'NDA + collab terms', done: true },
          { n: '04', name: 'Escrow Payment',    desc: 'Pay — funds held safe', done: true },
          { n: '05', name: 'Project Room',      desc: 'Collaborate live', done: false },
          { n: '06', name: 'Approve & Release', desc: 'Artist gets paid', done: false },
        ].map(s => `
        <div class="flow-step${s.done ? ' done' : ''}">
          <div class="flow-circle">${s.n}</div>
          <div class="flow-name">${s.name}</div>
          <div class="flow-desc">${s.desc}</div>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- ══ FEATURED ARTISTS ═══════════════════════════════════════════════════ -->
  <section class="featured-section" aria-label="Featured artists">
    <div class="featured-inner">
      <div class="featured-header">
        <div>
          <div class="section-eyebrow">Featured Artists</div>
          <h2 class="section-h2" style="margin-bottom:0;">Ready to collaborate</h2>
        </div>
        <a href="/explore" class="btn btn-secondary">
          Find More Artists <i class="fas fa-arrow-right" style="margin-left:6px;"></i>
        </a>
      </div>

      <div class="featured-grid">
        ${featured.map(u => `
        <a class="ac" href="/artist/${u.id}">
          <div class="ac-cover">
            <img src="${u.coverImage || u.profileImage}" alt="${u.artistName}">
            <div class="ac-cover-grad"></div>
            <div class="ac-avt">
              <img src="${u.profileImage}" alt="${u.artistName}">
            </div>
          </div>
          <div class="ac-body">
            <div class="ac-name">${u.artistName}</div>
            <div class="ac-meta">
              <span><i class="fas fa-map-marker-alt" style="font-size:9px;"></i> ${u.location}</span>
              <span class="ac-meta-sep">·</span>
              <span>${formatListeners(u.monthlyListeners)} listeners</span>
            </div>
            <div class="ac-tags">
              ${(u.genre || []).slice(0, 2).map(g => `<span class="ac-tag">${g}</span>`).join('')}
              ${u.verified ? '<span class="ac-tag" style="color:var(--s-ok);border-color:rgba(45,202,114,0.2);">✓ Verified</span>' : ''}
            </div>
            <div class="ac-foot">
              <span class="ac-price">From ${formatPrice(u.startingPrice)}</span>
              <span class="ac-rating"><i class="fas fa-star"></i> ${u.rating.toFixed(1)} (${u.reviewCount})</span>
            </div>
          </div>
        </a>`).join('')}
      </div>
    </div>
  </section>

  <!-- ══ PLATFORM FEATURES ══════════════════════════════════════════════════ -->
  <section class="features-section" aria-label="Platform features">
    <div class="features-inner">
      <div class="section-eyebrow">Built for artists</div>
      <h2 class="section-h2">Everything you need, nothing you don't</h2>
      <p class="section-sub">We handle the legal, financial, and technical complexity so you can focus on the music.</p>

      <div class="features-grid">
        ${[
          { icon: 'fa-shield-alt', color: 'var(--s-ok)', bg: 'var(--s-ok-d)',
            title: 'Escrow Protection', desc: 'Your payment is held securely until you approve the final delivery. No approvals, no payout.' },
          { icon: 'fa-file-signature', color: 'var(--patch)', bg: 'var(--patch-dim)',
            title: 'Digital Agreements', desc: 'NDA, split sheets, and collaboration terms — signed digitally inside the platform, legally binding.' },
          { icon: 'fa-folder-open', color: 'var(--warm)', bg: 'var(--warm-dim)',
            title: 'Stem Vault', desc: 'Shared file storage for WAV stems, project files, and references. Organized by project automatically.' },
          { icon: 'fa-video', color: 'var(--channel)', bg: 'var(--channel-dim)',
            title: 'Live Sessions', desc: 'Real-time audio with role-based access for artists, engineers, and producers — in the browser.' },
          { icon: 'fa-chart-pie', color: 'var(--signal)', bg: 'var(--signal-dim)',
            title: 'Split Sheets', desc: 'Digital ownership splits with ASCAP/BMI/SESAC info. Required approvals from all collaborators.' },
          { icon: 'fa-bolt', color: 'var(--warm)', bg: 'var(--warm-dim)',
            title: 'Instant Payouts', desc: 'Funds release the moment your client approves delivery. Paid in 1-3 business days.' },
        ].map(f => `
        <div class="feat-card">
          <div class="feat-icon" style="background:${f.bg};">
            <i class="fas ${f.icon}" style="color:${f.color};"></i>
          </div>
          <div class="feat-title">${f.title}</div>
          <div class="feat-desc">${f.desc}</div>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- ══ TESTIMONIALS ═══════════════════════════════════════════════════════ -->
  <section class="testi-section" aria-label="Testimonials">
    <div class="testi-inner">
      <div class="section-eyebrow">From the community</div>
      <h2 class="section-h2">Artists love using it</h2>

      <div class="testi-grid">
        ${[
          { quote: "Booked a feature, signed the agreement, paid — all in under 10 minutes. Got the stems back in 3 days. This is how collabs should work.",
            name: 'Nova Lee', role: 'Vocalist, NYC',
            img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop' },
          { quote: "The escrow system is a game-changer. I've been scammed twice on other platforms. Never happened here and never will.",
            name: 'Marcus X', role: 'Producer, Los Angeles',
            img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop' },
          { quote: "Split sheets used to take weeks of back-and-forth. Now they're done inside the project room before we even finish mixing.",
            name: 'XAVI', role: 'Artist & Engineer, Miami',
            img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop' },
        ].map(t => `
        <div class="testi-card">
          <div class="testi-stars">★★★★★</div>
          <p class="testi-quote">"${t.quote}"</p>
          <div class="testi-author">
            <div class="testi-avt"><img src="${t.img}" alt="${t.name}"></div>
            <div>
              <div class="testi-name">${t.name}</div>
              <div class="testi-role">${t.role}</div>
            </div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- ══ FINAL CTA ══════════════════════════════════════════════════════════ -->
  <section class="cta-band">
    <div class="cta-band-glow"></div>
    <div style="position:relative;z-index:1;">
      <div class="section-eyebrow" style="display:inline-block;margin-bottom:16px;">Ready to start?</div>
      <div class="cta-band-h2">Your next collab<br>starts here.</div>
      <p class="cta-band-sub">Join 12,000+ artists. Free account, no credit card required.</p>
      <div class="cta-band-btns">
        <a href="/signup" class="btn btn-primary btn-lg">
          <i class="fas fa-rocket"></i> Create Free Account
        </a>
        <a href="/explore" class="btn btn-secondary btn-lg">
          <i class="fas fa-users"></i> Browse Artists
        </a>
      </div>
    </div>
  </section>

  ${siteFooter()}
  ${closeShell()}`);
}
