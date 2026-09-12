import React from 'react';
import { Building2, AlertCircle, Clock, ShieldAlert } from 'lucide-react';

export default function AgencyPerformanceChart({ agencyData }) {
  const defaultAgencies = [
    { agency: 'Public Works Division - Infrastructure', projectCount: 312, sanctionedAmount: 93600000, avgDelayDays: 48, flaggedCount: 42 },
    { agency: 'Municipal Corporation Engineering Cell', projectCount: 284, sanctionedAmount: 85200000, avgDelayDays: 36, flaggedCount: 38 },
    { agency: 'Zilla Parishad Works Department', projectCount: 246, sanctionedAmount: 73800000, avgDelayDays: 24, flaggedCount: 26 },
    { agency: 'State Water Supply & Sewerage Board', projectCount: 198, sanctionedAmount: 59400000, avgDelayDays: 52, flaggedCount: 34 },
    { agency: 'Rural Development & Panchayat Raj Agency', projectCount: 142, sanctionedAmount: 42600000, avgDelayDays: 18, flaggedCount: 16 },
    { agency: 'Minor Irrigation Project Division', projectCount: 68, sanctionedAmount: 20400000, avgDelayDays: 31, flaggedCount: 9 }
  ];

  const data = (agencyData && Array.isArray(agencyData) && agencyData.length > 0)
    ? agencyData
    : defaultAgencies;

  const maxWorks = Math.max(...data.map(d => d.projectCount || 1), 10);

  const formatLakhs = (val) => {
    if (!val) return '₹0 L';
    const lakhs = val / 100000;
    if (lakhs >= 100) return `₹${(lakhs / 100).toFixed(1)} Cr`;
    return `₹${lakhs.toFixed(0)} L`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            Implementing Agency Workload & Saturation Index
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Active works entrusted, capital concentration, and average delay by executing authority
          </p>
        </div>
        <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200 shrink-0">
          Top Executing Bodies
        </span>
      </div>

      <div className="space-y-3">
        {data.slice(0, 5).map((item, idx) => {
          const barPct = Math.min(100, Math.round(((item.projectCount || 0) / maxWorks) * 100));
          const isHighDelay = (item.avgDelayDays || 0) > 40;

          return (
            <div key={idx} className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 truncate max-w-[260px] sm:max-w-md">
                  {item.agency}
                </span>
                <div className="flex items-center gap-2 shrink-0 font-mono">
                  <span className="text-slate-800 font-bold">{item.projectCount} works</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-blue-700 font-bold">{formatLakhs(item.sanctionedAmount)}</span>
                </div>
              </div>

              {/* Square Progress Bar */}
              <div className="w-full bg-slate-200/80 h-2.5 rounded-none overflow-hidden flex">
                <div
                  style={{ width: `${barPct}%` }}
                  className="bg-indigo-600 h-full rounded-none transition-all duration-300"
                />
              </div>

              {/* Agency Badges */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Avg Delay: <b className={isHighDelay ? 'text-amber-700' : 'text-slate-700'}>
                    {item.avgDelayDays || 0} days
                  </b>
                </span>
                <span className="flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-red-500" />
                  Critical/High Flags: <b className="text-red-700">{item.flaggedCount || 0}</b>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
