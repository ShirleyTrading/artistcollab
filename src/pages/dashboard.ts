import { shell, closeShell, authedNav, appSidebar } from '../layout';
import { users, projects, listings, getUserById, statusColor, statusLabel, formatPrice } from '../data';

const demoUser = users[0];

// ─── Dashboard Home ───────────────────────────────────────────────────────────
export function dashboardPage(): string {
  const userProjects = projects.filter(p => p.buyerId === demoUser.id || p.sellerId === demoUser.id);
  const activeProjects = userProjects.filter(p => !['completed', 'cancelled'].includes(p.status));
  const completedCount = userProjects.filter(p => p.status === 'completed').length;
  const totalEarnings = 4820;

  return shell('Dashboard', `
    .dash-page { padding: 32px 40px; max-width: 1200px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 40px; }
    .stat-tile {
      background: var(--surface);
      border: 1px solid var(--hairline);
      border-radius: var(--r-lg);
      padding: 24px;
      transition: border-color 0.2s, transform 0.2s;
      position: relative;
      overflow: hidden;
    }
    .stat-tile::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      border-radius: var(--r-lg) var(--r-lg) 0 0;
    }
    .stat-tile.uv::before  { background: linear-gradient(90deg, var(--uv), var(--uv-bright)); }
    .stat-tile.ok::before  { background: linear-gradient(90deg, var(--ok), #34d399); }
    .stat-tile.em::before  { background: linear-gradient(90deg, var(--ember), #fcd34d); }
    .stat-tile.ar::before  { background: linear-gradient(90deg, var(--arc), #67e8f9); }
    .stat-tile:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-2px); }
    .stat-num {
      font-size: 2.25rem;
      font-weight: 800;
      letter-spacing: -0.04em;
      line-height: 1;
      margin-bottom: 6px;
      font-family: 'DM Sans', sans-serif;
    }
    .stat-lbl { font-size: 0.78rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--t3); }
    .stat-sub { font-size: 0.78rem; color: var(--t3); margin-top: 8px; display: flex; align-items: center; gap: 4px; }
    .stat-up   { color: #34d399; }
    .stat-icon-wrap {
      width: 40px; height: 40px;
      border-radius: var(--r);
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem;
      margin-bottom: 16px;
    }
    .proj-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      border-radius: var(--r-md);
      border: 1px solid var(--hairline);
      background: var(--surface);
      margin-bottom: 10px;
      transition: border-color 0.18s, background 0.18s;
      text-decoration: none;
      color: inherit;
    }
    .proj-row:hover { border-color: rgba(139,92,246,0.3); background: rgba(139,92,246,0.04); }
    .progress-bar { height: 3px; background: var(--rim); border-radius: 2px; overflow: hidden; flex: 1; }
    .progress-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--uv), var(--uv-bright)); }
    .quick-action {
      display: flex; flex-direction: column; align-items: flex-start;
      gap: 8px; padding: 20px; background: var(--surface);
      border: 1px solid var(--hairline); border-radius: var(--r-md);
      cursor: pointer; transition: border-color 0.18s, background 0.18s;
      text-decoration: none; color: inherit;
    }
    .quick-action:hover { border-color: rgba(139,92,246,0.4); background: rgba(139,92,246,0.05); }
    .qa-icon {
      width: 36px; height: 36px; border-radius: var(--r-sm);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.875rem;
    }
    .activity-item {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 14px 0;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .activity-item:last-child { border-bottom: none; }
    .act-dot {
      width: 8px; height: 8px; border-radius: 50%;
      margin-top: 6px; flex-shrink: 0;
    }
    @media (max-width: 1024px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .dash-page { padding: 24px 20px; }
    }
    @media (max-width: 640px) {
      .stats-grid { grid-template-columns: 1fr; }
    }
  `) + authedNav('dashboard') + `
<div class="app-shell">
  ${appSidebar('home')}
  <main class="app-main">
    <div class="dash-page">

      <!-- Header -->
      <div style="margin-bottom:32px;display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:16px;">
        <div>
          <div class="label" style="margin-bottom:6px;color:var(--uv-bright);">Studio Dashboard</div>
          <h1 style="font-size:clamp(1.5rem,3vw,2rem);margin-bottom:8px;letter-spacing:-0.025em;">
            Good evening, ${demoUser.artistName} 
            <span style="font-size:1.5rem;">🎤</span>
          </h1>
          <p class="body-base" style="max-width:460px;">
            You have <strong style="color:var(--t1);">${activeProjects.length} active projects</strong> and 3 unread messages. Your next delivery is due in 2 days.
          </p>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <a href="/explore" class="btn btn-secondary btn-sm">
            <i class="fas fa-search"></i> Find Artists
          </a>
          <a href="/dashboard/listings" class="btn btn-primary btn-sm">
            <i class="fas fa-plus"></i> New Listing
          </a>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-tile uv">
          <div class="stat-icon-wrap" style="background:rgba(139,92,246,0.15);">
            <i class="fas fa-layer-group" style="color:var(--uv-bright);"></i>
          </div>
          <div class="stat-num" style="color:var(--uv-bright);">${activeProjects.length}</div>
          <div class="stat-lbl">Active Projects</div>
          <div class="stat-sub stat-up"><i class="fas fa-arrow-up" style="font-size:10px;"></i> 2 started this week</div>
        </div>
        <div class="stat-tile ok">
          <div class="stat-icon-wrap" style="background:rgba(16,185,129,0.12);">
            <i class="fas fa-dollar-sign" style="color:var(--ok);"></i>
          </div>
          <div class="stat-num" style="color:var(--ok);">${formatPrice(totalEarnings)}</div>
          <div class="stat-lbl">Total Earnings</div>
          <div class="stat-sub stat-up"><i class="fas fa-arrow-up" style="font-size:10px;"></i> +${formatPrice(540)} this month</div>
        </div>
        <div class="stat-tile em">
          <div class="stat-icon-wrap" style="background:rgba(245,158,11,0.12);">
            <i class="fas fa-check-circle" style="color:var(--ember);"></i>
          </div>
          <div class="stat-num" style="color:var(--ember);">${demoUser.completedProjects}</div>
          <div class="stat-lbl">Completed</div>
          <div class="stat-sub"><i class="fas fa-trophy" style="font-size:10px;color:var(--ember);"></i> All time deliveries</div>
        </div>
        <div class="stat-tile ar">
          <div class="stat-icon-wrap" style="background:rgba(34,211,238,0.1);">
            <i class="fas fa-star" style="color:var(--arc);"></i>
          </div>
          <div class="stat-num" style="color:var(--arc);">${demoUser.rating}</div>
          <div class="stat-lbl">Avg Rating</div>
          <div class="stat-sub"><i class="fas fa-comment" style="font-size:10px;color:var(--arc);"></i> ${demoUser.reviewCount} reviews</div>
        </div>
      </div>

      <!-- Two column layout -->
      <div style="display:grid;grid-template-columns:1fr 340px;gap:24px;align-items:start;" class="dash-cols">
        <div>

          <!-- Active Projects -->
          <div style="margin-bottom:32px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
              <div>
                <h2 style="font-size:1.125rem;letter-spacing:-0.01em;">Active Projects</h2>
                <p style="font-size:0.8125rem;color:var(--t3);margin-top:2px;">${activeProjects.length} in progress</p>
              </div>
              <a href="/dashboard/projects" class="btn btn-ghost btn-xs" style="color:var(--uv-bright);">View all <i class="fas fa-arrow-right" style="font-size:10px;"></i></a>
            </div>
            ${userProjects.filter(p => p.status !== 'cancelled').slice(0, 4).map(proj => {
              const buyer = getUserById(proj.buyerId);
              const seller = getUserById(proj.sellerId);
              const other = proj.sellerId === demoUser.id ? buyer : seller;
              const statusC = statusColor(proj.status);
              const pct = proj.status === 'completed' ? 100 : proj.status === 'delivered' ? 85 : proj.status === 'in_progress' ? 60 : proj.status === 'awaiting_delivery' ? 40 : 20;
              return `
            <a href="/workspace/${proj.id}" class="proj-row">
              <img src="${other?.profileImage}" class="av av-md" style="border:2px solid rgba(255,255,255,0.08);" alt="${other?.artistName}">
              <div style="flex:1;min-width:0;">
                <div style="font-weight:700;font-size:0.9375rem;letter-spacing:-0.01em;margin-bottom:4px;">${proj.title}</div>
                <div style="font-size:0.8125rem;color:var(--t3);">with ${other?.artistName} · ${proj.package} Package</div>
              </div>
              <div style="display:flex;align-items:center;gap:20px;flex-shrink:0;">
                <div style="text-align:right;">
                  <div style="font-size:0.71rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:var(--t4);margin-bottom:3px;">Progress</div>
                  <div style="display:flex;align-items:center;gap:8px;width:80px;">
                    <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:linear-gradient(90deg,${statusC},${statusC}cc);"></div></div>
                    <span style="font-size:0.75rem;color:var(--t3);width:28px;">${pct}%</span>
                  </div>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:0.71rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:var(--t4);margin-bottom:3px;">Due</div>
                  <div style="font-size:0.8125rem;font-weight:700;white-space:nowrap;">${proj.dueDate}</div>
                </div>
                <span class="badge" style="background:${statusC}22;color:${statusC};border-color:${statusC}44;flex-shrink:0;">
                  ${statusLabel(proj.status)}
                </span>
              </div>
            </a>`;
            }).join('')}
          </div>

          <!-- Quick Actions -->
          <div>
            <div style="margin-bottom:16px;">
              <h2 style="font-size:1.125rem;letter-spacing:-0.01em;">Quick Actions</h2>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
              <a href="/explore" class="quick-action">
                <div class="qa-icon" style="background:rgba(139,92,246,0.15);color:var(--uv-bright);">
                  <i class="fas fa-search"></i>
                </div>
                <div style="font-weight:700;font-size:0.875rem;">Browse Artists</div>
                <div style="font-size:0.78rem;color:var(--t3);">Find your next collaborator</div>
              </a>
              <a href="/marketplace" class="quick-action">
                <div class="qa-icon" style="background:rgba(245,158,11,0.12);color:var(--ember);">
                  <i class="fas fa-shopping-bag"></i>
                </div>
                <div style="font-weight:700;font-size:0.875rem;">Marketplace</div>
                <div style="font-size:0.78rem;color:var(--t3);">Browse services & features</div>
              </a>
              <a href="/dashboard/messages" class="quick-action">
                <div class="qa-icon" style="background:rgba(34,211,238,0.1);color:var(--arc);">
                  <i class="fas fa-comment-dots"></i>
                </div>
                <div style="font-weight:700;font-size:0.875rem;">Messages</div>
                <div style="font-size:0.78rem;color:var(--t3);">3 unread conversations</div>
              </a>
              <a href="/dashboard/listings" class="quick-action">
                <div class="qa-icon" style="background:rgba(16,185,129,0.1);color:var(--ok);">
                  <i class="fas fa-list-ul"></i>
                </div>
                <div style="font-weight:700;font-size:0.875rem;">My Listings</div>
                <div style="font-size:0.78rem;color:var(--t3);">Manage your services</div>
              </a>
              <a href="/dashboard/earnings" class="quick-action">
                <div class="qa-icon" style="background:rgba(59,130,246,0.1);color:var(--info);">
                  <i class="fas fa-dollar-sign"></i>
                </div>
                <div style="font-weight:700;font-size:0.875rem;">Earnings</div>
                <div style="font-size:0.78rem;color:var(--t3);">Track your revenue</div>
              </a>
              <a href="/profile/me" class="quick-action">
                <div class="qa-icon" style="background:rgba(255,255,255,0.06);color:var(--t2);">
                  <i class="fas fa-user"></i>
                </div>
                <div style="font-weight:700;font-size:0.875rem;">My Profile</div>
                <div style="font-size:0.78rem;color:var(--t3);">Edit public profile</div>
              </a>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div>
          <!-- Notifications / Activity Feed -->
          <div class="card" style="padding:0;margin-bottom:20px;overflow:hidden;">
            <div style="padding:18px 20px;border-bottom:1px solid var(--hairline);display:flex;align-items:center;justify-content:space-between;">
              <h3 style="font-size:0.9375rem;letter-spacing:-0.01em;">Recent Activity</h3>
              <span class="badge badge-uv">3 new</span>
            </div>
            <div style="padding:4px 0;">
              ${[
                { icon: 'fa-comment-dots', color: 'var(--uv-bright)', bg: 'rgba(139,92,246,0.12)', text: '<strong>Lena Moore</strong> sent you a message', sub: '2 hours ago', dot: 'var(--uv)' },
                { icon: 'fa-check-circle', color: 'var(--ok)', bg: 'rgba(16,185,129,0.1)', text: '<strong>Nova Cruz</strong> accepted your collab request', sub: '5 hours ago', dot: 'var(--ok)' },
                { icon: 'fa-file-audio', color: 'var(--ember)', bg: 'rgba(245,158,11,0.1)', text: 'New stems uploaded to <strong>Record #4</strong>', sub: '1 day ago', dot: 'var(--ember)' },
                { icon: 'fa-star', color: 'var(--arc)', bg: 'rgba(34,211,238,0.1)', text: 'You received a <strong>5-star review</strong>', sub: '2 days ago', dot: 'var(--arc)' },
                { icon: 'fa-dollar-sign', color: 'var(--ok)', bg: 'rgba(16,185,129,0.1)', text: 'Payment of <strong>$320</strong> released to you', sub: '3 days ago', dot: 'var(--ok)' },
              ].map(a => `
              <div class="activity-item" style="padding:12px 20px;">
                <div style="width:32px;height:32px;border-radius:var(--r-sm);background:${a.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <i class="fas ${a.icon}" style="color:${a.color};font-size:0.8125rem;"></i>
                </div>
                <div style="flex:1;min-width:0;">
                  <div style="font-size:0.8125rem;line-height:1.4;">${a.text}</div>
                  <div style="font-size:0.75rem;color:var(--t4);margin-top:3px;">${a.sub}</div>
                </div>
              </div>`).join('')}
            </div>
          </div>

          <!-- Profile Completion -->
          <div class="card" style="padding:20px;margin-bottom:20px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
              <h3 style="font-size:0.9375rem;letter-spacing:-0.01em;">Profile Strength</h3>
              <span style="font-size:0.8125rem;font-weight:700;color:var(--ok);">82%</span>
            </div>
            <div class="progress" style="height:6px;margin-bottom:16px;">
              <div class="progress-fill" style="width:82%;background:linear-gradient(90deg,var(--ok),#34d399);"></div>
            </div>
            ${[
              { done: true, text: 'Profile photo uploaded' },
              { done: true, text: 'Bio & genre added' },
              { done: true, text: 'Social links connected' },
              { done: true, text: 'First listing created' },
              { done: false, text: 'Add a voice sample' },
              { done: false, text: 'Verify your account' },
            ].map(item => `
            <div style="display:flex;align-items:center;gap:10px;padding:5px 0;font-size:0.8125rem;color:${item.done ? 'var(--t2)' : 'var(--t3)'};">
              <i class="fas ${item.done ? 'fa-check-circle' : 'fa-circle'}" style="font-size:0.75rem;color:${item.done ? 'var(--ok)' : 'var(--rim)'}"></i>
              ${item.text}
            </div>`).join('')}
          </div>

          <!-- Upcoming Deadlines -->
          <div class="card" style="padding:20px;">
            <h3 style="font-size:0.9375rem;letter-spacing:-0.01em;margin-bottom:16px;">Upcoming Deadlines</h3>
            ${projects.slice(0,3).map(p => {
              const other = getUserById(p.sellerId === demoUser.id ? p.buyerId : p.sellerId);
              return `
            <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
              <img src="${other?.profileImage}" class="av av-sm" alt="${other?.artistName}">
              <div style="flex:1;min-width:0;">
                <div style="font-size:0.8125rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.title}</div>
                <div style="font-size:0.75rem;color:var(--t4);">Due ${p.dueDate}</div>
              </div>
              <span class="badge badge-muted" style="font-size:0.69rem;">${p.package}</span>
            </div>`;
            }).join('')}
          </div>
        </div>
      </div>

    </div>
  </main>
</div>
<style>
@media (max-width:1100px){.dash-cols{grid-template-columns:1fr !important;}}
</style>
` + closeShell();
}

