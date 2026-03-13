import { shell, closeShell, authedNav, appSidebar } from '../layout';
import { users, projects, listings, getUserById, statusColor, statusLabel, formatPrice } from '../data';

const demoUser = users[0];

// ─── Shared dashboard wrapper styles ─────────────────────────────────────────
const DASH_STYLES = `
  .app-page { padding: 32px 36px; max-width: 1200px; }

  /* Section label */
  .sec-label {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  .sec-label-bar { height: 1px; width: 20px; background: var(--signal); box-shadow: 0 0 6px var(--signal-glow); }
  .sec-label-text {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--signal);
  }

  /* Stat tiles */
  .stat-tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 36px; }
  .stat-tile {
    background: var(--c-panel);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    padding: 22px;
    position: relative;
    overflow: hidden;
    transition: border-color var(--t-base), transform var(--t-base);
  }
  .stat-tile:hover { border-color: rgba(255,255,255,0.1); transform: translateY(-2px); }
  .stat-tile-bar {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
  }
  .stat-tile-icon {
    width: 36px; height: 36px;
    border-radius: var(--r-sm);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.875rem;
    margin-bottom: 14px;
  }
  .stat-tile-val {
    font-family: var(--font-display);
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 5px;
  }
  .stat-tile-lbl {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--t4);
  }
  .stat-tile-sub {
    font-size: 0.75rem;
    color: var(--t4);
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* Project rows */
  .proj-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    border-radius: var(--r-md);
    background: var(--c-raised);
    border: 1px solid var(--c-wire);
    cursor: pointer;
    transition: border-color var(--t-fast), background var(--t-fast);
  }
  .proj-row:hover { border-color: rgba(255,255,255,0.1); background: var(--c-lift); }

  /* Quick-action grid */
  .quick-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .quick-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 20px 12px;
    background: var(--c-raised);
    border: 1px solid var(--c-wire);
    border-radius: var(--r-lg);
    cursor: pointer;
    transition: all var(--t-fast);
    text-decoration: none;
    color: var(--t1);
    text-align: center;
    font-family: var(--font-body);
  }
  .quick-btn:hover {
    border-color: var(--signal);
    background: var(--signal-dim);
  }
  .quick-btn:hover .quick-icon { color: var(--signal); }
  .quick-icon { font-size: 1.125rem; color: var(--t3); transition: color var(--t-fast); }

  /* Feed items */
  .feed-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 0;
    border-bottom: 1px solid var(--c-wire);
  }
  .feed-item:last-child { border-bottom: none; }

  /* Profile strength meter */
  .strength-bar { height: 4px; background: var(--c-rim); border-radius: 2px; overflow: hidden; margin: 8px 0 4px; }
  .strength-fill { height: 100%; border-radius: 2px; background: var(--signal); transition: width 0.6s var(--ease); }

  /* Earnings chart bars */
  .earn-chart { display: flex; align-items: flex-end; gap: 5px; height: 80px; }
  .earn-bar { flex: 1; border-radius: 2px 2px 0 0; min-width: 0; transition: opacity var(--t-fast); }
  .earn-bar:hover { opacity: 0.8; }

  @media (max-width: 1024px) { .stat-tiles { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 768px) {
    .app-page { padding: 20px 16px; }
    .stat-tiles { grid-template-columns: 1fr 1fr; }
    .quick-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD HOME
// ─────────────────────────────────────────────────────────────────────────────
export function dashboardPage(): string {
  const userProjects = projects.filter(p => p.buyerId === demoUser.id || p.sellerId === demoUser.id);
  const activeProjects = userProjects.filter(p => !['completed', 'cancelled'].includes(p.status));
  const completedCount = userProjects.filter(p => p.status === 'completed').length;
  const totalEarnings = 4820;

  const earningMonths = [820, 1200, 680, 1540, 980, 1480, 4820];
  const maxEarn = Math.max(...earningMonths);

  return shell('Dashboard', DASH_STYLES) + authedNav('home') + `
