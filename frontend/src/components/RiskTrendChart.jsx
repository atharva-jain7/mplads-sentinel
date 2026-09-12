import React, { useState } from 'react';
import { BarChart3, TrendingUp, Layers, Info } from 'lucide-react';

export default function RiskTrendChart({ trends, distribution }) {
  const [activeView, setActiveView] = useState('monthly'); // 'monthly' | 'distribution'
  const [hoveredItem, setHoveredItem] = useState(null);

  // Fallback monthly trend data if none passed
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

  // Fallback tier distribution data
  const tierData = distribution || [
    { tier: 'Critical Risk', count: 47, score: '≥ 80', color: 'bg-red-600', textBadge: 'text-red-700 bg-red-50' },
    { tier: 'High Attention', count: 186, score: '60 - 79', color: 'bg-amber-500', textBadge: 'text-amber-700 bg-amber-50' },
    { tier: 'Medium Risk', count: 342, score: '30 - 59', color: 'bg-blue-600', textBadge: 'text-blue-700 bg-blue-50' },
    { tier: 'Low / Compliant', count: 675, score: '< 30', color: 'bg-emerald-600', textBadge: 'text-emerald-700 bg-emerald-50' }
  ];

  // Explicit pixel height for plotting to prevent any percentage collapse in CSS flex containers
  const PLOT_HEIGHT = 120; // in pixels

  // Compute maximums for scaling
  const maxMonthlyVal = Math.max(
    ...monthlyData.flatMap(d => [Number(d.critical) || 0, Number(d.high) || 0]),
    10
  );

  const maxTierVal = Math.max(...tierData.map(t => Number(t.count) || 0), 10);

  // Y-axis ticks
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
    <div className="space-y-3 font-sans select-none">
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
              <span>Critical (&ge; 80)</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-none inline-block shadow-2xs" />
              <span>High (60-79)</span>
            </span>
          </div>
        ) : (
          <div className="text-xs font-mono text-slate-500">
            Total Monitored: <b className="text-slate-900 font-bold">{tierData.reduce((a, b) => a + (Number(b.count) || 0), 0)} Works</b>
          </div>
        )}
      </div>

      {/* VIEW 1: MONTHLY ANOMALY SQUARE BAR CHART */}
      {activeView === 'monthly' && (
        <div className="relative pt-2 pb-1">
          <div className="flex gap-2">
            {/* Y-Axis Numerical Scale */}
            <div className="flex flex-col justify-between text-[10px] font-mono text-slate-400 h-[140px] pr-1 select-none text-right w-6">
              <span>{yTicksMonthly[0]}</span>
              <span>{yTicksMonthly[1]}</span>
              <span>{yTicksMonthly[2]}</span>
              <span>0</span>
            </div>

            {/* Plot Area with Reference Gridlines & Solid Square Bars */}
            <div className="flex-1 relative h-[140px] border-l border-b border-slate-300">
              {/* Horizontal Dashed Reference Gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="w-full border-t border-dashed border-slate-200" />
                <div className="w-full border-t border-dashed border-slate-200" />
                <div className="w-full border-t border-dashed border-slate-200" />
                <div className="w-full border-t border-slate-300" />
              </div>

              {/* Grouped Square Bar Columns */}
              <div 
                className="absolute inset-0 flex items-end justify-around px-1"
              >
                {monthlyData.map((d, i) => {
                  const critVal = Number(d.critical) || 0;
                  const highVal = Number(d.high) || 0;
                  const critHeightPx = Math.max(6, Math.round((critVal / maxMonthlyVal) * PLOT_HEIGHT));
                  const highHeightPx = Math.max(6, Math.round((highVal / maxMonthlyVal) * PLOT_HEIGHT));

                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer px-0.5"
                      onMouseEnter={() => setHoveredItem({ type: 'monthly', data: d, index: i })}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {/* Bar Pair: Red & Amber square flat-topped columns */}
                      <div className="flex items-end justify-center gap-1 sm:gap-1.5 w-full">
                        {/* Critical Bar */}
                        <div className="flex flex-col items-center group/crit">
                          <span className="text-[9px] font-mono font-bold text-red-700 leading-none mb-0.5">
                            {critVal}
                          </span>
                          <div
                            style={{ height: `${critHeightPx}px` }}
                            className="w-3 sm:w-4 bg-red-600 rounded-none shadow-xs transition-all duration-150 group-hover/crit:bg-red-700"
                          />
                        </div>

                        {/* High Attention Bar */}
                        <div className="flex flex-col items-center group/high">
                          <span className="text-[9px] font-mono font-bold text-amber-700 leading-none mb-0.5">
                            {highVal}
                          </span>
                          <div
                            style={{ height: `${highHeightPx}px` }}
                            className="w-3 sm:w-4 bg-amber-500 rounded-none shadow-xs transition-all duration-150 group-hover/high:bg-amber-600"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* X-Axis Labels (Month Names) */}
          <div className="flex pl-8 pt-2">
            <div className="w-full flex justify-around text-center text-[10px] font-mono font-semibold text-slate-600">
              {monthlyData.map((d, i) => (
                <div key={i} className="flex-1 truncate">
                  {d.month ? d.month.split(' ')[0] : `M${i+1}`}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Hover Tooltip Banner */}
          {hoveredItem && hoveredItem.type === 'monthly' && (
            <div className="mt-2.5 p-2 bg-slate-900 text-white rounded-lg flex items-center justify-between text-xs font-mono border border-slate-700 shadow-md animate-fadeIn">
              <span className="text-amber-400 font-bold">{hoveredItem.data.month}</span>
              <div className="flex items-center gap-4">
                <span>Critical: <b className="text-red-400 font-bold">{hoveredItem.data.critical}</b> works</span>
                <span>High Attention: <b className="text-amber-400 font-bold">{hoveredItem.data.high}</b> works</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: RISK TIER DISTRIBUTION SQUARE BAR CHART */}
      {activeView === 'distribution' && (
        <div className="relative pt-2 pb-1">
          <div className="flex gap-2">
            {/* Y-Axis Numerical Scale */}
            <div className="flex flex-col justify-between text-[10px] font-mono text-slate-400 h-[140px] pr-1 select-none text-right w-7">
              <span>{yTicksTier[0]}</span>
              <span>{yTicksTier[1]}</span>
              <span>{yTicksTier[2]}</span>
              <span>0</span>
            </div>

            {/* Plot Area with Reference Gridlines & Solid Square Bars */}
            <div className="flex-1 relative h-[140px] border-l border-b border-slate-300">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="w-full border-t border-dashed border-slate-200" />
                <div className="w-full border-t border-dashed border-slate-200" />
                <div className="w-full border-t border-dashed border-slate-200" />
                <div className="w-full border-t border-slate-300" />
              </div>

              {/* Square Bars */}
              <div className="absolute inset-0 flex items-end justify-around px-3">
                {tierData.map((t, idx) => {
                  const count = Number(t.count) || 0;
                  const barHeightPx = Math.max(8, Math.round((count / maxTierVal) * PLOT_HEIGHT));
                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer px-1"
                      onMouseEnter={() => setHoveredItem({ type: 'tier', data: t })}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div className="text-[10px] font-mono font-bold text-slate-800 mb-0.5">
                        {count}
                      </div>
                      <div
                        style={{ height: `${barHeightPx}px` }}
                        className={`w-8 sm:w-14 ${t.color || 'bg-slate-600'} rounded-none shadow-xs transition-all duration-150 hover:opacity-90`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* X-Axis Labels */}
          <div className="flex pl-9 pt-2">
            <div className="w-full flex justify-around text-center text-[10px] font-semibold text-slate-700">
              {tierData.map((t, idx) => (
                <div key={idx} className="flex-1 truncate">
                  {t.tier}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Hover Tooltip Banner */}
          {hoveredItem && hoveredItem.type === 'tier' && (
            <div className="mt-2.5 p-2 bg-slate-900 text-white rounded-lg flex items-center justify-between text-xs font-mono border border-slate-700 shadow-md animate-fadeIn">
              <span className="text-amber-400 font-bold">{hoveredItem.data.tier}</span>
              <span>Score Range: <b className="text-white">{hoveredItem.data.score}</b></span>
              <span>Monitored Works: <b className="text-emerald-400 font-bold">{hoveredItem.data.count}</b></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}