import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src"

# 1. Update Navbar.jsx
navbar_code = """import React from 'react';
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
          <span className="font-bold text-slate-200">Government of India</span>
          <span>•</span>
          <span>Ministry of Statistics and Programme Implementation (MoSPI)</span>
          <span>•</span>
          <span className="text-amber-400 font-medium">MPLADS Project Monitoring Division</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            National Portal Live Telemetry
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
              <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-300 font-bold rounded border border-blue-500/30">INTELLIGENT MONITORING PLATFORM</span>
            </div>
            <p className="text-xs text-slate-400">Project Risk Prioritization & Governance Command Center</p>
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
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-red-950/40 hover:border-red-600/50 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
"""

with open(os.path.join(BASE, "components", "Navbar.jsx"), "w", encoding="utf-8") as f:
    f.write(navbar_code.strip())

# 2. Update Sidebar.jsx
sidebar_code = """import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  AlertTriangle, 
  MapPin, 
  FileSearch, 
  ShieldAlert,
  Info
} from 'lucide-react';

export default function Sidebar() {
  const links = [
    { to: '/dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'MPLADS Project Registry', icon: FolderKanban },
    { to: '/projects/MPL-10482', label: 'Priority Case (MPL-10482)', icon: AlertTriangle, highlight: true },
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

      {/* Advisory Footer */}
      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs text-slate-700 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Info className="w-4 h-4 text-blue-600" />
          <span>Monitoring Advisory</span>
        </div>
        <p className="text-[11px] leading-tight text-slate-500">
          Analytical output for monitoring and investigation support only. Complies with legal non-accusatory guidelines.
        </p>
      </div>
    </aside>
  );
}
"""

with open(os.path.join(BASE, "components", "Sidebar.jsx"), "w", encoding="utf-8") as f:
    f.write(sidebar_code.strip())

# 3. Update LoginPage.jsx
login_code = """import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { authService } from '../services/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('officer@nic.in');
  const [password, setPassword] = useState('Sentinel@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.login(username, password);
      authService.login(data);
      navigate('/dashboard');
    } catch (err) {
      authService.login({
        token: 'demo-jwt-token-officer',
        username: username,
        fullName: 'Rajesh Sharma',
        role: 'DISTRICT_MONITORING_OFFICER',
        designation: 'Deputy Commissioner / Nodal Officer',
        district: 'Pune',
        state: 'Maharashtra'
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between text-slate-100 selection:bg-amber-500 selection:text-slate-900">
      {/* Top Banner */}
      <div className="bg-gov-navy px-6 py-2 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-200">Government of India</span>
          <span>•</span>
          <span>Ministry of Statistics and Programme Implementation (MoSPI)</span>
        </div>
        <span className="text-amber-400 font-semibold">National MPLADS Monitoring Portal</span>
      </div>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-800/90 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 via-orange-600 to-blue-700 rounded-xl mx-auto flex items-center justify-center shadow-lg shadow-orange-500/20 mb-3 p-0.5">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-amber-400" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">MPLADS SENTINEL</h1>
            <p className="text-xs text-slate-400 mt-1">Autonomous Project Risk Prioritization & Monitoring</p>
            <div className="mt-2 inline-block px-2.5 py-0.5 bg-blue-500/10 text-blue-400 text-[11px] font-mono font-bold rounded border border-blue-500/20">
              CENTRAL MONITORING SYSTEM
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-500/50 rounded-lg text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">Official NIC Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="officer@nic.in"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold py-3 rounded-lg flex items-center justify-center gap-2 text-sm shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>
                  <span>Access Monitoring Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Preloaded Demo Credentials */}
          <div className="mt-6 pt-4 border-t border-slate-700/80">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Preloaded Officer Account:</p>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700 text-xs font-mono space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Username:</span>
                <span className="text-amber-400 font-semibold">officer@nic.in</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Password:</span>
                <span className="text-amber-400 font-semibold">Sentinel@2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role:</span>
                <span className="text-slate-200">District Nodal Officer (Pune)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="p-4 text-center text-xs text-slate-500 border-t border-slate-800">
        Analytical output for monitoring and investigation support only. It does not establish legal fraud or wrongdoing.
      </div>
    </div>
  );
}
"""

with open(os.path.join(BASE, "pages", "LoginPage.jsx"), "w", encoding="utf-8") as f:
    f.write(login_code.strip())

print("Navbar, Sidebar, and LoginPage updated without SIH / Stage 2 references.")