import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src"

def save(rel_path, content):
    full = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Created: {rel_path}")

# =========================================================================
# 1. components/Tooltip.jsx (Hover Popover component)
# =========================================================================
save("components/Tooltip.jsx", """import React, { useState } from 'react';

export default function Tooltip({ title, content, children, position = 'top', className = '' }) {
  const [visible, setVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full mt-2 left-1/2 -translate-x-1/2';
      case 'left':
        return 'right-full mr-2 top-1/2 -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 -translate-y-1/2';
      case 'top':
      default:
        return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
    }
  };

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <div
          className={`absolute z-50 pointer-events-none w-64 p-3 bg-slate-900/95 text-white rounded-xl shadow-2xl border border-slate-700/80 backdrop-blur-sm tooltip-popover text-left ${getPositionClasses()}`}
        >
          {title && (
            <div className="font-bold text-amber-400 mb-1 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {title}
            </div>
          )}
          <div className="text-[11px] text-slate-200 leading-relaxed font-normal">
            {content}
          </div>
          <div
            className={`absolute w-2 h-2 bg-slate-900 border-slate-700 rotate-45 ${
              position === 'bottom'
                ? '-top-1 left-1/2 -translate-x-1/2 border-t border-l'
                : 'left-1/2 -translate-x-1/2 -bottom-1 border-b border-r'
            }`}
          />
        </div>
      )}
    </div>
  );
}
""")

