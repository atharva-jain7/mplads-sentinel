import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src"

def save(rel_path, content):
    full = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Refactored: {rel_path}")

# ==========================================
# 1. RiskBadge.jsx & StatusBadge.jsx
# ==========================================
save("components/RiskBadge.jsx", """import React from 'react';

export default function RiskBadge({ level, score }) {
  const lvl = (level || 'LOW').toUpperCase();
  
  const styles = {
    CRITICAL: 'bg-red-50 text-red-700 border-red-200',
    HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
    LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  const dotColors = {
    CRITICAL: 'bg-red-500',
    HIGH: 'bg-orange-500',
    MEDIUM: 'bg-amber-500',
    LOW: 'bg-emerald-500'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${styles[lvl] || styles.LOW}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[lvl] || dotColors.LOW}`} />
      <span>{lvl}</span>
      {score !== undefined && (
        <span className="font-mono font-semibold ml-0.5 text-[11px] opacity-80">
          ({score})
        </span>
      )}
    </span>
  );
}
""")

save("components/StatusBadge.jsx", """import React from 'react';

export default function StatusBadge({ status }) {
  const st = (status || 'UNKNOWN').toUpperCase();

  const styles = {
    RECOMMENDED: 'bg-slate-100 text-slate-700 border-slate-200',
    SANCTIONED: 'bg-blue-50 text-blue-700 border-blue-200',
    IN_PROGRESS: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    DELAYED: 'bg-orange-50 text-orange-700 border-orange-200',
    OVERDUE: 'bg-red-50 text-red-700 border-red-200',
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  const formatText = (text) => text.replace('_', ' ');

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[st] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {formatText(st)}
    </span>
  );
}
""")

# ==========================================
# 2. KPICard.jsx
# ==========================================
save("components/KPICard.jsx", """import React from 'react';

export default function KPICard({ title, value, subtitle, icon: Icon, color = 'slate' }) {
  const iconColors = {
    red: 'text-red-600 bg-red-50',
    orange: 'text-orange-600 bg-orange-50',
    amber: 'text-amber-600 bg-amber-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    blue: 'text-blue-600 bg-blue-50',
    slate: 'text-slate-600 bg-slate-100'
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        {Icon && (
          <div className={`p-2 rounded-lg ${iconColors[color] || iconColors.slate}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-2">
        <h3 className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
          {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
        </h3>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
""")

# ==========================================
# 3. Navbar.jsx
# ==========================================
save("components/Navbar.jsx", """import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut } from 'lucide-react';
import { authService } from '../services/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const user = authService.getUser() || {
    fullName: 'Rajesh Sharma',
    role: 'DISTRICT_MONITORING_OFFICER',
    designation: 'Deputy Commissioner / Nodal Officer',
    district: 'Pune',
    state: 'Maharashtra'
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white">MPLADS SENTINEL</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-300 font-medium rounded border border-slate-700">
                MoSPI
              </span>
            </div>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex flex-col text-right">
            <span className="font-semibold text-slate-200">{user.fullName}</span>
            <span className="text-slate-400 text-[11px]">{user.district}, {user.state}</span>
          </div>

          <div className="h-5 w-px bg-slate-700 hidden sm:block" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
""")

# ==========================================
# 4. Sidebar.jsx
# ==========================================
save("components/Sidebar.jsx", """import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  AlertCircle, 
  FileSearch
} from 'lucide-react';

export default function Sidebar() {
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'Project Registry', icon: FolderKanban },
    { to: '/projects/MPL-10482', label: 'Demo Case (MPL-10482)', icon: AlertCircle, highlight: true },
    { to: '/investigation/MPL-10482', label: 'Investigation Workspace', icon: FileSearch },
  ];

  return (
    <aside className="w-56 bg-slate-50 border-r border-slate-200 min-h-[calc(100vh-3.5rem)] p-4 flex flex-col justify-between">
      <div>
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Menu</p>
        <nav className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold'
                      : item.highlight
                      ? 'text-orange-700 hover:bg-orange-50/70 font-semibold'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  }`
                }
              >
                <Icon className={`w-4 h-4 ${item.highlight ? 'text-orange-600' : ''}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-500">
        <p className="font-semibold text-slate-700 mb-0.5">Monitoring Active</p>
        <p className="text-[10px] leading-tight text-slate-400">
          Automated multi-signal anomaly screening.
        </p>
      </div>
    </aside>
  );
}
""")

print("Common components updated cleanly.")