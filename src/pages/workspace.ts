import { shell, closeShell, authedNav, appSidebar } from '../layout';
import {
  users, projects, splitSheets, agreements,
  getUserById, formatPrice, statusColor, statusLabel,
  type Project, type SplitSheet,
} from '../data';

export function workspacePage(projectId: string): string {
  const project = projects.find(p => p.id === projectId);
  const demoUser = users[0];

  if (!project) {
    return shell('Project Not Found', '') + authedNav() + `
    <div style="min-height:60vh;display:flex;align-items:center;justify-content:center;padding:60px 24px;">
      <div style="text-align:center;">
        <div style="font-size:3rem;margin-bottom:16px;">📂</div>
        <h1 style="font-family:var(--font-display);font-size:1.75rem;color:var(--t1);margin-bottom:12px;">Project not found</h1>
        <a href="/dashboard/projects" class="btn btn-primary">Back to Projects</a>
      </div>
    </div>
    ${closeShell()}`;
  }

  const buyer  = getUserById(project.buyerId);
  const seller = getUserById(project.sellerId);
  const counterpart = project.buyerId === demoUser.id ? seller : buyer;
  const role = project.sellerId === demoUser.id ? 'SELLER' : 'BUYER';

  const splitSheet = splitSheets.find(s => s.projectId === project.id);

  const progressMap: Record<string, number> = {
    pending: 5, in_progress: 45, awaiting_delivery: 70,
    delivered: 85, revision_requested: 60, completed: 100,
  };
  const pct = progressMap[project.status] ?? 0;

  const timelineStages = [
    { key: 'booked',      label: 'Booked',          done: true },
    { key: 'terms',       label: 'Terms Signed',     done: true },
    { key: 'escrow',      label: 'Escrow Active',    done: true },
    { key: 'files',       label: 'Files Uploaded',   done: project.status !== 'pending' },
    { key: 'in_progress', label: 'In Session',       done: ['in_progress','awaiting_delivery','delivered','completed'].includes(project.status) },
    { key: 'delivery',    label: 'Delivery Submitted', done: ['delivered','completed'].includes(project.status) },
    { key: 'approval',    label: 'Approved',         done: project.status === 'completed' },
  ];

  return shell(`${project.title} — Project Room`, `

  /* ══ WORKSPACE ═════════════════════════════════════════════════════════════ */

  .ws-page { max-width: 1200px; margin: 0 auto; padding: 20px 24px 80px; }

  /* ── Project header bar ── */
  .ws-header {
    background: var(--c-panel); border: 1px solid var(--c-wire);
    border-radius: var(--r-xl); padding: 16px 20px;
    display: flex; align-items: center; gap: 16px;
    margin-bottom: 20px; flex-wrap: wrap;
  }
  .ws-header-left { flex: 1; min-width: 0; }
  .ws-proj-label { font-family: var(--font-mono); font-size: 0.625rem; color: var(--t3); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
  .ws-proj-title { font-family: var(--font-display); font-size: 1.125rem; font-weight: 800; color: var(--t1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ws-proj-meta { display: flex; align-items: center; gap: 12px; margin-top: 4px; font-size: 0.75rem; color: var(--t2); flex-wrap: wrap; }
  .ws-badge {
    font-family: var(--font-mono); font-size: 0.6rem; font-weight: 700;
    padding: 3px 9px; border-radius: var(--r-full); letter-spacing: 0.06em;
  }
  .ws-prog-row { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 200px; }
  .ws-prog-bar { flex: 1; height: 4px; background: var(--c-rim); border-radius: 2px; overflow: hidden; }
  .ws-prog-fill { height: 100%; border-radius: 2px; background: var(--signal); }

  /* ── Layout ── */
  .ws-layout { display: grid; grid-template-columns: 1fr 280px; gap: 20px; align-items: start; }

  /* ── Tabs ── */
  .ws-tabs {
    display: flex; background: var(--c-panel); border: 1px solid var(--c-wire);
    border-radius: var(--r-xl); overflow: hidden; margin-bottom: 14px;
  }
  .ws-tab {
    flex: 1; padding: 13px 8px; text-align: center;
    font-size: 0.8125rem; font-weight: 600; color: var(--t3);
    cursor: pointer; border: none; background: none;
    border-right: 1px solid var(--c-wire);
    transition: color 0.15s, background 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .ws-tab:last-child { border-right: none; }
  .ws-tab.active { background: var(--c-raised); color: var(--t1); }
  .ws-tab:hover:not(.active) { background: var(--c-ghost); color: var(--t2); }
  .ws-tab i { font-size: 12px; }
  .ws-badge-count {
    background: var(--channel); color: #fff;
    width: 16px; height: 16px; border-radius: 50%;
    font-size: 0.5625rem; font-weight: 700; line-height: 16px;
    text-align: center; flex-shrink: 0;
  }

  .ws-panel { display: none; }
  .ws-panel.active { display: block; }

  /* ── Chat panel ── */
  .chat-area {
    background: var(--c-panel); border: 1px solid var(--c-wire);
    border-radius: var(--r-xl); overflow: hidden;
  }
  .chat-messages {
    padding: 16px; min-height: 360px; max-height: 500px;
    overflow-y: auto; display: flex; flex-direction: column; gap: 14px;
  }
  .chat-msg { display: flex; align-items: flex-end; gap: 8px; }
  .chat-msg.mine { flex-direction: row-reverse; }
  .chat-avt { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
  .chat-bubble {
    padding: 10px 13px; border-radius: 12px;
    font-size: 0.875rem; line-height: 1.5; max-width: 80%; word-break: break-word;
  }
  .chat-bubble.mine { background: var(--signal); color: #000; font-weight: 500; border-radius: 12px 12px 3px 12px; }
  .chat-bubble.them { background: var(--c-raised); border: 1px solid var(--c-wire); color: var(--t1); border-radius: 12px 12px 12px 3px; }
  .chat-time { font-size: 0.6875rem; color: var(--t4); flex-shrink: 0; margin-bottom: 4px; }
  .chat-input-bar {
    padding: 12px 14px; border-top: 1px solid var(--c-wire);
    display: flex; gap: 10px; background: var(--c-raised);
  }
  .chat-input {
    flex: 1; background: var(--c-panel); border: 1px solid var(--c-rim);
    border-radius: var(--r-full); padding: 10px 14px;
    color: var(--t1); font-size: 0.875rem; font-family: var(--font-body);
    outline: none; transition: border-color 0.15s;
  }
  .chat-input:focus { border-color: var(--signal); }
  .chat-send {
    width: 38px; height: 38px; border-radius: 50%;
    background: var(--signal); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--c-void); font-size: 13px; flex-shrink: 0;
    transition: opacity 0.15s;
  }
  .chat-send:hover { opacity: 0.85; }

  /* ── Files panel ── */
  .file-row {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px; border-bottom: 1px solid var(--c-wire);
    transition: background 0.1s;
  }
  .file-row:hover { background: var(--c-ghost); }
  .file-icon { width: 36px; height: 36px; border-radius: var(--r-md); display: flex; align-items: center; justify-content: center; font-size: 0.875rem; flex-shrink: 0; }
  .file-info { flex: 1; min-width: 0; }
  .file-name { font-size: 0.875rem; font-weight: 600; color: var(--t1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .file-meta { font-size: 0.6875rem; color: var(--t3); margin-top: 2px; }
  .file-dl { font-size: 0.75rem; color: var(--patch); text-decoration: none; flex-shrink: 0; }
  .file-dl:hover { text-decoration: underline; }

  /* ── Split sheet panel ── */
  .split-table { width: 100%; border-collapse: collapse; }
  .split-table th, .split-table td { padding: 11px 16px; text-align: left; border-bottom: 1px solid var(--c-wire); font-size: 0.875rem; }
  .split-table th { font-family: var(--font-mono); font-size: 0.625rem; color: var(--t4); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; background: var(--c-raised); }
  .split-table td { color: var(--t1); }
  .split-pct { font-family: var(--font-mono); font-weight: 700; color: var(--signal); }

  /* ── Live session panel ── */
  .session-placeholder {
    background: var(--c-panel); border: 1px solid var(--c-wire);
    border-radius: var(--r-xl); padding: 60px 32px; text-align: center;
  }

  /* ── Right sidebar ── */
  .ws-sidebar { display: flex; flex-direction: column; gap: 14px; }
  .ws-side-card {
    background: var(--c-panel); border: 1px solid var(--c-wire);
    border-radius: var(--r-xl); padding: 16px; overflow: hidden;
  }
  .ws-side-title {
    font-family: var(--font-mono); font-size: 0.6rem; color: var(--t3);
    letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 12px;
  }
  .ws-timeline { display: flex; flex-direction: column; gap: 0; }
  .ws-tl-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 0; position: relative;
  }
  .ws-tl-dot {
    width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0;
    border: 2px solid var(--c-rim); background: var(--c-raised);
  }
  .ws-tl-item.done .ws-tl-dot { background: var(--signal); border-color: var(--signal); }
  .ws-tl-item.active .ws-tl-dot { background: var(--patch); border-color: var(--patch); box-shadow: 0 0 6px var(--patch-glow); }
  .ws-tl-line {
    position: absolute; left: 5px; top: 20px; bottom: -8px;
    width: 1px; background: var(--c-rim);
  }
  .ws-tl-item.done .ws-tl-line { background: var(--signal); }
  .ws-tl-item:last-child .ws-tl-line { display: none; }
  .ws-tl-label { font-size: 0.8125rem; color: var(--t2); }
  .ws-tl-item.done .ws-tl-label { color: var(--t1); }

  /* Escrow status display */
  .escrow-bar { background: var(--c-raised); border: 1px solid var(--c-rim); border-radius: var(--r-md); padding: 12px; }
  .escrow-stage { display: flex; align-items: center; gap: 8px; padding: 7px 0; border-bottom: 1px solid var(--c-wire); font-size: 0.8125rem; }
  .escrow-stage:last-child { border-bottom: none; }
  .escrow-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

  /* Responsive */
  @media (max-width: 1024px) {
    .ws-layout { grid-template-columns: 1fr; }
    .ws-sidebar { display: grid; grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .ws-page { padding: 14px 14px 60px; }
    .ws-tabs .ws-tab span { display: none; }
    .ws-sidebar { grid-template-columns: 1fr; }
  }

  `, authedNav() + appSidebar('projects') + `

  <div class="ws-page">

    <!-- Project header -->
    <div class="ws-header">
      <div class="ws-header-left">
        <div class="ws-proj-label">Project Room</div>
        <div class="ws-proj-title">${project.title}</div>
        <div class="ws-proj-meta">
          <span>with <strong>${counterpart?.artistName}</strong></span>
          <span class="ws-badge" style="background:${statusColor(project.status)}22;color:${statusColor(project.status)};">${statusLabel(project.status)}</span>
          <span class="ws-badge" style="background:${role === 'SELLER' ? 'var(--signal-dim)' : 'var(--patch-dim)'};color:${role === 'SELLER' ? 'var(--signal)' : 'var(--patch)'};">${role}</span>
          <span style="color:var(--t3);">Due ${new Date(project.dueDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
        </div>
      </div>

      <!-- Progress + Amount -->
      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
        <div class="ws-prog-row">
          <div class="ws-prog-bar"><div class="ws-prog-fill" style="width:${pct}%;"></div></div>
          <span style="font-family:var(--font-mono);font-size:0.6875rem;color:var(--t3);">${pct}%</span>
        </div>
        <div style="text-align:right;flex-shrink:0;">
          <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--t3);">Project value</div>
          <div style="font-family:var(--font-display);font-size:1.125rem;font-weight:800;color:var(--signal);">${formatPrice(project.orderTotal)}</div>
        </div>
        ${project.status === 'delivered' ? `
        <a href="#" class="btn btn-primary" onclick="alert('Delivery approval with payment release coming in production build.')">
          <i class="fas fa-check"></i> Approve Delivery
        </a>` : ''}
      </div>
    </div>

    <!-- Main layout -->
    <div class="ws-layout">

      <!-- Left: tabs + panels -->
      <div>
        <div class="ws-tabs" role="tablist">
          <button class="ws-tab active" data-wstab="chat" role="tab">
            <i class="fas fa-comment"></i>
            <span>Chat</span>
            <span class="ws-badge-count">${project.messages?.length || 0}</span>
          </button>
          <button class="ws-tab" data-wstab="files" role="tab">
            <i class="fas fa-folder-open"></i>
            <span>Files & Stems</span>
          </button>
          <button class="ws-tab" data-wstab="splits" role="tab">
            <i class="fas fa-chart-pie"></i>
            <span>Split Sheet</span>
          </button>
          <button class="ws-tab" data-wstab="live" role="tab">
            <i class="fas fa-video"></i>
            <span>Live Session</span>
          </button>
        </div>

        <!-- CHAT ── -->
        <div class="ws-panel active" id="wsp-chat">
          <div class="chat-area">
            <div class="chat-messages" id="chat-messages">
              ${(project.messages || []).map((msg, idx) => {
                const isMine = msg.senderId === demoUser.id;
                const sender = getUserById(msg.senderId);
                const time   = new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                return `
              <div class="chat-msg${isMine ? ' mine' : ''}">
                ${!isMine ? `<img class="chat-avt" src="${sender?.profileImage || ''}" alt="${sender?.artistName}">` : ''}
                <div>
                  <div class="chat-bubble${isMine ? ' mine' : ' them'}">${msg.content}</div>
                  <div class="chat-time" style="text-align:${isMine ? 'right' : 'left'};">${time}</div>
                </div>
                ${isMine ? `<img class="chat-avt" src="${demoUser.profileImage}" alt="${demoUser.artistName}">` : ''}
              </div>`;
              }).join('') || `
              <div style="text-align:center;padding:40px;color:var(--t3);">
                <i class="fas fa-comment" style="font-size:2rem;margin-bottom:12px;display:block;"></i>
                No messages yet. Say hello!
              </div>`}
            </div>
            <div class="chat-input-bar">
              <input class="chat-input" id="chat-input" type="text" placeholder="Type a message…" onkeydown="if(event.key==='Enter')sendChat()">
              <button class="chat-send" onclick="sendChat()" aria-label="Send">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- FILES & STEMS ── -->
        <div class="ws-panel" id="wsp-files">
          <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-xl);overflow:hidden;">
            <div style="padding:14px 16px;border-bottom:1px solid var(--c-wire);background:var(--c-raised);display:flex;align-items:center;justify-content:space-between;">
              <span style="font-family:var(--font-mono);font-size:0.6rem;color:var(--t3);letter-spacing:0.12em;text-transform:uppercase;">Files & Stems</span>
              <button class="btn btn-primary btn-sm" onclick="alert('File upload connects to Cloudflare R2 in production')">
                <i class="fas fa-upload"></i> Upload
              </button>
            </div>

            <!-- Stems section -->
            ${(project.stems && project.stems.length) ? project.stems.map(stem => {
              const uploader = getUserById(stem.uploadedBy);
              const typeColors: Record<string, string> = { vox: 'var(--channel)', beat: 'var(--patch)', instrument: 'var(--warm)', mix: 'var(--signal)', master: 'var(--s-ok)', other: 'var(--t3)' };
              return `
            <div class="file-row">
              <div class="file-icon" style="background:${typeColors[stem.trackType] || 'var(--t3)'}22;">
                <i class="fas fa-wave-square" style="color:${typeColors[stem.trackType] || 'var(--t3)'}"></i>
              </div>
              <div class="file-info">
                <div class="file-name">${stem.name}</div>
                <div class="file-meta">${stem.trackType.toUpperCase()} · ${stem.size}${stem.bpm ? ` · ${stem.bpm} BPM` : ''}${stem.key ? ` · ${stem.key}` : ''} · v${stem.version} · by ${uploader?.artistName || 'Unknown'}</div>
              </div>
              <span style="background:${stem.approved ? 'var(--s-ok-d)' : 'var(--c-raised)'};color:${stem.approved ? 'var(--s-ok)' : 'var(--t4)'};font-family:var(--font-mono);font-size:0.6rem;padding:2px 7px;border-radius:var(--r-full);flex-shrink:0;">
                ${stem.approved ? 'APPROVED' : 'PENDING'}
              </span>
              <a class="file-dl" href="${stem.url}" target="_blank">↓</a>
            </div>`;
            }).join('') : ''}

            <!-- Project files -->
            ${(project.files || []).map(file => {
              const uploader = getUserById(file.uploadedBy);
              const isAudio  = ['wav','mp3','flac','aiff'].some(e => file.name.toLowerCase().endsWith(e));
              const isZip    = file.name.toLowerCase().endsWith('.zip');
              return `
            <div class="file-row">
              <div class="file-icon" style="background:var(--c-raised);">
                <i class="fas ${isAudio ? 'fa-file-audio' : isZip ? 'fa-file-archive' : 'fa-file'}" style="color:var(--t2);"></i>
              </div>
              <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-meta">${file.size} · v${file.version} · ${uploader?.artistName || 'Unknown'} · ${new Date(file.uploadedAt).toLocaleDateString()}</div>
              </div>
              <a class="file-dl" href="${file.url}" target="_blank">↓ Download</a>
            </div>`;
            }).join('')}

            ${!project.stems?.length && !project.files?.length ? `
            <div style="text-align:center;padding:48px;color:var(--t3);">
              <i class="fas fa-folder-open" style="font-size:2rem;margin-bottom:12px;display:block;"></i>
              <p>No files yet. Upload your first stem or reference track.</p>
            </div>` : ''}
          </div>

          <!-- Lyrics doc if present -->
          ${project.lyrics ? `
          <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-xl);padding:16px;margin-top:14px;">
            <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--t3);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:12px;">Lyrics / Notes Doc</div>
            <pre style="font-family:var(--font-mono);font-size:0.8125rem;line-height:1.8;color:var(--t2);background:var(--c-raised);border-radius:var(--r-md);padding:14px;white-space:pre-wrap;overflow-x:auto;">${project.lyrics.content}</pre>
            <div style="font-size:0.75rem;color:var(--t4);margin-top:8px;">Last edited by ${getUserById(project.lyrics.lastEditedBy)?.artistName} · v${project.lyrics.version}</div>
          </div>` : ''}
        </div>

        <!-- SPLIT SHEET ── -->
        <div class="ws-panel" id="wsp-splits">
          ${splitSheet ? `
          <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-xl);overflow:hidden;">
            <div style="padding:16px 20px;border-bottom:1px solid var(--c-wire);background:var(--c-raised);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
              <div>
                <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--t3);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:4px;">Split Sheet</div>
                <div style="font-size:0.9375rem;font-weight:700;color:var(--t1);">${splitSheet.songTitle}</div>
              </div>
              <span style="background:${splitSheet.status === 'approved' ? 'var(--s-ok-d)' : 'var(--s-warn)'}22;color:${splitSheet.status === 'approved' ? 'var(--s-ok)' : 'var(--s-warn)'};font-family:var(--font-mono);font-size:0.6rem;font-weight:700;padding:4px 10px;border-radius:var(--r-full);">
                ${splitSheet.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <!-- Master ownership -->
            <div style="padding:16px 20px;">
              <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--t3);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px;">Master Ownership</div>
              <table class="split-table">
                <thead>
                  <tr>
                    <th>Collaborator</th><th>Role</th><th>PRO</th><th>Split %</th><th>Approval</th>
                  </tr>
                </thead>
                <tbody>
                  ${splitSheet.collaborators.map(c => {
                    const u = getUserById(c.userId);
                    const split = splitSheet.masterOwnership.find(o => o.userId === c.userId);
                    const approvalColor = c.approvalStatus === 'approved' ? 'var(--s-ok)' : c.approvalStatus === 'rejected' ? 'var(--channel)' : 'var(--s-warn)';
                    return `
                  <tr>
                    <td>
                      <div style="display:flex;align-items:center;gap:8px;">
                        <img src="${u?.profileImage || ''}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;" alt="${u?.artistName}">
                        <span>${u?.artistName || c.userId}</span>
                      </div>
                    </td>
                    <td style="color:var(--t2);">${c.role}</td>
                    <td style="font-family:var(--font-mono);font-size:0.75rem;color:var(--t3);">${c.proAffiliation}</td>
                    <td class="split-pct">${split?.percentage ?? 0}%</td>
                    <td>
                      <span style="background:${approvalColor}22;color:${approvalColor};font-family:var(--font-mono);font-size:0.6rem;font-weight:700;padding:2px 8px;border-radius:var(--r-full);">
                        ${c.approvalStatus.toUpperCase()}
                      </span>
                    </td>
                  </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>

            <!-- Approve button if pending -->
            ${splitSheet.status === 'pending_approval' ? `
            <div style="padding:16px 20px;border-top:1px solid var(--c-wire);">
              <button class="btn btn-primary" onclick="alert('Split sheet approval requires all collaborators. Full signing flow in production.')">
                <i class="fas fa-signature"></i> Sign & Approve Split Sheet
              </button>
            </div>` : ''}
          </div>

          ${splitSheet.notes ? `
          <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-xl);padding:16px;margin-top:14px;">
            <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--t3);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:8px;">Notes</div>
            <p style="font-size:0.875rem;color:var(--t2);line-height:1.6;">${splitSheet.notes}</p>
          </div>` : ''}
          ` : `
          <div style="text-align:center;padding:60px 32px;background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-xl);">
            <i class="fas fa-chart-pie" style="font-size:2.5rem;color:var(--t4);margin-bottom:16px;display:block;"></i>
            <div style="font-size:1rem;font-weight:700;color:var(--t1);margin-bottom:8px;">No Split Sheet Yet</div>
            <p style="color:var(--t3);font-size:0.875rem;margin-bottom:20px;">Create a split sheet to define ownership splits and get everyone to sign digitally.</p>
            <a href="/split-sheet/${project.id}" class="btn btn-primary">
              <i class="fas fa-plus"></i> Create Split Sheet
            </a>
          </div>`}
        </div>

        <!-- LIVE SESSION ── -->
        <div class="ws-panel" id="wsp-live">
          <div class="session-placeholder">
            <div style="font-size:3rem;margin-bottom:20px;">🎙️</div>
            <div style="font-family:var(--font-display);font-size:1.25rem;font-weight:800;color:var(--t1);margin-bottom:10px;">Live Session</div>
            <p style="color:var(--t2);max-width:420px;margin:0 auto 28px;line-height:1.6;">
              Real-time audio sessions with role-based access for artists, engineers, producers, and audience members.
            </p>
            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:24px;">
              ${['Host Artist', 'Guest Artist', 'Engineer', 'Audience'].map(role => `
              <span style="background:var(--c-raised);border:1px solid var(--c-rim);border-radius:var(--r-full);padding:5px 14px;font-size:0.75rem;color:var(--t2);">${role}</span>`).join('')}
            </div>
            <a href="/session/${project.id}" class="btn btn-primary btn-lg">
              <i class="fas fa-video"></i> Start Live Session
            </a>
            <div style="font-size:0.75rem;color:var(--t4);margin-top:16px;">WebRTC · In-browser · No download required</div>
          </div>
        </div>

      </div><!-- /left -->

      <!-- Right sidebar -->
      <div class="ws-sidebar">

        <!-- Collaborators -->
        <div class="ws-side-card">
          <div class="ws-side-title">Collaborators</div>
          ${[buyer, seller].filter(Boolean).map(u => `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <img src="${u!.profileImage}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:1.5px solid var(--c-rim);" alt="${u!.artistName}">
            <div style="flex:1;">
              <div style="font-size:0.875rem;font-weight:600;color:var(--t1);">${u!.artistName}</div>
              <div style="font-size:0.6875rem;color:var(--t3);">${u!.id === project.sellerId ? 'Seller' : 'Buyer'}</div>
            </div>
            <div style="width:7px;height:7px;border-radius:50%;background:${u!.availability === 'available' ? 'var(--s-ok)' : 'var(--t4)'};"></div>
          </div>`).join('')}
        </div>

        <!-- Project Timeline -->
        <div class="ws-side-card">
          <div class="ws-side-title">Project Timeline</div>
          <div class="ws-timeline">
            ${timelineStages.map((stage, i) => {
              const isActive = stage.done && !timelineStages[i + 1]?.done;
              return `
            <div class="ws-tl-item${stage.done ? ' done' : ''}${isActive ? ' active' : ''}">
              <div class="ws-tl-dot"></div>
              <div class="ws-tl-line"></div>
              <div class="ws-tl-label">${stage.label}</div>
              ${stage.done ? '<i class="fas fa-check" style="font-size:10px;color:var(--signal);margin-left:auto;"></i>' : ''}
            </div>`;
            }).join('')}
          </div>
        </div>

        <!-- Escrow status -->
        <div class="ws-side-card" style="border-top:2px solid var(--s-ok);">
          <div class="ws-side-title">Escrow Status</div>
          <div style="font-family:var(--font-display);font-size:1.375rem;font-weight:800;color:var(--t1);margin-bottom:12px;">${formatPrice(project.payoutAmount)}</div>
          <div class="escrow-bar">
            <div class="escrow-stage">
              <div class="escrow-dot" style="background:var(--s-ok);"></div>
              <span style="font-size:0.8125rem;color:var(--t1);">Payment Held in Escrow</span>
            </div>
            <div class="escrow-stage">
              <div class="escrow-dot" style="background:${['awaiting_delivery','delivered','completed'].includes(project.status) ? 'var(--s-ok)' : 'var(--t4)'};"></div>
              <span style="font-size:0.8125rem;color:var(--t2);">Awaiting Delivery</span>
            </div>
            <div class="escrow-stage">
              <div class="escrow-dot" style="background:${project.status === 'completed' ? 'var(--signal)' : 'var(--t4)'};"></div>
              <span style="font-size:0.8125rem;color:var(--t2);">Released on Approval</span>
            </div>
          </div>
          <div style="font-size:0.6875rem;color:var(--t3);margin-top:10px;text-align:center;">
            Platform fee: ${formatPrice(project.platformFee)}
          </div>
        </div>

        <!-- Quick actions -->
        <div class="ws-side-card">
          <div class="ws-side-title">Actions</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <a href="/session/${project.id}" class="btn btn-secondary btn-sm" style="justify-content:flex-start;gap:8px;">
              <i class="fas fa-video" style="width:14px;text-align:center;"></i> Start Live Session
            </a>
            ${project.status === 'delivered' ? `
            <button class="btn btn-primary btn-sm" style="justify-content:flex-start;gap:8px;" onclick="alert('Approve delivery to release payment to the artist.')">
              <i class="fas fa-check" style="width:14px;text-align:center;"></i> Approve Delivery
            </button>` : ''}
            ${!splitSheet ? `
            <a href="/split-sheet/${project.id}" class="btn btn-secondary btn-sm" style="justify-content:flex-start;gap:8px;">
              <i class="fas fa-chart-pie" style="width:14px;text-align:center;"></i> Create Split Sheet
            </a>` : ''}
            <button class="btn btn-sm" style="justify-content:flex-start;gap:8px;background:var(--channel-dim);color:var(--channel);border:1px solid var(--channel-dim);" onclick="alert('Dispute resolution connects to support team in production.')">
              <i class="fas fa-flag" style="width:14px;text-align:center;"></i> Report Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
  // Tab switching
  document.querySelectorAll('.ws-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.wstab;
      document.querySelectorAll('.ws-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.ws-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('wsp-' + tab);
      if (panel) panel.classList.add('active');
    });
  });

  // Chat send
  function sendChat() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;
    const messages = document.getElementById('chat-messages');
    const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const bubble = document.createElement('div');
    bubble.className = 'chat-msg mine';
    bubble.innerHTML = \`
      <div>
        <div class="chat-bubble mine">\${msg}</div>
        <div class="chat-time" style="text-align:right;">\${now}</div>
      </div>
      <img class="chat-avt" src="${demoUser.profileImage}" alt="${demoUser.artistName}">
    \`;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
    input.value = '';
  }
  </script>

  ${closeShell()}`);
}
