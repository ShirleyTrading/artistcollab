import { shell, closeShell, authedNav, appSidebar } from '../layout';
import {
  users, projects, splitSheets, agreements,
  getUserById, formatPrice, isSplitSheetFullyApproved,
  splitSheetTotal, isReleaseGateOpen, statusColor, statusLabel,
  type Project, type SplitSheet,
} from '../data';
// ─── Enhanced Workspace Page ──────────────────────────────────────────────────

const WS_STYLES = `
  .ws-layout {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 20px;
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
    align-items: start;
  }
  .ws-panel { background: var(--c-panel); border: 1px solid var(--c-wire); border-radius: var(--r-lg); overflow: hidden; }
  .ws-panel-head {
    padding: 13px 18px;
    border-bottom: 1px solid var(--c-wire);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--c-raised);
    flex-wrap: wrap;
    gap: 8px;
  }
  .ws-label {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .file-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 14px;
    border-bottom: 1px solid var(--c-wire);
    transition: background var(--t-fast);
    min-width: 0;
  }
  .file-row:hover { background: var(--c-ghost); }
  .msg-bubble {
    padding: 10px 13px;
    border-radius: 12px 12px 12px 3px;
    font-size: 0.875rem;
    line-height: 1.5;
    max-width: 80%;
    word-break: break-word;
  }
  .msg-bubble.mine { border-radius: 12px 12px 3px 12px; background: var(--signal); color: #000; font-weight: 500; }
  .msg-bubble.them { background: var(--c-raised); border: 1px solid var(--c-wire); }
  .stem-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--c-wire);
    min-width: 0;
    transition: background var(--t-fast);
  }
  .stem-row:hover { background: var(--c-ghost); }
  .lyrics-box {
    width: 100%;
    background: var(--c-raised);
    border: 1px solid var(--c-rim);
    border-radius: var(--r-md);
    padding: 14px;
    color: var(--t1);
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    line-height: 1.8;
    resize: vertical;
    min-height: 160px;
    box-sizing: border-box;
  }
  .lyrics-box:focus { outline: none; border-color: var(--signal); box-shadow: 0 0 0 3px var(--signal-dim); }
  .ws-tabs { display: flex; border-bottom: 1px solid var(--c-wire); overflow-x: auto; scrollbar-width: none; }
  .ws-tabs::-webkit-scrollbar { display: none; }
  .ws-tab {
    padding: 11px 16px;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--t3);
    cursor: pointer;
    white-space: nowrap;
    border-bottom: 2px solid transparent;
    background: none;
    border-top: none; border-left: none; border-right: none;
    font-family: var(--font-body);
    margin-bottom: -1px;
    transition: color var(--t-fast), border-color var(--t-fast);
    min-height: 44px;
  }
  .ws-tab:hover { color: var(--t1); }
  .ws-tab.on { color: var(--signal); border-bottom-color: var(--signal); }
  @media (max-width: 1024px) {
    .ws-layout { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .ws-layout { padding: 14px; gap: 14px; }
    .ws-panel-head { padding: 11px 13px; }
    .file-row, .stem-row { padding: 10px 12px; }
  }
`;

const TRACK_COLORS: Record<string, string> = {
  vox:        'var(--signal)',
  beat:       'var(--patch)',
  instrument: 'var(--warm)',
  mix:        'var(--channel)',
  master:     '#a78bfa',
  other:      'var(--t4)',
};
const TRACK_ICONS: Record<string, string> = {
  vox:        'fa-microphone',
  beat:       'fa-drum',
  instrument: 'fa-guitar',
  mix:        'fa-sliders-h',
  master:     'fa-compact-disc',
  other:      'fa-file-audio',
};

