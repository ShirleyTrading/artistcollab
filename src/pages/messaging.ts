import { shell, closeShell, authedNav, appSidebar } from '../layout';
import { users, projects, listings, getUserById, formatPrice, statusColor, statusLabel } from '../data';

const demoUser = users[0];

// ─── Conversations mock data ──────────────────────────────────────────────────
const conversations = [
  { id: 'c1', userId: 'u5', lastMsg: "Got it. I checked the ref — I'm gonna make something heat. Expect the first take in 2 days.", time: '2h ago', unread: 2, projectId: 'p1' },
  { id: 'c2', userId: 'u2', lastMsg: 'Delivery is up! Check the stems and let me know if you need tweaks.', time: '4h ago', unread: 1, projectId: null },
  { id: 'c3', userId: 'u4', lastMsg: 'Hey are you open to an Afrobeats collab? I have a record that would be perfect.', time: '1d ago', unread: 0, projectId: null },
  { id: 'c4', userId: 'u6', lastMsg: "I love your sound. Would love to write a hook for your next single.", time: '2d ago', unread: 0, projectId: null },
  { id: 'c5', userId: 'u3', lastMsg: 'The beat is mixed and ready. Let me know if you want any changes.', time: '3d ago', unread: 0, projectId: 'p3' },
];

