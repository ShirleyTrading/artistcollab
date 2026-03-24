// ═══════════════════════════════════════════════════════════════════════════════
// ARTIST COLLAB — AC/1 DESIGN SYSTEM
// Creative Direction: "The Session"
//
// Brand DNA:
//   Artist Collab is late-night studio infrastructure. It lives in the space
//   between the click track and the first verse — the moment before the music
//   happens. The interface should feel like proprietary creative software:
//   considered, intentional, slightly industrial, never decorative for its own
//   sake. Every visual decision serves the act of making music together.
//
// Recurring Visual Motifs:
//   — SIGNAL PATHS: Thin horizontal lines that carry data (like patch cables)
//   — TRACK LANES: Stacked horizontal bands, referencing DAW track layouts
//   — ROUTING NODES: Small filled circles at connection points
//   — LEVEL METERS: Vertical bar clusters used as decorative texture
//   — SESSION TAPE: Diagonal hatching used in empty states and dividers
//   — IDENTITY MARKS: Artist identity expressed through color-coded left-border
//     accents on cards, like hardware channel strips
//   — WAVEFORM SPINE: SVG waveform used as a structural divider / hero element
//
// Typography:
//   — Headlines: "Syne" — angular, industrial, wide-tracked at large sizes
//     The font of choice for creative software and music tools
//   — Body: "Inter" — neutral, legible, workmanlike at small sizes
//   — Mono: "JetBrains Mono" — BPM, file sizes, IDs, technical data
//
// Color System:
//   — Base: True obsidian — near-black with a blue-black bias (not warm gray)
//   — Signal: #C8FF00 — electric chartreuse. The "armed" track color in every
//     major DAW. One sharp, focused note of color. Used sparingly on CTAs only.
//   — Channel: #FF4D6D — hot pink/red for live/active states. Like a VU meter
//     in the red. Error, live, urgent.
//   — Patch: #00C2FF — electric cyan. Patch cable color. Info, links, routing.
//   — Warm: #FF8C42 — copper/amber. The tungsten light of a late-night session.
//   — Text: Strict four-level hierarchy, no blending with accents.
//
// Spacing:
//   — Based on an 8px grid. All spacers are multiples of 8.
//   — Track height unit: 48px (standard DAW track height)
//   — Panel gutter: 20px
//
// ═══════════════════════════════════════════════════════════════════════════════

