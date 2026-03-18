import { shell, closeShell, authedNav, appSidebar } from '../layout';
import { users, projects, getUserById, formatPrice, type Project } from '../data';

// ─── Session Room Page ────────────────────────────────────────────────────────
// Phase 1: WebRTC live session room
// Controls: who is in the room, who can hear what, what files are official,
// who approved the take, who owns what, when payment releases, audience mode.

const SR_STYLES = `
  /* ── Session Room Layout ─────────────────────────────────────────────── */
  .sr-shell {
    display: grid;
    grid-template-columns: 240px 1fr 300px;
    grid-template-rows: 56px 1fr;
    height: calc(100vh - 60px);
    overflow: hidden;
  }
  /* Top bar spans all 3 columns */
  .sr-topbar {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 20px;
    background: var(--c-void);
    border-bottom: 1px solid var(--c-wire);
    overflow: hidden;
  }
  /* Left: participant roster */
  .sr-roster {
    grid-column: 1;
    grid-row: 2;
    background: var(--c-base);
    border-right: 1px solid var(--c-wire);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  /* Centre: main stage */
  .sr-stage {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--c-void);
  }
  /* Right: control panel */
  .sr-panel {
    grid-column: 3;
    grid-row: 2;
    background: var(--c-base);
    border-left: 1px solid var(--c-wire);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  /* Participant tile */
  .sr-participant {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-bottom: 1px solid var(--c-wire);
    cursor: default;
    transition: background var(--t-fast);
    position: relative;
  }
  .sr-participant:hover { background: var(--c-ghost); }
  .sr-participant.active-speaker {
    border-left: 2px solid var(--signal);
  }
  .sr-part-avatar {
    position: relative;
    flex-shrink: 0;
  }
  .sr-part-avatar img {
    width: 36px; height: 36px;
    border-radius: 50%;
    object-fit: cover;
  }
  .sr-speaking-ring {
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    border: 2px solid var(--signal);
    box-shadow: 0 0 8px var(--signal);
    animation: pulse 1.4s ease-in-out infinite;
    pointer-events: none;
  }
  .sr-role-badge {
    font-family: var(--font-mono);
    font-size: 0.52rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 1px 6px;
    border-radius: var(--r-full);
    font-weight: 700;
  }
  .sr-role-host    { background: var(--signal-dim); color: var(--signal); border: 1px solid rgba(200,255,0,0.25); }
  .sr-role-artist  { background: rgba(0,194,255,0.1); color: var(--patch); border: 1px solid rgba(0,194,255,0.2); }
  .sr-role-engineer{ background: rgba(255,140,66,0.1); color: var(--warm); border: 1px solid rgba(255,140,66,0.2); }
  .sr-role-audience{ background: rgba(82,82,106,0.2); color: var(--t4); border: 1px solid var(--c-wire); }

  /* Meter bar (live level indicator) */
  .sr-meter {
    width: 3px;
    border-radius: 2px;
    background: var(--c-wire);
    overflow: hidden;
    flex-shrink: 0;
    align-self: stretch;
  }
  .sr-meter-fill {
    width: 100%;
    border-radius: 2px;
    transition: height 80ms linear;
    background: linear-gradient(to top, var(--signal), #90ff00);
  }

  /* Stage: waveform + video grid */
  .sr-waveform-bar {
    height: 80px;
    background: var(--c-void);
    border-bottom: 1px solid var(--c-wire);
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 0 24px;
    overflow: hidden;
    position: relative;
  }
  .sr-video-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 2px;
    background: #000;
    overflow: hidden;
  }
  .sr-video-tile {
    position: relative;
    background: var(--c-base);
    aspect-ratio: 16/9;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    min-height: 0;
  }
  .sr-video-tile img {
    width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0.6;
    filter: grayscale(0.3);
  }
  .sr-video-overlay {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.85), transparent);
    padding: 8px 10px 6px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }
  .sr-cam-off {
    width: 80px; height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--c-wire);
  }

  /* Bottom transport bar */
  .sr-transport {
    height: 64px;
    background: var(--c-void);
    border-top: 1px solid var(--c-wire);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    gap: 12px;
    flex-shrink: 0;
  }
  .sr-transport-center {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .sr-btn {
    width: 40px; height: 40px;
    border-radius: 50%;
    background: var(--c-raised);
    border: 1px solid var(--c-wire);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--t-fast);
    color: var(--t2);
    font-size: 0.875rem;
  }
  .sr-btn:hover { background: var(--c-lift); color: var(--t1); }
  .sr-btn.active { background: var(--signal); border-color: var(--signal); color: #000; }
  .sr-btn.danger  { background: rgba(255,77,109,0.15); border-color: rgba(255,77,109,0.35); color: var(--channel); }
  .sr-btn.danger:hover { background: var(--channel); color: #fff; }
  .sr-rec-btn {
    width: 48px; height: 48px;
    border-radius: 50%;
    background: var(--channel);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #fff;
    font-size: 1rem;
    box-shadow: 0 0 16px rgba(255,77,109,0.4);
    transition: all var(--t-fast);
  }
  .sr-rec-btn.recording {
    animation: pulse 1s ease-in-out infinite;
    box-shadow: 0 0 24px rgba(255,77,109,0.7);
  }

  /* Right panel sections */
  .sr-panel-sec {
    border-bottom: 1px solid var(--c-wire);
  }
  .sr-panel-head {
    padding: 10px 14px;
    background: var(--c-raised);
    font-family: var(--font-mono);
    font-size: 0.58rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--t4);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    cursor: pointer;
    user-select: none;
  }
  .sr-panel-body { padding: 12px 14px; }

  /* Take row */
  .sr-take {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: var(--r);
    background: var(--c-raised);
    border: 1px solid var(--c-wire);
    margin-bottom: 6px;
    cursor: pointer;
    transition: border-color var(--t-fast);
  }
  .sr-take:hover { border-color: rgba(255,255,255,0.1); }
  .sr-take.approved { border-left: 2px solid var(--signal); }
  .sr-take.pending  { border-left: 2px solid var(--warm); }
  .sr-take.rejected { border-left: 2px solid var(--channel); }

  /* Chat */
  .sr-chat-msgs {
    flex: 1;
    overflow-y: auto;
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    scrollbar-width: thin;
    scrollbar-color: var(--c-wire) transparent;
    min-height: 0;
  }
  .sr-chat-input-row {
    padding: 8px 10px;
    border-top: 1px solid var(--c-wire);
    display: flex;
    gap: 6px;
    align-items: center;
    background: var(--c-void);
    flex-shrink: 0;
  }
  .sr-chat-input {
    flex: 1;
    background: var(--c-raised);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-sm);
    padding: 7px 10px;
    font-size: 0.8125rem;
    color: var(--t1);
    font-family: var(--font-body);
    outline: none;
    min-width: 0;
  }
  .sr-chat-input:focus { border-color: var(--signal); box-shadow: 0 0 0 2px var(--signal-dim); }

  /* Audience gate banner */
  .sr-audience-gate {
    background: rgba(200,255,0,0.04);
    border: 1px solid rgba(200,255,0,0.18);
    border-radius: var(--r-lg);
    padding: 14px 16px;
    margin: 12px 14px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  /* Approval dot */
  .approval-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .dot-approved { background: var(--s-ok); box-shadow: 0 0 6px rgba(45,202,114,0.5); }
  .dot-pending  { background: var(--warm); }
  .dot-rejected { background: var(--channel); }

  /* Stem mini-row in panel */
  .sr-stem {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 10px;
    border-radius: var(--r);
    background: var(--c-raised);
    border: 1px solid var(--c-wire);
    margin-bottom: 5px;
    font-size: 0.78rem;
  }

  /* Escrow badge */
  .sr-escrow {
    background: var(--signal-dim);
    border: 1px solid rgba(200,255,0,0.2);
    border-radius: var(--r);
    padding: 10px 12px;
    margin: 10px 14px 0;
  }

  /* Split ownership mini bar */
  .sr-split-bar {
    height: 6px;
    border-radius: 3px;
    background: var(--c-wire);
    overflow: hidden;
    margin-top: 5px;
  }
  .sr-split-fill {
    height: 100%;
    border-radius: 3px;
  }

  /* Talkback button */
  .sr-talkback {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,140,66,0.15);
    border: 1px solid rgba(255,140,66,0.4);
    border-radius: var(--r-full);
    padding: 6px 16px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--warm);
    cursor: pointer;
    transition: all var(--t-fast);
    font-family: var(--font-body);
    white-space: nowrap;
  }
  .sr-talkback:hover {
    background: rgba(255,140,66,0.3);
    box-shadow: 0 0 12px rgba(255,140,66,0.25);
  }

  @media (max-width: 1024px) {
    .sr-shell {
      grid-template-columns: 1fr;
      grid-template-rows: 56px 1fr auto auto;
      height: auto;
      min-height: calc(100vh - 60px);
    }
    .sr-topbar  { grid-column: 1; }
    .sr-roster  { grid-column: 1; grid-row: 3; height: auto; max-height: 220px; border-right: none; border-top: 1px solid var(--c-wire); }
    .sr-stage   { grid-column: 1; grid-row: 2; min-height: 50vh; }
    .sr-panel   { grid-column: 1; grid-row: 4; border-left: none; border-top: 1px solid var(--c-wire); }
    .sr-video-grid { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
  }
`;

