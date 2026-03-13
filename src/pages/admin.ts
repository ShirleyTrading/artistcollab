import { shell, closeShell, authedNav } from '../layout';
import { users, listings, projects, formatPrice, statusColor, statusLabel } from '../data';

export function adminPage(): string {
  const totalRevenue = projects.reduce((s, p) => s + (p.platformFee || 0), 0);
  const activeUserCount = users.filter(u => u.availability).length;

  return shell('Admin Panel', `
  .adm-layout { display: grid; grid-template-columns: 220px 1fr; min-height: calc(100vh - 56px); }
  .adm-sidebar { background: var(--c-base); border-right: 1px solid var(--c-wire); padding: 20px 0; }
  .adm-main { background: var(--c-void); overflow-y: auto; }
  .adm-content { padding: 32px 36px; max-width: 1300px; }
  .adm-stat { background: var(--c-panel); border: 1px solid var(--c-wire); border-radius: var(--r-lg); padding: 22px; }
  .adm-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 32px; }
  .adm-section { background: var(--c-panel); border: 1px solid var(--c-wire); border-radius: var(--r-lg); overflow: hidden; margin-bottom: 24px; }
  .adm-section-head { padding: 14px 20px; border-bottom: 1px solid var(--c-wire); display: flex; align-items: center; justify-content: space-between; background: var(--c-raised); }
  .adm-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 16px; font-size: 0.8125rem; font-weight: 500; color: var(--t3);
    cursor: pointer; transition: all var(--t-fast); text-decoration: none;
  }
  .adm-nav-item:hover { color: var(--t1); background: var(--c-ghost); }
  .adm-nav-item.on { color: var(--t1); background: var(--signal-dim); border-left: 2px solid var(--signal); }
  .adm-nav-section { font-size: 0.6rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--t4); padding: 14px 16px 4px; font-family: var(--font-mono); }
  .user-row { display: grid; grid-template-columns: 2.5fr 1fr 1fr 1fr 100px; align-items: center; gap: 12px; padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.03); transition: background var(--t-fast); }
  .user-row:hover { background: var(--c-ghost); }
  .user-row-head { display: grid; grid-template-columns: 2.5fr 1fr 1fr 1fr 100px; gap: 12px; padding: 10px 20px; border-bottom: 1px solid var(--c-wire); }
  @media (max-width: 1100px) {
    .adm-layout { grid-template-columns: 1fr; }
    .adm-sidebar { display: none; }
    .adm-stats { grid-template-columns: repeat(2,1fr); }
    .adm-content { padding: 24px 16px; }
    .user-row, .user-row-head { grid-template-columns: 1fr; }
  }
`) + authedNav() + `

<div class="adm-layout">

  <!-- Sidebar -->
  <aside class="adm-sidebar">
    <div class="adm-nav-section">Platform</div>
    <a href="/admin" class="adm-nav-item on"><i class="fas fa-grid-2" style="width:14px;font-size:0.8125rem;color:var(--signal);"></i>Overview</a>
    <a href="/admin/users" class="adm-nav-item"><i class="fas fa-users" style="width:14px;font-size:0.8125rem;color:var(--t4);"></i>Users</a>
    <a href="/admin/orders" class="adm-nav-item"><i class="fas fa-receipt" style="width:14px;font-size:0.8125rem;color:var(--t4);"></i>Orders</a>
    <a href="/admin/payments" class="adm-nav-item"><i class="fas fa-dollar-sign" style="width:14px;font-size:0.8125rem;color:var(--t4);"></i>Payments</a>
    <a href="/admin/disputes" class="adm-nav-item">
      <i class="fas fa-flag" style="width:14px;font-size:0.8125rem;color:var(--t4);"></i>
      Disputes
      <span style="margin-left:auto;background:var(--channel);color:#000;border-radius:999px;padding:1px 6px;font-size:0.6rem;font-weight:700;font-family:var(--font-mono);">2</span>
    </a>
    <div class="adm-nav-section" style="margin-top:8px;">Content</div>
    <a href="/admin/listings" class="adm-nav-item"><i class="fas fa-list-ul" style="width:14px;font-size:0.8125rem;color:var(--t4);"></i>Listings</a>
    <a href="/admin/reviews" class="adm-nav-item"><i class="fas fa-star" style="width:14px;font-size:0.8125rem;color:var(--t4);"></i>Reviews</a>
    <div class="adm-nav-section" style="margin-top:8px;">System</div>
    <a href="/admin/settings" class="adm-nav-item"><i class="fas fa-sliders-h" style="width:14px;font-size:0.8125rem;color:var(--t4);"></i>Settings</a>
    <a href="/admin/logs" class="adm-nav-item"><i class="fas fa-terminal" style="width:14px;font-size:0.8125rem;color:var(--t4);"></i>Logs</a>
    <div style="padding:12px 14px;margin-top:auto;border-top:1px solid var(--c-wire);">
      <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--t4);">ADMIN PANEL · v1.0</div>
      <div style="display:flex;align-items:center;gap:6px;margin-top:4px;">
        <div class="node node-ok"></div>
        <span style="font-family:var(--font-mono);font-size:0.6rem;color:var(--s-ok);">ALL SYSTEMS OPERATIONAL</span>
      </div>
    </div>
  </aside>

  <!-- Main -->
  <main class="adm-main">
    <div class="adm-content">

      <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <div style="height:1px;width:16px;background:var(--signal);box-shadow:0 0 4px var(--signal-glow);"></div>
            <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--signal);">Control Panel</span>
          </div>
          <h1 style="font-family:var(--font-display);font-size:1.5rem;font-weight:800;letter-spacing:-0.02em;">Admin Overview</h1>
        </div>
        <span class="badge badge-muted" style="font-family:var(--font-mono);">RESTRICTED · STAFF ONLY</span>
      </div>

      <!-- Stats -->
      <div class="adm-stats">
        ${[
          { label:'Total Users', val:users.length.toString(), sub:'+3 this week', color:'var(--signal)', icon:'fa-users' },
          { label:'Active Listings', val:listings.filter(l => l.active).length.toString(), sub:'+2 today', color:'var(--patch)', icon:'fa-list' },
          { label:'Total Orders', val:projects.length.toString(), sub:`${projects.filter(p=>p.status==='in_progress').length} active`, color:'var(--warm)', icon:'fa-receipt' },
          { label:'Platform Revenue', val:`$${totalRevenue.toLocaleString()}`, sub:'All time', color:'var(--s-ok)', icon:'fa-dollar-sign' },
        ].map(s => `
        <div class="adm-stat" style="border-top:2px solid ${s.color};">
          <div style="width:34px;height:34px;background:${s.color}12;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;margin-bottom:12px;">
            <i class="fas ${s.icon}" style="color:${s.color};font-size:0.875rem;"></i>
          </div>
          <div style="font-family:var(--font-display);font-size:1.75rem;font-weight:800;letter-spacing:-0.04em;color:${s.color};margin-bottom:4px;">${s.val}</div>
          <div style="font-family:var(--font-mono);font-size:0.6rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--t4);margin-bottom:4px;">${s.label}</div>
          <div style="font-size:0.75rem;color:var(--s-ok);display:flex;align-items:center;gap:3px;">
            <i class="fas fa-arrow-up" style="font-size:9px;"></i>${s.sub}
          </div>
        </div>`).join('')}
      </div>

      <!-- Users table -->
      <div class="adm-section">
        <div class="adm-section-head">
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="height:1px;width:16px;background:var(--signal);"></div>
            <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--signal);">Users</span>
          </div>
          <a href="/admin/users" class="btn btn-ghost btn-xs" style="color:var(--t3);">View All</a>
        </div>
        <div class="user-row-head">
          ${['Artist','Type','Rating','Status','Actions'].map(h => `<span style="font-family:var(--font-mono);font-size:0.6rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--t4);">${h}</span>`).join('')}
        </div>
        ${users.slice(0, 6).map(u => `
        <div class="user-row">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="position:relative;flex-shrink:0;">
              <img src="${u.profileImage}" class="av av-sm" style="border:1.5px solid var(--c-rim);" alt="${u.artistName}">
              ${u.verified ? `<div style="position:absolute;bottom:0;right:0;width:12px;height:12px;background:var(--signal);border-radius:50%;border:2px solid var(--c-panel);display:flex;align-items:center;justify-content:center;"><i class="fas fa-check" style="font-size:6px;color:#000;"></i></div>` : ''}
            </div>
            <div style="min-width:0;">
              <div style="font-size:0.875rem;font-weight:700;letter-spacing:-0.01em;">${u.artistName}</div>
              <div class="mono-sm" style="color:var(--t4);">@${u.username}</div>
            </div>
          </div>
          <span class="badge badge-muted">${u.accountType}</span>
          <span style="font-size:0.875rem;color:var(--signal);">★ ${u.rating.toFixed(1)}</span>
          <span class="badge ${u.availability ? 'badge-ok' : 'badge-muted'}">${u.availability ? 'Available' : 'Busy'}</span>
          <div style="display:flex;gap:5px;">
            <button class="btn btn-ghost btn-xs" onclick="alert('View user: ${u.artistName}')"><i class="fas fa-eye"></i></button>
            <button class="btn btn-ghost btn-xs" style="color:var(--channel);" title="Suspend" onclick="alert('Suspend user?')"><i class="fas fa-ban"></i></button>
          </div>
        </div>`).join('')}
      </div>

      <!-- Orders table -->
      <div class="adm-section">
        <div class="adm-section-head">
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="height:1px;width:16px;background:var(--warm);"></div>
            <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--warm);">Recent Orders</span>
          </div>
          <a href="/admin/orders" class="btn btn-ghost btn-xs" style="color:var(--t3);">View All</a>
        </div>
        <div style="overflow-x:auto;">
          <table class="tbl" style="min-width:600px;">
            <thead>
              <tr>
                <th>Project</th>
                <th>Buyer</th>
                <th>Seller</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${projects.slice(0, 5).map(p => {
                const buyer = users.find(u => u.id === p.buyerId);
                const seller = users.find(u => u.id === p.sellerId);
                const sc = statusColor(p.status);
                const sl = statusLabel(p.status);
                return `
              <tr>
                <td><div style="font-weight:600;font-size:0.875rem;max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.title}</div></td>
                <td>
                  <div style="display:flex;align-items:center;gap:7px;">
                    <img src="${buyer?.profileImage}" class="av av-xs" alt="${buyer?.artistName}">
                    <span style="font-size:0.8125rem;">${buyer?.artistName}</span>
                  </div>
                </td>
                <td>
                  <div style="display:flex;align-items:center;gap:7px;">
                    <img src="${seller?.profileImage}" class="av av-xs" alt="${seller?.artistName}">
                    <span style="font-size:0.8125rem;">${seller?.artistName}</span>
                  </div>
                </td>
                <td><span style="font-weight:700;">${formatPrice(p.orderTotal)}</span></td>
                <td><span class="badge" style="background:${sc}18;color:${sc};border:1px solid ${sc}33;font-family:var(--font-mono);">${sl}</span></td>
              </tr>`;}).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick actions -->
      <div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
          <div style="height:1px;width:16px;background:var(--signal);"></div>
          <span style="font-family:var(--font-mono);font-size:0.65rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--signal);">Quick Actions</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
          ${[
            { label:'Review Disputes', sub:'2 open', color:'var(--channel)', icon:'fa-flag', bg:'var(--channel-dim)' },
            { label:'Verify Users', sub:'4 pending', color:'var(--signal)', icon:'fa-shield-check', bg:'var(--signal-dim)' },
            { label:'Export Report', sub:'Monthly CSV', color:'var(--s-ok)', icon:'fa-download', bg:'rgba(45,202,114,0.08)' },
          ].map(a => `
          <button onclick="alert('${a.label} — coming soon')" style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);padding:20px;cursor:pointer;text-align:left;transition:all 0.18s;display:flex;align-items:center;gap:14px;font-family:var(--font-body);" onmouseover="this.style.borderColor='${a.color}44'" onmouseout="this.style.borderColor='var(--c-wire)'">
            <div style="width:40px;height:40px;background:${a.bg};border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i class="fas ${a.icon}" style="color:${a.color};font-size:1rem;"></i>
            </div>
            <div>
              <div style="font-size:0.875rem;font-weight:700;color:var(--t1);">${a.label}</div>
              <div class="mono-sm" style="color:var(--t4);">${a.sub}</div>
            </div>
          </button>`).join('')}
        </div>
      </div>

    </div>
  </main>
</div>
${closeShell()}`;
}
