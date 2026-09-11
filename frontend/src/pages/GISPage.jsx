import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Filter, ArrowLeft, ShieldAlert, Layers } from 'lucide-react';
import { authService } from '../services/auth';
import GISMap from '../components/GISMap';

export default function GISPage() {
  const navigate = useNavigate();
  const user = authService.getUser() || { roleId: 'MINISTRY', jurisdiction: 'National Central Oversight' };
  const isMP = user.roleId === 'MP';
  const isDistrict = user.roleId === 'DISTRICT';
  const isState = user.roleId === 'STATE';

  return (
    <div className="space-y-5 font-sans pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="hover:text-slate-900 font-medium flex items-center gap-1 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>
        <span>/</span>
        <span className="text-slate-800 font-semibold">GIS Surveillance</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-slate-900" />
              <span>Geospatial Risk Surveillance</span>
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-300">
              {isMP ? 'CONSTITUENCY SCANNER' : isDistrict ? 'DISTRICT GRID' : isState ? 'STATE GRID' : 'ALL-INDIA SURVEILLANCE'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive national and district GIS layer for detecting duplicate sanctions, spatial clusters, and work proximity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Overview</span>
          </button>
        </div>
      </div>

      {/* Guidance Note */}
      <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs flex items-start gap-2.5 text-xs text-slate-600">
        <ShieldAlert className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-slate-800">Spatial Proximity Protocol: </span>
          <span>
            The geospatial engine evaluates Haversine distance clustering within a 3.0 km buffer radius across registered works. Works identified in dense clusters are flagged for inspection to verify physical demarcation and prevent duplicate invoicing against identical civic assets.
          </span>
        </div>
      </div>

      {/* Full GIS Interactive Component */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <GISMap role={user.roleId || 'MINISTRY'} />
      </div>
    </div>
  );
}
