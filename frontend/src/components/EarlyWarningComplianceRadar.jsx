import React from 'react';
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