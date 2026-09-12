import React, { useState } from 'react';
import { Layers, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

export default function SectorExposureChart({ sectorData }) {
  // Default fallback if backend hasn't loaded or in offline demonstration
  const defaultSectors = [
    { sector: 'Roads & Pathways', projectCount: 382, sanctionedAmount: 114500000, expenditureAmount: 92400000, flaggedCount: 68, avgProgress: 64.2 },
    { sector: 'Community Infrastructure', projectCount: 294, sanctionedAmount: 88200000, expenditureAmount: 76500000, flaggedCount: 54, avgProgress: 68.5 },
    { sector: 'Drinking Water', projectCount: 218, sanctionedAmount: 65400000, expenditureAmount: 51200000, flaggedCount: 42, avgProgress: 59.8 },
    { sector: 'Education', projectCount: 164, sanctionedAmount: 49200000, expenditureAmount: 38100000, flaggedCount: 31, avgProgress: 72.1 },
    { sector: 'Sanitation', projectCount: 98, sanctionedAmount: 29400000, expenditureAmount: 24600000, flaggedCount: 19, avgProgress: 66.4 },
    { sector: 'Health & Family Welfare', projectCount: 54, sanctionedAmount: 18900000, expenditureAmount: 13200000, flaggedCount: 12, avgProgress: 58.1 },
    { sector: 'Irrigation Facilities', projectCount: 40, sanctionedAmount: 14000000, expenditureAmount: 11800000, flaggedCount: 7, avgProgress: 75.0 }
  ];

  const data = (sectorData && Array.isArray(sectorData) && sectorData.length > 0)
    ? sectorData
    : defaultSectors;

  const maxSanctioned = Math.max(...data.map(d => d.sanctionedAmount || 1), 1000000);

  const formatLakhs = (val) => {
    if (!val) return '₹0 L';
    const lakhs = val / 100000;
    if (lakhs >= 100) {
      return `₹${(lakhs / 100).toFixed(2)} Cr`;
    }
    return `₹${lakhs.toFixed(1)} L`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            Sector-Wise Capital Allocation & Risk Exposure
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Public works capital breakdown, expenditure velocity, and critical risk density by sector
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono shrink-0">
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-none inline-block shadow-2xs" />
            <span>Sanctioned</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="w-2.5 h-2.5 bg-emerald-600 rounded-none inline-block shadow-2xs" />
            <span>Disbursed</span>
          </span>
        </div>
      </div>

      {/* Sector Rows with Dual Square Horizontal Bars */}
      <div className="space-y-3.5">
        {data.slice(0, 6).map((item, idx) => {
          const sanctionedPct = Math.min(100, Math.round(((item.sanctionedAmount || 0) / maxSanctioned) * 100));
          const disbursedPct = Math.min(100, Math.round(((item.expenditureAmount || 0) / maxSanctioned) * 100));

          return (
            <div key={idx} className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/80 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                  {item.sector}
                  <span className="font-mono text-[11px] text-slate-500 font-normal">
                    ({item.projectCount} works)
                  </span>
                </span>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-blue-700 font-bold">{formatLakhs(item.sanctionedAmount)}</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-emerald-700 font-bold">{formatLakhs(item.expenditureAmount)}</span>
                  {item.flaggedCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded bg-red-50 text-red-700 border border-red-200 font-bold text-[10px]">
                      {item.flaggedCount} flagged
                    </span>
                  )}
                </div>
              </div>

              {/* Dual Square Horizontal Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-200/80 h-2 rounded-none overflow-hidden flex">
                  <div
                    style={{ width: `${sanctionedPct}%` }}
                    className="bg-blue-600 h-full rounded-none transition-all duration-300"
                    title={`Sanctioned: ${formatLakhs(item.sanctionedAmount)}`}
                  />
                </div>
                <div className="w-full bg-slate-200/80 h-2 rounded-none overflow-hidden flex">
                  <div
                    style={{ width: `${disbursedPct}%` }}
                    className="bg-emerald-600 h-full rounded-none transition-all duration-300"
                    title={`Disbursed: ${formatLakhs(item.expenditureAmount)}`}
                  />
                </div>
              </div>

              {/* Footer Metrics */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
                <span>Avg Physical Progress: <b className="text-slate-700">{item.avgProgress}%</b></span>
                <span>
                  Disbursal Rate: <b className="text-slate-700">
                    {item.sanctionedAmount ? Math.round((item.expenditureAmount / item.sanctionedAmount) * 100) : 0}%
                  </b>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
