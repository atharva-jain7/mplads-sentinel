import React, { useState } from 'react';
import { Compass, Info, Layers, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function LOFVisualizer({ lofData, targetProject }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const defaultScatter = [
    { id: 'MPL-10482', progress: 38.0, utilization: 86.7, isTarget: true, lof: 2.49 },
    { id: 'PEER-01', progress: 76.1, utilization: 70.4, isTarget: false, lof: 0.96 },
    { id: 'PEER-02', progress: 88.1, utilization: 91.2, isTarget: false, lof: 1.03 },
    { id: 'PEER-03', progress: 68.0, utilization: 64.6, isTarget: false, lof: 0.97 },
    { id: 'PEER-04', progress: 65.2, utilization: 67.2, isTarget: false, lof: 0.97 },
    { id: 'PEER-05', progress: 60.1, utilization: 57.1, isTarget: false, lof: 1.19 },
    { id: 'PEER-06', progress: 75.1, utilization: 80.0, isTarget: false, lof: 0.99 },
    { id: 'PEER-07', progress: 68.2, utilization: 73.2, isTarget: false, lof: 1.01 },
    { id: 'PEER-08', progress: 89.1, utilization: 83.4, isTarget: false, lof: 1.02 },
    { id: 'PEER-09', progress: 87.9, utilization: 83.2, isTarget: false, lof: 1.03 },
    { id: 'PEER-10', progress: 73.0, utilization: 75.2, isTarget: false, lof: 0.97 },
    { id: 'PEER-11', progress: 63.3, utilization: 64.0, isTarget: false, lof: 1.17 },
    { id: 'PEER-12', progress: 61.6, utilization: 61.0, isTarget: false, lof: 1.11 },
    { id: 'PEER-13', progress: 72.7, utilization: 72.2, isTarget: false, lof: 1.01 },
    { id: 'PEER-14', progress: 78.6, utilization: 82.5, isTarget: false, lof: 1.02 },
    { id: 'PEER-15', progress: 70.7, utilization: 72.5, isTarget: false, lof: 0.95 },
    { id: 'PEER-16', progress: 58.5, utilization: 61.1, isTarget: false, lof: 1.03 },
    { id: 'PEER-17', progress: 73.4, utilization: 79.0, isTarget: false, lof: 0.96 },
    { id: 'PEER-18', progress: 88.4, utilization: 82.5, isTarget: false, lof: 1.19 },
    { id: 'PEER-19', progress: 69.0, utilization: 63.6, isTarget: false, lof: 0.97 },
    { id: 'PEER-20', progress: 80.0, utilization: 82.5, isTarget: false, lof: 0.99 },
    { id: 'PEER-21', progress: 63.9, utilization: 68.7, isTarget: false, lof: 1.03 },
    { id: 'PEER-22', progress: 88.8, utilization: 91.7, isTarget: false, lof: 1.11 },
    { id: 'PEER-23', progress: 82.3, utilization: 78.8, isTarget: false, lof: 1.06 },
    { id: 'PEER-24', progress: 81.4, utilization: 85.9, isTarget: false, lof: 0.96 },
    { id: 'PEER-25', progress: 68.2, utilization: 65.4, isTarget: false, lof: 1.04 }
  ];

  const data = lofData || {};
  const rawLof = data.rawLof || 2.49;
  const lofScore = data.lofScore || 86;
  const peerCount = data.peerCount || 25;
  const kDistance = data.kDistance || 7.304;
  const lrd = data.lrd || 0.154;
  const points = data.peerScatter && data.peerScatter.length > 0 ? data.peerScatter : defaultScatter;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-md">
              <Compass className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900">Local Outlier Factor (LOF) • Peer Density Analysis</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Unsupervised density-based spatial outlier detection against peer projects
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">LOF Factor</span>
            <span className="text-lg font-bold font-mono text-red-600">{rawLof} <span className="text-xs text-slate-400 font-normal">(&gt; 1.0 indicates outlier)</span></span>
          </div>
          <div className="px-2.5 py-1 bg-red-50 border border-red-200 rounded-md text-right">
            <span className="text-[10px] text-red-600 block uppercase font-medium">Model Score</span>
            <span className="text-sm font-bold font-mono text-red-700">{lofScore} / 100</span>
          </div>
        </div>
      </div>

      {/* Concept Explanation Box */}
      <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/80 text-xs text-slate-700 space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
          <Info className="w-3.5 h-3.5 text-indigo-600" />
          <span>How LOF Evaluates Local Cluster Density:</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-600">
          Unlike global anomaly detectors, <b>Local Outlier Factor (LOF)</b> computes the local density of a project relative to its <i>k</i>-nearest neighbors ({peerCount} similar community works in Pune). 
          A project with an LOF ratio significantly higher than 1.0 indicates that its density is substantially sparser than its peers due to an abnormal combination of <b>high expenditure velocity</b> with <b>lagging milestone progress</b>.
        </p>
        <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px] text-slate-600">
          <div className="bg-white p-2 rounded border border-slate-200">
            <span className="text-slate-400 block text-[10px]">k-Nearest Neighbors</span>
            <b>k = 15 peers</b>
          </div>
          <div className="bg-white p-2 rounded border border-slate-200">
            <span className="text-slate-400 block text-[10px]">k-Distance to Cluster</span>
            <b className="text-red-600">{kDistance} (high isolation)</b>
          </div>
          <div className="bg-white p-2 rounded border border-slate-200">
            <span className="text-slate-400 block text-[10px]">Local Reachability (LRD)</span>
            <b className="text-amber-700">{lrd} (sparse density)</b>
          </div>
        </div>
      </div>

      {/* Interactive Peer Density Scatter Plot */}
      <div>
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="font-semibold text-slate-800">
            Physical Progress (%) vs Fund Utilization (%) Distribution:
          </span>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Target Work (Outlier)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> Normal Peer Cluster
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-4 h-0.5 border-b border-dashed border-slate-400" /> Expected 1:1 Trajectory
            </span>
          </div>
        </div>

        {/* 2D Canvas / Coordinate Space */}
        <div className="relative h-56 w-full bg-slate-900 rounded-lg p-4 text-white overflow-hidden border border-slate-800">
          {/* Axis Guidelines */}
          <div className="absolute inset-0 p-6 pointer-events-none">
            {/* 1:1 Expected Progression Diagonal */}
            <svg className="w-full h-full">
              <line x1="0%" y1="100%" x2="100%" y2="0%" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" />
            </svg>
          </div>

          {/* Points Container */}
          <div className="relative w-full h-full">
            {points.map((pt) => {
              // x = progress (0 to 100), y = 100 - utilization (0 to 100)
              const left = `${Math.min(95, Math.max(5, pt.progress))}%`;
              const top = `${Math.min(95, Math.max(5, 100 - pt.utilization))}%`;
              const isHov = hoveredPoint?.id === pt.id;

              return (
                <div
                  key={pt.id}
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  style={{ left, top }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform ${
                    pt.isTarget ? 'z-20 scale-125' : 'z-10 hover:scale-125'
                  }`}
                >
                  {pt.isTarget ? (
                    <div className="relative">
                      <span className="w-4 h-4 rounded-full bg-red-500 border-2 border-white block shadow-lg animate-pulse" />
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-red-600 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded text-white whitespace-nowrap">
                        {pt.id} (LOF: {pt.lof})
                      </span>
                    </div>
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 border border-slate-900 opacity-80 hover:opacity-100 hover:bg-white" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Y Axis Label */}
          <div className="absolute left-2 top-2 text-[10px] font-mono text-slate-400">
            ▲ Fund Utilization (%)
          </div>
          {/* X Axis Label */}
          <div className="absolute right-2 bottom-1 text-[10px] font-mono text-slate-400">
            Physical Progress (%) ▶
          </div>

          {/* Hover Tooltip */}
          {hoveredPoint && (
            <div className="absolute top-2 right-2 bg-slate-800/95 border border-slate-700 text-xs p-2 rounded shadow-lg text-slate-200 z-30 font-mono text-[11px] space-y-0.5">
              <div className="font-bold text-white">{hoveredPoint.id}</div>
              <div>Physical Progress: <b>{hoveredPoint.progress}%</b></div>
              <div>Fund Utilization: <b>{hoveredPoint.utilization}%</b></div>
              <div>LOF Factor: <b className={hoveredPoint.lof > 1.5 ? 'text-red-400' : 'text-emerald-400'}>{hoveredPoint.lof}</b></div>
            </div>
          )}
        </div>
      </div>

      {/* Peer Median Baseline Comparison */}
      <div className="pt-2 border-t border-slate-100">
        <h4 className="text-xs font-semibold uppercase text-slate-600 mb-2">
          Comparative Feature Deviation vs Peer Group Median:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Cost / Progress Point</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-mono font-bold text-red-600">₹68,421 / %</span>
              <span className="text-[10px] font-mono text-slate-400">Peer Med: ₹31,200</span>
            </div>
            <span className="text-[10px] text-red-700 font-semibold">+119% above cluster norm</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Physical Progress Lag</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-mono font-bold text-red-600">-42.0% gap</span>
              <span className="text-[10px] font-mono text-slate-400">Peer Med: -2.4%</span>
            </div>
            <span className="text-[10px] text-red-700 font-semibold">17.5x peer average gap</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Timeline Delay</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-mono font-bold text-red-600">137 Days</span>
              <span className="text-[10px] font-mono text-slate-400">Peer Med: 12 Days</span>
            </div>
            <span className="text-[10px] text-red-700 font-semibold">Overdue beyond threshold</span>
          </div>
        </div>
      </div>
    </div>
  );
}