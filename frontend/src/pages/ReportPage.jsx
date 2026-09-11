import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import { authService } from '../services/auth';
import RiskBadge from '../components/RiskBadge';

export default function ReportPage() {
  const { reportId } = useParams();
  const user = authService.getUser();
  const isMP = user.roleId === 'MP';
  const isDistrict = user.roleId === 'DISTRICT';

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  let targetProjectId = reportId || 'MPL-10482';
  if (targetProjectId.startsWith('RPT-')) {
    const parts = targetProjectId.split('-');
    targetProjectId = 'MPL-' + parts[parts.length - 1];
  }

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const rep = await api.generateReport(targetProjectId);
      setReport(rep);
    } catch (err) {
      try {
        const p = await api.getProjectById(targetProjectId);
        const ana = await api.runRiskAnalysis(targetProjectId);
        setReport({
          reportId: `RPT-20260902-${p.projectId.replace('MPL-', '')}`,
          projectId: p.projectId,
          generatedAt: new Date().toISOString(),
          generatedBy: 'Rajesh Sharma',
          designation: 'Deputy Commissioner / District Nodal Officer',
          disclaimer: 'Analytical output for monitoring and investigation support only. It does not establish legal fraud or wrongdoing.',
          reportData: {
            project: p,
            riskScore: ana.riskScore || p.riskScore || 50,
            riskLevel: ana.riskLevel || p.riskLevel || 'LOW',
            investigationPriority: ana.investigationPriority || 'STANDARD',
            factors: ana.factors || [],
            recommendedVerificationSteps: [
              `Conduct on-site physical verification of completed civil structure in ${p.district} and compare against MB records.`,
              `Audit payment vouchers and verify milestone submission bills from contractor (${p.contractorName || 'Assigned Vendor'}).`,
              p.delayDays > 0 ? `Obtain formal explanation from Implementing Agency (${p.implementingAgency}) regarding ${p.delayDays} days schedule delay.` : 'Verify ongoing execution timeline against sanctioned milestones.',
              'Review physical milestone inspection logs against financial disbursement velocity.'
            ]
          }
        });
      } catch (innerErr) {
        console.warn('Fallback report generation:', innerErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !report) {
    return <div className="p-12 text-center text-slate-400 text-xs font-sans">Generating official dossier...</div>;
  }

  const d = report.reportData || {};
  const p = d.project || {};

  // STRICT JURISDICTION ENFORCEMENT
  const isUnauthorized = (isMP || isDistrict) && p.district && p.district !== 'Pune';

  if (isUnauthorized) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-red-200 rounded-2xl shadow-sm text-center space-y-4 font-sans">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Jurisdiction Access Restricted</h2>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            As {isMP ? "Hon'ble Member of Parliament for" : "District Officer for"}{' '}
            <b>{user.jurisdiction || 'Pune Parliamentary Constituency'}</b>, official audit dossiers are restricted to works recommended within your constituency.
          </p>
          <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500 font-mono">
            <div>Requested Dossier: <b>{p.projectId}</b></div>
            <div>Constituency / District: <b className="text-red-700">{p.district} ({p.state})</b></div>
          </div>
        </div>
        <button
          onClick={() => navigate('/projects')}
          className="w-full px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
        >
          Return to My Constituency Works
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12 font-sans">
      <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs print:hidden">
        <button
          onClick={() => navigate(`/projects/${p.projectId || targetProjectId}`)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Project Profile</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/investigation/${p.projectId || targetProjectId}`)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Investigation View
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-300 p-8 sm:p-10 rounded-xl shadow-xs print:border-none print:shadow-none print:p-0 space-y-5 text-slate-900 font-sans">
        <div className="border-b-2 border-slate-900 pb-3 text-center space-y-0.5">
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-600">GOVERNMENT OF INDIA • भारत सरकार</div>
          <div className="text-xs font-semibold text-slate-800">MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION</div>
          <div className="text-[11px] text-slate-600">MEMBERS OF PARLIAMENT LOCAL AREA DEVELOPMENT SCHEME (MPLADS)</div>
          <h2 className="text-sm font-bold tracking-tight text-slate-900 pt-2 uppercase">
            AI-GENERATED PROJECT REVIEW REPORT (SIH PROTOTYPE)
          </h2>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-200 mt-2">
            <span>Dossier ID: <b>{report.reportId || reportId}</b></span>
            <span>Generated: {new Date().toLocaleDateString('en-IN')}</span>
            <span>Classification: PROTOTYPE DECISION-SUPPORT</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 p-1.5 text-slate-800 border-l-3 border-slate-800">
            1. PROJECT PROFILE & ADMINISTRATIVE DETAILS
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs py-1">
            <div><span className="text-slate-500 block text-[10px]">PROJECT ID:</span><b className="font-mono">{p.projectId}</b></div>
            <div><span className="text-slate-500 block text-[10px]">PROJECT TYPE:</span><b>{p.projectType}</b></div>
            <div><span className="text-slate-500 block text-[10px]">STATUS:</span><b>{p.status}</b></div>
            <div><span className="text-slate-500 block text-[10px]">STATE / DISTRICT:</span><b>{p.district}, {p.state}</b></div>
            <div><span className="text-slate-500 block text-[10px]">CONSTITUENCY:</span><b>{p.constituency}</b></div>
            <div><span className="text-slate-500 block text-[10px]">LOCATION:</span><b>{p.location}</b></div>
            <div className="col-span-2"><span className="text-slate-500 block text-[10px]">IMPLEMENTING AGENCY:</span><b>{p.implementingAgency}</b></div>
            <div><span className="text-slate-500 block text-[10px]">CONTRACTOR:</span><b>{p.contractorName}</b></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 p-1.5 text-slate-800 border-l-3 border-slate-800">
              2. FINANCIAL SUMMARY
            </h3>
            <div className="text-xs space-y-1 font-mono">
              <div className="flex justify-between"><span>Sanctioned Amount:</span><b>₹{(p.sanctionedAmount || 0).toLocaleString('en-IN')}</b></div>
              <div className="flex justify-between"><span>Estimated Budget:</span><b>₹{(p.estimatedCost || 0).toLocaleString('en-IN')}</b></div>
              <div className="flex justify-between"><span>Expenditure Disbursed:</span><b className={p.fundUtilizationPercent > 80 ? 'text-red-700' : 'text-slate-900'}>₹{(p.expenditureAmount || 0).toLocaleString('en-IN')}</b></div>
              <div className="flex justify-between"><span>Fund Utilization:</span><b>{p.fundUtilizationPercent || 0}%</b></div>
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 p-1.5 text-slate-800 border-l-3 border-slate-800">
              3. PROGRESS & TIMELINE
            </h3>
            <div className="text-xs space-y-1 font-mono">
              <div className="flex justify-between"><span>Physical Progress:</span><b>{p.progressPercentage || 0}%</b></div>
              <div className="flex justify-between"><span>Expected Progress:</span><b>{p.expectedProgressPercentage || 0}%</b></div>
              <div className="flex justify-between"><span>Progress Gap:</span><b className={p.progressGap > 20 ? 'text-red-700' : 'text-slate-900'}>-{p.progressGap || 0}%</b></div>
              <div className="flex justify-between"><span>Timeline Variance:</span><b className={p.delayDays > 0 ? 'text-red-700' : 'text-slate-900'}>{p.delayDays || 0} Days {p.delayDays > 0 ? 'Overdue' : 'On Schedule'}</b></div>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 p-1.5 text-slate-800 border-l-3 border-slate-800">
            4. COMPOSITE RISK SCORE & MONITORING CLASSIFICATION
          </h3>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-medium uppercase block">COMPOSITE RISK INDEX</span>
              <span className="text-xl font-bold font-mono text-slate-900">{d.riskScore || p.riskScore || 50} / 100</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-medium uppercase block">INVESTIGATION PRIORITY</span>
              <span className={`text-xs font-bold uppercase ${d.riskScore >= 80 ? 'text-red-700' : d.riskScore >= 60 ? 'text-orange-700' : 'text-emerald-700'}`}>
                {d.investigationPriority || p.riskLevel || 'STANDARD'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 p-1.5 text-slate-800 border-l-3 border-slate-800">
            5. EXPLAINABLE RISK FINDINGS (WHY FLAGGED)
          </h3>
          {(d.factors && d.factors.length > 0) ? (
            <ul className="space-y-1 text-xs">
              {d.factors.map((f, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-bold">•</span>
                  <span><b>[{f.type.replace(/_/g, ' ')}]:</b> {f.explanation} {f.score ? <span className="font-mono text-[11px] text-slate-500">({f.score}/100)</span> : ''}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 py-1">No critical anomalies flagged. Project execution parameters remain within normal statistical tolerance.</p>
          )}
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 p-1.5 text-slate-800 border-l-3 border-slate-800 flex items-center justify-between">
            <span>6. RECOMMENDED NEXT STEPS FOR NODAL OFFICER</span>
            <span className="text-[10px] font-normal text-slate-500 lowercase">(advisory screening suggestions)</span>
          </h3>
          <ol className="list-decimal pl-4 text-xs space-y-1 text-slate-700">
            {(d.recommendedVerificationSteps || []).map((step, i) => (
              <li key={i} className="leading-relaxed">{step}</li>
            ))}
          </ol>
          <p className="text-[11px] text-slate-500 italic pt-1">
            Note: Final administrative decision remains with the competent authority. These steps are advisory screening suggestions generated by the automated risk engine.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-300 space-y-4">
          <div className="flex justify-between items-end text-xs">
            <div>
              <p className="text-[10px] text-slate-400">Transmitted Electronically via MPLADS Sentinel</p>
              <p className="font-semibold text-slate-700">MoSPI Monitoring Division</p>
            </div>
            <div className="text-right">
              <div className="h-8 w-28 border-b border-slate-300 mb-1" />
              <p className="font-semibold text-slate-900">{report.generatedBy || 'Rajesh Sharma'}</p>
              <p className="text-[10px] text-slate-400">{report.designation || 'Deputy Commissioner / Nodal Officer'}</p>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded text-[10px] text-slate-500 text-center border border-slate-200 leading-relaxed">
            {report.disclaimer || 'Analytical output for supervisory monitoring and investigation support only. Risk scores and anomaly signals do not establish fraud or legal culpability. Final determination rests with the competent statutory authority.'}
          </div>
        </div>
      </div>
    </div>
  );
}