export const AC_SYSTEM = `
  /* ── Font Loading ──────────────────────────────────────────────────────── */
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

  /* ── Design Tokens ─────────────────────────────────────────────────────── */
  :root {
    /* ─ Base surfaces (obsidian with blue-black bias) */
    --c-void:    #030305;   /* page background — near absolute black */
    --c-base:    #07070b;   /* primary bg */
    --c-sub:     #0c0c12;   /* secondary bg */
    --c-panel:   #101018;   /* card / panel */
    --c-raised:  #16161f;   /* raised panel */
    --c-lift:    #1c1c28;   /* lifted element */
    --c-rim:     #24243a;   /* border base */
    --c-wire:    rgba(255,255,255,0.07); /* hairline border */
    --c-ghost:   rgba(255,255,255,0.04); /* ghost hover */

    /* ─ Text (strict four-level) */
    --t1: #F0F0F4;   /* primary — near white with slight blue tint */
    --t2: #8A8AA8;   /* secondary */
    --t3: #52526A;   /* tertiary / placeholder */
    --t4: #2C2C42;   /* disabled / decorative */

    /* ─ Signal accent — DAW "armed" chartreuse */
    --signal:       #C8FF00;
    --signal-dim:   rgba(200,255,0,0.12);
    --signal-glow:  rgba(200,255,0,0.2);
    --signal-pale:  #D4FF4D;

    /* ─ Channel accent — VU red (live / active / error) */
    --channel:      #FF4D6D;
    --channel-dim:  rgba(255,77,109,0.12);
    --channel-glow: rgba(255,77,109,0.2);

    /* ─ Patch accent — cyan (routing / info / link) */
    --patch:        #00C2FF;
    --patch-dim:    rgba(0,194,255,0.1);
    --patch-glow:   rgba(0,194,255,0.18);

    /* ─ Warm accent — copper ember (premium / featured) */
    --warm:         #FF8C42;
    --warm-dim:     rgba(255,140,66,0.1);
    --warm-glow:    rgba(255,140,66,0.18);

    /* ─ Status */
    --s-ok:   #2DCA72;
    --s-ok-d: rgba(45,202,114,0.12);
    --s-warn: #FFB800;
    --s-err:  var(--channel);
    --s-err-d:var(--channel-dim);
    --s-info: var(--patch);

    /* ─ Spacing (8px grid) */
    --sp-1:  4px;
    --sp-2:  8px;
    --sp-3:  12px;
    --sp-4:  16px;
    --sp-5:  20px;
    --sp-6:  24px;
    --sp-7:  32px;
    --sp-8:  40px;
    --sp-9:  48px;  /* track height unit */
    --sp-10: 64px;
    --sp-11: 80px;
    --sp-12: 96px;
    --sp-13: 128px;

    /* ─ Radius */
    --r-xs:   3px;
    --r-sm:   6px;
    --r:      8px;
    --r-md:   12px;
    --r-lg:   16px;
    --r-xl:   24px;
    --r-2xl:  32px;
    --r-full: 9999px;

    /* ─ Type scale */
    --font-display: 'Syne', system-ui, sans-serif;
    --font-body:    'Inter', system-ui, sans-serif;
    --font-mono:    'JetBrains Mono', 'Fira Code', monospace;

    /* ─ Shadows */
    --sh-sm:  0 1px 2px rgba(0,0,0,0.6);
    --sh:     0 4px 16px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.4);
    --sh-lg:  0 12px 40px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.5);
    --sh-xl:  0 24px 80px rgba(0,0,0,0.8), 0 8px 24px rgba(0,0,0,0.5);
    --sh-sig: 0 0 24px rgba(200,255,0,0.25);
    --sh-ch:  0 0 20px rgba(255,77,109,0.25);
    --sh-pt:  0 0 20px rgba(0,194,255,0.2);

    /* ─ Transitions */
    --ease: cubic-bezier(0.4,0,0.2,1);
    --ease-spring: cubic-bezier(0.34,1.56,0.64,1);
    --t-fast: 120ms;
    --t-base: 200ms;
    --t-slow: 350ms;
  }

  /* ── Reset ─────────────────────────────────────────────────────────────── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
  body {
    font-family: var(--font-body);
    background: var(--c-void);
    color: var(--t1);
    line-height: 1.55;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
    overflow-x: hidden;
  }
  a { color: inherit; text-decoration: none; }
  img { max-width: 100%; display: block; }
  button, input, select, textarea { font-family: inherit; }
  ::selection { background: rgba(200,255,0,0.2); color: var(--t1); }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--c-base); }
  ::-webkit-scrollbar-thumb { background: var(--c-rim); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--t3); }

  /* ══════════════════════════════════════════════════════════════════════
     TYPOGRAPHY SYSTEM
     Syne for display/headlines — angular, music-software energy
     Inter for body — neutral, reliable at small sizes
     JetBrains Mono for data — BPM, IDs, file info
     ══════════════════════════════════════════════════════════════════════ */

  /* Display — Syne, tight tracking, architectural weight */
  .d1 {
    font-family: var(--font-display);
    font-size: clamp(3.25rem, 8vw, 7rem);
    font-weight: 800;
    line-height: 0.93;
    letter-spacing: -0.02em;
  }
  .d2 {
    font-family: var(--font-display);
    font-size: clamp(2.25rem, 5.5vw, 4.5rem);
    font-weight: 800;
    line-height: 0.96;
    letter-spacing: -0.02em;
  }
  .d3 {
    font-family: var(--font-display);
    font-size: clamp(1.75rem, 3.5vw, 3rem);
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -0.015em;
  }
  .d4 {
    font-family: var(--font-display);
    font-size: clamp(1.375rem, 2.5vw, 2rem);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.01em;
  }

  /* Headings — Inter */
  h1 { font-size: clamp(1.5rem,3vw,2rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; }
  h2 { font-size: clamp(1.25rem,2.5vw,1.625rem); font-weight: 600; line-height: 1.2; letter-spacing: -0.015em; }
  h3 { font-size: 1.125rem; font-weight: 600; line-height: 1.3; letter-spacing: -0.01em; }
  h4 { font-size: 1rem; font-weight: 600; line-height: 1.4; }

  /* Body — Inter */
  .body-lg   { font-size: 1.0625rem; line-height: 1.7; color: var(--t2); }
  .body-base { font-size: 0.9375rem; line-height: 1.65; color: var(--t2); }
  .body-sm   { font-size: 0.8125rem; line-height: 1.6; color: var(--t3); }

  /* Mono — JetBrains */
  .mono { font-family: var(--font-mono); font-size: 0.8125rem; }
  .mono-sm { font-family: var(--font-mono); font-size: 0.75rem; }

  /* Label / Eyebrow — ALL CAPS Inter */
  .eyebrow {
    font-family: var(--font-body);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--t3);
  }

  /* Accent text */
  .text-signal  { color: var(--signal); }
  .text-channel { color: var(--channel); }
  .text-patch   { color: var(--patch); }
  .text-warm    { color: var(--warm); }
  .text-ok      { color: var(--s-ok); }
  .text-t2      { color: var(--t2); }
  .text-t3      { color: var(--t3); }

  /* Gradient text */
  .text-grad-signal {
    background: linear-gradient(110deg, var(--t1) 20%, var(--signal) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .text-grad-patch {
    background: linear-gradient(110deg, var(--t1) 30%, var(--patch) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .text-grad-warm {
    background: linear-gradient(110deg, var(--t1) 20%, var(--warm) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  /* ══════════════════════════════════════════════════════════════════════
     VISUAL MOTIFS
     These SVG/CSS patterns are the recurring textures of the brand.
     They appear as section dividers, card backgrounds, empty states.
     ══════════════════════════════════════════════════════════════════════ */

  /* ─ Signal path: thin horizontal rule with a traveling dot */
  .motif-signal-path {
    position: relative;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--c-rim) 20%, var(--c-rim) 80%, transparent 100%);
  }
  .motif-signal-path::after {
    content: '';
    position: absolute;
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--signal);
    top: -1.5px;
    animation: travel 3s linear infinite;
    box-shadow: 0 0 6px var(--signal);
  }
  @keyframes travel { from { left: 0%; } to { left: 100%; } }

  /* ─ Track lane divider */
  .motif-track-lane {
    display: grid;
    grid-template-columns: 3px 1fr;
    gap: 12px;
    align-items: stretch;
  }
  .motif-track-lane-bar {
    background: var(--c-rim);
    border-radius: 2px;
  }

  /* ─ Routing node: small filled circle */
  .node {
    width: 8px; height: 8px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
  }
  .node-signal  { background: var(--signal); box-shadow: 0 0 8px var(--signal-glow); }
  .node-channel { background: var(--channel); box-shadow: 0 0 8px var(--channel-glow); }
  .node-patch   { background: var(--patch); box-shadow: 0 0 6px var(--patch-glow); }
  .node-warm    { background: var(--warm); box-shadow: 0 0 6px var(--warm-glow); }
  .node-ok      { background: var(--s-ok); box-shadow: 0 0 6px rgba(45,202,114,0.3); }
  .node-off     { background: var(--c-rim); }

  /* ─ Level meter cluster (decorative) */
  .motif-meter {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 24px;
  }
  .motif-meter-bar {
    width: 3px;
    background: var(--c-rim);
    border-radius: 1px;
    transition: height 0.15s;
  }

  /* ─ Waveform spine (SVG inline) */
  .motif-waveform {
    display: flex;
    align-items: center;
    gap: 2px;
    height: 32px;
  }
  .motif-waveform-bar {
    width: 2.5px;
    border-radius: 1.5px;
    background: currentColor;
    flex-shrink: 0;
  }

  /* ─ Channel strip (left-border identity marker on cards) */
  .strip-signal  { border-left: 3px solid var(--signal); }
  .strip-channel { border-left: 3px solid var(--channel); }
  .strip-patch   { border-left: 3px solid var(--patch); }
  .strip-warm    { border-left: 3px solid var(--warm); }
  .strip-ok      { border-left: 3px solid var(--s-ok); }
  .strip-muted   { border-left: 3px solid var(--c-rim); }

  /* ══════════════════════════════════════════════════════════════════════
     BUTTON SYSTEM
     Buttons reflect the DAW control aesthetic: precise, no-decoration,
     the only colors are signal-green (primary), rimmed (secondary).
     ══════════════════════════════════════════════════════════════════════ */

  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    border: none; cursor: pointer; font-family: var(--font-body); font-weight: 600;
    letter-spacing: -0.01em; white-space: nowrap; text-decoration: none;
    position: relative; transition: all var(--t-base) var(--ease);
    user-select: none; -webkit-user-select: none;
  }
  .btn:active { transform: scale(0.97); }
  .btn:focus-visible { outline: 2px solid var(--signal); outline-offset: 3px; }

  /* Primary — signal green. The one bright button. */
  .btn-primary {
    background: var(--signal);
    color: #000;
    padding: 10px 22px;
    font-size: 0.875rem;
    border-radius: var(--r);
    box-shadow: 0 0 0 0 var(--signal-glow);
  }
  .btn-primary:hover {
    background: var(--signal-pale);
    box-shadow: var(--sh-sig);
    transform: translateY(-1px);
  }

  /* Secondary — rimmed, low contrast */
  .btn-secondary {
    background: var(--c-raised);
    color: var(--t1);
    padding: 10px 20px;
    font-size: 0.875rem;
    border-radius: var(--r);
    border: 1px solid var(--c-wire);
  }
  .btn-secondary:hover {
    background: var(--c-lift);
    border-color: rgba(255,255,255,0.12);
  }

  /* Ghost — no bg, text only */
  .btn-ghost {
    background: transparent; color: var(--t2);
    padding: 10px 16px; font-size: 0.875rem; border-radius: var(--r);
  }
  .btn-ghost:hover { color: var(--t1); background: var(--c-ghost); }

  /* Outline */
  .btn-outline {
    background: transparent; color: var(--t1);
    padding: 10px 20px; font-size: 0.875rem; border-radius: var(--r);
    border: 1px solid rgba(255,255,255,0.18);
  }
  .btn-outline:hover { background: var(--c-ghost); border-color: rgba(255,255,255,0.3); }

  /* Danger */
  .btn-danger {
    background: var(--channel-dim); color: var(--channel);
    padding: 10px 20px; font-size: 0.875rem; border-radius: var(--r);
    border: 1px solid var(--channel-dim);
  }
  .btn-danger:hover { background: rgba(255,77,109,0.2); }

  /* Sizes — WCAG 2.1 AA: 44px minimum interactive touch target */
  .btn-xs { padding: 7px 11px; font-size: 0.75rem; border-radius: var(--r-sm); min-height: 36px; }
  .btn-sm { padding: 9px 15px; font-size: 0.8125rem; border-radius: var(--r-sm); min-height: 40px; }
  .btn-lg { padding: 13px 28px; font-size: 0.9375rem; border-radius: var(--r-md); min-height: 48px; }
  .btn-xl { padding: 16px 36px; font-size: 1rem; border-radius: var(--r-lg); min-height: 56px; }
  .btn-w  { width: 100%; justify-content: center; }

  /* ══════════════════════════════════════════════════════════════════════
     CARD SYSTEM
     Cards are panels, not containers. They use channel-strip accents to
     create artist/category identity. Depth through layered surfaces.
     ══════════════════════════════════════════════════════════════════════ */

  .card {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    overflow: hidden;
    transition: border-color var(--t-base) var(--ease);
  }
  .card:hover { border-color: rgba(255,255,255,0.1); }

  .card-raised {
    background: var(--c-raised);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
  }

  .card-lift {
    background: var(--c-lift);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: var(--r-lg);
  }

  /* Interactive card with signal-strip */
  .card-interactive {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    overflow: hidden;
    cursor: pointer;
    transition: all var(--t-base) var(--ease);
  }
  .card-interactive:hover {
    border-color: rgba(200,255,0,0.2);
    transform: translateY(-2px);
    box-shadow: var(--sh);
  }

  /* ══════════════════════════════════════════════════════════════════════
     BADGE SYSTEM
     Studio-style: mono font, precision sizing, color matches the node system
     ══════════════════════════════════════════════════════════════════════ */

  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 8px; border-radius: var(--r-xs);
    font-family: var(--font-mono); font-size: 0.6875rem; font-weight: 500;
    letter-spacing: 0.02em; white-space: nowrap;
  }
  .badge-signal  {
    background: var(--signal-dim); color: var(--signal);
    border: 1px solid rgba(200,255,0,0.2);
  }
  .badge-channel {
    background: var(--channel-dim); color: var(--channel);
    border: 1px solid rgba(255,77,109,0.2);
  }
  .badge-patch {
    background: var(--patch-dim); color: var(--patch);
    border: 1px solid rgba(0,194,255,0.18);
  }
  .badge-warm {
    background: var(--warm-dim); color: var(--warm);
    border: 1px solid rgba(255,140,66,0.2);
  }
  .badge-ok {
    background: var(--s-ok-d); color: var(--s-ok);
    border: 1px solid rgba(45,202,114,0.2);
  }
  .badge-muted {
    background: var(--c-ghost); color: var(--t3);
    border: 1px solid var(--c-wire);
  }
  .badge-warn {
    background: rgba(255,184,0,0.1); color: var(--s-warn);
    border: 1px solid rgba(255,184,0,0.2);
  }

  /* ══════════════════════════════════════════════════════════════════════
     FORM SYSTEM
     Studio console aesthetic: fields as input channels, precise labels,
     focused state shows the signal color.
     ══════════════════════════════════════════════════════════════════════ */

  .field { display: flex; flex-direction: column; gap: 6px; }
  .field-label {
    font-family: var(--font-body);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--t3);
  }
  .field-input {
    background: var(--c-raised);
    border: 1px solid var(--c-rim);
    border-radius: var(--r);
    padding: 11px 14px;
    color: var(--t1);
    font-size: 0.9375rem;
    font-family: var(--font-body);
    width: 100%;
    outline: none;
    transition: border-color var(--t-fast) var(--ease), box-shadow var(--t-fast) var(--ease);
    -webkit-appearance: none;
  }
  .field-input:focus {
    border-color: var(--signal);
    box-shadow: 0 0 0 3px var(--signal-dim);
  }
  .field-input::placeholder { color: var(--t4); }
  .field-input:disabled { opacity: 0.4; cursor: not-allowed; }
  textarea.field-input { resize: vertical; min-height: 100px; line-height: 1.6; }

  .field-select {
    background: var(--c-raised);
    border: 1px solid var(--c-rim);
    border-radius: var(--r);
    padding: 11px 36px 11px 14px;
    color: var(--t1);
    font-size: 0.9375rem;
    font-family: var(--font-body);
    width: 100%;
    outline: none;
    cursor: pointer;
    appearance: none; -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2352526A'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 13px center;
    transition: border-color var(--t-fast) var(--ease);
  }
  .field-select:focus { border-color: var(--signal); }

  /* ══════════════════════════════════════════════════════════════════════
     NAVIGATION SYSTEM
     The nav is a recording console's master section — minimal, precise,
     always visible. The wordmark uses Syne. The signal dot in the logo
     is always the "armed" chartreuse.
     ══════════════════════════════════════════════════════════════════════ */

  .nav {
    position: sticky; top: 0; z-index: 300;
    height: 56px;
    display: flex; align-items: center;
    padding: 0 24px;
    /* Prevent content from going under notch on iOS */
    padding-left: max(24px, env(safe-area-inset-left));
    padding-right: max(24px, env(safe-area-inset-right));
    background: rgba(3,3,5,0.9);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border-bottom: 1px solid var(--c-wire);
  }
  .nav-inner {
    width: 100%; max-width: 1440px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between; gap: 24px;
  }
  /* Wordmark */
  .nav-mark {
    display: flex; align-items: center; gap: 10px;
    font-family: var(--font-display); font-size: 0.9375rem; font-weight: 700;
    letter-spacing: -0.01em; white-space: nowrap;
    text-decoration: none; color: var(--t1);
  }
  /* Logo glyph — the AC monogram with a signal node */
  .nav-logo {
    width: 30px; height: 30px;
    background: var(--c-panel);
    border: 1px solid var(--c-rim);
    border-radius: var(--r-sm);
    display: flex; align-items: center; justify-content: center;
    position: relative;
    flex-shrink: 0;
  }
  .nav-logo-text {
    font-family: var(--font-display);
    font-size: 0.75rem;
    font-weight: 800;
    color: var(--t1);
    letter-spacing: -0.02em;
  }
  .nav-logo-node {
    position: absolute;
    width: 6px; height: 6px;
    background: var(--signal);
    border-radius: 50%;
    top: -2px; right: -2px;
    box-shadow: 0 0 6px var(--signal);
  }
  /* Nav links */
  .nav-links { display: flex; align-items: center; gap: 2px; list-style: none; }
  .nav-links a {
    padding: 8px 12px; border-radius: var(--r-sm);
    font-size: 0.875rem; font-weight: 500; color: var(--t3);
    transition: color var(--t-fast), background var(--t-fast);
    min-height: 40px; display: flex; align-items: center;
  }
  .nav-links a:hover { color: var(--t1); background: var(--c-ghost); }
  .nav-links a.active { color: var(--t1); }
  /* Nav CTA group */
  .nav-cta { display: flex; align-items: center; gap: 8px; }
  /* User pill */
  .nav-user {
    display: flex; align-items: center; gap: 8px;
    padding: 4px 10px 4px 4px;
    background: var(--c-raised); border: 1px solid var(--c-wire);
    border-radius: var(--r-full);
    cursor: pointer; text-decoration: none;
    transition: border-color var(--t-fast);
    min-height: 40px;
  }
  .nav-user:hover { border-color: rgba(255,255,255,0.14); }

  /* ══════════════════════════════════════════════════════════════════════
     APP SHELL (Authenticated)
     The sidebar is a DAW channel list — narrow, functional, dark.
     ══════════════════════════════════════════════════════════════════════ */

  .app-shell {
    display: grid;
    grid-template-columns: 200px 1fr;
    min-height: calc(100vh - 56px);
  }
  .app-sidebar {
    background: var(--c-base);
    border-right: 1px solid var(--c-wire);
    position: sticky; top: 56px;
    height: calc(100vh - 56px);
    overflow-y: auto;
    display: flex; flex-direction: column;
    scrollbar-width: none; -ms-overflow-style: none;
  }
  .app-sidebar::-webkit-scrollbar { display: none; }
  .app-main { overflow-x: hidden; overflow-y: auto; min-width: 0; }

  /* Sidebar sections */
  .sb-section {
    padding: 16px 14px 4px;
    font-size: 0.6rem; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--t4);
  }
  .sb-nav { list-style: none; padding: 0 6px; }
  .sb-nav li a, .sb-nav li button {
    display: flex; align-items: center; gap: 9px;
    padding: 8px 9px;
    border-radius: var(--r-sm);
    font-size: 0.8125rem; font-weight: 500; color: var(--t3);
    width: 100%; background: none; border: none; cursor: pointer;
    transition: color var(--t-fast), background var(--t-fast);
    text-decoration: none;
  }
  .sb-nav li a:hover, .sb-nav li button:hover { color: var(--t1); background: var(--c-ghost); }
  .sb-nav li a.on {
    color: var(--t1); background: rgba(200,255,0,0.08);
    border-left: 2px solid var(--signal); padding-left: 7px;
  }
  .sb-nav li a.on .sb-icon { color: var(--signal); }
  .sb-icon { width: 14px; text-align: center; flex-shrink: 0; font-size: 0.8125rem; color: var(--t4); }

  /* Sidebar user card */
  .sb-user {
    padding: 14px 12px;
    border-bottom: 1px solid var(--c-wire);
    display: flex; align-items: center; gap: 9px;
  }

  /* Notification badge */
  .notif {
    background: var(--signal); color: #000;
    border-radius: var(--r-full); padding: 1px 5px;
    font-size: 0.625rem; font-weight: 700;
    min-width: 16px; text-align: center; margin-left: auto;
    font-family: var(--font-mono);
  }

  /* ══════════════════════════════════════════════════════════════════════
     AVATAR
     ══════════════════════════════════════════════════════════════════════ */
  .av {
    border-radius: 50%; object-fit: cover; display: block; flex-shrink: 0;
  }
  .av-2xs { width: 20px; height: 20px; }
  .av-xs  { width: 24px; height: 24px; }
  .av-sm  { width: 32px; height: 32px; }
  .av-md  { width: 44px; height: 44px; }
  .av-lg  { width: 56px; height: 56px; }
  .av-xl  { width: 72px; height: 72px; }
  .av-2xl { width: 96px; height: 96px; }
  .av-3xl { width: 120px; height: 120px; }

  /* Online status dot */
  .online-dot {
    width: 9px; height: 9px; border-radius: 50%;
    background: var(--s-ok);
    box-shadow: 0 0 0 2px var(--c-panel);
  }

  /* ══════════════════════════════════════════════════════════════════════
     TABLE SYSTEM
     ══════════════════════════════════════════════════════════════════════ */
  .tbl { width: 100%; border-collapse: collapse; }
  .tbl thead tr { border-bottom: 1px solid var(--c-wire); }
  .tbl tbody tr { border-bottom: 1px solid rgba(255,255,255,0.03); transition: background var(--t-fast); }
  .tbl tbody tr:hover { background: var(--c-ghost); }
  .tbl th {
    padding: 10px 16px;
    font-family: var(--font-body); font-size: 0.6875rem; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase; color: var(--t4); text-align: left;
  }
  .tbl td { padding: 13px 16px; font-size: 0.875rem; }

  /* ══════════════════════════════════════════════════════════════════════
     PROGRESS & METER
     ══════════════════════════════════════════════════════════════════════ */
  .prog { height: 3px; background: var(--c-rim); border-radius: 2px; overflow: hidden; }
  .prog-fill {
    height: 100%; border-radius: 2px;
    background: var(--signal);
    transition: width 0.6s var(--ease);
  }
  .prog-patch { background: var(--patch); }
  .prog-warm  { background: var(--warm); }
  .prog-ok    { background: var(--s-ok); }

  /* Tall progress (channel strip meter style) */
  .prog-tall { height: 6px; background: var(--c-rim); border-radius: 3px; overflow: hidden; }

  /* ══════════════════════════════════════════════════════════════════════
     ALERTS
     ══════════════════════════════════════════════════════════════════════ */
  .alert {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 12px 14px; border-radius: var(--r); font-size: 0.875rem; line-height: 1.5;
  }
  .alert i { margin-top: 1px; flex-shrink: 0; }
  .alert-ok      { background: var(--s-ok-d); border: 1px solid rgba(45,202,114,0.18); color: #5ee8a0; }
  .alert-info    { background: var(--patch-dim); border: 1px solid rgba(0,194,255,0.15); color: #6dd9f9; }
  .alert-warn    { background: rgba(255,184,0,0.08); border: 1px solid rgba(255,184,0,0.2); color: #ffd04d; }
  .alert-err     { background: var(--channel-dim); border: 1px solid rgba(255,77,109,0.2); color: #ff8fa5; }
  .alert-signal  { background: var(--signal-dim); border: 1px solid rgba(200,255,0,0.18); color: var(--signal); }

  /* ══════════════════════════════════════════════════════════════════════
     DIVIDERS & STRUCTURAL ELEMENTS
     ══════════════════════════════════════════════════════════════════════ */
  .hr { border: none; border-top: 1px solid var(--c-wire); }

  /* Section spacer */
  .sec-pad { padding: var(--sp-12) var(--sp-6); }
  .sec-pad-sm { padding: var(--sp-10) var(--sp-6); }

  /* ══════════════════════════════════════════════════════════════════════
     LAYOUT UTILITIES
     ══════════════════════════════════════════════════════════════════════ */
  .container    { max-width: 1280px; margin: 0 auto; padding: 0 var(--sp-6); }
  .container-md { max-width: 960px;  margin: 0 auto; padding: 0 var(--sp-6); }
  .container-sm { max-width: 680px;  margin: 0 auto; padding: 0 var(--sp-6); }

  .flex       { display: flex; }
  .flex-col   { display: flex; flex-direction: column; }
  .grid       { display: grid; }
  .items-c    { align-items: center; }
  .items-s    { align-items: flex-start; }
  .justify-b  { justify-content: space-between; }
  .justify-c  { justify-content: center; }
  .justify-e  { justify-content: flex-end; }
  .wrap       { flex-wrap: wrap; }
  .gap-1 { gap: var(--sp-1); }
  .gap-2 { gap: var(--sp-2); }
  .gap-3 { gap: var(--sp-3); }
  .gap-4 { gap: var(--sp-4); }
  .gap-5 { gap: var(--sp-5); }
  .gap-6 { gap: var(--sp-6); }
  .gap-7 { gap: var(--sp-7); }
  .p-4   { padding: var(--sp-4); }
  .p-5   { padding: var(--sp-5); }
  .p-6   { padding: var(--sp-6); }
  .p-7   { padding: var(--sp-7); }
  .p-8   { padding: var(--sp-8); }
  .px-6  { padding-left: var(--sp-6); padding-right: var(--sp-6); }
  .py-6  { padding-top: var(--sp-6); padding-bottom: var(--sp-6); }
  .mb-2  { margin-bottom: var(--sp-2); }
  .mb-3  { margin-bottom: var(--sp-3); }
  .mb-4  { margin-bottom: var(--sp-4); }
  .mb-5  { margin-bottom: var(--sp-5); }
  .mb-6  { margin-bottom: var(--sp-6); }
  .mb-7  { margin-bottom: var(--sp-7); }
  .mb-8  { margin-bottom: var(--sp-8); }
  .mt-4  { margin-top: var(--sp-4); }
  .mt-6  { margin-top: var(--sp-6); }
  .mt-8  { margin-top: var(--sp-8); }
  .w-full { width: 100%; }
  .min-0 { min-width: 0; }
  .shrink-0 { flex-shrink: 0; }
  .relative { position: relative; }
  .absolute { position: absolute; }
  .overflow-h { overflow: hidden; }
  .overflow-a { overflow: auto; }
  .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .text-c { text-align: center; }
  .text-r { text-align: right; }
  .bold { font-weight: 700; }
  .semi { font-weight: 600; }
  .cursor-p { cursor: pointer; }
  .select-n { user-select: none; }
  .pointer-n { pointer-events: none; }

  /* ══════════════════════════════════════════════════════════════════════
     ANIMATION LIBRARY
     ══════════════════════════════════════════════════════════════════════ */
  @keyframes fadeUp   { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes slideIn  { from { opacity:0; transform:translateX(-10px); } to { opacity:1; transform:translateX(0); } }
  @keyframes popIn    { from { opacity:0; transform:scale(0.88); } to { opacity:1; transform:scale(1); } }
  @keyframes pulse    { 0%,100%{opacity:1;} 50%{opacity:0.5;} }
  @keyframes spin     { to { transform:rotate(360deg); } }
  @keyframes scanline { from { top:-2px; } to { top:100%; } }
  @keyframes meter    { 0%,100%{height:30%;} 25%{height:90%;} 50%{height:60%;} 75%{height:80%;} }

  .anim-up    { animation: fadeUp  0.45s var(--ease) forwards; }
  .anim-in    { animation: fadeIn  0.35s var(--ease) forwards; }
  .anim-pop   { animation: popIn   0.4s var(--ease-spring) forwards; }

  /* ══════════════════════════════════════════════════════════════════════
     FOOTER
     ══════════════════════════════════════════════════════════════════════ */
  .footer {
    background: var(--c-base);
    border-top: 1px solid var(--c-wire);
    padding: 56px var(--sp-6) 32px;
  }
  .footer-grid {
    max-width: 1280px; margin: 0 auto;
    display: grid; grid-template-columns: 2.2fr 1fr 1fr 1fr;
    gap: 48px; margin-bottom: 48px;
  }
  .footer-link {
    display: block; font-size: 0.875rem; color: var(--t3); padding: 4px 0;
    transition: color var(--t-fast);
  }
  .footer-link:hover { color: var(--t1); }
  .footer-head {
    font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--t4); margin-bottom: 12px;
  }
  .footer-bottom {
    max-width: 1280px; margin: 0 auto;
    padding-top: 24px; border-top: 1px solid var(--c-wire);
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 10px;
  }

  /* ══════════════════════════════════════════════════════════════════════
     RESPONSIVE
     ══════════════════════════════════════════════════════════════════════ */

  /* Mobile sidebar overlay */
  .sidebar-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 399;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }
  .sidebar-overlay.open { display: block; }

  /* Public mobile nav drawer */
  .pub-nav-drawer {
    display: none;
    position: fixed;
    top: 56px; left: 0; right: 0;
    background: rgba(7,7,11,0.98);
    backdrop-filter: blur(24px) saturate(160%);
    -webkit-backdrop-filter: blur(24px) saturate(160%);
    border-bottom: 1px solid var(--c-wire);
    z-index: 298;
    padding: 12px 16px 20px;
    flex-direction: column;
    gap: 4px;
    animation: slideIn 0.2s var(--ease) forwards;
  }
  .pub-nav-drawer.open { display: flex; }
  .pub-nav-drawer a {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 14px;
    font-size: 0.9375rem; font-weight: 500; color: var(--t2);
    border-radius: var(--r);
    transition: color var(--t-fast), background var(--t-fast);
    min-height: 48px;
    text-decoration: none;
  }
  .pub-nav-drawer a:hover, .pub-nav-drawer a.active { color: var(--t1); background: var(--c-ghost); }
  .pub-nav-drawer .drawer-divider {
    height: 1px; background: var(--c-wire);
    margin: 8px 0;
  }
  .pub-nav-drawer .drawer-ctas {
    display: flex; flex-direction: column; gap: 8px;
    padding-top: 4px;
  }

  @media (max-width: 1024px) {
    .app-shell { grid-template-columns: 1fr; }
    .app-sidebar {
      display: none;
      position: fixed;
      z-index: 400;
      top: 56px;
      left: 0;
      width: 260px;
      height: calc(100vh - 56px);
      box-shadow: 4px 0 32px rgba(0,0,0,0.65);
      /* Slide in from left */
      transform: translateX(-100%);
      transition: transform var(--t-base) var(--ease), display 0s;
    }
    .app-sidebar.open {
      display: flex;
      transform: translateX(0);
      animation: slideIn 0.2s var(--ease) forwards;
    }
    .footer-grid { grid-template-columns: 1fr 1fr; }
    .mob-hide { display:none !important; }
    .mob-show { display:flex !important; }
    /* Tables scroll on tablet */
    .tbl-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    /* Workspace: single column on tablet */
    .ws-layout { grid-template-columns: 1fr !important; }
    /* App page padding reduce */
    .app-page { padding: 20px 16px !important; }
  }
  @media (max-width: 768px) {
    .nav-links { display:none; }
    .nav { padding: 0 var(--sp-4); min-height: 56px; }
    /* Nav: ensure touch-friendly nav items */
    .nav-mark { min-height: 48px; }
    /* All buttons: 48px minimum touch target per WCAG */
    .btn { min-height: 44px; }
    .btn-sm { min-height: 44px; padding: 10px 16px; }
    .btn-xs { min-height: 40px; padding: 8px 12px; }
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
    .footer-bottom { flex-direction: column; text-align: center; gap: 8px; }
    .container, .container-md, .container-sm { padding: 0 var(--sp-4); }
    .sec-pad { padding: var(--sp-10) var(--sp-4); }
    .sec-pad-sm { padding: var(--sp-8) var(--sp-4); }
    /* Tables scroll on mobile */
    .tbl-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .tbl { min-width: 560px; }
    /* Buttons full-width on mobile when stacked */
    .btn-stack-mobile { width: 100%; justify-content: center; }
    /* Cards readable on mobile */
    .card { padding: var(--sp-4); }
    /* Footer links: bigger touch targets */
    .footer-link { padding: 7px 0; font-size: 0.9375rem; }
    /* App page padding reduce */
    .app-page { padding: 16px 14px !important; max-width: 100% !important; overflow-x: hidden !important; }
    /* Dashboard stat tiles: 2 col */
    .stat-tiles { grid-template-columns: repeat(2, 1fr) !important; }
    .quick-grid  { grid-template-columns: repeat(2, 1fr) !important; }
    /* Workspace panels */
    .ws-layout { padding: 14px !important; gap: 14px !important; }
    .ws-panel-head { padding: 12px 14px !important; flex-wrap: wrap; gap: 8px; }
    /* Split sheet + transparency pages */
    .ss-page { padding: 14px 16px !important; }
    .td-page  { padding: 14px 16px !important; }
    /* Project row — prevent overflow */
    .proj-row { flex-wrap: wrap; }
    /* Booking sidebar */
    .booking-sidebar { position: static !important; }
    /* Ensure no horizontal overflow anywhere */
    body { overflow-x: hidden; }
  }
  @media (max-width: 480px) {
    .footer-grid { grid-template-columns: 1fr; }
    .footer { padding: 40px var(--sp-4) 24px; }
    /* Sidebar: wider on very small screens */
    .app-sidebar { width: 88vw; max-width: 300px; }
    /* Sidebar nav items: bigger touch target */
    .sb-nav li a, .sb-nav li button { padding: 11px 10px; min-height: 48px; font-size: 0.875rem; }
    /* Public nav drawer: full width */
    .pub-nav-drawer { padding: 8px 12px 16px; }
    .pub-nav-drawer a { min-height: 52px; font-size: 1rem; }
    /* Hero grid stacks on mobile */
    .hero-inner { grid-template-columns: 1fr !important; gap: 32px !important; padding: 80px 16px 60px !important; }
    .hero-right { display: none !important; }
    /* Explore / Marketplace grids */
    .artist-grid   { grid-template-columns: 1fr !important; }
    .listing-grid  { grid-template-columns: 1fr !important; }
    /* Dashboard stat tiles: single column */
    .stat-tiles { grid-template-columns: 1fr !important; }
    .quick-grid  { grid-template-columns: repeat(2, 1fr) !important; }
    /* Marketplace card padding */
    .app-page { padding: 12px !important; }
    /* Avatar sizes on very small screens */
    .av-3xl { width: 80px !important; height: 80px !important; }
    .av-2xl { width: 68px !important; height: 68px !important; }
    /* Compose quick-reply buttons: wrap nicely */
    .compose-quickreplies { flex-wrap: wrap; gap: 6px; }
    .compose-quickreplies button { flex: 0 1 auto; min-height: 40px; }
    /* NDA / agreement page */
    .ss-page { padding: 12px !important; }
    .td-page  { padding: 12px !important; }
    /* Transparency tiles: 2 col */
    .td-tiles { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
    /* Prevent any text overflow */
    * { max-width: 100%; }
    img { max-width: 100%; height: auto; }
  }
  .mob-hide {}
  .mob-show { display:none; }
`;

