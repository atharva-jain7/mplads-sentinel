import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src\components"

def save(rel_path, content):
    full = os.path.join(BASE, rel_path)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Updated: {rel_path}")

# 1. AssetCreationTracker.jsx with Tooltips
save("AssetCreationTracker.jsx", """import React from 'react';
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
""")

# 2. EarlyWarningComplianceRadar.jsx with Tooltips
save("EarlyWarningComplianceRadar.jsx", """import React from 'react';
import { AlertCircle, Clock, FileCheck, CheckCircle2, ShieldAlert, Info } from 'lucide-react';
import Tooltip from './Tooltip';

export default function EarlyWarningComplianceRadar() {
  const earlyWarnings = [
    { 
      id: 'MPL-10482', 
      risk: '90-Day Predictive Delay Warning', 
      detail: 'Fund velocity (86.7%) outpaces physical trajectory by 48.7%. Estimated 180-day completion overrun without intervention.', 
      status: 'CRITICAL',
      rule: 'Predictive algorithm projecting project deadline breach based on historic tranche disbursement cadence.'
    },
    { 
      id: 'MPL-9182', 
      risk: 'Statutory UC Overdue', 
      detail: 'Utilization Certificate (UC) pending past 12 months for ₹24.5L tranche disbursement.', 
      status: 'HIGH',
      rule: 'General Financial Rule (GFR 238): UCs must be submitted within 12 months before subsequent installments.'
    },
    { 
      id: 'MPL-6651', 
      risk: 'Dual Work Overlap Warning', 
      detail: 'Identified identical drainage estimate scope within 0.8 km of active municipal works.', 
      status: 'HIGH',
      rule: 'Anti-Duplication Directive: Prohibits sanctioning works already funded by State / Urban Local Bodies.'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            Early Warning & Automated Compliance Radar
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">Predictive schedule forecasting & statutory norm compliance</p>
        </div>
        <Tooltip
          title="PREDICTIVE FORECASTING ENGINE"
          content="Machine learning model trained on milestone velocity to identify projects at risk 90 days before official delay occurs."
        >
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-amber-50 text-amber-800 rounded-md border border-amber-200 cursor-help">
            PREDICTIVE RADAR
          </span>
        </Tooltip>
      </div>

      <div className="mt-3 space-y-2.5">
        {earlyWarnings.map((item) => (
          <Tooltip key={item.id} title={item.risk} content={item.rule} position="top" className="w-full">
            <div className="w-full p-3 bg-slate-50/80 hover:bg-slate-100/80 rounded-xl border border-slate-200 text-xs space-y-1 transition-colors cursor-help text-left">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-800">{item.id} • {item.risk}</span>
                <span className={`text-[10px] font-bold font-mono px-1.5 py-0.2 rounded border ${
                  item.status === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{item.detail}</p>
            </div>
          </Tooltip>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
        <Tooltip
          title="UTILIZATION CERTIFICATES (UC)"
          content="Compliance under GFR 238: 94.6% of disbursed funds have verified UCs submitted by implementing agencies."
          position="top"
          className="w-full"
        >
          <div className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200/80 cursor-help hover:bg-slate-100 transition-colors">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">UC Compliance</span>
            <span className="font-mono font-extrabold text-emerald-700">94.6%</span>
          </div>
        </Tooltip>

        <Tooltip
          title="MANDATORY JOINT INSPECTIONS"
          content="Joint on-site inspection by District Nodal Officer & Implementing Agency required for all works > ₹10 Lakhs."
          position="top"
          className="w-full"
        >
          <div className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200/80 cursor-help hover:bg-slate-100 transition-colors">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Joint Inspection</span>
            <span className="font-mono font-extrabold text-slate-800">89.2%</span>
          </div>
        </Tooltip>

        <Tooltip
          title="MEASUREMENT BOOK (MB) RECORDING"
          content="All physical milestone entries recorded, cross-verified with contractor bill submissions."
          position="top"
          className="w-full"
        >
          <div className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200/80 cursor-help hover:bg-slate-100 transition-colors">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">MB Auditing</span>
            <span className="font-mono font-extrabold text-emerald-700">97.1%</span>
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
""")

print("AssetCreationTracker and EarlyWarningComplianceRadar updated with Tooltips.")