// ─── Projects Page ────────────────────────────────────────────────────────────
export function projectsPage(): string {
  const userProjects = projects.filter(p => p.buyerId === demoUser.id || p.sellerId === demoUser.id);

  return shell('Projects', `
    .dash-page { padding: 32px 40px; max-width: 1200px; }
    .proj-table-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 120px;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      transition: background 0.12s;
    }
    .proj-table-row:hover { background: rgba(255,255,255,0.02); }
    .proj-table-head {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 120px;
      gap: 16px;
      padding: 10px 20px;
      border-bottom: 1px solid var(--hairline);
    }
    .filter-tabs { display: flex; gap: 4px; background: var(--raised); border-radius: var(--r); padding: 4px; border: 1px solid var(--hairline); }
    .filter-tab { padding: 6px 16px; border-radius: var(--r-sm); font-size: 0.8125rem; font-weight: 600; cursor: pointer; transition: all 0.15s; color: var(--t3); border: none; background: none; }
    .filter-tab.active { background: var(--elevated); color: var(--t1); }
    @media (max-width: 1024px) {
      .dash-page { padding: 24px 20px; }
      .proj-table-row, .proj-table-head { grid-template-columns: 1fr; }
    }
  `) + authedNav('projects') + `
<div class="app-shell">
  ${appSidebar('projects')}
  <main class="app-main">
    <div class="dash-page">

      <!-- Header -->
      <div style="margin-bottom:28px;display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:16px;">
        <div>
          <div class="label" style="margin-bottom:6px;color:var(--uv-bright);">Collaboration Hub</div>
          <h1 style="font-size:clamp(1.4rem,2.5vw,1.875rem);letter-spacing:-0.025em;">My Projects</h1>
          <p class="body-base" style="margin-top:6px;">${userProjects.length} total projects · ${userProjects.filter(p=>!['completed','cancelled'].includes(p.status)).length} active</p>
        </div>
        <a href="/explore" class="btn btn-primary">
          <i class="fas fa-plus"></i> Start New Project
        </a>
      </div>

      <!-- Filter Tabs -->
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:24px;">
        <div class="filter-tabs">
          <button class="filter-tab active">All</button>
          <button class="filter-tab">Active</button>
          <button class="filter-tab">Delivered</button>
          <button class="filter-tab">Completed</button>
          <button class="filter-tab">Cancelled</button>
        </div>
        <div style="display:flex;gap:10px;">
          <div style="position:relative;">
            <i class="fas fa-search" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--t4);font-size:12px;"></i>
            <input class="field-input" placeholder="Search projects..." style="padding-left:36px;font-size:0.8125rem;padding-top:8px;padding-bottom:8px;width:200px;">
          </div>
          <select class="field-select" style="width:160px;padding:8px 32px 8px 14px;font-size:0.8125rem;">
            <option>Sort: Newest</option>
            <option>Sort: Due Date</option>
            <option>Sort: Value</option>
          </select>
        </div>
      </div>

      <!-- Projects Table -->
      <div style="background:var(--surface);border:1px solid var(--hairline);border-radius:var(--r-lg);overflow:hidden;">
        <div class="proj-table-head">
          <div class="label">Project</div>
          <div class="label">Status</div>
          <div class="label">Due Date</div>
          <div class="label">Value</div>
          <div class="label" style="text-align:right;">Actions</div>
        </div>
        ${userProjects.map(proj => {
          const buyer = getUserById(proj.buyerId);
          const seller = getUserById(proj.sellerId);
          const other = proj.sellerId === demoUser.id ? buyer : seller;
          const sC = statusColor(proj.status);
          const role = proj.sellerId === demoUser.id ? 'Delivering' : 'Ordered';
          return `
        <div class="proj-table-row">
          <div style="display:flex;align-items:center;gap:12px;min-width:0;">
            <img src="${other?.profileImage}" class="av av-md" style="border:1.5px solid rgba(255,255,255,0.08);" alt="${other?.artistName}">
            <div style="min-width:0;">
              <div style="font-weight:700;font-size:0.9rem;letter-spacing:-0.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${proj.title}</div>
              <div style="font-size:0.78rem;color:var(--t3);margin-top:2px;">with ${other?.artistName} · 
                <span style="color:${role==='Delivering'?'var(--uv-bright)':'var(--ember)'};">${role}</span>
              </div>
            </div>
          </div>
          <div>
            <span class="badge" style="background:${sC}22;color:${sC};border-color:${sC}44;">
              ${statusLabel(proj.status)}
            </span>
          </div>
          <div style="font-size:0.875rem;font-weight:600;">${proj.dueDate}</div>
          <div style="font-size:0.9375rem;font-weight:800;letter-spacing:-0.02em;color:var(--t1);">${formatPrice(proj.orderTotal)}</div>
          <div style="display:flex;gap:6px;justify-content:flex-end;">
            <a href="/workspace/${proj.id}" class="btn btn-primary btn-xs">Open</a>
            <a href="/dashboard/messages" class="btn btn-secondary btn-xs"><i class="fas fa-comment-dots"></i></a>
          </div>
        </div>`;
        }).join('')}
      </div>

    </div>
  </main>
</div>
` + closeShell();
}