// ─── Inline SVG Motifs ────────────────────────────────────────────────────────

// Waveform bars — the brand's recurring structural motif
export const waveform = (bars = 28, color = 'var(--signal)', opacity = 0.25, heights?: number[]) => {
  const h = heights ?? Array.from({length: bars}, (_, i) => {
    const cycle = Math.sin((i / bars) * Math.PI * 2.5) * 0.4 + 0.5;
    return Math.max(0.1, cycle + (Math.random() * 0.3 - 0.15));
  });
  return `<div style="display:flex;align-items:center;gap:2px;height:100%;">
    ${h.map(v => `<div style="width:2.5px;border-radius:1.5px;background:${color};opacity:${opacity};flex-shrink:0;height:${Math.round(v*100)}%;"></div>`).join('')}
  </div>`;
};

// Level meter cluster — used in sidebar, cards
export const meterCluster = (count = 6, active = 3) =>
  `<div style="display:flex;align-items:flex-end;gap:2px;height:20px;">
    ${Array.from({length:count}, (_,i) => {
      const isActive = i < active;
      const h = [40,65,85,60,75,50,40,70][i % 8];
      return `<div style="width:3px;height:${h}%;border-radius:1px;background:${isActive ? 'var(--signal)' : 'var(--c-rim)'};transition:all 0.15s;"></div>`;
    }).join('')}
  </div>`;

