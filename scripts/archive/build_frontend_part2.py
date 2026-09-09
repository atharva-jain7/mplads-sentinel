import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src"

def save(rel_path, content):
    full = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Created frontend: {rel_path}")

# 1. components/RiskDistributionChart.jsx
save("components/RiskDistributionChart.jsx", """import React from 'react';

export default function RiskDistributionChart({ distribution }) {
  const data = distribution || { low: 10185, medium: 1864, high: 386, critical: 47 };
  const total = Object.values(data).reduce((a, b) => a + b, 0);

  const tiers = [
    { label: 'CRITICAL', count: data.critical || 47, color: 'bg-red-600', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
    { label: 'HIGH', count: data.high || 386, color: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
    { label: 'MEDIUM', count: data.medium || 1864, color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    { label: 'LOW', count: data.low || 10185, color: 'bg-emerald-600', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' }
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800">Risk Tier Distribution</h4>
          <p className="text-xs text-slate-500">Autonomous risk categorization across portfolio</p>
        </div>
        <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-1 rounded">
          {total.toLocaleString('en-IN')} Works
        </span>
      </div>

      {/* Progress Bar representation */}
      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex mb-4 border border-slate-200">
        <div style={{ width: `${(data.critical / total) * 100}%` }} className="bg-red-600 h-full" title={`Critical: ${data.critical}`} />
        <div style={{ width: `${(data.high / total) * 100}%` }} className="bg-orange-500 h-full" title={`High: ${data.high}`} />
        <div style={{ width: `${(data.medium / total) * 100}%` }} className="bg-amber-400 h-full" title={`Medium: ${data.medium}`} />
        <div style={{ width: `${(data.low / total) * 100}%` }} className="bg-emerald-500 h-full" title={`Low: ${data.low}`} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tiers.map((t) => (
          <div key={t.label} className={`p-3 rounded-lg border ${t.border} ${t.bg}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
              <span className={`text-[11px] font-bold ${t.text}`}>{t.label}</span>
            </div>
            <div className="text-lg font-bold font-mono text-slate-900">{t.count.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-slate-500 font-medium">{((t.count / total) * 100).toFixed(1)}% of total</div>
          </div>
        ))}
      </div>
    </div>
  );
}
""")