<div class="app-shell">
  ${appSidebar('home')}
  <main class="app-main">
    <div class="app-page">

      <!-- Greeting -->
      <div style="margin-bottom:28px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          <div class="node node-ok"></div>
          <span class="mono-sm" style="color:var(--s-ok);">SESSION ACTIVE</span>
        </div>
        <h1 style="font-family:var(--font-display);font-size:1.75rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:4px;">Good evening, ${demoUser.artistName} ↗</h1>
        <p class="body-sm">You have ${activeProjects.length} active project${activeProjects.length !== 1 ? 's' : ''} in progress.</p>
      </div>

      <!-- Stat tiles (the signal path motif: left strip = active color) -->
      <div class="stat-tiles">
        ${[
          { color:'var(--signal)', icon:'fa-layer-group', val: activeProjects.length.toString(), lbl:'Active Projects', sub:'+2 this month', upColor:'var(--signal)' },
          { color:'var(--s-ok)', icon:'fa-dollar-sign', val:`$${totalEarnings.toLocaleString()}`, lbl:'Total Earnings', sub:'+$1,480 last month', upColor:'var(--s-ok)' },
          { color:'var(--patch)', icon:'fa-check-circle', val: completedCount.toString(), lbl:'Completed', sub:'3 awaiting review', upColor:'var(--patch)' },
          { color:'var(--warm)', icon:'fa-star', val:`${demoUser.rating.toFixed(1)}`, lbl:'Avg Rating', sub:`${demoUser.reviewCount} reviews`, upColor:'var(--warm)' },
        ].map(s => `
        <div class="stat-tile">
          <div class="stat-tile-bar" style="background:${s.color};"></div>
          <div class="stat-tile-icon" style="background:${s.color}15;">
            <i class="fas ${s.icon}" style="color:${s.color};"></i>
          </div>
          <div class="stat-tile-val" style="color:${s.color};">${s.val}</div>
          <div class="stat-tile-lbl">${s.lbl}</div>
          <div class="stat-tile-sub"><i class="fas fa-arrow-up" style="font-size:9px;color:${s.upColor};"></i><span>${s.sub}</span></div>
        </div>`).join('')}
      </div>

      <!-- Two columns: projects + activity -->
      <div style="display:grid;grid-template-columns:1fr 320px;gap:24px;margin-bottom:28px;">

        <!-- Active projects -->
        <div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
            <div class="sec-label" style="margin-bottom:0;">
              <div class="sec-label-bar"></div>
              <span class="sec-label-text">Active Projects</span>
            </div>
            <a href="/dashboard/projects" class="btn btn-ghost btn-xs" style="color:var(--t3);">View All <i class="fas fa-arrow-right" style="font-size:10px;margin-left:4px;"></i></a>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${activeProjects.slice(0, 4).map(p => {
              const counterpart = getUserById(p.buyerId === demoUser.id ? p.sellerId : p.buyerId);
              const sc = statusColor(p.status);
              const sl = statusLabel(p.status);
              const progressMap: Record<string,number> = { pending:0, in_progress:45, awaiting_delivery:70, delivered:85, revision_requested:60, completed:100 };
              const prog = progressMap[p.status] || 30;
              return `
            <div class="proj-row" data-href="/workspace/${p.id}">
              <img src="${counterpart?.profileImage}" class="av av-sm" style="border:1.5px solid var(--c-rim);flex-shrink:0;" alt="${counterpart?.artistName}">
              <div style="flex:1;min-width:0;">
                <div style="font-size:0.875rem;font-weight:700;letter-spacing:-0.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.title}</div>
                <div style="font-size:0.75rem;color:var(--t4);margin-top:2px;">${counterpart?.artistName} · ${p.selectedPackage || p.package || "Standard"}</div>
                <div style="margin-top:8px;height:3px;background:var(--c-rim);border-radius:2px;overflow:hidden;">
                  <div style="height:100%;width:${prog}%;background:${sc};border-radius:2px;transition:width 0.6s ease;"></div>
                </div>
              </div>
              <div style="text-align:right;flex-shrink:0;">
                <span class="badge" style="background:${sc}18;color:${sc};border:1px solid ${sc}33;font-family:var(--font-mono);">${sl}</span>
                <div class="mono-sm" style="color:var(--t4);margin-top:6px;">${formatPrice(p.orderTotal)}</div>
              </div>
            </div>`;}).join('')}
          </div>
        </div>

        <!-- Earnings mini-chart + activity -->
        <div style="display:flex;flex-direction:column;gap:16px;">

          <!-- Earnings card -->
          <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);padding:20px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
              <div>
                <div class="mono-sm" style="color:var(--t4);">THIS MONTH</div>
                <div style="font-family:var(--font-display);font-size:1.5rem;font-weight:800;letter-spacing:-0.04em;color:var(--s-ok);">$${earningMonths[earningMonths.length-1].toLocaleString()}</div>
              </div>
              <a href="/dashboard/earnings" class="btn btn-ghost btn-xs" style="color:var(--t4);">Details</a>
            </div>
            <div class="earn-chart">
              ${earningMonths.map((v,i) => {
                const h = Math.round((v / maxEarn) * 100);
                const isLast = i === earningMonths.length - 1;
                return `<div class="earn-bar" style="height:${h}%;background:${isLast ? 'var(--signal)' : 'var(--c-rim)'};"></div>`;
              }).join('')}
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:4px;">
              ${['J','F','M','A','M','J','J'].map(m => `<span class="mono-sm" style="color:var(--t4);flex:1;text-align:center;">${m}</span>`).join('')}
            </div>
          </div>

          <!-- Profile strength -->
          <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);padding:20px;">
            <div class="mono-sm" style="color:var(--t4);margin-bottom:4px;">PROFILE STRENGTH</div>
            <div style="font-size:0.875rem;font-weight:700;margin-bottom:2px;">72% complete</div>
            <div class="strength-bar"><div class="strength-fill" style="width:72%;"></div></div>
            <div class="mono-sm" style="color:var(--t4);">Add cover image to reach 85%</div>
          </div>
        </div>
      </div>

      <!-- Quick actions -->
      <div style="margin-bottom:28px;">
        <div class="sec-label">
          <div class="sec-label-bar"></div>
          <span class="sec-label-text">Quick Actions</span>
        </div>
        <div class="quick-grid">
          ${[
            { href:'/explore', icon:'fa-compass', label:'Find Artists' },
            { href:'/dashboard/listings', icon:'fa-list-ul', label:'My Services' },
            { href:'/dashboard/messages', icon:'fa-comment-dots', label:'Messages', badge:'3' },
            { href:'/dashboard/earnings', icon:'fa-dollar-sign', label:'Earnings' },
          ].map(q => `
          <a href="${q.href}" class="quick-btn">
            <div style="position:relative;">
              <i class="fas ${q.icon} quick-icon"></i>
              ${q.badge ? `<span style="position:absolute;top:-6px;right:-10px;background:var(--signal);color:#000;border-radius:var(--r-full);padding:1px 5px;font-size:0.6rem;font-weight:700;font-family:var(--font-mono);">${q.badge}</span>` : ''}
            </div>
            <span style="font-size:0.8125rem;font-weight:600;">${q.label}</span>
          </a>`).join('')}
        </div>
      </div>

    </div>
  </main>
