import { shell, closeShell, authedNav } from '../layout';
import { users, listings, projects, formatPrice, statusColor, statusLabel } from '../data';

// ─── Admin Panel ──────────────────────────────────────────────────────────────
export function adminPage(): string {
  const totalRevenue = projects.reduce((s, p) => s + p.platformFee, 0);
  const activeUsers = users.filter(u => u.availability !== 'unavailable').length;

  return shell('Admin Panel', `
    .admin-layout { display: grid; grid-template-columns: 220px 1fr; min-height: calc(100vh - 64px); }
    .admin-sidebar { background: var(--ink); border-right: 1px solid var(--hairline); padding: 20px 0; }
    .admin-main { background: var(--void); overflow-y: auto; }
    .admin-content { padding: 36px 40px; max-width: 1300px; }
    .admin-stat { background: var(--surface); border: 1px solid var(--hairline); border-radius: var(--r-lg); padding: 22px 24px; }
    .admin-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 32px; }
    .admin-section { background: var(--surface); border: 1px solid var(--hairline); border-radius: var(--r-lg); overflow: hidden; margin-bottom: 24px; }
    .admin-section-head { padding: 16px 20px; border-bottom: 1px solid var(--hairline); display: flex; align-items: center; justify-content: space-between; }
    .admin-nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 16px; font-size: 0.8125rem; font-weight: 500; color: var(--t3); cursor: pointer; transition: all 0.15s; text-decoration: none; }
    .admin-nav-item:hover { color: var(--t1); background: var(--muted-rim); }
    .admin-nav-item.on { color: var(--t1); background: rgba(139,92,246,0.14); border-left: 2px solid var(--uv); }
    .admin-nav-section { font-size: 0.69rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--t4); padding: 14px 16px 4px; }
    .user-row { display: grid; grid-template-columns: 2.5fr 1fr 1fr 1fr 100px; align-items: center; gap: 12px; padding: 13px 20px; border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.12s; }
    .user-row:hover { background: rgba(255,255,255,0.02); }
    .user-row-head { display: grid; grid-template-columns: 2.5fr 1fr 1fr 1fr 100px; gap: 12px; padding: 10px 20px; border-bottom: 1px solid var(--hairline); }
    @media (max-width: 1100px) { .admin-layout { grid-template-columns: 1fr; } .admin-sidebar { display: none; } .admin-stats { grid-template-columns: repeat(2,1fr); } .admin-content { padding: 24px 16px; } .user-row, .user-row-head { grid-template-columns: 1fr; } }
  `) + `
<nav class="nav-shell">
  <div class="nav-inner">
    <a href="/" class="nav-wordmark">
      <div class="nav-glyph">🎵</div>
      <span>Artist Collab</span>
    </a>
    <div style="display:flex;align-items:center;gap:10px;">
      <span class="badge badge-err">Admin Mode</span>
      <a href="/dashboard" class="btn btn-secondary btn-sm">Exit Admin</a>
    </div>
  </div>
</nav>
<div class="admin-layout">
  <!-- Sidebar -->
  <div class="admin-sidebar">
    <div class="admin-nav-section">Overview</div>
    <a href="/admin" class="admin-nav-item on"><i class="fas fa-th-large" style="width:16px;"></i> Dashboard</a>
    <a href="/admin/analytics" class="admin-nav-item"><i class="fas fa-chart-line" style="width:16px;"></i> Analytics</a>
    <div class="admin-nav-section">Management</div>
    <a href="/admin/users" class="admin-nav-item"><i class="fas fa-users" style="width:16px;"></i> Users</a>
    <a href="/admin/listings" class="admin-nav-item"><i class="fas fa-list" style="width:16px;"></i> Listings</a>
    <a href="/admin/orders" class="admin-nav-item"><i class="fas fa-shopping-bag" style="width:16px;"></i> Orders</a>
    <a href="/admin/payments" class="admin-nav-item"><i class="fas fa-dollar-sign" style="width:16px;"></i> Payments</a>
    <div class="admin-nav-section">System</div>
    <a href="/admin/disputes" class="admin-nav-item"><i class="fas fa-flag" style="width:16px;"></i> Disputes <span class="notif" style="margin-left:auto;background:var(--err);">2</span></a>
    <a href="/admin/reviews" class="admin-nav-item"><i class="fas fa-star" style="width:16px;"></i> Reviews</a>
    <a href="/admin/settings" class="admin-nav-item"><i class="fas fa-sliders-h" style="width:16px;"></i> Settings</a>
    <a href="/logout" class="admin-nav-item"><i class="fas fa-arrow-right-from-bracket" style="width:16px;"></i> Sign Out</a>
  </div>

  <!-- Main -->
  <div class="admin-main">
    <div class="admin-content">

      <!-- Header -->
      <div style="margin-bottom:28px;">
        <div class="label" style="margin-bottom:6px;color:var(--err);">System Control</div>
        <h1 style="font-size:clamp(1.4rem,2.5vw,1.875rem);letter-spacing:-0.025em;">Admin Dashboard</h1>
        <p class="body-base" style="margin-top:6px;">Platform overview and management tools.</p>
      </div>

      <!-- System Alert -->
      <div class="alert alert-warn" style="margin-bottom:24px;">
        <i class="fas fa-triangle-exclamation" style="flex-shrink:0;"></i>
        <div><strong>2 open disputes</strong> require your attention. Review and resolve within 24hrs to maintain trust scores.</div>
      </div>

      <!-- Stats -->
      <div class="admin-stats">
        ${[
          { label: 'Total Users', val: users.length.toString(), sub: '+3 this week', color: 'var(--uv-bright)', icon: 'fa-users' },
          { label: 'Active Listings', val: listings.filter(l => l.active).length.toString(), sub: '+2 today', color: 'var(--ok)', icon: 'fa-list' },
          { label: 'Open Orders', val: projects.filter(p=>!['completed','cancelled'].includes(p.status)).length.toString(), sub: '5 active', color: 'var(--ember)', icon: 'fa-layer-group' },
          { label: 'Platform Revenue', val: formatPrice(totalRevenue + 1240), sub: '+$240 today', color: 'var(--arc)', icon: 'fa-dollar-sign' },
        ].map(s => `
        <div class="admin-stat">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <div style="width:36px;height:36px;background:rgba(255,255,255,0.06);border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;">
              <i class="fas ${s.icon}" style="color:${s.color};font-size:0.875rem;"></i>
            </div>
          </div>
          <div style="font-size:1.75rem;font-weight:800;letter-spacing:-0.04em;color:${s.color};">${s.val}</div>
          <div style="font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--t4);margin-bottom:4px;">${s.label}</div>
          <div style="font-size:0.75rem;color:var(--ok);display:flex;align-items:center;gap:3px;"><i class="fas fa-arrow-up" style="font-size:9px;"></i>${s.sub}</div>
        </div>`).join('')}
      </div>

      <!-- Users Table -->
      <div class="admin-section">
        <div class="admin-section-head">
          <h2 style="font-size:1rem;letter-spacing:-0.01em;">All Users (${users.length})</h2>
          <div style="display:flex;gap:8px;">
            <input class="field-input" placeholder="Search users…" style="font-size:0.8125rem;padding:7px 12px;width:180px;">
            <button class="btn btn-primary btn-xs">+ Invite User</button>
          </div>
        </div>
        <div class="user-row-head">
          <div class="label">User</div>
          <div class="label">Type</div>
          <div class="label">Status</div>
          <div class="label">Rating</div>
          <div class="label" style="text-align:right;">Actions</div>
        </div>
        ${users.map(user => `
        <div class="user-row">
          <div style="display:flex;align-items:center;gap:10px;min-width:0;">
            <img src="${user.profileImage}" class="av av-sm" style="border:1.5px solid rgba(255,255,255,0.06);" alt="${user.artistName}">
            <div style="min-width:0;">
              <div style="font-weight:700;font-size:0.875rem;display:flex;align-items:center;gap:6px;">
                ${user.artistName}
                ${user.verified ? `<span class="badge badge-uv" style="font-size:0.65rem;">Verified</span>` : ''}
              </div>
              <div style="font-size:0.75rem;color:var(--t4);">@${user.username} · ${user.location}</div>
            </div>
          </div>
          <div><span class="badge badge-muted" style="font-size:0.69rem;">${user.accountType}</span></div>
          <div>
            <div style="display:flex;align-items:center;gap:6px;">
              <div class="status-dot ${user.availability === 'available' ? 'status-online' : user.availability === 'busy' ? 'status-busy' : 'status-offline'}"></div>
              <span style="font-size:0.78rem;text-transform:capitalize;">${user.availability}</span>
            </div>
          </div>
          <div>
            <div style="display:flex;align-items:center;gap:4px;font-size:0.8125rem;">
              <i class="fas fa-star" style="color:var(--ember);font-size:10px;"></i>
              <span style="font-weight:700;">${user.rating}</span>
              <span style="color:var(--t4);">(${user.reviewCount})</span>
            </div>
          </div>
          <div style="display:flex;gap:5px;justify-content:flex-end;">
            <a href="/artist/${user.id}" class="btn btn-secondary btn-xs">View</a>
            <button class="btn btn-ghost btn-xs" style="color:var(--err);" title="Suspend"><i class="fas fa-ban"></i></button>
          </div>
        </div>`).join('')}
      </div>

      <!-- Recent Orders -->
      <div class="admin-section">
        <div class="admin-section-head">
          <h2 style="font-size:1rem;letter-spacing:-0.01em;">Recent Orders (${projects.length})</h2>
          <a href="/admin/orders" class="btn btn-ghost btn-xs" style="color:var(--uv-bright);">View All</a>
        </div>
        <table class="tbl" style="width:100%;">
          <thead>
            <tr>
              <th>Project</th>
              <th>Buyer</th>
              <th>Seller</th>
              <th>Value</th>
              <th>Status</th>
              <th>Payment</th>
              <th style="text-align:right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${projects.map(p => {
              const buyer = users.find(u => u.id === p.buyerId);
              const seller = users.find(u => u.id === p.sellerId);
              const sC = statusColor(p.status);
              return `
            <tr>
              <td>
                <div style="font-weight:700;font-size:0.875rem;">${p.title.slice(0,32)}…</div>
                <div style="font-size:0.75rem;color:var(--t4);">${p.package} · ${p.dueDate}</div>
              </td>
              <td>
                <div style="display:flex;align-items:center;gap:6px;">
                  <img src="${buyer?.profileImage}" class="av av-xs" alt="${buyer?.artistName}">
                  <span style="font-size:0.8125rem;font-weight:600;">${buyer?.artistName}</span>
                </div>
              </td>
              <td>
                <div style="display:flex;align-items:center;gap:6px;">
                  <img src="${seller?.profileImage}" class="av av-xs" alt="${seller?.artistName}">
                  <span style="font-size:0.8125rem;font-weight:600;">${seller?.artistName}</span>
                </div>
              </td>
              <td style="font-weight:800;font-size:0.9375rem;">${formatPrice(p.orderTotal)}</td>
              <td><span class="badge" style="background:${sC}22;color:${sC};border-color:${sC}44;">${statusLabel(p.status)}</span></td>
              <td>
                <span class="badge ${p.paymentStatus === 'held' ? 'badge-ember' : p.paymentStatus === 'released' ? 'badge-ok' : 'badge-err'}">
                  ${p.paymentStatus}
                </span>
              </td>
              <td style="text-align:right;">
                <a href="/workspace/${p.id}" class="btn btn-secondary btn-xs">View</a>
              </td>
            </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Quick Admin Actions -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;">
        ${[
          { label: 'Review Disputes', sub: '2 open', color: 'var(--err)', icon: 'fa-flag', bg: 'rgba(244,63,94,0.1)' },
          { label: 'Verify Users', sub: '4 pending', color: 'var(--uv-bright)', icon: 'fa-shield-check', bg: 'rgba(139,92,246,0.1)' },
          { label: 'Export Report', sub: 'Monthly CSV', color: 'var(--ok)', icon: 'fa-download', bg: 'rgba(16,185,129,0.1)' },
        ].map(a => `
        <button onclick="alert('${a.label} — coming soon')" style="background:var(--surface);border:1px solid var(--hairline);border-radius:var(--r-lg);padding:20px;cursor:pointer;text-align:left;transition:all 0.18s;display:flex;align-items:center;gap:14px;" onmouseover="this.style.borderColor='${a.color}55'" onmouseout="this.style.borderColor='var(--hairline)'">
          <div style="width:40px;height:40px;border-radius:var(--r);background:${a.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="fas ${a.icon}" style="color:${a.color};"></i>
          </div>
          <div>
            <div style="font-weight:700;font-size:0.875rem;">${a.label}</div>
            <div style="font-size:0.75rem;color:var(--t4);margin-top:2px;">${a.sub}</div>
          </div>
        </button>`).join('')}
      </div>

    </div>
  </div>
</div>
` + closeShell();
}
