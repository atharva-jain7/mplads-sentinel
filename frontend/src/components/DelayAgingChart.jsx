import React from 'react';
import { Clock, AlertTriangle, CheckCircle, Hourglass } from 'lucide-react';

export default function DelayAgingChart({ delayData }) {
  const defaultData = {
    onTrackCount: 742,
    onTrackRupees: 184500000,
    minorCount: 196,
    minorRupees: 48200000,
    moderateCount: 148,
    moderateRupees: 36400000,
    criticalCount: 94,
    criticalRupees: 28900000,
    severeCount: 70,
    severeRupees: 21500000
  };

  const d = delayData || defaultData;

  const brackets = [
    { label: 'On Track', sub: '0 days delay', count: d.onTrackCount || 0, rupees: d.onTrackRupees || 0, color: 'bg-emerald-600', text: 'text-emerald-700' },
    { label: '1 - 30 Days', sub: 'Minor delay', count: d.minorCount || 0, rupees: d.minorRupees || 0, color: 'bg-blue-600', text: 'text-blue-700' },
    { label: '31 - 90 Days', sub: 'Moderate delay', count: d.moderateCount || 0, rupees: d.moderateRupees || 0, color: 'bg-amber-500', text: 'text-amber-700' },
    { label: '91 - 180 Days', sub: 'Critical delay', count: d.criticalCount || 0, rupees: d.criticalRupees || 0, color: 'bg-orange-600', text: 'text-orange-700' },
    { label: '> 180 Days', sub: 'Severe stall', count: d.severeCount || 0, rupees: d.severeRupees || 0, color: 'bg-red-600', text: 'text-red-700' }
  ];

  const maxCount = Math.max(...brackets.map(b => b.count), 10);
  const PLOT_HEIGHT = 105;

  const formatCr = (val) => {
    if (!val) return '₹0 Cr';
    return `₹${(val / 10000000).toFixed(1)} Cr`;
  };

  const totalDelayedRupees = (d.minorRupees || 0) + (d.moderateRupees || 0) + (d.criticalRupees || 0) + (d.severeRupees || 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Hourglass className="w-4 h-4 text-amber-600" />
            Project Delay Spectrum & Timeline Aging
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Distribution of works by schedule overrun duration and locked public funds
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>{formatCr(totalDelayedRupees)} Locked in Overdue Works</span>
        </div>
      </div>

      {/* Square Bar Plot */}
      <div className="pt-2 pb-1">
        <div className="flex gap-2">
          {/* Y-Axis */}
          <div className="flex flex-col justify-between text-[10px] font-mono text-slate-400 h-[125px] pr-1 select-none text-right w-7">
            <span>{maxCount}</span>
            <span>{Math.round(maxCount * 0.5)}</span>
            <span>0</span>
          </div>

          {/* Plot Area */}
          <div className="flex-1 relative h-[125px] border-l border-b border-slate-300">
            {/* Gridlines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="w-full border-t border-dashed border-slate-200" />
              <div className="w-full border-t border-dashed border-slate-200" />
              <div className="w-full border-t border-slate-300" />
            </div>

            {/* Square Columns */}
            <div className="absolute inset-0 flex items-end justify-around px-2">
              {brackets.map((b, i) => {
                const barHeightPx = Math.max(6, Math.round((b.count / maxCount) * PLOT_HEIGHT));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full px-1">
                    <span className="text-[10px] font-mono font-bold text-slate-800 mb-0.5">
                      {b.count}
                    </span>
                    <div
                      style={{ height: `${barHeightPx}px` }}
                      className={`w-6 sm:w-11 ${b.color} rounded-none shadow-xs transition-all duration-150 hover:opacity-90`}
                      title={`${b.label}: ${b.count} works (${formatCr(b.rupees)})`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* X-Axis Labels */}
        <div className="flex pl-9 pt-2">
          <div className="w-full flex justify-around text-center text-[10px] font-mono font-semibold text-slate-600">
            {brackets.map((b, i) => (
              <div key={i} className="flex-1 truncate" title={b.label}>
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
        {brackets.map((b, i) => (
          <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-200/70 text-center">
            <div className="text-[10px] font-medium text-slate-500 truncate">{b.sub}</div>
            <div className={`font-mono font-bold text-sm ${b.text}`}>{b.count}</div>
            <div className="text-[9px] font-mono text-slate-400">{formatCr(b.rupees)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
