import React from 'react';
import Tooltip from './Tooltip';

export default function KPICard({ title, value, subtitle, icon: Icon, color = 'slate', description }) {
  const defaultDescriptions = {
    'Total Works': 'Total active works registered across the selected jurisdiction under MPLADS guidelines.',
    'Monitored Works': 'Total active works registered across the selected jurisdiction under MPLADS guidelines.',
    'All-India Works': 'Total active works across all 543 Parliamentary Constituencies registered in e-SAKSHI.',
    'State Works': 'Total works registered under Maharashtra State Nodal Authority oversight.',
    'District Works': 'Total works sanctioned and executed in Pune District.',
    'Critical Priority': 'Composite Risk Index >= 80. Flagged by multi-signal anomaly models. Immediate review required.',
    'Critical Cases': 'Composite Risk Index >= 80. Flagged by multi-signal anomaly models. Immediate review required.',
    'High Attention': 'Risk Score 60 to 79. Elevated milestone lag or cost-to-progress mismatch detected.',
    'Delayed Execution': 'Works that have exceeded their official sanctioned completion target date by more than 30 days.',
    'Extended Delays': 'Works overdue past sanctioned milestone timeline by > 90 days.',
    'Cost Overruns': 'Works where expenditure disbursement outpaces physical progress by > 20%.',
    'Potential Duplicates': 'Works identified within GPS proximity sharing identical category, scope, or repetitive funding.',
    '₹ at Risk': 'Expenditure associated with high and critical-risk works. Monitoring signal only.'
  };

  const tooltipText = description || defaultDescriptions[title] || 'Administrative monitoring indicator';

  return (
    <Tooltip title={title} content={tooltipText} position="bottom" className="w-full">
      <div className="w-full bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col justify-between h-24 text-left transition-all hover:border-slate-300">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
            {title}
          </span>
          {Icon && (
            <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          )}
        </div>
        <div className="text-2xl font-extrabold font-mono text-slate-900 tracking-tight leading-none">
          {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
        </div>
        <div className="text-[10px] text-slate-400 font-medium truncate">
          {subtitle || 'Monitored indicator'}
        </div>
      </div>
    </Tooltip>
  );
}