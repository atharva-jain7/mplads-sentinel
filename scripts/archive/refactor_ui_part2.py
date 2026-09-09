import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src"

def save(rel_path, content):
    full = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Refactored: {rel_path}")

# 1. ExplainabilityCard.jsx
save("components/ExplainabilityCard.jsx", """import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronRight, ShieldAlert } from 'lucide-react';
import RiskBadge from './RiskBadge';

export default function ExplainabilityCard({ score, level, factors = [] }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const defaultFactors = [
    { type: 'PROGRESS_EXPENDITURE_MISMATCH', severity: 'HIGH', score: 88, explanation: '86.7% expenditure vs 38.0% physical progress' },
    { type: 'DELAY', severity: 'HIGH', score: 85, explanation: '137 days overdue past expected milestone' },
    { type: 'REPEATED_FUNDING', severity: 'HIGH', score: 80, explanation: '2 previous related works identified at this location' },
    { type: 'POTENTIAL_DUPLICATE', severity: 'MEDIUM', score: 75, explanation: 'Similar project (MPL-9812) located within 0.8 km' },
    { type: 'ISOLATION_FOREST_ANOMALY', severity: 'HIGH', score: 89, explanation: 'Isolation Forest detected multi-variate outlier pattern' },
    { type: 'LOF_PEER_ANOMALY', severity: 'HIGH', score: 84, explanation: 'Local Outlier Factor detected local peer deviation' },
    { type: 'BENFORD_FINANCIAL_ANOMALY', severity: 'MEDIUM', score: 72, explanation: 'Unusual payment digit distribution across tranches' }
  ];

  const list = factors.length > 0 ? factors : defaultFactors;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Explainable Risk Factors</h3>
          <p className="text-xs text-slate-500 mt-0.5">Automated screening rationale</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block uppercase font-medium">Risk Score</span>
            <span className="text-xl font-bold font-mono text-slate-900">{score || 94} <span className="text-xs text-slate-400 font-normal">/ 100</span></span>
          </div>
          <RiskBadge level={level || 'CRITICAL'} />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
          Flagged Indicators ({list.length}):
        </p>

        <div className="space-y-2">
          {list.map((factor, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={index}
                className="border border-slate-200/80 rounded-lg overflow-hidden transition-colors hover:border-slate-300 bg-slate-50/50"
              >
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span className="text-xs font-medium text-slate-800">
                      {factor.explanation}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-slate-500 font-medium px-1.5 py-0.5 bg-white rounded border border-slate-200">
                      {factor.type}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 py-2.5 border-t border-slate-100 text-xs text-slate-600 bg-white space-y-1">
                    <div className="flex gap-6 font-mono text-[11px]">
                      <span>Factor Score: <b>{factor.score}/100</b></span>
                      <span>Severity: <b>{factor.severity}</b></span>
                    </div>
                    <p className="text-[11px] text-slate-500 pt-1">
                      Detected by multi-signal baseline comparison. Review of milestone vouchers and physical site progress recommended.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
""")

# 2. BenfordChart.jsx
save("components/BenfordChart.jsx", """import React from 'react';

export default function BenfordChart({ distribution, isAnomaly, deviationScore }) {
  const defaultDist = [
    { digit: 1, expected: 30.1, observed: 8.3 },
    { digit: 2, expected: 17.6, observed: 58.3 },
    { digit: 3, expected: 12.5, observed: 0.0 },
    { digit: 4, expected: 9.7, observed: 0.0 },
    { digit: 5, expected: 7.9, observed: 16.7 },
    { digit: 6, expected: 6.7, observed: 0.0 },
    { digit: 7, expected: 5.8, observed: 0.0 },
    { digit: 8, expected: 5.1, observed: 8.3 },
    { digit: 9, expected: 4.6, observed: 8.3 }
  ];

  const digits = distribution || defaultDist;

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Benford's Law Financial Distribution</h4>
          <p className="text-xs text-slate-500">Expected vs Observed First-Digit Frequency across Payment Records</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Deviation:</span>
          <span className="ml-1 font-mono font-bold text-slate-800">{deviationScore || 72}/100</span>
        </div>
      </div>

      <div className="h-40 flex items-end gap-2 pt-4 pb-2 px-1 border-b border-slate-100">
        {digits.map((item) => (
          <div key={item.digit} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
            <div className="w-full flex items-end justify-center gap-1 h-28">
              <div
                style={{ height: `${Math.min(100, item.expected * 2.2)}px` }}
                className="w-3 bg-slate-300 rounded-t"
                title={`Expected: ${item.expected}%`}
              />
              <div
                style={{ height: `${Math.min(100, item.observed * 2.2)}px` }}
                className={`w-3 rounded-t ${
                  Math.abs(item.observed - item.expected) > 15
                    ? 'bg-amber-500'
                    : 'bg-slate-700'
                }`}
                title={`Observed: ${item.observed}%`}
              />
            </div>
            <span className="text-xs font-mono font-semibold text-slate-700">{item.digit}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 mt-2.5">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2 bg-slate-300 rounded-xs" /> Expected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2 bg-slate-700 rounded-xs" /> Observed
          </span>
        </div>
        <span className="text-slate-600 text-[11px]">
          Unusual financial digit distribution — review recommended.
        </span>
      </div>
    </div>
  );
}
""")