// Signal path line (horizontal)
export const signalPath = (width = '100%') =>
  `<div style="position:relative;height:1px;width:${width};overflow:hidden;">
    <div style="position:absolute;inset:0;background:linear-gradient(90deg,transparent 0%,var(--c-rim) 20%,var(--c-rim) 80%,transparent 100%);"></div>
    <div style="position:absolute;width:4px;height:4px;border-radius:50%;background:var(--signal);top:-1.5px;box-shadow:0 0 6px var(--signal);animation:travel 3s linear infinite;"></div>
  </div>`;

// Routing node dot
export const routingNode = (color = 'var(--signal)') =>
  `<div style="width:8px;height:8px;border-radius:50%;background:${color};box-shadow:0 0 8px ${color};flex-shrink:0;"></div>`;

// ─── Page Shell ───────────────────────────────────────────────────────────────
export const shell = (title: string, extra = '') => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Artist Collab</title>
  <meta name="description" content="Artist Collab — Remote studio infrastructure. Book features, manage projects, share stems, get paid.">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%23101018'/><text y='22' x='4' font-size='20' font-family='system-ui' font-weight='900' fill='%23C8FF00'>A</text><circle cx='26' cy='8' r='4' fill='%23C8FF00'/></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>
    ${AC_SYSTEM}
    ${extra}
  </style>
