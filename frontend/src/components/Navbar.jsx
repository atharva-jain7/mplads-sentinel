import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, Shield } from 'lucide-react';
import { authService } from '../services/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const user = authService.getUser() || {
    roleId: 'MINISTRY',
    fullName: 'Dr. Alok Verma, IAS',
    role: 'CENTRAL_MINISTRY',
    designation: 'Joint Secretary, MoSPI',
    jurisdiction: 'National Central Oversight (All India)',
    district: 'All India',
    state: 'National'
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getRoleBadge = (roleId) => {
    switch (roleId) {
      case 'MP':
        return { label: 'MEMBER OF PARLIAMENT', style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'STATE':
        return { label: 'STATE NODAL AUTHORITY', style: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
      case 'DISTRICT':
        return { label: 'DISTRICT AUTHORITY', style: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      default:
        return { label: 'THE MINISTRY (MoSPI)', style: 'bg-amber-400/10 text-amber-400 border-amber-400/30' };
    }
  };

  const badge = getRoleBadge(user.roleId);

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
              <span className={`text-[10px] px-1.5 py-0.5 font-mono font-bold rounded border ${badge.style}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none">Decision Support & Monitoring Platform</p>
          </div>
        </div>



        {/* Read-Only Authenticated Jurisdiction */}
        <div className="hidden xl:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400 text-[11px]">Jurisdiction:</span>
          <span className="font-semibold text-slate-200 font-mono text-[11px]">
            {user.jurisdiction || user.district || 'National Central Oversight'}
          </span>
        </div>


        <div className="flex items-center gap-4 text-xs">
          <div className="hidden lg:flex flex-col text-right">
            <span className="font-semibold text-slate-100">{user.fullName}</span>
            <span className="text-slate-400 text-[11px] font-mono">{user.designation || user.role}</span>
          </div>

          <div className="h-5 w-px bg-slate-700 hidden lg:block" />

          <button
            onClick={handleLogout}
            title="Sign out of current role"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950/50 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-800/60 transition-colors cursor-pointer shrink-0 text-xs font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}