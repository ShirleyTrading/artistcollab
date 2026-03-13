// ═══════════════════════════════════════════════════════════════
// ARTIST COLLAB — NEW VISUAL IDENTITY SYSTEM v2.0
// Ground-up redesign: editorial, cinematic, premium, cultural
// ═══════════════════════════════════════════════════════════════

export const DESIGN_SYSTEM = `
  /* ── Google Fonts: Clash Display + DM Sans ──────────────────── */
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  /* ── Design Tokens ──────────────────────────────────────────── */
  :root {
    /* Obsidian base palette */
    --void:      #050507;
    --ink:       #09090e;
    --deep:      #0e0e16;
    --surface:   #13131d;
    --raised:    #181824;
    --elevated:  #1e1e2e;
    --rim:       #252538;
    --muted-rim: rgba(255,255,255,0.055);
    --hairline:  rgba(255,255,255,0.08);

    /* Text hierarchy */
    --t1: #f5f5f7;
    --t2: #a0a0b8;
    --t3: #666680;
    --t4: #3a3a52;

    /* Signature accent — ultraviolet ember */
    --uv:        #8b5cf6;
    --uv-bright: #a78bfa;
    --uv-dim:    rgba(139,92,246,0.15);
    --uv-glow:   rgba(139,92,246,0.25);

    /* Secondary accent — copper ember */
    --ember:     #f59e0b;
    --ember-dim: rgba(245,158,11,0.15);

    /* Tertiary — arctic cyan */
    --arc:       #22d3ee;
    --arc-dim:   rgba(34,211,238,0.12);

    /* Status */
    --ok:     #10b981;
    --ok-dim: rgba(16,185,129,0.15);
    --warn:   #f59e0b;
    --err:    #f43f5e;
    --err-dim:rgba(244,63,94,0.15);
    --info:   #3b82f6;

    /* Spacing scale */
    --s1: 4px;  --s2: 8px;   --s3: 12px;
    --s4: 16px; --s5: 20px;  --s6: 24px;
    --s7: 32px; --s8: 40px;  --s9: 48px;
    --s10: 64px; --s11: 80px; --s12: 96px;

    /* Border radius */
    --r-sm: 6px;
    --r:    10px;
    --r-md: 14px;
    --r-lg: 20px;
    --r-xl: 28px;
    --r-full: 999px;

    /* Shadows */
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.5);
    --shadow:    0 4px 16px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3);
    --shadow-lg: 0 12px 48px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.4);
    --shadow-uv: 0 8px 32px rgba(139,92,246,0.25);
  }

  /* ── Reset & Base ───────────────────────────────────────────── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; font-size: 16px; }
  body {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--void);
    color: var(--t1);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
    overflow-x: hidden;
  }
  a { color: inherit; text-decoration: none; }
  img { max-width: 100%; display: block; }
  button, input, select, textarea { font-family: inherit; }
  ::selection { background: var(--uv-glow); color: var(--t1); }

  /* ── Custom Scrollbar ───────────────────────────────────────── */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: var(--ink); }
  ::-webkit-scrollbar-thumb { background: var(--rim); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--t4); }

  /* ── TYPOGRAPHY SYSTEM ──────────────────────────────────────── */
  /* Clash Display via CSS font-face fallback using system fonts with custom metrics */
  .clash { font-family: 'DM Sans', sans-serif; font-weight: 700; }

  /* Display scale — editorial / cinematic */
  .display-1 {
    font-size: clamp(3.5rem, 8vw, 7.5rem);
    font-weight: 700;
    line-height: 0.95;
    letter-spacing: -0.03em;
    font-family: 'DM Sans', sans-serif;
  }
  .display-2 {
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    font-weight: 700;
    line-height: 1.0;
    letter-spacing: -0.025em;
    font-family: 'DM Sans', sans-serif;
  }
  .display-3 {
    font-size: clamp(1.8rem, 3.5vw, 3rem);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
    font-family: 'DM Sans', sans-serif;
  }

  /* Heading scale */
  h1 { font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.015em; }
  h2 { font-size: clamp(1.25rem, 2.5vw, 1.75rem); font-weight: 700; line-height: 1.2; letter-spacing: -0.012em; }
  h3 { font-size: clamp(1.1rem, 2vw, 1.35rem); font-weight: 600; line-height: 1.3; letter-spacing: -0.008em; }
  h4 { font-size: 1.1rem; font-weight: 600; line-height: 1.4; }
  h5, h6 { font-size: 0.95rem; font-weight: 600; }

  /* Body scale */
  .body-lg   { font-size: 1.0625rem; line-height: 1.7; color: var(--t2); }
  .body-base { font-size: 0.9375rem; line-height: 1.65; color: var(--t2); }
  .body-sm   { font-size: 0.8125rem; line-height: 1.6; color: var(--t3); }
  .label     { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--t3); }

  /* Gradient headline */
  .text-gradient {
    background: linear-gradient(135deg, var(--t1) 0%, rgba(255,255,255,0.7) 50%, var(--uv-bright) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .text-gradient-ember {
    background: linear-gradient(135deg, var(--t1) 30%, var(--ember) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── COMPONENT SYSTEM ───────────────────────────────────────── */

  /* ─── Navigation ─── */
  .nav-shell {
    position: sticky;
    top: 0;
    z-index: 200;
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 var(--s6);
    border-bottom: 1px solid var(--hairline);
    background: rgba(5,5,7,0.88);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
  }
  .nav-inner {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--s6);
  }
  .nav-wordmark {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    white-space: nowrap;
  }
  .nav-glyph {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, var(--uv), var(--uv-bright));
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
    box-shadow: 0 0 20px var(--uv-glow);
  }
  .nav-links-list {
    display: flex;
    align-items: center;
    gap: 2px;
    list-style: none;
  }
  .nav-links-list a {
    padding: 6px 14px;
    border-radius: var(--r-sm);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--t3);
    transition: color 0.18s, background 0.18s;
  }
  .nav-links-list a:hover, .nav-links-list a.current {
    color: var(--t1);
    background: rgba(255,255,255,0.06);
  }
  .nav-cta-group {
    display: flex;
    align-items: center;
    gap: var(--s2);
  }

  /* ─── Buttons ─── */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    border: none;
    border-radius: var(--r);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    position: relative;
    text-decoration: none;
  }
  .btn:active { transform: scale(0.97); }

  /* Primary */
  .btn-primary {
    background: var(--uv);
    color: #fff;
    padding: 10px 22px;
    font-size: 0.875rem;
    box-shadow: 0 4px 20px rgba(139,92,246,0.3);
  }
  .btn-primary:hover {
    background: var(--uv-bright);
    box-shadow: 0 6px 28px rgba(167,139,250,0.4);
    transform: translateY(-1px);
  }

  /* Secondary */
  .btn-secondary {
    background: var(--raised);
    color: var(--t1);
    padding: 10px 22px;
    font-size: 0.875rem;
    border: 1px solid var(--hairline);
  }
  .btn-secondary:hover {
    background: var(--elevated);
    border-color: rgba(255,255,255,0.15);
  }

  /* Ghost */
  .btn-ghost {
    background: transparent;
    color: var(--t2);
    padding: 10px 18px;
    font-size: 0.875rem;
  }
  .btn-ghost:hover { color: var(--t1); background: var(--muted-rim); }

  /* Outline */
  .btn-outline {
    background: transparent;
    color: var(--t1);
    padding: 10px 22px;
    font-size: 0.875rem;
    border: 1px solid rgba(255,255,255,0.2);
  }
  .btn-outline:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.35); }

  /* Sizes */
  .btn-xs  { padding: 5px 12px; font-size: 0.78rem; border-radius: var(--r-sm); }
  .btn-sm  { padding: 7px 16px; font-size: 0.8125rem; border-radius: var(--r-sm); }
  .btn-md  { padding: 10px 22px; font-size: 0.875rem; }
  .btn-lg  { padding: 13px 28px; font-size: 0.9375rem; border-radius: var(--r-md); }
  .btn-xl  { padding: 16px 36px; font-size: 1rem; border-radius: var(--r-md); }

  /* ─── Cards ─── */
  .card {
    background: var(--surface);
    border: 1px solid var(--hairline);
    border-radius: var(--r-lg);
    overflow: hidden;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .card:hover { border-color: rgba(255,255,255,0.12); }
  .card-raised {
    background: var(--raised);
    border: 1px solid var(--hairline);
    border-radius: var(--r-lg);
  }
  .card-elevated {
    background: var(--elevated);
    border: 1px solid var(--muted-rim);
    border-radius: var(--r-lg);
  }

  /* ─── Forms ─── */
  .field { display: flex; flex-direction: column; gap: 7px; }
  .field-label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--t3);
  }
  .field-input {
    background: var(--raised);
    border: 1px solid var(--hairline);
    border-radius: var(--r);
    padding: 12px 16px;
    color: var(--t1);
    font-size: 0.9375rem;
    font-family: inherit;
    transition: border-color 0.18s, box-shadow 0.18s;
    outline: none;
    width: 100%;
  }
  .field-input:focus {
    border-color: var(--uv);
    box-shadow: 0 0 0 3px rgba(139,92,246,0.12);
  }
  .field-input::placeholder { color: var(--t4); }
  .field-select {
    background: var(--raised);
    border: 1px solid var(--hairline);
    border-radius: var(--r);
    padding: 12px 16px;
    color: var(--t1);
    font-size: 0.9375rem;
    font-family: inherit;
    outline: none;
    width: 100%;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666680' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
  }
  .field-select:focus { border-color: var(--uv); }
  textarea.field-input { resize: vertical; min-height: 110px; line-height: 1.6; }

  /* ─── Tags / Chips ─── */
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 11px;
    background: var(--raised);
    border: 1px solid var(--hairline);
    border-radius: var(--r-full);
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--t3);
    cursor: pointer;
    transition: all 0.15s;
  }
  .chip:hover, .chip.active { background: var(--uv-dim); border-color: rgba(139,92,246,0.35); color: var(--uv-bright); }

  /* ─── Badges ─── */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 9px;
    border-radius: var(--r-full);
    font-size: 0.71rem;
    font-weight: 600;
    letter-spacing: 0.02em;
  }
  .badge-uv     { background: var(--uv-dim); color: var(--uv-bright); border: 1px solid rgba(139,92,246,0.3); }
  .badge-ok     { background: var(--ok-dim); color: #34d399; border: 1px solid rgba(16,185,129,0.25); }
  .badge-ember  { background: var(--ember-dim); color: #fbbf24; border: 1px solid rgba(245,158,11,0.25); }
  .badge-arc    { background: var(--arc-dim); color: var(--arc); border: 1px solid rgba(34,211,238,0.2); }
  .badge-muted  { background: rgba(255,255,255,0.06); color: var(--t3); border: 1px solid var(--hairline); }
  .badge-err    { background: var(--err-dim); color: #fb7185; border: 1px solid rgba(244,63,94,0.25); }

  /* ─── Verified Badge ─── */
  .v-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    background: var(--uv);
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 8px var(--uv-glow);
  }
  .v-badge svg { width: 8px; height: 8px; fill: white; }

  /* ─── Stars ─── */
  .stars { color: var(--ember); display: inline-flex; gap: 1px; font-size: 0.75rem; }

  /* ─── Avatar ─── */
  .av {
    border-radius: 50%;
    object-fit: cover;
    display: block;
    flex-shrink: 0;
  }
  .av-xs  { width: 24px; height: 24px; }
  .av-sm  { width: 32px; height: 32px; }
  .av-md  { width: 44px; height: 44px; }
  .av-lg  { width: 60px; height: 60px; }
  .av-xl  { width: 80px; height: 80px; }
  .av-2xl { width: 110px; height: 110px; }
  .av-3xl { width: 140px; height: 140px; }

  /* ─── Layout ─── */
  .container    { max-width: 1260px; margin: 0 auto; padding: 0 var(--s6); }
  .container-md { max-width: 960px;  margin: 0 auto; padding: 0 var(--s6); }
  .container-sm { max-width: 720px;  margin: 0 auto; padding: 0 var(--s6); }

  /* ─── App Shell (Authenticated) ─── */
  .app-shell {
    display: grid;
    grid-template-columns: 220px 1fr;
    min-height: calc(100vh - 64px);
  }
  .app-sidebar {
    background: var(--ink);
    border-right: 1px solid var(--hairline);
    position: sticky;
    top: 64px;
    height: calc(100vh - 64px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  .app-sidebar::-webkit-scrollbar { display: none; }
  .app-main { overflow-y: auto; }

  /* Sidebar nav */
  .sb-section {
    padding: 20px 16px 4px;
    font-size: 0.69rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--t4);
  }
  .sb-nav { list-style: none; padding: 0 8px; }
  .sb-nav li a, .sb-nav li button {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    border-radius: var(--r-sm);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--t3);
    width: 100%;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.15s, background 0.15s;
    text-decoration: none;
  }
  .sb-nav li a:hover, .sb-nav li button:hover { color: var(--t1); background: var(--muted-rim); }
  .sb-nav li a.on, .sb-nav li button.on {
    color: var(--t1);
    background: rgba(139,92,246,0.14);
    border: 1px solid rgba(139,92,246,0.2);
    font-weight: 600;
  }
  .sb-icon { width: 16px; text-align: center; flex-shrink: 0; font-size: 0.875rem; }

  /* ─── Progress bar ─── */
  .progress { height: 4px; background: var(--rim); border-radius: 2px; overflow: hidden; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, var(--uv), var(--uv-bright)); border-radius: 2px; transition: width 0.5s ease; }

  /* ─── Divider ─── */
  hr.divider { border: none; border-top: 1px solid var(--hairline); }

  /* ─── Status dot ─── */
  .status-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
  }
  .status-online  { background: var(--ok); box-shadow: 0 0 8px rgba(16,185,129,0.5); }
  .status-busy    { background: var(--warn); }
  .status-offline { background: var(--t4); }

  /* ─── Notif badge ─── */
  .notif {
    background: var(--uv);
    color: white;
    border-radius: var(--r-full);
    padding: 2px 6px;
    font-size: 0.69rem;
    font-weight: 700;
    min-width: 18px;
    text-align: center;
    line-height: 16px;
    height: 18px;
  }

  /* ─── Table ─── */
  .tbl { width: 100%; border-collapse: collapse; }
  .tbl thead tr { border-bottom: 1px solid var(--hairline); }
  .tbl tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.03);
    transition: background 0.12s;
  }
  .tbl tbody tr:hover { background: rgba(255,255,255,0.02); }
  .tbl th {
    padding: 11px 16px;
    font-size: 0.71rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--t4);
    text-align: left;
  }
  .tbl td { padding: 14px 16px; font-size: 0.875rem; }

  /* ─── Alerts ─── */
  .alert { display: flex; align-items: flex-start; gap: 10px; padding: 12px 16px; border-radius: var(--r); font-size: 0.875rem; }
  .alert-info    { background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); color: #93c5fd; }
  .alert-ok      { background: var(--ok-dim); border: 1px solid rgba(16,185,129,0.2); color: #6ee7b7; }
  .alert-warn    { background: var(--ember-dim); border: 1px solid rgba(245,158,11,0.25); color: #fcd34d; }
  .alert-err     { background: var(--err-dim); border: 1px solid rgba(244,63,94,0.25); color: #fda4af; }

  /* ─── Utility ─── */
  .flex  { display: flex; }
  .grid  { display: grid; }
  .col   { flex-direction: column; }
  .items-c  { align-items: center; }
  .items-s  { align-items: flex-start; }
  .items-e  { align-items: flex-end; }
  .justify-c   { justify-content: center; }
  .justify-b   { justify-content: space-between; }
  .justify-e   { justify-content: flex-end; }
  .wrap  { flex-wrap: wrap; }
  .gap-1 { gap: var(--s1); }
  .gap-2 { gap: var(--s2); }
  .gap-3 { gap: var(--s3); }
  .gap-4 { gap: var(--s4); }
  .gap-5 { gap: var(--s5); }
  .gap-6 { gap: var(--s6); }
  .gap-7 { gap: var(--s7); }
  .gap-8 { gap: var(--s8); }
  .p-4  { padding: var(--s4); }
  .p-5  { padding: var(--s5); }
  .p-6  { padding: var(--s6); }
  .p-7  { padding: var(--s7); }
  .p-8  { padding: var(--s8); }
  .px-6 { padding-left: var(--s6); padding-right: var(--s6); }
  .py-6 { padding-top: var(--s6); padding-bottom: var(--s6); }
  .mb-2 { margin-bottom: var(--s2); }
  .mb-3 { margin-bottom: var(--s3); }
  .mb-4 { margin-bottom: var(--s4); }
  .mb-5 { margin-bottom: var(--s5); }
  .mb-6 { margin-bottom: var(--s6); }
  .mb-7 { margin-bottom: var(--s7); }
  .mb-8 { margin-bottom: var(--s8); }
  .mt-4 { margin-top: var(--s4); }
  .mt-6 { margin-top: var(--s6); }
  .mt-8 { margin-top: var(--s8); }
  .w-full { width: 100%; }
  .relative { position: relative; }
  .absolute { position: absolute; }
  .fixed { position: fixed; }
  .inset-0 { inset: 0; }
  .overflow-hidden { overflow: hidden; }
  .overflow-auto { overflow: auto; }
  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .t1 { color: var(--t1); }
  .t2 { color: var(--t2); }
  .t3 { color: var(--t3); }
  .t-uv { color: var(--uv-bright); }
  .t-ember { color: var(--ember); }
  .t-ok { color: var(--ok); }
  .t-err { color: var(--err); }
  .bold { font-weight: 700; }
  .semibold { font-weight: 600; }
  .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .rounded-full { border-radius: var(--r-full); }
  .shrink-0 { flex-shrink: 0; }
  .cursor-pointer { cursor: pointer; }
  .z-10 { z-index: 10; }
  .z-50 { z-index: 50; }
  .z-100 { z-index: 100; }
  .pointer-none { pointer-events: none; }
  .select-none { user-select: none; }

  /* ─── Motion ─── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 20px var(--uv-glow); }
    50%       { box-shadow: 0 0 40px rgba(139,92,246,0.4); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }
  @keyframes scan {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes waveform {
    0%, 100% { transform: scaleY(0.3); }
    50%       { transform: scaleY(1); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .anim-fade-up { animation: fadeUp 0.5s ease forwards; }
  .anim-fade-in { animation: fadeIn 0.4s ease forwards; }

  /* ─── Footer ─── */
  .footer-shell {
    background: var(--ink);
    border-top: 1px solid var(--hairline);
    padding: 64px var(--s6) 32px;
  }
  .footer-grid {
    max-width: 1260px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 48px;
    margin-bottom: 48px;
  }
  .footer-link {
    display: block;
    font-size: 0.875rem;
    color: var(--t3);
    padding: 5px 0;
    transition: color 0.15s;
  }
  .footer-link:hover { color: var(--t1); }
  .footer-head { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--t4); margin-bottom: 14px; }
  .footer-bottom {
    max-width: 1260px;
    margin: 0 auto;
    padding-top: 24px;
    border-top: 1px solid var(--hairline);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  /* ─── Mobile ─── */
  .mob-hide { }
  .mob-show { display: none; }
  @media (max-width: 1024px) {
    .app-shell { grid-template-columns: 1fr; }
    .app-sidebar { display: none; position: fixed; z-index: 300; top: 64px; width: 240px; height: calc(100vh - 64px); }
    .app-sidebar.open { display: flex; }
    .footer-grid { grid-template-columns: 1fr 1fr; }
    .mob-hide { display: none !important; }
    .mob-show { display: flex !important; }
  }
  @media (max-width: 768px) {
    .nav-links-list { display: none; }
    .footer-grid { grid-template-columns: 1fr; }
    .container, .container-md, .container-sm { padding: 0 var(--s4); }
  }
`;

