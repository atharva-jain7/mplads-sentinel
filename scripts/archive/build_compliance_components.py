import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src"

def save(rel_path, content):
    full = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Created: {rel_path}")

# 1. AssetCreationTracker.jsx
save("components/AssetCreationTracker.jsx", """import React from 'react';
import { Building2, Droplets, BookOpen, Stethoscope, Compass, ShieldCheck } from 'lucide-react';

export default function AssetCreationTracker() {
  const assets = [
    { category: 'Drinking Water & Sanitation', icon: Droplets, delivered: 284, inProgress: 142, compliance: '98.2%', durable: true },
    { category: 'Community Halls & Centers', icon: Building2, delivered: 196, inProgress: 88, compliance: '91.4%', durable: true },
    { category: 'Education & Science Labs', icon: BookOpen, delivered: 312, inProgress: 95, compliance: '96.8%', durable: true },
    { category: 'Healthcare Diagnostic Wings', icon: Stethoscope, delivered: 142, inProgress: 64, compliance: '94.0%', durable: true }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Durable Asset Creation & Civic Amenities
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">Physical asset verification and operational readiness status</p>
        </div>
        <span className="text-[11px] font-mono font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
          934 Assets Delivered
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        {assets.map((a) => {
          const Icon = a.icon;
          return (
            <div key={a.category} className="p-3 bg-slate-50/70 rounded-lg border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-md border border-slate-200 text-slate-700">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-slate-800">{a.category}</h5>
                  <div className="text-[11px] text-slate-500 font-mono">
                    <span className="text-slate-900 font-bold">{a.delivered}</span> Verified • <span className="text-slate-600">{a.inProgress}</span> Active
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Compliance</span>
                <span className="text-xs font-mono font-bold text-emerald-700">{a.compliance}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
""")

# 2. EarlyWarningComplianceRadar.jsx
save("components/EarlyWarningComplianceRadar.jsx", """import React from 'react';
import { AlertCircle, Clock, FileCheck, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function EarlyWarningComplianceRadar() {
  const earlyWarnings = [
    { id: 'MPL-10482', risk: '90-Day Predictive Delay Warning', detail: 'Fund velocity (86.7%) outpaces physical trajectory by 48.7%. Estimated 180-day completion overrun without intervention.', status: 'CRITICAL' },
    { id: 'MPL-9182', risk: 'Statutory UC Overdue', detail: 'Utilization Certificate (UC) pending past 12 months for ₹24.5L tranche disbursement.', status: 'HIGH' },
    { id: 'MPL-6651', risk: 'Dual Work Overlap Warning', detail: 'Identified identical drainage estimate scope within 0.8 km of active municipal works.', status: 'HIGH' }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            Early Warning & Automated Compliance Radar
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">Predictive schedule forecasting & statutory norm compliance</p>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200">
          PREDICTIVE AI RADAR
        </span>
      </div>

      <div className="mt-3 space-y-2.5">
        {earlyWarnings.map((item) => (
          <div key={item.id} className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 text-xs space-y-1">
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
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 bg-slate-50 rounded border border-slate-200/80">
          <span className="text-[10px] text-slate-400 uppercase block font-medium">UC Verification</span>
          <span className="font-mono font-bold text-emerald-700">94.6%</span>
        </div>
        <div className="p-2 bg-slate-50 rounded border border-slate-200/80">
          <span className="text-[10px] text-slate-400 uppercase block font-medium">Joint Inspection</span>
          <span className="font-mono font-bold text-slate-800">89.2%</span>
        </div>
        <div className="p-2 bg-slate-50 rounded border border-slate-200/80">
          <span className="text-[10px] text-slate-400 uppercase block font-medium">MB Auditing</span>
          <span className="font-mono font-bold text-emerald-700">97.1%</span>
        </div>
      </div>
    </div>
  );
}
""")

print("AssetCreationTracker and EarlyWarningComplianceRadar created.")