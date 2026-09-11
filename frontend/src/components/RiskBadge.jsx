import React from 'react';
import Tooltip from './Tooltip';

export default function RiskBadge({ level, score }) {
  const rawLvl = (level || 'LOW').toUpperCase();
  const lvl = rawLvl === 'MEDIUM' ? 'MODERATE' : rawLvl;
  
  const styles = {
    CRITICAL: 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100',
    HIGH: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
    MODERATE: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
    LOW: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
  };

  const dotColors = {
    CRITICAL: 'bg-rose-500',
    HIGH: 'bg-amber-500',
    MODERATE: 'bg-blue-500',
    LOW: 'bg-emerald-500'
  };

  const descriptions = {
    CRITICAL: 'Critical Risk (Score 80-100): Anomaly signals flagged across timeline, budget, or duplicate sanctions. Priority administrative review recommended.',
    HIGH: 'High Risk (Score 60-79): Significant schedule delay (>90 days) or budget variance. Supervisory attention recommended.',
    MODERATE: 'Moderate Risk (Score 30-59): Minor execution variance within acceptable operational thresholds.',
    LOW: 'Low Risk (Score 0-29): Project execution parameters compliant with sanctioned milestone targets.'
  };

  return (
    <Tooltip
      title={`${lvl} RISK TIER`}
      content={descriptions[lvl] || descriptions.LOW}
      position="top"
    >
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors cursor-help font-mono whitespace-nowrap ${styles[lvl] || styles.LOW}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[lvl] || dotColors.LOW}`} />
        <span>{lvl}</span>
        {score !== undefined && score !== null && (
          <span className="font-bold opacity-90">
            · {score}
          </span>
        )}
      </span>
    </Tooltip>
  );
}