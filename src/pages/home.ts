import { shell, closeShell, publicNav, siteFooter } from '../layout';
import { users, listings, formatPrice, formatListeners } from '../data';

export function homePage(): string {
  const featured = users.filter(u => u.verified).slice(0, 4);

  return shell('The Remote Studio for Artists', `
    /* ─ Homepage extras ─ */
    .hero-section {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      overflow: hidden;
      background: var(--void);
    }
    /* Noise texture overlay */
    .hero-section::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 1;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
    }
    .hero-orb-1 {
      position: absolute;
      width: 700px; height: 700px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 65%);
      top: -200px; right: -100px;
      filter: blur(40px);
    }
    .hero-orb-2 {
      position: absolute;
      width: 500px; height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 65%);
      bottom: -100px; left: 10%;
      filter: blur(60px);
    }
    .hero-scan-line {
      position: absolute;
      left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.4) 40%, rgba(167,139,250,0.6) 50%, rgba(139,92,246,0.4) 60%, transparent 100%);
      animation: scan 8s linear infinite;
      opacity: 0.4;
    }
    /* Grid lines */
    .hero-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 80px 80px;
      mask-image: radial-gradient(ellipse at center, transparent 20%, black 80%);
    }
    .hero-content {
      position: relative;
      z-index: 2;
      width: 100%;
    }
    .hero-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 5px 12px 5px 5px;
      background: rgba(139,92,246,0.1);
      border: 1px solid rgba(139,92,246,0.25);
      border-radius: var(--r-full);
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--uv-bright);
      margin-bottom: 28px;
    }
    .hero-eyebrow-dot {
      width: 20px; height: 20px;
      background: var(--uv);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
    }
    .hero-title {
      font-size: clamp(3.2rem, 7.5vw, 6.8rem);
      font-weight: 800;
      line-height: 0.92;
      letter-spacing: -0.04em;
      margin-bottom: 28px;
    }
    .hero-title-line-1 { color: var(--t1); }
    .hero-title-line-2 {
      background: linear-gradient(135deg, var(--uv-bright) 0%, rgba(167,139,250,0.6) 60%, var(--t1) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: block;
    }
    .hero-title-line-3 { color: var(--t3); font-style: italic; }

    /* Floating UI preview */
    .hero-ui-preview {
      position: relative;
      border-radius: var(--r-xl);
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05);
    }

    /* Waveform bars */
    .waveform {
      display: flex;
      align-items: center;
      gap: 3px;
      height: 40px;
    }
    .wave-bar {
      width: 3px;
      border-radius: 2px;
      background: var(--uv);
      flex-shrink: 0;
    }

    /* Feature cards — editorial */
    .feat-card {
      padding: 28px;
      background: var(--surface);
      border: 1px solid var(--hairline);
      border-radius: var(--r-lg);
      transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }
    .feat-card:hover {
      border-color: rgba(255,255,255,0.12);
      transform: translateY(-3px);
      box-shadow: var(--shadow-lg);
    }
    .feat-icon-ring {
      width: 48px; height: 48px;
      border-radius: var(--r-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.125rem;
      margin-bottom: 20px;
    }

    /* Artist identity cards */
    .artist-card {
      border-radius: var(--r-xl);
      overflow: hidden;
      background: var(--surface);
      border: 1px solid var(--hairline);
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }
    .artist-card:hover {
      border-color: rgba(139,92,246,0.35);
      transform: translateY(-5px);
      box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.2);
    }
    .artist-card-cover {
      height: 120px;
      position: relative;
      overflow: hidden;
    }
    .artist-card-cover img {
      width: 100%; height: 100%;
      object-fit: cover;
      opacity: 0.5;
      transition: opacity 0.3s, transform 0.3s;
    }
    .artist-card:hover .artist-card-cover img {
      opacity: 0.65;
      transform: scale(1.04);
    }
    .artist-card-cover-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(5,5,7,0.8) 100%);
    }
    .artist-card-body { padding: 0 20px 20px; }

    /* Stat ticker */
    .stat-ticker {
      display: flex;
      gap: 0;
      border: 1px solid var(--hairline);
      border-radius: var(--r-lg);
      overflow: hidden;
    }
    .stat-cell {
      flex: 1;
      padding: 20px 16px;
      border-right: 1px solid var(--hairline);
      text-align: center;
    }
    .stat-cell:last-child { border-right: none; }
    .stat-num {
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1;
      margin-bottom: 4px;
    }
    .stat-lbl { font-size: 0.75rem; color: var(--t3); font-weight: 500; }

    /* CTA section */
    .cta-section {
      position: relative;
      padding: 80px var(--s6);
      overflow: hidden;
    }
    .cta-section::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 50% 100%, rgba(139,92,246,0.12) 0%, transparent 70%);
      pointer-events: none;
    }

    /* Section rhythm */
    .section-xl { padding: 100px var(--s6); }
    .section-lg { padding: 80px var(--s6); }

    /* Testimonial */
    .quote-card {
      padding: 28px;
      background: var(--surface);
      border: 1px solid var(--hairline);
      border-radius: var(--r-lg);
      transition: border-color 0.2s;
    }
    .quote-card:hover { border-color: rgba(255,255,255,0.12); }

    @media (max-width: 768px) {
      .hero-title { font-size: clamp(2.5rem, 12vw, 4rem); }
      .section-xl { padding: 64px var(--s4); }
      .section-lg { padding: 56px var(--s4); }
      .stat-ticker { flex-wrap: wrap; }
      .stat-cell { flex: 1 0 45%; border: none; border-bottom: 1px solid var(--hairline); }
    }
  `) + publicNav() + `

<!-- ══════════════════════════════════════════════════════════ -->
<!-- HERO                                                        -->
<!-- ══════════════════════════════════════════════════════════ -->
<section class="hero-section">
  <div class="hero-bg">
    <div class="hero-grid"></div>
    <div class="hero-orb-1"></div>
    <div class="hero-orb-2"></div>
    <div class="hero-scan-line"></div>
  </div>

  <div class="hero-content container" style="padding: 100px var(--s6) 80px; display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center;">

    <!-- Left: editorial copy -->
    <div>
      <div class="hero-eyebrow">
        <span class="hero-eyebrow-dot">🎵</span>
        The Remote Studio for Artists
      </div>

      <h1 class="hero-title">
        <span class="hero-title-line-1">Where</span>
        <span class="hero-title-line-2">Records<br>Get Made</span>
      </h1>

      <p style="font-size:1.0625rem; color:var(--t2); line-height:1.75; max-width:460px; margin-bottom:36px;">
        Artist Collab is the remote studio infrastructure for independent artists.
        Book features, share stems, build records — all inside one secure platform.
        No more messy DMs. No more lost files.
      </p>

      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:48px;">
        <a href="/signup" class="btn btn-primary btn-xl" style="gap:10px;">
          <i class="fas fa-microphone-alt" style="font-size:14px;"></i>
          Join as an Artist
        </a>
        <a href="/explore" class="btn btn-outline btn-xl">
          Explore Artists
          <i class="fas fa-arrow-right" style="font-size:12px;"></i>
        </a>
      </div>

      <!-- Social proof line -->
      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
        <div style="display:flex;align-items:center;">
          ${featured.slice(0,4).map((u, i) => `<img src="${u.profileImage}" class="av av-sm" style="border:2px solid var(--void);margin-left:${i > 0 ? '-10px' : '0'};" alt="${u.artistName}">`).join('')}
        </div>
        <div>
          <div style="font-size:0.875rem;font-weight:600;">12,000+ artists already collaborating</div>
          <div style="font-size:0.75rem;color:var(--t3);">Rappers, singers, songwriters, producers</div>
        </div>
        <div style="width:1px;height:32px;background:var(--hairline);"></div>
        <div style="display:flex;align-items:center;gap:6px;">
          <span class="stars">★★★★★</span>
          <span style="font-size:0.8125rem;color:var(--t2);">4.9 avg rating</span>
        </div>
      </div>
    </div>

    <!-- Right: floating UI preview -->
    <div style="position:relative;">
      <!-- Main card preview -->
      <div class="hero-ui-preview" style="background:var(--surface);">
        <!-- Fake window bar -->
        <div style="background:var(--raised);padding:12px 16px;border-bottom:1px solid var(--hairline);display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;gap:6px;">
            <div style="width:10px;height:10px;border-radius:50%;background:#ef4444;opacity:0.7;"></div>
            <div style="width:10px;height:10px;border-radius:50%;background:var(--warn);opacity:0.7;"></div>
            <div style="width:10px;height:10px;border-radius:50%;background:var(--ok);opacity:0.7;"></div>
          </div>
          <div style="font-size:0.75rem;color:var(--t4);font-weight:600;letter-spacing:0.05em;">PROJECT WORKSPACE</div>
          <div style="width:58px;"></div>
        </div>
        <!-- Workspace content -->
        <div style="padding:20px;">
          <!-- Project header -->
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <div>
              <div style="font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;">XAVI × Nova Lee</div>
              <div style="font-size:0.75rem;color:var(--t3);">Hook Feature · Standard Package</div>
            </div>
            <span class="badge badge-uv" style="font-size:0.69rem;"><i class="fas fa-circle" style="font-size:6px;"></i> In Progress</span>
          </div>
          <!-- Timeline bar -->
          <div style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--t3);margin-bottom:6px;">
              <span>Progress</span><span>Day 2 of 4</span>
            </div>
            <div class="progress"><div class="progress-fill" style="width:55%;"></div></div>
          </div>
          <!-- Files -->
          <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
            ${[
              { name:'golden_hook_v1.wav', type:'WAV', size:'8.1 MB', new:true },
              { name:'reference_stems.zip', type:'ZIP', size:'24 MB', new:false },
            ].map(f => `
            <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--raised);border:1px solid var(--hairline);border-radius:var(--r);">
              <div style="width:32px;height:32px;background:rgba(139,92,246,0.15);border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;">${f.type==='WAV'||f.type==='MP3'?'🎵':'📦'}</div>
              <div style="flex:1;min-width:0;">
                <div style="font-size:0.8125rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${f.name}</div>
                <div style="font-size:0.71rem;color:var(--t3);">${f.type} · ${f.size}</div>
              </div>
              ${f.new ? '<span class="badge badge-ok" style="font-size:0.65rem;flex-shrink:0;">NEW</span>' : ''}
            </div>`).join('')}
          </div>
          <!-- Mini chat -->
          <div style="display:flex;gap:8px;">
            <img src="https://images.unsplash.com/photo-1516981442399-a91139e20ff8?w=60&h=60&fit=crop&crop=face" class="av av-xs" alt="Nova">
            <div style="flex:1;padding:10px 12px;background:var(--raised);border-radius:0 var(--r) var(--r) var(--r);font-size:0.78rem;color:var(--t2);line-height:1.5;">
              Stems are uploaded — check the harmonies on the chorus 🎤
            </div>
          </div>
        </div>
      </div>

      <!-- Floating badge cards -->
      <div style="position:absolute;top:-18px;right:-24px;background:var(--surface);border:1px solid rgba(139,92,246,0.35);border-radius:var(--r-md);padding:12px 14px;box-shadow:var(--shadow-lg);">
        <div style="font-size:0.71rem;color:var(--t3);margin-bottom:4px;">PAYMENT HELD</div>
        <div style="font-size:1.125rem;font-weight:800;letter-spacing:-0.02em;color:var(--ok);">$900 <span style="font-size:0.71rem;color:var(--t3);">secured</span></div>
      </div>

      <div style="position:absolute;bottom:-18px;left:-24px;background:var(--surface);border:1px solid rgba(16,185,129,0.3);border-radius:var(--r-md);padding:12px 16px;box-shadow:var(--shadow-lg);display:flex;align-items:center;gap:10px;">
        <div style="width:8px;height:8px;border-radius:50%;background:var(--ok);box-shadow:0 0 8px rgba(16,185,129,0.5);"></div>
        <div>
          <div style="font-size:0.71rem;color:var(--t3);">DELIVERY RECEIVED</div>
          <div style="font-size:0.8125rem;font-weight:600;">3 stems · All files</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Scroll indicator -->
  <div style="position:absolute;bottom:32px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;z-index:2;">
    <span style="font-size:0.71rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--t4);">Scroll</span>
    <div style="width:1px;height:32px;background:linear-gradient(to bottom, var(--uv), transparent);"></div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- TRACTION / CREDIBILITY                                      -->
<!-- ══════════════════════════════════════════════════════════ -->
<section style="padding:0;background:var(--ink);border-top:1px solid var(--hairline);border-bottom:1px solid var(--hairline);">
  <div class="container">
    <div class="stat-ticker">
      <div class="stat-cell">
        <div class="stat-num text-gradient">12K+</div>
        <div class="stat-lbl">Artists & Producers</div>
      </div>
      <div class="stat-cell">
        <div class="stat-num" style="color:var(--ok);">$2.8M+</div>
        <div class="stat-lbl">Paid to Creators</div>
      </div>
      <div class="stat-cell">
        <div class="stat-num" style="color:var(--ember);">8,400+</div>
        <div class="stat-lbl">Collaborations Done</div>
      </div>
      <div class="stat-cell">
        <div class="stat-num text-gradient">4.9★</div>
        <div class="stat-lbl">Average Rating</div>
      </div>
      <div class="stat-cell">
        <div class="stat-num" style="color:var(--arc);">96%</div>
        <div class="stat-lbl">On-Time Delivery</div>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- HOW IT WORKS — editorial sequence                           -->
<!-- ══════════════════════════════════════════════════════════ -->
<section class="section-xl" style="background:var(--void);">
  <div class="container">
    <div style="max-width:580px;margin-bottom:64px;">
      <span class="label" style="color:var(--uv-bright);margin-bottom:12px;display:block;">How It Works</span>
      <h2 style="font-size:clamp(2rem,4vw,3rem);letter-spacing:-0.03em;line-height:1.1;margin-bottom:16px;">
        From discovery<br>to <span class="text-gradient">delivery</span>
      </h2>
      <p class="body-lg">Four focused steps. One platform. Zero chaos.</p>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;background:var(--hairline);border:1px solid var(--hairline);border-radius:var(--r-xl);overflow:hidden;">
      ${[
        {
          n:'01', icon:'fas fa-search', color:'rgba(139,92,246,0.15)', ic:'var(--uv-bright)',
          title:'Discover the right artist',
          body:'Filter by genre, vibe, price, and verified status. Every profile shows real work history, real reviews, and real prices.'
        },
        {
          n:'02', icon:'fas fa-calendar-check', color:'rgba(245,158,11,0.12)', ic:'var(--ember)',
          title:'Book a feature package',
          body:'Select a package, drop your project brief, upload a reference track. Payment is held safely — you pay once, protected.'
        },
        {
          n:'03', icon:'fas fa-layer-group', color:'rgba(34,211,238,0.1)', ic:'var(--arc)',
          title:'Work inside a private workspace',
          body:'Your collaboration room is created instantly. Chat, upload stems, and track status in one secure environment.'
        },
        {
          n:'04', icon:'fas fa-check-circle', color:'rgba(16,185,129,0.12)', ic:'var(--ok)',
          title:'Approve delivery, release payment',
          body:'Files land in your stem locker. You review. You approve. Payment releases. Simple, clean, protected.'
        },
      ].map(s => `
      <div style="background:var(--surface);padding:40px 36px;">
        <div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:20px;">
          <div style="width:44px;height:44px;border-radius:var(--r-md);background:${s.color};display:flex;align-items:center;justify-content:center;font-size:1rem;color:${s.ic};flex-shrink:0;">
            <i class="${s.icon}"></i>
          </div>
          <span style="font-size:0.75rem;font-weight:700;letter-spacing:0.1em;color:var(--t4);padding-top:12px;">${s.n}</span>
        </div>
        <h3 style="font-size:1.25rem;letter-spacing:-0.02em;margin-bottom:10px;">${s.title}</h3>
        <p class="body-sm">${s.body}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- FEATURED ARTISTS                                            -->