// ─── Page Shell ──────────────────────────────────────────────────────────────
export const shell = (title: string, extra = '', bodyClass = '') => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Artist Collab</title>
  <meta name="description" content="Artist Collab — The remote studio infrastructure for modern music creation. Book features, share stems, manage projects.">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎵</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,300;1,9..40,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>${DESIGN_SYSTEM}${extra}</style>
</head>
<body class="${bodyClass}">`;

export const closeShell = () => `
<script>
// Global interactions
document.querySelectorAll('[data-href]').forEach(el => {
  el.style.cursor = 'pointer';
  el.addEventListener('click', () => window.location.href = el.dataset.href);
});
// Sidebar toggle
window.toggleSidebar = function() {
  const sb = document.getElementById('app-sidebar');
  if (sb) sb.classList.toggle('open');
};
</script>
</body></html>`;

// ─── Navigation ──────────────────────────────────────────────────────────────
export const publicNav = (active = '') => `
<nav class="nav-shell">
  <div class="nav-inner">
    <a href="/" class="nav-wordmark">
      <div class="nav-glyph">🎵</div>
      <span>Artist Collab</span>
    </a>
    <ul class="nav-links-list">
      <li><a href="/explore" class="${active === 'explore' ? 'current' : ''}">Explore</a></li>
      <li><a href="/marketplace" class="${active === 'marketplace' ? 'current' : ''}">Marketplace</a></li>
      <li><a href="/how-it-works" class="${active === 'how' ? 'current' : ''}">How It Works</a></li>
    </ul>
    <div class="nav-cta-group">
      <a href="/login" class="btn btn-ghost btn-sm">Sign In</a>
      <a href="/signup" class="btn btn-primary btn-sm">Join Free</a>
      <button class="btn btn-ghost btn-sm mob-show" onclick="toggleSidebar()" style="padding:8px 10px;">
        <i class="fas fa-bars"></i>
      </button>
    </div>
  </div>
