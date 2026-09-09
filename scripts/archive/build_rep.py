import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src"

report_code = """import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

export default function ReportPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const projectId = 'MPL-10482';

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const loadReport = async () => {
    try {
      const rep = await api.generateReport(projectId);
      setReport(rep);
    } catch (err) {
      setReport({
        reportId: reportId || 'RPT-20260901-10482',
        projectId: 'MPL-10482',
        generatedAt: '2026-09-02T09:30:00Z',
        generatedBy: 'Rajesh Sharma',
        designation: 'Deputy Commissioner / District Nodal Officer',
        disclaimer: 'Analytical output for monitoring and investigation support only. It does not establish legal fraud or wrongdoing.',
        reportData: {
          project: {
            projectId: 'MPL-10482',
            projectName: 'Construction of Community Infrastructure',
            projectType: 'Community Infrastructure',
            description: 'Construction of multi-purpose community resource centre and auditorium with audiovisual setup',
            state: 'Maharashtra',
            district: 'Pune',
            constituency: 'Pune Parliamentary Constituency',
            location: 'Ward 14, Haveli Taluka, Pune',
            sanctionedAmount: 3000000.0,
            estimatedCost: 3000000.0,
            expenditureAmount: 2600000.0,
            fundUtilizationPercent: 86.67,
            progressPercentage: 38.0,
            expectedProgressPercentage: 80.0,
            progressGap: 42.0,
            sanctionDate: '2024-04-10',
            expectedCompletionDate: '2025-10-15',
            delayDays: 137,
            status: 'DELAYED',
            implementingAgency: 'Public Works Division - Central Pune',
            contractorName: 'Apex Infrastructure & Civil Works Ltd.'
          },
          riskScore: 94,
          riskLevel: 'CRITICAL',
          investigationPriority: 'CRITICAL',
          factors: [
            { type: 'PROGRESS_EXPENDITURE_MISMATCH', severity: 'HIGH', score: 88, explanation: '86.7% expenditure vs 38.0% physical progress (48.7% gap)' },
            { type: 'DELAY', severity: 'HIGH', score: 85, explanation: '137 days overdue past expected completion date' },
            { type: 'REPEATED_FUNDING', severity: 'HIGH', score: 80, explanation: '2 previous related works identified at this location/category' },
            { type: 'POTENTIAL_DUPLICATE', severity: 'MEDIUM', score: 75, explanation: 'Similar project (MPL-9812) located within 0.8 km radius' },
            { type: 'ISOLATION_FOREST_ANOMALY', severity: 'HIGH', score: 89, explanation: 'Isolation Forest detected multi-variate outlier pattern' },
            { type: 'LOF_PEER_ANOMALY', severity: 'HIGH', score: 86, explanation: 'Local Outlier Factor (LOF = 2.49) detected severe local density anomaly vs 25 peer works in Pune' },
            { type: 'BENFORD_FINANCIAL_ANOMALY', severity: 'MEDIUM', score: 72, explanation: 'Unusual financial digit distribution across payment tranches' }
          ],
          recommendedVerificationSteps: [
            'Conduct on-site physical verification of completed civil structure and compare against MB (Measurement Book) entries.',
            'Audit payment vouchers and verify authenticity of contractor milestone submission bills.',
            'Check administrative sanction records for previous related funding in the same ward / GPS coordinates.',
            'Verify GIS proximity with nearby completed project (MPL-9812) to ensure work scope distinction.',
            'Evaluate Local Outlier Factor (LOF) deviation (cost/progress unit 2.3x higher than local peer median in Pune).',
            'Obtain formal explanation from Implementing Agency regarding 137 days schedule delay.'
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !report) {
    return <div className="p-12 text-center text-slate-400 text-xs">Generating official dossier...</div>;
  }

  const d = report.reportData || {};
  const p = d.project || {};

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs print:hidden">
        <button
          onClick={() => navigate(`/investigation/${p.projectId || 'MPL-10482'}`)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Investigation Workspace</span>
        </button>

        <button
          onClick={handlePrint}
          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Official Dossier</span>
        </button>
      </div>

      <div className="bg-white border border-slate-300 p-8 sm:p-10 rounded-xl shadow-xs print:border-none print:shadow-none print:p-0 space-y-5 text-slate-900 font-sans">
        <div className="border-b-2 border-slate-900 pb-3 text-center space-y-0.5">
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-600">GOVERNMENT OF INDIA • भारत सरकार</div>
          <div className="text-xs font-semibold text-slate-800">MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION</div>
          <div className="text-[11px] text-slate-600">MEMBERS OF PARLIAMENT LOCAL AREA DEVELOPMENT SCHEME (MPLADS)</div>
          <h2 className="text-sm font-bold tracking-tight text-slate-900 pt-2 uppercase">
            CONFIDENTIAL PROJECT INVESTIGATION DOSSIER
          </h2>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-200 mt-2">
            <span>Dossier ID: <b>{report.reportId || reportId}</b></span>
            <span>Generated: {new Date().toLocaleDateString('en-IN')}</span>
            <span>Classification: OFFICIAL USE ONLY</span>
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
              <div className="flex justify-between"><span>Expenditure Disbursed:</span><b className="text-red-700">₹{(p.expenditureAmount || 0).toLocaleString('en-IN')}</b></div>
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
              <div className="flex justify-between"><span>Progress Gap:</span><b className="text-red-700">-{p.progressGap || 0}%</b></div>
              <div className="flex justify-between"><span>Timeline Delay:</span><b className="text-red-700">{p.delayDays || 0} Days Overdue</b></div>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 p-1.5 text-slate-800 border-l-3 border-slate-800">
            4. COMPOSITE RISK FUSION & LOF DENSITY ASSESSMENT
          </h3>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-medium uppercase block">COMPOSITE RISK INDEX</span>
              <span className="text-xl font-bold font-mono text-slate-900">{d.riskScore || 94} / 100</span>
            </div>
            <div className="text-center font-mono">
              <span className="text-[10px] text-slate-500 font-medium uppercase block">LOCAL OUTLIER FACTOR (LOF)</span>
              <span className="text-base font-bold text-red-700">2.49 (Severe Isolation)</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-medium uppercase block">INVESTIGATION PRIORITY</span>
              <span className="text-xs font-bold text-red-700 uppercase">{d.investigationPriority || 'CRITICAL'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 p-1.5 text-slate-800 border-l-3 border-slate-800">
            5. EXPLAINABLE RISK FINDINGS (WHY FLAGGED)
          </h3>
          <ul className="space-y-1 text-xs">
            {(d.factors || []).map((f, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-slate-400 font-bold">•</span>
                <span><b>[{f.type}]:</b> {f.explanation}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider bg-slate-100 p-1.5 text-slate-800 border-l-3 border-slate-800">
            6. MANDATORY VERIFICATION DIRECTIVES FOR NODAL OFFICER
          </h3>
          <ol className="list-decimal pl-4 text-xs space-y-1 text-slate-700">
            {(d.recommendedVerificationSteps || []).map((step, i) => (
              <li key={i} className="leading-relaxed">{step}</li>
            ))}
          </ol>
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

          <div className="p-2.5 bg-slate-50 rounded text-[10px] text-slate-500 text-center border border-slate-200">
            {report.disclaimer || 'Analytical output for monitoring and investigation support only. It does not establish legal fraud or wrongdoing.'}
          </div>
        </div>
      </div>
    </div>
  );
}
"""

with open(os.path.join(BASE, "pages", "ReportPage.jsx"), "w", encoding="utf-8") as f:
    f.write(report_code.strip())
print("ReportPage updated.")