import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src"

def save(rel_path, content):
    full = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Created frontend: {rel_path}")

# 1. services/api.js
save("services/api.js", """const API_BASE = '/api/v1';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error('Authentication failed');
    return res.json();
  },

  async getDashboardSummary() {
    const res = await fetch(`${API_BASE}/dashboard/summary`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard summary');
    return res.json();
  },

  async getProjects(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/projects?${query}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async getProjectById(projectId) {
    const res = await fetch(`${API_BASE}/projects/${projectId}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error(`Failed to fetch project ${projectId}`);
    return res.json();
  },

  async getPayments(projectId) {
    const res = await fetch(`${API_BASE}/projects/${projectId}/payments`, {
      headers: getHeaders()
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getProgress(projectId) {
    const res = await fetch(`${API_BASE}/projects/${projectId}/progress`, {
      headers: getHeaders()
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getRiskAssessment(projectId) {
    const res = await fetch(`${API_BASE}/projects/${projectId}/risk`, {
      headers: getHeaders()
    });
    if (!res.ok) return null;
    return res.json();
  },

  async runRiskAnalysis(projectId) {
    const res = await fetch(`${API_BASE}/projects/${projectId}/analyze`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to run risk analysis pipeline');
    return res.json();
  },

  async getNearbyProjects(projectId, radiusKm = 5.0) {
    const res = await fetch(`${API_BASE}/projects/nearby?projectId=${projectId}&radiusKm=${radiusKm}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch nearby projects');
    return res.json();
  },

  async getMapProjects() {
    const res = await fetch(`${API_BASE}/projects/map`, {
      headers: getHeaders()
    });
    if (!res.ok) return [];
    return res.json();
  },

  async generateReport(projectId) {
    const res = await fetch(`${API_BASE}/reports/${projectId}`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to generate report');
    return res.json();
  }
};
""")

# 2. services/auth.js
save("services/auth.js", """export const authService = {
  login(userData) {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
  },
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};
""")

# 3. components/RiskBadge.jsx
save("components/RiskBadge.jsx", """import React from 'react';

export default function RiskBadge({ level, score }) {
  const lvl = (level || 'LOW').toUpperCase();
  
  const styles = {
    CRITICAL: 'bg-red-100 text-red-800 border-red-300 ring-1 ring-red-500/20 font-bold',
    HIGH: 'bg-orange-100 text-orange-800 border-orange-300 ring-1 ring-orange-500/20 font-semibold',
    MEDIUM: 'bg-amber-100 text-amber-800 border-amber-300 ring-1 ring-amber-500/20 font-medium',
    LOW: 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-1 ring-emerald-500/20 font-medium'
  };

  const dots = {
    CRITICAL: 'bg-red-600 animate-pulse',
    HIGH: 'bg-orange-500',
    MEDIUM: 'bg-amber-500',
    LOW: 'bg-emerald-500'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${styles[lvl] || styles.LOW}`}>
      <span className={`w-2 h-2 rounded-full ${dots[lvl] || dots.LOW}`} />
      <span>{lvl}</span>
      {score !== undefined && (
        <span className="ml-1 px-1.5 py-0.2 bg-white/70 rounded text-[11px] font-mono">
          {score}
        </span>
      )}
    </span>
  );
}
""")

# 4. components/StatusBadge.jsx
save("components/StatusBadge.jsx", """import React from 'react';

export default function StatusBadge({ status }) {
  const st = (status || 'UNKNOWN').toUpperCase();

  const styles = {
    RECOMMENDED: 'bg-slate-100 text-slate-700 border-slate-300',
    SANCTIONED: 'bg-blue-100 text-blue-800 border-blue-300',
    IN_PROGRESS: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    DELAYED: 'bg-orange-100 text-orange-800 border-orange-300',
    OVERDUE: 'bg-red-100 text-red-800 border-red-300',
    COMPLETED: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  };

  const formatText = (text) => text.replace('_', ' ');

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[st] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
      {formatText(st)}
    </span>
  );
}
""")