<!-- ══════════════════════════════════════════════════════════ -->
<section class="section-lg" style="background:var(--ink);border-top:1px solid var(--hairline);">
  <div class="container">
    <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:40px;flex-wrap:wrap;gap:16px;">
      <div>
        <span class="label" style="color:var(--uv-bright);margin-bottom:10px;display:block;">Featured Artists</span>
        <h2 style="font-size:clamp(1.6rem,3vw,2.5rem);letter-spacing:-0.025em;">Top collaborators<br>on the platform</h2>
      </div>
      <a href="/explore" class="btn btn-secondary">
        View all artists <i class="fas fa-arrow-right" style="font-size:11px;"></i>
      </a>
    </div>

    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;">
      ${featured.map(u => `
      <a href="/artist/${u.id}" class="artist-card" style="display:block;text-decoration:none;">
        <div class="artist-card-cover">
          <img src="${u.coverImage}" alt="${u.artistName}">
          <div class="artist-card-cover-overlay"></div>
          <div style="position:absolute;top:12px;right:12px;display:flex;gap:5px;">
            ${u.verified ? `<span class="badge badge-uv" style="font-size:0.65rem;backdrop-filter:blur(8px);"><i class="fas fa-check" style="font-size:8px;"></i> Verified</span>` : ''}
            ${u.liveSession ? `<span class="badge badge-ok" style="font-size:0.65rem;backdrop-filter:blur(8px);"><i class="fas fa-video" style="font-size:8px;"></i></span>` : ''}
          </div>
        </div>
        <div class="artist-card-body">
          <div style="margin-top:-22px;margin-bottom:10px;">
            <img src="${u.profileImage}" class="av av-md" style="border:2px solid var(--surface);" alt="${u.artistName}">
          </div>
          <div style="font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;margin-bottom:2px;">${u.artistName}</div>
          <div style="font-size:0.75rem;color:var(--t3);margin-bottom:10px;">${u.genre.slice(0,2).join(' · ')}</div>
          <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:12px;">
            ${u.tags.slice(0,2).map(t => `<span class="chip" style="font-size:0.69rem;padding:3px 8px;">${t}</span>`).join('')}
          </div>
          <hr class="divider" style="margin:0 0 12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-size:0.69rem;color:var(--t4);margin-bottom:2px;">FROM</div>
              <div style="font-size:1rem;font-weight:800;letter-spacing:-0.02em;color:var(--uv-bright);">${formatPrice(u.startingPrice)}</div>
            </div>
            <div style="text-align:right;">
              <div class="stars">★★★★★</div>
              <div style="font-size:0.71rem;color:var(--t3);">${u.rating} · ${u.reviewCount} reviews</div>
            </div>
          </div>
        </div>
      </a>`).join('')}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- FEATURES — product-led                                      -->