</head>
<body>`;

export const closeShell = () => `
<script>
// ── Data-href navigation ─────────────────────────────────────────────────────
document.querySelectorAll('[data-href]').forEach(function(el) {
  el.style.cursor = 'pointer';
  el.addEventListener('click', function() {
    var href = el.getAttribute('data-href');
    if (href) window.location.href = href;
  });
});

// ── Authenticated app sidebar (drawer) ───────────────────────────────────────
window.toggleSidebar = function() {
  var sb = document.getElementById('app-sidebar');
  var ov = document.getElementById('sidebar-overlay');
  if (!sb) return;
  var isOpen = sb.classList.contains('open');
  sb.classList.toggle('open');
  if (ov) ov.classList.toggle('open');
};
var appOv = document.getElementById('sidebar-overlay');
if (appOv) appOv.addEventListener('click', function() {
  var sb = document.getElementById('app-sidebar');
  if (sb) sb.classList.remove('open');
  appOv.classList.remove('open');
});

// ── Public nav hamburger (mobile drawer) ─────────────────────────────────────
window.togglePubNav = function() {
  var drawer = document.getElementById('pub-nav-drawer');
  var overlay = document.getElementById('pub-nav-overlay');
  var hamburger = document.getElementById('pub-hamburger');
  if (!drawer) return;
  var isOpen = drawer.classList.contains('open');
  if (isOpen) {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (overlay) overlay.classList.remove('open');
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'false');
      var icon = hamburger.querySelector('i');
      if (icon) { icon.className = 'fas fa-bars'; icon.style.fontSize = '1.125rem'; }
    }
  } else {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (overlay) overlay.classList.add('open');
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'true');
      var icon = hamburger.querySelector('i');
      if (icon) { icon.className = 'fas fa-xmark'; icon.style.fontSize = '1.25rem'; }
    }
    // Focus first link in drawer for accessibility
    var firstLink = drawer.querySelector('a[href]');
    if (firstLink) setTimeout(function() { firstLink.focus(); }, 50);
  }
};
window.closePubNav = function() {
  var drawer = document.getElementById('pub-nav-drawer');
  var overlay = document.getElementById('pub-nav-overlay');
  var hamburger = document.getElementById('pub-hamburger');
  if (drawer) { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }
  if (overlay) overlay.classList.remove('open');
  if (hamburger) {
    hamburger.setAttribute('aria-expanded', 'false');
    var icon = hamburger.querySelector('i');
    if (icon) { icon.className = 'fas fa-bars'; icon.style.fontSize = '1.125rem'; }
  }
};
// Close public nav drawer when a link inside is clicked
var pubDrawer = document.getElementById('pub-nav-drawer');
if (pubDrawer) {
  var drawerLinks = pubDrawer.querySelectorAll('a[href]');
  for (var i = 0; i < drawerLinks.length; i++) {
    drawerLinks[i].addEventListener('click', function() {
      window.closePubNav && window.closePubNav();
    });
  }
}
// Close on Escape key (universal)
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Escape') return;
  var sb = document.getElementById('app-sidebar');
  var appOverlay = document.getElementById('sidebar-overlay');
  if (sb && sb.classList.contains('open')) {
    sb.classList.remove('open');
    if (appOverlay) appOverlay.classList.remove('open');
  }
  window.closePubNav && window.closePubNav();
});
</script>
</body></html>`;

// ─── Navigation ───────────────────────────────────────────────────────────────
export const publicNav = (active = '') => `
<!-- Public mobile nav drawer (hidden until hamburger clicked) -->
<div class="pub-nav-drawer" id="pub-nav-drawer" role="dialog" aria-label="Mobile navigation menu" aria-hidden="true">
  <a href="/explore" class="${active === 'explore' ? 'active' : ''}">
    <i class="fas fa-compass" style="width:18px;text-align:center;color:var(--t4);font-size:0.875rem;"></i>
    Find Artists
  </a>
  <a href="/marketplace" class="${active === 'marketplace' ? 'active' : ''}">
    <i class="fas fa-store" style="width:18px;text-align:center;color:var(--t4);font-size:0.875rem;"></i>
    Browse Services
  </a>
  <a href="/how-it-works" class="${active === 'how' ? 'active' : ''}">
    <i class="fas fa-circle-question" style="width:18px;text-align:center;color:var(--t4);font-size:0.875rem;"></i>
    How It Works
  </a>
  <div class="drawer-divider"></div>
  <div class="drawer-ctas">
    <a href="/login" class="btn btn-secondary btn-w" style="min-height:48px;justify-content:center;font-size:0.9375rem;">
      <i class="fas fa-arrow-right-to-bracket" style="font-size:13px;"></i>
      Sign In
    </a>
    <a href="/signup" class="btn btn-primary btn-w" style="min-height:48px;justify-content:center;font-size:0.9375rem;">
      <i class="fas fa-microphone-alt" style="font-size:13px;"></i>
      Start Free
    </a>
  </div>