# 5. components/KPICard.jsx
save("components/KPICard.jsx", """import React from 'react';

export default function KPICard({ title, value, subtitle, icon: Icon, color = 'blue', trend }) {
  const colorStyles = {
    red: 'bg-red-50 text-red-600 border-red-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200'
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1.5 font-mono">{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg border ${colorStyles[color] || colorStyles.blue}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      {subtitle && (
        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
          {subtitle}
        </p>
      )}
    </div>
  );
}
""")

# 6. components/Navbar.jsx
save("components/Navbar.jsx", """import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, LogOut, Bell, FileText, Database } from 'lucide-react';
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
    <header className="bg-gov-navy text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      {/* Top micro-bar */}
      <div className="bg-[#051829] px-6 py-1 text-[11px] text-slate-400 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">Government of India</span>
          <span>•</span>
          <span>Ministry of Statistics and Programme Implementation (MoSPI)</span>
          <span>•</span>
          <span className="text-amber-400 font-medium">Smart India Hackathon 2026 (SIH26102)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Prototype / Synthetic Demonstration Data
          </span>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-600 to-blue-700 p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-gov-navy rounded-[7px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white font-sans">MPLADS SENTINEL</span>
              <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded border border-amber-500/30">STAGE-2 PROTOTYPE</span>
            </div>
            <p className="text-xs text-slate-400">Intelligent Monitoring & Risk Prioritization Command Center</p>
          </div>
        </div>

        {/* Right side user menu */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-semibold text-slate-100">{user.fullName}</span>
            <span className="text-xs text-amber-300/90">{user.designation} • {user.district} ({user.state})</span>
          </div>

          <div className="h-8 w-px bg-slate-700 hidden md:block" />

          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-red-950/40 hover:border-red-600/50 border border-slate-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
""")

# 7. components/Sidebar.jsx
save("components/Sidebar.jsx", """import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  AlertTriangle, 
  MapPin, 
  FileSearch, 
  FileCheck2, 
  SlidersHorizontal,
  Info
} from 'lucide-react';

export default function Sidebar() {
  const links = [
    { to: '/dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'MPLADS Project Registry', icon: FolderKanban },
    { to: '/projects/MPL-10482', label: 'Flagship Demo (MPL-10482)', icon: AlertTriangle, highlight: true },
    { to: '/investigation/MPL-10482', label: 'Investigation Workspace', icon: FileSearch },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-5rem)] flex flex-col justify-between p-4 shadow-sm">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Navigation</p>
          <nav className="space-y-1">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-800 border border-blue-200 font-semibold shadow-xs'
                        : item.highlight
                        ? 'text-orange-700 bg-orange-50/70 hover:bg-orange-100/70 border border-orange-200/60 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className={`w-4 h-4 ${item.highlight ? 'text-orange-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Analytics & Rules</p>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/80 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-700">
              <span>Rule Engine (7 Rules)</span>
              <span className="font-mono text-emerald-600 font-bold">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span>Isolation Forest (IF)</span>
              <span className="font-mono text-emerald-600 font-bold">READY</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span>Local Outlier Factor (LOF)</span>
              <span className="font-mono text-emerald-600 font-bold">READY</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span>Benford Law Engine</span>
              <span className="font-mono text-emerald-600 font-bold">READY</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span>GIS Proximity Engine</span>
              <span className="font-mono text-emerald-600 font-bold">ONLINE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Label Footer */}
      <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 text-xs text-amber-900 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-amber-800">
          <Info className="w-4 h-4" />
          <span>SIH 2026 Notice</span>
        </div>
        <p className="text-[11px] leading-tight text-amber-700">
          Prototype / Synthetic Demonstration Data. Complies with legal non-accusatory analytical guidelines.
        </p>
      </div>
    </aside>
  );
}
""")

print("Navbar, Sidebar, Badges, and KPI Cards written.")