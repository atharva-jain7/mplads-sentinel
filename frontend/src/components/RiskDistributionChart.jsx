import React from 'react';

export default function RiskDistributionChart({ distribution }) {
  const data = distribution || { low: 10185, medium: 1864, high: 386, critical: 47 };
  const total = Object.values(data).reduce((a, b) => a + b, 0);

  const tiers = [
    { label: 'Critical', count: data.critical || 47, color: 'bg-red-500', bar: 'bg-red-500' },
    { label: 'High', count: data.high || 386, color: 'bg-orange-500', bar: 'bg-orange-500' },
    { label: 'Medium', count: data.medium || 1864, color: 'bg-amber-500', bar: 'bg-amber-500' },
    { label: 'Low', count: data.low || 10185, color: 'bg-emerald-500', bar: 'bg-emerald-500' }
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Risk Categorization</h4>
          <p className="text-xs text-slate-500">Autonomous risk distribution</p>
        </div>
        <span className="text-xs font-mono text-slate-500">{total.toLocaleString('en-IN')} Total</span>
      </div>

      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex mb-4">
        <div style={{ width: `${(data.critical / total) * 100}%` }} className="bg-red-500 h-full" />
        <div style={{ width: `${(data.high / total) * 100}%` }} className="bg-orange-500 h-full" />
        <div style={{ width: `${(data.medium / total) * 100}%` }} className="bg-amber-500 h-full" />
        <div style={{ width: `${(data.low / total) * 100}%` }} className="bg-emerald-500 h-full" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {tiers.map((t) => (
          <div key={t.label} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-2 h-2 rounded-full ${t.color}`} />
              <span className="text-slate-600 font-medium text-[11px]">{t.label}</span>
            </div>
            <div className="text-base font-bold font-mono text-slate-900">{t.count.toLocaleString('en-IN')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}