</div>
<div class="sidebar-overlay" id="pub-nav-overlay" onclick="closePubNav()" style="z-index:297;" aria-hidden="true"></div>
<nav class="nav">
  <div class="nav-inner">
    <a href="/" class="nav-mark">
      <div class="nav-logo">
        <span class="nav-logo-text">AC</span>
        <div class="nav-logo-node"></div>
      </div>
      <span>Artist Collab</span>
    </a>
    <ul class="nav-links mob-hide">
      <li><a href="/explore" class="${active === 'explore' ? 'active' : ''}">Find Artists</a></li>
      <li><a href="/marketplace" class="${active === 'marketplace' ? 'active' : ''}">Browse Services</a></li>
      <li><a href="/how-it-works" class="${active === 'how' ? 'active' : ''}">How It Works</a></li>
    </ul>
    <div class="nav-cta">
      <a href="/login" class="btn btn-ghost btn-sm mob-hide" style="color:var(--t2);">Sign in</a>
      <a href="/signup" class="btn btn-primary btn-sm" style="min-height:40px;">Start Free</a>
      <button
        class="btn btn-ghost mob-show"
        id="pub-hamburger"
        onclick="togglePubNav()"
        aria-label="Open navigation menu"
        aria-expanded="false"
        aria-controls="pub-nav-drawer"
        style="padding:0;width:44px;height:44px;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0;"
      ><i class="fas fa-bars" style="font-size:1.125rem;pointer-events:none;"></i></button>
    </div>
  </div>
