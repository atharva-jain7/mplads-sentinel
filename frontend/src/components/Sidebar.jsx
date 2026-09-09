import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Flame,
  FolderKanban, 
  AlertCircle, 
  FileSearch,
  UploadCloud,
  PlusCircle,
  Lock
} from 'lucide-react';
import { authService } from '../services/auth';

export default function Sidebar() {
  const user = authService.getUser();
  const isMP = user.roleId === 'MP';
  const isState = user.roleId === 'STATE';

  const links = [
    { to: '/dashboard', label: isMP ? 'Constituency Cockpit' : 'Dashboard', icon: LayoutDashboard },
    { to: '/rankings', label: 'Critical Risk Rankings', icon: Flame, badge: 'TOP' },
    { to: '/projects', label: isMP ? 'My Constituency Works' : 'Project Registry', icon: FolderKanban },
    { to: '/projects/MPL-10482', label: 'Priority Case (MPL-10482)', icon: AlertCircle, highlight: true },
    { to: '/investigation/MPL-10482', label: 'Investigation Workspace', icon: FileSearch },
  ];

  return (
    <aside className="w-60 bg-slate-50 border-r border-slate-200 min-h-[calc(100vh-3.5rem)] p-4 flex flex-col justify-between font-sans shrink-0">
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
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold'
                      : item.highlight
                      ? 'text-orange-700 hover:bg-orange-50/70 font-semibold'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${item.highlight ? 'text-orange-600' : ''}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 bg-red-600 text-white rounded font-bold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom-Left Navigation: Updating Data or Adding New Project Data */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div>
          <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Data Ingestion & Updates
          </p>
          <NavLink
            to="/import"
            className={({ isActive }) =>
              `flex items-start gap-2.5 p-3 rounded-xl border transition-all ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white hover:bg-slate-100/90 border-slate-200 text-slate-800 shadow-xs'
              }`
            }
          >
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 mt-0.5">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <span>Update / Ingest Data</span>
                <PlusCircle className="w-3 h-3 text-blue-600 shrink-0" />
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                Add real CSV works or update execution records
              </p>
            </div>
          </NavLink>
        </div>

        {/* Role-Based Access Indicator */}
        <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
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
      </div>
    </aside>
  );
}