// ─── Messages Page ────────────────────────────────────────────────────────────
export function messagesPage(): string {
  const activeConvUserId = 'u5';
  const activeUser = getUserById(activeConvUserId)!;
  const activeProjMessages = projects.find(p => p.id === 'p1')?.messages ?? [];

  const mockChat = [
    { from: 'them', text: "Hey XAVI! Just listened to the reference track — this is exactly my lane.", time: '10:22 AM' },
    { from: 'me', text: "Glad you vibed with it. I want something raw but polished. Think late-night energy.", time: '10:25 AM' },
    { from: 'them', text: "I got you. Hook-focused verse, melodic bridge, or straight bars?", time: '10:26 AM' },
    { from: 'me', text: "Mix both — bars in the verse, something melodic in the bridge. Let your instincts lead.", time: '10:31 AM' },
    { from: 'them', text: "Perfect. I checked the ref — I'm gonna make something heat. Expect the first take in 2 days.", time: '10:33 AM' },
  ];

  return shell('Messages', `
    .msg-page { display: grid; grid-template-columns: 300px 1fr; height: calc(100vh - 64px); overflow: hidden; }
    .conv-list { background: var(--ink); border-right: 1px solid var(--hairline); display: flex; flex-direction: column; }
    .conv-item {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 14px 16px; cursor: pointer; transition: background 0.12s;
      border-left: 2px solid transparent;
    }
    .conv-item:hover { background: rgba(255,255,255,0.025); }
    .conv-item.active { background: rgba(139,92,246,0.08); border-left-color: var(--uv); }
    .conv-item-border { border-bottom: 1px solid rgba(255,255,255,0.04); }
    .chat-area { display: flex; flex-direction: column; background: var(--void); }
    .chat-header { background: var(--surface); border-bottom: 1px solid var(--hairline); padding: 14px 24px; display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
    .chat-messages { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
    .msg-row { display: flex; flex-direction: column; }
    .msg-row.sent { align-items: flex-end; }
    .msg-row.recv { align-items: flex-start; }
    .bubble { padding: 11px 15px; font-size: 0.875rem; line-height: 1.5; max-width: 70%; word-break: break-word; }
    .bubble-sent { background: var(--uv); color: white; border-radius: 16px 16px 4px 16px; }
    .bubble-recv { background: var(--elevated); color: var(--t1); border-radius: 16px 16px 16px 4px; border: 1px solid var(--hairline); }
    .chat-input { background: var(--surface); border-top: 1px solid var(--hairline); padding: 14px 20px; flex-shrink: 0; }
    .input-row { display: flex; align-items: flex-end; gap: 8px; }
    .compose-box {
      flex: 1; background: var(--elevated); border: 1px solid var(--hairline); border-radius: 14px;
      padding: 10px 14px; min-height: 44px; max-height: 140px; overflow-y: auto;
      font-size: 0.875rem; color: var(--t1); outline: none; font-family: inherit; transition: border-color 0.18s;
    }
    .compose-box:focus { border-color: var(--uv); box-shadow: 0 0 0 3px rgba(139,92,246,0.1); }
    .unread-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--uv); flex-shrink: 0; margin-top: 6px; }
    @media (max-width: 900px) {
      .msg-page { grid-template-columns: 1fr; }
      .conv-list { display: none; }
    }
  `) + authedNav('messages') + `
<div class="app-shell">
  ${appSidebar('messages')}
  <main class="app-main" style="padding:0;">
    <div class="msg-page">

      <!-- Conversation List -->
      <div class="conv-list">
        <div style="padding:16px;border-bottom:1px solid var(--hairline);">
          <h2 style="font-size:1rem;font-weight:700;letter-spacing:-0.01em;margin-bottom:12px;">Messages</h2>
          <div style="position:relative;">
            <i class="fas fa-search" style="position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--t4);font-size:11px;pointer-events:none;"></i>
            <input class="field-input" placeholder="Search…" style="padding-left:32px;font-size:0.8125rem;padding-top:8px;padding-bottom:8px;">
          </div>
        </div>

        <div style="overflow-y:auto;flex:1;">
          ${conversations.map((conv, i) => {
            const user = getUserById(conv.userId)!;
            const isActive = conv.userId === activeConvUserId;
            return `
          <div class="conv-item conv-item-border ${isActive ? 'active' : ''}" onclick="selectConv('${conv.userId}')">
            <div style="position:relative;flex-shrink:0;">
              <img src="${user.profileImage}" class="av av-sm" style="border:1.5px solid rgba(255,255,255,0.06);" alt="${user.artistName}">
              <div class="status-dot status-online" style="position:absolute;bottom:-1px;right:-1px;width:9px;height:9px;border:2px solid var(--ink);"></div>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px;">
                <span style="font-weight:${conv.unread > 0 ? '700' : '600'};font-size:0.875rem;">${user.artistName}</span>
                <span style="font-size:0.69rem;color:var(--t4);">${conv.time}</span>
              </div>
              <div style="font-size:0.78rem;color:var(--t3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:${conv.unread > 0 ? '500' : '400'};">${conv.lastMsg}</div>
              ${conv.projectId ? `<div style="margin-top:4px;"><span style="font-size:0.69rem;color:var(--uv-bright);"><i class="fas fa-layer-group" style="margin-right:3px;font-size:9px;"></i>Project</span></div>` : ''}
            </div>
            ${conv.unread > 0 ? `<div class="unread-dot"></div>` : ''}
          </div>`;
          }).join('')}
        </div>

        <div style="padding:12px;border-top:1px solid var(--hairline);">
          <button class="btn btn-primary w-full btn-sm" style="justify-content:center;" onclick="alert('Browse artists to start a conversation')">
            <i class="fas fa-pen"></i> New Message
          </button>
        </div>
      </div>

      <!-- Chat Area -->
      <div class="chat-area">
        <!-- Chat Header -->
        <div class="chat-header">
          <img src="${activeUser.profileImage}" class="av av-md" style="border:2px solid rgba(139,92,246,0.35);" alt="${activeUser.artistName}">
          <div style="flex:1;">
            <div style="font-weight:700;font-size:1rem;letter-spacing:-0.01em;">${activeUser.artistName}</div>
            <div style="font-size:0.75rem;display:flex;align-items:center;gap:6px;">
              <div class="status-dot status-online"></div>
              <span style="color:var(--ok);">Online now</span>
              <span style="color:var(--t4);margin:0 4px;">·</span>
              <span style="color:var(--t3);">${activeUser.genre?.[0] ?? 'Artist'} · ${activeUser.location}</span>
            </div>
          </div>
          <div style="display:flex;gap:8px;">
            <a href="/artist/${activeUser.id}" class="btn btn-secondary btn-sm">View Profile</a>
            <a href="/workspace/p1" class="btn btn-primary btn-sm"><i class="fas fa-layer-group"></i> Workspace</a>
            <button class="btn btn-ghost btn-sm" title="More options"><i class="fas fa-ellipsis-h"></i></button>
          </div>
        </div>

        <!-- Project link bar -->
        <div style="background:rgba(139,92,246,0.08);border-bottom:1px solid rgba(139,92,246,0.15);padding:10px 24px;display:flex;align-items:center;gap:12px;">
          <i class="fas fa-layer-group" style="color:var(--uv-bright);font-size:12px;"></i>
          <span style="font-size:0.8125rem;color:var(--t2);">Connected to <strong>Record #4 — Feature Verse</strong></span>
          <a href="/workspace/p1" class="btn btn-secondary btn-xs" style="margin-left:auto;">Open Workspace <i class="fas fa-arrow-right" style="font-size:10px;"></i></a>
        </div>

        <!-- Messages -->
        <div class="chat-messages" id="chat-scroll">
          <div style="text-align:center;margin:0 auto 8px;">
            <span style="font-size:0.75rem;color:var(--t4);background:rgba(255,255,255,0.04);padding:4px 14px;border-radius:var(--r-full);">Today</span>
          </div>

          ${mockChat.map(msg => `
          <div class="msg-row ${msg.from === 'me' ? 'sent' : 'recv'}">
            ${msg.from !== 'me' ? `
            <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px;">
              <img src="${activeUser.profileImage}" class="av av-xs" alt="${activeUser.artistName}">
              <span style="font-size:0.75rem;font-weight:700;color:var(--t3);">${activeUser.artistName}</span>
              <span style="font-size:0.69rem;color:var(--t4);">${msg.time}</span>
            </div>` : `<span style="font-size:0.69rem;color:var(--t4);margin-bottom:5px;">${msg.time}</span>`}
            <div class="bubble bubble-${msg.from === 'me' ? 'sent' : 'recv'}">${msg.text}</div>
          </div>`).join('')}

          <!-- Typing indicator -->
          <div class="msg-row recv">
            <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px;">
              <img src="${activeUser.profileImage}" class="av av-xs" alt="${activeUser.artistName}">
              <span style="font-size:0.75rem;font-weight:700;color:var(--t3);">${activeUser.artistName}</span>
            </div>
            <div class="bubble bubble-recv" style="display:flex;align-items:center;gap:4px;padding:12px 16px;">
              <span style="width:6px;height:6px;border-radius:50%;background:var(--t3);animation:typing 1.2s infinite;"></span>
              <span style="width:6px;height:6px;border-radius:50%;background:var(--t3);animation:typing 1.2s 0.2s infinite;"></span>
              <span style="width:6px;height:6px;border-radius:50%;background:var(--t3);animation:typing 1.2s 0.4s infinite;"></span>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="chat-input">
          <!-- Attachment preview area -->
          <div style="margin-bottom:10px;display:none;" id="attach-preview"></div>
          <div class="input-row">
            <button class="btn btn-secondary btn-sm" style="flex-shrink:0;" title="Attach file" onclick="document.getElementById('chat-file').click()">
              <i class="fas fa-paperclip"></i>
            </button>
            <input type="file" id="chat-file" style="display:none;" multiple>
            <div class="compose-box" contenteditable="true" data-placeholder="Write a message…" id="compose" onkeydown="handleKey(event)"></div>
            <button class="btn btn-primary btn-sm" style="flex-shrink:0;" onclick="sendMsg()">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
          <div style="font-size:0.69rem;color:var(--t4);margin-top:8px;display:flex;align-items:center;gap:6px;">
            <i class="fas fa-lock" style="font-size:9px;"></i>
            Encrypted · Files are private to this conversation
          </div>
        </div>
      </div>

    </div>
  </main>
</div>

<style>
@keyframes typing { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-4px)} }
.compose-box:empty::before { content: attr(data-placeholder); color: var(--t4); pointer-events: none; }
</style>
<script>
function sendMsg() {
  const el = document.getElementById('compose');
  const text = el.innerText.trim();
  if (!text) return;
  const scroll = document.getElementById('chat-scroll');
  const now = new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});
  const row = document.createElement('div');
  row.className = 'msg-row sent';
  row.innerHTML = '<span style="font-size:0.69rem;color:var(--t4);margin-bottom:5px;">'+now+'</span><div class="bubble bubble-sent">'+text+'</div>';
  scroll.appendChild(row);
  scroll.scrollTop = scroll.scrollHeight;
  el.innerText = '';
}
function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
}
</script>
` + closeShell();
}