# =========================================================================
# 2. components/GISMap.jsx (Complete Overhaul with Leaflet NPM, Tiles & Popups)
# =========================================================================
save("components/GISMap.jsx", """import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Layers, 
  Compass, 
  Maximize2, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Info,
  Navigation
} from 'lucide-react';
import Tooltip from './Tooltip';

// Fix Leaflet default marker icons for Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function GISMap({ targetProject, nearbyProjects = [], radiusKm = 3.0 }) {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const circleLayerRef = useRef(null);

  const [activeRadius, setActiveRadius] = useState(radiusKm);
  const [selectedNearby, setSelectedNearby] = useState(null);

  const lat = Number(targetProject?.latitude) || 18.52043;
  const lon = Number(targetProject?.longitude) || 73.85674;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map if not yet created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lon],
        zoom: 14,
        zoomControl: true,
        attributionControl: false
      });

      // High-Contrast OpenStreetMap CartoDB Tiles (Fast & Clean)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap &copy; CARTO'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    map.setView([lat, lon], 14);

    // Clear all existing markers & circles
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // 1. Draw Target Project Pulsing Pin (Red Beacon)
    const targetDivIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="position:relative; width:34px; height:34px; display:flex; align-items:center; justify-content:center;">
          <div style="position:absolute; width:34px; height:34px; border-radius:50%; background-color:rgba(220,38,38,0.25); animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="position:relative; width:22px; height:22px; border-radius:50%; background-color:#DC2626; border:3px solid white; box-shadow:0 4px 12px rgba(220,38,38,0.5); display:flex; align-items:center; justify-content:center;">
            <div style="width:6px; height:6px; border-radius:50%; background-color:white;"></div>
          </div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const targetMarker = L.marker([lat, lon], { icon: targetDivIcon }).addTo(map);
    targetMarker.bindPopup(`
      <div style="font-family:sans-serif; min-width:200px; padding:4px 0;">
        <div style="font-size:10px; font-family:monospace; font-weight:bold; color:#DC2626; text-transform:uppercase;">
          TARGET INSPECTION CASE
        </div>
        <div style="font-size:13px; font-weight:bold; color:#0F172A; margin:2px 0 4px 0;">
          ${targetProject?.projectName || 'Construction of Community Infrastructure'}
        </div>
        <div style="font-size:11px; color:#64748B; font-family:monospace;">
          ID: ${targetProject?.projectId || 'MPL-10482'} • Risk: <b>${targetProject?.riskScore || 94}/100</b>
        </div>
        <div style="margin-top:6px; padding:4px 8px; background:#FEF2F2; border-radius:6px; font-size:11px; color:#991B1B; font-weight:600;">
          Critical Risk Case (${targetProject?.riskLevel || 'CRITICAL'})
        </div>
      </div>
    `);

    // 2. Draw Geospatial Radius Circle
    const circle = L.circle([lat, lon], {
      color: '#3B82F6',
      weight: 2,
      dashArray: '6, 6',
      fillColor: '#60A5FA',
      fillOpacity: 0.08,
      radius: activeRadius * 1000
    }).addTo(map);
    circleLayerRef.current = circle;

    // 3. Draw Nearby Works Markers
    nearbyProjects.forEach((p) => {
      const pLat = Number(p.latitude);
      const pLon = Number(p.longitude);
      if (!pLat || !pLon) return;

      const isOverlap = p.potentialOverlap;
      const markerBg = isOverlap ? '#EA580C' : '#2563EB';

      const nearbyIcon = L.divIcon({
        className: 'custom-nearby-marker',
        html: `
          <div style="position:relative; width:26px; height:26px; display:flex; align-items:center; justify-content:center;">
            <div style="width:18px; height:18px; border-radius:50%; background-color:${markerBg}; border:2.5px solid white; box-shadow:0 3px 8px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center;">
              <div style="width:4px; height:4px; border-radius:50%; background-color:white;"></div>
            </div>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker([pLat, pLon], { icon: nearbyIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family:sans-serif; min-width:210px; padding:4px 0;">
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; font-family:monospace; margin-bottom:2px;">
            <span style="font-weight:bold; color:${markerBg};">${p.projectId}</span>
            <span style="color:#64748B;">${p.distanceKm} km radius</span>
          </div>
          <div style="font-size:12px; font-weight:bold; color:#0F172A; margin-bottom:4px;">
            ${p.projectName}
          </div>
          ${isOverlap ? `
            <div style="padding:4px 8px; background:#FFF7ED; border:1px solid #FED7AA; border-radius:6px; font-size:11px; color:#C2410C; font-weight:600; margin-top:4px;">
              Potential duplicate work scope (${p.distanceKm} km)
            </div>
          ` : `
            <div style="font-size:11px; color:#64748B;">
              Verified independent project scope
            </div>
          `}
        </div>
      `);
    });

    // Invalidate map size after rendering to ensure full visibility
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [lat, lon, nearbyProjects, activeRadius]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lon], 14, { animate: true });
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-blue-600" />
              GIS Geospatial Scope & Proximity Map
            </h4>
            <Tooltip
              title="Haversine Geospatial Proximity"
              content="Calculates geodesic distance between GPS coordinates under MPLADS anti-duplication guidelines (3.0 km threshold)."
            >
              <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
            </Tooltip>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Geospatial radius scanner for detecting duplicate sanctions and work overlaps
          </p>
        </div>

        {/* Radius Switcher & Recenter */}
        <div className="flex items-center gap-2">
          <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            {[1.0, 3.0, 5.0].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setActiveRadius(r)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                  activeRadius === r
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleRecenter}
            title="Recenter Map"
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
        <div
          ref={mapContainerRef}
          style={{ height: '380px', width: '100%' }}
          className="z-10"
        />

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200/90 shadow-lg text-xs space-y-1.5">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Map Legend</div>
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-xs" />
            <span>Target Work ({targetProject?.projectId || 'MPL-10482'})</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-xs" />
            <span>Potential Duplicate / Overlap</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-xs" />
            <span>Independent Works in Radius</span>
          </div>
        </div>
      </div>

      {/* Nearby Works Grid */}
      {nearbyProjects.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              Identified Works in Radius ({nearbyProjects.length}):
            </span>
            <span className="font-mono text-slate-400 text-[11px]">
              GPS Proximity Evaluated
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {nearbyProjects.map((p) => (
              <div
                key={p.projectId}
                className={`p-3 rounded-xl border transition-all ${
                  p.potentialOverlap
                    ? 'bg-orange-50/70 border-orange-200 hover:border-orange-300'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs font-bold text-slate-900">
                  <span>{p.projectId}</span>
                  <span className="text-slate-500 font-sans font-medium text-[11px]">
                    {p.distanceKm} km away
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-800 truncate mt-1">
                  {p.projectName}
                </div>
                {p.potentialOverlap ? (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded-md">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span>Potential Scope Overlap</span>
                  </div>
                ) : (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Independent Scope</span>
                  </div>
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

print("Tooltip.jsx and GISMap.jsx created.")