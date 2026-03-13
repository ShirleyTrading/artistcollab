import { head, authedNav, dashboardSidebar, closeHTML } from '../layout';
import { users, projects, getUserById, formatPrice, statusColor, statusLabel } from '../data';

const demoUser = users[0];

// All conversations (mock)
const conversations = [
  { id: 'c1', userId: 'u5', lastMsg: 'Got it. I checked the ref — I\'m gonna make something heat. Expect the first take in 2 days.', time: '2h ago', unread: 2, projectId: 'p1' },
  { id: 'c2', userId: 'u2', lastMsg: 'Delivery is up! Check the stems and let me know if you need tweaks.', time: '4h ago', unread: 1, projectId: null },
  { id: 'c3', userId: 'u4', lastMsg: 'Hey are you open to an Afrobeats collab? I have a record that would be perfect.', time: '1d ago', unread: 0, projectId: null },
  { id: 'c4', userId: 'u6', lastMsg: 'I love your sound. Would love to write a hook for your next single.', time: '2d ago', unread: 0, projectId: null },
  { id: 'c5', userId: 'u3', lastMsg: 'The beat is mixed and ready. Let me know if you want any changes.', time: '3d ago', unread: 0, projectId: 'p3' },
];

export function messagesPage(): string {
  const activeConvUserId = 'u5';
  const activeUser = getUserById(activeConvUserId)!;
  const activeProjMessages = projects.find(p => p.id === 'p1')?.messages ?? [];

  return head('Messages') + authedNav('messages', { name: demoUser.artistName, image: demoUser.profileImage, notifications: 3 }) + `
<div class="app-layout">
  ${dashboardSidebar('messages')}
  <main class="main-content" style="padding:0;">
    <div style="display:grid;grid-template-columns:320px 1fr;height:calc(100vh - 68px);">
      
      <!-- Conversation List -->
      <div style="background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;">
        <div style="padding:20px;border-bottom:1px solid var(--border);">
          <h2 style="font-size:18px;margin-bottom:14px;">Messages</h2>
          <div style="position:relative;">
            <i class="fas fa-search" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text2);font-size:13px;"></i>
            <input class="form-input" placeholder="Search conversations..." style="padding-left:36px;font-size:13px;padding-top:9px;padding-bottom:9px;">
          </div>
        </div>
        <div style="overflow-y:auto;flex:1;">
          ${conversations.map((conv, i) => {
            const user = getUserById(conv.userId)!;
            const isActive = conv.userId === activeConvUserId;
            return `
            <div onclick="selectConversation('${conv.userId}')" style="display:flex;gap:12px;padding:16px 20px;cursor:pointer;border-left:3px solid ${isActive ? 'var(--accent)' : 'transparent'};background:${isActive ? 'rgba(124,58,237,0.08)' : 'transparent'};border-bottom:1px solid rgba(255,255,255,0.04);transition:background 0.15s;" onmouseover="if(!'${isActive}')this.style.background='rgba(255,255,255,0.02)'" onmouseout="if(!'${isActive}')this.style.background='${isActive ? 'rgba(124,58,237,0.08)' : 'transparent'}'">
              <div style="position:relative;flex-shrink:0;">
                <img src="${user.profileImage}" class="avatar" style="width:44px;height:44px;" alt="${user.artistName}">
                ${conv.unread > 0 ? `<div class="notif-badge" style="position:absolute;top:-4px;right:-4px;font-size:10px;min-width:16px;height:16px;padding:0 4px;line-height:16px;">${conv.unread}</div>` : ''}
              </div>
              <div style="flex:1;min-width:0;">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                  <span style="font-weight:${conv.unread > 0 ? '700' : '600'};font-size:14px;">${user.artistName}</span>
                  <span style="font-size:11px;color:var(--text2);">${conv.time}</span>
                </div>
                <div style="font-size:13px;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:${conv.unread > 0 ? '500' : '400'};">${conv.lastMsg}</div>
                ${conv.projectId ? `<span style="font-size:11px;color:var(--accent3);margin-top:4px;display:inline-block;"><i class="fas fa-layer-group" style="margin-right:3px;"></i>Project Collab</span>` : ''}
              </div>
            </div>`;
          }).join('')}
        </div>
        <div style="padding:16px;border-top:1px solid var(--border);">
          <button class="btn btn-primary w-full" style="justify-content:center;" onclick="alert('Browse artists to start a new conversation')">
            <i class="fas fa-plus"></i> New Message
          </button>
        </div>
      </div>
      
      <!-- Chat Area -->
      <div style="display:flex;flex-direction:column;">
        <!-- Chat Header -->
        <div style="padding:16px 24px;background:var(--bg2);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:12px;">
            <img src="${activeUser.profileImage}" class="avatar" style="width:44px;height:44px;" alt="${activeUser.artistName}">
            <div>
              <div style="font-weight:700;font-size:16px;">${activeUser.artistName}</div>
              <div style="font-size:12px;color:var(--green);display:flex;align-items:center;gap:6px;">
                <div style="width:7px;height:7px;border-radius:50%;background:var(--green);"></div>Online
              </div>
            </div>
          </div>
          <div style="display:flex;gap:10px;">
            <a href="/artist/${activeUser.id}" class="btn btn-secondary btn-sm">View Profile</a>
            <a href="/workspace/p1" class="btn btn-primary btn-sm"><i class="fas fa-layer-group"></i> Open Workspace</a>
          </div>
        </div>
        
        <!-- Messages -->
        <div id="chat-messages" style="flex:1;overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:16px;background:var(--bg);">
          <!-- Date divider -->
          <div style="text-align:center;">
            <span style="font-size:12px;color:var(--text2);background:var(--bg2);padding:4px 12px;border-radius:20px;border:1px solid var(--border);">March 10, 2026</span>
          </div>
          
          ${activeProjMessages.map(msg => {
            const isMe = msg.senderId === demoUser.id;
            const sender = getUserById(msg.senderId)!;
            return `
            <div style="display:flex;flex-direction:${isMe ? 'row-reverse' : 'row'};gap:10px;align-items:flex-end;">
              <img src="${sender.profileImage}" class="avatar" style="width:32px;height:32px;flex-shrink:0;" alt="${sender.artistName}">
              <div style="max-width:68%;">
                ${!isMe ? `<div style="font-size:12px;color:var(--text2);margin-bottom:4px;margin-left:4px;">${sender.artistName}</div>` : ''}
                <div style="padding:12px 16px;border-radius:${isMe ? '18px 4px 18px 18px' : '4px 18px 18px 18px'};background:${isMe ? 'var(--accent)' : 'var(--bg3)'};font-size:14px;line-height:1.6;">
                  ${msg.content}
                </div>
                <div style="font-size:11px;color:var(--text2);margin-top:4px;text-align:${isMe ? 'right' : 'left'};">
                  ${new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                  ${isMe ? ' <i class="fas fa-check-double" style="color:var(--accent3);font-size:10px;"></i>' : ''}
                </div>
              </div>
            </div>`;
          }).join('')}
          
          <!-- Typing indicator -->
          <div id="typing-indicator" style="display:none;padding:8px 0;">
            <div style="display:flex;align-items:center;gap:10px;">
              <img src="${activeUser.profileImage}" class="avatar" style="width:28px;height:28px;" alt="${activeUser.artistName}">
              <div style="padding:10px 16px;background:var(--bg3);border-radius:4px 18px 18px 18px;display:flex;gap:4px;align-items:center;">
                <div style="width:6px;height:6px;border-radius:50%;background:var(--text2);animation:bounce 1.4s infinite;"></div>
                <div style="width:6px;height:6px;border-radius:50%;background:var(--text2);animation:bounce 1.4s 0.2s infinite;"></div>
                <div style="width:6px;height:6px;border-radius:50%;background:var(--text2);animation:bounce 1.4s 0.4s infinite;"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Message Input -->
        <div style="padding:20px;background:var(--bg2);border-top:1px solid var(--border);">
          <div style="display:flex;gap:10px;align-items:flex-end;">
            <div style="flex:1;position:relative;">
              <textarea class="form-input" placeholder="Type a message to ${activeUser.artistName}..." id="chat-input" style="resize:none;min-height:44px;max-height:120px;padding:12px 16px;font-size:14px;line-height:1.5;" rows="1" onkeypress="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendChatMessage()}" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'"></textarea>
            </div>
            <button class="btn btn-secondary" style="height:44px;padding:0 14px;" onclick="alert('Attach files via the project workspace')">
              <i class="fas fa-paperclip"></i>
            </button>
            <button class="btn btn-primary" style="height:44px;padding:0 18px;" onclick="sendChatMessage()">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
          <div style="font-size:12px;color:var(--text2);margin-top:8px;">Press Enter to send · Shift+Enter for new line</div>
        </div>
      </div>
    </div>
  </main>
</div>

<style>
@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}
</style>

<script>
function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if(!text) return;
  
  const area = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.style.cssText = 'display:flex;flex-direction:row-reverse;gap:10px;align-items:flex-end;';
  div.innerHTML = \`
    <img src="${demoUser.profileImage}" class="avatar" style="width:32px;height:32px;flex-shrink:0;">
    <div style="max-width:68%;">
      <div style="padding:12px 16px;border-radius:18px 4px 18px 18px;background:var(--accent);font-size:14px;line-height:1.6;">\${text}</div>
      <div style="font-size:11px;color:var(--text2);margin-top:4px;text-align:right;">\${new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} <i class="fas fa-check-double" style="color:var(--accent3);font-size:10px;"></i></div>
    </div>\`;
  area.appendChild(div);
  area.scrollTop = area.scrollHeight;
  input.value = '';
  input.style.height = 'auto';
  
  // Show typing indicator
  const typing = document.getElementById('typing-indicator');
  typing.style.display = 'block';
  setTimeout(() => { typing.style.display = 'none'; }, 2000);
}

function selectConversation(userId) {
  // In a real app this would load the conversation
}

document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
</script>
` + closeHTML();
}

export function earningsPage(): string {
  return head('Earnings') + authedNav('', { name: demoUser.artistName, image: demoUser.profileImage }) + `
<div class="app-layout">
  ${dashboardSidebar('earnings')}
  <main class="main-content">
    <div style="margin-bottom:32px;">
      <h1 style="font-size:1.8rem;margin-bottom:6px;">Earnings</h1>
      <p style="color:var(--text2);">Track your income from collaborations on Artist Collab.</p>
    </div>
    
    <!-- Summary cards -->
    <div class="grid-4 mb-8">
      ${[
        { label: 'Total Earned', value: '$4,725', icon: 'fas fa-dollar-sign', color: 'var(--green)', bg: 'rgba(16,185,129,0.15)', change: '+$540 this month' },
        { label: 'Pending Payout', value: '$540', icon: 'fas fa-clock', color: 'var(--gold)', bg: 'rgba(245,158,11,0.15)', change: '1 project held' },
        { label: 'Completed Orders', value: '34', icon: 'fas fa-check-circle', color: 'var(--accent3)', bg: 'rgba(124,58,237,0.15)', change: '3 this month' },
        { label: 'Platform Fee Paid', value: '$472', icon: 'fas fa-percent', color: 'var(--text2)', bg: 'rgba(107,114,128,0.15)', change: '10% commission' },
      ].map(s => `
      <div class="stat-card">
        <div style="display:flex;justify-content:space-between;margin-bottom:16px;">
          <div class="stat-icon" style="background:${s.bg};"><i class="${s.icon}" style="color:${s.color};"></i></div>
        </div>
        <div class="stat-number" style="color:${s.color};">${s.value}</div>
        <div class="stat-label">${s.label}</div>
        <div style="font-size:12px;color:var(--text2);margin-top:4px;">${s.change}</div>
      </div>`).join('')}
    </div>
    
    <!-- Chart placeholder -->
    <div class="card p-6 mb-6">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
        <h3 style="font-size:18px;">Earnings Over Time</h3>
        <div style="display:flex;gap:8px;">
          ${['7D', '30D', '3M', '1Y', 'All'].map((t, i) => `<button class="btn ${i === 1 ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="this.parentElement.querySelectorAll('.btn').forEach(b=>{b.classList.remove('btn-primary');b.classList.add('btn-secondary')});this.classList.add('btn-primary');this.classList.remove('btn-secondary')">${t}</button>`).join('')}
        </div>
      </div>
      <!-- Bar chart visualization -->
      <div style="height:180px;display:flex;align-items:flex-end;gap:8px;padding-bottom:20px;border-bottom:1px solid var(--border);position:relative;">
        <div style="position:absolute;left:0;right:0;bottom:20px;top:0;display:flex;flex-direction:column;justify-content:space-between;pointer-events:none;">
          ${['$800', '$600', '$400', '$200', '$0'].map(v => `<div style="font-size:11px;color:var(--text2);padding-right:8px;">${v}</div>`).join('')}
        </div>
        ${[120, 340, 180, 0, 540, 280, 350, 0, 420, 180, 600, 380, 220, 540, 650, 480, 0, 300, 540, 120, 430, 380, 280, 0, 600, 450, 540, 380, 720, 540].map((h, i) => `
        <div style="flex:1;background:linear-gradient(to top,var(--accent),var(--accent3));border-radius:4px 4px 0 0;height:${h/8}px;min-height:${h>0?2:0}px;opacity:${h>0?1:0.1};transition:opacity 0.2s;cursor:pointer;" title="$${h}" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='${h>0?1:0.1}'"></div>`).join('')}
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:11px;color:var(--text2);">
        <span>Mar 1</span><span>Mar 10</span><span>Mar 20</span><span>Mar 30</span>
      </div>
    </div>
    
    <!-- Transaction History -->
    <div class="card">
      <div style="padding:20px 24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
        <h3 style="font-size:18px;">Transaction History</h3>
        <button class="btn btn-secondary btn-sm"><i class="fas fa-download"></i> Export CSV</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Project</th><th>Client</th><th>Package</th><th>Amount</th><th>Fee</th><th>Payout</th><th>Status</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${[
              { project: 'Verse Feature — "Ice Season"', client: 'DRIP KAYO', package: 'Standard', amount: '$350', fee: '$35', payout: '$315', status: 'released', date: 'Feb 26' },
              { project: 'Hook Recording Session', client: 'CIPHER 7', package: 'Basic', amount: '$350', fee: '$35', payout: '$315', status: 'released', date: 'Feb 18' },
              { project: 'Verse Feature — Beat Collab', client: 'SOULWAV', package: 'Premium', amount: '$1,200', fee: '$120', payout: '$1,080', status: 'released', date: 'Feb 05' },
              { project: 'XAVI × Cipher7 Verse', client: 'CIPHER 7', package: 'Standard', amount: '$600', fee: '$60', payout: '$540', status: 'held', date: 'Mar 10' },
            ].map(t => `
            <tr>
              <td><span style="font-weight:600;font-size:13px;">${t.project}</span></td>
              <td><span style="font-size:13px;color:var(--text2);">${t.client}</span></td>
              <td><span class="badge badge-purple" style="font-size:11px;">${t.package}</span></td>
              <td><span style="font-weight:700;font-size:14px;">${t.amount}</span></td>
              <td><span style="font-size:13px;color:var(--text2);">${t.fee}</span></td>
              <td><span style="font-weight:700;color:var(--green);font-size:14px;">${t.payout}</span></td>
              <td><span class="badge ${t.status === 'released' ? 'badge-green' : 'badge-gold'}" style="font-size:11px;">${t.status === 'released' ? '✅ Paid Out' : '🔒 Held'}</span></td>
              <td><span style="font-size:13px;color:var(--text2);">${t.date}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </main>
</div>
` + closeHTML();
}

export function listingsPage(): string {
  return head('My Listings') + authedNav('', { name: demoUser.artistName, image: demoUser.profileImage }) + `
<div class="app-layout">
  ${dashboardSidebar('listings')}
  <main class="main-content">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:32px;flex-wrap:wrap;gap:16px;">
      <div>
        <h1 style="font-size:1.8rem;margin-bottom:4px;">My Listings</h1>
        <p style="color:var(--text2);">Manage your feature packages and services.</p>
      </div>
      <button class="btn btn-primary" onclick="document.getElementById('create-listing-modal').style.display='flex'">
        <i class="fas fa-plus"></i> Create New Listing
      </button>
    </div>
    
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div class="card" style="padding:24px;border-color:rgba(124,58,237,0.3);">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;">
          <div style="flex:1;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <h3 style="font-size:18px;">16-Bar Trap Feature</h3>
              <span class="badge badge-green">Active</span>
            </div>
            <p style="font-size:14px;color:var(--text2);line-height:1.6;margin-bottom:12px;">Hard-hitting trap verse for your record. Professional studio quality with adlibs and stems included.</p>
            <div style="display:flex;gap:20px;font-size:13px;color:var(--text2);flex-wrap:wrap;">
              <span><i class="fas fa-shopping-bag" style="margin-right:5px;"></i>203 orders</span>
              <span class="stars" style="font-size:12px;">★★★★★ 4.9</span>
              <span><i class="fas fa-dollar-sign" style="margin-right:5px;"></i>Starting at $350</span>
            </div>
          </div>
          <div style="display:flex;gap:10px;flex-shrink:0;">
            <button class="btn btn-secondary btn-sm" onclick="alert('Edit listing form would open')"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-secondary btn-sm" onclick="alert('Listing paused')"><i class="fas fa-pause"></i> Pause</button>
            <a href="/listing/l1" class="btn btn-ghost btn-sm"><i class="fas fa-eye"></i> View</a>
          </div>
        </div>
      </div>
      
      <!-- Create New Listing CTA -->
      <div class="card" style="padding:48px;text-align:center;border:2px dashed var(--border);cursor:pointer;transition:all 0.2s;" onmouseover="this.style.borderColor='rgba(124,58,237,0.4)';this.style.background='rgba(124,58,237,0.03)'" onmouseout="this.style.borderColor='var(--border)';this.style.background=''" onclick="document.getElementById('create-listing-modal').style.display='flex'">
        <i class="fas fa-plus-circle" style="font-size:40px;color:var(--bg4);margin-bottom:16px;display:block;"></i>
        <h3 style="margin-bottom:8px;">Add Another Service</h3>
        <p style="color:var(--text2);font-size:14px;">Create a new package like a hook feature, song collab, or live session.</p>
      </div>
    </div>
  </main>
</div>

<!-- Create Listing Modal -->
<div id="create-listing-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:1000;align-items:center;justify-content:center;padding:24px;" onclick="if(event.target===this)this.style.display='none'">
  <div class="card" style="width:100%;max-width:640px;max-height:90vh;overflow-y:auto;padding:32px;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
      <h2 style="font-size:1.4rem;">Create New Listing</h2>
      <button onclick="document.getElementById('create-listing-modal').style.display='none'" style="background:none;border:none;color:var(--text2);cursor:pointer;font-size:20px;"><i class="fas fa-times"></i></button>
    </div>
    <div class="form-group mb-4">
      <label class="form-label">Service Title</label>
      <input type="text" class="form-input" placeholder="e.g. 16-Bar Hip-Hop Feature">
    </div>
    <div class="form-group mb-4">
      <label class="form-label">Category</label>
      <select class="form-select">
        <option>Feature Verse</option><option>Hook / Chorus</option><option>Custom Beat</option>
        <option>Songwriter / Topline</option><option>Mixing</option><option>Full Song Collab</option>
      </select>
    </div>
    <div class="form-group mb-4">
      <label class="form-label">Description</label>
      <textarea class="form-input" placeholder="Describe your service in detail..." rows="4"></textarea>
    </div>
    <div class="grid-3 mb-4">
      <div class="form-group">
        <label class="form-label">Starting Price</label>
        <div style="position:relative;">
          <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text2);">$</span>
          <input type="number" class="form-input" placeholder="250" style="padding-left:28px;">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Delivery Days</label>
        <input type="number" class="form-input" placeholder="3">
      </div>
      <div class="form-group">
        <label class="form-label">Revisions</label>
        <input type="number" class="form-input" placeholder="2">
      </div>
    </div>
    <div class="form-group mb-6">
      <label class="form-label">File Formats Included</label>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        ${['WAV', 'MP3', 'AIFF', 'STEMS', 'ZIP', 'PDF'].map(f => `
        <label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:8px 14px;background:var(--bg3);border:1px solid var(--border);border-radius:8px;font-size:13px;transition:all 0.2s;">
          <input type="checkbox" style="accent-color:var(--accent);"> ${f}
        </label>`).join('')}
      </div>
    </div>
    <div style="display:flex;gap:12px;">
      <button class="btn btn-secondary" style="flex:1;justify-content:center;" onclick="document.getElementById('create-listing-modal').style.display='none'">Cancel</button>
      <button class="btn btn-primary" style="flex:1;justify-content:center;" onclick="alert('Listing created! Publishing your service...');document.getElementById('create-listing-modal').style.display='none'">
        <i class="fas fa-rocket"></i> Publish Listing
      </button>
    </div>
  </div>
</div>
` + closeHTML();
}

export function ordersPage(): string {
  return head('Orders') + authedNav('', { name: demoUser.artistName, image: demoUser.profileImage }) + `
<div class="app-layout">
  ${dashboardSidebar('orders')}
  <main class="main-content">
    <div style="margin-bottom:32px;">
      <h1 style="font-size:1.8rem;margin-bottom:6px;">Orders</h1>
      <p style="color:var(--text2);">All your bookings and purchases in one place.</p>
    </div>
    
    <div style="display:flex;gap:8px;margin-bottom:24px;">
      ${['All Orders', 'As Seller', 'As Buyer'].map((t, i) => `<button class="btn ${i === 0 ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="this.parentElement.querySelectorAll('.btn').forEach(b=>{b.classList.remove('btn-primary');b.classList.add('btn-secondary')});this.classList.add('btn-primary');this.classList.remove('btn-secondary')">${t}</button>`).join('')}
    </div>
    
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Order</th><th>Artist</th><th>Package</th><th>Amount</th><th>Status</th><th>Due</th><th>Action</th></tr>
          </thead>
          <tbody>
            ${projects.map(p => {
              const other = getUserById(p.sellerId === demoUser.id ? p.buyerId : p.sellerId)!;
              const role = p.sellerId === demoUser.id ? 'Seller' : 'Buyer';
              return `
              <tr>
                <td>
                  <div style="font-weight:600;font-size:14px;">${p.title}</div>
                  <div style="font-size:12px;color:var(--text2);">Role: ${role}</div>
                </td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <img src="${other.profileImage}" class="avatar" style="width:32px;height:32px;" alt="${other.artistName}">
                    <span style="font-size:14px;">${other.artistName}</span>
                  </div>
                </td>
                <td><span class="badge badge-purple" style="font-size:11px;">${p.package}</span></td>
                <td><span style="font-weight:700;color:var(--accent3);">${formatPrice(p.orderTotal)}</span></td>
                <td>
                  <span class="badge" style="font-size:11px;background:${statusColor(p.status)}22;color:${statusColor(p.status)};border:1px solid ${statusColor(p.status)}44;">
                    ${statusLabel(p.status)}
                  </span>
                </td>
                <td><span style="font-size:13px;color:var(--text2);">${p.dueDate}</span></td>
                <td>
                  <a href="/workspace/${p.id}" class="btn btn-secondary btn-sm">Open</a>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </main>
</div>
` + closeHTML();
}
