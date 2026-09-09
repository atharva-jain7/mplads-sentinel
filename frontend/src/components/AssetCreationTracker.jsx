import React from 'react';
import { Building2, Droplets, BookOpen, Stethoscope, Compass, ShieldCheck, Info } from 'lucide-react';
import Tooltip from './Tooltip';

export default function AssetCreationTracker() {
  const assets = [
    { 
      category: 'Drinking Water & Sanitation', 
      icon: Droplets, 
      delivered: 284, 
      inProgress: 142, 
      compliance: '98.2%', 
      rule: 'MoSPI Guidelines Ch 3.1: Minimum 15% quota for basic civic water purification and public toilet complexes.' 
    },
    { 
      category: 'Community Halls & Centers', 
      icon: Building2, 
      delivered: 196, 
      inProgress: 88, 
      compliance: '91.4%', 
      rule: 'MoSPI Guidelines Ch 3.2: Multi-purpose community structures and village knowledge centers on government land.' 
    },
    { 
      category: 'Education & Science Labs', 
      icon: BookOpen, 
      delivered: 312, 
      inProgress: 95, 
      compliance: '96.8%', 
      rule: 'MoSPI Guidelines Ch 3.3: Digital classrooms, science laboratories and residential hostels in government schools.' 
    },
    { 
      category: 'Healthcare Diagnostic Wings', 
      icon: Stethoscope, 
      delivered: 142, 
      inProgress: 64, 
      compliance: '94.0%', 
      rule: 'MoSPI Guidelines Ch 3.4: Primary health center diagnostic wards, ambulances, and ICU equipment.' 
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Durable Asset Creation & Civic Amenities
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">Physical asset verification and operational readiness status</p>
        </div>
        <Tooltip
          title="DURABLE COMMUNITY ASSETS"
          content="Assets created must be permanent in nature, accessible to the public, and dedicated for community benefit under MPLADS Chapter 3."
        >
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 cursor-help">
            934 Assets Delivered
          </span>
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        {assets.map((a) => {
          const Icon = a.icon;
          return (
            <Tooltip key={a.category} title={a.category} content={a.rule} position="top" className="w-full">
              <div className="w-full p-3 bg-slate-50/70 hover:bg-slate-100/70 rounded-xl border border-slate-200/80 flex items-center justify-between transition-colors cursor-help text-left">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-700 shadow-2xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">{a.category}</h5>
                    <div className="text-[11px] text-slate-500 font-mono">
                      <span className="text-slate-900 font-bold">{a.delivered}</span> Verified • <span className="text-slate-600">{a.inProgress}</span> Active
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Compliance</span>
                  <span className="text-xs font-mono font-extrabold text-emerald-700">{a.compliance}</span>
                </div>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}