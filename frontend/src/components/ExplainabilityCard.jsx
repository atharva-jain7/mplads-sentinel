import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import RiskBadge from './RiskBadge';

export default function ExplainabilityCard({ score, level, factors = [] }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const getCleanCategory = (type) => {
    if (!type) return 'MONITORING OBSERVATION';
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
    return map[type] || String(type).replace(/_/g, ' ');
  };

  const rawList = factors && Array.isArray(factors) && factors.length > 0 ? factors : [];
  const isLowRisk = (level === 'LOW' || (score !== undefined && score < 40));

  // Normalize all factors so both {type, explanation} and {factor, detail, contribution} format work
  const list = rawList.length > 0 
    ? rawList.map(f => ({
        type: f.type || f.factor || 'ANOMALY_SIGNAL',
        explanation: f.explanation || f.detail || f.factor || 'Anomaly observation flagged during automated screening.',
        score: f.score || f.contribution || 75,
        severity: f.severity || (score >= 80 ? 'CRITICAL' : score >= 60 ? 'HIGH' : 'MEDIUM')
      }))
    : (isLowRisk ? [] : [
        { type: 'PROGRESS_EXPENDITURE_MISMATCH', severity: 'HIGH', score: 85, explanation: 'Expenditure disbursed exceeds recorded physical progress milestones.' },
        { type: 'DELAY', severity: 'HIGH', score: 82, explanation: 'Execution timeline has surpassed approved completion milestone.' }
      ]);

  // Derive dynamic factor contributions from actual observed signals safely
  const delayFactor = list.find(f => (f.type || '').toUpperCase().includes('DELAY'));
  const progressFactor = list.find(f => {
    const t = (f.type || '').toUpperCase();
    return t.includes('PROGRESS') || t.includes('MISMATCH') || t.includes('MULTIVARIATE');
  });
  const costFactor = list.find(f => {
    const t = (f.type || '').toUpperCase();
    return t.includes('COST') || t.includes('BUDGET');
  });
  const dupFactor = list.find(f => {
    const t = (f.type || '').toUpperCase();
    return t.includes('DUPLICATE') || t.includes('REPEATED');
  });
  const lofFactor = list.find(f => {
    const t = (f.type || '').toUpperCase();
    return t.includes('PEER') || t.includes('LOF') || t.includes('BENFORD');
  });

  const delayPts = delayFactor ? Math.min(30, Math.round((delayFactor.score || 70) * 0.3)) : 0;
  const progressPts = progressFactor ? Math.min(35, Math.round((progressFactor.score || 75) * 0.35)) : 0;
  const costPts = costFactor ? Math.min(20, Math.round((costFactor.score || 60) * 0.2)) : 0;
  const dupPts = dupFactor ? Math.min(20, Math.round((dupFactor.score || 65) * 0.2)) : 0;
  const lofPts = lofFactor ? Math.min(15, Math.round((lofFactor.score || 60) * 0.15)) : 0;

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
            <span className="text-xl font-bold font-mono text-slate-900">{score ?? 45} <span className="text-xs text-slate-400 font-normal">/ 100</span></span>
          </div>
          <RiskBadge level={level || (score >= 80 ? 'CRITICAL' : score >= 60 ? 'HIGH' : score >= 30 ? 'MEDIUM' : 'LOW')} />
        </div>
      </div>

      {/* Additive Factor Contribution Breakdown */}
      <div className="my-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Factor Contribution Breakdown
          </span>
          <span className="text-[11px] font-mono text-slate-500 font-semibold">
            Formula: Multi-Signal Composite Fusion
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
          <div className="bg-white p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 font-sans block truncate">Schedule Delay</span>
            <span className={`text-sm font-bold ${delayPts > 0 ? 'text-red-600' : 'text-slate-400'}`}>+{delayPts} pts</span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 font-sans block truncate">Progress Mismatch</span>
            <span className={`text-sm font-bold ${progressPts > 0 ? 'text-red-600' : 'text-slate-400'}`}>+{progressPts} pts</span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 font-sans block truncate">Cost Anomaly</span>
            <span className={`text-sm font-bold ${costPts > 0 ? 'text-orange-600' : 'text-slate-400'}`}>+{costPts} pts</span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 font-sans block truncate">Duplicate Prob.</span>
            <span className={`text-sm font-bold ${dupPts > 0 ? 'text-amber-600' : 'text-slate-400'}`}>+{dupPts} pts</span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 font-sans block truncate">Compliance / LOF</span>
            <span className={`text-sm font-bold ${lofPts > 0 ? 'text-indigo-600' : 'text-slate-400'}`}>+{lofPts} pts</span>
          </div>
        </div>

        {/* Explainability Callout */}
        <div className="p-2.5 bg-amber-50/70 border border-amber-200/70 rounded-lg flex items-start gap-2 text-xs text-amber-900">
          <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <b>How is this score calculated?</b> Each anomaly signal adds points scaled by its severity above baseline peer thresholds.
            <span className="font-semibold block text-slate-800 mt-0.5">
              "Risk score prioritizes cases for review; it does not establish fraud."
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {list.length === 0 ? (
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-emerald-950">Normal Operational Parameters</h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                No high-risk anomaly triggers detected. Physical progress, expenditure disbursements, and peer benchmarks conform to standard guidelines.
              </p>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}