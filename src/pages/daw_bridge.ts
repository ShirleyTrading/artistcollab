import { shell, closeShell, authedNav, siteFooter } from '../layout';

// ─── DAW Bridge Architecture Page (Phase 3) ───────────────────────────────────
// Pro Tools / Ableton / Logic / FL Studio integration strategy
// Plug-in format support: AAX / AU / VST3
// Roadmap item #21: DAW Bridge + Immersive Session Architecture

const DB_STYLES = `
  .db-hero {
    background: var(--c-void);
    border-bottom: 1px solid var(--c-wire);
    padding: 80px 24px 60px;
    position: relative;
    overflow: hidden;
  }
  .db-hero-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,140,66,0.04) 0%, transparent 70%);
    pointer-events: none;
  }
  .db-section {
    max-width: 1160px;
    margin: 0 auto;
    padding: 64px 24px;
  }
  .db-daw-card {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    overflow: hidden;
    transition: border-color var(--t-base), transform var(--t-base);
  }
  .db-daw-card:hover {
    border-color: rgba(255,255,255,0.09);
    transform: translateY(-2px);
  }
  .db-daw-head {
    padding: 16px 20px;
    border-bottom: 1px solid var(--c-wire);
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .db-daw-body {
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .db-feature-row {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    font-size: 0.8125rem;
    color: var(--t3);
    line-height: 1.5;
  }
  .db-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: var(--r-full);
    font-family: var(--font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 700;
    border: 1px solid;
  }
  .db-tag-aax  { background: rgba(0,194,255,0.08); border-color: rgba(0,194,255,0.22); color: var(--patch); }
  .db-tag-au   { background: rgba(255,140,66,0.08); border-color: rgba(255,140,66,0.22); color: var(--warm); }
  .db-tag-vst3 { background: var(--signal-dim); border-color: rgba(200,255,0,0.22); color: var(--signal); }
  .db-tag-link { background: rgba(255,77,109,0.08); border-color: rgba(255,77,109,0.22); color: var(--channel); }
  .db-tag-script { background: rgba(82,82,106,0.2); border-color: var(--c-rim); color: var(--t3); }
  .db-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: var(--font-mono);
    font-size: 0.58rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 700;
  }
  .db-status-planned { color: var(--t4); }
  .db-status-dev     { color: var(--warm); }
  .db-status-beta    { color: var(--patch); }
  .db-status-live    { color: var(--s-ok); }
  /* Architecture diagram */
  .db-arch-layer {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    padding: 16px 20px;
    margin-bottom: 4px;
  }
  .db-arch-label {
    font-family: var(--font-mono);
    font-size: 0.58rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--t4);
    margin-bottom: 10px;
  }
  .db-arch-boxes {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .db-arch-box {
    padding: 7px 14px;
    border-radius: var(--r-sm);
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  /* Connector arrow */
  .db-connector {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    color: var(--t4);
    font-size: 0.875rem;
  }
  /* Principle card */
  .db-principle {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-left: 3px solid var(--signal);
    border-radius: 0 var(--r-lg) var(--r-lg) 0;
    padding: 16px 20px;
    margin-bottom: 12px;
  }
  /* Phase badge */
  .db-phase {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px;
    border-radius: var(--r-full);
    font-family: var(--font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 700;
  }
  .db-phase-3 { background: rgba(255,140,66,0.1); color: var(--warm); border: 1px solid rgba(255,140,66,0.2); }
  /* Journey flow */
  .db-journey {
    display: flex;
    gap: 0;
    overflow-x: auto;
    scrollbar-width: none;
    padding: 0 0 4px;
  }
  .db-journey::-webkit-scrollbar { display: none; }
  .db-journey-step {
    display: flex;
    align-items: center;
    gap: 0;
    flex-shrink: 0;
  }
  .db-journey-node {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-md);
    padding: 10px 16px;
    font-size: 0.8125rem;
    font-weight: 600;
    white-space: nowrap;
    text-align: center;
    min-width: 130px;
  }
  .db-journey-node.active {
    background: var(--signal-dim);
    border-color: rgba(200,255,0,0.3);
    color: var(--signal);
  }
  .db-journey-arr {
    padding: 0 6px;
    color: var(--t4);
    font-size: 0.75rem;
  }

  @media (max-width: 900px) {
    .db-daw-grid { grid-template-columns: 1fr !important; }
    .db-hero { padding: 48px 20px 40px; }
    .db-section { padding: 40px 20px; }
  }
`;