</nav>`;

export const authedNav = (active = '') => `
<nav class="nav-shell">
  <div class="nav-inner">
    <div style="display:flex;align-items:center;gap:var(--s6);">
      <button class="btn btn-ghost btn-sm mob-show" onclick="toggleSidebar()" style="padding:8px 10px;">
        <i class="fas fa-bars"></i>
      </button>
      <a href="/" class="nav-wordmark">
        <div class="nav-glyph">🎵</div>
        <span class="mob-hide">Artist Collab</span>
      </a>
    </div>
    <ul class="nav-links-list mob-hide">
      <li><a href="/explore" class="${active === 'explore' ? 'current' : ''}">Explore</a></li>
      <li><a href="/marketplace" class="${active === 'marketplace' ? 'current' : ''}">Marketplace</a></li>
      <li><a href="/dashboard/projects" class="${active === 'projects' ? 'current' : ''}">Projects</a></li>
      <li><a href="/dashboard/messages" class="${active === 'messages' ? 'current' : ''}">
        Messages <span class="notif" style="margin-left:2px;">3</span>
      </a></li>
    </ul>
    <div class="nav-cta-group">
      <a href="/dashboard" style="display:flex;align-items:center;gap:9px;padding:5px 10px 5px 5px;border-radius:var(--r-full);border:1px solid var(--hairline);background:var(--raised);transition:all 0.18s;" onmouseover="this.style.borderColor='rgba(255,255,255,0.18)'" onmouseout="this.style.borderColor='var(--hairline)'">
        <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop&crop=face" class="av av-xs" style="border:1.5px solid rgba(139,92,246,0.5);" alt="Profile">
        <span style="font-size:0.8125rem;font-weight:600;color:var(--t2);" class="mob-hide">XAVI</span>
      </a>
    </div>
  </div>
