import { shell, closeShell, authedNav, appSidebar } from '../layout';
import { users, projects, listings, getUserById, statusColor, statusLabel, formatPrice } from '../data';

const demoUser = users[0];

// ─── Shared styles ────────────────────────────────────────────────────────────
const DASH_STYLES = `
  .app-page { padding: 28px 32px; max-width: 1200px; overflow-x: hidden; }

  .sec-label {
    display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
  }
  .sec-label-bar { height: 1px; width: 20px; background: var(--signal); box-shadow: 0 0 6px var(--signal-glow); }
  .sec-label-text {
    font-family: var(--font-mono); font-size: 0.65rem; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase; color: var(--signal);
  }

  /* Stat tiles */
  .stat-tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 36px; }
  .stat-tile {
    background: var(--c-panel); border: 1px solid var(--c-wire);
    border-radius: var(--r-lg); padding: 20px;
    position: relative; overflow: hidden;
    transition: border-color 0.2s, transform 0.2s;
    text-decoration: none; display: block; cursor: pointer;
  }
  .stat-tile:hover { border-color: rgba(255,255,255,0.1); transform: translateY(-2px); }
  .stat-tile-bar { position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .stat-tile-icon {
    width: 34px; height: 34px; border-radius: var(--r-sm);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.875rem; margin-bottom: 12px;
  }
  .stat-tile-val {
    font-family: var(--font-display); font-size: 1.75rem; font-weight: 800;
    letter-spacing: -0.03em; line-height: 1; margin-bottom: 4px; color: var(--t1);
  }
  .stat-tile-lbl {
    font-family: var(--font-mono); font-size: 0.625rem; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase; color: var(--t3);
  }

  /* Project list */
  .proj-row {
    display: flex; align-items: center; gap: 14px;
    background: var(--c-panel); border: 1px solid var(--c-wire);
    border-radius: var(--r-lg); padding: 14px 16px;
    margin-bottom: 8px; cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
  }
  .proj-row:hover { background: var(--c-raised); }
  .av { border-radius: 50%; object-fit: cover; flex-shrink: 0; }
  .av-md { width: 40px; height: 40px; }
  .badge {
    display: inline-flex; align-items: center;
    padding: 3px 9px; border-radius: var(--r-full);
    font-family: var(--font-mono); font-size: 0.6rem;
    font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  }
  .prog-bar { height: 3px; background: var(--c-rim); border-radius: 2px; overflow: hidden; flex: 1; min-width: 60px; }
  .prog-fill { height: 100%; border-radius: 2px; transition: width 0.4s; }

  /* Next Step panel */
  .next-step-panel {
    background: linear-gradient(135deg, var(--c-panel) 0%, var(--c-raised) 100%);
    border: 1px solid rgba(200,255,0,0.15);
    border-radius: var(--r-xl); padding: 24px;
    position: relative; overflow: hidden; margin-bottom: 28px;
  }
  .next-step-panel::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--signal) 0%, transparent 60%);
  }

  /* Earnings chart */
  .chart-bars {
    display: flex; align-items: flex-end; gap: 6px;
    height: 80px; padding-bottom: 4px;
  }
  .chart-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .chart-bar {
    width: 100%; border-radius: 3px 3px 0 0;
    background: var(--c-lift); transition: background 0.2s;
    cursor: pointer; position: relative;
  }
  .chart-bar:last-child, .chart-bar.current { background: var(--signal); }
  .chart-bar:hover { background: rgba(200,255,0,0.5); }
  .chart-month {
    font-family: var(--font-mono); font-size: 0.5625rem;
    color: var(--t4); letter-spacing: 0.05em;
  }

  /* Mobile nav pills (dashboard sub-nav) */
  .mob-dash-nav {
    display: none;
    overflow-x: auto; gap: 6px; padding: 0 0 16px;
    scrollbar-width: none;
  }
  .mob-dash-nav::-webkit-scrollbar { display: none; }
  .mob-nav-pill {
    display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0;
    padding: 8px 14px; border-radius: var(--r-full);
    background: var(--c-raised); border: 1px solid var(--c-rim);
    font-size: 0.8125rem; color: var(--t2); text-decoration: none;
    transition: border-color 0.15s, color 0.15s;
  }
  .mob-nav-pill.active { border-color: var(--signal); color: var(--signal); }

  @media (max-width: 1024px) {
    .stat-tiles { grid-template-columns: repeat(2, 1fr); }
    .app-page { padding: 20px; }
  }
  @media (max-width: 768px) {
    .stat-tiles { grid-template-columns: repeat(2, 1fr); }
    .mob-dash-nav { display: flex; }
  }
  @media (max-width: 480px) {
    .stat-tiles { grid-template-columns: 1fr 1fr; }
    .app-page { padding: 16px 14px; }
  }
`;