// ─── Earnings Page ────────────────────────────────────────────────────────────
export function earningsPage(): string {
  const monthlyData = [
    { month: 'Oct', amount: 320, orders: 2 },
    { month: 'Nov', amount: 580, orders: 4 },
    { month: 'Dec', amount: 860, orders: 6 },
    { month: 'Jan', amount: 1120, orders: 7 },
    { month: 'Feb', amount: 940, orders: 5 },
    { month: 'Mar', amount: 1540, orders: 9 },
  ];
  const total = monthlyData.reduce((s, m) => s + m.amount, 0);
  const maxAmount = Math.max(...monthlyData.map(m => m.amount));

  const payouts = [
    { date: 'Mar 12, 2026', amount: 480, project: 'Record #4 — Feature Verse', status: 'released' },
    { date: 'Mar 01, 2026', amount: 360, project: 'Trap Record Mix & Master', status: 'released' },
    { date: 'Feb 20, 2026', amount: 700, project: 'Hook Writing — Album Cut', status: 'released' },
    { date: 'Feb 08, 2026', amount: 240, project: 'Guest Verse — SoundCloud Single', status: 'released' },
    { date: 'Jan 28, 2026', amount: 560, project: 'Full Track Collab', status: 'released' },
    { date: 'Jan 14, 2026', amount: 320, project: 'Studio Session', status: 'released' },
  ];

  return shell('Earnings', `
    .dash-page { padding: 32px 40px; max-width: 1100px; }
    .earn-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-bottom: 36px; }
    .earn-card {
      background: var(--surface); border: 1px solid var(--hairline); border-radius: var(--r-lg);
      padding: 24px; position: relative; overflow: hidden;
    }
    .earn-card::after { content:''; position:absolute; top:0;left:0;right:0;height:2px; }
    .earn-card.gr-uv::after { background: linear-gradient(90deg,var(--uv),var(--uv-bright)); }
    .earn-card.gr-ok::after { background: linear-gradient(90deg,var(--ok),#34d399); }
    .earn-card.gr-em::after { background: linear-gradient(90deg,var(--ember),#fcd34d); }
    .chart-bar {
      flex: 1; background: rgba(139,92,246,0.15); border-radius: 4px 4px 0 0;
      display: flex; align-items: flex-end; justify-content: center;
      cursor: pointer; transition: background 0.15s; position: relative;
    }
    .chart-bar:hover { background: rgba(139,92,246,0.35); }
    .payout-row { display: grid; grid-template-columns: 140px 1fr 120px 100px; align-items: center; gap: 16px; padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.12s; }
    .payout-row:hover { background: rgba(255,255,255,0.02); }
    @media (max-width: 900px) { .dash-page { padding: 24px 16px; } .earn-grid { grid-template-columns: 1fr; } .payout-row { grid-template-columns: 1fr; } }
  `) + authedNav('earnings') + `
<div class="app-shell">
  ${appSidebar('earnings')}
  <main class="app-main">
    <div class="dash-page">

      <!-- Header -->
      <div style="margin-bottom:28px;display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:16px;">
        <div>
          <div class="label" style="margin-bottom:6px;color:var(--ok);">Studio Financials</div>
          <h1 style="font-size:clamp(1.4rem,2.5vw,1.875rem);letter-spacing:-0.025em;">Earnings & Payouts</h1>
          <p class="body-base" style="margin-top:6px;">Track your income from collaborations and features.</p>
        </div>
        <button class="btn btn-primary" onclick="alert('Withdrawal initiated — funds arrive in 1-3 business days')">
          <i class="fas fa-arrow-down-to-line"></i> Withdraw Funds
        </button>
      </div>

      <!-- Stats -->
      <div class="earn-grid">
        <div class="earn-card gr-uv">
          <div style="font-size:0.75rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--t4);margin-bottom:10px;">Total Earned</div>
          <div style="font-size:2.25rem;font-weight:800;letter-spacing:-0.04em;color:var(--uv-bright);">${formatPrice(total)}</div>
          <div style="font-size:0.78rem;color:var(--t3);margin-top:6px;display:flex;align-items:center;gap:4px;">
            <i class="fas fa-arrow-up" style="color:var(--ok);font-size:10px;"></i> 28% vs last period
          </div>
        </div>
        <div class="earn-card gr-ok">
          <div style="font-size:0.75rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--t4);margin-bottom:10px;">This Month</div>
          <div style="font-size:2.25rem;font-weight:800;letter-spacing:-0.04em;color:var(--ok);">${formatPrice(1540)}</div>
          <div style="font-size:0.78rem;color:var(--t3);margin-top:6px;display:flex;align-items:center;gap:4px;">
            <i class="fas fa-arrow-up" style="color:var(--ok);font-size:10px;"></i> 64% vs last month
          </div>
        </div>
        <div class="earn-card gr-em">
          <div style="font-size:0.75rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--t4);margin-bottom:10px;">Pending Payout</div>
          <div style="font-size:2.25rem;font-weight:800;letter-spacing:-0.04em;color:var(--ember);">${formatPrice(480)}</div>
          <div style="font-size:0.78rem;color:var(--t3);margin-top:6px;display:flex;align-items:center;gap:4px;">
            <i class="fas fa-clock" style="font-size:10px;color:var(--ember);"></i> Awaiting delivery approval
          </div>
        </div>
      </div>

      <!-- Bar Chart -->
      <div style="background:var(--surface);border:1px solid var(--hairline);border-radius:var(--r-lg);padding:28px;margin-bottom:28px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
          <h2 style="font-size:1.0625rem;letter-spacing:-0.01em;">Monthly Revenue</h2>
          <div style="display:flex;gap:4px;background:var(--raised);border-radius:var(--r-sm);padding:3px;border:1px solid var(--hairline);">
            <button class="btn btn-secondary btn-xs" style="background:var(--elevated);">6M</button>
            <button class="btn btn-ghost btn-xs">1Y</button>
            <button class="btn btn-ghost btn-xs">All</button>
          </div>
        </div>
        <div style="display:flex;align-items:flex-end;gap:10px;height:160px;padding-bottom:0;">
          ${monthlyData.map(m => {
            const pct = Math.round((m.amount / maxAmount) * 100);
            const isLast = m === monthlyData[monthlyData.length-1];
            return `
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%;">
            <div style="font-size:0.69rem;font-weight:700;color:${isLast?'var(--uv-bright)':'var(--t4)'};">${formatPrice(m.amount)}</div>
            <div style="flex:1;width:100%;display:flex;align-items:flex-end;">
              <div class="chart-bar" style="width:100%;height:${pct}%;background:${isLast?'rgba(139,92,246,0.4)':'rgba(139,92,246,0.15)'};${isLast?'box-shadow:0 0 12px rgba(139,92,246,0.3);':''}">
                ${isLast ? `<div style="position:absolute;top:-24px;background:var(--uv);color:white;font-size:0.69rem;font-weight:700;padding:3px 7px;border-radius:4px;white-space:nowrap;">Best Month</div>` : ''}
              </div>
            </div>
            <div style="font-size:0.75rem;color:var(--t3);font-weight:600;">${m.month}</div>
          </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Payout History -->
      <div style="background:var(--surface);border:1px solid var(--hairline);border-radius:var(--r-lg);overflow:hidden;">
        <div style="padding:18px 20px;border-bottom:1px solid var(--hairline);display:flex;align-items:center;justify-content:space-between;">
          <h2 style="font-size:1.0625rem;letter-spacing:-0.01em;">Payout History</h2>
          <button class="btn btn-secondary btn-sm"><i class="fas fa-download"></i> Export CSV</button>
        </div>
        <div style="padding:10px 20px;border-bottom:1px solid var(--hairline);display:grid;grid-template-columns:140px 1fr 120px 100px;gap:16px;">
          <div class="label">Date</div>
          <div class="label">Project</div>
          <div class="label">Amount</div>
          <div class="label">Status</div>
        </div>
        ${payouts.map(p => `
        <div class="payout-row">
          <div style="font-size:0.8125rem;color:var(--t3);">${p.date}</div>
          <div style="font-size:0.875rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.project}</div>
          <div style="font-size:0.9375rem;font-weight:800;letter-spacing:-0.02em;">${formatPrice(p.amount)}</div>
          <div><span class="badge badge-ok"><i class="fas fa-check" style="font-size:9px;"></i> Released</span></div>
        </div>`).join('')}
      </div>

      <!-- Banking details CTA -->
      <div style="margin-top:24px;background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.2);border-radius:var(--r-lg);padding:20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
        <div style="width:44px;height:44px;background:var(--uv-dim);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i class="fas fa-university" style="color:var(--uv-bright);"></i>
        </div>
        <div style="flex:1;min-width:200px;">
          <div style="font-weight:700;margin-bottom:4px;">Add Payout Method</div>
          <div style="font-size:0.8125rem;color:var(--t3);">Connect your bank account or Stripe to receive instant payouts.</div>
        </div>
        <a href="/dashboard/settings" class="btn btn-primary btn-sm">Connect Bank <i class="fas fa-arrow-right" style="font-size:10px;"></i></a>
      </div>

    </div>
  </main>
</div>
` + closeShell();
}

// ─── Orders Page ──────────────────────────────────────────────────────────────
export function ordersPage(): string {
  const userOrders = projects.filter(p => p.buyerId === demoUser.id || p.sellerId === demoUser.id);

  return shell('Orders', `
    .dash-page { padding: 32px 40px; max-width: 1100px; }
    .order-card {
      background: var(--surface); border: 1px solid var(--hairline); border-radius: var(--r-lg);
      padding: 20px 24px; margin-bottom: 12px; display: grid;
      grid-template-columns: auto 1fr auto; gap: 16px; align-items: center;
      transition: border-color 0.18s; text-decoration: none; color: inherit;
    }
    .order-card:hover { border-color: rgba(139,92,246,0.3); }
    @media (max-width: 900px) {
      .dash-page { padding: 24px 16px; }
      .order-card { grid-template-columns: 1fr; }
    }
  `) + authedNav('orders') + `
<div class="app-shell">
  ${appSidebar('orders')}
  <main class="app-main">
    <div class="dash-page">

      <div style="margin-bottom:28px;">
        <div class="label" style="margin-bottom:6px;color:var(--ember);">Transaction History</div>
        <h1 style="font-size:clamp(1.4rem,2.5vw,1.875rem);letter-spacing:-0.025em;">Orders</h1>
        <p class="body-base" style="margin-top:6px;">${userOrders.length} total orders across all projects.</p>
      </div>

      <!-- Tabs -->
      <div style="display:flex;gap:4px;background:var(--raised);border-radius:var(--r);padding:4px;border:1px solid var(--hairline);width:fit-content;margin-bottom:24px;">
        <button class="btn btn-secondary btn-xs" style="background:var(--elevated);">All Orders</button>
        <button class="btn btn-ghost btn-xs">As Buyer</button>
        <button class="btn btn-ghost btn-xs">As Seller</button>
        <button class="btn btn-ghost btn-xs">Completed</button>
      </div>

      ${userOrders.map(order => {
        const buyer = getUserById(order.buyerId);
        const seller = getUserById(order.sellerId);
        const isSeller = order.sellerId === demoUser.id;
        const other = isSeller ? buyer : seller;
        const sC = statusColor(order.status);
        return `
      <a href="/workspace/${order.id}" class="order-card">
        <img src="${other?.profileImage}" class="av av-lg" style="border:2px solid rgba(255,255,255,0.08);" alt="${other?.artistName}">
        <div style="min-width:0;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;flex-wrap:wrap;">
            <span style="font-weight:800;font-size:1rem;letter-spacing:-0.01em;">${order.title}</span>
            <span class="badge" style="background:${sC}22;color:${sC};border-color:${sC}44;">${statusLabel(order.status)}</span>
            <span class="badge badge-muted" style="font-size:0.69rem;">${isSeller ? 'Selling' : 'Buying'}</span>
          </div>
          <div style="font-size:0.8125rem;color:var(--t3);">
            ${isSeller ? `From <strong style="color:var(--t2);">${other?.artistName}</strong>` : `To <strong style="color:var(--t2);">${other?.artistName}</strong>`}
            <span style="margin:0 6px;color:var(--rim);">·</span>
            ${order.package} Package
            <span style="margin:0 6px;color:var(--rim);">·</span>
            Due ${order.dueDate}
          </div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:8px;">
            <div style="height:3px;width:120px;background:var(--rim);border-radius:2px;overflow:hidden;">
              <div style="height:100%;width:${order.status==='completed'?100:order.status==='delivered'?85:60}%;background:linear-gradient(90deg,${sC},${sC}cc);border-radius:2px;"></div>
            </div>
            <span style="font-size:0.75rem;color:var(--t3);">${order.status==='completed'?'Complete':order.status==='delivered'?'Delivered':'In Progress'}</span>
          </div>
        </div>
        <div style="text-align:right;flex-shrink:0;">
          <div style="font-size:1.375rem;font-weight:800;letter-spacing:-0.03em;">${formatPrice(order.orderTotal)}</div>
          <div style="font-size:0.75rem;color:var(--t3);margin-top:4px;">Placed ${order.createdAt}</div>
          <div style="margin-top:10px;display:flex;gap:6px;justify-content:flex-end;">
            <span class="btn btn-secondary btn-xs">View</span>
          </div>
        </div>
      </a>`;
      }).join('')}

    </div>
  </main>
</div>
` + closeShell();
}

// ─── Listings Page ────────────────────────────────────────────────────────────
export function listingsPage(): string {
  const myListings = listings.filter(l => l.userId === demoUser.id);
  const allListings = myListings.length > 0 ? myListings : listings.slice(0, 3);

  return shell('My Listings', `
    .dash-page { padding: 32px 40px; max-width: 1100px; }
    .listing-card {
      background: var(--surface); border: 1px solid var(--hairline); border-radius: var(--r-lg);
      padding: 22px 24px; display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: start;
      margin-bottom: 12px; transition: border-color 0.18s;
    }
    .listing-card:hover { border-color: rgba(255,255,255,0.12); }
    @media (max-width: 900px) { .dash-page { padding: 24px 16px; } .listing-card { grid-template-columns: 1fr; } }
  `) + authedNav('listings') + `
<div class="app-shell">
  ${appSidebar('listings')}
  <main class="app-main">
    <div class="dash-page">

      <div style="margin-bottom:28px;display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:16px;">
        <div>
          <div class="label" style="margin-bottom:6px;color:var(--arc);">Studio Services</div>
          <h1 style="font-size:clamp(1.4rem,2.5vw,1.875rem);letter-spacing:-0.025em;">My Listings</h1>
          <p class="body-base" style="margin-top:6px;">${allListings.length} active services on your profile.</p>
        </div>
        <button class="btn btn-primary" onclick="alert('Listing editor coming soon!')">
          <i class="fas fa-plus"></i> Create Listing
        </button>
      </div>

      <!-- Profile visibility alert -->
      <div class="alert alert-info" style="margin-bottom:24px;">
        <i class="fas fa-circle-info"></i>
        <div>Your listings are <strong>visible to the public</strong>. Buyers can find them on your profile and in the Marketplace.</div>
      </div>

      ${allListings.map(listing => {
        const pkg = listing.packages[0];
        return `
      <div class="listing-card">
        <div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap;">
            <h3 style="font-size:1rem;letter-spacing:-0.01em;">${listing.title}</h3>
            <span class="badge ${listing.active ? 'badge-ok' : 'badge-muted'}">${listing.active ? 'Active' : 'Paused'}</span>
            <span class="badge badge-uv" style="font-size:0.69rem;">${listing.category}</span>
          </div>
          <p style="font-size:0.875rem;color:var(--t3);margin-bottom:12px;line-height:1.6;max-width:680px;">${listing.description.slice(0,160)}…</p>
          <div style="display:flex;gap:20px;flex-wrap:wrap;">
            <div style="font-size:0.8125rem;color:var(--t3);"><i class="fas fa-star" style="color:var(--ember);margin-right:4px;"></i>${listing.rating} rating · ${listing.orders} orders</div>
            <div style="font-size:0.8125rem;color:var(--t3);"><i class="fas fa-clock" style="margin-right:4px;"></i>${pkg.deliveryDays}d delivery</div>
            <div style="font-size:0.8125rem;color:var(--t3);"><i class="fas fa-rotate-left" style="margin-right:4px;"></i>${pkg.revisions === 999 ? 'Unlimited' : pkg.revisions} revisions</div>
          </div>
        </div>
        <div style="text-align:right;flex-shrink:0;">
          <div style="font-size:1.25rem;font-weight:800;letter-spacing:-0.03em;color:var(--uv-bright);">from ${formatPrice(listing.packages[0].price)}</div>
          <div style="font-size:0.75rem;color:var(--t4);margin-bottom:12px;">${listing.packages.length} packages</div>
          <div style="display:flex;gap:6px;justify-content:flex-end;flex-wrap:wrap;">
            <a href="/listing/${listing.id}" class="btn btn-secondary btn-xs">Preview</a>
            <button class="btn btn-secondary btn-xs"><i class="fas fa-pen"></i> Edit</button>
            <button class="btn btn-ghost btn-xs" style="color:var(--err);" onclick="confirm('Pause this listing?')"><i class="fas fa-pause"></i></button>
          </div>
        </div>
      </div>`;
      }).join('')}

      <!-- Upgrade CTA -->
      <div style="margin-top:24px;background:linear-gradient(135deg,rgba(139,92,246,0.1) 0%,rgba(245,158,11,0.05) 100%);border:1px solid rgba(139,92,246,0.2);border-radius:var(--r-lg);padding:24px;text-align:center;">
        <div style="font-size:1.125rem;font-weight:700;margin-bottom:8px;">Create up to <span style="color:var(--uv-bright);">10 listings</span> on Pro</div>
        <p style="font-size:0.875rem;color:var(--t3);margin-bottom:16px;">Free accounts include 3 listings. Upgrade to showcase your full service menu.</p>
        <button class="btn btn-primary" onclick="alert('Pro plan coming soon!')">Upgrade to Pro</button>
      </div>

    </div>
  </main>
</div>
` + closeShell();
}
