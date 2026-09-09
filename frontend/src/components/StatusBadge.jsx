import React from 'react';
import Tooltip from './Tooltip';

export default function StatusBadge({ status }) {
  const st = (status || 'UNKNOWN').toUpperCase();

  const styles = {
    RECOMMENDED: 'bg-slate-100 text-slate-700 border-slate-200',
    SANCTIONED: 'bg-blue-50 text-blue-700 border-blue-200',
    IN_PROGRESS: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    DELAYED: 'bg-orange-50 text-orange-700 border-orange-200',
    OVERDUE: 'bg-red-50 text-red-700 border-red-200',
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  const descriptions = {
    RECOMMENDED: 'Administrative Stage 1: Recommended by Hon\'ble Member of Parliament. Under technical and financial scrutiny by District Nodal Authority.',
    SANCTIONED: 'Administrative Stage 2: Formally sanctioned by District Collector / Magistrate. Work order issued to Implementing Agency.',
    IN_PROGRESS: 'Administrative Stage 3: On-site civil construction active. Tranche disbursements released against Measurement Book milestones.',
    DELAYED: 'Administrative Alert: Exceeded sanctioned milestone timeline. Formal explanation required from Implementing Agency.',
    OVERDUE: 'Administrative Warning: Overdue milestone deadline by > 180 days. Financial disbursements frozen pending audit.',
    COMPLETED: 'Administrative Stage 4: Physical civil works completed, verified on-site, and dedicated as a durable community asset.'
  };

  const formatText = (text) => text.replace('_', ' ');

  return (
    <Tooltip
      title={`STAGE: ${formatText(st)}`}
      content={descriptions[st] || 'Official administrative project lifecycle status under MPLADS guidelines.'}
      position="top"
    >
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors cursor-help ${styles[st] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
        {formatText(st)}
      </span>
    </Tooltip>
  );
}