// ─── DASHBOARD (Overview) ─────────────────────────────────────────────────────
export function dashboardPage(): string {
  const userProjects  = projects.filter(p => p.buyerId === demoUser.id || p.sellerId === demoUser.id);
  const activeProjects = userProjects.filter(p => !['completed', 'cancelled'].includes(p.status));
  const completedCount = userProjects.filter(p => p.status === 'completed').length;
  const totalEarnings  = 4820;

  const earningMonths = [820, 1200, 680, 1540, 980, 1480, 4820];
  const monthLabels   = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const maxEarn       = Math.max(...earningMonths);

  const progressMap: Record<string, number> = {
    pending: 5, in_progress: 45, awaiting_delivery: 70,
    delivered: 85, revision_requested: 60, completed: 100,
  };

  const statusColors: Record<string, string> = {
    pending: 'var(--s-warn)', in_progress: 'var(--patch)',
    awaiting_delivery: 'var(--warm)', delivered: 'var(--s-ok)',
    revision_requested: 'var(--channel)', completed: 'var(--signal)',
    cancelled: 'var(--t4)',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Pending', in_progress: 'In Progress',
    awaiting_delivery: 'Awaiting', delivered: 'Delivered',
    revision_requested: 'Revision', completed: 'Complete', cancelled: 'Cancelled',
  };

  // Determine "next step" action
  const nextProj = activeProjects[0];
  const nextStepMap: Record<string, { label: string; action: string; cta: string }> = {
    pending:            { label: 'Your collab is waiting to start.', action: 'Review & Confirm', cta: 'Review Project' },
    in_progress:        { label: 'Work is underway — chat with your collaborator.', action: 'Open Project Room', cta: 'Open Room' },
    awaiting_delivery:  { label: 'Delivery is expected soon.', action: 'Check Project Room', cta: 'View Status' },
    delivered:          { label: 'Delivery received — review and approve to release payment.', action: 'Approve Delivery', cta: 'Review Delivery' },
    revision_requested: { label: 'Revision requested — the artist is working on changes.', action: 'Check Progress', cta: 'View Room' },
  };
  const ns = nextProj ? nextStepMap[nextProj.status] : null;

  return shell('Dashboard — ArtistCollab', DASH_STYLES, authedNav() + appSidebar('overview') + `

  <div class="app-page">

    <!-- Greeting -->
    <div style="margin-bottom:28px;">
      <h1 style="font-family:var(--font-display);font-size:1.5rem;font-weight:800;color:var(--t1);margin-bottom:4px;">
        Hey, ${demoUser.artistName} 👋
      </h1>
      <p style="font-size:0.875rem;color:var(--t2);">
        ${activeProjects.length > 0
          ? `You have ${activeProjects.length} active collab${activeProjects.length > 1 ? 's' : ''} in progress.`
          : 'No active collabs — start one below.'}
      </p>
    </div>

    <!-- Next Step Panel -->
    ${ns && nextProj ? `
    <div class="next-step-panel">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;">
        <div>
          <div style="font-family:var(--font-mono);font-size:0.625rem;color:var(--signal);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">
            <i class="fas fa-bolt" style="margin-right:4px;"></i> Next Step
          </div>
          <div style="font-size:1rem;font-weight:700;color:var(--t1);margin-bottom:4px;">${ns.action}</div>
          <div style="font-size:0.875rem;color:var(--t2);">${ns.label}</div>
          <div style="font-size:0.75rem;color:var(--t3);margin-top:6px;">Project: <strong style="color:var(--t2);">${nextProj.title}</strong></div>
        </div>
        <a href="/workspace/${nextProj.id}" class="btn btn-primary" style="flex-shrink:0;">
          <i class="fas fa-arrow-right"></i> ${ns.cta}
        </a>
      </div>
    </div>` : `
    <div class="next-step-panel">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
        <div>
          <div style="font-family:var(--font-mono);font-size:0.625rem;color:var(--signal);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">
            <i class="fas fa-rocket" style="margin-right:4px;"></i> Ready to Collaborate?
          </div>
          <div style="font-size:1rem;font-weight:700;color:var(--t1);margin-bottom:4px;">Start a new collab</div>
          <div style="font-size:0.875rem;color:var(--t2);">Find an artist, book a session, and create something together.</div>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <a href="/explore" class="btn btn-primary">
            <i class="fas fa-search"></i> Find Artists
          </a>
          <a href="/marketplace" class="btn btn-secondary">
            <i class="fas fa-store"></i> Browse Services
          </a>
        </div>
      </div>
    </div>`}

    <!-- Stat tiles -->
    <div class="stat-tiles">
      <a class="stat-tile" href="/dashboard/projects">
        <div class="stat-tile-bar" style="background:var(--patch);"></div>
        <div class="stat-tile-icon" style="background:var(--patch-dim);">
          <i class="fas fa-layer-group" style="color:var(--patch);"></i>
        </div>
        <div class="stat-tile-val">${activeProjects.length}</div>
        <div class="stat-tile-lbl">Active Projects</div>
      </a>
      <a class="stat-tile" href="/dashboard/earnings">
        <div class="stat-tile-bar" style="background:var(--signal);"></div>
        <div class="stat-tile-icon" style="background:var(--signal-dim);">
          <i class="fas fa-dollar-sign" style="color:var(--signal);"></i>
        </div>
        <div class="stat-tile-val">$${totalEarnings.toLocaleString()}</div>
        <div class="stat-tile-lbl">Total Earned</div>
      </a>
      <a class="stat-tile" href="/dashboard/projects">
        <div class="stat-tile-bar" style="background:var(--s-ok);"></div>
        <div class="stat-tile-icon" style="background:var(--s-ok-d);">
          <i class="fas fa-check-circle" style="color:var(--s-ok);"></i>
        </div>
        <div class="stat-tile-val">${completedCount}</div>
        <div class="stat-tile-lbl">Completed</div>
      </a>
      <a class="stat-tile" href="/dashboard/listings">
        <div class="stat-tile-bar" style="background:var(--warm);"></div>
        <div class="stat-tile-icon" style="background:var(--warm-dim);">
          <i class="fas fa-star" style="color:var(--warm);"></i>
        </div>
        <div class="stat-tile-val">${demoUser.rating.toFixed(1)}</div>
        <div class="stat-tile-lbl">Avg Rating</div>
      </a>
    </div>

    <!-- Two-column: projects + earnings chart -->
    <div style="display:grid;grid-template-columns:1fr 280px;gap:20px;align-items:start;">

      <!-- Active Projects -->
      <div>
        <div class="sec-label">
          <div class="sec-label-bar"></div>
          <div class="sec-label-text">Active Projects</div>
        </div>

        ${activeProjects.slice(0, 4).map(p => {
          const counterpartId = p.buyerId === demoUser.id ? p.sellerId : p.buyerId;
          const counterpart   = getUserById(counterpartId);
          const sc  = statusColors[p.status] || 'var(--t3)';
          const sl  = statusLabels[p.status] || p.status;
          const pct = progressMap[p.status] ?? 0;
          return `
        <div class="proj-row" onclick="location.href='/workspace/${p.id}'" style="border-left:2px solid ${sc};">
          <img src="${counterpart?.profileImage || ''}" class="av av-md" style="border:1.5px solid var(--c-rim);" alt="${counterpart?.artistName}">
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;flex-wrap:wrap;">
              <span style="font-size:0.875rem;font-weight:700;color:var(--t1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px;">${p.title}</span>
              <span class="badge" style="background:${sc}22;color:${sc};">${sl}</span>
              <span class="badge" style="background:${p.sellerId === demoUser.id ? 'var(--signal-dim)' : 'var(--patch-dim)'};color:${p.sellerId === demoUser.id ? 'var(--signal)' : 'var(--patch)'};">
                ${p.sellerId === demoUser.id ? 'SELLER' : 'BUYER'}
              </span>
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:0.75rem;color:var(--t3);">with ${counterpart?.artistName}</span>
              <div class="prog-bar">
                <div class="prog-fill" style="width:${pct}%;background:${sc};"></div>
              </div>
              <span style="font-family:var(--font-mono);font-size:0.6875rem;color:var(--t3);flex-shrink:0;">${pct}%</span>
            </div>
          </div>
          <div style="font-family:var(--font-mono);font-size:0.875rem;font-weight:700;color:var(--t1);flex-shrink:0;">${formatPrice(p.orderTotal)}</div>
        </div>`;
        }).join('') || `
        <div style="text-align:center;padding:48px 24px;background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);">
          <i class="fas fa-music" style="font-size:2rem;color:var(--t4);margin-bottom:14px;display:block;"></i>
          <p style="color:var(--t3);font-size:0.875rem;">No active projects yet.</p>
          <a href="/explore" class="btn btn-primary" style="margin-top:16px;display:inline-flex;">Find an Artist</a>
        </div>`}

        ${activeProjects.length > 4 ? `
        <a href="/dashboard/projects" class="btn btn-secondary" style="width:100%;justify-content:center;margin-top:8px;display:flex;">
          View all ${activeProjects.length} projects <i class="fas fa-arrow-right" style="margin-left:6px;"></i>
        </a>` : ''}
      </div>

      <!-- Earnings chart + quick actions -->
      <div>
        <!-- Earnings mini chart -->
        <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);padding:18px;margin-bottom:16px;">
          <div class="sec-label" style="margin-bottom:14px;">
            <div class="sec-label-bar"></div>
            <div class="sec-label-text">Earnings</div>
          </div>
          <div style="font-family:var(--font-display);font-size:1.5rem;font-weight:800;color:var(--signal);margin-bottom:4px;">
            $${earningMonths[earningMonths.length - 1].toLocaleString()}
          </div>
          <div style="font-size:0.75rem;color:var(--t3);margin-bottom:16px;">This month</div>
          <div class="chart-bars">
            ${earningMonths.map((v, i) => `
            <div class="chart-bar-wrap">
              <div class="chart-bar${i === earningMonths.length - 1 ? ' current' : ''}"
                   style="height:${Math.round((v / maxEarn) * 72)}px;"
                   title="${monthLabels[i]}: $${v.toLocaleString()}">
              </div>
              <span class="chart-month">${monthLabels[i]}</span>
            </div>`).join('')}
          </div>
          <a href="/dashboard/earnings" style="font-size:0.75rem;color:var(--patch);text-decoration:none;display:block;margin-top:10px;text-align:right;">
            View full report <i class="fas fa-arrow-right" style="font-size:9px;"></i>
          </a>
        </div>

        <!-- Profile strength -->
        <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);padding:18px;">
          <div class="sec-label" style="margin-bottom:12px;">
            <div class="sec-label-bar"></div>
            <div class="sec-label-text">Profile Strength</div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span style="font-size:0.875rem;color:var(--t2);">72% complete</span>
            <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--signal);">72%</span>
          </div>
          <div style="height:6px;background:var(--c-rim);border-radius:3px;overflow:hidden;margin-bottom:12px;">
            <div style="height:100%;width:72%;background:var(--signal);border-radius:3px;"></div>
          </div>
          <div style="font-size:0.75rem;color:var(--t3);">Add a cover image to reach 85%</div>
          <a href="/dashboard/settings" style="font-size:0.75rem;color:var(--patch);text-decoration:none;margin-top:8px;display:inline-block;">
            Complete profile <i class="fas fa-arrow-right" style="font-size:9px;"></i>
          </a>
        </div>
      </div>

    </div><!-- /grid -->

  </div><!-- /app-page -->
  ${closeShell()}`);
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────
export function projectsPage(): string {
  const userProjects   = projects.filter(p => p.buyerId === demoUser.id || p.sellerId === demoUser.id);
  const activeProjects = userProjects.filter(p => !['completed', 'cancelled'].includes(p.status));
  const completedProj  = userProjects.filter(p => p.status === 'completed');

  const statusColors: Record<string, string> = {
    pending: 'var(--s-warn)', in_progress: 'var(--patch)',
    awaiting_delivery: 'var(--warm)', delivered: 'var(--s-ok)',
    revision_requested: 'var(--channel)', completed: 'var(--signal)', cancelled: 'var(--t4)',
  };
  const statusLabels: Record<string, string> = {
    pending: 'Pending', in_progress: 'In Progress', awaiting_delivery: 'Awaiting',
    delivered: 'Delivered', revision_requested: 'Revision', completed: 'Complete', cancelled: 'Cancelled',
  };
  const progressMap: Record<string, number> = {
    pending: 5, in_progress: 45, awaiting_delivery: 70,
    delivered: 85, revision_requested: 60, completed: 100,
  };

  function renderProjects(list: typeof projects) {
    if (!list.length) return `<div style="text-align:center;padding:48px;color:var(--t3);">No projects found</div>`;
    return list.map(p => {
      const cid  = p.buyerId === demoUser.id ? p.sellerId : p.buyerId;
      const cp   = getUserById(cid);
      const sc   = statusColors[p.status] || 'var(--t3)';
      const sl   = statusLabels[p.status] || p.status;
      const pct  = progressMap[p.status] ?? 0;
      return `
    <div class="proj-row" onclick="location.href='/workspace/${p.id}'" style="border-left:2px solid ${sc};">
      <img src="${cp?.profileImage || ''}" class="av av-md" style="border:1.5px solid var(--c-rim);" alt="${cp?.artistName}">
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap;">
          <span style="font-size:0.875rem;font-weight:700;color:var(--t1);">${p.title}</span>
          <span class="badge" style="background:${sc}22;color:${sc};">${sl}</span>
          <span class="badge" style="background:${p.sellerId === demoUser.id ? 'var(--signal-dim)' : 'var(--patch-dim)'};color:${p.sellerId === demoUser.id ? 'var(--signal)' : 'var(--patch)'};">
            ${p.sellerId === demoUser.id ? 'SELLER' : 'BUYER'}
          </span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:0.75rem;color:var(--t3);">${cp?.artistName}</span>
          <div class="prog-bar"><div class="prog-fill" style="width:${pct}%;background:${sc};"></div></div>
          <span style="font-family:var(--font-mono);font-size:0.6875rem;color:var(--t3);">${pct}%</span>
        </div>
      </div>
      <div style="text-align:right;flex-shrink:0;">
        <div style="font-family:var(--font-mono);font-size:0.875rem;font-weight:700;color:var(--t1);">${formatPrice(p.orderTotal)}</div>
        <div style="font-size:0.6875rem;color:var(--t3);">Due ${new Date(p.dueDate).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
      </div>
    </div>`;
    }).join('');
  }

  return shell('Projects — ArtistCollab', DASH_STYLES + `
  .filter-pills { display:flex;gap:6px;margin-bottom:20px;flex-wrap:wrap; }
  .fp { padding:7px 16px;border-radius:var(--r-full);border:1px solid var(--c-rim);background:var(--c-raised);font-size:0.8125rem;color:var(--t2);cursor:pointer;transition:all 0.15s; }
  .fp.on { border-color:var(--signal);background:var(--signal-dim);color:var(--signal); }
  `, authedNav() + appSidebar('projects') + `
  <div class="app-page">
    <div style="margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <div>
        <h1 style="font-family:var(--font-display);font-size:1.375rem;font-weight:800;color:var(--t1);margin-bottom:4px;">Projects</h1>
        <p style="font-size:0.875rem;color:var(--t2);">${activeProjects.length} active · ${completedProj.length} completed</p>
      </div>
      <a href="/explore" class="btn btn-primary"><i class="fas fa-plus"></i> New Collab</a>
    </div>

    <div class="filter-pills">
      <div class="fp on" onclick="filterProj('all',this)">All (${userProjects.length})</div>
      <div class="fp" onclick="filterProj('active',this)">Active (${activeProjects.length})</div>
      <div class="fp" onclick="filterProj('completed',this)">Completed (${completedProj.length})</div>
      <div class="fp" onclick="filterProj('cancelled',this)">Cancelled</div>
    </div>

    <div id="proj-list-all">${renderProjects(userProjects)}</div>
    <div id="proj-list-active" style="display:none;">${renderProjects(activeProjects)}</div>
    <div id="proj-list-completed" style="display:none;">${renderProjects(completedProj)}</div>
    <div id="proj-list-cancelled" style="display:none;"><div style="text-align:center;padding:48px;color:var(--t3);">No cancelled projects</div></div>
  </div>

  <script>
  function filterProj(type, el) {
    document.querySelectorAll('.fp').forEach(b => b.classList.remove('on'));
    el.classList.add('on');
    ['all','active','completed','cancelled'].forEach(t => {
      document.getElementById('proj-list-'+t).style.display = t === type ? '' : 'none';
    });
  }
  </script>
  ${closeShell()}`);
}

// ─── EARNINGS ────────────────────────────────────────────────────────────────
export function earningsPage(): string {
  const earningMonths = [820, 1200, 680, 1540, 980, 1480, 4820];
  const monthLabels   = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const maxEarn       = Math.max(...earningMonths);
  const totalEarned   = earningMonths.reduce((a, b) => a + b, 0);

  const payouts = [
    { date: 'Jul 14, 2026', desc: 'Feature Verse — Marcus B',        amount: 810,  status: 'Paid' },
    { date: 'Jul 8, 2026',  desc: 'Hook Writing — SoundWave Studio', amount: 450,  status: 'Paid' },
    { date: 'Jun 28, 2026', desc: 'Premium Vocal Package',           amount: 1200, status: 'Paid' },
    { date: 'Jun 15, 2026', desc: 'Production Co-write',             amount: 540,  status: 'Paid' },
    { date: 'May 30, 2026', desc: 'Feature + Hook',                  amount: 650,  status: 'Paid' },
  ];

  return shell('Earnings — ArtistCollab', DASH_STYLES + `
  .earn-tiles { display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:32px; }
  @media(max-width:768px){.earn-tiles{grid-template-columns:1fr;}}
  `, authedNav() + appSidebar('earnings') + `
  <div class="app-page">
    <h1 style="font-family:var(--font-display);font-size:1.375rem;font-weight:800;color:var(--t1);margin-bottom:24px;">Earnings</h1>

    <div class="earn-tiles">
      <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);padding:22px;border-top:2px solid var(--signal);">
        <div style="font-family:var(--font-mono);font-size:0.625rem;color:var(--t3);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Total Earned</div>
        <div style="font-family:var(--font-display);font-size:2rem;font-weight:800;color:var(--signal);">$${totalEarned.toLocaleString()}</div>
      </div>
      <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);padding:22px;border-top:2px solid var(--patch);">
        <div style="font-family:var(--font-mono);font-size:0.625rem;color:var(--t3);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">This Month</div>
        <div style="font-family:var(--font-display);font-size:2rem;font-weight:800;color:var(--patch);">$${earningMonths[earningMonths.length-1].toLocaleString()}</div>
      </div>
      <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);padding:22px;border-top:2px solid var(--s-warn);">
        <div style="font-family:var(--font-mono);font-size:0.625rem;color:var(--t3);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Pending Release</div>
        <div style="font-family:var(--font-display);font-size:2rem;font-weight:800;color:var(--s-warn);">$810</div>
      </div>
    </div>

    <!-- Chart -->
    <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);padding:22px;margin-bottom:28px;">
      <div class="sec-label" style="margin-bottom:20px;"><div class="sec-label-bar"></div><div class="sec-label-text">Monthly Earnings</div></div>
      <div class="chart-bars" style="height:120px;">
        ${earningMonths.map((v, i) => `
        <div class="chart-bar-wrap">
          <div class="chart-bar${i === earningMonths.length-1 ? ' current' : ''}"
               style="height:${Math.round((v/maxEarn)*112)}px;" title="${monthLabels[i]}: $${v.toLocaleString()}">
          </div>
          <span class="chart-month">${monthLabels[i]}</span>
        </div>`).join('')}
      </div>
    </div>

    <!-- Payout history -->
    <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);overflow:hidden;">
      <div style="padding:16px 20px;border-bottom:1px solid var(--c-wire);">
        <div class="sec-label" style="margin-bottom:0;"><div class="sec-label-bar"></div><div class="sec-label-text">Payout History</div></div>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:var(--c-raised);">
            <th style="padding:10px 20px;text-align:left;font-family:var(--font-mono);font-size:0.625rem;color:var(--t4);letter-spacing:0.1em;text-transform:uppercase;font-weight:600;">Date</th>
            <th style="padding:10px 20px;text-align:left;font-family:var(--font-mono);font-size:0.625rem;color:var(--t4);letter-spacing:0.1em;text-transform:uppercase;font-weight:600;">Description</th>
            <th style="padding:10px 20px;text-align:right;font-family:var(--font-mono);font-size:0.625rem;color:var(--t4);letter-spacing:0.1em;text-transform:uppercase;font-weight:600;">Amount</th>
            <th style="padding:10px 20px;text-align:center;font-family:var(--font-mono);font-size:0.625rem;color:var(--t4);letter-spacing:0.1em;text-transform:uppercase;font-weight:600;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${payouts.map(row => `
          <tr style="border-top:1px solid var(--c-wire);">
            <td style="padding:13px 20px;font-size:0.8125rem;color:var(--t2);">${row.date}</td>
            <td style="padding:13px 20px;font-size:0.875rem;color:var(--t1);">${row.desc}</td>
            <td style="padding:13px 20px;text-align:right;font-family:var(--font-mono);font-size:0.875rem;font-weight:700;color:var(--signal);">+$${row.amount.toLocaleString()}</td>
            <td style="padding:13px 20px;text-align:center;">
              <span style="background:var(--s-ok-d);color:var(--s-ok);font-family:var(--font-mono);font-size:0.625rem;font-weight:700;padding:3px 10px;border-radius:var(--r-full);">${row.status}</span>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>

  </div>
  ${closeShell()}`);
}

// ─── ORDERS ────────────────────────────────────────────────────────────────────
export function ordersPage(): string {
  const userProjects = projects.filter(p => p.buyerId === demoUser.id || p.sellerId === demoUser.id);
  return shell('Orders — ArtistCollab', DASH_STYLES, authedNav() + appSidebar('orders') + `
  <div class="app-page">
    <h1 style="font-family:var(--font-display);font-size:1.375rem;font-weight:800;color:var(--t1);margin-bottom:24px;">Orders</h1>
    <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);overflow:hidden;">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:var(--c-raised);">
            ${['Project','With','Package','Amount','Status','Due',''].map(h =>
              `<th style="padding:11px 16px;text-align:left;font-family:var(--font-mono);font-size:0.6rem;color:var(--t4);letter-spacing:0.1em;text-transform:uppercase;font-weight:600;">${h}</th>`
            ).join('')}
          </tr>
        </thead>
        <tbody>
          ${userProjects.map(p => {
            const cid = p.buyerId === demoUser.id ? p.sellerId : p.buyerId;
            const cp  = getUserById(cid);
            return `
          <tr style="border-top:1px solid var(--c-wire);cursor:pointer;transition:background 0.1s;" onclick="location.href='/workspace/${p.id}'"
              onmouseover="this.style.background='var(--c-raised)'" onmouseout="this.style.background=''">
            <td style="padding:12px 16px;font-size:0.875rem;font-weight:600;color:var(--t1);">${p.title}</td>
            <td style="padding:12px 16px;">
              <div style="display:flex;align-items:center;gap:8px;">
                <img src="${cp?.profileImage || ''}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;" alt="${cp?.artistName}">
                <span style="font-size:0.8125rem;color:var(--t2);">${cp?.artistName || '—'}</span>
              </div>
            </td>
            <td style="padding:12px 16px;font-size:0.8125rem;color:var(--t2);">${p.package}</td>
            <td style="padding:12px 16px;font-family:var(--font-mono);font-size:0.875rem;font-weight:700;color:var(--t1);">${formatPrice(p.orderTotal)}</td>
            <td style="padding:12px 16px;">
              <span style="background:${statusColor(p.status)}22;color:${statusColor(p.status)};font-family:var(--font-mono);font-size:0.6rem;font-weight:700;padding:3px 8px;border-radius:var(--r-full);">
                ${statusLabel(p.status)}
              </span>
            </td>
            <td style="padding:12px 16px;font-size:0.8125rem;color:var(--t2);">${new Date(p.dueDate).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</td>
            <td style="padding:12px 16px;">
              <a href="/workspace/${p.id}" style="font-size:0.75rem;color:var(--patch);text-decoration:none;">View →</a>
            </td>
          </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>
  ${closeShell()}`);
}

// ─── LISTINGS ────────────────────────────────────────────────────────────────
export function listingsPage(): string {
  const userListings = listings.filter(l => l.userId === demoUser.id);
  const activeCount  = userListings.filter(l => l.active).length;

  return shell('My Services — ArtistCollab', DASH_STYLES, authedNav() + appSidebar('listings') + `
  <div class="app-page">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
      <div>
        <h1 style="font-family:var(--font-display);font-size:1.375rem;font-weight:800;color:var(--t1);margin-bottom:4px;">My Services</h1>
        <p style="font-size:0.875rem;color:var(--t2);">${activeCount} active · ${userListings.length - activeCount} paused</p>
      </div>
      <a href="/dashboard/listings/new" class="btn btn-primary"><i class="fas fa-plus"></i> Add Service</a>
    </div>

    ${userListings.map(l => {
      const basePkg = l.packages?.[0];
      return `
    <div style="background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);padding:20px;margin-bottom:12px;display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap;">
      <div style="flex:1;min-width:200px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
          <span style="font-size:0.9375rem;font-weight:700;color:var(--t1);">${l.title}</span>
          <span style="background:${l.active ? 'var(--s-ok-d)' : 'var(--c-raised)'};color:${l.active ? 'var(--s-ok)' : 'var(--t3)'};font-family:var(--font-mono);font-size:0.6rem;font-weight:700;padding:3px 8px;border-radius:var(--r-full);">
            ${l.active ? 'ACTIVE' : 'PAUSED'}
          </span>
        </div>
        <div style="font-size:0.75rem;color:var(--t3);font-family:var(--font-mono);margin-bottom:10px;">${l.category}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          ${(l.packages || []).map(pkg => `
          <span style="background:var(--c-raised);border:1px solid var(--c-rim);border-radius:var(--r-full);padding:3px 10px;font-size:0.6875rem;color:var(--t2);font-family:var(--font-mono);">
            ${pkg.name} · $${pkg.price}
          </span>`).join('')}
        </div>
      </div>
      <div style="display:flex;gap:20px;align-items:center;flex-shrink:0;">
        <div style="text-align:center;">
          <div style="font-family:var(--font-mono);font-size:0.875rem;font-weight:700;color:var(--t1);">${l.orders}</div>
          <div style="font-size:0.625rem;color:var(--t4);text-transform:uppercase;letter-spacing:0.06em;">Orders</div>
        </div>
        <div style="text-align:center;">
          <div style="font-family:var(--font-mono);font-size:0.875rem;font-weight:700;color:var(--s-warn);">${l.rating.toFixed(1)}★</div>
          <div style="font-size:0.625rem;color:var(--t4);text-transform:uppercase;letter-spacing:0.06em;">Rating</div>
        </div>
        <div style="text-align:center;">
          <div style="font-family:var(--font-mono);font-size:0.875rem;font-weight:700;color:var(--signal);">$${basePkg?.price || 0}</div>
          <div style="font-size:0.625rem;color:var(--t4);text-transform:uppercase;letter-spacing:0.06em;">From</div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="alert('Edit coming in next release')">Edit</button>
      </div>
    </div>`;
    }).join('') || `
    <div style="text-align:center;padding:80px 24px;background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);">
      <i class="fas fa-store" style="font-size:2.5rem;color:var(--t4);margin-bottom:16px;display:block;"></i>
      <p style="color:var(--t3);margin-bottom:20px;">You haven't created any services yet.</p>
      <a href="/dashboard/listings/new" class="btn btn-primary">Create First Service</a>
    </div>`}
  </div>
  ${closeShell()}`);
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────
export function settingsPage(): string {
  return shell('Settings — ArtistCollab', DASH_STYLES + `
  .sett-layout { display:grid;grid-template-columns:200px 1fr;gap:24px;align-items:start; }
  .sett-nav { background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);overflow:hidden;position:sticky;top:76px; }
  .sett-nav-item { display:flex;align-items:center;gap:10px;padding:13px 16px;font-size:0.875rem;color:var(--t2);cursor:pointer;border-bottom:1px solid var(--c-wire);transition:background 0.1s,color 0.1s;text-decoration:none; }
  .sett-nav-item:last-child{border-bottom:none;}
  .sett-nav-item.active,.sett-nav-item:hover{background:var(--c-raised);color:var(--t1);}
  .sett-nav-item i{font-size:13px;width:16px;text-align:center;color:var(--t3);}
  .sett-card{background:var(--c-panel);border:1px solid var(--c-wire);border-radius:var(--r-lg);padding:24px;margin-bottom:16px;}
  .sett-field{margin-bottom:16px;}
  .sett-label{display:block;font-size:0.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--t3);margin-bottom:6px;}
  .sett-input{width:100%;background:var(--c-raised);border:1px solid var(--c-rim);border-radius:var(--r-md);padding:11px 14px;color:var(--t1);font-size:0.9375rem;font-family:var(--font-body);outline:none;transition:border-color 0.15s;}
  .sett-input:focus{border-color:var(--signal);}
  .sett-toggle{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--c-wire);}
  .sett-toggle:last-child{border-bottom:none;}
  .toggle-switch{width:40px;height:22px;background:var(--c-rim);border-radius:11px;cursor:pointer;position:relative;transition:background 0.2s;}
  .toggle-switch.on{background:var(--signal);}
  .toggle-switch::after{content:'';position:absolute;width:16px;height:16px;border-radius:50%;background:#fff;top:3px;left:3px;transition:transform 0.2s;}
  .toggle-switch.on::after{transform:translateX(18px);}
  @media(max-width:768px){.sett-layout{grid-template-columns:1fr;}.sett-nav{display:none;}}
  `, authedNav() + appSidebar('settings') + `
  <div class="app-page">
    <h1 style="font-family:var(--font-display);font-size:1.375rem;font-weight:800;color:var(--t1);margin-bottom:24px;">Settings</h1>
    <div class="sett-layout">
      <nav class="sett-nav">
        <a class="sett-nav-item active" href="#profile"><i class="fas fa-user"></i> Profile</a>
        <a class="sett-nav-item" href="#notifications"><i class="fas fa-bell"></i> Notifications</a>
        <a class="sett-nav-item" href="#payout"><i class="fas fa-credit-card"></i> Payout</a>
        <a class="sett-nav-item" href="#security"><i class="fas fa-lock"></i> Security</a>
        <a class="sett-nav-item" href="#danger" style="color:var(--channel);"><i class="fas fa-exclamation-triangle"></i> Danger</a>
      </nav>

      <div>
        <!-- Profile -->
        <div class="sett-card" id="profile">
          <div class="sec-label" style="margin-bottom:20px;"><div class="sec-label-bar"></div><div class="sec-label-text">Profile</div></div>
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid var(--c-wire);">
            <img src="${demoUser.profileImage}" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:2px solid var(--c-rim);" alt="${demoUser.artistName}">
            <div>
              <button class="btn btn-secondary btn-sm">Change Photo</button>
              <div style="font-size:0.75rem;color:var(--t4);margin-top:6px;">JPG or PNG, max 5MB</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
            <div class="sett-field">
              <label class="sett-label">Display Name</label>
              <input class="sett-input" type="text" value="${demoUser.artistName}">
            </div>
            <div class="sett-field">
              <label class="sett-label">Username</label>
              <input class="sett-input" type="text" value="@${demoUser.username}">
            </div>
          </div>
          <div class="sett-field">
            <label class="sett-label">Bio</label>
            <textarea class="sett-input" rows="3" style="resize:vertical;">${demoUser.bio}</textarea>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
            <div class="sett-field">
              <label class="sett-label">Location</label>
              <input class="sett-input" type="text" value="${demoUser.location}">
            </div>
            <div class="sett-field">
              <label class="sett-label">Starting Price ($)</label>
              <input class="sett-input" type="number" value="${demoUser.startingPrice}">
            </div>
          </div>
          <button class="btn btn-primary" onclick="alert('Profile saved!')">Save Profile</button>
        </div>

        <!-- Notifications -->
        <div class="sett-card" id="notifications">
          <div class="sec-label" style="margin-bottom:20px;"><div class="sec-label-bar"></div><div class="sec-label-text">Notifications</div></div>
          ${[
            ['Project requests', true],
            ['Messages', true],
            ['Delivery confirmations', true],
            ['Payment received', true],
            ['Split sheet approvals', true],
            ['Live session invites', true],
            ['Marketing emails', false],
          ].map(([label, on]) => `
          <div class="sett-toggle">
            <span style="font-size:0.875rem;color:var(--t1);">${label}</span>
            <div class="toggle-switch${on ? ' on' : ''}" onclick="this.classList.toggle('on')"></div>
          </div>`).join('')}
        </div>

        <!-- Payout -->
        <div class="sett-card" id="payout">
          <div class="sec-label" style="margin-bottom:20px;"><div class="sec-label-bar"></div><div class="sec-label-text">Payout Method</div></div>
          <div style="background:var(--c-raised);border:1px solid var(--c-rim);border-radius:var(--r-lg);padding:16px;display:flex;align-items:center;gap:14px;margin-bottom:16px;">
            <i class="fas fa-university" style="color:var(--t3);font-size:1.25rem;"></i>
            <div>
              <div style="font-size:0.875rem;font-weight:600;color:var(--t1);">Bank Account ****4892</div>
              <div style="font-size:0.75rem;color:var(--t3);">Primary · Verified</div>
            </div>
            <span style="margin-left:auto;background:var(--s-ok-d);color:var(--s-ok);font-family:var(--font-mono);font-size:0.6rem;font-weight:700;padding:3px 8px;border-radius:var(--r-full);">DEFAULT</span>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="alert('Connect payout method coming with Stripe integration')">
            <i class="fas fa-plus"></i> Add Payout Method
          </button>
        </div>

        <!-- Danger zone -->
        <div class="sett-card" id="danger" style="border-color:var(--channel-dim);">
          <div class="sec-label" style="margin-bottom:16px;"><div class="sec-label-bar" style="background:var(--channel);"></div><div class="sec-label-text" style="color:var(--channel);">Danger Zone</div></div>
          <p style="font-size:0.875rem;color:var(--t2);margin-bottom:16px;">Deleting your account is permanent and cannot be undone.</p>
          <button class="btn btn-sm" style="background:var(--channel-dim);color:var(--channel);border:1px solid var(--channel-dim);" onclick="confirm('Are you sure? This cannot be undone.') && alert('Account deletion requires email confirmation.')">
            <i class="fas fa-trash"></i> Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
  ${closeShell()}`);
}