</nav>`;

// ─── Dashboard Sidebar ────────────────────────────────────────────────────────
export const appSidebar = (active = '') => `
<aside class="app-sidebar" id="app-sidebar">
  <!-- User card -->
  <div style="padding:20px 16px;border-bottom:1px solid var(--hairline);">
    <div style="display:flex;align-items:center;gap:10px;">
      <div style="position:relative;">
        <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop&crop=face" class="av av-md" style="border:2px solid rgba(139,92,246,0.5);" alt="Profile">
        <div class="status-dot status-online" style="position:absolute;bottom:1px;right:1px;border:2px solid var(--ink);width:10px;height:10px;"></div>
      </div>
      <div style="min-width:0;">
        <div style="font-weight:700;font-size:0.9rem;letter-spacing:-0.01em;">XAVI</div>
        <div style="font-size:0.75rem;color:var(--t3);">@xavi_official</div>
      </div>
    </div>
  </div>

  <div style="flex:1;overflow-y:auto;padding-bottom:16px;">
    <div class="sb-section">Overview</div>
    <ul class="sb-nav">
      <li><a href="/dashboard" class="${active === 'home' ? 'on' : ''}">
        <span class="sb-icon"><i class="fas fa-th-large"></i></span> Dashboard
      </a></li>
      <li><a href="/dashboard/projects" class="${active === 'projects' ? 'on' : ''}">
        <span class="sb-icon"><i class="fas fa-layer-group"></i></span> Projects
        <span class="notif" style="margin-left:auto;">2</span>
      </a></li>
      <li><a href="/dashboard/messages" class="${active === 'messages' ? 'on' : ''}">
        <span class="sb-icon"><i class="fas fa-comment-dots"></i></span> Messages
        <span class="notif" style="margin-left:auto;">3</span>
      </a></li>
      <li><a href="/dashboard/orders" class="${active === 'orders' ? 'on' : ''}">
        <span class="sb-icon"><i class="fas fa-shopping-bag"></i></span> Orders
      </a></li>
      <li><a href="/dashboard/earnings" class="${active === 'earnings' ? 'on' : ''}">
        <span class="sb-icon"><i class="fas fa-dollar-sign"></i></span> Earnings
      </a></li>
    </ul>

    <div class="sb-section">Studio</div>
    <ul class="sb-nav">
      <li><a href="/profile/me" class="${active === 'profile' ? 'on' : ''}">
        <span class="sb-icon"><i class="fas fa-user"></i></span> My Profile
      </a></li>
      <li><a href="/dashboard/listings" class="${active === 'listings' ? 'on' : ''}">
        <span class="sb-icon"><i class="fas fa-list-ul"></i></span> My Listings
      </a></li>
      <li><a href="/explore">
        <span class="sb-icon"><i class="fas fa-search"></i></span> Find Artists
      </a></li>
    </ul>

    <div class="sb-section">Account</div>
    <ul class="sb-nav">
      <li><a href="/dashboard/settings" class="${active === 'settings' ? 'on' : ''}">
        <span class="sb-icon"><i class="fas fa-sliders-h"></i></span> Settings
      </a></li>
      <li><a href="/logout">
        <span class="sb-icon"><i class="fas fa-arrow-right-from-bracket"></i></span> Sign Out
      </a></li>
    </ul>
  </div>