</nav>`;

export const authedNav = (active = '') => `
<style>
  /* ── Dropdown nav ── */
  .nav-dropdown { position: relative; }
  .nav-dropdown-menu {
    display: none;
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background: rgba(16,16,24,0.98);
    border: 1px solid var(--c-rim);
    border-radius: var(--r-lg);
    padding: 6px;
    min-width: 200px;
    z-index: 500;
    box-shadow: var(--sh-xl);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    animation: popIn 0.15s var(--ease-spring) forwards;
  }
  .nav-dropdown:hover .nav-dropdown-menu,
  .nav-dropdown:focus-within .nav-dropdown-menu { display: block; }
  .nav-dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: var(--r-sm);
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--t2);
    text-decoration: none;
    transition: all var(--t-fast);
    cursor: pointer;
  }
  .nav-dropdown-item:hover { color: var(--t1); background: var(--c-ghost); }
  .nav-dropdown-item .dd-icon { width: 16px; text-align: center; color: var(--t4); font-size: 0.75rem; flex-shrink: 0; }
  .nav-dropdown-divider { height: 1px; background: var(--c-wire); margin: 4px 8px; }
  .nav-dropdown-trigger {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    border-radius: var(--r-sm);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--t3);
    transition: color var(--t-fast), background var(--t-fast);
    min-height: 40px;
    cursor: pointer;
    background: none;
    border: none;
    font-family: var(--font-body);
    text-decoration: none;
  }
  .nav-dropdown-trigger:hover { color: var(--t1); background: var(--c-ghost); }
  .nav-dropdown-trigger .dd-caret { font-size: 0.625rem; opacity: 0.5; transition: transform var(--t-fast); }
  .nav-dropdown:hover .dd-caret { transform: rotate(180deg); }
  /* New collab button in nav */
  .nav-new-collab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    background: var(--signal);
    color: #000;
    border-radius: var(--r);
    font-size: 0.8rem;
    font-weight: 700;
    text-decoration: none;
    transition: all var(--t-base);
    min-height: 36px;
    white-space: nowrap;
  }
  .nav-new-collab:hover { background: var(--signal-pale); box-shadow: var(--sh-sig); transform: translateY(-1px); }
</style>
<nav class="nav">
  <div class="nav-inner">
    <div style="display:flex;align-items:center;gap:16px;">
      <button class="btn btn-ghost mob-show" onclick="toggleSidebar()" style="padding:0;width:44px;height:44px;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;" aria-label="Open menu"><i class="fas fa-bars" style="font-size:1.125rem;"></i></button>
      <a href="/dashboard" class="nav-mark">
        <div class="nav-logo">
          <span class="nav-logo-text">AC</span>
          <div class="nav-logo-node"></div>
        </div>
        <span class="mob-hide">Artist Collab</span>
      </a>
    </div>

    <!-- Desktop nav links with dropdowns -->
    <ul class="nav-links mob-hide" style="gap:0;">
      <li><a href="/explore" class="nav-dropdown-trigger${active === 'explore' ? ' active' : ''}" style="${active === 'explore' ? 'color:var(--t1);' : ''}">Discover</a></li>
      <li><a href="/marketplace" class="nav-dropdown-trigger${active === 'marketplace' ? ' active' : ''}" style="${active === 'marketplace' ? 'color:var(--t1);' : ''}">Marketplace</a></li>
      <li><a href="/dashboard/projects" class="nav-dropdown-trigger${active === 'projects' ? ' active' : ''}" style="${active === 'projects' ? 'color:var(--t1);' : ''}">Projects</a></li>
      <li><a href="/dashboard/messages" class="nav-dropdown-trigger${active === 'messages' ? ' active' : ''}" style="${active === 'messages' ? 'color:var(--t1);' : ''}">
        Messages <span class="notif" style="position:static;margin-left:4px;">3</span>
      </a></li>
      <!-- More dropdown -->
      <li class="nav-dropdown">
        <button class="nav-dropdown-trigger">
          More <i class="fas fa-chevron-down dd-caret" style="margin-left:2px;"></i>
        </button>
        <div class="nav-dropdown-menu" style="left:auto;right:0;transform:none;">
          <a href="/session/p1" class="nav-dropdown-item">
            <span class="dd-icon"><i class="fas fa-circle" style="color:var(--channel);font-size:8px;"></i></span>
            Live Session
            <span class="notif" style="position:static;margin-left:auto;background:var(--channel);">LIVE</span>
          </a>
          <a href="/split-sheets" class="nav-dropdown-item">
            <span class="dd-icon"><i class="fas fa-chart-pie"></i></span>Split Sheets
          </a>
          <a href="/transparency" class="nav-dropdown-item">
            <span class="dd-icon"><i class="fas fa-shield-halved"></i></span>Transparency
          </a>
          <div class="nav-dropdown-divider"></div>
          <a href="/daw-companion" class="nav-dropdown-item">
            <span class="dd-icon"><i class="fas fa-laptop"></i></span>DAW Companion
          </a>
          <a href="/daw-bridge" class="nav-dropdown-item">
            <span class="dd-icon"><i class="fas fa-plug"></i></span>DAW Bridge
          </a>
          <div class="nav-dropdown-divider"></div>
          <a href="/dashboard/settings" class="nav-dropdown-item">
            <span class="dd-icon"><i class="fas fa-sliders-h"></i></span>Settings
          </a>
          <a href="/logout" class="nav-dropdown-item" style="color:var(--t3);">
            <span class="dd-icon"><i class="fas fa-arrow-right-from-bracket"></i></span>Sign Out
          </a>
        </div>
      </li>
    </ul>

    <div class="nav-cta" style="gap:10px;">
      <!-- Primary CTA: New Collab -->
      <a href="/explore" class="nav-new-collab mob-hide">
        <i class="fas fa-plus" style="font-size:10px;"></i>
        New Collab
      </a>
      <!-- User avatar dropdown -->
      <div class="nav-dropdown">
        <a href="/dashboard" class="nav-user" style="text-decoration:none;">
          <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop&crop=face" class="av av-xs" style="border:1.5px solid var(--c-rim);" alt="XAVI">
          <span style="font-size:0.8125rem;font-weight:600;color:var(--t2);" class="mob-hide">XAVI</span>
          <div class="node node-ok" style="margin-left:2px;width:6px;height:6px;"></div>
        </a>
        <div class="nav-dropdown-menu" style="right:0;left:auto;transform:none;min-width:180px;">
          <div style="padding:10px 12px 8px;border-bottom:1px solid var(--c-wire);margin-bottom:4px;">
            <div style="font-size:0.8125rem;font-weight:700;">XAVI</div>
            <div style="font-size:0.69rem;color:var(--t4);font-family:var(--font-mono);">@xavi_official</div>
          </div>
          <a href="/profile/me" class="nav-dropdown-item"><span class="dd-icon"><i class="fas fa-user"></i></span>My Profile</a>
          <a href="/dashboard/earnings" class="nav-dropdown-item"><span class="dd-icon"><i class="fas fa-dollar-sign"></i></span>Earnings</a>
          <a href="/dashboard/settings" class="nav-dropdown-item"><span class="dd-icon"><i class="fas fa-sliders-h"></i></span>Settings</a>
          <div class="nav-dropdown-divider"></div>
          <a href="/logout" class="nav-dropdown-item" style="color:var(--channel);"><span class="dd-icon"><i class="fas fa-arrow-right-from-bracket" style="color:var(--channel);"></i></span>Sign Out</a>
        </div>
      </div>
    </div>
  </div>
