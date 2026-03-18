import { shell, closeShell, authedNav, siteFooter } from '../layout';

// ─── DAW Companion Page (Phase 2) ────────────────────────────────────────────
// Desktop app landing + session playback sync UI + engineer talkback +
// one-click bounce/export into project room

const DC_STYLES = `
  .dc-hero {
    background: var(--c-void);
    border-bottom: 1px solid var(--c-wire);
    padding: 80px 24px 60px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .dc-hero-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,255,0,0.04) 0%, transparent 70%);
    pointer-events: none;
  }
  .dc-section {
    max-width: 1160px;
    margin: 0 auto;
    padding: 64px 24px;
  }
  .dc-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: center;
  }
  .dc-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .dc-card {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    padding: 24px;
    transition: border-color var(--t-base), transform var(--t-base);
  }
  .dc-card:hover {
    border-color: rgba(255,255,255,0.09);
    transform: translateY(-2px);
  }
  .dc-card-top {
    background: var(--c-raised);
    border-top: 1px solid var(--c-wire);
  }
  .dc-step-num {
    font-family: var(--font-display);
    font-size: 3rem;
    font-weight: 800;
    letter-spacing: -0.05em;
    color: var(--signal);
    opacity: 0.25;
    line-height: 1;
    margin-bottom: 8px;
  }
  /* Audio routing diagram */
  .dc-routing {
    background: var(--c-base);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    padding: 24px;
    font-family: var(--font-mono);
  }
  .dc-node {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border-radius: var(--r-md);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: 1px solid;
    white-space: nowrap;
  }
  .dc-node-daw    { background: rgba(0,194,255,0.08); border-color: rgba(0,194,255,0.25); color: var(--patch); }
  .dc-node-ac     { background: var(--signal-dim); border-color: rgba(200,255,0,0.25); color: var(--signal); }
  .dc-node-eng    { background: rgba(255,140,66,0.08); border-color: rgba(255,140,66,0.25); color: var(--warm); }
  .dc-node-artist { background: rgba(255,77,109,0.08); border-color: rgba(255,77,109,0.25); color: var(--channel); }
  .dc-node-aud    { background: rgba(82,82,106,0.15); border-color: var(--c-rim); color: var(--t4); }
  .dc-arrow {
    display: flex;
    align-items: center;
    color: var(--t4);
    font-size: 0.65rem;
    gap: 4px;
  }
  .dc-arrow-line {
    flex: 1;
    height: 1px;
    background: var(--c-rim);
    position: relative;
  }
  .dc-arrow-line::after {
    content: '';
    position: absolute;
    right: 0; top: -3px;
    width: 0; height: 0;
    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;
    border-left: 5px solid var(--c-rim);
  }
  /* Download button mock */
  .dc-dl-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 28px;
    background: var(--signal);
    color: #000;
    border-radius: var(--r);
    font-weight: 800;
    font-size: 0.9375rem;
    cursor: pointer;
    border: none;
    text-decoration: none;
    transition: opacity var(--t-fast), transform var(--t-fast);
    font-family: var(--font-body);
  }
  .dc-dl-btn:hover { opacity: 0.88; transform: translateY(-1px); }
  .dc-dl-ghost {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 13px 24px;
    background: transparent;
    color: var(--t2);
    border: 1px solid var(--c-wire);
    border-radius: var(--r);
    font-weight: 600;
    font-size: 0.9375rem;
    cursor: pointer;
    text-decoration: none;
    transition: border-color var(--t-fast);
    font-family: var(--font-body);
  }
  .dc-dl-ghost:hover { border-color: var(--t3); }
  /* Feature pill row */
  .dc-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: var(--r-full);
    background: var(--c-raised);
    border: 1px solid var(--c-wire);
    font-size: 0.75rem;
    color: var(--t3);
  }
  /* Sync status bar mock */
  .dc-sync-bar {
    background: var(--c-base);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    overflow: hidden;
  }
  .dc-sync-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--c-wire);
    font-size: 0.8125rem;
  }
  .dc-sync-row:last-child { border-bottom: none; }
  .dc-dot-ok  { width:8px;height:8px;border-radius:50%;background:var(--s-ok);box-shadow:0 0 6px rgba(45,202,114,0.5);flex-shrink:0; }
  .dc-dot-warn{ width:8px;height:8px;border-radius:50%;background:var(--warm);flex-shrink:0; }
  .dc-dot-off { width:8px;height:8px;border-radius:50%;background:var(--c-rim);flex-shrink:0; }
  /* Phase badge */
  .dc-phase-badge {
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
  .dc-phase-1 { background: var(--signal-dim); color: var(--signal); border: 1px solid rgba(200,255,0,0.25); }
  .dc-phase-2 { background: rgba(0,194,255,0.1); color: var(--patch); border: 1px solid rgba(0,194,255,0.2); }
  .dc-phase-3 { background: rgba(255,140,66,0.1); color: var(--warm); border: 1px solid rgba(255,140,66,0.2); }

  @media (max-width: 900px) {
    .dc-grid-2 { grid-template-columns: 1fr; gap: 32px; }
    .dc-grid-3 { grid-template-columns: 1fr; }
    .dc-hero { padding: 48px 20px 40px; }
    .dc-section { padding: 40px 20px; }
  }
`;

