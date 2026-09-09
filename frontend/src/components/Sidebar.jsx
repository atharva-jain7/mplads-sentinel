import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  AlertCircle, 
  FileSearch,
  UploadCloud,
  Lock
} from 'lucide-react';
import { authService } from '../services/auth';

export default function Sidebar() {
  const user = authService.getUser();
  const isMP = user.roleId === 'MP';
  const isState = user.roleId === 'STATE';

  const links = [
    { to: '/dashboard', label: isMP ? 'Constituency Cockpit' : 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: isMP ? 'My Constituency Works' : 'Project Registry', icon: FolderKanban },
    { to: '/import', label: 'Import Real Data (CSV)', icon: UploadCloud },
    { to: '/projects/MPL-10482', label: 'Priority Case (MPL-10482)', icon: AlertCircle, highlight: true },
    { to: '/investigation/MPL-10482', label: 'Investigation Workspace', icon: FileSearch },
  ];

  return (
    <aside className="w-56 bg-slate-50 border-r border-slate-200 min-h-[calc(100vh-3.5rem)] p-4 flex flex-col justify-between font-sans">
      <div>
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Navigation</p>
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

      <div className="p-3 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-500 space-y-1">
        <div className="flex items-center gap-1 font-semibold text-slate-800">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Role-Based Access</span>
        </div>
        <p className="text-[10px] leading-tight text-slate-400">
          {isMP 
            ? 'Constrained to Pune Parliamentary Constituency works.' 
            : isState 
            ? 'State-wide jurisdiction (Maharashtra State).' 
            : 'Pan-India surveillance authorization active.'}
        </p>
      </div>
    </aside>
  );
}