</nav>`;

// ─── App Sidebar ──────────────────────────────────────────────────────────────
export const appSidebar = (active = '') => `
<div class="sidebar-overlay" id="sidebar-overlay"></div>
<aside class="app-sidebar" id="app-sidebar">

  <!-- User block with profile link -->
  <a href="/profile/me" class="sb-user" style="text-decoration:none;display:flex;align-items:center;gap:9px;transition:background var(--t-fast);" onmouseover="this.style.background='var(--c-ghost)'" onmouseout="this.style.background='transparent'">
    <div style="position:relative;">
      <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop&crop=face" class="av av-sm" style="border:1.5px solid var(--c-rim);" alt="XAVI">
      <div class="node node-ok" style="position:absolute;bottom:0;right:0;width:7px;height:7px;border:2px solid var(--c-base);"></div>
    </div>
    <div style="min-width:0;flex:1;">
      <div style="font-weight:700;font-size:0.8125rem;letter-spacing:-0.01em;">XAVI</div>
      <div style="font-size:0.69rem;color:var(--t4);font-family:var(--font-mono);">@xavi_official</div>
    </div>
    <i class="fas fa-chevron-right" style="font-size:0.6rem;color:var(--t4);flex-shrink:0;margin-right:2px;"></i>
  </a>

  <!-- Primary CTA: always visible -->
  <div style="padding:10px 10px 6px;">
    <a href="/explore" class="btn btn-primary btn-w btn-sm" style="min-height:40px;font-size:0.8125rem;">
      <i class="fas fa-plus" style="font-size:10px;"></i>
      New Collaboration
    </a>
  </div>

  <div style="flex:1;overflow-y:auto;padding-bottom:16px;">

    <!-- WORK section: what you do every day -->
    <div class="sb-section">Work</div>
    <ul class="sb-nav">
      <li><a href="/dashboard" class="${active === 'home' ? 'on' : ''}"><span class="sb-icon"><i class="fas fa-grid-2"></i></span>Dashboard</a></li>
      <li><a href="/dashboard/projects" class="${active === 'projects' ? 'on' : ''}"><span class="sb-icon"><i class="fas fa-layer-group"></i></span>Projects<span class="notif">2</span></a></li>
      <li><a href="/dashboard/messages" class="${active === 'messages' ? 'on' : ''}"><span class="sb-icon"><i class="fas fa-comment-dots"></i></span>Messages<span class="notif">3</span></a></li>
      <li><a href="/dashboard/orders" class="${active === 'orders' ? 'on' : ''}"><span class="sb-icon"><i class="fas fa-receipt"></i></span>Orders</a></li>
      <li><a href="/session/p1" class="${active === 'session' ? 'on' : ''}"><span class="sb-icon"><i class="fas fa-circle" style="color:var(--channel);font-size:8px;"></i></span>Live Session<span class="notif" style="background:var(--channel);">LIVE</span></a></li>
    </ul>

    <!-- STUDIO section: your assets -->
    <div class="sb-section">Studio</div>
    <ul class="sb-nav">
      <li><a href="/dashboard/listings" class="${active === 'listings' ? 'on' : ''}"><span class="sb-icon"><i class="fas fa-list-ul"></i></span>My Services</a></li>
      <li><a href="/dashboard/earnings" class="${active === 'earnings' ? 'on' : ''}"><span class="sb-icon"><i class="fas fa-dollar-sign"></i></span>Earnings</a></li>
      <li><a href="/split-sheets" class="${active === 'splits' ? 'on' : ''}"><span class="sb-icon"><i class="fas fa-chart-pie"></i></span>Split Sheets</a></li>
    </ul>

    <!-- TOOLS section: expandable extras -->
    <div class="sb-section" style="cursor:pointer;display:flex;align-items:center;justify-content:space-between;padding-right:14px;" onclick="toggleSbTools(this)" id="sb-tools-toggle">
      <span>Tools</span>
      <i class="fas fa-chevron-down" style="font-size:0.55rem;transition:transform var(--t-fast);" id="sb-tools-caret"></i>
    </div>
    <ul class="sb-nav" id="sb-tools-list" style="display:none;">
      <li><a href="/transparency" class="${active === 'transparency' ? 'on' : ''}"><span class="sb-icon"><i class="fas fa-shield-halved"></i></span>Transparency</a></li>
      <li><a href="/nda" class="${active === 'nda' ? 'on' : ''}"><span class="sb-icon"><i class="fas fa-file-contract"></i></span>NDA & Agreements</a></li>
      <li><a href="/daw-companion" class="${active === 'companion' ? 'on' : ''}"><span class="sb-icon"><i class="fas fa-laptop"></i></span>DAW Companion</a></li>
      <li><a href="/daw-bridge" class="${active === 'daw-bridge' ? 'on' : ''}"><span class="sb-icon"><i class="fas fa-plug"></i></span>DAW Bridge</a></li>
    </ul>

  </div>

  <!-- Sidebar bottom: settings + sign out -->
  <div style="border-top:1px solid var(--c-wire);padding:6px;">
    <ul class="sb-nav" style="padding:0;">
      <li><a href="/dashboard/settings" class="${active === 'settings' ? 'on' : ''}"><span class="sb-icon"><i class="fas fa-sliders-h"></i></span>Settings</a></li>
      <li><a href="/logout" style="color:var(--t3);"><span class="sb-icon"><i class="fas fa-arrow-right-from-bracket"></i></span>Sign Out</a></li>
    </ul>
    <div style="padding:8px 10px 4px;">
      <div style="display:flex;align-items:center;gap:8px;">
        ${meterCluster(5, 3)}
        <span style="font-size:0.6rem;font-family:var(--font-mono);color:var(--t4);margin-left:4px;">SESSION · AC/1</span>
      </div>
    </div>
  </div>
</aside>
<script>
function toggleSbTools(el) {
  var list = document.getElementById('sb-tools-list');
  var caret = document.getElementById('sb-tools-caret');
  if (!list) return;
  var hidden = list.style.display === 'none';
  list.style.display = hidden ? 'block' : 'none';
  if (caret) caret.style.transform = hidden ? 'rotate(180deg)' : 'rotate(0deg)';
}
// Auto-expand Tools if a tools item is active
(function(){
  var list = document.getElementById('sb-tools-list');
  var caret = document.getElementById('sb-tools-caret');
  if (list && list.querySelector('.on')) {
    list.style.display = 'block';
    if (caret) caret.style.transform = 'rotate(180deg)';
  }
})();
</script>`;

// ─── Site Footer ──────────────────────────────────────────────────────────────
export const siteFooter = () => `
<footer class="footer">
  <div class="footer-grid">
    <div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        <div class="nav-logo" style="width:28px;height:28px;"><span class="nav-logo-text" style="font-size:0.6875rem;">AC</span><div class="nav-logo-node"></div></div>
        <span style="font-family:var(--font-display);font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;">Artist Collab</span>
      </div>
      <p style="font-size:0.875rem;color:var(--t3);line-height:1.7;max-width:260px;margin-bottom:20px;">
        Remote studio infrastructure for the modern music creator. Built for the session.
      </p>
      <div style="display:flex;gap:6px;">
        ${[['fab fa-instagram','#'],['fab fa-twitter','#'],['fab fa-tiktok','#'],['fab fa-spotify','#']].map(([ic]) => `
        <a href="#" style="width:40px;height:40px;background:var(--c-raised);border:1px solid var(--c-wire);border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;color:var(--t4);font-size:0.875rem;transition:all var(--t-fast);" onmouseover="this.style.color='var(--t1)';this.style.borderColor='rgba(255,255,255,0.12)'" onmouseout="this.style.color='var(--t4)';this.style.borderColor='var(--c-wire)'">
          <i class="${ic}"></i>
        </a>`).join('')}
      </div>
    </div>
    <div>
      <div class="footer-head">Platform</div>
      <a href="/explore" class="footer-link">Find Artists</a>
      <a href="/marketplace" class="footer-link">Browse Services</a>
      <a href="/session/p1" class="footer-link">Live Session Room</a>
      <a href="/daw-companion" class="footer-link">DAW Companion</a>
      <a href="/how-it-works" class="footer-link">How It Works</a>
      <a href="/signup" class="footer-link">Join as Artist</a>
    </div>
    <div>
      <div class="footer-head">Support</div>
      <a href="/contact" class="footer-link">Contact</a>
      <a href="#" class="footer-link">Help Center</a>
      <a href="#" class="footer-link">Trust & Safety</a>
    </div>
    <div>
      <div class="footer-head">Legal</div>
      <a href="/terms" class="footer-link">Terms</a>
      <a href="/privacy" class="footer-link">Privacy</a>
      <a href="#" class="footer-link">Cookies</a>
    </div>
  </div>
  <div class="footer-bottom">
    <span style="font-size:0.8125rem;color:var(--t4);font-family:var(--font-mono);">© 2026 Artist Collab · artistcollab.studio</span>
    <span style="font-size:0.8125rem;color:var(--t4);">Built for the session.</span>
  </div>
</footer>`;

// ─── Compatibility Aliases ────────────────────────────────────────────────────
export const DESIGN_SYSTEM = AC_SYSTEM;
export const head = (title: string, extra = '') => shell(title, extra);
export const nav = (active = '') => publicNav(active);
export const footer = () => siteFooter();
export const closeHTML = () => closeShell();
export const dashboardSidebar = appSidebar;
