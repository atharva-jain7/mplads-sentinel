import React from 'react';
import { AlertOctagon, CheckCircle2, AlertTriangle, ArrowUpRight, Scale } from 'lucide-react';

export default function ProgressSpendDisparityChart({ driftData }) {
  const defaultData = {
    severeCount: 38,
    severeRupeesAtRisk: 28400000,
    moderateCount: 94,
    alignedCount: 780,
    aheadCount: 338
  };

  const d = driftData || defaultData;
  const total = (d.severeCount || 0) + (d.moderateCount || 0) + (d.alignedCount || 0) + (d.aheadCount || 0) || 1250;

  const cohorts = [
    {
      title: 'Severe Disparity (> 25% Gap)',
      sub: 'Fund spent significantly exceeds verified ground work (Premature Disbursal / Leakage Risk)',
      count: d.severeCount || 0,
      color: 'bg-red-600',
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
      alert: true
    },
    {
      title: 'Moderate Disparity (10% - 25% Gap)',
      sub: 'Disbursements trending ahead of physical inspection milestones',
      count: d.moderateCount || 0,
      color: 'bg-amber-500',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      alert: false
    },
    {
      title: 'Synchronized (±10% Tolerance)',
      sub: 'Fund utilization matches measurement book physical execution within statutory norms',
      count: d.alignedCount || 0,
      color: 'bg-emerald-600',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      alert: false
    },
    {
      title: 'Progress Ahead of Payment (> 10% Work)',
      sub: 'Field milestones delivered ahead of billing release (Conservative Execution)',
      count: d.aheadCount || 0,
      color: 'bg-blue-600',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      alert: false
    }
  ];

  const maxVal = Math.max(...cohorts.map(c => c.count), 10);
  const PLOT_HEIGHT = 100; // explicit pixels

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-4 h-4 text-purple-600" />
            Financial Spend vs Physical Progress Disparity
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-validation of fund disbursals against physical completion (Ghost Billing & Premature Release Screening)
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg">
          <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
          <span>₹{( (d.severeRupeesAtRisk || 28400000) / 10000000 ).toFixed(2)} Cr At Drift Risk</span>
        </div>
      </div>

      {/* Square Bar Comparative Columns */}
      <div className="pt-2 pb-1">
        <div className="flex gap-2">
          {/* Y-Axis */}
          <div className="flex flex-col justify-between text-[10px] font-mono text-slate-400 h-[120px] pr-1 select-none text-right w-7">
            <span>{maxVal}</span>
            <span>{Math.round(maxVal * 0.5)}</span>
            <span>0</span>
          </div>

          {/* Plot Area */}
          <div className="flex-1 relative h-[120px] border-l border-b border-slate-300">
            {/* Gridlines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="w-full border-t border-dashed border-slate-200" />
              <div className="w-full border-t border-dashed border-slate-200" />
              <div className="w-full border-t border-slate-300" />
            </div>

            {/* Square Columns */}
            <div className="absolute inset-0 flex items-end justify-around px-3">
              {cohorts.map((c, i) => {
                const barHeightPx = Math.max(6, Math.round((c.count / maxVal) * PLOT_HEIGHT));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full px-1">
                    <span className="text-[10px] font-mono font-bold text-slate-800 mb-0.5">
                      {c.count}
                    </span>
                    <div
                      style={{ height: `${barHeightPx}px` }}
                      className={`w-7 sm:w-12 ${c.color} rounded-none shadow-xs transition-all duration-150 hover:opacity-90`}
                      title={`${c.title}: ${c.count} works`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* X-Axis Labels */}
        <div className="flex pl-9 pt-2">
          <div className="w-full flex justify-around text-center text-[10px] font-medium text-slate-600">
            <span className="flex-1 truncate text-red-700 font-bold">Severe Drift</span>
            <span className="flex-1 truncate text-amber-700 font-semibold">Moderate</span>
            <span className="flex-1 truncate text-emerald-700 font-semibold">Synchronized</span>
            <span className="flex-1 truncate text-blue-700 font-semibold">Ahead</span>
          </div>
        </div>
      </div>

      {/* Cohort Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
        <div className="p-2.5 bg-red-50/70 border border-red-200/80 rounded-xl text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-red-800 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              Severe Disparity Detected
            </span>
            <span className="font-mono font-bold text-red-700">{d.severeCount} works</span>
          </div>
          <p className="text-[11px] text-red-600">
            High disbursement percentage with lagging physical execution. Triggered for mandatory field inspection.
          </p>
        </div>

        <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Statutory Compliance Pace
            </span>
            <span className="font-mono font-bold text-emerald-700">{d.alignedCount + d.aheadCount} works</span>
          </div>
          <p className="text-[11px] text-emerald-600">
            Disbursement milestone alignment verified against statutory stage certificates and MB records.
          </p>
        </div>
      </div>
    </div>
  );
}