export function workspacePage(project: Project): string {
  // PGES: Defensive — ensure demo user always exists
  const demoUser = users[0];
  if (!demoUser) {
    return shell('Error', WS_STYLES)
      + `<div style="padding:40px;color:#F0F0F4;">Configuration error: no users defined.</div>`
      + closeShell();
  }

  // PGES: Defensive counterpart lookup with graceful fallback
  const counterpartId = project.buyerId === demoUser.id ? project.sellerId : project.buyerId;
  const counterpart   = getUserById(counterpartId ?? '') ?? {
    id: counterpartId ?? 'unknown',
    artistName: 'Collaborator',
    username: 'collaborator',
    profileImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=60&h=60&fit=crop',
  } as any;

  const sc          = statusColor(project.status ?? '');
  const sl          = statusLabel(project.status ?? '');
  const progressMap: Record<string, number> = {
    pending: 10, in_progress: 45, awaiting_delivery: 70,
    delivered: 85, revision_requested: 60, completed: 100, cancelled: 0,
  };
  const prog        = progressMap[project.status ?? ''] ?? 20;
  const ss          = project.splitSheetId ? splitSheets.find(s => s.id === project.splitSheetId) : null;
  const ag          = project.agreementId  ? agreements.find(a => a.id === project.agreementId)   : null;
  const releaseOpen = isReleaseGateOpen(project);
  const isSplit     = project.collabType === 'ownership_split';

  const wh = [0.3,0.6,0.9,0.8,1.0,0.85,0.6,0.4,0.7,0.9,0.8,0.6,0.4,0.7,0.5,0.8,0.9,0.65,0.5,0.75];

  // Safe-escape for use in JS string literals
  function jsStr(s: string): string {
    return String(s ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
  }

  return shell(project.title, WS_STYLES)
    + authedNav('projects')
    + `<div class="app-shell">${appSidebar('projects')}<main class="app-main">
  <div class="ws-layout">

    <!-- ── LEFT MAIN ─────────────────────────────────────────── -->
    <div style="display:flex;flex-direction:column;gap:16px;">

      <!-- Project header -->
      <div class="ws-panel">
        <div style="padding:20px;border-bottom:1px solid var(--c-wire);border-top:3px solid ${sc};">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:14px;">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="position:relative;">
                <img src="${counterpart.profileImage}" class="av av-md"
                     style="border:1.5px solid var(--c-rim);" alt="${counterpart.artistName}">
                <div style="position:absolute;bottom:0;right:0;width:10px;height:10px;border-radius:50%;background:var(--s-ok);border:2px solid var(--c-panel);"></div>
              </div>
              <div>
                <h2 style="font-size:1rem;font-weight:700;letter-spacing:-0.01em;margin-bottom:2px;">${project.title}</h2>
                <div class="mono-sm" style="color:var(--t4);">with ${counterpart.artistName} · @${counterpart.username}</div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <span class="badge" style="background:${sc}18;color:${sc};border:1px solid ${sc}33;font-family:var(--font-mono);">${sl}</span>
              <span style="font-size:0.72rem;font-weight:600;padding:2px 9px;border-radius:var(--r-full);${isSplit ? 'background:var(--signal-dim);color:var(--signal);border:1px solid rgba(200,255,0,0.2);' : 'background:rgba(255,140,66,0.1);color:var(--warm);border:1px solid rgba(255,140,66,0.2);'}">
                <i class="fas ${isSplit ? 'fa-chart-pie' : 'fa-dollar-sign'}" style="font-size:9px;"></i>
                ${isSplit ? 'Ownership Split' : 'Pay-for-Hire'}
              </span>
              <a href="/dashboard/messages" class="btn btn-secondary btn-sm"><i class="fas fa-comment-dots" style="font-size:11px;"></i> Message</a>
            </div>
          </div>

          <!-- Progress bar + mini waveform -->
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <span class="mono-sm" style="color:var(--t4);white-space:nowrap;">Progress</span>
            <div style="flex:1;height:4px;background:var(--c-rim);border-radius:2px;overflow:hidden;">
              <div style="height:100%;width:${prog}%;background:${sc};border-radius:2px;transition:width 0.6s ease;box-shadow:0 0 8px ${sc}55;"></div>
            </div>
            <span class="mono-sm" style="color:var(--t4);">${prog}%</span>
          </div>
          <div style="display:flex;align-items:flex-end;gap:2px;height:14px;opacity:0.25;margin-bottom:12px;">
            ${wh.map((h, i) => `<div style="flex:1;height:${Math.round(h * 100)}%;background:${i / wh.length < prog / 100 ? sc : 'var(--c-rim)'};border-radius:1px 1px 0 0;"></div>`).join('')}
          </div>

          <div style="display:flex;gap:16px;flex-wrap:wrap;">
            ${[
              { icon: 'fa-box',        label: 'Package',     val: project.package ?? 'Standard' },
              { icon: 'fa-calendar',   label: 'Due',         val: project.dueDate ?? 'TBD' },
              { icon: 'fa-dollar-sign',label: 'Order total', val: formatPrice(project.orderTotal ?? 0) },
            ].map(s => `
            <div style="display:flex;align-items:center;gap:6px;font-size:0.8125rem;color:var(--t3);">
              <i class="fas ${s.icon}" style="color:var(--t4);font-size:11px;width:14px;text-align:center;"></i>
              <span class="mono-sm" style="color:var(--t4);">${s.label}:</span>
              <span style="font-weight:600;color:var(--t1);">${s.val}</span>
            </div>`).join('')}
          </div>
        </div>

        <!-- Release gate banner (inside header) -->
        <div style="padding:12px 20px;display:flex;align-items:center;gap:10px;background:${releaseOpen ? 'rgba(34,197,94,0.06)' : 'rgba(245,158,11,0.06)'};border-bottom:1px solid var(--c-wire);">
          <i class="fas ${releaseOpen ? 'fa-unlock' : 'fa-lock'}" style="color:${releaseOpen ? '#22c55e' : '#f59e0b'};"></i>
          <div style="flex:1;font-size:0.8125rem;color:var(--t3);">
            ${releaseOpen
              ? '<strong style="color:#22c55e;">Release Gate Open</strong> — All parties approved. Song may be exported and released.'
              : `<strong style="color:#f59e0b;">Release Gate Locked</strong> — Waiting for ${project.releaseApprovals.filter(a => !a.approved).length} more approval(s) before release is allowed.`}
          </div>
          ${!releaseOpen ? `
          <button class="btn btn-primary btn-xs" onclick="alert('Your release approval has been recorded. Collaborators have been notified.')">
            <i class="fas fa-check" style="font-size:9px;"></i> Approve Release
          </button>` : ''}
        </div>
      </div>

      <!-- Workspace tabs: Stems | Lyrics | Chat | Files | Activity -->
      <div class="ws-panel">
        <div class="ws-tabs">
          <button class="ws-tab on" onclick="wsTab('stems',this)"><i class="fas fa-layer-group" style="font-size:11px;margin-right:5px;"></i>Stems</button>
          <button class="ws-tab"   onclick="wsTab('lyrics',this)"><i class="fas fa-file-lines" style="font-size:11px;margin-right:5px;"></i>Lyrics</button>
          <button class="ws-tab"   onclick="wsTab('chat',this)"><i class="fas fa-comments" style="font-size:11px;margin-right:5px;"></i>Chat</button>
          <button class="ws-tab"   onclick="wsTab('files',this)"><i class="fas fa-folder-open" style="font-size:11px;margin-right:5px;"></i>Files</button>
          <button class="ws-tab"   onclick="wsTab('activity',this)"><i class="fas fa-clock-rotate-left" style="font-size:11px;margin-right:5px;"></i>Activity</button>
        </div>

        <!-- ── STEMS TAB ── -->
        <div id="wst-stems">
          <div class="ws-panel-head" style="background:transparent;border-top:none;">
            <span class="ws-label" style="color:var(--signal);">
              <span style="width:12px;height:1px;background:var(--signal);box-shadow:0 0 4px var(--signal-glow);"></span>
              Stem Vault <span style="color:var(--t4);">${project.stems?.length ?? 0} stems</span>
            </span>
            <button class="btn btn-primary btn-xs" onclick="alert('Upload stem dialog — supports WAV, AIFF, MP3.')">
              <i class="fas fa-upload" style="font-size:10px;"></i> Upload Stem
            </button>
          </div>
          ${(project.stems?.length ?? 0) > 0 ? project.stems.map(stem => {
            const uploader  = getUserById(stem.uploadedBy ?? '');
            const color     = TRACK_COLORS[stem.trackType] ?? 'var(--t4)';
            const icon      = TRACK_ICONS[stem.trackType]  ?? 'fa-file-audio';
            const safeName  = jsStr(stem.name);
            return `
          <div class="stem-row">
            <div style="width:38px;height:38px;background:${color}18;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid ${color}33;">
              <i class="fas ${icon}" style="color:${color};font-size:14px;"></i>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:0.875rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${stem.name}</div>
              <div class="mono-sm" style="color:var(--t4);">
                ${stem.size} · ${stem.uploadedAt}
                ${stem.bpm ? ` · ${stem.bpm} BPM` : ''}
                ${stem.key ? ` · Key ${stem.key}` : ''}
                · ${uploader?.artistName ?? 'Unknown'}
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
              <span style="font-size:0.65rem;padding:2px 8px;border-radius:var(--r-full);background:${color}18;color:${color};border:1px solid ${color}33;font-family:var(--font-mono);text-transform:uppercase;">${stem.trackType}</span>
              <span class="badge ${stem.approved ? 'badge-signal' : 'badge-muted'}" style="font-size:0.6rem;">${stem.approved ? 'Approved' : 'Pending'}</span>
              <span class="mono-sm" style="color:var(--t4);">V${stem.version}</span>
              ${!stem.approved ? `<button class="btn btn-primary btn-xs" onclick="alert('Stem approved: ${safeName}')"><i class="fas fa-check" style="font-size:9px;"></i></button>` : ''}
              <button class="btn btn-ghost btn-xs" style="padding:5px 8px;" onclick="alert('Downloading: ${safeName}')">
                <i class="fas fa-download" style="font-size:11px;"></i>
              </button>
            </div>
          </div>`;
          }).join('') : `
          <div style="padding:32px;text-align:center;">
            <i class="fas fa-layer-group" style="font-size:1.75rem;color:var(--t4);margin-bottom:12px;display:block;"></i>
            <p style="color:var(--t4);font-size:0.875rem;margin:0;">No stems yet. Upload your tracks to the vault.</p>
          </div>`}
        </div>

        <!-- ── LYRICS TAB ── -->
        <div id="wst-lyrics" style="display:none;">
          <div class="ws-panel-head" style="background:transparent;border-top:none;">
            <span class="ws-label" style="color:var(--patch);">
              <span style="width:12px;height:1px;background:var(--patch);"></span>
              Lyrics / Co-write
              ${project.lyrics ? `<span class="mono-sm" style="color:var(--t4);">v${project.lyrics.version} · edited ${project.lyrics.lastEditedAt?.split('T')[0] ?? ''}</span>` : ''}
            </span>
            <button class="btn btn-primary btn-xs" onclick="alert('Lyrics saved.')">
              <i class="fas fa-save" style="font-size:10px;"></i> Save
            </button>
          </div>
          <div style="padding:16px;">
            ${project.lyrics
              ? `<textarea class="lyrics-box" id="lyrics-editor" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'"
                          placeholder="Write lyrics here… Use [Verse], [Chorus], [Hook] markers.">${project.lyrics.content}</textarea>
                 <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;flex-wrap:wrap;gap:8px;">
                   <div class="mono-sm" style="color:var(--t4);">Last edited by ${getUserById(project.lyrics.lastEditedBy)?.artistName ?? 'Unknown'} · Auto-saved every 30s</div>
                   <div style="display:flex;gap:6px;">
                     <button class="btn btn-secondary btn-xs" onclick="alert('Lyrics exported as PDF.')"><i class="fas fa-file-pdf" style="font-size:10px;"></i> Export PDF</button>
                     <button class="btn btn-secondary btn-xs" onclick="alert('Revision v${project.lyrics.version + 1} saved.')"><i class="fas fa-code-branch" style="font-size:10px;"></i> New Version</button>
                   </div>
                 </div>`
              : `<div style="text-align:center;padding:32px;">
                   <i class="fas fa-file-lines" style="font-size:1.75rem;color:var(--t4);margin-bottom:12px;display:block;"></i>
                   <p style="color:var(--t4);font-size:0.875rem;margin:0 0 16px;">No lyrics yet.</p>
                   <button class="btn btn-primary btn-sm" onclick="alert('Lyrics document created.')">Start Writing</button>
                 </div>`
            }
          </div>
        </div>

        <!-- ── CHAT TAB ── -->
        <div id="wst-chat" style="display:none;">
          <div style="padding:16px;display:flex;flex-direction:column;gap:12px;max-height:360px;overflow-y:auto;" id="chat-messages">
            ${(project.messages?.length ? project.messages.slice(-6) : [
              { senderId: project.sellerId ?? '', content: 'Hey! Just listened to the reference — this is exactly my lane.', timestamp: '10:22 AM' },
              { senderId: project.buyerId ?? '',  content: 'I want something raw but polished. Think late-night energy.',     timestamp: '10:25 AM' },
              { senderId: project.sellerId ?? '', content: 'I got you. Expect the first take in 2 days.',                     timestamp: '10:33 AM' },
            ]).map((msg: any) => {
              const sender    = getUserById(msg.senderId ?? '');
              const isMe      = msg.senderId === demoUser.id;
              const senderImg = sender?.profileImage ?? 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=40&h=40&fit=crop';
              const senderName= sender?.artistName ?? 'Unknown';
              const ts        = typeof msg.timestamp === 'string' && msg.timestamp.includes('T')
                ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : String(msg.timestamp ?? '');
              return `
            <div style="display:flex;flex-direction:column;align-items:${isMe ? 'flex-end' : 'flex-start'};">
              ${!isMe ? `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                <img src="${senderImg}" class="av av-xs" style="border:1px solid var(--c-rim);" alt="${senderName}">
                <span style="font-size:0.69rem;color:var(--t4);">${senderName}</span>
              </div>` : ''}
              <div class="msg-bubble ${isMe ? 'mine' : 'them'}">${msg.content ?? ''}</div>
              <div class="mono-sm" style="color:var(--t4);margin-top:3px;">${ts}</div>
            </div>`;
            }).join('')}
          </div>
          <div style="padding:12px;border-top:1px solid var(--c-wire);display:flex;gap:8px;">
            <input type="text" id="chat-input"
              style="flex:1;background:var(--c-raised);border:1px solid var(--c-rim);border-radius:var(--r-lg);padding:9px 14px;color:var(--t1);font-size:0.875rem;font-family:var(--font-body);outline:none;"
              placeholder="Message ${counterpart.artistName}…"
              onkeydown="if(event.key==='Enter'){sendMsg();}"
              onfocus="this.style.borderColor='var(--signal)'"
              onblur="this.style.borderColor='var(--c-rim)'">
            <button class="btn btn-primary btn-sm" style="padding:9px 12px;" onclick="sendMsg()">
              <i class="fas fa-paper-plane" style="font-size:12px;"></i>
            </button>
          </div>
        </div>

        <!-- ── FILES TAB ── -->
        <div id="wst-files" style="display:none;">
          <div class="ws-panel-head" style="background:transparent;border-top:none;">
            <span class="ws-label" style="color:var(--warm);">
              <span style="width:12px;height:1px;background:var(--warm);"></span>
              Project Files
            </span>
            <button class="btn btn-primary btn-xs" onclick="alert('Upload file dialog.')">
              <i class="fas fa-upload" style="font-size:10px;"></i> Upload
            </button>
          </div>
          ${(project.files?.length ? project.files : [
            { id: 'f1', name: 'golden_hook_v2.wav',    type: 'audio', size: '8.1 MB',  uploadedAt: '2026-03-12', version: 2, uploadedBy: project.sellerId ?? '' },
            { id: 'f2', name: 'reference_beat.mp3',    type: 'audio', size: '5.2 MB',  uploadedAt: '2026-03-10', version: 1, uploadedBy: project.buyerId  ?? '' },
            { id: 'f3', name: 'stems_full_pack.zip',   type: 'file',  size: '42.0 MB', uploadedAt: '2026-03-12', version: 1, uploadedBy: project.sellerId ?? '' },
          ]).map((f: any) => {
            const isAudio    = f.type === 'audio' || String(f.name ?? '').match(/\.(wav|mp3|aiff|flac)$/i);
            const uploader   = getUserById(f.uploadedBy ?? '');
            const uploaderName = uploader?.artistName ?? 'Unknown';
            const versionStr = typeof f.version === 'number' ? `V${f.version}` : String(f.version ?? 'V1').toUpperCase();
            const safeName   = jsStr(f.name ?? 'file');
            return `
          <div class="file-row">
            <div style="width:36px;height:36px;background:${isAudio ? 'var(--signal-dim)' : 'rgba(0,194,255,0.08)'};border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i class="fas ${isAudio ? 'fa-music' : 'fa-file-zipper'}" style="color:${isAudio ? 'var(--signal)' : 'var(--patch)'};font-size:13px;"></i>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:0.875rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${f.name ?? 'Unknown file'}</div>
              <div class="mono-sm" style="color:var(--t4);">${f.size ?? '?'} · ${f.uploadedAt ?? ''} · ${uploaderName}</div>
            </div>
            <div style="display:flex;gap:6px;flex-shrink:0;">
              <span class="badge badge-muted">${versionStr}</span>
              <button class="btn btn-ghost btn-xs" style="padding:5px 8px;" onclick="alert('Downloading: ${safeName}')">
                <i class="fas fa-download" style="font-size:11px;"></i>
              </button>
            </div>
          </div>`;
          }).join('')}
        </div>

        <!-- ── ACTIVITY TAB ── -->
        <div id="wst-activity" style="display:none;padding:12px 16px;">
          ${(project.activity?.length ? project.activity : [
            { type: 'created', description: 'Project created',         timestamp: '2026-03-10T14:00:00' },
            { type: 'nda_signed', description: 'NDA signed',           timestamp: '2026-03-10T14:10:00' },
            { type: 'message', description: 'First message sent',      timestamp: '2026-03-10T14:30:00' },
            { type: 'file',    description: 'Reference uploaded',      timestamp: '2026-03-10T15:00:00' },
          ]).map((a: any) => {
            const iconMap: Record<string, string>  = { order_created:'fa-plus', nda_signed:'fa-shield-halved', agreement:'fa-file-contract', message:'fa-comment', file_uploaded:'fa-music', status_change:'fa-circle', payment:'fa-dollar-sign', split_sheet:'fa-chart-pie', file:'fa-file', created:'fa-plus' };
            const colorMap: Record<string, string> = { order_created:'var(--signal)', nda_signed:'#22c55e', agreement:'var(--patch)', message:'var(--patch)', file_uploaded:'var(--warm)', status_change:'var(--s-ok)', payment:'var(--s-ok)', split_sheet:'var(--signal)', file:'var(--warm)', created:'var(--signal)' };
            const ts = typeof a.timestamp === 'string' && a.timestamp.includes('T')
              ? new Date(a.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
              : String(a.timestamp ?? '');
            return `
          <div style="display:flex;gap:10px;padding:9px 0;border-bottom:1px solid var(--c-wire);">
            <div style="width:24px;height:24px;border-radius:50%;background:${colorMap[a.type ?? ''] || 'var(--c-rim)'}18;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
              <i class="fas ${iconMap[a.type ?? ''] || 'fa-circle'}" style="font-size:8px;color:${colorMap[a.type ?? ''] || 'var(--t4)'}"></i>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:0.8125rem;">${a.description ?? ''}</div>
              <div class="mono-sm" style="color:var(--t4);">${ts}</div>
            </div>
          </div>`;
          }).join('')}
        </div>
      </div>

    </div>

    <!-- ── RIGHT SIDEBAR ─────────────────────────────────────── -->
    <div style="display:flex;flex-direction:column;gap:14px;">

      <!-- Escrow status -->
      <div class="ws-panel" style="border-top:3px solid var(--s-ok);">
        <div style="padding:16px;">
          <div class="mono-sm" style="color:var(--t4);margin-bottom:6px;">ESCROW STATUS</div>
          <div style="font-family:var(--font-display);font-size:1.75rem;font-weight:800;letter-spacing:-0.04em;color:var(--s-ok);margin-bottom:4px;">${formatPrice(project.orderTotal ?? 0)}</div>
          <div class="mono-sm" style="color:var(--t4);margin-bottom:12px;">
            ${project.paymentStatus === 'held' ? '🔒 Secured — released on approval' : project.paymentStatus === 'released' ? '✅ Released to seller' : '↩ Refunded'}
          </div>
          <div style="height:3px;background:var(--c-rim);border-radius:2px;overflow:hidden;margin-bottom:12px;">
            <div style="height:100%;width:${prog}%;background:var(--s-ok);border-radius:2px;transition:width 0.5s ease;"></div>
          </div>
          ${project.status === 'delivered' || project.status === 'awaiting_delivery' ? `
          <div style="display:flex;flex-direction:column;gap:6px;">
            <button class="btn btn-primary btn-sm" style="width:100%;justify-content:center;" onclick="alert('Delivery approved — $${project.payoutAmount} will be released to the artist.')">
              <i class="fas fa-check-circle" style="font-size:11px;"></i> Approve Delivery
            </button>
            <button class="btn btn-secondary btn-sm" style="width:100%;justify-content:center;" onclick="alert('Revision requested. The artist has been notified.')">
              Request Revision
            </button>
          </div>` : `
          <button class="btn btn-secondary btn-sm" style="width:100%;justify-content:center;" disabled style="opacity:0.5;cursor:not-allowed;">
            ${project.status === 'completed' ? '✅ Payout Released' : 'Awaiting Delivery'}
          </button>`}
        </div>
      </div>

      <!-- Split Sheet widget -->
      ${ss ? `
      <div class="ws-panel" style="border-top:3px solid var(--signal);">
        <div class="ws-panel-head">
          <span class="ws-label" style="color:var(--signal);">
            <span style="width:10px;height:1px;background:var(--signal);"></span>
            Split Sheet
          </span>
          <a href="/split-sheet/${ss.id}" class="btn btn-primary btn-xs">View →</a>
        </div>
        <div style="padding:14px 16px;">
          <div style="margin-bottom:10px;">
            <div class="mono-sm" style="color:var(--t4);margin-bottom:5px;">MASTER OWNERSHIP</div>
            <div style="display:flex;height:8px;border-radius:4px;overflow:hidden;gap:2px;margin-bottom:6px;">
              ${ss.masterOwnership.map((s, i) => {
                const pct = (s.percentage / splitSheetTotal(ss.masterOwnership)) * 100;
                return `<div style="flex:0 0 ${pct.toFixed(1)}%;background:${['var(--signal)','var(--patch)','var(--warm)','var(--channel)'][i % 4]};"></div>`;
              }).join('')}
            </div>
            ${ss.masterOwnership.map((s, i) => {
              const u = getUserById(s.userId);
              return `<div style="display:flex;justify-content:space-between;font-size:0.75rem;padding:3px 0;"><span style="color:var(--t3);">${u?.artistName ?? 'Unknown'}</span><span style="color:${['var(--signal)','var(--patch)','var(--warm)','var(--channel)'][i % 4]};font-weight:700;">${s.percentage}%</span></div>`;
            }).join('')}
          </div>
          <div style="margin-bottom:12px;">
            <div class="mono-sm" style="color:var(--t4);margin-bottom:5px;">PUBLISHING</div>
            <div style="display:flex;height:8px;border-radius:4px;overflow:hidden;gap:2px;margin-bottom:6px;">
              ${ss.publishingOwnership.map((s, i) => {
                const pct = (s.percentage / splitSheetTotal(ss.publishingOwnership)) * 100;
                return `<div style="flex:0 0 ${pct.toFixed(1)}%;background:${['var(--signal)','var(--patch)','var(--warm)','var(--channel)'][i % 4]};"></div>`;
              }).join('')}
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:var(--r-md);background:${ss.releasable ? 'rgba(34,197,94,0.08)' : 'rgba(245,158,11,0.08)'};border:1px solid ${ss.releasable ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'};">
            <i class="fas ${ss.releasable ? 'fa-unlock' : 'fa-lock'}" style="color:${ss.releasable ? '#22c55e' : '#f59e0b'};font-size:0.875rem;"></i>
            <span style="font-size:0.75rem;font-weight:600;color:${ss.releasable ? '#22c55e' : '#f59e0b'};">Release Gate ${ss.releasable ? 'Open' : 'Locked'}</span>
          </div>
          <div style="margin-top:10px;">
            ${ss.collaborators.map(c => {
              const u = getUserById(c.userId);
              return `<div style="display:flex;align-items:center;justify-content:space-between;padding:5px 0;font-size:0.75rem;border-bottom:1px solid var(--c-wire);">
                <span style="color:var(--t3);">${u?.artistName ?? 'Unknown'}</span>
                <span style="color:${c.approvalStatus === 'approved' ? '#22c55e' : '#f59e0b'};font-family:var(--font-mono);font-size:0.62rem;">${c.approvalStatus}</span>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>` : isSplit ? `
      <div class="ws-panel" style="border-top:3px solid #f59e0b;">
        <div style="padding:16px;text-align:center;">
          <i class="fas fa-file-contract" style="font-size:1.5rem;color:var(--t4);margin-bottom:10px;display:block;"></i>
          <div style="font-size:0.875rem;font-weight:600;margin-bottom:6px;">No Split Sheet Yet</div>
          <p style="font-size:0.8125rem;color:var(--t4);margin:0 0 12px;">Create a split sheet to define ownership percentages for this project.</p>
          <button class="btn btn-primary btn-sm" style="width:100%;justify-content:center;" onclick="alert('Split sheet creation wizard — coming in full release.')">
            <i class="fas fa-plus" style="font-size:10px;"></i> Create Split Sheet
          </button>
        </div>
      </div>` : ''}

      <!-- Agreement / NDA widget -->
      ${ag ? `
      <div class="ws-panel">
        <div class="ws-panel-head">
          <span class="ws-label" style="color:var(--patch);">
            <span style="width:10px;height:1px;background:var(--patch);"></span>
            Agreement
          </span>
          <a href="/agreement/${project.id}" class="btn btn-secondary btn-xs">View →</a>
        </div>
        <div style="padding:12px 16px;display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:var(--r-md);background:${ag.ndaSignedByAll ? 'rgba(34,197,94,0.08)' : 'rgba(245,158,11,0.08)'};border:1px solid ${ag.ndaSignedByAll ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'};">
            <i class="fas fa-shield-halved" style="color:${ag.ndaSignedByAll ? '#22c55e' : '#f59e0b'};"></i>
            <span style="font-size:0.75rem;font-weight:600;color:${ag.ndaSignedByAll ? '#22c55e' : '#f59e0b'};">NDA ${ag.ndaSignedByAll ? 'Signed by All' : 'Pending'}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:0.8125rem;">
            <span style="color:var(--t4);">Status</span>
            <span style="font-weight:600;text-transform:capitalize;">${ag.status}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:0.8125rem;">
            <span style="color:var(--t4);">Signatories</span>
            <span style="font-weight:600;">${ag.signatories.filter(s => s.signed).length}/${ag.signatories.length} signed</span>
          </div>
        </div>
      </div>` : ''}

      <!-- Project details -->
      <div class="ws-panel">
        <div class="ws-panel-head">
          <span class="ws-label" style="color:var(--t4);">
            <span style="width:10px;height:1px;background:var(--t4);"></span>
            Details
          </span>
        </div>
        <div style="padding:12px 16px;">
          ${[
            { label: 'Order ID',     val: `#${String(project.id ?? 'N/A').toUpperCase()}`, mono: true },
            { label: 'Package',      val: project.package ?? 'Standard',                  mono: false },
            { label: 'Due date',     val: project.dueDate ?? 'TBD',                       mono: false },
            { label: 'Platform fee', val: formatPrice(project.platformFee ?? 0),           mono: false },
            { label: 'Payout',       val: formatPrice(project.payoutAmount ?? 0),          mono: false },
          ].map(d => `
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--c-wire);font-size:0.8125rem;">
            <span style="color:var(--t4);">${d.label}</span>
            <span style="font-weight:600;${d.mono ? 'font-family:var(--font-mono);' : ''}">${d.val}</span>
          </div>`).join('')}
        </div>
      </div>

    </div>
  </div>

</main></div>

<script>
// Workspace tab switching
function wsTab(name, btn) {
  ['stems','lyrics','chat','files','activity'].forEach(function(t) {
    var el = document.getElementById('wst-' + t);
    if (el) el.style.display = 'none';
  });
  document.querySelectorAll('.ws-tab').forEach(function(b) { b.classList.remove('on'); });
  var el = document.getElementById('wst-' + name);
  if (el) el.style.display = '';
  if (btn) btn.classList.add('on');
}
// Chat send
function sendMsg() {
  var input = document.getElementById('chat-input');
  if (!input || !input.value.trim()) return;
  var container = document.getElementById('chat-messages');
  if (container) {
    var div = document.createElement('div');
    div.style.cssText = 'display:flex;flex-direction:column;align-items:flex-end;';
    div.innerHTML = '<div class="msg-bubble mine">' + input.value.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</div><div class="mono-sm" style="color:var(--t4);margin-top:3px;">Just now</div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }
  input.value = '';
}
// Auto-scroll chat on load
(function() {
  var c = document.getElementById('chat-messages');
  if (c) c.scrollTop = c.scrollHeight;
})();
</script>
${closeShell()}`;
}
