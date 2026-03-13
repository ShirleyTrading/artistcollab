import { head, authedNav, dashboardSidebar, closeHTML } from '../layout';
import { users, projects, listings, getUserById, statusColor, statusLabel, formatPrice } from '../data';

const demoUser = users[0]; // XAVI as logged-in user

export function dashboardPage(): string {
  const userProjects = projects.filter(p => p.buyerId === demoUser.id || p.sellerId === demoUser.id);
  const activeProjects = userProjects.filter(p => !['completed', 'cancelled'].includes(p.status));
  const completedProjects = userProjects.filter(p => p.status === 'completed');
  const totalEarnings = userProjects
    .filter(p => p.sellerId === demoUser.id && p.paymentStatus === 'released')
    .reduce((sum, p) => sum + p.payoutAmount, 0);

  return head('Dashboard') + authedNav('dashboard', { name: demoUser.artistName, image: demoUser.profileImage, notifications: 3 }) + `
<div class="app-layout">
  ${dashboardSidebar('dashboard')}
  <main class="main-content">
    <div style="margin-bottom:32px;">
      <h1 style="font-size:1.8rem;margin-bottom:6px;">Good afternoon, ${demoUser.artistName} 👋</h1>
      <p style="color:var(--text2);">Here's what's happening with your collaborations.</p>
    </div>
    
    <!-- Stats -->
    <div class="grid-4 mb-8">
      <div class="stat-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
          <div class="stat-icon" style="background:rgba(124,58,237,0.15);">
            <i class="fas fa-layer-group" style="color:var(--accent3);"></i>
          </div>
          <span class="badge badge-purple" style="font-size:11px;">Active</span>
        </div>
        <div class="stat-number" style="color:var(--accent3);">${activeProjects.length}</div>
        <div class="stat-label">Active Projects</div>
        <div class="stat-change stat-up mt-2"><i class="fas fa-arrow-up"></i> 2 this week</div>
      </div>
      <div class="stat-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
          <div class="stat-icon" style="background:rgba(16,185,129,0.15);">
            <i class="fas fa-dollar-sign" style="color:var(--green);"></i>
          </div>
        </div>
        <div class="stat-number" style="color:var(--green);">${formatPrice(totalEarnings || 540)}</div>
        <div class="stat-label">Total Earnings</div>
        <div class="stat-change stat-up mt-2"><i class="fas fa-arrow-up"></i> +$540 this month</div>
      </div>
      <div class="stat-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
          <div class="stat-icon" style="background:rgba(245,158,11,0.15);">
            <i class="fas fa-check-circle" style="color:var(--gold);"></i>
          </div>
        </div>
        <div class="stat-number" style="color:var(--gold);">${demoUser.completedProjects}</div>
        <div class="stat-label">Completed Projects</div>
        <div class="stat-change stat-up mt-2"><i class="fas fa-arrow-up"></i> All time</div>
      </div>
      <div class="stat-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
          <div class="stat-icon" style="background:rgba(59,130,246,0.15);">
            <i class="fas fa-star" style="color:var(--blue);"></i>
          </div>
        </div>
        <div class="stat-number" style="color:var(--blue);">${demoUser.rating}</div>
        <div class="stat-label">Average Rating</div>
        <div style="font-size:12px;color:var(--text2);margin-top:4px;">${demoUser.reviewCount} reviews</div>
      </div>
    </div>
    
    <!-- Active Projects -->
    <div class="mb-8">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <h2 style="font-size:18px;">Active Projects</h2>
        <a href="/dashboard/projects" class="btn btn-secondary btn-sm">View All</a>
      </div>
      ${userProjects.filter(p => p.status !== 'cancelled').map(proj => {
        const buyer = getUserById(proj.buyerId);
        const seller = getUserById(proj.sellerId);
        const other = proj.sellerId === demoUser.id ? buyer : seller;
        const role = proj.sellerId === demoUser.id ? 'Delivering' : 'Waiting';
        return `
        <a href="/workspace/${proj.id}" style="display:block;margin-bottom:12px;transition:transform 0.2s;" onmouseover="this.style.transform='translateX(4px)'" onmouseout="this.style.transform=''">
          <div class="card" style="padding:20px;display:flex;gap:16px;align-items:center;transition:border-color 0.2s;flex-wrap:wrap;" onmouseover="this.style.borderColor='rgba(124,58,237,0.4)'" onmouseout="this.style.borderColor='var(--border)'">
            <img src="${other?.profileImage}" class="avatar" style="width:48px;height:48px;flex-shrink:0;" alt="${other?.artistName}">
            <div style="flex:1;min-width:0;">
              <div style="font-weight:700;font-size:15px;margin-bottom:3px;">${proj.title}</div>
              <div style="font-size:13px;color:var(--text2);">with ${other?.artistName} · ${proj.package} Package</div>
            </div>
            <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
              <div>
                <div style="font-size:11px;color:var(--text2);margin-bottom:4px;">Status</div>
                <span class="badge" style="background:${statusColor(proj.status)}22;color:${statusColor(proj.status)};border:1px solid ${statusColor(proj.status)}44;font-size:12px;">
                  ${statusLabel(proj.status)}
                </span>
              </div>
              <div>
                <div style="font-size:11px;color:var(--text2);margin-bottom:4px;">Due</div>
                <div style="font-size:13px;font-weight:600;">${proj.dueDate}</div>
              </div>
              <div>
                <div style="font-size:11px;color:var(--text2);margin-bottom:4px;">Value</div>
                <div style="font-size:14px;font-weight:700;color:var(--accent3);">${formatPrice(proj.orderTotal)}</div>
              </div>
              <div class="btn btn-secondary btn-sm">Open Workspace <i class="fas fa-arrow-right"></i></div>
            </div>
          </div>
        </a>`;
      }).join('')}
    </div>
    
    <!-- Quick Actions -->
    <div class="mb-8">
      <h2 style="font-size:18px;margin-bottom:20px;">Quick Actions</h2>
      <div class="grid-4">
        ${[
          { icon: 'fas fa-search', label: 'Find a Collaborator', href: '/explore', color: 'rgba(124,58,237,0.2)', border: 'rgba(124,58,237,0.3)', ic: 'var(--accent3)' },
          { icon: 'fas fa-plus-circle', label: 'Create a Listing', href: '/dashboard/listings', color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.25)', ic: '#6ee7b7' },
          { icon: 'fas fa-comment-dots', label: 'Messages', href: '/dashboard/messages', color: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.25)', ic: '#93c5fd' },
          { icon: 'fas fa-dollar-sign', label: 'View Earnings', href: '/dashboard/earnings', color: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.25)', ic: '#fcd34d' },
        ].map(a => `
        <a href="${a.href}">
          <div class="card" style="padding:20px;text-align:center;cursor:pointer;transition:transform 0.2s,border-color 0.2s;background:${a.color};border-color:${a.border};" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform=''">
            <i class="${a.icon}" style="font-size:24px;color:${a.ic};margin-bottom:12px;display:block;"></i>
            <div style="font-size:14px;font-weight:600;">${a.label}</div>
          </div>
        </a>`).join('')}
      </div>
    </div>
    
    <!-- Profile Completion -->
    <div class="card p-6">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:12px;">
        <div>
          <h3 style="font-size:16px;margin-bottom:4px;">Profile Completion</h3>
          <p style="font-size:13px;color:var(--text2);">Complete your profile to attract more collaborations</p>
        </div>
        <div style="font-size:24px;font-weight:800;font-family:'Space Grotesk',sans-serif;color:var(--accent3);">85%</div>
      </div>
      <div class="progress-bar mb-4">
        <div class="progress-fill" style="width:85%;"></div>
      </div>
      <div class="grid-3" style="gap:12px;">
        ${[
          { label: 'Profile Photo', done: true },
          { label: 'Bio Written', done: true },
          { label: 'Genre Selected', done: true },
          { label: 'Social Links', done: true },
          { label: 'Service Listing Created', done: true },
          { label: 'Sample Work Added', done: false },
        ].map(item => `
        <div style="display:flex;align-items:center;gap:8px;font-size:13px;">
          <i class="fas ${item.done ? 'fa-check-circle' : 'fa-circle'}" style="color:${item.done ? 'var(--green)' : 'var(--bg4)'};font-size:14px;"></i>
          <span style="color:${item.done ? 'var(--text)' : 'var(--text2)'};">${item.label}</span>
        </div>`).join('')}
      </div>
    </div>
  </main>
</div>
` + closeHTML();
}