export function dawCompanionPage(): string {
  return shell('DAW Companion — Artist Collab', DC_STYLES) + authedNav() + `

<!-- ══ HERO ════════════════════════════════════════════════════════════════ -->
<div class="dc-hero">
  <div class="dc-hero-bg"></div>
  <div style="max-width:720px;margin:0 auto;position:relative;">
    <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:20px;">
      <span class="dc-phase-badge dc-phase-2"><i class="fas fa-circle" style="font-size:6px;"></i> Phase 2 — Coming Soon</span>
    </div>
    <h1 style="font-family:var(--font-display);font-size:clamp(2.25rem,5vw,3.5rem);font-weight:800;letter-spacing:-0.03em;margin:0 0 16px;line-height:1.05;">
      Your DAW.<br>Our Collaboration Layer.
    </h1>
    <p style="font-size:1.0625rem;color:var(--t3);line-height:1.75;margin:0 0 32px;max-width:560px;margin-left:auto;margin-right:auto;">
      The ArtistCollab Desktop Companion sits alongside your existing DAW — Pro Tools, Ableton, Logic, FL Studio — and adds real-time collaboration, take approval, escrow, and split sheets without changing how you work.
    </p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
      <button class="dc-dl-btn" onclick="alert('Join the waitlist to get early access when the desktop companion launches.')">
        <i class="fas fa-download"></i> Join the Waitlist
      </button>
      <a href="/session/p1" class="dc-dl-ghost">
        <i class="fas fa-play-circle"></i> Try Live Session Now
      </a>
    </div>
    <!-- Platform pills -->
    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:24px;">
      ${['macOS 13+', 'Windows 11', 'Pro Tools', 'Ableton', 'Logic Pro', 'FL Studio'].map(p =>
        `<span class="dc-pill"><i class="fas fa-check" style="color:var(--signal);font-size:9px;"></i>${p}</span>`
      ).join('')}
    </div>
  </div>
</div>

<!-- ══ WHAT IT CONTROLS ═══════════════════════════════════════════════════ -->
<div style="background:var(--c-base);border-bottom:1px solid var(--c-wire);">
  <div class="dc-section" style="padding-top:48px;padding-bottom:48px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
      <div style="height:1px;width:20px;background:var(--signal);box-shadow:0 0 5px var(--signal);"></div>
      <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--signal);">What ArtistCollab Owns</span>
    </div>
    <div class="dc-grid-3">
      ${[
        { icon: 'fa-users',         color: 'var(--signal)', title: 'Who Is In the Room',      desc: 'Invite, role-assign, and remove participants. Audience mode lets fans watch without access to files or chat.' },
        { icon: 'fa-headphones',    color: 'var(--patch)',  title: 'Who Can Hear What',        desc: 'Per-role audio routing. Engineers get talkback. Artists get the mix. Audience gets a broadcast-quality feed.' },
        { icon: 'fa-folder-check',  color: 'var(--warm)',   title: 'What Files Are Official',  desc: 'Every stem, bounce, and export goes through the Stem Vault. Nothing is "official" until it\'s approved.' },
        { icon: 'fa-check-double',  color: 'var(--signal)', title: 'Who Approved the Take',    desc: 'All collaborators must approve a take before it advances. One rejection flags it for a re-record.' },
        { icon: 'fa-chart-pie',     color: 'var(--patch)',  title: 'Who Owns What',            desc: 'Ownership splits are agreed upfront, signed digitally, and locked into an immutable split sheet.' },
        { icon: 'fa-shield-alt',    color: 'var(--warm)',   title: 'When Payment Releases',    desc: 'Escrow only releases when the release gate is open — all approvals in, all splits signed, gate unlocked.' },
        { icon: 'fa-eye',           color: 'var(--signal)', title: 'Audience Access',          desc: 'Host controls audience toggle in real time. Audience sees the session stream; they never see files or chat.' },
      ].map(item => `
      <div class="dc-card" style="border-top:2px solid ${item.color}30;">
        <div style="width:40px;height:40px;background:${item.color}14;border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;margin-bottom:14px;">
          <i class="fas ${item.icon}" style="color:${item.color};font-size:1rem;"></i>
        </div>
        <h3 style="font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;margin:0 0 8px;">${item.title}</h3>
        <p style="font-size:0.8125rem;color:var(--t3);line-height:1.65;margin:0;">${item.desc}</p>
      </div>`).join('')}
    </div>
  </div>
</div>

<!-- ══ AUDIO ROUTING DIAGRAM ══════════════════════════════════════════════ -->
<div class="dc-section">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start;">
    <div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
        <div style="height:1px;width:20px;background:var(--patch);"></div>
        <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--patch);">Local Audio Routing</span>
      </div>
      <h2 style="font-family:var(--font-display);font-size:1.875rem;font-weight:800;letter-spacing:-0.025em;margin:0 0 16px;line-height:1.1;">The Companion Bridges Your DAW to the Session</h2>
      <p style="font-size:0.9375rem;color:var(--t3);line-height:1.75;margin:0 0 20px;">The desktop app creates a virtual audio device that your DAW sends its output to. ArtistCollab routes that signal to the right ears — no patch cables, no complex interfaces.</p>
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px;">
        ${[
          'Virtual audio device (Core Audio / ASIO) — zero extra hardware',
          'Per-role sends: artist mix, engineer cue, talkback channel, audience mix',
          'Local monitoring stays in your DAW — zero latency',
          'Remote participants get ArtistCollab cloud routing',
        ].map(t => `
        <li style="display:flex;align-items:flex-start;gap:10px;font-size:0.875rem;color:var(--t3);">
          <i class="fas fa-check-circle" style="color:var(--signal);font-size:0.75rem;margin-top:2px;flex-shrink:0;"></i>${t}
        </li>`).join('')}
      </ul>
    </div>

    <!-- Routing Diagram -->
    <div class="dc-routing">
      <div style="font-size:0.6rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--t4);margin-bottom:16px;">Signal Flow</div>

      <!-- DAW layer -->
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <span class="dc-node dc-node-daw"><i class="fas fa-sliders-h"></i> DAW Output</span>
        <div style="flex:1;height:1px;background:var(--c-rim);position:relative;">
          <div style="position:absolute;right:0;top:-3px;width:0;height:0;border-top:3px solid transparent;border-bottom:3px solid transparent;border-left:5px solid var(--c-rim);"></div>
        </div>
        <span class="dc-node dc-node-ac"><i class="fas fa-circle" style="font-size:8px;"></i> AC Bridge</span>
      </div>

      <!-- Router -->
      <div style="background:var(--c-raised);border:1px solid var(--c-wire);border-radius:var(--r-md);padding:12px 14px;margin-bottom:8px;">
        <div style="font-size:0.6rem;color:var(--t4);margin-bottom:8px;letter-spacing:0.1em;text-transform:uppercase;">Route by Role</div>
        <div style="display:flex;flex-direction:column;gap:6px;">
          ${[
            { node: 'dc-node-eng',    label: 'Engineer',      ico: 'fa-headphones-alt', send: 'Talkback + Cue mix' },
            { node: 'dc-node-artist', label: 'Artist(s)',     ico: 'fa-microphone',     send: 'Session mix' },
            { node: 'dc-node-aud',    label: 'Audience',      ico: 'fa-eye',            send: 'Broadcast mix (if enabled)' },
          ].map(r => `
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="dc-node ${r.node}" style="font-size:0.6rem;padding:4px 10px;"><i class="fas ${r.ico}"></i> ${r.label}</span>
            <div style="flex:1;height:1px;background:var(--c-rim);"></div>
            <span style="font-size:0.62rem;color:var(--t4);">${r.send}</span>
          </div>`).join('')}
        </div>
      </div>

      <!-- Stem vault -->
      <div style="display:flex;align-items:center;gap:8px;">
        <span class="dc-node dc-node-ac" style="font-size:0.6rem;padding:4px 10px;"><i class="fas fa-layer-group"></i> Bounced Files</span>
        <div style="flex:1;height:1px;background:var(--c-rim);position:relative;">
          <div style="position:absolute;right:0;top:-3px;width:0;height:0;border-top:3px solid transparent;border-bottom:3px solid transparent;border-left:5px solid var(--c-rim);"></div>
        </div>
        <span class="dc-node dc-node-daw" style="font-size:0.6rem;padding:4px 10px;"><i class="fas fa-folder-check"></i> Stem Vault</span>
      </div>
    </div>
  </div>
</div>

<!-- ══ SESSION SYNC STATUS UI ════════════════════════════════════════════ -->
<div style="background:var(--c-base);border-top:1px solid var(--c-wire);border-bottom:1px solid var(--c-wire);">
  <div class="dc-section" style="padding-top:48px;padding-bottom:48px;">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start;">
      <div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
          <div style="height:1px;width:20px;background:var(--warm);"></div>
          <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--warm);">Session Playback Sync</span>
        </div>
        <h2 style="font-family:var(--font-display);font-size:1.875rem;font-weight:800;letter-spacing:-0.025em;margin:0 0 16px;line-height:1.1;">Everyone Hears the Same Bar, at the Same Time</h2>
        <p style="font-size:0.9375rem;color:var(--t3);line-height:1.75;margin:0 0 20px;">The companion syncs your DAW transport to the ArtistCollab session clock. When the engineer hits play, everyone's DAW moves together. Latency-compensated. No guesswork.</p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${['Transport sync', 'BPM lock', 'Bar-level offset compensation', 'MIDI clock out', 'Ableton Link support'].map(t =>
            `<span class="dc-pill">${t}</span>`
          ).join('')}
        </div>
      </div>

      <!-- Live sync status mock -->
      <div class="dc-sync-bar">
        <div style="padding:12px 16px;background:var(--c-raised);border-bottom:1px solid var(--c-wire);font-family:var(--font-mono);font-size:0.6rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--t4);">
          Companion — Sync Status
        </div>
        ${[
          { dot: 'dc-dot-ok',   label: 'DAW Connection',      val: 'Pro Tools 2024.6', note: 'connected' },
          { dot: 'dc-dot-ok',   label: 'AC Session Clock',    val: '140.00 BPM',       note: 'synced' },
          { dot: 'dc-dot-ok',   label: 'Transport',           val: 'Bar 42, Beat 3',   note: '± 0 ms' },
          { dot: 'dc-dot-ok',   label: 'Remote Participants', val: '4 online',         note: 'latency comp. on' },
          { dot: 'dc-dot-warn', label: 'Talkback Channel',    val: 'Eng. Cole',        note: 'monitoring' },
          { dot: 'dc-dot-off',  label: 'Screen Share',        val: 'Disabled',         note: 'not active' },
        ].map(row => `
        <div class="dc-sync-row">
          <div class="dc-${row.dot.replace('dc-','')}"></div>
          <div style="flex:1;">${row.label}</div>
          <div style="font-family:var(--font-mono);font-size:0.72rem;color:var(--t2);font-weight:600;">${row.val}</div>
          <div style="font-family:var(--font-mono);font-size:0.62rem;color:var(--t4);">${row.note}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>
</div>

<!-- ══ ONE-CLICK BOUNCE ═══════════════════════════════════════════════════ -->
<div class="dc-section">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
    <div style="height:1px;width:20px;background:var(--signal);"></div>
    <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--signal);">One-Click Bounce</span>
  </div>
  <div class="dc-grid-2">
    <div>
      <h2 style="font-family:var(--font-display);font-size:1.875rem;font-weight:800;letter-spacing:-0.025em;margin:0 0 16px;line-height:1.1;">Record. Bounce. Send for Approval — One Click.</h2>
      <p style="font-size:0.9375rem;color:var(--t3);line-height:1.75;margin:0 0 24px;">The companion adds a bounce panel to your DAW toolbar. Hit export, select your format, and the file goes directly into your ArtistCollab project Stem Vault — where collaborators get notified instantly and can approve or reject the take.</p>
      <div style="display:flex;flex-direction:column;gap:12px;">
        ${[
          { step:'01', label:'Record your take in the DAW', note:'Companion captures the transport and take markers automatically' },
          { step:'02', label:'Hit "Bounce to AC" in the toolbar', note:'Exports WAV/AIFF/stems to the project room' },
          { step:'03', label:'All collaborators approve the take', note:'Rejection triggers a flag; approval advances the release gate' },
          { step:'04', label:'Escrow releases on final approval', note:'Payment flows once all parties sign off' },
        ].map(s => `
        <div style="display:flex;gap:16px;align-items:flex-start;">
          <div style="font-family:var(--font-display);font-size:1.5rem;font-weight:800;color:var(--signal);opacity:0.3;line-height:1;width:32px;flex-shrink:0;">${s.step}</div>
          <div>
            <div style="font-size:0.9375rem;font-weight:700;margin-bottom:3px;">${s.label}</div>
            <div style="font-size:0.8125rem;color:var(--t3);">${s.note}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>
    <!-- Bounce panel mock -->
    <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);overflow:hidden;">
      <div style="padding:14px 18px;background:var(--c-raised);border-bottom:1px solid var(--c-wire);display:flex;align-items:center;gap:8px;">
        <i class="fas fa-layer-group" style="color:var(--warm);"></i>
        <span style="font-family:var(--font-mono);font-size:0.62rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--t4);">AC Bounce Panel</span>
        <span style="margin-left:auto;font-family:var(--font-mono);font-size:0.6rem;color:var(--s-ok);">● Connected</span>
      </div>
      <div style="padding:16px;">
        <div style="margin-bottom:14px;">
          <div style="font-size:0.72rem;color:var(--t4);margin-bottom:6px;font-family:var(--font-mono);letter-spacing:0.08em;text-transform:uppercase;">Export Format</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${['WAV 24-bit', 'AIFF', 'MP3 320k', 'Stems ZIP'].map((f, i) => `
            <span style="padding:5px 12px;border-radius:var(--r-xs);font-size:0.72rem;font-weight:600;background:${i===0?'var(--signal-dim)':'var(--c-sub)'};border:1px solid ${i===0?'rgba(200,255,0,0.25)':'var(--c-wire)'};color:${i===0?'var(--signal)':'var(--t3)'};cursor:pointer;">${f}</span>`).join('')}
          </div>
        </div>
        <div style="margin-bottom:14px;">
          <div style="font-size:0.72rem;color:var(--t4);margin-bottom:6px;font-family:var(--font-mono);letter-spacing:0.08em;text-transform:uppercase;">Destination</div>
          <div style="background:var(--c-raised);border:1px solid var(--c-wire);border-radius:var(--r-sm);padding:8px 12px;display:flex;align-items:center;gap:8px;">
            <i class="fas fa-folder-open" style="color:var(--patch);font-size:0.875rem;"></i>
            <span style="font-size:0.8125rem;">Verse Feature Session / Stem Vault</span>
          </div>
        </div>
        <div style="padding:10px 12px;background:var(--signal-dim);border:1px solid rgba(200,255,0,0.2);border-radius:var(--r);font-size:0.75rem;color:var(--t3);margin-bottom:14px;">
          <i class="fas fa-bell" style="color:var(--signal);margin-right:6px;"></i>
          Cipher7 + XAVI will be notified for approval
        </div>
        <button onclick="alert('Bounce started — in the real companion this exports your DAW session and uploads directly to ArtistCollab.')"
                class="dc-dl-btn" style="width:100%;justify-content:center;font-size:0.875rem;padding:11px;">
          <i class="fas fa-layer-group"></i> Bounce &amp; Send to Project
        </button>
      </div>
    </div>
  </div>
</div>

<!-- ══ ENGINEER TALKBACK ══════════════════════════════════════════════════ -->
<div style="background:var(--c-base);border-top:1px solid var(--c-wire);border-bottom:1px solid var(--c-wire);">
  <div class="dc-section" style="padding-top:48px;padding-bottom:48px;">
    <div style="max-width:680px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
        <div style="height:1px;width:20px;background:var(--warm);"></div>
        <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--warm);">Engineer Talkback</span>
      </div>
      <h2 style="font-family:var(--font-display);font-size:1.875rem;font-weight:800;letter-spacing:-0.025em;margin:0 0 16px;line-height:1.1;">Talkback That Sounds Like You're in the Same Room</h2>
      <p style="font-size:0.9375rem;color:var(--t3);line-height:1.75;margin:0 0 24px;">The engineer holds the talkback button and speaks. Artists hear the engineer in their headphones — loud, clear, without going through the main mix. When released, it cuts immediately. Same workflow as a real studio.</p>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        ${[
          { icon: 'fa-comment-medical', color: 'var(--warm)',   label: 'Hold-to-talk',        desc: 'Zero dead air — instant push-to-talk' },
          { icon: 'fa-volume-up',       color: 'var(--patch)',  label: 'Separate cue channel', desc: 'Doesn\'t bleed into main mix' },
          { icon: 'fa-microphone',      color: 'var(--signal)', label: 'Hardware support',     desc: 'Assign to any MIDI/HID button' },
        ].map(item => `
        <div style="flex:1;min-width:180px;display:flex;gap:12px;align-items:flex-start;">
          <div style="width:36px;height:36px;background:${item.color}14;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="fas ${item.icon}" style="color:${item.color};font-size:0.875rem;"></i>
          </div>
          <div>
            <div style="font-size:0.875rem;font-weight:700;margin-bottom:3px;">${item.label}</div>
            <div style="font-size:0.78rem;color:var(--t3);">${item.desc}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>
</div>

<!-- ══ ROADMAP ════════════════════════════════════════════════════════════ -->
<div class="dc-section">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
    <div style="height:1px;width:20px;background:var(--t4);"></div>
    <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--t4);">Release Roadmap</span>
  </div>
  <div style="display:flex;flex-direction:column;gap:0;border:1px solid var(--c-wire);border-radius:var(--r-lg);overflow:hidden;">
    ${[
      { phase:'Phase 1', badge:'dc-phase-1', icon:'fa-check-circle', label:'Live Session Room',    done:true,  items:['WebRTC session room','Role-based audio routing','Take approvals & escrow','Split sheet inline','Audience mode','Project chat & stem vault'] },
      { phase:'Phase 2', badge:'dc-phase-2', icon:'fa-circle-notch', label:'DAW Companion App',   done:false, items:['Desktop companion (macOS + Windows)','Virtual audio device (Core Audio / ASIO)','Session playback sync','One-click bounce to project','Engineer talkback','Ableton Link tempo sync'] },
      { phase:'Phase 3', badge:'dc-phase-3', icon:'fa-clock',        label:'DAW Bridge & Plug-ins',done:false, items:['Pro Tools AAX strategy + scripting','Logic / AU support','VST3 for FL Studio','Ableton MIDI clock deep integration','Plug-in licensing framework'] },
    ].map((row, ri) => `
    <div style="padding:20px 24px;${ri < 2 ? 'border-bottom:1px solid var(--c-wire);' : ''}background:${row.done ? 'transparent' : 'var(--c-base)'};">
      <div style="display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap;">
        <div style="flex-shrink:0;padding-top:2px;">
          <i class="fas ${row.icon}" style="color:${row.done ? 'var(--s-ok)' : 'var(--t4)'};font-size:1rem;"></i>
        </div>
        <div style="flex:1;min-width:200px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
            <span class="dc-phase-badge ${row.badge}">${row.phase}</span>
            <span style="font-size:0.9375rem;font-weight:700;">${row.label}</span>
            ${row.done ? `<span style="font-size:0.65rem;font-weight:700;color:var(--s-ok);font-family:var(--font-mono);">✓ COMPLETE</span>` : `<span style="font-size:0.65rem;color:var(--t4);font-family:var(--font-mono);">IN DEVELOPMENT</span>`}
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">
            ${row.items.map(it => `
            <span style="display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:var(--r-full);background:var(--c-raised);border:1px solid var(--c-wire);font-size:0.72rem;color:var(--t3);">
              <i class="fas fa-${row.done ? 'check' : 'minus'}" style="font-size:7px;color:${row.done ? 'var(--signal)' : 'var(--t4)'};"></i>${it}
            </span>`).join('')}
          </div>
        </div>
      </div>
    </div>`).join('')}
  </div>

  <div style="margin-top:40px;text-align:center;">
    <button class="dc-dl-btn" onclick="alert('Join the waitlist to get notified when the DAW companion launches.')">
      <i class="fas fa-bell"></i> Get Notified — Phase 2 Launch
    </button>
  </div>
</div>

${siteFooter()}
${closeShell()}`;
}