// ─── Workspace ────────────────────────────────────────────────────────────────
export function workspacePage(project: any): string {
  const buyer = getUserById(project.buyerId);
  const seller = getUserById(project.sellerId);
  const other = project.sellerId === demoUser.id ? buyer : seller;
  const sC = statusColor(project.status);
  const pct = project.status === 'completed' ? 100 : project.status === 'delivered' ? 85 : project.status === 'in_progress' ? 60 : 40;

  const messages = project.messages ?? [];
  const files = project.files ?? [];

  const fileIcon = (type: string) => {
    if (type.includes('audio')) return 'fa-file-audio';
    if (type.includes('image')) return 'fa-file-image';
    if (type.includes('zip')) return 'fa-file-archive';
    return 'fa-file';
  };

  return shell(`Workspace — ${project.title}`, `
    .ws-layout { display: grid; grid-template-columns: 1fr 340px; height: calc(100vh - 64px); overflow: hidden; }
    .ws-main { overflow-y: auto; }
    .ws-side { background: var(--ink); border-left: 1px solid var(--hairline); overflow-y: auto; display: flex; flex-direction: column; }
    .ws-section-head {
      padding: 14px 20px;
      border-bottom: 1px solid var(--hairline);
      font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--t4);
      display: flex; align-items: center; justify-content: space-between;
    }
    .ws-tabs { display: flex; border-bottom: 1px solid var(--hairline); background: var(--surface); }
    .ws-tab { padding: 13px 20px; font-size: 0.875rem; font-weight: 600; color: var(--t3); cursor: pointer; border-bottom: 2px solid transparent; transition: color 0.15s, border-color 0.15s; }
    .ws-tab.active { color: var(--t1); border-bottom-color: var(--uv); }
    .ws-tab:hover:not(.active) { color: var(--t2); }
    .file-row {
      display: flex; align-items: center; gap: 12px; padding: 12px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      transition: background 0.12s; cursor: pointer;
    }
    .file-row:hover { background: rgba(255,255,255,0.02); }
    .file-icon { width: 36px; height: 36px; border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; font-size: 0.875rem; flex-shrink: 0; }
    .msg-bubble { padding: 10px 14px; border-radius: 14px; font-size: 0.875rem; line-height: 1.5; max-width: 75%; }
    .msg-sent { background: var(--uv); color: white; border-bottom-right-radius: 4px; margin-left: auto; }
    .msg-recv { background: var(--elevated); color: var(--t1); border-bottom-left-radius: 4px; }
    .activity-log { font-size: 0.8125rem; color: var(--t3); padding: 10px 20px; border-bottom: 1px solid rgba(255,255,255,0.04); display: flex; align-items: flex-start; gap: 10px; }
    @media (max-width: 900px) {
      .ws-layout { grid-template-columns: 1fr; }
      .ws-side { display: none; }
    }
  `) + authedNav('projects') + `
<div class="ws-layout">
  <!-- Main Panel -->
  <div class="ws-main">
    <!-- Top Bar -->
    <div style="padding:16px 24px;background:var(--surface);border-bottom:1px solid var(--hairline);display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
      <a href="/dashboard/projects" style="color:var(--t3);transition:color 0.15s;" onmouseover="this.style.color='var(--t1)'" onmouseout="this.style.color='var(--t3)'">
        <i class="fas fa-arrow-left"></i>
      </a>
      <div style="flex:1;min-width:0;">
        <div style="font-weight:800;font-size:1.125rem;letter-spacing:-0.02em;">${project.title}</div>
        <div style="font-size:0.78rem;color:var(--t3);margin-top:2px;">
          <span>with ${other?.artistName}</span>
          <span style="margin:0 6px;color:var(--rim);">·</span>
          <span>${project.package} Package</span>
          <span style="margin:0 6px;color:var(--rim);">·</span>
          <span>Due ${project.dueDate}</span>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <span class="badge" style="background:${sC}22;color:${sC};border-color:${sC}44;">${statusLabel(project.status)}</span>
        <span style="font-size:1rem;font-weight:800;color:var(--t1);">${formatPrice(project.orderTotal)}</span>
        <button class="btn btn-primary btn-sm" onclick="alert('Delivery submitted!')">
          <i class="fas fa-upload"></i> Submit Delivery
        </button>
      </div>
    </div>

    <!-- Progress Bar -->
    <div style="height:3px;background:var(--rim);">
      <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,${sC},${sC}cc);transition:width 0.5s;"></div>
    </div>

    <!-- Tabs -->
    <div class="ws-tabs">
      <div class="ws-tab active" onclick="switchTab('messages',this)"><i class="fas fa-comment-dots" style="margin-right:6px;font-size:12px;"></i>Messages</div>
      <div class="ws-tab" onclick="switchTab('files',this)"><i class="fas fa-folder-open" style="margin-right:6px;font-size:12px;"></i>Files & Stems</div>
      <div class="ws-tab" onclick="switchTab('activity',this)"><i class="fas fa-clock-rotate-left" style="margin-right:6px;font-size:12px;"></i>Activity</div>
    </div>

    <!-- Messages Tab -->
    <div id="tab-messages" style="display:flex;flex-direction:column;height:calc(100vh - 64px - 52px - 3px - 44px);">
      <div style="flex:1;overflow-y:auto;padding:24px;" id="chat-scroll">
        <!-- Date divider -->
        <div style="text-align:center;margin-bottom:20px;">
          <span style="font-size:0.75rem;color:var(--t4);background:var(--rim);padding:4px 12px;border-radius:var(--r-full);">Today</span>
        </div>
        ${messages.slice(0, 6).map((msg: any) => {
          const isMe = msg.senderId === demoUser.id;
          const sender = getUserById(msg.senderId);
          return `
        <div style="display:flex;flex-direction:column;align-items:${isMe ? 'flex-end' : 'flex-start'};margin-bottom:16px;gap:6px;">
          ${!isMe ? `<div style="display:flex;align-items:center;gap:8px;">
            <img src="${sender?.profileImage}" class="av av-xs" alt="${sender?.artistName}">
            <span style="font-size:0.75rem;font-weight:700;color:var(--t3);">${sender?.artistName}</span>
            <span style="font-size:0.75rem;color:var(--t4);">${msg.timestamp}</span>
          </div>` : `<span style="font-size:0.75rem;color:var(--t4);">${msg.timestamp}</span>`}
          <div class="msg-bubble ${isMe ? 'msg-sent' : 'msg-recv'}">${msg.content}</div>
        </div>`;
        }).join('')}
        ${messages.length === 0 ? `
        <div style="text-align:center;padding:48px 24px;color:var(--t4);">
          <i class="fas fa-comment-dots" style="font-size:2rem;display:block;margin-bottom:12px;"></i>
          <p style="font-size:0.875rem;">No messages yet. Start the conversation.</p>
        </div>` : ''}
      </div>
      <!-- Message Input -->
      <div style="padding:16px 24px;background:var(--surface);border-top:1px solid var(--hairline);">
        <div style="display:flex;gap:10px;align-items:flex-end;">
          <div style="flex:1;background:var(--elevated);border:1px solid var(--hairline);border-radius:var(--r-md);padding:10px 14px;min-height:44px;transition:border-color 0.18s;" contenteditable="true" style="outline:none;font-size:0.875rem;" onfocus="this.parentElement.style.borderColor='var(--uv)'" onblur="this.parentElement.style.borderColor='var(--hairline)'" placeholder="Type a message..." id="msg-input">
          </div>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-secondary btn-sm" title="Attach file"><i class="fas fa-paperclip"></i></button>
            <button class="btn btn-primary btn-sm" onclick="sendMessage()"><i class="fas fa-paper-plane"></i></button>
          </div>
        </div>
        <div style="font-size:0.75rem;color:var(--t4);margin-top:8px;">
          <i class="fas fa-lock" style="font-size:10px;"></i> End-to-end encrypted · files shared here are private
        </div>
      </div>
    </div>

    <!-- Files Tab -->
    <div id="tab-files" style="display:none;padding:24px;">
      <!-- Upload Zone -->
      <div style="border:2px dashed var(--rim);border-radius:var(--r-lg);padding:32px;text-align:center;margin-bottom:24px;background:rgba(139,92,246,0.03);cursor:pointer;transition:all 0.2s;" onmouseover="this.style.borderColor='rgba(139,92,246,0.5)';this.style.background='rgba(139,92,246,0.06)'" onmouseout="this.style.borderColor='var(--rim)';this.style.background='rgba(139,92,246,0.03)'" onclick="document.getElementById('file-input').click()">
        <div style="width:52px;height:52px;background:var(--uv-dim);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;">
          <i class="fas fa-cloud-arrow-up" style="font-size:1.25rem;color:var(--uv-bright);"></i>
        </div>
        <div style="font-weight:700;font-size:0.9375rem;margin-bottom:6px;">Drop stems, WAVs, or project files</div>
        <div style="font-size:0.8125rem;color:var(--t3);">Supports .wav, .mp3, .aif, .zip, .pdf up to 2GB</div>
        <input type="file" id="file-input" style="display:none;" multiple accept=".wav,.mp3,.aif,.zip,.pdf">
      </div>

      <!-- Files List -->
      <div style="background:var(--surface);border:1px solid var(--hairline);border-radius:var(--r-lg);overflow:hidden;">
        <div class="ws-section-head">
          <span>Project Files (${files.length})</span>
          <span style="color:var(--t4);">VERSION HISTORY</span>
        </div>
        ${files.length === 0 ? `
        <div style="padding:40px;text-align:center;color:var(--t4);">
          <i class="fas fa-folder-open" style="font-size:2rem;display:block;margin-bottom:12px;color:var(--rim);"></i>
          <p style="font-size:0.875rem;">No files yet. Upload your first stem.</p>
        </div>` : files.map((f: any) => `
        <div class="file-row">
          <div class="file-icon" style="background:rgba(139,92,246,0.12);color:var(--uv-bright);">
            <i class="fas ${fileIcon(f.type)}"></i>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:700;font-size:0.875rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${f.name}</div>
            <div style="font-size:0.75rem;color:var(--t3);">v${f.version} · ${f.size} · ${f.uploadedAt}</div>
          </div>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-secondary btn-xs"><i class="fas fa-eye"></i></button>
            <button class="btn btn-secondary btn-xs"><i class="fas fa-download"></i></button>
          </div>
        </div>`).join('')}
      </div>
    </div>

    <!-- Activity Tab -->
    <div id="tab-activity" style="display:none;padding:24px;">
      <div style="background:var(--surface);border:1px solid var(--hairline);border-radius:var(--r-lg);overflow:hidden;">
        <div class="ws-section-head">Activity Log</div>
        ${(project.activity ?? []).slice(0, 10).map((a: any) => `
        <div class="activity-log">
          <div style="width:24px;height:24px;border-radius:50%;background:rgba(139,92,246,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="fas fa-circle-dot" style="font-size:8px;color:var(--uv-bright);"></i>
          </div>
          <div>
            <span>${a.text || 'Project updated'}</span>
            <span style="font-size:0.75rem;color:var(--t4);display:block;margin-top:2px;">${a.time || 'Recently'}</span>
          </div>
        </div>`).join('')}
        ${(project.activity ?? []).length === 0 ? `
        <div style="padding:32px;text-align:center;color:var(--t4);">
          <p style="font-size:0.875rem;">Activity will appear here as the project progresses.</p>
        </div>` : ''}
      </div>
    </div>
  </div>

  <!-- Right Sidebar -->
  <div class="ws-side">
    <!-- Project Info -->
    <div class="ws-section-head">Project Details</div>
    <div style="padding:16px 20px;border-bottom:1px solid var(--hairline);">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        <img src="${other?.profileImage}" class="av av-md" style="border:2px solid rgba(139,92,246,0.4);" alt="${other?.artistName}">
        <div>
          <div style="font-weight:700;font-size:0.9375rem;">${other?.artistName}</div>
          <div style="font-size:0.78rem;color:var(--t3);">${other?.genre?.[0] ?? 'Artist'}</div>
        </div>
        <a href="/artist/${other?.id}" class="btn btn-secondary btn-xs" style="margin-left:auto;">Profile</a>
      </div>
      ${[
        ['Package', project.package],
        ['Value', formatPrice(project.orderTotal)],
        ['Started', project.createdAt],
        ['Due', project.dueDate],
        ['Platform Fee', formatPrice(project.platformFee)],
        ['Your Payout', formatPrice(project.payoutAmount)],
      ].map(([k, v]) => `
      <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:0.8125rem;">
        <span style="color:var(--t3);">${k}</span>
        <span style="font-weight:600;">${v}</span>
      </div>`).join('')}
    </div>

    <!-- Progress -->
    <div style="padding:16px 20px;border-bottom:1px solid var(--hairline);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <span style="font-size:0.78rem;font-weight:700;color:var(--t3);letter-spacing:0.06em;text-transform:uppercase;">Progress</span>
        <span style="font-size:0.875rem;font-weight:700;color:var(--uv-bright);">${pct}%</span>
      </div>
      <div class="progress" style="height:6px;margin-bottom:12px;">
        <div class="progress-fill" style="width:${pct}%;background:linear-gradient(90deg,${sC},${sC}cc);"></div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        ${[
          {label:'Order Placed', done: true},
          {label:'In Progress', done: project.status !== 'pending'},
          {label:'Delivered', done: ['delivered','revision_requested','completed'].includes(project.status)},
          {label:'Completed', done: project.status === 'completed'},
        ].map(s => `
        <div style="display:flex;align-items:center;gap:5px;font-size:0.75rem;color:${s.done?'var(--t2)':'var(--t4)'};">
          <i class="fas ${s.done?'fa-check-circle':'fa-circle'}" style="font-size:10px;color:${s.done?'var(--ok)':'var(--rim)'};"></i>
          ${s.label}
        </div>`).join('')}
      </div>
    </div>

    <!-- Payment Escrow -->
    <div style="padding:16px 20px;border-bottom:1px solid var(--hairline);">
      <div class="ws-section-head" style="padding:0 0 10px;border-bottom:none;">Payment Escrow</div>
      <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:var(--r);padding:12px;font-size:0.8125rem;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          <i class="fas fa-shield-halved" style="color:var(--ok);"></i>
          <span style="font-weight:700;color:var(--ok);">Payment Protected</span>
        </div>
        <p style="color:var(--t3);line-height:1.5;">
          ${formatPrice(project.orderTotal)} held securely in escrow. Released to artist upon delivery approval.
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div style="padding:16px 20px;display:flex;flex-direction:column;gap:8px;">
      <button class="btn btn-primary w-full" style="justify-content:center;" onclick="alert('Delivery submitted for review!')">
        <i class="fas fa-check-circle"></i> Approve Delivery
      </button>
      <button class="btn btn-secondary w-full" style="justify-content:center;" onclick="alert('Revision requested')">
        <i class="fas fa-rotate-left"></i> Request Revision
      </button>
      <button class="btn btn-ghost w-full btn-sm" style="justify-content:center;color:var(--err);" onclick="alert('Dispute opened')">
        <i class="fas fa-flag"></i> Open Dispute
      </button>
    </div>
  </div>
</div>

<script>
function switchTab(name, el) {
  ['messages','files','activity'].forEach(t => {
    document.getElementById('tab-'+t).style.display = t === name ? 'flex' : 'none';
    if (t === 'files' || t === 'activity') document.getElementById('tab-'+t).style.display = t === name ? 'block' : 'none';
  });
  document.querySelectorAll('.ws-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}
function sendMessage() {
  const inp = document.getElementById('msg-input');
  const text = inp.innerText.trim();
  if (!text) return;
  const scroll = document.getElementById('chat-scroll');
  const bubble = document.createElement('div');
  bubble.style.cssText = 'display:flex;flex-direction:column;align-items:flex-end;margin-bottom:16px;gap:6px;';
  bubble.innerHTML = '<span style="font-size:0.75rem;color:var(--t4);">Just now</span><div class="msg-bubble msg-sent">'+text+'</div>';
  scroll.appendChild(bubble);
  scroll.scrollTop = scroll.scrollHeight;
  inp.innerText = '';
}
</script>
` + closeShell();
}