export function projectsPage(): string {
  const userProjects = projects.filter(p => p.buyerId === demoUser.id || p.sellerId === demoUser.id);
  return head('My Projects') + authedNav('projects', { name: demoUser.artistName, image: demoUser.profileImage }) + `
<div class="app-layout">
  ${dashboardSidebar('projects')}
  <main class="main-content">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:32px;flex-wrap:wrap;gap:16px;">
      <div>
        <h1 style="font-size:1.8rem;margin-bottom:4px;">My Projects</h1>
        <p style="color:var(--text2);">${userProjects.length} total collaborations</p>
      </div>
      <a href="/explore" class="btn btn-primary"><i class="fas fa-plus"></i> Start New Collaboration</a>
    </div>
    
    <!-- Filter tabs -->
    <div style="display:flex;gap:8px;margin-bottom:24px;overflow-x:auto;padding-bottom:4px;">
      ${['All', 'In Progress', 'Delivered', 'Completed', 'Pending'].map((tab, i) => `
      <button class="btn ${i === 0 ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterProjects('${tab}', this)">${tab}</button>`).join('')}
    </div>
    
    <div id="projects-list" style="display:flex;flex-direction:column;gap:16px;">
      ${userProjects.map(proj => {
        const other = getUserById(proj.sellerId === demoUser.id ? proj.buyerId : proj.sellerId);
        return `
        <a href="/workspace/${proj.id}" style="display:block;">
          <div class="card" style="padding:24px;transition:border-color 0.2s,transform 0.2s;" onmouseover="this.style.borderColor='rgba(124,58,237,0.4)';this.style.transform='translateX(4px)'" onmouseout="this.style.borderColor='var(--border)';this.style.transform=''">
            <div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap;">
              <img src="${other?.profileImage}" class="avatar" style="width:56px;height:56px;flex-shrink:0;" alt="${other?.artistName}">
              <div style="flex:1;min-width:200px;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
                  <div>
                    <h3 style="font-size:17px;font-weight:700;margin-bottom:4px;">${proj.title}</h3>
                    <div style="font-size:13px;color:var(--text2);">with ${other?.artistName} · ${proj.package} Package · ${proj.createdAt}</div>
                  </div>
                  <span class="badge" style="background:${statusColor(proj.status)}22;color:${statusColor(proj.status)};border:1px solid ${statusColor(proj.status)}44;white-space:nowrap;">
                    ${statusLabel(proj.status)}
                  </span>
                </div>
                <p style="font-size:13px;color:var(--text2);margin-bottom:12px;line-height:1.6;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;">${proj.notes}</p>
                <div style="display:flex;gap:20px;flex-wrap:wrap;font-size:13px;">
                  <span style="color:var(--text2);"><i class="fas fa-calendar" style="margin-right:5px;"></i>Due: ${proj.dueDate}</span>
                  <span style="color:var(--text2);"><i class="fas fa-file" style="margin-right:5px;"></i>${proj.files.length} file${proj.files.length !== 1 ? 's' : ''}</span>
                  <span style="color:var(--text2);"><i class="fas fa-comment" style="margin-right:5px;"></i>${proj.messages.length} messages</span>
                  <span style="font-weight:700;color:var(--accent3);margin-left:auto;">${formatPrice(proj.orderTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </a>`;
      }).join('')}
    </div>
  </main>
</div>
<script>
function filterProjects(tab, btn) {
  document.querySelectorAll('.btn-primary.btn-sm').forEach(b => { b.classList.remove('btn-primary'); b.classList.add('btn-secondary'); });
  btn.classList.add('btn-primary'); btn.classList.remove('btn-secondary');
}
</script>
` + closeHTML();
}

export function workspacePage(project: typeof projects[0]): string {
  const buyer = getUserById(project.buyerId)!;
  const seller = getUserById(project.sellerId)!;
  const isAsSeller = project.sellerId === demoUser.id;
  const other = isAsSeller ? buyer : seller;

  return head(project.title) + authedNav('projects', { name: demoUser.artistName, image: demoUser.profileImage }) + `
<div class="app-layout">
  ${dashboardSidebar('projects')}
  <main class="main-content" style="padding:0;">
    <div style="padding:24px 32px;background:var(--bg2);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
      <div>
        <div style="font-size:12px;color:var(--text2);margin-bottom:4px;">
          <a href="/dashboard/projects" style="color:var(--text2);">Projects</a> <i class="fas fa-chevron-right" style="font-size:10px;margin:0 4px;"></i> Workspace
        </div>
        <h1 style="font-size:1.4rem;font-weight:700;">${project.title}</h1>
        <div style="font-size:13px;color:var(--text2);margin-top:4px;">with ${other.artistName} · ${project.package} Package</div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <span class="badge" style="font-size:13px;padding:7px 14px;background:${statusColor(project.status)}22;color:${statusColor(project.status)};border:1px solid ${statusColor(project.status)}44;">
          ${statusLabel(project.status)}
        </span>
        ${project.status === 'delivered' ? `
        <button class="btn btn-green" onclick="acceptDelivery()"><i class="fas fa-check"></i> Accept Delivery</button>
        <button class="btn btn-secondary" onclick="requestRevision()"><i class="fas fa-redo"></i> Request Revision</button>
        ` : ''}
        ${isAsSeller && project.status === 'in_progress' ? `
        <button class="btn btn-primary" onclick="markDelivered()"><i class="fas fa-paper-plane"></i> Deliver Files</button>
        ` : ''}
      </div>
    </div>
    
    <div style="display:grid;grid-template-columns:1fr 340px;min-height:calc(100vh - 180px);">
      <!-- Main workspace -->
      <div style="padding:24px 32px;overflow-y:auto;">
        <!-- Order Summary -->
        <div class="card p-6 mb-6">
          <h3 style="font-size:16px;margin-bottom:16px;">Order Summary</h3>
          <div class="grid-3" style="gap:16px;">
            <div>
              <div style="font-size:12px;color:var(--text2);margin-bottom:4px;">Order Total</div>
              <div style="font-size:22px;font-weight:800;font-family:'Space Grotesk',sans-serif;color:var(--accent3);">${formatPrice(project.orderTotal)}</div>
            </div>
            <div>
              <div style="font-size:12px;color:var(--text2);margin-bottom:4px;">Due Date</div>
              <div style="font-size:16px;font-weight:700;">${project.dueDate}</div>
            </div>
            <div>
              <div style="font-size:12px;color:var(--text2);margin-bottom:4px;">Payment Status</div>
              <span class="badge ${project.paymentStatus === 'released' ? 'badge-green' : 'badge-gold'}">${project.paymentStatus === 'held' ? '🔒 Held in Escrow' : project.paymentStatus === 'released' ? '✅ Released' : '↩️ Refunded'}</span>
            </div>
          </div>
          ${project.notes ? `
          <div style="margin-top:16px;padding:14px;background:var(--bg3);border-radius:10px;">
            <div style="font-size:12px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Project Notes</div>
            <p style="font-size:14px;color:var(--text2);line-height:1.7;">${project.notes}</p>
          </div>` : ''}
        </div>
        
        <!-- Timeline -->
        <div class="card p-6 mb-6">
          <h3 style="font-size:16px;margin-bottom:16px;"><i class="fas fa-route" style="color:var(--accent3);margin-right:8px;"></i>Project Timeline</h3>
          <div style="display:flex;gap:0;overflow-x:auto;padding-bottom:8px;">
            ${['Pending', 'In Progress', 'Awaiting Delivery', 'Delivered', 'Completed'].map((step, i) => {
              const statuses = ['pending', 'in_progress', 'awaiting_delivery', 'delivered', 'completed'];
              const currentIdx = statuses.indexOf(project.status);
              const stepIdx = i;
              const done = stepIdx < currentIdx;
              const active = stepIdx === currentIdx;
              return `
              <div style="display:flex;align-items:center;flex:1;min-width:0;">
                <div style="display:flex;flex-direction:column;align-items:center;flex:1;">
                  <div style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:13px;font-weight:700;
                    background:${done ? 'var(--green)' : active ? 'var(--accent)' : 'var(--bg3)'};
                    color:${done || active ? 'white' : 'var(--text2)'};
                    border:2px solid ${done ? 'var(--green)' : active ? 'var(--accent)' : 'var(--border)'};">
                    ${done ? '<i class="fas fa-check" style="font-size:12px;"></i>' : i + 1}
                  </div>
                  <div style="font-size:11px;font-weight:${active ? '700' : '400'};color:${active ? 'var(--text)' : 'var(--text2)'};margin-top:6px;text-align:center;white-space:nowrap;">${step}</div>
                </div>
                ${i < 4 ? `<div style="flex:1;height:2px;background:${done ? 'var(--green)' : 'var(--bg4)'};margin-bottom:18px;min-width:20px;"></div>` : ''}
              </div>`;
            }).join('')}
          </div>
        </div>
        
        <!-- Stem Locker / Files -->
        <div class="card p-6 mb-6">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h3 style="font-size:16px;"><i class="fas fa-folder-open" style="color:var(--gold);margin-right:8px;"></i>Stem Locker</h3>
            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('file-input').click()">
              <i class="fas fa-upload"></i> Upload Files
            </button>
            <input type="file" id="file-input" multiple style="display:none;" onchange="handleFileUpload(event)" accept=".wav,.mp3,.aiff,.zip,.pdf">
          </div>
          
          <!-- Drag drop zone -->
          <div id="drop-zone" style="border:2px dashed var(--border);border-radius:12px;padding:28px;text-align:center;margin-bottom:16px;cursor:pointer;transition:all 0.2s;"
            onmouseover="this.style.borderColor='var(--accent)';this.style.background='rgba(124,58,237,0.05)'"
            onmouseout="this.style.borderColor='var(--border)';this.style.background=''"
            onclick="document.getElementById('file-input').click()"
            ondragover="event.preventDefault();this.style.borderColor='var(--accent)'"
            ondragleave="this.style.borderColor='var(--border)'"
            ondrop="handleDrop(event)">
            <i class="fas fa-cloud-upload-alt" style="font-size:32px;color:var(--text2);margin-bottom:8px;display:block;"></i>
            <div style="font-size:14px;color:var(--text2);">Drag & drop stems, WAVs, or ZIP files here</div>
            <div style="font-size:12px;color:var(--text2);margin-top:4px;">Supports: WAV, MP3, AIFF, ZIP, PDF</div>
          </div>
          
          <!-- File list -->
          <div id="file-list">
            ${project.files.map(file => `
            <div class="file-item" style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg3);border-radius:10px;margin-bottom:8px;">
              <div style="width:40px;height:40px;background:linear-gradient(135deg,rgba(124,58,237,0.2),rgba(157,91,245,0.1));border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px;">
                ${file.type === 'WAV' || file.type === 'MP3' || file.type === 'AIFF' ? '🎵' : file.type === 'ZIP' ? '📦' : '📄'}
              </div>
              <div style="flex:1;min-width:0;">
                <div style="font-weight:600;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${file.name}</div>
                <div style="font-size:12px;color:var(--text2);">${file.type} · ${file.size} · Uploaded ${file.uploadedAt}</div>
              </div>
              <div style="display:flex;gap:8px;">
                <button class="btn btn-secondary btn-sm" onclick="alert('Download: ${file.name}')"><i class="fas fa-download"></i></button>
              </div>
            </div>`).join('')}
          </div>
        </div>
        
        <!-- Activity Feed -->
        <div class="card p-6">
          <h3 style="font-size:16px;margin-bottom:16px;"><i class="fas fa-history" style="color:var(--text2);margin-right:8px;"></i>Activity</h3>
          <div style="display:flex;flex-direction:column;gap:0;">
            ${project.activity.map(item => `
            <div style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
              <div style="width:32px;height:32px;border-radius:50%;background:var(--bg3);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:12px;color:var(--accent3);">
                <i class="fas ${item.type === 'order_created' ? 'fa-shopping-bag' : item.type === 'file_uploaded' ? 'fa-upload' : item.type === 'status_change' ? 'fa-refresh' : 'fa-comment'}"></i>
              </div>
              <div style="flex:1;">
                <div style="font-size:14px;">${item.description}</div>
                <div style="font-size:12px;color:var(--text2);margin-top:2px;">${new Date(item.timestamp).toLocaleString()}</div>
              </div>
            </div>`).join('')}
          </div>
        </div>
      </div>
      
      <!-- Chat Sidebar -->
      <div style="background:var(--bg2);border-left:1px solid var(--border);display:flex;flex-direction:column;">
        <div style="padding:20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px;">
          <img src="${other.profileImage}" class="avatar" style="width:40px;height:40px;" alt="${other.artistName}">
          <div>
            <div style="font-weight:700;font-size:14px;">${other.artistName}</div>
            <div style="font-size:12px;color:var(--green);display:flex;align-items:center;gap:5px;"><div style="width:7px;height:7px;border-radius:50%;background:var(--green);"></div>Online</div>
          </div>
        </div>
        
        <div id="messages-area" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;max-height:calc(100vh - 380px);">
          ${project.messages.map(msg => {
            const isMe = msg.senderId === demoUser.id;
            const sender = getUserById(msg.senderId);
            return `
            <div style="display:flex;flex-direction:${isMe ? 'row-reverse' : 'row'};gap:8px;align-items:flex-end;">
              <img src="${sender?.profileImage}" class="avatar" style="width:28px;height:28px;flex-shrink:0;" alt="${sender?.artistName}">
              <div style="max-width:75%;">
                <div style="padding:10px 14px;border-radius:${isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px'};background:${isMe ? 'var(--accent)' : 'var(--bg3)'};font-size:13px;line-height:1.6;">
                  ${msg.content}
                </div>
                <div style="font-size:11px;color:var(--text2);margin-top:3px;text-align:${isMe ? 'right' : 'left'};">${new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
              </div>
            </div>`;
          }).join('')}
        </div>
        
        <div style="padding:16px;border-top:1px solid var(--border);">
          <div style="display:flex;gap:8px;">
            <input class="form-input" placeholder="Message ${other.artistName}..." id="msg-input" style="flex:1;padding:10px 14px;font-size:13px;" onkeypress="if(event.key==='Enter')sendMessage()">
            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('file-input').click()">
              <i class="fas fa-paperclip"></i>
            </button>
            <button class="btn btn-primary btn-sm" onclick="sendMessage()">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<script>
function sendMessage() {
  const input = document.getElementById('msg-input');
  const text = input.value.trim();
  if(!text) return;
  const area = document.getElementById('messages-area');
  const div = document.createElement('div');
  div.style.cssText = 'display:flex;flex-direction:row-reverse;gap:8px;align-items:flex-end;';
  div.innerHTML = \`
    <img src="${demoUser.profileImage}" class="avatar" style="width:28px;height:28px;flex-shrink:0;">
    <div style="max-width:75%;">
      <div style="padding:10px 14px;border-radius:16px 4px 16px 16px;background:var(--accent);font-size:13px;line-height:1.6;">\${text}</div>
      <div style="font-size:11px;color:var(--text2);margin-top:3px;text-align:right;">\${new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
    </div>\`;
  area.appendChild(div);
  area.scrollTop = area.scrollHeight;
  input.value = '';
}

function handleFileUpload(event) {
  const files = event.target.files;
  if(!files.length) return;
  const list = document.getElementById('file-list');
  Array.from(files).forEach(file => {
    const ext = file.name.split('.').pop().toUpperCase();
    const icon = ['WAV','MP3','AIFF'].includes(ext) ? '🎵' : ext === 'ZIP' ? '📦' : '📄';
    const div = document.createElement('div');
    div.style.cssText = 'display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg3);border-radius:10px;margin-bottom:8px;';
    div.innerHTML = \`
      <div style="width:40px;height:40px;background:linear-gradient(135deg,rgba(124,58,237,0.2),rgba(157,91,245,0.1));border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px;">\${icon}</div>
      <div style="flex:1;">
        <div style="font-weight:600;font-size:14px;">\${file.name}</div>
        <div style="font-size:12px;color:var(--text2);">\${ext} · \${(file.size/1024/1024).toFixed(1)} MB · Just now</div>
      </div>
      <div class="badge badge-green" style="font-size:11px;">Uploaded</div>\`;
    list.appendChild(div);
  });
}

function handleDrop(event) {
  event.preventDefault();
  const files = event.dataTransfer.files;
  if(files.length) handleFileUpload({target:{files}});
}

function markDelivered() {
  if(confirm('Mark this project as delivered? Your files will be sent to the client.')) {
    alert('Project marked as delivered. Client will be notified.');
  }
}

function acceptDelivery() {
  if(confirm('Accept this delivery? Payment will be released to ${seller.artistName}.')) {
    alert('Delivery accepted! Payment of ${formatPrice(project.payoutAmount)} released to ${seller.artistName}.');
  }
}

function requestRevision() {
  const reason = prompt('What would you like revised?');
  if(reason) alert('Revision requested. ${seller.artistName} will be notified.');
}

// Auto-scroll messages
document.getElementById('messages-area').scrollTop = document.getElementById('messages-area').scrollHeight;
</script>
` + closeHTML();
}
