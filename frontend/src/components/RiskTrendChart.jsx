import React from 'react';

export default function RiskTrendChart({ trends }) {
  const data = trends || [
    { month: 'Sep', critical: 3, high: 25 },
    { month: 'Oct', critical: 4, high: 30 },
    { month: 'Nov', critical: 2, high: 28 },
    { month: 'Dec', critical: 5, high: 34 },
    { month: 'Jan', critical: 4, high: 32 },
    { month: 'Feb', critical: 6, high: 38 }
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Anomaly Trend (6 Months)</h4>
          <p className="text-xs text-slate-500">Flagged anomalies over time</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-red-500" /> Critical
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-orange-500" /> High
          </span>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 items-end h-28 pt-2 border-b border-slate-100">
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1 h-full justify-end">
            <div className="w-full flex items-end justify-center gap-1">
              <div
                style={{ height: `${d.critical * 10}px` }}
                className="w-2.5 bg-red-500 rounded-t"
                title={`Critical: ${d.critical}`}
              />
              <div
                style={{ height: `${d.high * 1.8}px` }}
                className="w-2.5 bg-orange-500 rounded-t"
                title={`High: ${d.high}`}
              />
            </div>
            <span className="text-[11px] text-slate-500">{d.month.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}