export function dawBridgePage(): string {
  return shell('DAW Bridge Architecture — Artist Collab', DB_STYLES) + authedNav() + `

<!-- ══ HERO ════════════════════════════════════════════════════════════════ -->
<div class="db-hero">
  <div class="db-hero-bg"></div>
  <div style="max-width:800px;margin:0 auto;position:relative;">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;flex-wrap:wrap;">
      <span class="db-phase db-phase-3"><i class="fas fa-circle" style="font-size:6px;"></i> Phase 3 — Roadmap</span>
      <span style="font-family:var(--font-mono);font-size:0.6rem;color:var(--t4);">Roadmap Item #21 — DAW Bridge + Immersive Session Architecture</span>
    </div>
    <h1 style="font-family:var(--font-display);font-size:clamp(2rem,5vw,3.25rem);font-weight:800;letter-spacing:-0.03em;margin:0 0 16px;line-height:1.05;">
      ArtistCollab as the Collaboration Layer.<br>
      <span style="color:var(--warm);">Not the DAW Replacement.</span>
    </h1>
    <p style="font-size:1.0625rem;color:var(--t3);line-height:1.75;margin:0 0 20px;max-width:640px;">
      The platform's long-term architecture connects to major DAW workflows through bridges — Pro Tools scripting, Ableton Link, Audio Units, VST3 — while owning the layer that DAWs were never designed to handle: collaboration, approval, ownership, and payment.
    </p>
    <div style="padding:16px 20px;background:rgba(255,140,66,0.06);border:1px solid rgba(255,140,66,0.2);border-radius:var(--r-lg);font-size:0.875rem;color:var(--t3);line-height:1.65;max-width:640px;">
      <i class="fas fa-lightbulb" style="color:var(--warm);margin-right:8px;"></i>
      <strong style="color:var(--t2);">The most important product decision:</strong>
      ArtistCollab should own the collaboration workflow, not replace the DAW. The DAW records. ArtistCollab controls who approves the take, who owns the file, and when the money moves.
    </div>
  </div>
</div>

<!-- ══ THE COLLABORATION LAYER ════════════════════════════════════════════ -->
<div style="background:var(--c-base);border-bottom:1px solid var(--c-wire);">
  <div class="db-section" style="padding-top:48px;padding-bottom:48px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px;">
      <div style="height:1px;width:20px;background:var(--signal);box-shadow:0 0 5px var(--signal);"></div>
      <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--signal);">Architecture — What Each Layer Owns</span>
    </div>

    <!-- Architecture stack diagram -->
    <div style="max-width:680px;">
      <!-- DAW layer -->
      <div class="db-arch-layer" style="border-top:2px solid var(--patch);">
        <div class="db-arch-label"><i class="fas fa-sliders-h" style="color:var(--patch);margin-right:6px;"></i>DAW Layer — You Own This</div>
        <div class="db-arch-boxes">
          ${['Recording', 'Mixing', 'MIDI', 'Plug-ins', 'Arrangement', 'Automation', 'Export'].map(b =>
            `<div class="db-arch-box" style="background:rgba(0,194,255,0.06);border-color:rgba(0,194,255,0.2);color:var(--patch);">${b}</div>`
          ).join('')}
        </div>
      </div>
      <div class="db-connector"><i class="fas fa-arrows-up-down"></i></div>

      <!-- Bridge layer -->
      <div class="db-arch-layer" style="border-top:2px solid var(--warm);">
        <div class="db-arch-label"><i class="fas fa-plug" style="color:var(--warm);margin-right:6px;"></i>Bridge Layer — Connector</div>
        <div class="db-arch-boxes">
          ${[
            { label:'AAX Plug-in',  tag:'Pro Tools',  color:'var(--patch)' },
            { label:'AU Extension', tag:'Logic',       color:'var(--warm)' },
            { label:'VST3',         tag:'Ableton / FL',color:'var(--signal)' },
            { label:'Link SDK',     tag:'Tempo Sync',  color:'var(--channel)' },
            { label:'Script API',   tag:'Automation',  color:'var(--t3)' },
          ].map(b => `
          <div class="db-arch-box" style="background:rgba(255,140,66,0.06);border-color:rgba(255,140,66,0.2);color:var(--warm);">
            <span style="font-size:0.72rem;">${b.label}</span>
            <span style="font-size:0.6rem;color:${b.color};font-family:var(--font-mono);">${b.tag}</span>
          </div>`).join('')}
        </div>
      </div>
      <div class="db-connector"><i class="fas fa-arrows-up-down"></i></div>

      <!-- ArtistCollab layer -->
      <div class="db-arch-layer" style="border-top:2px solid var(--signal);">
        <div class="db-arch-label"><i class="fas fa-layer-group" style="color:var(--signal);margin-right:6px;"></i>ArtistCollab Layer — We Own This</div>
        <div class="db-arch-boxes">
          ${['Session Room', 'Take Approvals', 'Split Sheets', 'Escrow', 'Stem Vault', 'Audience Mode', 'NDA & Agreements', 'Ownership Registry'].map(b =>
            `<div class="db-arch-box" style="background:var(--signal-dim);border-color:rgba(200,255,0,0.22);color:var(--signal);">${b}</div>`
          ).join('')}
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ══ USER JOURNEY ═══════════════════════════════════════════════════════ -->
<div class="db-section">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px;">
    <div style="height:1px;width:20px;background:var(--warm);"></div>
    <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--warm);">The Simple Experience</span>
  </div>
  <div class="db-journey">
    ${[
      'Start Collaboration',
      'Choose Collaborators',
      'Choose DAW / Workflow',
      'Join Live Session',
      'Record',
      'Review Takes',
      'Approve Deliverables',
      'Escrow Releases',
    ].map((step, i) => `
    <div class="db-journey-step">
      <div class="db-journey-node${i === 4 ? ' active' : ''}" style="border-top:2px solid ${i === 4 ? 'var(--signal)' : 'transparent'};">
        <div style="font-family:var(--font-mono);font-size:0.55rem;color:var(--t4);margin-bottom:3px;">${String(i+1).padStart(2,'0')}</div>
        ${step}
      </div>
      ${i < 7 ? `<div class="db-journey-arr"><i class="fas fa-chevron-right"></i></div>` : ''}
    </div>`).join('')}
  </div>
</div>

<!-- ══ DAW-SPECIFIC INTEGRATION CARDS ════════════════════════════════════ -->
<div style="background:var(--c-base);border-top:1px solid var(--c-wire);border-bottom:1px solid var(--c-wire);">
  <div class="db-section" style="padding-top:48px;padding-bottom:48px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
      <div style="height:1px;width:20px;background:var(--patch);"></div>
      <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--patch);">DAW-Specific Integration Paths</span>
    </div>

    <div class="db-daw-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:20px;">

      <!-- Pro Tools -->
      <div class="db-daw-card" style="border-top:3px solid var(--patch);">
        <div class="db-daw-head">
          <div style="width:40px;height:40px;background:rgba(0,194,255,0.1);border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="fas fa-sliders-h" style="color:var(--patch);font-size:1rem;"></i>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:1rem;font-weight:700;margin-bottom:4px;">Pro Tools</div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;">
              <span class="db-tag db-tag-aax">AAX</span>
              <span class="db-tag db-tag-script">Scripting</span>
              <span class="db-status db-status-planned"><i class="fas fa-clock" style="font-size:7px;"></i> Phase 3</span>
            </div>
          </div>
        </div>
        <div class="db-daw-body">
          ${[
            { icon:'fa-puzzle-piece', text:'<strong>AAX-compatible strategy</strong> — AC Bridge plug-in built as AAX for Pro Tools HD/Ultimate/Artist. Sits in your I/O chain, routes signals to session room' },
            { icon:'fa-code',         text:'<strong>Workflow scripting automation</strong> — Avid\'s EuControl + macOS scripting APIs automate track naming, routing, and bounce triggers from AC' },
            { icon:'fa-layer-group',  text:'<strong>Bounce integration</strong> — Script hook detects Pro Tools bounce-to-disk and auto-uploads to the linked ArtistCollab project' },
            { icon:'fa-shield-alt',   text:'<strong>Session metadata extraction</strong> — Reads session BPM, key, track names, and region markers into the Stem Vault automatically' },
          ].map(f => `
          <div class="db-feature-row">
            <i class="fas ${f.icon}" style="color:var(--patch);font-size:0.75rem;flex-shrink:0;margin-top:2px;"></i>
            <span>${f.text}</span>
          </div>`).join('')}
        </div>
      </div>

      <!-- Ableton Live -->
      <div class="db-daw-card" style="border-top:3px solid var(--channel);">
        <div class="db-daw-head">
          <div style="width:40px;height:40px;background:rgba(255,77,109,0.1);border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="fas fa-music" style="color:var(--channel);font-size:1rem;"></i>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:1rem;font-weight:700;margin-bottom:4px;">Ableton Live</div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;">
              <span class="db-tag db-tag-link">Link</span>
              <span class="db-tag db-tag-vst3">VST3</span>
              <span class="db-status db-status-planned"><i class="fas fa-clock" style="font-size:7px;"></i> Phase 3</span>
            </div>
          </div>
        </div>
        <div class="db-daw-body">
          ${[
            { icon:'fa-link',          text:'<strong>Ableton Link integration</strong> — AC session clock joins the Link network. All Link-enabled devices in the room stay on the same tempo and phase automatically' },
            { icon:'fa-sync-alt',      text:'<strong>Session / Arrangement sync</strong> — Ableton scene launches broadcast to session participants via Link; everyone\'s arrangement follows the host\'s transport' },
            { icon:'fa-puzzle-piece',  text:'<strong>VST3 plug-in</strong> — AC Bridge as a VST3 instrument/effect device in Ableton\'s rack, handles audio routing and talkback from within the session' },
            { icon:'fa-comment-dots',  text:'<strong>Max for Live device</strong> — Optional M4L device for deep integration: real-time collaborator status, take markers, and split approval triggers inside Live\'s UI' },
          ].map(f => `
          <div class="db-feature-row">
            <i class="fas ${f.icon}" style="color:var(--channel);font-size:0.75rem;flex-shrink:0;margin-top:2px;"></i>
            <span>${f.text}</span>
          </div>`).join('')}
        </div>
      </div>

      <!-- Logic Pro -->
      <div class="db-daw-card" style="border-top:3px solid var(--warm);">
        <div class="db-daw-head">
          <div style="width:40px;height:40px;background:rgba(255,140,66,0.1);border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="fas fa-wave-square" style="color:var(--warm);font-size:1rem;"></i>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:1rem;font-weight:700;margin-bottom:4px;">Logic Pro</div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;">
              <span class="db-tag db-tag-au">AU</span>
              <span class="db-status db-status-planned"><i class="fas fa-clock" style="font-size:7px;"></i> Phase 3</span>
            </div>
          </div>
        </div>
        <div class="db-daw-body">
          ${[
            { icon:'fa-puzzle-piece', text:'<strong>Audio Units (AU) plug-in</strong> — AC Bridge built as a full AU instrument/MIDI FX for Logic Pro on Apple Silicon and Intel Mac' },
            { icon:'fa-apple',        text:'<strong>macOS Core Audio routing</strong> — Virtual audio device integrates natively with macOS, zero additional drivers needed for Logic workflows' },
            { icon:'fa-share-nodes',  text:'<strong>AirDrop-style stem push</strong> — Completed Logic bounces trigger an AC stem upload automatically via file-system watcher and Logic\'s bounce callback' },
            { icon:'fa-keyboard',     text:'<strong>Control Surface mapping</strong> — Logic\'s MIDI controller assignments can be mapped to AC actions: talkback, take mark, approve, next section' },
          ].map(f => `
          <div class="db-feature-row">
            <i class="fas ${f.icon}" style="color:var(--warm);font-size:0.75rem;flex-shrink:0;margin-top:2px;"></i>
            <span>${f.text}</span>
          </div>`).join('')}
        </div>
      </div>

      <!-- FL Studio -->
      <div class="db-daw-card" style="border-top:3px solid var(--signal);">
        <div class="db-daw-head">
          <div style="width:40px;height:40px;background:var(--signal-dim);border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="fas fa-drum" style="color:var(--signal);font-size:1rem;"></i>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:1rem;font-weight:700;margin-bottom:4px;">FL Studio</div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;">
              <span class="db-tag db-tag-vst3">VST3</span>
              <span class="db-tag db-tag-au">AU</span>
              <span class="db-status db-status-planned"><i class="fas fa-clock" style="font-size:7px;"></i> Phase 3</span>
            </div>
          </div>
        </div>
        <div class="db-daw-body">
          ${[
            { icon:'fa-puzzle-piece', text:'<strong>VST3 / AU workflow support</strong> — AC Bridge plug-in loads in FL\'s mixer or instrument channel. Routes session audio to AC room and handles talkback return' },
            { icon:'fa-network-wired',text:'<strong>FL Studio Link protocol</strong> — Image-Line\'s mobile/desktop sync protocol integration for beat-makers working across FL Mobile + Desktop setups' },
            { icon:'fa-file-export',  text:'<strong>FL Pattern export hook</strong> — Export patterns/stems from FL\'s project directly to the AC Stem Vault, tagged with BPM and key automatically' },
            { icon:'fa-users',        text:'<strong>Producer-first UX</strong> — FL users often work solo and share beats later. AC\'s async approval flow matches this: upload beats, collaborators review on their schedule' },
          ].map(f => `
          <div class="db-feature-row">
            <i class="fas ${f.icon}" style="color:var(--signal);font-size:0.75rem;flex-shrink:0;margin-top:2px;"></i>
            <span>${f.text}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ══ PLUG-IN FORMAT STRATEGY ═══════════════════════════════════════════ -->
<div class="db-section">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
    <div style="height:1px;width:20px;background:var(--signal);"></div>
    <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--signal);">Plug-in Format Strategy</span>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin-bottom:40px;">
    ${[
      {
        tag: 'AAX', tagCls: 'db-tag-aax', color: 'var(--patch)',
        title: 'AAX — Avid Audio Extension',
        daw: 'Pro Tools only',
        icon: 'fa-sliders-h',
        points: [
          'Requires Avid certification (paid program)',
          'Supports TDM/DSP cards (Pro Tools HD)',
          'AC Bridge as AAX Native + AAX DSP',
          'Certification path: Avid Marketplace listing',
          'Strategy: Partner via Avid\'s dev program',
        ],
      },
      {
        tag: 'AU', tagCls: 'db-tag-au', color: 'var(--warm)',
        title: 'Audio Units (AU)',
        daw: 'Logic, GarageBand, Ableton (macOS)',
        icon: 'fa-apple',
        points: [
          'Apple framework — macOS/iOS only',
          'Distributed via App Store or direct install',
          'Uses AUv3 standard for sandboxed operation',
          'Notarized via Apple Developer Program',
          'Core Audio virtual device + AU plug-in bundle',
        ],
      },
      {
        tag: 'VST3', tagCls: 'db-tag-vst3', color: 'var(--signal)',
        title: 'VST3 — Steinberg Standard',
        daw: 'Ableton, FL Studio, Cubase, Reaper, others',
        icon: 'fa-puzzle-piece',
        points: [
          'Free Steinberg VST3 SDK (open source)',
          'Cross-platform: macOS, Windows, Linux',
          'Widest DAW compatibility in the industry',
          'Supports MIDI, audio I/O, and side-chain',
          'Primary format for the AC Bridge plug-in',
        ],
      },
    ].map(fmt => `
    <div class="db-daw-card">
      <div class="db-daw-head" style="border-top:2px solid ${fmt.color};">
        <div style="width:40px;height:40px;background:${fmt.color}14;border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i class="fas ${fmt.icon}" style="color:${fmt.color};font-size:1rem;"></i>
        </div>
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span class="db-tag ${fmt.tagCls}">${fmt.tag}</span>
            <span style="font-size:0.9rem;font-weight:700;">${fmt.title}</span>
          </div>
          <div style="font-size:0.75rem;color:var(--t4);">${fmt.daw}</div>
        </div>
      </div>
      <div class="db-daw-body">
        ${fmt.points.map(p => `
        <div class="db-feature-row">
          <i class="fas fa-circle" style="color:${fmt.color};font-size:5px;flex-shrink:0;margin-top:5px;"></i>
          <span>${p}</span>
        </div>`).join('')}
      </div>
    </div>`).join('')}
  </div>

  <!-- Licensing framework note -->
  <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-top:2px solid var(--warm);border-radius:var(--r-lg);padding:24px;">
    <div style="display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap;">
      <div style="width:40px;height:40px;background:rgba(255,140,66,0.1);border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <i class="fas fa-balance-scale" style="color:var(--warm);font-size:1rem;"></i>
      </div>
      <div style="flex:1;min-width:240px;">
        <h3 style="font-size:1rem;font-weight:700;margin:0 0 8px;">Plug-in Licensing Framework</h3>
        <p style="font-size:0.875rem;color:var(--t3);line-height:1.65;margin:0 0 12px;">The AC Bridge plug-in will be distributed as a free download, tied to an ArtistCollab account. Activation requires a valid AC Pro or Studio subscription. Enterprise studios receive a site license covering all DAW formats and unlimited seats.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${['Free tier (limited sessions)', 'Pro — $19/mo (unlimited)', 'Studio — $49/mo (multi-engineer)', 'Enterprise — custom'].map(t =>
            `<span class="db-tag db-tag-script">${t}</span>`
          ).join('')}
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ══ DESIGN PRINCIPLES ══════════════════════════════════════════════════ -->
<div style="background:var(--c-base);border-top:1px solid var(--c-wire);">
  <div class="db-section" style="padding-top:48px;padding-bottom:48px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px;">
      <div style="height:1px;width:20px;background:var(--signal);"></div>
      <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--signal);">Platform Priorities</span>
    </div>
    <div style="max-width:720px;">
      ${[
        { num:'01', color:'var(--signal)', title:'Real-time, low-latency session rooms first',       body:'The live session experience must be flawless before DAW integrations ship. A broken WebRTC room with Pro Tools support is worse than a great WebRTC room without it.' },
        { num:'02', color:'var(--patch)',  title:'Clean audio routing by role',                      body:'Every role — host, artist, engineer, audience — hears exactly what they\'re supposed to hear. No bleed, no confusion, no configuration. It just works.' },
        { num:'03', color:'var(--warm)',   title:'Stem and session file exchange as the core loop',  body:'Every file that moves between collaborators goes through ArtistCollab. That\'s the audit trail, the approval record, and the ownership evidence — all in one place.' },
        { num:'04', color:'var(--signal)', title:'Synchronized review before DAW-specific work',    body:'Deep DAW integrations come after the core approval and ownership workflows are solid. Phase 3 accelerates what already works — it doesn\'t invent new workflows.' },
        { num:'05', color:'var(--patch)',  title:'DAW companion tools as acceleration, not core',   body:'The companion app makes the existing AC platform faster to use. Removing it should not break any collaboration workflow.' },
        { num:'06', color:'var(--warm)',   title:'Deeper DAW integrations last',                    body:'AAX certification, Link SDK, and AU/VST3 publishing are production infrastructure. They require legal agreements and developer programs. Phase 3 — after the product earns the right.' },
      ].map(p => `
      <div class="db-principle">
        <div style="display:flex;align-items:flex-start;gap:16px;">
          <div style="font-family:var(--font-display);font-size:1.25rem;font-weight:800;color:${p.color};opacity:0.4;line-height:1;width:28px;flex-shrink:0;">${p.num}</div>
          <div>
            <div style="font-size:0.9375rem;font-weight:700;margin-bottom:5px;">${p.title}</div>
            <div style="font-size:0.8125rem;color:var(--t3);line-height:1.65;">${p.body}</div>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</div>

${siteFooter()}
${closeShell()}`;
}
