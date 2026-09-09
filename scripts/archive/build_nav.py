import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src"

navbar_code = """import React from 'react';
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
      <div className="bg-[#071321] border-b border-slate-800/80 px-6 py-1 text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">भारत सरकार</span>
            <span>•</span>
            <span className="font-semibold text-slate-300">GOVERNMENT OF INDIA</span>
            <span>•</span>
            <span className="text-slate-400 hidden sm:inline">Ministry of Statistics and Programme Implementation (MoSPI)</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              National Telemetry Active
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white font-sans">MPLADS SENTINEL</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-300 font-mono font-medium rounded border border-slate-700">
                MoSPI MONITORING
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none">Intelligent Project Risk & Governance Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex flex-col text-right">
            <span className="font-semibold text-slate-200">{user.fullName}</span>
            <span className="text-slate-400 text-[11px] font-mono">{user.designation} • {user.district} ({user.state})</span>
          </div>

          <div className="h-5 w-px bg-slate-700 hidden sm:block" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
"""

with open(os.path.join(BASE, "components", "Navbar.jsx"), "w", encoding="utf-8") as f:
    f.write(navbar_code.strip())
print("Navbar updated.")