</div>
${closeShell()}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────────────────────────────
export function projectsPage(): string {
  const userProjects = projects.filter(p => p.buyerId === demoUser.id || p.sellerId === demoUser.id);
  const active = userProjects.filter(p => !['completed','cancelled'].includes(p.status));
  const completed = userProjects.filter(p => p.status === 'completed');

  return shell('Projects', DASH_STYLES) + authedNav('projects') + `
<div class="app-shell">
  ${appSidebar('projects')}
  <main class="app-main">
    <div class="app-page">

      <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:28px;flex-wrap:wrap;gap:12px;">
        <div>
          <h1 style="font-family:var(--font-display);font-size:1.5rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:4px;">Projects</h1>
          <p class="body-sm">${active.length} active · ${completed.length} completed</p>
        </div>
        <a href="/explore" class="btn btn-primary btn-sm">
          <i class="fas fa-plus" style="font-size:11px;"></i>
          New Project
        </a>
      </div>

      <!-- Filter tabs -->
      <div style="display:flex;gap:2px;border-bottom:1px solid var(--c-wire);margin-bottom:24px;">
        ${['All','Active','Completed','Cancelled'].map((t,i) => `<button onclick="filterProjects('${t.toLowerCase()}',this)" style="padding:10px 16px;font-size:0.8125rem;font-weight:500;cursor:pointer;border:none;background:none;font-family:var(--font-body);border-bottom:2px solid ${i===0?'var(--signal)':'transparent'};margin-bottom:-1px;color:${i===0?'var(--t1)':'var(--t3)'};transition:all 0.15s;">${t}</button>`).join('')}
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;" id="projects-list">
        ${userProjects.map(p => {
          const counterpart = getUserById(p.buyerId === demoUser.id ? p.sellerId : p.buyerId);
          const sc = statusColor(p.status);
          const sl = statusLabel(p.status);
          const isActive = !['completed','cancelled'].includes(p.status);
          const progressMap: Record<string,number> = { pending:10, in_progress:45, awaiting_delivery:70, delivered:85, revision_requested:60, completed:100, cancelled:0 };
          const prog = progressMap[p.status] || 20;
          const role = p.sellerId === demoUser.id ? 'SELLER' : 'BUYER';
          const roleColor = role === 'SELLER' ? 'var(--signal)' : 'var(--patch)';

          return `
        <div class="proj-row" data-href="/workspace/${p.id}" data-status="${p.status}" style="border-left:2px solid ${sc};">
          <img src="${counterpart?.profileImage}" class="av av-md" style="border:1.5px solid var(--c-rim);flex-shrink:0;" alt="${counterpart?.artistName}">
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;flex-wrap:wrap;">
              <span style="font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;">${p.title}</span>
              <span class="badge" style="background:${roleColor}15;color:${roleColor};border:1px solid ${roleColor}33;font-family:var(--font-mono);">${role}</span>
            </div>
            <div class="mono-sm" style="color:var(--t4);margin-bottom:8px;">With ${counterpart?.artistName} · ${p.selectedPackage || p.package || "Standard"}</div>
            ${isActive ? `
            <div style="height:3px;background:var(--c-rim);border-radius:2px;overflow:hidden;max-width:360px;">
              <div style="height:100%;width:${prog}%;background:${sc};border-radius:2px;"></div>
            </div>` : ''}
          </div>
          <div style="text-align:right;flex-shrink:0;">
            <div style="margin-bottom:6px;">
              <span class="badge" style="background:${sc}18;color:${sc};border:1px solid ${sc}33;font-family:var(--font-mono);">${sl}</span>
            </div>
            <div style="font-size:0.875rem;font-weight:700;letter-spacing:-0.01em;">${formatPrice(p.orderTotal)}</div>
            <div class="mono-sm" style="color:var(--t4);">Due ${p.dueDate}</div>
          </div>
        </div>`}).join('')}
      </div>

    </div>
  </main>
</div>
<script>
function filterProjects(status, btn) {
  document.querySelectorAll('#projects-list .proj-row').forEach(row => {
    const s = row.dataset.status;
    row.style.display = (status === 'all' || (status === 'active' && !['completed','cancelled'].includes(s)) || s === status) ? '' : 'none';
  });
  document.querySelectorAll('[onclick*=filterProjects]').forEach(b => {
    b.style.borderBottomColor = 'transparent';
    b.style.color = 'var(--t3)';
  });
  btn.style.borderBottomColor = 'var(--signal)';
  btn.style.color = 'var(--t1)';
}
</script>
${closeShell()}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// EARNINGS
// ─────────────────────────────────────────────────────────────────────────────
export function earningsPage(): string {
  const earningMonths = [
    { month:'Jan', amount: 820 },
    { month:'Feb', amount: 1200 },
    { month:'Mar', amount: 680 },
    { month:'Apr', amount: 1540 },
    { month:'May', amount: 980 },
    { month:'Jun', amount: 1480 },
    { month:'Jul', amount: 4820 },
  ];
  const total = earningMonths.reduce((a,b) => a + b.amount, 0);
  const maxEarn = Math.max(...earningMonths.map(m => m.amount));

  const payouts = [
    { date:'Jul 14, 2026', desc:'Hook Feature — Nova Lee', amount:810, status:'paid' },
    { date:'Jul 8, 2026',  desc:'Verse Feature — Marcus X', amount:450, status:'paid' },
    { date:'Jun 28, 2026', desc:'Studio Session — DJ Krome', amount:1200, status:'paid' },
    { date:'Jun 15, 2026', desc:'Promo Package — Aria', amount:540, status:'paid' },
    { date:'May 30, 2026', desc:'Hook Feature — Unknown', amount:650, status:'paid' },
  ];

  return shell('Earnings', DASH_STYLES) + authedNav('earnings') + `
<div class="app-shell">
  ${appSidebar('earnings')}
  <main class="app-main">
    <div class="app-page">

      <h1 style="font-family:var(--font-display);font-size:1.5rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:24px;">Earnings</h1>

      <!-- Stat row -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:32px;">
        ${[
          { label:'Total Earned', val:`$${total.toLocaleString()}`, color:'var(--s-ok)', icon:'fa-dollar-sign' },
          { label:'This Month',   val:'$4,820',                    color:'var(--signal)', icon:'fa-arrow-trend-up' },
          { label:'Pending',      val:'$810',                      color:'var(--warm)',   icon:'fa-clock' },
        ].map(s => `
        <div class="stat-tile">
          <div class="stat-tile-bar" style="background:${s.color};"></div>
          <div class="stat-tile-icon" style="background:${s.color}15;">
            <i class="fas ${s.icon}" style="color:${s.color};"></i>
          </div>
          <div class="stat-tile-val" style="color:${s.color};">${s.val}</div>
          <div class="stat-tile-lbl">${s.label}</div>
        </div>`).join('')}
      </div>

      <!-- Chart -->
      <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);padding:24px;margin-bottom:24px;">
        <div class="sec-label" style="margin-bottom:20px;">
          <div class="sec-label-bar"></div>
          <span class="sec-label-text">Monthly Earnings</span>
        </div>
        <div style="display:flex;align-items:flex-end;gap:8px;height:120px;margin-bottom:8px;">
          ${earningMonths.map((m,i) => {
            const h = Math.round((m.amount / maxEarn) * 100);
            const isLast = i === earningMonths.length - 1;
            return `
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;">
            <span style="font-family:var(--font-mono);font-size:0.6rem;color:var(--t4);">$${m.amount >= 1000 ? (m.amount/1000).toFixed(1)+'K' : m.amount}</span>
            <div style="width:100%;height:${h}%;background:${isLast ? 'var(--signal)' : 'var(--c-rim)'};border-radius:3px 3px 0 0;min-height:4px;${isLast ? 'box-shadow:0 0 12px var(--signal-glow);' : ''}"></div>
          </div>`;}).join('')}
        </div>
        <div style="display:flex;gap:8px;">
          ${earningMonths.map(m => `<div style="flex:1;text-align:center;font-family:var(--font-mono);font-size:0.6rem;color:var(--t4);">${m.month}</div>`).join('')}
        </div>
      </div>

      <!-- Payout history -->
      <div>
        <div class="sec-label">
          <div class="sec-label-bar"></div>
          <span class="sec-label-text">Payout History</span>
        </div>
        <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);overflow:hidden;">
          ${payouts.map((py,i) => `
          <div style="display:flex;align-items:center;gap:14px;padding:14px 20px;${i < payouts.length-1 ? 'border-bottom:1px solid var(--c-wire);' : ''}">
            <div style="width:36px;height:36px;background:rgba(45,202,114,0.1);border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i class="fas fa-arrow-down" style="color:var(--s-ok);font-size:13px;"></i>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:0.875rem;font-weight:600;margin-bottom:2px;">${py.desc}</div>
              <div class="mono-sm" style="color:var(--t4);">${py.date}</div>
            </div>
            <div style="font-size:0.9375rem;font-weight:800;letter-spacing:-0.02em;color:var(--s-ok);">+${formatPrice(py.amount)}</div>
            <span class="badge badge-ok">Paid</span>
          </div>`).join('')}
        </div>
      </div>

    </div>
  </main>