<!-- ══════════════════════════════════════════════════════════ -->
<section class="section-xl" style="background:var(--void);">
  <div class="container">
    <div style="text-align:center;max-width:560px;margin:0 auto 64px;">
      <span class="label" style="color:var(--uv-bright);margin-bottom:12px;display:block;">Platform Features</span>
      <h2 style="font-size:clamp(1.8rem,3.5vw,2.75rem);letter-spacing:-0.025em;margin-bottom:14px;">
        Built to solve every<br>friction in remote collab
      </h2>
      <p class="body-lg">Every feature exists because a real artist had a real problem that messy DMs couldn't fix.</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
      ${[
        { icon:'fas fa-search', bg:'rgba(139,92,246,0.12)', ic:'var(--uv-bright)', title:'Artist Discovery', body:'Genre, location, price, availability, verified status — find the exact sound your record needs.' },
        { icon:'fas fa-shopping-cart', bg:'rgba(245,158,11,0.1)', ic:'var(--ember)', title:'Feature Marketplace', body:'Productized packages with clear pricing and delivery guarantees. Book in under 3 minutes.' },
        { icon:'fas fa-layer-group', bg:'rgba(34,211,238,0.08)', ic:'var(--arc)', title:'Private Workspaces', body:'Every booking generates a secure project room. Status, chat, files, and timeline — all in one.' },
        { icon:'fas fa-folder-open', bg:'rgba(16,185,129,0.1)', ic:'var(--ok)', title:'Stem Locker', body:'WAV, MP3, AIFF, ZIP, stems — uploaded, versioned, and private to your project participants.' },
        { icon:'fas fa-shield-check', bg:'rgba(244,63,94,0.1)', ic:'#fb7185', title:'Escrow Payments', body:'Funds held by the platform. Released only when you approve the delivery. Both sides protected.' },
        { icon:'fas fa-star', bg:'rgba(139,92,246,0.12)', ic:'var(--uv-bright)', title:'Reputation System', body:'Verified profiles, 4-category ratings, and transparent order history build real trust at scale.' },
      ].map(f => `
      <div class="feat-card">
        <div class="feat-icon-ring" style="background:${f.bg};">
          <i class="${f.icon}" style="color:${f.ic};"></i>
        </div>
        <h3 style="font-size:1.0625rem;letter-spacing:-0.01em;margin-bottom:8px;">${f.title}</h3>
        <p class="body-sm" style="line-height:1.65;">${f.body}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- PAIN / SOLUTION                                             -->
<!-- ══════════════════════════════════════════════════════════ -->
<section class="section-lg" style="background:var(--ink);border-top:1px solid var(--hairline);border-bottom:1px solid var(--hairline);">
  <div class="container">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;">
      <!-- Pain -->
      <div>
        <span class="label" style="color:var(--err);margin-bottom:16px;display:block;">Before Artist Collab</span>
        <div style="display:flex;flex-direction:column;gap:12px;">
          ${[
            'Scattered across Instagram DMs, email, and voice notes',
            'Insecure file transfers via Google Drive or WeTransfer',
            'No payment protection — friends get burned',
            'Lost stems and unclear version history',
            'No visibility into project status',
            'Zero trust between strangers collabbing online',
          ].map(p => `
          <div style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;background:rgba(244,63,94,0.05);border:1px solid rgba(244,63,94,0.12);border-radius:var(--r);">
            <i class="fas fa-times-circle" style="color:var(--err);font-size:0.875rem;margin-top:2px;flex-shrink:0;"></i>
            <span style="font-size:0.875rem;color:var(--t2);">${p}</span>
          </div>`).join('')}
        </div>
      </div>
      <!-- Solution -->
      <div>
        <span class="label" style="color:var(--ok);margin-bottom:16px;display:block;">With Artist Collab</span>
        <div style="display:flex;flex-direction:column;gap:12px;">
          ${[
            'All collaboration in one organized, private workspace',
            'Secure stem locker with version history per project',
            'Platform-held payments — you\'re protected on both sides',
            'Files organized by project, always accessible',
            'Real-time status from booking to delivery',
            'Verified profiles and a real reputation system',
          ].map(s => `
          <div style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.15);border-radius:var(--r);">
            <i class="fas fa-check-circle" style="color:var(--ok);font-size:0.875rem;margin-top:2px;flex-shrink:0;"></i>
            <span style="font-size:0.875rem;color:var(--t2);">${s}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- MARKETPLACE PREVIEW                                         -->
<!-- ══════════════════════════════════════════════════════════ -->
<section class="section-xl" style="background:var(--void);">
  <div class="container">
    <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:40px;flex-wrap:wrap;gap:16px;">
      <div>
        <span class="label" style="color:var(--uv-bright);margin-bottom:10px;display:block;">Marketplace Preview</span>
        <h2 style="font-size:clamp(1.6rem,3vw,2.5rem);letter-spacing:-0.025em;">Top features<br>available now</h2>
      </div>
      <a href="/marketplace" class="btn btn-secondary">Browse marketplace <i class="fas fa-arrow-right" style="font-size:11px;"></i></a>
    </div>

    <div style="display:flex;flex-direction:column;gap:12px;">
      ${listings.slice(0,3).map(l => {
        const artist = users.find(u => u.id === l.userId)!;
        return `
      <a href="/listing/${l.id}" style="display:block;text-decoration:none;" onmouseover="this.querySelector('.lst-inner').style.borderColor='rgba(139,92,246,0.3)';this.querySelector('.lst-inner').style.background='var(--raised)'" onmouseout="this.querySelector('.lst-inner').style.borderColor='var(--hairline)';this.querySelector('.lst-inner').style.background='var(--surface)'">
        <div class="lst-inner" style="padding:20px 24px;background:var(--surface);border:1px solid var(--hairline);border-radius:var(--r-lg);display:flex;gap:18px;align-items:center;flex-wrap:wrap;transition:all 0.18s;">
          <img src="${artist.profileImage}" class="av av-md" style="border:1.5px solid var(--hairline);" alt="${artist.artistName}">
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap;">
              <span style="font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;">${l.title}</span>
              ${artist.verified ? `<span class="badge badge-uv" style="font-size:0.65rem;">✓ Verified</span>` : ''}
              <span class="badge badge-muted" style="font-size:0.65rem;">${l.category}</span>
            </div>
            <div style="font-size:0.8125rem;color:var(--t3);margin-bottom:6px;">by ${artist.artistName} · ${artist.genre[0]}</div>
            <p style="font-size:0.8125rem;color:var(--t3);display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;">${l.description}</p>
          </div>
          <div style="display:flex;align-items:center;gap:24px;flex-shrink:0;flex-wrap:wrap;">
            <div style="text-align:right;">
              <div style="font-size:0.69rem;color:var(--t4);letter-spacing:0.06em;text-transform:uppercase;">From</div>
              <div style="font-size:1.375rem;font-weight:800;letter-spacing:-0.025em;color:var(--uv-bright);">${formatPrice(l.packages[0].price)}</div>
            </div>
            <div style="text-align:right;">
              <div class="stars" style="font-size:0.75rem;">★★★★★</div>
              <div style="font-size:0.71rem;color:var(--t3);">${l.rating} · ${l.orders} orders</div>
            </div>
            <span class="btn btn-primary btn-sm">Book Now</span>
          </div>
        </div>
      </a>`;
      }).join('')}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- TESTIMONIALS                                                -->
<!-- ══════════════════════════════════════════════════════════ -->
<section class="section-lg" style="background:var(--ink);border-top:1px solid var(--hairline);">
  <div class="container">
    <div style="text-align:center;margin-bottom:48px;">
      <span class="label" style="color:var(--uv-bright);margin-bottom:12px;display:block;">Artist Reviews</span>
      <h2 style="font-size:clamp(1.6rem,3vw,2.5rem);letter-spacing:-0.025em;">What artists say</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
      ${[
        { q:'I booked 3 features through Artist Collab. The workspace keeps everything organized and payment protection is exactly what we needed. Nothing hits different than a smooth collab.', name:'Marcus T.', role:'Independent Rapper · Atlanta', img:'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=80&h=80&fit=crop&crop=face' },
        { q:'As a producer I was tired of artists ghosting me after sending beats. The escrow system fixed that completely. I\'ve made over $12K in 4 months. This platform is different.', name:'DJ Wavez', role:'Producer · Los Angeles', img:'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=80&h=80&fit=crop&crop=face' },
        { q:'The workspace is everything. Stems, messages, and files in one place instead of scattered across my email and DMs. Artist Collab changed how I approach remote work entirely.', name:'Aria S.', role:'Singer/Songwriter · NYC', img:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face' },
      ].map(t => `
      <div class="quote-card">
        <div class="stars" style="font-size:0.8125rem;margin-bottom:14px;">★★★★★</div>
        <p style="font-size:0.9375rem;color:var(--t2);line-height:1.75;margin-bottom:20px;font-style:italic;">"${t.q}"</p>
        <div style="display:flex;align-items:center;gap:10px;padding-top:16px;border-top:1px solid var(--hairline);">
          <img src="${t.img}" class="av av-sm" style="border:1.5px solid var(--hairline);" alt="${t.name}">
          <div>
            <div style="font-size:0.8125rem;font-weight:700;">${t.name}</div>
            <div style="font-size:0.75rem;color:var(--t3);">${t.role}</div>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- CLOSING CTA                                                 -->
<!-- ══════════════════════════════════════════════════════════ -->
<section class="cta-section" style="background:var(--void);border-top:1px solid var(--hairline);">
  <div class="container" style="max-width:760px;margin:0 auto;text-align:center;">
    <!-- Waveform decorative -->
    <div style="display:flex;justify-content:center;align-items:center;gap:3px;height:32px;margin-bottom:32px;opacity:0.5;">
      ${Array.from({length:32}, (_,i) => {
        const h = Math.sin(i * 0.6) * 50 + 55;
        const delay = i * 0.05;
        return `<div style="width:3px;border-radius:2px;background:linear-gradient(to top,var(--uv),var(--uv-bright));animation:waveform ${0.8 + Math.random()*0.6}s ease-in-out ${delay}s infinite alternate;transform-origin:bottom;" class="wave-bar" style="height:${h}%"></div>`;
      }).join('')}
    </div>

    <h2 style="font-size:clamp(2rem,5vw,3.75rem);letter-spacing:-0.03em;line-height:1.05;margin-bottom:18px;">
      Build your next record<br>
      <span class="text-gradient">without the chaos</span>
    </h2>
    <p class="body-lg" style="max-width:480px;margin:0 auto 40px;">
      Join thousands of independent artists already booking features, sharing stems, and getting paid on Artist Collab.
    </p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:20px;">
      <a href="/signup" class="btn btn-primary btn-xl">
        <i class="fas fa-microphone-alt" style="font-size:14px;"></i>
        Join Artist Collab — Free
      </a>
      <a href="/explore" class="btn btn-outline btn-xl">
        <i class="fas fa-headphones" style="font-size:14px;"></i>
        Explore Artists
      </a>
    </div>
    <p style="font-size:0.8125rem;color:var(--t4);">No credit card required · Start discovering in minutes</p>
  </div>
</section>

` + siteFooter() + closeShell();
}
