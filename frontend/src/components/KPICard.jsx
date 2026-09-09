import React from 'react';
import Tooltip from './Tooltip';

export default function KPICard({ title, value, subtitle, icon: Icon, color = 'slate', description }) {
  const iconColors = {
    red: 'text-red-600 bg-red-50 border-red-100',
    orange: 'text-orange-600 bg-orange-50 border-orange-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    slate: 'text-slate-700 bg-slate-100 border-slate-200'
  };

  const defaultDescriptions = {
    'Total Works': 'Total active works registered across the selected jurisdiction under MPLADS guidelines.',
    'Monitored Works': 'Total active works registered across the selected jurisdiction under MPLADS guidelines.',
    'All-India Works': 'Total active works across all 543 Parliamentary Constituencies registered in e-SAKSHI.',
    'State Works': 'Total works registered under Maharashtra State Nodal Authority oversight.',
    'District Works': 'Total works sanctioned and executed in Pune District.',
    'Critical Priority': 'Composite Risk Index >= 80. Flagged by multi-signal anomaly models. Immediate on-site audit required.',
    'Critical Risk': 'Composite Risk Index >= 80. Flagged by multi-signal anomaly models. Immediate on-site audit required.',
    'High Attention': 'Risk Score 60 to 79. Elevated milestone lag or cost-to-progress mismatch detected.',
    'High Risk': 'Risk Score 60 to 79. Elevated milestone lag or cost-to-progress mismatch detected.',
    'Delayed Execution': 'Works that have exceeded their official sanctioned completion target date by more than 30 days.',
    'Delayed': 'Works that have exceeded their official sanctioned completion target date by more than 30 days.',
    'Cost Overruns': 'Works where expenditure disbursement velocity outpaces verified physical milestone completion by > 20%.',
    'Cost Anomalies': 'Works where expenditure disbursement velocity outpaces verified physical milestone completion by > 20%.',
    'Duplicate Overlaps': 'Works identified within a 3.0 km geospatial radius sharing identical category, scope, or repetitive funding.',
    'Duplicates': 'Works identified within a 3.0 km geospatial radius sharing identical category, scope, or repetitive funding.'
  };

  const tooltipText = description || defaultDescriptions[title] || 'Official administrative monitoring indicator';

  return (
    <Tooltip title={title} content={tooltipText} position="bottom" className="w-full">
      <div className="w-full bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-help group text-left">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider group-hover:text-slate-800 transition-colors">
            {title}
          </p>
          {Icon && (
            <div className={`p-1.5 rounded-lg border ${iconColors[color] || iconColors.slate} transition-transform group-hover:scale-105`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
        <div className="mt-2.5">
          <h3 className="text-2xl font-extrabold font-mono text-slate-900 tracking-tight">
            {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          </h3>
          {subtitle ? (
            <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>
          ) : (
            <p className="text-[10px] text-slate-400 mt-1 font-mono flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              Hover for details
            </p>
          )}
        </div>
      </div>
    </Tooltip>
  );
}