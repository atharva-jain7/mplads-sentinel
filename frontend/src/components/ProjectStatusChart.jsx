import React from 'react';

export default function ProjectStatusChart({ distribution }) {
  const data = distribution || {
    RECOMMENDED: 820,
    SANCTIONED: 1450,
    IN_PROGRESS: 6120,
    DELAYED: 912,
    OVERDUE: 340,
    COMPLETED: 2840
  };

  const statuses = [
    { label: 'In Progress', count: data.IN_PROGRESS || 6120, color: 'bg-indigo-500' },
    { label: 'Completed', count: data.COMPLETED || 2840, color: 'bg-emerald-500' },
    { label: 'Sanctioned', count: data.SANCTIONED || 1450, color: 'bg-blue-500' },
    { label: 'Delayed', count: data.DELAYED || 912, color: 'bg-orange-500' },
    { label: 'Overdue', count: data.OVERDUE || 340, color: 'bg-red-500' }
  ];

  const maxVal = Math.max(...statuses.map(s => s.count));

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
      <div className="mb-3 pb-2 border-b border-slate-100">
        <h4 className="text-sm font-bold text-slate-900">Project Status</h4>
        <p className="text-xs text-slate-500">Lifecycle execution status</p>
      </div>

      <div className="space-y-2.5">
        {statuses.map((item) => {
          const pct = Math.round((item.count / maxVal) * 100);
          return (
            <div key={item.label}>
              <div className="flex justify-between text-xs text-slate-700 mb-0.5">
                <span>{item.label}</span>
                <span className="font-mono font-semibold">{item.count.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className={`${item.color} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}