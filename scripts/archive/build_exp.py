import os
BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src"

code = """import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import RiskBadge from './RiskBadge';

export default function ExplainabilityCard({ score, level, factors = [] }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const getCleanCategory = (type) => {
    const map = {
      'ISOLATION_FOREST_ANOMALY': 'TIMELINE & BUDGET OUTLIER',
      'MULTIVARIATE_METRIC_OUTLIER': 'TIMELINE & BUDGET OUTLIER',
      'LOF_PEER_ANOMALY': 'DISTRICT PEER DEVIATION',
      'PEER_GROUP_DEVIATION': 'DISTRICT PEER DEVIATION',
      'BENFORD_FINANCIAL_ANOMALY': 'PAYMENT VOUCHER PATTERN',
      'PAYMENT_DIGIT_IRREGULARITY': 'PAYMENT VOUCHER PATTERN',
      'PROGRESS_EXPENDITURE_MISMATCH': 'PROGRESS & SPEND MISMATCH',
      'DELAY': 'SCHEDULE OVERDUE',
      'PROGRESS_DELAY': 'MILESTONE DELAY',
      'REPEATED_FUNDING': 'REPEATED LOCAL FUNDING',
      'POTENTIAL_DUPLICATE': 'GEOSPATIAL PROXIMITY',
      'COST_OVERRUN': 'BUDGET VARIANCE'
    };
    return map[type] || type.replace(/_/g, ' ');
  };

  const defaultFactors = [
    { type: 'PROGRESS_EXPENDITURE_MISMATCH', severity: 'HIGH', score: 88, explanation: '86.7% expenditure disbursed against 38.0% physical completion on site (48.7% progress-spend gap).' },
    { type: 'DELAY', severity: 'HIGH', score: 85, explanation: 'Project is 137 days overdue past official target completion milestone.' },
    { type: 'MULTIVARIATE_METRIC_OUTLIER', severity: 'HIGH', score: 89, explanation: 'Simultaneous lag across milestone progress (42.0% gap), timeline duration, and disbursement velocity.' },
    { type: 'PEER_GROUP_DEVIATION', severity: 'HIGH', score: 86, explanation: 'Cost per physical progress unit is 2.3x higher than local peer community works in Pune.' },
    { type: 'PAYMENT_DIGIT_IRREGULARITY', severity: 'MEDIUM', score: 72, explanation: 'Unusual financial voucher first-digit distribution across 12 payment tranches - audit review recommended.' },
    { type: 'REPEATED_FUNDING', severity: 'HIGH', score: 80, explanation: '2 historical works identified under same category and location in previous fiscal years.' },
    { type: 'POTENTIAL_DUPLICATE', severity: 'MEDIUM', score: 75, explanation: 'Similar project (MPL-9812) located within 0.8 km radius - spatial overlap review recommended.' }
  ];

  const list = factors.length > 0 ? factors : defaultFactors;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Explainable Anomaly Findings</h3>
          <p className="text-xs text-slate-500 mt-0.5">Automated screening observations and risk rationale</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Composite Risk Score</span>
            <span className="text-xl font-bold font-mono text-slate-900">{score || 94} <span className="text-xs text-slate-400 font-normal">/ 100</span></span>
          </div>
          <RiskBadge level={level || 'CRITICAL'} />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
          Flagged Observations ({list.length}):
        </p>

        <div className="space-y-2">
          {list.map((factor, index) => {
            const isExpanded = expandedIndex === index;
            const category = getCleanCategory(factor.type);
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
                    <span className="text-[10px] font-mono text-slate-500 font-medium px-2 py-0.5 bg-white rounded border border-slate-200">
                      {category}
                    </span>
                    {factor.score && (
                      <span className="text-[11px] font-mono font-bold text-slate-700">
                        {factor.score}/100
                      </span>
                    )}
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
                      <span>Indicator Score: <b>{factor.score || 85}/100</b></span>
                      <span>Severity Tier: <b>{factor.severity || 'HIGH'}</b></span>
                      <span>Category: <b>{category}</b></span>
                    </div>
                    <p className="text-[11px] text-slate-500 pt-1">
                      Signal flagged by statistical multi-signal baseline comparison. Officer verification of milestone inspection logs and payment vouchers recommended.
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
"""

with open(os.path.join(BASE, "components", "ExplainabilityCard.jsx"), "w", encoding="utf-8") as f:
    f.write(code.strip())
print("ExplainabilityCard updated.")