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
    jurisdiction: 'National Central Oversight',
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
        return { label: 'MP', fullLabel: 'Member of Parliament', style: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      case 'STATE':
        return { label: 'STATE NODAL', fullLabel: 'State Nodal Authority', style: 'bg-blue-500/15 text-blue-400 border-blue-500/30' };
      case 'DISTRICT':
        return { label: 'DISTRICT NODAL', fullLabel: 'District Authority', style: 'bg-amber-500/15 text-amber-400 border-amber-500/30' };
      default:
        return { label: 'MINISTRY', fullLabel: 'MoSPI Central Ministry', style: 'bg-amber-400/15 text-amber-400 border-amber-400/30' };
    }
  };

  const badge = getRoleBadge(user.roleId);

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-3 text-xs">
        {/* Brand */}
        <div 
          className="flex items-center gap-2 cursor-pointer shrink-0" 
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold tracking-tight text-white font-mono">MPLADS SENTINEL</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 hidden sm:inline">
              SIH Prototype
            </span>
          </div>
        </div>

        {/* Center: Role & Jurisdiction (Single clean line) */}
        <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-300">
          <span className={`px-2 py-0.5 rounded font-mono font-bold border ${badge.style}`}>
            {badge.label}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Jurisdiction:</span>
          <span className="font-mono text-slate-200 font-semibold truncate max-w-[220px]">
            {user.jurisdiction || user.district || 'National'}
          </span>
        </div>

        {/* Right: User & Sign Out */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2 text-right text-[11px]">
            <span className="font-semibold text-slate-200">{user.fullName}</span>
            <span className="text-slate-500 font-mono">({user.designation || user.roleId})</span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden md:block" />

          <button
            onClick={handleLogout}
            title="Sign out"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer text-xs font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}