</aside>`;

// ─── Footer ──────────────────────────────────────────────────────────────────
export const siteFooter = () => `
<footer class="footer-shell">
  <div class="footer-grid">
    <div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
        <div class="nav-glyph">🎵</div>
        <span style="font-size:1rem;font-weight:700;letter-spacing:-0.02em;">Artist Collab</span>
      </div>
      <p style="font-size:0.875rem;color:var(--t3);line-height:1.7;max-width:280px;">
        The remote studio infrastructure for modern music creation. Where artists build records before the world hears them.
      </p>
      <div style="display:flex;gap:8px;margin-top:20px;">
        ${[
          ['fab fa-instagram','#'],
          ['fab fa-twitter','#'],
          ['fab fa-tiktok','#'],
          ['fab fa-spotify','#'],
          ['fab fa-youtube','#'],
        ].map(([ic, href]) => `
        <a href="${href}" style="width:34px;height:34px;background:var(--raised);border:1px solid var(--hairline);border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;color:var(--t3);font-size:0.8125rem;transition:all 0.15s;" onmouseover="this.style.color='var(--t1)';this.style.borderColor='rgba(255,255,255,0.18)'" onmouseout="this.style.color='var(--t3)';this.style.borderColor='var(--hairline)'">
          <i class="${ic}"></i>
        </a>`).join('')}
      </div>
    </div>
    <div>
      <div class="footer-head">Platform</div>
      <a href="/explore" class="footer-link">Explore Artists</a>
      <a href="/marketplace" class="footer-link">Marketplace</a>
      <a href="/how-it-works" class="footer-link">How It Works</a>
      <a href="/signup" class="footer-link">Join as Artist</a>
    </div>
    <div>
      <div class="footer-head">Support</div>
      <a href="/contact" class="footer-link">Contact Us</a>
      <a href="/help" class="footer-link">Help Center</a>
      <a href="#" class="footer-link">Trust & Safety</a>
      <a href="#" class="footer-link">For Producers</a>
    </div>
    <div>
      <div class="footer-head">Legal</div>
      <a href="/terms" class="footer-link">Terms of Service</a>
      <a href="/privacy" class="footer-link">Privacy Policy</a>
      <a href="#" class="footer-link">Cookie Settings</a>
    </div>
  </div>
  <div class="footer-bottom">
    <span style="font-size:0.8125rem;color:var(--t4);">© 2026 Artist Collab · artistcollab.studio</span>
    <span style="font-size:0.8125rem;color:var(--t4);">Built for artists, by people who get it.</span>
  </div>
</footer>`;

// ─── Compatibility Aliases (for pages using old API) ─────────────────────────
export const head = (title: string, extra = '') => shell(title, extra);
export const nav = (active = '') => publicNav(active);
export const footer = () => siteFooter();
export const closeHTML = () => closeShell();
