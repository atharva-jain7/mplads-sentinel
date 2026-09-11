import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AlertTriangle,
  FolderKanban, 
  Compass,
  BarChart3,
  FileSearch,
  FileText,
  UploadCloud
} from 'lucide-react';
import { authService } from '../services/auth';

export default function Sidebar() {
  const user = authService.getUser();
  const isMP = user?.roleId === 'MP';

  const navItems = [
    { to: '/dashboard', label: isMP ? 'Constituency Cockpit' : 'Overview', icon: LayoutDashboard },
    { to: '/rankings', label: 'Priority Cases', icon: AlertTriangle, count: 12 },
    { to: '/projects', label: isMP ? 'Constituency Works' : 'Project Registry', icon: FolderKanban },
    { to: '/dashboard?tab=GIS', label: 'GIS Surveillance', icon: Compass },
    { to: '/dashboard?tab=ANALYTICS', label: 'Analytics', icon: BarChart3 },
    { to: '/investigation/MPL-10482', label: 'Investigations', icon: FileSearch },
    { to: '/reports/MPL-10482', label: 'Reports', icon: FileText },
  ];

  return (
    <aside className="w-56 bg-white border-r border-slate-200 min-h-[calc(100vh-3rem)] p-3 flex flex-col justify-between font-sans shrink-0">
      <div className="space-y-4">
        <div>
          <p className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Main Menu
          </p>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-900 text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.count && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Action: CSV Ingestion */}
      <div className="pt-3 border-t border-slate-200 space-y-1">
        <NavLink
          to="/import"
          className={({ isActive }) =>
            `flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              isActive
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 bg-slate-50/60'
            }`
          }
        >
          <UploadCloud className="w-4 h-4 text-slate-500" />
          <span>Import CSV Data</span>
        </NavLink>
        <div className="px-2 pt-1 text-[10px] text-slate-400 font-mono">
          Jurisdiction: {isMP ? 'Pune PC' : user?.roleId === 'DISTRICT' ? 'Pune Dist.' : 'Pan-India'}
        </div>
      </div>
    </aside>
  );
}
