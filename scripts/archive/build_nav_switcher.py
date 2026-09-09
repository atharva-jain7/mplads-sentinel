import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src"

navbar_code = """import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, User, Globe, Building, Landmark, UserCheck } from 'lucide-react';
import { authService } from '../services/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const user = authService.getUser() || {
    roleId: 'MINISTRY',
    fullName: 'Dr. Alok Verma, IAS',
    role: 'CENTRAL_MINISTRY',
    designation: 'Joint Secretary, MoSPI',
    jurisdiction: 'National Central Oversight',
    district: 'All India',
    state: 'National'
  };

  const handleQuickSwitch = (roleId) => {
    let userData;
    if (roleId === 'MINISTRY') {
      userData = {
        token: 'token-ministry-2026',
        username: 'ministry@nic.in',
        fullName: 'Dr. Alok Verma, IAS',
        role: 'CENTRAL_MINISTRY',
        roleId: 'MINISTRY',
        designation: 'Joint Secretary, MoSPI',
        jurisdiction: 'National Central Oversight (All India)',
        district: 'All India',
        state: 'National'
      };
    } else if (roleId === 'STATE') {
      userData = {
        token: 'token-state-2026',
        username: 'state.nodal@maharashtra.gov.in',
        fullName: 'Sunita Patil, IAS',
        role: 'STATE_NODAL_AUTHORITY',
        roleId: 'STATE',
        designation: 'Secretary, Planning Dept',
        jurisdiction: 'Maharashtra State Nodal Authority',
        district: 'State Level',
        state: 'Maharashtra'
      };
    } else {
      userData = {
        token: 'token-mp-2026',
        username: 'mp.pune@sansad.nic.in',
        fullName: "Hon'ble MP (Pune Constituency)",
        role: 'MEMBER_OF_PARLIAMENT',
        roleId: 'MP',
        designation: 'Member of Parliament, Lok Sabha',
        jurisdiction: 'Pune Parliamentary Constituency',
        district: 'Pune',
        state: 'Maharashtra'
      };
    }

    authService.login(userData);
    window.location.reload();
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-800 font-sans">
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
            <span className="inline-flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              National Sentinel Active
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => navigate('/dashboard')}>
          <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white font-sans">MPLADS SENTINEL</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-amber-400 font-mono font-bold rounded border border-slate-700">
                {user.roleId || 'MINISTRY'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none">Decision Support & Monitoring Platform</p>
          </div>
        </div>

        {/* Instant Role Switcher Bar */}
        <div className="hidden md:flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 text-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase px-2 tracking-wider">
            View Role:
          </span>
          <button
            type="button"
            onClick={() => handleQuickSwitch('MINISTRY')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              user.roleId === 'MINISTRY'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            The Ministry (All-India)
          </button>
          <button
            type="button"
            onClick={() => handleQuickSwitch('STATE')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              user.roleId === 'STATE'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            State Nodal (Maharashtra)
          </button>
          <button
            type="button"
            onClick={() => handleQuickSwitch('MP')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              user.roleId === 'MP'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            Member of Parliament (Pune)
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden lg:flex flex-col text-right">
            <span className="font-semibold text-slate-100">{user.fullName}</span>
            <span className="text-slate-400 text-[11px] font-mono">{user.jurisdiction}</span>
          </div>

          <div className="h-5 w-px bg-slate-700 hidden lg:block" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-700 shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
"""

with open(os.path.join(BASE, "components", "Navbar.jsx"), "w", encoding="utf-8") as f:
    f.write(navbar_code.strip())

print("Navbar updated with instant role switcher.")