# 3. GISMap.jsx
save("components/GISMap.jsx", """import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

export default function GISMap({ targetProject, nearbyProjects = [], radiusKm = 5.0 }) {
  const mapRef = useRef(null);
  const leafletInstance = useRef(null);

  const lat = targetProject?.latitude || 18.52043;
  const lon = targetProject?.longitude || 73.85674;

  useEffect(() => {
    if (!window.L) return;

    if (!leafletInstance.current && mapRef.current) {
      const map = window.L.map(mapRef.current).setView([lat, lon], 13);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      leafletInstance.current = map;
    }

    const map = leafletInstance.current;
    if (map) {
      map.setView([lat, lon], 13);

      map.eachLayer((layer) => {
        if (layer instanceof window.L.Marker || layer instanceof window.L.Circle) {
          map.removeLayer(layer);
        }
      });

      // Target Project Marker (Red)
      const targetIcon = window.L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:#DC2626; width:18px; height:18px; border-radius:50%; border:2px solid white; box-shadow:0 0 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });

      const targetMarker = window.L.marker([lat, lon], { icon: targetIcon }).addTo(map);
      targetMarker.bindPopup(`
        <div style="font-family:sans-serif; font-size:12px;">
          <b>${targetProject?.projectId || 'MPL-10482'}</b><br/>
          <span>${targetProject?.projectName || 'Target Project'}</span>
        </div>
      `);

      // Radius Circle
      window.L.circle([lat, lon], {
        color: '#64748B',
        fillColor: '#94A3B8',
        fillOpacity: 0.1,
        radius: radiusKm * 1000
      }).addTo(map);

      // Nearby Project Markers
      nearbyProjects.forEach((p) => {
        if (p.latitude && p.longitude) {
          const markerColor = p.potentialOverlap ? '#EA580C' : '#3B82F6';

          const nearbyIcon = window.L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color:${markerColor}; width:14px; height:14px; border-radius:50%; border:2px solid white; box-shadow:0 0 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
          });

          const marker = window.L.marker([p.latitude, p.longitude], { icon: nearbyIcon }).addTo(map);
          marker.bindPopup(`
            <div style="font-family:sans-serif; font-size:12px;">
              <b>${p.projectId}</b> (${p.distanceKm} km away)<br/>
              <span>${p.projectName}</span>
              ${p.potentialOverlap ? '<br/><span style="color:#EA580C; font-weight:bold;">Potential overlap — review recommended</span>' : ''}
            </div>
          `);
        }
      });
    }
  }, [lat, lon, nearbyProjects, radiusKm]);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-600" />
            GIS Geospatial Map & Nearby Works
          </h4>
          <p className="text-xs text-slate-500">{radiusKm} km search radius</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Selected Work
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Potential Overlap
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Nearby Work
          </span>
        </div>
      </div>

      <div ref={mapRef} className="w-full h-72 rounded-lg border border-slate-200 z-10 overflow-hidden" />

      {nearbyProjects.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-600 mb-2">
            Identified Nearby Works ({nearbyProjects.length}):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {nearbyProjects.map((p) => (
              <div key={p.projectId} className={`p-2 rounded-lg border ${
                p.potentialOverlap ? 'bg-orange-50/50 border-orange-200' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between font-mono font-bold text-slate-800">
                  <span>{p.projectId}</span>
                  <span className="text-slate-500 font-sans font-normal text-[11px]">{p.distanceKm} km</span>
                </div>
                <div className="text-[11px] text-slate-600 truncate mt-0.5">{p.projectName}</div>
                {p.potentialOverlap && (
                  <span className="inline-block mt-1 text-[10px] font-semibold text-orange-700">
                    Potential overlap — review recommended
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
""")

# 4. RiskDistributionChart.jsx
save("components/RiskDistributionChart.jsx", """import React from 'react';

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
""")

# 5. ProjectStatusChart.jsx
save("components/ProjectStatusChart.jsx", """import React from 'react';

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
""")

# 6. RiskTrendChart.jsx
save("components/RiskTrendChart.jsx", """import React from 'react';

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
""")

print("Charts & explainability refactored cleanly.")