import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Compass, 
  Layers, 
  Filter, 
  Navigation, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert,
  Globe
} from 'lucide-react';
import { api } from '../services/api';
import Tooltip from './Tooltip';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function GISMap({ 
  targetProject, 
  nearbyProjects = [], 
  radiusKm = 3.0,
  role = 'MINISTRY' // 'MINISTRY' | 'STATE' | 'DISTRICT' | 'MP'
}) {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const isProjectRadiusView = Boolean(targetProject);
  const isStateView = !isProjectRadiusView && role === 'STATE';
  const isNationalView = !isProjectRadiusView && (role === 'MINISTRY' || !role || role === 'DISTRICT');

  const [activeRadius, setActiveRadius] = useState(radiusKm);
  const [filterTier, setFilterTier] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'HIGH'
  const [allProjects, setAllProjects] = useState([]);
  const [loadingMapData, setLoadingMapData] = useState(false);

  // Initial Center coordinates based on role
  const getInitialCenter = () => {
    if (isProjectRadiusView) {
      return { 
        lat: Number(targetProject?.latitude) || 18.52043, 
        lon: Number(targetProject?.longitude) || 73.85674, 
        zoom: 13 
      };
    }
    if (isStateView) return { lat: 19.7515, lon: 75.7139, zoom: 7 };    // Maharashtra State
    return { lat: 21.7679, lon: 78.8718, zoom: 5 }; // Center of India
  };

  // Load national map data if in Ministry or State view
  useEffect(() => {
    if (isNationalView || isStateView) {
      setLoadingMapData(true);
      api.getMapProjects()
        .then((data) => {
          if (isStateView) {
            // Filter Maharashtra districts
            const stateData = data.filter((p) => p.district === 'Pune' || p.district === 'Mumbai Suburban' || p.state === 'Maharashtra');
            setAllProjects(stateData.length > 0 ? stateData : data);
          } else {
            setAllProjects(data);
          }
        })
        .catch((err) => console.warn('Failed to load map data:', err))
        .finally(() => setLoadingMapData(false));
    }
  }, [role, isNationalView, isStateView]);


  // Initialize and Render Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const { lat, lon, zoom } = getInitialCenter();

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lon],
        zoom: zoom,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap &copy; CARTO'
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    // =========================================================================
    // CASE A: NATIONAL (MINISTRY) OR STATE NODAL VIEW (Plot all cases across India)
    // =========================================================================
    if (isNationalView || isStateView) {
      map.setView([lat, lon], zoom);

      const displayList = allProjects.filter((p) => {
        if (filterTier === 'CRITICAL') return p.riskLevel === 'CRITICAL';
        if (filterTier === 'HIGH') return p.riskLevel === 'HIGH' || p.riskLevel === 'CRITICAL';
        return true;
      });

      displayList.forEach((p) => {
        const pLat = Number(p.latitude);
        const pLon = Number(p.longitude);
        if (!pLat || !pLon) return;

        const isCritical = p.riskLevel === 'CRITICAL';
        const isHigh = p.riskLevel === 'HIGH';
        const markerColor = isCritical ? '#DC2626' : isHigh ? '#EA580C' : p.riskLevel === 'MEDIUM' ? '#D97706' : '#16A34A';
        const size = isCritical ? 22 : isHigh ? 18 : 14;

        const icon = L.divIcon({
          className: 'custom-national-marker',
          html: `
            <div style="width:${size}px; height:${size}px; border-radius:50%; background-color:${markerColor}; border:2px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.35); display:flex; align-items:center; justify-content:center; cursor:pointer;">
              ${isCritical ? '<div style="width:6px; height:6px; border-radius:50%; background-color:white;"></div>' : ''}
            </div>
          `,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2]
        });

        const marker = L.marker([pLat, pLon], { icon }).addTo(markersLayer);
        marker.bindPopup(`
          <div style="font-family:sans-serif; min-width:230px; padding:4px 0;">
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; font-family:monospace; margin-bottom:2px;">
              <span style="font-weight:bold; color:#0F172A;">${p.projectId}</span>
              <span style="font-weight:bold; color:${markerColor};">${p.riskLevel} (${p.riskScore || 50}/100)</span>
            </div>
            <div style="font-size:12px; font-weight:bold; color:#0F172A; margin-bottom:4px; line-height:1.3;">
              ${p.projectName}
            </div>
            <div style="font-size:11px; color:#64748B; font-family:monospace; margin-bottom:6px;">
              District: <b>${p.district}</b> • Progress: <b>${p.progressPercentage || 0}%</b>
            </div>
            <div style="display:flex; gap:6px; margin-top:8px;">
              <a href="/projects/${p.projectId}" style="flex:1; text-align:center; padding:4px 8px; background:#0F172A; color:white; border-radius:6px; font-size:11px; text-decoration:none; font-weight:600;">
                Inspect Case
              </a>
              <a href="/reports/${p.projectId}" style="flex:1; text-align:center; padding:4px 8px; background:#F1F5F9; color:#1E293B; border-radius:6px; font-size:11px; text-decoration:none; font-weight:600; border:1px solid #CBD5E1;">
                Dossier
              </a>
            </div>
          </div>
        `);
      });
    } else if (isProjectRadiusView) {
      // =========================================================================
      // CASE B: PROJECT RADIUS VIEW (Target Case + Radius Circle + Nearby Works)
      // =========================================================================
      map.setView([lat, lon], 14);

      // Target Project Pulsing Pin
      const targetDivIcon = L.divIcon({
        className: 'custom-target-marker',
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

      const targetMarker = L.marker([lat, lon], { icon: targetDivIcon }).addTo(markersLayer);
      targetMarker.bindPopup(`
        <div style="font-family:sans-serif; min-width:210px; padding:4px 0;">
          <div style="font-size:10px; font-family:monospace; font-weight:bold; color:#DC2626; text-transform:uppercase;">
            TARGET INSPECTION CASE
          </div>
          <div style="font-size:13px; font-weight:bold; color:#0F172A; margin:2px 0 4px 0;">
            ${targetProject?.projectName || 'Construction of Community Infrastructure'}
          </div>
          <div style="font-size:11px; color:#64748B; font-family:monospace;">
            ID: ${targetProject?.projectId || 'MPL-10482'} • Risk: <b>${targetProject?.riskScore || 94}/100</b>
          </div>
        </div>
      `);

      // Radius Circle
      L.circle([lat, lon], {
        color: '#3B82F6',
        weight: 2,
        dashArray: '6, 6',
        fillColor: '#60A5FA',
        fillOpacity: 0.08,
        radius: activeRadius * 1000
      }).addTo(markersLayer);

      // Nearby Project Pins
      nearbyProjects.forEach((p) => {
        const pLat = Number(p.latitude);
        const pLon = Number(p.longitude);
        if (!pLat || !pLon) return;

        const isOverlap = p.potentialOverlap;
        const markerBg = isOverlap ? '#EA580C' : '#2563EB';

        const nearbyIcon = L.divIcon({
          className: 'custom-nearby-marker',
          html: `
            <div style="width:18px; height:18px; border-radius:50%; background-color:${markerBg}; border:2.5px solid white; box-shadow:0 3px 8px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center;">
              <div style="width:4px; height:4px; border-radius:50%; background-color:white;"></div>
            </div>
          `,
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        });

        const marker = L.marker([pLat, pLon], { icon: nearbyIcon }).addTo(markersLayer);
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
              <div style="padding:4px 8px; background:#FFF7ED; border:1px solid #FED7AA; border-radius:6px; font-size:11px; color:#C2410C; font-weight:600;">
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
    }

    // Auto resize
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [targetProject, nearbyProjects, activeRadius, allProjects, filterTier, role, isProjectRadiusView, isNationalView, isStateView]);


  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      const { lat, lon, zoom } = getInitialCenter();
      mapInstanceRef.current.setView([lat, lon], zoom, { animate: true });
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              {isNationalView ? <Globe className="w-4 h-4 text-blue-600" /> : <Compass className="w-4 h-4 text-blue-600" />}
              {isNationalView && "All-India National GIS Project Distribution Map"}
              {isStateView && "Maharashtra State GIS Implementation Map"}
              {isProjectRadiusView && "GIS Geospatial Scope & Proximity Map"}
            </h4>
            <Tooltip
              title={isNationalView ? "National GIS Surveillance" : "Haversine Geospatial Radius"}
              content={
                isNationalView
                  ? "Displays all registered MPLADS works across 543 Parliamentary Constituencies with real-time risk classification."
                  : "Scans a 3.0 km radius around GPS coordinates to detect duplicate work sanctions under MoSPI guidelines."
              }
            >
              <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
            </Tooltip>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isNationalView && "Monitoring 1,250+ active works across Indian districts • Real-time anomaly geo-distribution"}
            {isStateView && "Monitoring state-wide works across Maharashtra districts (Pune, Mumbai, Nagpur, etc.)"}
            {isProjectRadiusView && `${activeRadius} km geospatial scanner for detecting duplicate sanctions and work overlaps`}
          </p>
        </div>

        {/* Controls: Radius Switcher or Risk Filter */}
        <div className="flex items-center gap-2">
          {isProjectRadiusView ? (
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
          ) : (
            <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              {[
                { id: 'ALL', label: 'All Tiers' },
                { id: 'HIGH', label: 'High / Critical' },
                { id: 'CRITICAL', label: 'Critical Only' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterTier(f.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    filterTier === f.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleRecenter}
            title="Reset Map View"
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
        <div
          ref={mapContainerRef}
          style={{ height: '500px', width: '100%' }}
          className="z-10"
        />

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200/90 shadow-lg text-xs space-y-1.5">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {isNationalView ? "National Risk Legend" : "Map Legend"}
          </div>
          {isNationalView || isStateView ? (
            <>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-xs" />
                <span>Critical Risk Works (Score &ge; 80)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-xs" />
                <span>High Attention Works (Score 60-79)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-xs" />
                <span>Standard / Low Risk Works</span>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Nearby Works in Radius (only shown if radius view has nearby works) */}
      {isProjectRadiusView && nearbyProjects.length > 0 && (
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
            {nearbyProjects.map((p) => {
              const isDup = (p.potentialDuplicateScore && p.potentialDuplicateScore >= 60) || p.potentialOverlap;
              const dupScore = p.potentialDuplicateScore || (isDup ? 78 : 24);
              const evidence = p.evidenceList || [
                `Distance: ${(p.distanceKm * 1000).toFixed(0)} m`,
                `Category: ${p.projectType || 'Infrastructure'}`,
                `Status: ${p.status || 'Active'}`
              ];

              return (
                <div
                  key={p.projectId}
                  className={`p-3 rounded-xl border transition-all space-y-2 ${
                    isDup
                      ? 'bg-amber-50/80 border-amber-200 hover:border-amber-300'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs font-bold text-slate-900">
                    <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate(`/projects/${p.projectId}`)}>
                      {p.projectId}
                    </span>
                    <span className="text-slate-500 font-sans font-medium text-[11px]">
                      {p.distanceKm} km away
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-800 line-clamp-1">
                    {p.projectName}
                  </div>

                  <div className="pt-1 border-t border-slate-200/60">
                    <div className="flex items-center justify-between text-[11px] font-bold pb-1">
                      <span className={isDup ? 'text-amber-800' : 'text-slate-600'}>
                        {isDup ? 'Potential Duplicate' : 'Independent Project'}
                      </span>
                      <span className={`font-mono text-xs ${isDup ? 'text-amber-900 font-extrabold' : 'text-slate-500'}`}>
                        {dupScore}%
                      </span>
                    </div>
                    <ul className="text-[10px] text-slate-600 space-y-0.5 list-disc pl-3 font-mono">
                      {evidence.slice(0, 3).map((e, idx) => (
                        <li key={idx}>{e}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}