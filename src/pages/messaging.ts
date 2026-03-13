import { shell, closeShell, authedNav, appSidebar } from '../layout';
import { users, projects, getUserById } from '../data';

const demoUser = users[0];

const conversations = [
  { id:'c1', userId:'u5', lastMsg:"Got it. I checked the ref — I'm gonna make something heat. Expect the first take in 2 days.", time:'2h ago', unread:2, projectId:'p1' },
  { id:'c2', userId:'u2', lastMsg:'Delivery is up! Check the stems and let me know if you need tweaks.', time:'4h ago', unread:1, projectId:null },
  { id:'c3', userId:'u4', lastMsg:'Hey are you open to an Afrobeats collab? I have a record that would be perfect.', time:'1d ago', unread:0, projectId:null },
  { id:'c4', userId:'u6', lastMsg:"I love your sound. Would love to write a hook for your next single.", time:'2d ago', unread:0, projectId:null },
  { id:'c5', userId:'u3', lastMsg:'The beat is mixed and ready. Let me know if you want any changes.', time:'3d ago', unread:0, projectId:'p3' },
];

export function messagesPage(): string {
  const activeUser = getUserById('u5')!;

  const mockChat = [
    { from:'them', text:"Hey XAVI! Just listened to the reference track — this is exactly my lane.", time:'10:22 AM' },
    { from:'me',   text:"Glad you vibed with it. I want something raw but polished. Think late-night energy.", time:'10:25 AM' },
    { from:'them', text:"I got you. Hook-focused verse, melodic bridge, or straight bars?", time:'10:26 AM' },
    { from:'me',   text:"Mix both — bars in the verse, something melodic in the bridge. Let your instincts lead.", time:'10:31 AM' },
    { from:'them', text:"Perfect. I checked the ref — I'm gonna make something heat. Expect the first take in 2 days.", time:'10:33 AM' },
  ];

  return shell('Messages', `
  .msg-layout { display: grid; grid-template-columns: 290px 1fr; height: calc(100vh - 56px); overflow: hidden; }

  /* Conversation list */
  .conv-list { background: var(--c-base); border-right: 1px solid var(--c-wire); display: flex; flex-direction: column; overflow: hidden; }
  .conv-head { padding: 16px; border-bottom: 1px solid var(--c-wire); }
  .conv-item {
    display: flex; align-items: flex-start; gap: 11px;
    padding: 13px 14px; cursor: pointer;
    border-left: 2px solid transparent;
    border-bottom: 1px solid var(--c-wire);
    transition: background var(--t-fast);
  }
  .conv-item:hover { background: var(--c-ghost); }
  .conv-item.on { background: var(--signal-dim); border-left-color: var(--signal); }

  /* Chat area */
  .chat-area { display: flex; flex-direction: column; background: var(--c-void); overflow: hidden; }
  .chat-head {
    background: var(--c-panel);
    border-bottom: 1px solid var(--c-wire);
    padding: 14px 20px;
    display: flex; align-items: center; gap: 12px;
    flex-shrink: 0;
  }
  .chat-messages {
    flex: 1; overflow-y: auto; padding: 24px;
    display: flex; flex-direction: column; gap: 14px;
  }
  .msg-row { display: flex; flex-direction: column; }
  .msg-row.sent { align-items: flex-end; }
  .msg-row.recv { align-items: flex-start; }
  .bubble {
    padding: 10px 14px;
    font-size: 0.875rem;
    line-height: 1.55;
    max-width: 68%;
    word-break: break-word;
  }
  .bubble-sent {
    background: var(--signal);
    color: #000;
    font-weight: 500;
    border-radius: 14px 14px 3px 14px;
  }
  .bubble-recv {
    background: var(--c-panel);
    color: var(--t1);
    border: 1px solid var(--c-wire);
    border-radius: 14px 14px 14px 3px;
  }
  .msg-time { font-family: var(--font-mono); font-size: 0.6rem; color: var(--t4); margin-top: 4px; }

  /* Compose input */
  .chat-compose {
    background: var(--c-panel);
    border-top: 1px solid var(--c-wire);
    padding: 12px 16px;
    flex-shrink: 0;
  }
  .compose-row { display: flex; align-items: flex-end; gap: 8px; }
  .compose-box {
    flex: 1;
    background: var(--c-raised);
    border: 1px solid var(--c-rim);
    border-radius: var(--r-lg);
    padding: 10px 14px;
    min-height: 42px;
    max-height: 120px;
    overflow-y: auto;
    font-size: 0.875rem;
    color: var(--t1);
    outline: none;
    font-family: var(--font-body);
    transition: border-color var(--t-fast), box-shadow var(--t-fast);
    resize: none;
  }
  .compose-box:focus { border-color: var(--signal); box-shadow: 0 0 0 3px var(--signal-dim); }
  .compose-box::placeholder { color: var(--t4); }

  /* Unread indicator */
  .unread-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--signal);
    flex-shrink: 0;
    margin-top: 4px;
    box-shadow: 0 0 6px var(--signal-glow);
  }

  @media (max-width: 900px) {
    .msg-layout { grid-template-columns: 1fr; height: auto; min-height: calc(100vh - 56px); }
    .conv-list { display: flex; border-right: none; border-bottom: 1px solid var(--c-wire); height: auto; max-height: 280px; }
    .chat-area { height: calc(100vh - 56px - 280px); min-height: 420px; }
    .bubble { max-width: 85%; }
    .chat-messages { padding: 16px; }
    .compose-row .btn-ghost { display: none; }
  }
  @media (max-width: 600px) {
    .conv-list { max-height: 240px; }
    .chat-area { min-height: 380px; }
    .chat-head { padding: 10px 14px; }
    .chat-compose { padding: 10px 12px; }
    .compose-row .btn-ghost.mob-hide { display: none; }
  }
`) + authedNav('messages') + `

<div class="app-shell">
  ${appSidebar('messages')}
  <main class="app-main" style="padding:0;overflow:hidden;">
    <div class="msg-layout">

      <!-- ─ Conversation list ─ -->
      <div class="conv-list">
        <div class="conv-head">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="height:1px;width:16px;background:var(--signal);box-shadow:0 0 4px var(--signal-glow);"></div>
              <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--signal);">Messages</span>
            </div>
            <span class="badge badge-signal">${conversations.filter(c => c.unread > 0).length}</span>
          </div>
          <div style="position:relative;">
            <i class="fas fa-search" style="position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--t4);font-size:11px;pointer-events:none;"></i>
            <input type="text" style="width:100%;background:var(--c-raised);border:1px solid var(--c-rim);border-radius:var(--r);padding:8px 12px 8px 32px;color:var(--t1);font-size:0.8125rem;font-family:var(--font-body);outline:none;" placeholder="Search conversations…">
          </div>
        </div>
        <div style="overflow-y:auto;flex:1;scrollbar-width:none;">
          ${conversations.map(conv => {
            const u = getUserById(conv.userId)!;
            const isActive = conv.userId === 'u5';
            return `
          <div class="conv-item ${isActive ? 'on' : ''}">
            <div style="position:relative;flex-shrink:0;">
              <img src="${u.profileImage}" class="av av-sm" style="border:1.5px solid var(--c-rim);" alt="${u.artistName}">
              <div style="position:absolute;bottom:0;right:0;width:9px;height:9px;border-radius:50%;background:var(--s-ok);border:2px solid var(--c-base);"></div>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px;">
                <span style="font-size:0.8125rem;font-weight:${conv.unread > 0 ? '700' : '600'};">${u.artistName}</span>
                <span class="mono-sm" style="color:var(--t4);">${conv.time}</span>
              </div>
              <div style="font-size:0.75rem;color:var(--t3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${conv.lastMsg}</div>
              ${conv.projectId ? `<div style="margin-top:4px;"><span style="font-family:var(--font-mono);font-size:0.6rem;color:var(--signal);"><i class="fas fa-layer-group" style="margin-right:3px;font-size:8px;"></i>PROJECT</span></div>` : ''}
            </div>
            ${conv.unread > 0 ? '<div class="unread-dot"></div>' : ''}
          </div>`;}).join('')}
        </div>
      </div>

      <!-- ─ Chat area ─ -->
      <div class="chat-area">

        <!-- Chat header -->
        <div class="chat-head">
          <div style="position:relative;flex-shrink:0;">
            <img src="${activeUser.profileImage}" class="av av-md" style="border:1.5px solid var(--c-rim);" alt="${activeUser.artistName}">
            <div style="position:absolute;bottom:0;right:0;width:10px;height:10px;border-radius:50%;background:var(--s-ok);border:2px solid var(--c-panel);"></div>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;">${activeUser.artistName}</div>
            <div class="mono-sm" style="color:var(--s-ok);">● Online now · @${activeUser.username}</div>
          </div>
          <a href="/workspace/p1" class="btn btn-secondary btn-xs">
            <i class="fas fa-layer-group" style="font-size:10px;"></i>
            Workspace
          </a>
        </div>

        <!-- Project context bar -->
        <div style="padding:10px 20px;background:var(--c-base);border-bottom:1px solid var(--c-wire);display:flex;align-items:center;gap:10px;">
          <div class="node node-signal" style="animation:pulse 2s infinite;"></div>
          <span style="font-family:var(--font-mono);font-size:0.65rem;color:var(--t4);">PROJECT: Hook Feature · Standard Package · In Progress</span>
          <a href="/workspace/p1" style="margin-left:auto;font-family:var(--font-mono);font-size:0.65rem;color:var(--signal);font-weight:600;padding:6px 10px;min-height:36px;display:inline-flex;align-items:center;gap:4px;border-radius:var(--r-sm);">View <i class="fas fa-arrow-right" style="font-size:9px;"></i></a>
        </div>

        <!-- Messages -->
        <div class="chat-messages" id="chat-msgs">
          <!-- Date separator -->
          <div style="display:flex;align-items:center;gap:10px;padding:8px 0;">
            <div style="flex:1;height:1px;background:var(--c-wire);"></div>
            <span class="mono-sm" style="color:var(--t4);">Today</span>
            <div style="flex:1;height:1px;background:var(--c-wire);"></div>
          </div>

          ${mockChat.map(msg => `
          <div class="msg-row ${msg.from === 'me' ? 'sent' : 'recv'}">
            ${msg.from !== 'me' ? `
            <div style="display:flex;align-items:flex-end;gap:8px;margin-bottom:4px;">
              <img src="${activeUser.profileImage}" class="av av-xs" style="border:1px solid var(--c-rim);" alt="${activeUser.artistName}">
            </div>` : ''}
            <div class="bubble ${msg.from === 'me' ? 'bubble-sent' : 'bubble-recv'}">${msg.text}</div>
            <div class="msg-time">${msg.time}</div>
          </div>`).join('')}

          <!-- Typing indicator -->
          <div class="msg-row recv">
            <div style="display:flex;align-items:flex-end;gap:8px;">
              <img src="${activeUser.profileImage}" class="av av-xs" style="border:1px solid var(--c-rim);" alt="">
              <div class="bubble bubble-recv" style="display:flex;gap:4px;align-items:center;padding:12px 14px;">
                <div style="width:6px;height:6px;border-radius:50%;background:var(--t4);animation:pulse 1.2s infinite;"></div>
                <div style="width:6px;height:6px;border-radius:50%;background:var(--t4);animation:pulse 1.2s 0.2s infinite;"></div>
                <div style="width:6px;height:6px;border-radius:50%;background:var(--t4);animation:pulse 1.2s 0.4s infinite;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Compose -->
        <div class="chat-compose">
          <div class="compose-row">
            <button class="btn btn-ghost btn-sm" style="padding:8px;color:var(--t4);" title="Attach file">
              <i class="fas fa-paperclip"></i>
            </button>
            <textarea class="compose-box" rows="1" placeholder="Type a message…" id="compose-input" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMsg();}"></textarea>
            <button class="btn btn-primary btn-sm" style="padding:9px 14px;" onclick="sendMsg()">
              <i class="fas fa-paper-plane" style="font-size:13px;"></i>
            </button>
          </div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap;">
            ${['Sounds good 👍','When can you start?','Sending the reference now','Let me know if you need changes'].map(q => `<button onclick="document.getElementById('compose-input').value='${q}';" style="padding:9px 14px;border-radius:var(--r-full);font-size:0.8125rem;background:var(--c-raised);border:1px solid var(--c-wire);color:var(--t3);cursor:pointer;transition:all 0.12s;font-family:var(--font-body);min-height:40px;line-height:1.2;" onmouseover="this.style.color='var(--signal)';this.style.borderColor='rgba(200,255,0,0.25)'" onmouseout="this.style.color='var(--t3)';this.style.borderColor='var(--c-wire)'">${q}</button>`).join('')}
          </div>
        </div>

      </div>

    </div>
  </main>
</div>

<script>
function sendMsg() {
  const input = document.getElementById('compose-input');
  const text = input.value.trim();
  if (!text) return;
  const msgs = document.getElementById('chat-msgs');
  const row = document.createElement('div');
  row.className = 'msg-row sent';
  row.innerHTML = \`<div class="bubble bubble-sent">\${text}</div><div class="msg-time">just now</div>\`;
  msgs.appendChild(row);
  input.value = '';
  msgs.scrollTop = msgs.scrollHeight;
}
</script>
${closeShell()}`;
}