</div>
${closeShell()}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────────────────────────
export function ordersPage(): string {
  const userProjects = projects.filter(p => p.buyerId === demoUser.id || p.sellerId === demoUser.id);

  return shell('Orders', DASH_STYLES) + authedNav() + `
<div class="app-shell">
  ${appSidebar('orders')}
  <main class="app-main">
    <div class="app-page">

      <h1 style="font-family:var(--font-display);font-size:1.5rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:24px;">Orders</h1>

      <div style="overflow:auto;">
        <table class="tbl" style="min-width:700px;">
          <thead>
            <tr>
              <th>Project</th>
              <th>Counterpart</th>
              <th>Package</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${userProjects.map(p => {
              const counterpart = getUserById(p.buyerId === demoUser.id ? p.sellerId : p.buyerId);
              const sc = statusColor(p.status);
              const sl = statusLabel(p.status);
              return `
            <tr>
              <td><div style="font-weight:600;font-size:0.875rem;">${p.title}</div></td>
              <td>
                <div style="display:flex;align-items:center;gap:8px;">
                  <img src="${counterpart?.profileImage}" class="av av-xs" style="border:1px solid var(--c-rim);" alt="${counterpart?.artistName}">
                  <span style="font-size:0.875rem;">${counterpart?.artistName}</span>
                </div>
              </td>
              <td><span class="mono-sm" style="color:var(--t3);">${p.selectedPackage || p.package || "Standard"}</span></td>
              <td><span style="font-weight:700;">${formatPrice(p.orderTotal)}</span></td>
              <td><span class="badge" style="background:${sc}18;color:${sc};border:1px solid ${sc}33;font-family:var(--font-mono);">${sl}</span></td>
              <td class="mono-sm" style="color:var(--t4);">${p.dueDate}</td>
              <td><a href="/workspace/${p.id}" class="btn btn-ghost btn-xs">View</a></td>
            </tr>`;}).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </main>
</div>
${closeShell()}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// LISTINGS
// ─────────────────────────────────────────────────────────────────────────────
export function listingsPage(): string {
  const userListings = listings.filter(l => l.userId === demoUser.id);

  return shell('My Listings', DASH_STYLES) + authedNav() + `
<div class="app-shell">
  ${appSidebar('listings')}
  <main class="app-main">
    <div class="app-page">

      <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
        <div>
          <h1 style="font-family:var(--font-display);font-size:1.5rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:4px;">My Services</h1>
          <p class="body-sm">${userListings.filter(l=>l.active).length} active · ${userListings.filter(l=>!l.active).length} paused</p>
        </div>
        <a href="#" class="btn btn-primary btn-sm" onclick="alert('Create listing — coming soon')">
          <i class="fas fa-plus" style="font-size:11px;"></i>
          Add Service
        </a>
      </div>

      <div style="display:grid;gap:12px;">
        ${userListings.map(l => `
        <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);overflow:hidden;border-left:3px solid ${l.active ? 'var(--signal)' : 'var(--c-rim)'};">
          <div style="padding:16px 20px;display:flex;align-items:flex-start;justify-content:space-between;gap:16px;">
            <div style="flex:1;min-width:0;">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                <h3 style="font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;">${l.title}</h3>
                <span class="badge ${l.active ? 'badge-signal' : 'badge-muted'}">${l.active ? 'Active' : 'Paused'}</span>
              </div>
              <div style="font-size:0.8125rem;color:var(--t3);margin-bottom:8px;">${l.category}</div>
              <div style="display:flex;gap:16px;flex-wrap:wrap;">
                ${[
                  { icon:'fa-eye', val:`${l.orders || 0} orders` },
                  { icon:'fa-star', val:`${demoUser.rating.toFixed(1)} rating` },
                  { icon:'fa-dollar-sign', val:`from ${formatPrice(l.packages[0]?.price || 0)}` },
                ].map(s => `
                <div style="display:flex;align-items:center;gap:5px;font-size:0.75rem;color:var(--t4);">
                  <i class="fas ${s.icon}" style="font-size:10px;"></i>${s.val}
                </div>`).join('')}
              </div>
            </div>
            <div style="display:flex;gap:6px;flex-shrink:0;">
              <button class="btn btn-secondary btn-xs" onclick="alert('Edit coming soon')"><i class="fas fa-pencil"></i></button>
              <button class="btn btn-ghost btn-xs" style="color:var(--t3);" onclick="alert('Toggle listing')"><i class="fas ${l.active ? 'fa-pause' : 'fa-play'}"></i></button>
            </div>
          </div>
          <!-- Package chips -->
          <div style="padding:10px 20px;background:var(--c-raised);border-top:1px solid var(--c-wire);display:flex;gap:6px;flex-wrap:wrap;">
            ${l.packages.map(p => `
            <span style="padding:4px 10px;border-radius:var(--r-xs);font-size:0.71rem;font-weight:600;background:var(--c-sub);border:1px solid var(--c-wire);color:var(--t3);">${p.name} · ${formatPrice(p.price)}</span>`).join('')}
          </div>
        </div>`).join('')}
      </div>
    </div>
  </main>
</div>
${closeShell()}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────────────────────────────────────
export function settingsPage(): string {
  return shell('Settings', DASH_STYLES) + authedNav() + `
<div class="app-shell">
  ${appSidebar('settings')}
  <main class="app-main">
    <div class="app-page">

      <h1 style="font-family:var(--font-display);font-size:1.5rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:28px;">Settings</h1>

      <div style="display:grid;grid-template-columns:240px 1fr;gap:24px;align-items:start;">

        <!-- Settings nav -->
        <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);overflow:hidden;position:sticky;top:80px;">
          ${[
            { id:'profile', icon:'fa-user', label:'Profile' },
            { id:'account', icon:'fa-at', label:'Account' },
            { id:'notifications', icon:'fa-bell', label:'Notifications' },
            { id:'payout', icon:'fa-dollar-sign', label:'Payout' },
            { id:'security', icon:'fa-shield-alt', label:'Security' },
            { id:'danger', icon:'fa-triangle-exclamation', label:'Danger Zone', danger:true },
          ].map((item,i) => `
          <a href="#${item.id}" style="display:flex;align-items:center;gap:10px;padding:12px 16px;font-size:0.8125rem;font-weight:500;color:${item.danger ? 'var(--channel)' : i===0 ? 'var(--t1)' : 'var(--t3)'};text-decoration:none;border-bottom:1px solid var(--c-wire);background:${i===0 ? 'var(--signal-dim)' : 'transparent'};transition:all 0.15s;" onmouseover="if(!this.style.background.includes('signal'))this.style.background='var(--c-ghost)'" onmouseout="if(!${i===0})this.style.background='transparent'">
            <i class="fas ${item.icon}" style="width:14px;text-align:center;font-size:0.8125rem;color:${item.danger ? 'var(--channel)' : i===0 ? 'var(--signal)' : 'var(--t4)'};"></i>
            ${item.label}
          </a>`).join('')}
        </div>

        <!-- Settings content -->
        <div style="display:flex;flex-direction:column;gap:20px;">

          <!-- Profile section -->
          <div id="profile" style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);overflow:hidden;">
            <div style="padding:20px;border-bottom:1px solid var(--c-wire);display:flex;align-items:center;justify-content:space-between;">
              <div>
                <h3 style="font-size:1rem;font-weight:700;margin-bottom:2px;">Profile</h3>
                <p class="body-sm">Your public artist profile information.</p>
              </div>
            </div>
            <div style="padding:24px;">
              <!-- Avatar -->
              <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid var(--c-wire);">
                <div style="position:relative;">
                  <img src="${demoUser.profileImage}" class="av av-xl" style="border:2px solid var(--c-rim);" alt="${demoUser.artistName}">
                  <button style="position:absolute;bottom:0;right:0;width:24px;height:24px;background:var(--signal);border-radius:50%;border:2px solid var(--c-panel);display:flex;align-items:center;justify-content:center;cursor:pointer;" onclick="alert('Upload photo coming soon')">
                    <i class="fas fa-camera" style="font-size:9px;color:#000;"></i>
                  </button>
                </div>
                <div>
                  <div style="font-size:0.875rem;font-weight:700;margin-bottom:4px;">${demoUser.artistName}</div>
                  <div class="mono-sm" style="color:var(--t4);">@${demoUser.username}</div>
                  <button class="btn btn-ghost btn-xs" style="margin-top:8px;color:var(--signal);" onclick="alert('Upload coming soon')">Change photo</button>
                </div>
              </div>

              <div style="display:grid;gap:16px;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
                  <div class="field">
                    <label class="field-label">Artist Name</label>
                    <input class="field-input" value="${demoUser.artistName}">
                  </div>
                  <div class="field">
                    <label class="field-label">Username</label>
                    <input class="field-input" value="@${demoUser.username}">
                  </div>
                </div>
                <div class="field">
                  <label class="field-label">Bio</label>
                  <textarea class="field-input" rows="4">${demoUser.bio}</textarea>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
                  <div class="field">
                    <label class="field-label">Location</label>
                    <input class="field-input" value="${demoUser.location}">
                  </div>
                  <div class="field">
                    <label class="field-label">Starting Price ($)</label>
                    <input class="field-input" type="number" value="${demoUser.startingPrice}">
                  </div>
                </div>
                <div style="padding-top:4px;">
                  <button class="btn btn-primary btn-sm" onclick="alert('Saved!')">
                    <i class="fas fa-check" style="font-size:11px;"></i>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Notifications section -->
          <div id="notifications" style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);overflow:hidden;">
            <div style="padding:20px;border-bottom:1px solid var(--c-wire);">
              <h3 style="font-size:1rem;font-weight:700;margin-bottom:2px;">Notifications</h3>
              <p class="body-sm">Control what you receive.</p>
            </div>
            <div style="padding:8px 0;">
              ${[
                { label:'New project requests', sub:'When someone books you', on:true },
                { label:'Project messages', sub:'New messages in your workspace', on:true },
                { label:'Delivery confirmations', sub:'When a delivery is approved', on:true },
                { label:'Payment received', sub:'When escrow is released to you', on:true },
                { label:'Marketing emails', sub:'Tips, updates, and announcements', on:false },
              ].map(n => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--c-wire);">
                <div>
                  <div style="font-size:0.875rem;font-weight:600;margin-bottom:2px;">${n.label}</div>
                  <div class="body-sm">${n.sub}</div>
                </div>
                <button onclick="this.dataset.on=this.dataset.on==='1'?'0':'1';this.style.background=this.dataset.on==='1'?'var(--signal)':'var(--c-rim)';" data-on="${n.on ? '1' : '0'}" style="width:40px;height:22px;border-radius:11px;border:none;cursor:pointer;transition:background 0.2s;background:${n.on ? 'var(--signal)' : 'var(--c-rim)'};position:relative;flex-shrink:0;">
                  <div style="width:16px;height:16px;border-radius:50%;background:#fff;position:absolute;top:3px;${n.on ? 'right:3px;' : 'left:3px;'}transition:all 0.2s;"></div>
                </button>
              </div>`).join('')}
            </div>
          </div>

          <!-- Payout section -->
          <div id="payout" style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);overflow:hidden;">
            <div style="padding:20px;border-bottom:1px solid var(--c-wire);">
              <h3 style="font-size:1rem;font-weight:700;margin-bottom:2px;">Payout Method</h3>
              <p class="body-sm">How you get paid when a delivery is approved.</p>
            </div>
            <div style="padding:24px;">
              <div style="display:flex;align-items:center;gap:12px;padding:16px;background:var(--signal-dim);border:1px solid rgba(200,255,0,0.2);border-radius:var(--r-lg);margin-bottom:16px;">
                <i class="fas fa-university" style="color:var(--signal);font-size:1.25rem;flex-shrink:0;"></i>
                <div style="flex:1;">
                  <div style="font-size:0.875rem;font-weight:700;margin-bottom:2px;">Bank Account ···· 4821</div>
                  <div class="mono-sm" style="color:var(--t4);">Connected · Instant payout</div>
                </div>
                <span class="badge badge-signal">Active</span>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="alert('Add payout method coming soon')">
                <i class="fas fa-plus" style="font-size:11px;"></i>
                Add Method
              </button>
            </div>
          </div>

          <!-- Danger zone -->
          <div id="danger" style="background:var(--c-panel);border:1px solid rgba(255,77,109,0.25);border-radius:var(--r-lg);overflow:hidden;">
            <div style="padding:20px;border-bottom:1px solid rgba(255,77,109,0.15);">
              <h3 style="font-size:1rem;font-weight:700;color:var(--channel);margin-bottom:2px;">Danger Zone</h3>
              <p class="body-sm">Irreversible actions.</p>
            </div>
            <div style="padding:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
              <div>
                <div style="font-size:0.875rem;font-weight:600;margin-bottom:3px;">Delete Account</div>
                <p class="body-sm">Permanently delete your account and all data.</p>
              </div>
              <button class="btn btn-danger btn-sm" onclick="alert('This action cannot be undone.')">
                <i class="fas fa-trash" style="font-size:11px;"></i>
                Delete Account
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </main>
</div>
${closeShell()}`;
}
