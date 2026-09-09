import React from 'react';
import Tooltip from './Tooltip';

export default function RiskBadge({ level, score }) {
  const lvl = (level || 'LOW').toUpperCase();
  
  const styles = {
    CRITICAL: 'bg-red-50 text-red-700 border-red-200/90 hover:bg-red-100',
    HIGH: 'bg-orange-50 text-orange-700 border-orange-200/90 hover:bg-orange-100',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200/90 hover:bg-amber-100',
    LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200/90 hover:bg-emerald-100'
  };

  const dotColors = {
    CRITICAL: 'bg-red-500',
    HIGH: 'bg-orange-500',
    MEDIUM: 'bg-amber-500',
    LOW: 'bg-emerald-500'
  };

  const descriptions = {
    CRITICAL: 'Critical Risk Tier (Score 80-100): Multi-signal anomaly detected across physical progress lag, expenditure outpaces schedule, or spatial duplicate. Mandatory on-site MB audit required.',
    HIGH: 'High Risk Tier (Score 60-79): Elevated timeline delay (>90 days) or budget variance exceeding 20%. Nodal officer review recommended.',
    MEDIUM: 'Medium Risk Tier (Score 30-59): Minor execution variance within acceptable operational thresholds. Monitored on standard quarterly schedule.',
    LOW: 'Low Risk Tier (Score 0-29): Normal project execution parameters in full compliance with sanctioned milestone targets.'
  };

  return (
    <Tooltip
      title={`${lvl} RISK CLASSIFICATION`}
      content={descriptions[lvl] || descriptions.LOW}
      position="top"
    >
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border transition-colors cursor-help ${styles[lvl] || styles.LOW}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[lvl] || dotColors.LOW}`} />
        <span>{lvl}</span>
        {score !== undefined && (
          <span className="font-mono font-bold ml-0.5 text-[11px] opacity-80">
            ({score})
          </span>
        )}
      </span>
    </Tooltip>
  );
}