// ── Demo participants ──────────────────────────────────────────────────────────
type Participant = {
  id: string;
  name: string;
  role: 'host' | 'artist' | 'engineer' | 'audience';
  avatar: string;
  muted: boolean;
  camOff: boolean;
  speaking: boolean;
  level: number; // 0-100
};

const DEMO_PARTICIPANTS: Participant[] = [
  { id: 'u1', name: 'XAVI',     role: 'host',     avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop&crop=face', muted: false, camOff: false, speaking: true,  level: 72 },
  { id: 'u2', name: 'Cipher7',  role: 'artist',   avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face', muted: false, camOff: false, speaking: false, level: 0  },
  { id: 'u5', name: 'Nova',     role: 'artist',   avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=80&h=80&fit=crop&crop=face', muted: true,  camOff: true,  speaking: false, level: 0  },
  { id: 'eng', name: 'Eng. Cole', role: 'engineer', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&h=80&fit=crop&crop=face', muted: false, camOff: false, speaking: false, level: 18 },
  { id: 'aud1', name: 'Listener', role: 'audience', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face', muted: true, camOff: true, speaking: false, level: 0 },
];

// ── Demo takes ────────────────────────────────────────────────────────────────
type Take = { id: string; label: string; dur: string; status: 'approved' | 'pending' | 'rejected'; ts: string };
const DEMO_TAKES: Take[] = [
  { id: 'tk1', label: 'Take 1 — Verse Intro',   dur: '0:32', status: 'approved', ts: '11:42 PM' },
  { id: 'tk2', label: 'Take 2 — Hook (alt)',     dur: '0:28', status: 'pending',  ts: '11:55 PM' },
  { id: 'tk3', label: 'Take 3 — Bridge build',  dur: '0:45', status: 'pending',  ts: '12:03 AM' },
];

// ── Demo stems ────────────────────────────────────────────────────────────────
const DEMO_STEMS = [
  { name: 'Vocal Main.wav',  type: 'vox',  size: '24 MB', approved: true  },
  { name: '808 Loop.wav',    type: 'beat', size: '8 MB',  approved: true  },
  { name: 'Bridge Melody',   type: 'inst', size: '12 MB', approved: false },
];

// ── Role helpers ──────────────────────────────────────────────────────────────
function roleLabel(r: Participant['role']): string {
  return r === 'host' ? 'Host' : r === 'engineer' ? 'Engineer' : r === 'artist' ? 'Artist' : 'Audience';
}
function roleBadge(r: Participant['role']): string {
  const cls = r === 'host' ? 'sr-role-host' : r === 'engineer' ? 'sr-role-engineer' : r === 'artist' ? 'sr-role-artist' : 'sr-role-audience';
  return `<span class="sr-role-badge ${cls}">${roleLabel(r)}</span>`;
}

// ── Waveform ─────────────────────────────────────────────────────────────────
const WV = Array.from({ length: 80 }, (_, i) => {
  const v = Math.abs(Math.sin(i * 0.38) * Math.cos(i * 0.17)) * 0.75 + 0.25;
  return Math.min(1, v);
});

export function sessionRoomPage(projectId: string): string {
  const project = projectId ? ({ id: projectId, title: 'Verse Feature Session', collabType: 'ownership_split', paymentStatus: 'held', totalAmount: 3500 } as any) : null;
  const sessionId = projectId || 'live-001';
  const title = project?.title ?? 'Live Session Room';
  const escrowAmt = formatPrice(project?.totalAmount ?? 3500);
  const isSplit = project?.collabType === 'ownership_split';

  // Demo chat messages
  const chatMsgs = [
    { who: 'Cipher7', mine: false, text: 'That hook is fire. Do a cleaner breath before the first bar.', ts: '11:44' },
    { who: 'You',     mine: true,  text: 'Copy. Going again from bar 9.', ts: '11:44' },
    { who: 'Eng. Cole', mine: false, text: 'Talkback on — I\'ll call "in 3" when the loop restarts.', ts: '11:55' },
    { who: 'You',     mine: true,  text: 'Ready', ts: '11:55' },
    { who: 'Cipher7', mine: false, text: 'Take 2 is close — bridge still needs to punch harder at the top.', ts: '12:01' },
  ];

  return shell(title, SR_STYLES)
    + authedNav('projects')
    + `<div class="app-shell">${appSidebar('projects')}<main class="app-main" style="padding:0;overflow:hidden;">

<div class="sr-shell">

  <!-- ══ TOP BAR ═══════════════════════════════════════════════════════════ -->
  <div class="sr-topbar">
    <!-- Back -->
    <a href="/workspace/${sessionId}" style="color:var(--t4);font-size:0.8125rem;display:flex;align-items:center;gap:6px;white-space:nowrap;text-decoration:none;">
      <i class="fas fa-arrow-left" style="font-size:10px;"></i>
    </a>
    <!-- Session name -->
    <div style="font-family:var(--font-display);font-weight:800;font-size:0.9375rem;letter-spacing:-0.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${title}</div>
    <div style="display:flex;align-items:center;gap:6px;margin-left:4px;flex-shrink:0;">
      <span style="width:7px;height:7px;border-radius:50%;background:var(--channel);box-shadow:0 0 6px rgba(255,77,109,0.6);animation:pulse 1s infinite;display:inline-block;"></span>
      <span style="font-family:var(--font-mono);font-size:0.6rem;color:var(--channel);letter-spacing:0.1em;">LIVE</span>
    </div>

    <!-- Spacer -->
    <div style="flex:1;min-width:0;"></div>

    <!-- Timer -->
    <div id="sr-timer" style="font-family:var(--font-mono);font-size:0.875rem;color:var(--t3);flex-shrink:0;">00:42:17</div>

    <!-- Audience toggle -->
    <button id="btn-audience" onclick="toggleAudience()"
            class="btn btn-secondary btn-sm" style="gap:6px;flex-shrink:0;"
            title="Toggle audience access">
      <i class="fas fa-eye"></i>
      <span style="font-size:0.75rem;">Audience <span id="aud-count" style="font-family:var(--font-mono);color:var(--t4);">OFF</span></span>
    </button>

    <!-- End session -->
    <button onclick="confirmEnd()"
            class="btn btn-sm" style="background:rgba(255,77,109,0.12);border:1px solid rgba(255,77,109,0.3);color:var(--channel);gap:6px;flex-shrink:0;">
      <i class="fas fa-phone-slash" style="font-size:11px;"></i>
      <span style="font-size:0.75rem;">End</span>
    </button>
  </div>

  <!-- ══ ROSTER (left) ═════════════════════════════════════════════════════ -->
  <div class="sr-roster">
    <div style="padding:8px 14px 6px;font-family:var(--font-mono);font-size:0.58rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--t4);border-bottom:1px solid var(--c-wire);display:flex;justify-content:space-between;align-items:center;">
      <span>In Session <span style="color:var(--signal);">${DEMO_PARTICIPANTS.length}</span></span>
      <button onclick="showInvite()" style="background:none;border:none;color:var(--t4);cursor:pointer;font-size:0.75rem;padding:2px 4px;" title="Invite">
        <i class="fas fa-user-plus"></i>
      </button>
    </div>

    ${DEMO_PARTICIPANTS.map(p => `
    <div class="sr-participant${p.speaking ? ' active-speaker' : ''}" data-id="${p.id}">
      <div class="sr-part-avatar">
        <img src="${p.avatar}" alt="${p.name}">
        ${p.speaking ? `<div class="sr-speaking-ring"></div>` : ''}
      </div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:0.8rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:3px;">${p.name}</div>
        ${roleBadge(p.role)}
      </div>
      <!-- Level meter -->
      <div class="sr-meter" style="height:24px;">
        <div class="sr-meter-fill" style="height:${p.level}%;"></div>
      </div>
      <!-- Mute indicator -->
      ${p.muted ? `<i class="fas fa-microphone-slash" style="color:var(--channel);font-size:11px;flex-shrink:0;"></i>` : ''}
      ${p.camOff ? `<i class="fas fa-video-slash" style="color:var(--t4);font-size:10px;flex-shrink:0;"></i>` : ''}
    </div>`).join('')}

    <!-- Audience gate notice -->
    <div id="audience-gate" class="sr-audience-gate" style="display:none;">
      <i class="fas fa-eye" style="color:var(--signal);font-size:0.875rem;flex-shrink:0;margin-top:1px;"></i>
      <div>
        <div style="font-size:0.75rem;font-weight:700;color:var(--signal);margin-bottom:3px;">Audience Mode ON</div>
        <div style="font-size:0.72rem;color:var(--t3);line-height:1.5;">Observers can watch. They cannot speak or access files. Host can remove at any time.</div>
      </div>
    </div>

    <!-- Spacer push -->
    <div style="flex:1;"></div>

    <!-- Role + permissions key -->
    <div style="padding:10px 14px;border-top:1px solid var(--c-wire);">
      <div style="font-family:var(--font-mono);font-size:0.55rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--t4);margin-bottom:8px;">Roles</div>
      ${[
        { r: 'host',     desc: 'Full control' },
        { r: 'engineer', desc: 'Route + talkback' },
        { r: 'artist',   desc: 'Hear + record' },
        { r: 'audience', desc: 'Watch only' },
      ].map(x => `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">
        ${roleBadge(x.r as any)}
        <span style="font-size:0.7rem;color:var(--t4);">${x.desc}</span>
      </div>`).join('')}
    </div>
  </div>

  <!-- ══ STAGE (centre) ════════════════════════════════════════════════════ -->
  <div class="sr-stage">

    <!-- Live waveform visualiser -->
    <div class="sr-waveform-bar">
      ${WV.map((h, i) => `<div style="flex:1;height:${Math.round(h * 64)}px;background:var(--signal);border-radius:2px;opacity:${0.3 + h * 0.7};transition:height 80ms linear;" id="wv-${i}"></div>`).join('')}
      <!-- Playhead -->
      <div id="sr-playhead" style="position:absolute;left:30%;top:0;bottom:0;width:2px;background:var(--channel);box-shadow:0 0 8px rgba(255,77,109,0.6);pointer-events:none;transition:left 0.1s linear;"></div>
      <!-- Talkback button (engineer) -->
      <button class="sr-talkback" id="btn-talkback" onmousedown="startTalkback()" onmouseup="stopTalkback()">
        <i class="fas fa-comment-medical"></i>
        Hold — Talkback
      </button>
    </div>

    <!-- Video grid -->
    <div class="sr-video-grid">
      ${DEMO_PARTICIPANTS.filter(p => p.role !== 'audience').map(p => `
      <div class="sr-video-tile">
        ${!p.camOff
          ? `<img src="${p.avatar.replace('w=80&h=80', 'w=400&h=225')}" alt="${p.name}">`
          : `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:var(--c-panel);width:100%;height:100%;">
               <img src="${p.avatar}" class="sr-cam-off" alt="${p.name}">
               <span style="font-size:0.72rem;color:var(--t4);">Camera Off</span>
             </div>`}
        <div class="sr-video-overlay">
          <div style="display:flex;align-items:center;gap:6px;">
            ${p.speaking ? `<span style="width:6px;height:6px;border-radius:50%;background:var(--signal);box-shadow:0 0 6px var(--signal);animation:pulse 1s infinite;"></span>` : ''}
            <span style="font-size:0.75rem;font-weight:600;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.8);">${p.name}</span>
            ${roleBadge(p.role)}
          </div>
          ${p.muted ? `<i class="fas fa-microphone-slash" style="color:var(--channel);font-size:12px;"></i>` : ''}
        </div>
      </div>`).join('')}
    </div>

    <!-- Transport bar -->
    <div class="sr-transport">
      <!-- Left: playback controls -->
      <div style="display:flex;align-items:center;gap:8px;">
        <button class="sr-btn" title="Go to start" onclick="transportAction('start')"><i class="fas fa-step-backward"></i></button>
        <button class="sr-btn active" id="btn-play" title="Play / Pause" onclick="togglePlay()"><i class="fas fa-pause" id="play-icon"></i></button>
        <button class="sr-btn" title="Loop" id="btn-loop" onclick="toggleLoop()"><i class="fas fa-redo" style="font-size:0.75rem;"></i></button>
        <!-- BPM / Key display -->
        <div style="padding:4px 10px;background:var(--c-raised);border:1px solid var(--c-wire);border-radius:var(--r-sm);display:flex;gap:10px;font-family:var(--font-mono);font-size:0.7rem;">
          <span style="color:var(--t4);">BPM <span style="color:var(--t1);font-weight:700;">140</span></span>
          <span style="color:var(--c-wire);">|</span>
          <span style="color:var(--t4);">KEY <span style="color:var(--t1);font-weight:700;">F♯m</span></span>
        </div>
      </div>

      <!-- Centre: Record -->
      <div class="sr-transport-center">
        <button class="sr-rec-btn" id="btn-rec" onclick="toggleRecord()" title="Record">
          <i class="fas fa-circle" id="rec-icon"></i>
        </button>
        <div style="text-align:center;">
          <div id="rec-label" style="font-family:var(--font-mono);font-size:0.6rem;color:var(--channel);letter-spacing:0.12em;">READY</div>
          <div id="rec-timer" style="font-family:var(--font-mono);font-size:0.75rem;color:var(--t3);">00:00</div>
        </div>
      </div>

      <!-- Right: local controls -->
      <div style="display:flex;align-items:center;gap:8px;">
        <button class="sr-btn" id="btn-mic" title="Mute / Unmute" onclick="toggleMic()"><i class="fas fa-microphone" id="mic-icon"></i></button>
        <button class="sr-btn" id="btn-cam" title="Camera On/Off" onclick="toggleCam()"><i class="fas fa-video" id="cam-icon"></i></button>
        <button class="sr-btn" title="Share screen" onclick="alert('Screen share: available in the desktop companion app.')"><i class="fas fa-desktop"></i></button>
        <button class="sr-btn" title="Settings" onclick="togglePanel('settings')"><i class="fas fa-sliders-h"></i></button>
        <!-- Bounce / Export -->
        <button class="btn btn-secondary btn-sm" style="gap:6px;" onclick="showBounce()" title="Bounce &amp; export to project">
          <i class="fas fa-layer-group" style="font-size:11px;"></i>
          <span>Bounce</span>
        </button>
      </div>
    </div>
  </div>

  <!-- ══ CONTROL PANEL (right) ═════════════════════════════════════════════ -->
  <div class="sr-panel">

    <!-- Escrow widget -->
    <div class="sr-escrow" style="margin:12px 14px 0;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <span style="font-family:var(--font-mono);font-size:0.58rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--signal);">Escrow Held</span>
        <span style="font-family:var(--font-display);font-size:1rem;font-weight:800;color:var(--signal);">${escrowAmt}</span>
      </div>
      <div style="font-size:0.72rem;color:var(--t3);line-height:1.4;">Releases when all collaborators approve delivery &amp; release gate opens.</div>
      ${isSplit ? `
      <div style="margin-top:8px;">
        <div class="sr-split-bar">
          <div class="sr-split-fill" style="width:60%;background:var(--signal);"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:0.58rem;color:var(--t4);margin-top:3px;">
          <span>XAVI 60%</span><span>Cipher7 40%</span>
        </div>
      </div>` : ''}
    </div>

    <!-- Takes / Approvals -->
    <div class="sr-panel-sec" style="margin-top:12px;">
      <div class="sr-panel-head" onclick="toggleSec('takes')">
        <div style="display:flex;align-items:center;gap:8px;">
          <i class="fas fa-check-double" style="color:var(--signal);font-size:0.75rem;"></i>
          Takes &amp; Approvals
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="background:var(--signal-dim);color:var(--signal);font-size:0.6rem;padding:1px 6px;border-radius:var(--r-full);font-weight:700;">${DEMO_TAKES.filter(t => t.status === 'approved').length}/${DEMO_TAKES.length}</span>
          <i class="fas fa-chevron-down" id="chev-takes" style="font-size:0.65rem;transition:transform var(--t-fast);"></i>
        </div>
      </div>
      <div id="sec-takes" class="sr-panel-body" style="padding-top:8px;">
        ${DEMO_TAKES.map(t => `
        <div class="sr-take ${t.status}" onclick="selectTake('${t.id}')">
          <div class="approval-dot dot-${t.status}"></div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:0.78rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${t.label}</div>
            <div style="font-family:var(--font-mono);font-size:0.58rem;color:var(--t4);">${t.dur} · ${t.ts}</div>
          </div>
          <div style="display:flex;gap:4px;">
            ${t.status === 'pending' ? `
            <button onclick="event.stopPropagation();approveTake('${t.id}')"
                    style="background:var(--signal-dim);border:1px solid rgba(200,255,0,0.3);border-radius:var(--r-sm);padding:3px 8px;font-size:0.65rem;font-weight:700;color:var(--signal);cursor:pointer;">✓</button>
            <button onclick="event.stopPropagation();rejectTake('${t.id}')"
                    style="background:rgba(255,77,109,0.1);border:1px solid rgba(255,77,109,0.25);border-radius:var(--r-sm);padding:3px 8px;font-size:0.65rem;font-weight:700;color:var(--channel);cursor:pointer;">✗</button>
            ` : `<span style="font-size:0.65rem;font-weight:700;color:${t.status === 'approved' ? 'var(--s-ok)' : 'var(--channel)'};">${t.status === 'approved' ? 'APPROVED' : 'REJECTED'}</span>`}
          </div>
        </div>`).join('')}

        <!-- New take CTA -->
        <button onclick="alert('Recording will create a new take. Click Record to start.')"
                class="btn btn-secondary btn-xs" style="width:100%;justify-content:center;margin-top:4px;gap:6px;">
          <i class="fas fa-plus" style="font-size:9px;"></i> New Take
        </button>
      </div>
    </div>

    <!-- Stem Vault -->
    <div class="sr-panel-sec">
      <div class="sr-panel-head" onclick="toggleSec('stems')">
        <div style="display:flex;align-items:center;gap:8px;">
          <i class="fas fa-layer-group" style="color:var(--patch);font-size:0.75rem;"></i>
          Stem Vault
        </div>
        <i class="fas fa-chevron-down" id="chev-stems" style="font-size:0.65rem;transition:transform var(--t-fast);"></i>
      </div>
      <div id="sec-stems" class="sr-panel-body" style="padding-top:8px;">
        ${DEMO_STEMS.map(s => `
        <div class="sr-stem">
          <i class="fas fa-file-audio" style="color:${s.type === 'vox' ? 'var(--signal)' : s.type === 'beat' ? 'var(--patch)' : 'var(--warm)'};font-size:0.8rem;flex-shrink:0;"></i>
          <div style="flex:1;min-width:0;">
            <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;">${s.name}</div>
            <div style="font-family:var(--font-mono);font-size:0.56rem;color:var(--t4);">${s.size}</div>
          </div>
          <span style="font-size:0.62rem;font-weight:700;color:${s.approved ? 'var(--s-ok)' : 'var(--warm)'};">${s.approved ? '✓' : '?'}</span>
          <button onclick="alert('Download: ${s.name}')" style="background:none;border:none;color:var(--t4);cursor:pointer;font-size:0.75rem;padding:2px 4px;" title="Download">
            <i class="fas fa-download"></i>
          </button>
        </div>`).join('')}

        <!-- Upload area -->
        <div onclick="alert('Stem upload: drop files here or use the Workspace stem vault for full management.')"
             style="border:1px dashed var(--c-rim);border-radius:var(--r);padding:10px;text-align:center;margin-top:6px;cursor:pointer;transition:border-color var(--t-fast);"
             onmouseover="this.style.borderColor='var(--signal)'" onmouseout="this.style.borderColor='var(--c-rim)'">
          <i class="fas fa-upload" style="color:var(--t4);font-size:0.875rem;"></i>
          <div style="font-size:0.72rem;color:var(--t4);margin-top:4px;">Upload Stem</div>
        </div>
      </div>
    </div>

    <!-- Split Sheet (if ownership split) -->
    ${isSplit ? `
    <div class="sr-panel-sec">
      <div class="sr-panel-head" onclick="toggleSec('splits')">
        <div style="display:flex;align-items:center;gap:8px;">
          <i class="fas fa-chart-pie" style="color:var(--warm);font-size:0.75rem;"></i>
          Split Sheet
        </div>
        <i class="fas fa-chevron-down" id="chev-splits" style="font-size:0.65rem;transition:transform var(--t-fast);"></i>
      </div>
      <div id="sec-splits" class="sr-panel-body">
        ${[
          { name: 'XAVI',    pct: 60, approved: true  },
          { name: 'Cipher7', pct: 40, approved: false },
        ].map(c => `
        <div style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <span style="font-size:0.78rem;font-weight:600;">${c.name}</span>
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-family:var(--font-display);font-size:0.9rem;font-weight:800;color:var(--signal);">${c.pct}%</span>
              <span style="font-size:0.65rem;font-weight:700;color:${c.approved ? 'var(--s-ok)' : 'var(--warm)'};">${c.approved ? 'SIGNED' : 'PENDING'}</span>
            </div>
          </div>
          <div class="sr-split-bar"><div class="sr-split-fill" style="width:${c.pct}%;background:${c.approved ? 'var(--signal)' : 'var(--warm)'};"></div></div>
        </div>`).join('')}
        <a href="/split-sheet/ss1" class="btn btn-secondary btn-xs" style="width:100%;justify-content:center;margin-top:6px;gap:6px;">
          <i class="fas fa-external-link-alt" style="font-size:9px;"></i> Full Split Sheet
        </a>
      </div>
    </div>` : ''}

    <!-- Session Chat -->
    <div class="sr-panel-sec" style="flex:1;display:flex;flex-direction:column;min-height:0;">
      <div class="sr-panel-head" onclick="toggleSec('chat')" style="cursor:pointer;">
        <div style="display:flex;align-items:center;gap:8px;">
          <i class="fas fa-comment-dots" style="color:var(--patch);font-size:0.75rem;"></i>
          Session Chat
        </div>
        <span style="background:var(--patch);color:#fff;font-size:0.58rem;padding:1px 6px;border-radius:var(--r-full);">5</span>
      </div>
      <div id="sec-chat" style="display:flex;flex-direction:column;flex:1;min-height:180px;">
        <div class="sr-chat-msgs" id="chat-msgs">
          ${chatMsgs.map(m => `
          <div style="display:flex;flex-direction:column;align-items:${m.mine ? 'flex-end' : 'flex-start'};">
            ${!m.mine ? `<div style="font-size:0.65rem;color:var(--t4);margin-bottom:2px;padding:0 3px;">${m.who}</div>` : ''}
            <div style="max-width:90%;padding:7px 11px;border-radius:${m.mine ? '10px 10px 3px 10px' : '10px 10px 10px 3px'};background:${m.mine ? 'var(--signal)' : 'var(--c-raised)'};border:${m.mine ? 'none' : '1px solid var(--c-wire)'};color:${m.mine ? '#000' : 'var(--t2)'};font-size:0.8rem;line-height:1.45;font-weight:${m.mine ? '600' : '400'};">${m.text}</div>
            <div style="font-size:0.58rem;color:var(--t4);margin-top:2px;padding:0 3px;">${m.ts}</div>
          </div>`).join('')}
        </div>
        <div class="sr-chat-input-row">
          <input id="chat-in" class="sr-chat-input" placeholder="Message…" onkeydown="if(event.key==='Enter')sendChat()">
          <button onclick="sendChat()" style="background:var(--signal);border:none;border-radius:var(--r-sm);width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
            <i class="fas fa-paper-plane" style="color:#000;font-size:0.75rem;"></i>
          </button>
        </div>
      </div>
    </div>

  </div><!-- end sr-panel -->

</div><!-- end sr-shell -->

</main></div><!-- end app-shell -->

<!-- ══ BOUNCE MODAL ══════════════════════════════════════════════════════════ -->
<div id="bounce-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:none;align-items:center;justify-content:center;padding:24px;">
  <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);width:100%;max-width:480px;overflow:hidden;">
    <div style="padding:18px 20px;background:var(--c-raised);border-bottom:1px solid var(--c-wire);display:flex;align-items:center;justify-content:space-between;">
      <div style="font-family:var(--font-mono);font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--warm);">
        <i class="fas fa-layer-group" style="margin-right:6px;"></i>Bounce &amp; Export
      </div>
      <button onclick="closeBounce()" style="background:none;border:none;color:var(--t4);cursor:pointer;font-size:1rem;"><i class="fas fa-times"></i></button>
    </div>
    <div style="padding:20px;">
      <p style="font-size:0.875rem;color:var(--t3);margin:0 0 16px;line-height:1.6;">Export the current session mix to your project workspace as an official deliverable. All collaborators will be notified.</p>
      ${[
        { label: 'Stereo Mix (WAV 24-bit 48kHz)', checked: true  },
        { label: 'Stems Bundle (ZIP)',             checked: true  },
        { label: 'Session File (DAW project)',     checked: false },
        { label: 'MIDI Export',                    checked: false },
      ].map((o, i) => `
      <label style="display:flex;align-items:center;gap:10px;padding:8px 0;cursor:pointer;border-bottom:1px solid var(--c-wire);">
        <input type="checkbox" ${o.checked ? 'checked' : ''} id="bounce-${i}"
               style="accent-color:var(--signal);width:15px;height:15px;">
        <span style="font-size:0.875rem;">${o.label}</span>
      </label>`).join('')}
      <div style="margin-top:16px;padding:12px;background:var(--signal-dim);border:1px solid rgba(200,255,0,0.2);border-radius:var(--r);font-size:0.78rem;color:var(--t3);">
        <i class="fas fa-info-circle" style="color:var(--signal);margin-right:6px;"></i>
        Files will be added to the Stem Vault and require collaborator approval before the escrow gate opens.
      </div>
      <div style="display:flex;gap:10px;margin-top:16px;">
        <button onclick="doBounce()" class="btn btn-primary" style="flex:1;justify-content:center;">
          <i class="fas fa-layer-group" style="font-size:12px;"></i> Start Bounce
        </button>
        <button onclick="closeBounce()" class="btn btn-secondary">Cancel</button>
      </div>
    </div>
  </div>
</div>

<script>
// ── State ─────────────────────────────────────────────────────────────────────
var isPlaying   = true;
var isRecording = false;
var isMuted     = false;
var isCamOff    = false;
var isLooping   = false;
var audMode     = false;
var recSecs     = 0;
var recInterval = null;
var timerSecs   = 42 * 60 + 17;
var playhead    = 0.30;

// ── Session timer ─────────────────────────────────────────────────────────────
setInterval(function(){
  timerSecs++;
  var h = Math.floor(timerSecs / 3600);
  var m = Math.floor((timerSecs % 3600) / 60);
  var s = timerSecs % 60;
  var el = document.getElementById('sr-timer');
  if (el) el.textContent = (h ? pad(h)+':' : '') + pad(m) + ':' + pad(s);
}, 1000);

// ── Playhead animation ────────────────────────────────────────────────────────
if (isPlaying) {
  setInterval(function(){
    if (!isPlaying) return;
    playhead += 0.0005;
    if (playhead > 1) playhead = 0;
    var ph = document.getElementById('sr-playhead');
    if (ph) ph.style.left = (playhead * 100) + '%';
  }, 100);
}

// ── Waveform jitter (simulates live audio) ────────────────────────────────────
setInterval(function(){
  for (var i = 0; i < 80; i++) {
    var el = document.getElementById('wv-' + i);
    if (!el) continue;
    var base = 0.2 + 0.5 * Math.abs(Math.sin(i * 0.38 + Date.now() * 0.0008));
    var h = Math.max(4, Math.round(base * 64));
    el.style.height = h + 'px';
  }
}, 120);

// ── Controls ─────────────────────────────────────────────────────────────────
function pad(n){ return n < 10 ? '0'+n : ''+n; }

function togglePlay(){
  isPlaying = !isPlaying;
  var btn = document.getElementById('btn-play');
  var ico = document.getElementById('play-icon');
  if (btn)  btn.classList.toggle('active', isPlaying);
  if (ico)  ico.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
}

function toggleLoop(){
  isLooping = !isLooping;
  var btn = document.getElementById('btn-loop');
  if (btn) btn.classList.toggle('active', isLooping);
}

function toggleMic(){
  isMuted = !isMuted;
  var btn = document.getElementById('btn-mic');
  var ico = document.getElementById('mic-icon');
  if (btn)  btn.classList.toggle('danger', isMuted);
  if (ico)  ico.className = isMuted ? 'fas fa-microphone-slash' : 'fas fa-microphone';
}

function toggleCam(){
  isCamOff = !isCamOff;
  var btn = document.getElementById('btn-cam');
  var ico = document.getElementById('cam-icon');
  if (btn)  btn.classList.toggle('danger', isCamOff);
  if (ico)  ico.className = isCamOff ? 'fas fa-video-slash' : 'fas fa-video';
}

function toggleRecord(){
  isRecording = !isRecording;
  var btn = document.getElementById('btn-rec');
  var lbl = document.getElementById('rec-label');
  var tmr = document.getElementById('rec-timer');
  if (btn) btn.classList.toggle('recording', isRecording);
  if (isRecording) {
    if (lbl) lbl.textContent = '● REC';
    if (lbl) lbl.style.color = 'var(--channel)';
    recSecs = 0;
    recInterval = setInterval(function(){
      recSecs++;
      if (tmr) tmr.textContent = pad(Math.floor(recSecs/60)) + ':' + pad(recSecs%60);
    }, 1000);
  } else {
    clearInterval(recInterval);
    if (lbl) lbl.textContent = 'READY';
    if (lbl) lbl.style.color = 'var(--t4)';
    alert('Take recorded! Added to Takes & Approvals panel — send to collaborators for review.');
  }
}

function transportAction(action){
  if (action === 'start') { playhead = 0; }
}

// ── Takes ─────────────────────────────────────────────────────────────────────
function selectTake(id){ console.log('Selected take:', id); }
function approveTake(id){
  alert('Take approved. Collaborators notified. Once all parties approve, the release gate will open.');
}
function rejectTake(id){
  alert('Take rejected. Artist will be prompted to record another take.');
}

// ── Talkback ──────────────────────────────────────────────────────────────────
function startTalkback(){
  var btn = document.getElementById('btn-talkback');
  if (btn) { btn.style.background = 'rgba(255,140,66,0.5)'; btn.style.boxShadow = '0 0 16px rgba(255,140,66,0.5)'; }
}
function stopTalkback(){
  var btn = document.getElementById('btn-talkback');
  if (btn) { btn.style.background = 'rgba(255,140,66,0.15)'; btn.style.boxShadow = 'none'; }
}

// ── Audience ─────────────────────────────────────────────────────────────────
function toggleAudience(){
  audMode = !audMode;
  var gate = document.getElementById('audience-gate');
  var cnt  = document.getElementById('aud-count');
  if (gate) gate.style.display = audMode ? 'flex' : 'none';
  if (cnt)  cnt.textContent = audMode ? 'ON (1)' : 'OFF';
}

// ── Panel section collapse ────────────────────────────────────────────────────
function toggleSec(name){
  var sec  = document.getElementById('sec-' + name);
  var chev = document.getElementById('chev-' + name);
  if (!sec) return;
  var hidden = sec.style.display === 'none';
  sec.style.display = hidden ? '' : 'none';
  if (chev) chev.style.transform = hidden ? '' : 'rotate(-90deg)';
}

// ── Chat ──────────────────────────────────────────────────────────────────────
function sendChat(){
  var inp  = document.getElementById('chat-in');
  var msgs = document.getElementById('chat-msgs');
  if (!inp || !msgs || !inp.value.trim()) return;
  var text = inp.value.trim();
  inp.value = '';
  var now = new Date();
  var ts  = pad(now.getHours()) + ':' + pad(now.getMinutes());
  var el = document.createElement('div');
  el.style.display = 'flex';
  el.style.flexDirection = 'column';
  el.style.alignItems = 'flex-end';
  el.innerHTML =
    '<div style="max-width:90%;padding:7px 11px;border-radius:10px 10px 3px 10px;background:var(--signal);color:#000;font-size:0.8rem;line-height:1.45;font-weight:600;">' + text + '</div>' +
    '<div style="font-size:0.58rem;color:var(--t4);margin-top:2px;padding:0 3px;">' + ts + '</div>';
  msgs.appendChild(el);
  msgs.scrollTop = msgs.scrollHeight;
}

// ── Bounce ────────────────────────────────────────────────────────────────────
function showBounce(){
  var m = document.getElementById('bounce-modal');
  if (m) m.style.display = 'flex';
}
function closeBounce(){
  var m = document.getElementById('bounce-modal');
  if (m) m.style.display = 'none';
}
function doBounce(){
  closeBounce();
  alert('Bounce started! Files will appear in the Stem Vault once export completes. All collaborators will be notified for approval.');
}

// ── Misc ──────────────────────────────────────────────────────────────────────
function showInvite(){ alert('Invite link: https://artistcollab.io/session/${sessionId}\\n\\nShare this link with collaborators or audience members. Role is assigned when they join.'); }
function confirmEnd(){
  if (confirm('End the live session? All participants will be disconnected. The session recording will be saved to the project workspace.')) {
    window.location.href = '/workspace/${sessionId}';
  }
}
function togglePanel(name){ /* settings panel */ }
</script>

${closeShell()}`;
}