# 2. components/ProjectStatusChart.jsx
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
    { label: 'Recommended', count: data.RECOMMENDED || 820, color: 'bg-slate-400' },
    { label: 'Overdue', count: data.OVERDUE || 340, color: 'bg-red-500' }
  ];

  const maxVal = Math.max(...statuses.map(s => s.count));

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="mb-4">
        <h4 className="text-sm font-bold text-slate-800">Project Execution Status</h4>
        <p className="text-xs text-slate-500">Implementation lifecycle breakdown</p>
      </div>

      <div className="space-y-3">
        {statuses.map((item) => {
          const pct = Math.round((item.count / maxVal) * 100);
          return (
            <div key={item.label}>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>{item.label}</span>
                <span className="font-mono text-slate-900 font-bold">{item.count.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                <div className={`${item.color} h-2 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
""")

# 3. components/RiskTrendChart.jsx
save("components/RiskTrendChart.jsx", """import React from 'react';

export default function RiskTrendChart({ trends }) {
  const data = trends || [
    { month: 'Sep 2025', critical: 3, high: 25 },
    { month: 'Oct 2025', critical: 4, high: 30 },
    { month: 'Nov 2025', critical: 2, high: 28 },
    { month: 'Dec 2025', critical: 5, high: 34 },
    { month: 'Jan 2026', critical: 4, high: 32 },
    { month: 'Feb 2026', critical: 6, high: 38 }
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800">Monthly Anomaly Trend</h4>
          <p className="text-xs text-slate-500">High and Critical risk anomalies flagged over time</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-red-600 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Critical
          </span>
          <span className="flex items-center gap-1.5 text-orange-600 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High
          </span>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 items-end h-32 pt-4 border-b border-slate-200">
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end">
            <div className="w-full flex items-end justify-center gap-1">
              <div
                style={{ height: `${d.critical * 12}px` }}
                className="w-3 bg-red-600 rounded-t hover:bg-red-700 transition-all"
                title={`Critical: ${d.critical}`}
              />
              <div
                style={{ height: `${d.high * 2.2}px` }}
                className="w-3 bg-orange-500 rounded-t hover:bg-orange-600 transition-all"
                title={`High: ${d.high}`}
              />
            </div>
            <span className="text-[10px] text-slate-500 font-medium truncate w-full text-center">
              {d.month.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[11px] text-slate-500 text-center">
        Detection rate steady at ~3.2% of active portfolio works
      </div>
    </div>
  );
}
""")

# 4. components/BenfordChart.jsx
save("components/BenfordChart.jsx", """import React from 'react';
import { AlertCircle } from 'lucide-react';

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
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-800">Benford's Law Financial Analysis</h4>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isAnomaly ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {isAnomaly ? 'UNUSUAL PATTERN' : 'NORMAL DISTRIBUTION'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Expected vs Observed First-Digit Frequency across Payment Tranches
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Deviation Score:</span>
          <span className="ml-1 font-mono font-bold text-slate-800">{deviationScore || 72}/100</span>
        </div>
      </div>

      <div className="h-48 flex items-end gap-3 pt-6 pb-2 px-2 border-b border-slate-200">
        {digits.map((item) => (
          <div key={item.digit} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
            {/* Tooltip */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none">
              Digit {item.digit}: Exp {item.expected}% | Obs {item.observed}%
            </div>

            <div className="w-full flex items-end justify-center gap-1 h-36">
              {/* Expected bar */}
              <div
                style={{ height: `${Math.min(100, item.expected * 2.2)}px` }}
                className="w-3 bg-slate-300 rounded-t"
                title={`Expected: ${item.expected}%`}
              />
              {/* Observed bar */}
              <div
                style={{ height: `${Math.min(100, item.observed * 2.2)}px` }}
                className={`w-3 rounded-t ${
                  Math.abs(item.observed - item.expected) > 15
                    ? 'bg-amber-500 animate-pulse'
                    : 'bg-blue-600'
                }`}
                title={`Observed: ${item.observed}%`}
              />
            </div>
            <span className="text-xs font-mono font-bold text-slate-700">{item.digit}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-slate-300 rounded-sm" /> Expected (Logarithmic)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-blue-600 rounded-sm" /> Observed Payments
          </span>
        </div>
        <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          Unusual financial digit distribution - review recommended.
        </span>
      </div>
    </div>
  );
}
""")

# 5. components/ExplainabilityCard.jsx
save("components/ExplainabilityCard.jsx", """import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ExplainabilityCard({ score, level, factors = [] }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const defaultFactors = [
    { type: 'PROGRESS_EXPENDITURE_MISMATCH', severity: 'HIGH', score: 88, explanation: '86.7% expenditure vs 38.0% physical progress (48.7% gap)' },
    { type: 'DELAY', severity: 'HIGH', score: 85, explanation: '137 days overdue past scheduled completion milestone' },
    { type: 'REPEATED_FUNDING', severity: 'HIGH', score: 80, explanation: '2 previous related funding projects identified at this location/category' },
    { type: 'POTENTIAL_DUPLICATE', severity: 'MEDIUM', score: 75, explanation: 'Similar project (MPL-9812) located within 0.8 km radius' },
    { type: 'ISOLATION_FOREST_ANOMALY', severity: 'HIGH', score: 89, explanation: 'Isolation Forest detected multi-variate anomaly pattern' },
    { type: 'LOF_PEER_ANOMALY', severity: 'HIGH', score: 84, explanation: 'LOF detected local peer anomaly compared with similar community works' },
    { type: 'BENFORD_FINANCIAL_ANOMALY', severity: 'MEDIUM', score: 72, explanation: 'Unusual financial digit distribution across payment tranches' }
  ];

  const list = factors.length > 0 ? factors : defaultFactors;

  const getSeverityBadge = (sev) => {
    switch ((sev || 'MEDIUM').toUpperCase()) {
      case 'CRITICAL':
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200 font-semibold';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-200 font-medium';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200 font-medium';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-bold text-slate-900">Explainable Risk Factors</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent algorithmic rationale for prioritized review
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block uppercase font-semibold">Calculated Score</span>
            <span className="text-2xl font-black font-mono text-red-600">{score || 94} <span className="text-xs text-slate-400 font-normal">/ 100</span></span>
          </div>
          <div className="px-3 py-1.5 bg-red-100 text-red-800 border border-red-300 font-bold rounded-lg text-xs">
            {level || 'CRITICAL'}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
          <span>WHY FLAGGED FOR REVIEW:</span>
        </p>

        <div className="space-y-2.5">
          {list.map((factor, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={index}
                className="border border-slate-200 rounded-lg overflow-hidden transition-all bg-slate-50/70 hover:bg-slate-100/70"
              >
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="w-full px-4 py-3 text-left flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold text-sm mt-0.5">✓</span>
                    <div>
                      <span className="text-sm font-semibold text-slate-800 leading-snug">
                        {factor.explanation}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[11px] px-2 py-0.5 rounded border ${getSeverityBadge(factor.severity)}`}>
                      {factor.severity}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-3 pt-1 border-t border-slate-200 text-xs text-slate-600 bg-white">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2 font-mono">
                      <div>
                        <span className="text-slate-400 block text-[10px]">FACTOR TYPE</span>
                        <span className="font-semibold text-slate-800">{factor.type}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">IMPACT SCORE</span>
                        <span className="font-semibold text-slate-800">{factor.score} / 100</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">WEIGHT CONTRIBUTION</span>
                        <span className="font-semibold text-slate-800">{factor.severity === 'HIGH' ? 'High Influence' : 'Moderate'}</span>
                      </div>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-1 border-t border-slate-100 pt-1.5">
                      Flagged via multi-signal verification. On-site physical inspection and voucher review recommended.
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

# 6. components/GISMap.jsx
save("components/GISMap.jsx", """import React, { useEffect, useRef } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';

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
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      leafletInstance.current = map;
    }

    const map = leafletInstance.current;
    if (map) {
      map.setView([lat, lon], 13);

      // Clear existing markers/circles
      map.eachLayer((layer) => {
        if (layer instanceof window.L.Marker || layer instanceof window.L.Circle) {
          map.removeLayer(layer);
        }
      });

      // Target Project Marker (Red Icon)
      const targetIcon = window.L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:#DC2626; width:22px; height:22px; border-radius:50%; border:3px solid white; box-shadow:0 0 10px rgba(220,38,38,0.7);"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const targetMarker = window.L.marker([lat, lon], { icon: targetIcon }).addTo(map);
      targetMarker.bindPopup(`
        <div style="font-family:sans-serif; min-width:180px;">
          <b style="color:#DC2626;">Target Project: ${targetProject?.projectId || 'MPL-10482'}</b><br/>
          <span style="font-size:11px; color:#333;">${targetProject?.projectName || 'Construction of Community Infrastructure'}</span><br/>
          <span style="font-size:10px; color:#666;">Risk Score: <b>${targetProject?.riskScore || 94}</b> (CRITICAL)</span>
        </div>
      `).openPopup();

      // Proximity Radius Circle
      window.L.circle([lat, lon], {
        color: '#EA580C',
        fillColor: '#F97316',
        fillOpacity: 0.12,
        radius: radiusKm * 1000
      }).addTo(map);

      // Nearby Project Markers
      nearbyProjects.forEach((p) => {
        if (p.latitude && p.longitude) {
          const isOverlap = p.potentialOverlap;
          const markerColor = isOverlap ? '#EA580C' : '#2563EB';

          const nearbyIcon = window.L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color:${markerColor}; width:16px; height:16px; border-radius:50%; border:2px solid white; box-shadow:0 0 6px rgba(0,0,0,0.4);"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });

          const marker = window.L.marker([p.latitude, p.longitude], { icon: nearbyIcon }).addTo(map);
          marker.bindPopup(`
            <div style="font-family:sans-serif; min-width:180px;">
              <b style="color:${markerColor};">${p.projectId} (${p.distanceKm || 0} km away)</b><br/>
              <span style="font-size:11px; color:#333;">${p.projectName}</span><br/>
              <span style="font-size:10px; color:#666;">Sanctioned: ₹${(p.sanctionedAmount || 0).toLocaleString('en-IN')}</span><br/>
              ${isOverlap ? '<span style="font-size:10px; color:#EA580C; font-weight:bold;">Potential overlap - review recommended</span>' : ''}
            </div>
          `);
        }
      });
    }
  }, [lat, lon, nearbyProjects, radiusKm]);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-orange-600" />
            GIS Geospatial Analysis & Nearby Works
          </h4>
          <p className="text-xs text-slate-500">Spatial radius monitoring ({radiusKm} km search boundary)</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 border border-white" /> Selected Project
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Potential Overlap
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Proximity Only
          </span>
        </div>
      </div>

      <div ref={mapRef} className="w-full h-80 rounded-lg border border-slate-300 z-10 overflow-hidden" />

      {nearbyProjects.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-200">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Identified Nearby Works ({nearbyProjects.length}):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {nearbyProjects.map((p) => (
              <div key={p.projectId} className={`p-2.5 rounded-lg border ${
                p.potentialOverlap ? 'bg-orange-50/70 border-orange-200' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between font-mono font-bold text-slate-800">
                  <span>{p.projectId}</span>
                  <span className="text-slate-500 font-sans font-normal">{p.distanceKm} km</span>
                </div>
                <div className="text-[11px] text-slate-600 truncate mt-0.5">{p.projectName}</div>
                {p.potentialOverlap && (
                  <span className="inline-block mt-1 text-[10px] font-bold text-orange-800 bg-orange-100 px-1.5 py-0.2 rounded border border-orange-300">
                    Potential Related Project
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

print("Charts, Benford, Explainability, and GISMap components written.")