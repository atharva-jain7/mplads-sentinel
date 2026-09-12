import React, { useState } from 'react';
import { BarChart3, TrendingUp, Layers } from 'lucide-react';

export default function RiskTrendChart({ trends, distribution }) {
  const [activeView, setActiveView] = useState('monthly'); // 'monthly' | 'distribution'
  const [hoveredItem, setHoveredItem] = useState(null);

  // Monthly trend data
  const monthlyData = (trends && Array.isArray(trends) && trends.length > 0)
    ? trends
    : [
        { month: 'Sep 2025', critical: 4, high: 22, medium: 45 },
        { month: 'Oct 2025', critical: 7, high: 28, medium: 48 },
        { month: 'Nov 2025', critical: 11, high: 34, medium: 52 },
        { month: 'Dec 2025', critical: 16, high: 42, medium: 58 },
        { month: 'Jan 2026', critical: 21, high: 48, medium: 64 },
        { month: 'Feb 2026', critical: 28, high: 54, medium: 72 }
      ];

  // Tier distribution data
  const tierData = distribution || [
    { tier: 'Critical Risk', count: 47, score: '≥ 80', color: 'bg-red-600', textColor: 'text-red-700', bgSoft: 'bg-red-50' },
    { tier: 'High Attention', count: 186, score: '60 - 79', color: 'bg-amber-500', textColor: 'text-amber-700', bgSoft: 'bg-amber-50' },
    { tier: 'Medium Risk', count: 342, score: '30 - 59', color: 'bg-blue-600', textColor: 'text-blue-700', bgSoft: 'bg-blue-50' },
    { tier: 'Low / Compliant', count: 675, score: '< 30', color: 'bg-emerald-600', textColor: 'text-emerald-700', bgSoft: 'bg-emerald-50' }
  ];

  // Compute maximums for accurate percentage heights
  const maxMonthlyVal = Math.max(
    ...monthlyData.flatMap(d => [Number(d.critical) || 0, Number(d.high) || 0]),
    10
  );

  const maxTierVal = Math.max(...tierData.map(t => t.count), 10);

  // Reference grid ticks (4 tiers: 100%, 75%, 50%, 25%)
  const yTicksMonthly = [
    Math.round(maxMonthlyVal),
    Math.round(maxMonthlyVal * 0.75),
    Math.round(maxMonthlyVal * 0.5),
    Math.round(maxMonthlyVal * 0.25)
  ];

  const yTicksTier = [
    Math.round(maxTierVal),
    Math.round(maxTierVal * 0.75),
    Math.round(maxTierVal * 0.5),
    Math.round(maxTierVal * 0.25)
  ];

  return (
    <div className="space-y-3 font-sans">
      {/* Chart View Switcher and Legend Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveView('monthly')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
              activeView === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Trend
          </button>
          <button
            type="button"
            onClick={() => setActiveView('distribution')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
              activeView === 'distribution'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tier Distribution
          </button>
        </div>

        {/* Square Swatch Legend */}
        {activeView === 'monthly' ? (
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-none inline-block shadow-2xs" />
              <span>Critical (Score ≥ 80)</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-none inline-block shadow-2xs" />
              <span>High (Score 60-79)</span>
            </span>
          </div>
        ) : (
          <div className="text-xs font-mono text-slate-500">
            Total Monitored: <b className="text-slate-900 font-bold">1,250 Works</b>
          </div>
        )}
      </div>

      {/* VIEW 1: MONTHLY ANOMALY SQUARE BAR CHART */}
      {activeView === 'monthly' && (
        <div className="relative pt-3 pb-1">
          {/* Main Chart Container with Y-Axis */}
          <div className="flex gap-2">
            {/* Y-Axis Labels */}
            <div className="flex flex-col justify-between text-[10px] font-mono text-slate-400 h-40 pr-1 select-none text-right w-6">
              <span>{yTicksMonthly[0]}</span>
              <span>{yTicksMonthly[1]}</span>
              <span>{yTicksMonthly[2]}</span>
              <span>0</span>
            </div>

            {/* Gridlines and Square Bars Area */}
            <div className="flex-1 relative h-40 border-l border-b border-slate-300">
              {/* Horizontal Reference Gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="w-full border-t border-dashed border-slate-200" />
                <div className="w-full border-t border-dashed border-slate-200" />
                <div className="w-full border-t border-dashed border-slate-200" />
                <div className="w-full border-t border-slate-300" />
              </div>

              {/* Square Bars Group Columns */}
              <div className="absolute inset-0 grid grid-cols-6 items-end px-2">
                {monthlyData.map((d, i) => {
                  const critVal = Number(d.critical) || 0;
                  const highVal = Number(d.high) || 0;
                  const critHeight = Math.max(4, Math.min(100, Math.round((critVal / maxMonthlyVal) * 100)));
                  const highHeight = Math.max(4, Math.min(100, Math.round((highVal / maxMonthlyVal) * 100)));

                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center justify-end h-full group relative"
                      onMouseEnter={() => setHoveredItem({ type: 'monthly', data: d, index: i })}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {/* Bar Pair (Square Crisp Columns) */}
                      <div className="flex items-end justify-center gap-1 w-full pb-0.5">
                        {/* Critical Bar (Solid Red Square Top) */}
                        <div
                          style={{ height: `${critHeight}%` }}
                          className="w-3 sm:w-4 bg-red-600 rounded-none transition-all duration-200 hover:bg-red-700 shadow-2xs relative group/crit"
                        >
                          <span className="opacity-0 group-hover/crit:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-mono font-bold px-1 rounded transition-opacity pointer-events-none">
                            {critVal}
                          </span>
                        </div>

                        {/* High Attention Bar (Solid Amber Square Top) */}
                        <div
                          style={{ height: `${highHeight}%` }}
                          className="w-3 sm:w-4 bg-amber-500 rounded-none transition-all duration-200 hover:bg-amber-600 shadow-2xs relative group/high"
                        >
                          <span className="opacity-0 group-hover/high:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-mono font-bold px-1 rounded transition-opacity pointer-events-none">
                            {highVal}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* X-Axis Labels (Months) */}
          <div className="flex pl-8 pt-2">
            <div className="w-full grid grid-cols-6 text-center text-[11px] font-mono font-medium text-slate-600">
              {monthlyData.map((d, i) => (
                <div key={i} className="truncate">
                  {d.month.split(' ')[0]}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Hover Tooltip */}
          {hoveredItem && hoveredItem.type === 'monthly' && (
            <div className="mt-2 p-2 bg-slate-900 text-white rounded-lg flex items-center justify-between text-xs font-mono border border-slate-700 shadow-md">
              <span className="text-amber-400 font-bold">{hoveredItem.data.month}</span>
              <div className="flex items-center gap-4">
                <span>Critical: <b className="text-red-400">{hoveredItem.data.critical}</b> works</span>
                <span>High Attention: <b className="text-amber-400">{hoveredItem.data.high}</b> works</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: RISK TIER DISTRIBUTION SQUARE BAR CHART */}
      {activeView === 'distribution' && (
        <div className="relative pt-3 pb-1">
          <div className="flex gap-2">
            {/* Y-Axis Labels */}
            <div className="flex flex-col justify-between text-[10px] font-mono text-slate-400 h-40 pr-1 select-none text-right w-7">
              <span>{yTicksTier[0]}</span>
              <span>{yTicksTier[1]}</span>
              <span>{yTicksTier[2]}</span>
              <span>0</span>
            </div>

            {/* Gridlines and Square Bars Area */}
            <div className="flex-1 relative h-40 border-l border-b border-slate-300">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="w-full border-t border-dashed border-slate-200" />
                <div className="w-full border-t border-dashed border-slate-200" />
                <div className="w-full border-t border-dashed border-slate-200" />
                <div className="w-full border-t border-slate-300" />
              </div>

              {/* Square Bars */}
              <div className="absolute inset-0 grid grid-cols-4 items-end px-4">
                {tierData.map((t, idx) => {
                  const barHeight = Math.max(6, Math.min(100, Math.round((t.count / maxTierVal) * 100)));
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-end h-full group"
                      onMouseEnter={() => setHoveredItem({ type: 'tier', data: t })}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div className="text-[10px] font-mono font-bold text-slate-700 mb-1">
                        {t.count}
                      </div>
                      <div
                        style={{ height: `${barHeight}%` }}
                        className={`w-8 sm:w-12 ${t.color} rounded-none transition-all duration-200 hover:opacity-90 shadow-2xs`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* X-Axis Labels */}
          <div className="flex pl-9 pt-2">
            <div className="w-full grid grid-cols-4 text-center text-[10px] font-semibold text-slate-700">
              {tierData.map((t, idx) => (
                <div key={idx} className="truncate">
                  {t.tier}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Hover Tooltip */}
          {hoveredItem && hoveredItem.type === 'tier' && (
            <div className="mt-2 p-2 bg-slate-900 text-white rounded-lg flex items-center justify-between text-xs font-mono border border-slate-700 shadow-md">
              <span className="text-amber-400 font-bold">{hoveredItem.data.tier}</span>
              <span>Score Band: <b>{hoveredItem.data.score}</b></span>
              <span>Total Works: <b className="text-emerald-400">{hoveredItem.data.count}</b></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}