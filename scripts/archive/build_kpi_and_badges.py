import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src"

def save(rel_path, content):
    full = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Updated: {rel_path}")

# =========================================================================
# 1. KPICard.jsx with On-Hover Popovers & Sleek Box Styling
# =========================================================================
save("components/KPICard.jsx", """import React from 'react';
import Tooltip from './Tooltip';

export default function KPICard({ title, value, subtitle, icon: Icon, color = 'slate', description }) {
  const iconColors = {
    red: 'text-red-600 bg-red-50 border-red-100',
    orange: 'text-orange-600 bg-orange-50 border-orange-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    slate: 'text-slate-700 bg-slate-100 border-slate-200'
  };

  const defaultDescriptions = {
    'Total Works': 'Total active works registered across the selected jurisdiction under MPLADS guidelines.',
    'Monitored Works': 'Total active works registered across the selected jurisdiction under MPLADS guidelines.',
    'All-India Works': 'Total active works across all 543 Parliamentary Constituencies registered in e-SAKSHI.',
    'State Works': 'Total works registered under Maharashtra State Nodal Authority oversight.',
    'District Works': 'Total works sanctioned and executed in Pune District.',
    'Critical Priority': 'Composite Risk Index >= 80. Flagged by multi-signal anomaly models. Immediate on-site audit required.',
    'Critical Risk': 'Composite Risk Index >= 80. Flagged by multi-signal anomaly models. Immediate on-site audit required.',
    'High Attention': 'Risk Score 60 to 79. Elevated milestone lag or cost-to-progress mismatch detected.',
    'High Risk': 'Risk Score 60 to 79. Elevated milestone lag or cost-to-progress mismatch detected.',
    'Delayed Execution': 'Works that have exceeded their official sanctioned completion target date by more than 30 days.',
    'Delayed': 'Works that have exceeded their official sanctioned completion target date by more than 30 days.',
    'Cost Overruns': 'Works where expenditure disbursement velocity outpaces verified physical milestone completion by > 20%.',
    'Cost Anomalies': 'Works where expenditure disbursement velocity outpaces verified physical milestone completion by > 20%.',
    'Duplicate Overlaps': 'Works identified within a 3.0 km geospatial radius sharing identical category, scope, or repetitive funding.',
    'Duplicates': 'Works identified within a 3.0 km geospatial radius sharing identical category, scope, or repetitive funding.'
  };

  const tooltipText = description || defaultDescriptions[title] || 'Official administrative monitoring indicator';

  return (
    <Tooltip title={title} content={tooltipText} position="bottom" className="w-full">
      <div className="w-full bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-help group text-left">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider group-hover:text-slate-800 transition-colors">
            {title}
          </p>
          {Icon && (
            <div className={`p-1.5 rounded-lg border ${iconColors[color] || iconColors.slate} transition-transform group-hover:scale-105`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
        <div className="mt-2.5">
          <h3 className="text-2xl font-extrabold font-mono text-slate-900 tracking-tight">
            {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          </h3>
          {subtitle ? (
            <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>
          ) : (
            <p className="text-[10px] text-slate-400 mt-1 font-mono flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              Hover for details
            </p>
          )}
        </div>
      </div>
    </Tooltip>
  );
}
""")

# =========================================================================
# 2. RiskBadge.jsx with On-Hover Popover
# =========================================================================
save("components/RiskBadge.jsx", """import React from 'react';
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
""")

# =========================================================================
# 3. StatusBadge.jsx with On-Hover Popover
# =========================================================================
save("components/StatusBadge.jsx", """import React from 'react';
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
    RECOMMENDED: 'Administrative Stage 1: Recommended by Hon\\'ble Member of Parliament. Under technical and financial scrutiny by District Nodal Authority.',
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
""")

print("KPICard, RiskBadge, and StatusBadge updated with interactive hover popovers.")