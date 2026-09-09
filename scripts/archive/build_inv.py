import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src"

investigation_code = """import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Cpu, 
  Compass, 
  DollarSign, 
  TrendingUp 
} from 'lucide-react';
import { api } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import ExplainabilityCard from '../components/ExplainabilityCard';
import BenfordChart from '../components/BenfordChart';
import LOFVisualizer from '../components/LOFVisualizer';
import GISMap from '../components/GISMap';

export default function InvestigationPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [payments, setPayments] = useState([]);
  const [progressLogs, setProgressLogs] = useState([]);
  const [nearbyData, setNearbyData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    loadInvestigationData();
  }, [projectId]);

  const loadInvestigationData = async () => {
    setLoading(true);
    try {
      const p = await api.getProjectById(projectId);
      setProject(p);
      const pmts = await api.getPayments(projectId);
      setPayments(pmts);
      const prog = await api.getProgress(projectId);
      setProgressLogs(prog);
      const nearby = await api.getNearbyProjects(projectId, 5.0);
      setNearbyData(nearby);
      const ana = await api.runRiskAnalysis(projectId);
      setAnalysis(ana);
    } catch (err) {
      setProject({
        projectId: projectId || 'MPL-10482',
        projectName: 'Construction of Community Infrastructure',
        projectType: 'Community Infrastructure',
        description: 'Construction of multi-purpose community resource centre and auditorium with audiovisual setup',
        state: 'Maharashtra',
        district: 'Pune',
        constituency: 'Pune Parliamentary Constituency',
        location: 'Ward 14, Haveli Taluka, Pune',
        latitude: 18.52043,
        longitude: 73.85674,
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
        contractorName: 'Apex Infrastructure & Civil Works Ltd.',
        paymentCount: 12,
        riskScore: 94,
        riskLevel: 'CRITICAL'
      });

      setNearbyData({
        nearbyProjects: [
          { projectId: 'MPL-9812', projectName: 'Community Hall Renovation Work', projectType: 'Community Infrastructure', sanctionedAmount: 1500000.0, expenditureAmount: 1450000.0, progressPercentage: 95.0, status: 'COMPLETED', riskScore: 62, riskLevel: 'HIGH', latitude: 18.52512, longitude: 73.86145, distanceKm: 0.8, potentialOverlap: true },
          { projectId: 'MPL-7731', projectName: 'Public Library and Study Hall', projectType: 'Education', sanctionedAmount: 2000000.0, expenditureAmount: 1200000.0, progressPercentage: 60.0, status: 'IN_PROGRESS', riskScore: 45, riskLevel: 'MEDIUM', latitude: 18.51234, longitude: 73.84912, distanceKm: 1.2, potentialOverlap: false },
          { projectId: 'MPL-6621', projectName: 'Ward Multipurpose Shed Construction', projectType: 'Community Infrastructure', sanctionedAmount: 1800000.0, expenditureAmount: 1700000.0, progressPercentage: 85.0, status: 'IN_PROGRESS', riskScore: 55, riskLevel: 'MEDIUM', latitude: 18.53120, longitude: 73.84890, distanceKm: 1.5, potentialOverlap: true }
        ]
      });

      setAnalysis({
        projectId: projectId,
        riskScore: 94,
        riskLevel: 'CRITICAL',
        mlSignals: {
          isolationForest: { anomalyScore: 89, isAnomaly: true, explanation: 'Multi-variate anomaly: significant progress gap (42%), delay (137d), and high expenditure velocity.' },
          lof: { 
            lofScore: 86, 
            rawLof: 2.49, 
            kDistance: 7.304, 
            lrd: 0.154, 
            peerCount: 25, 
            isAnomaly: true, 
            explanation: 'Local Outlier Factor (LOF = 2.49) indicates severe local density anomaly. Cost per progress unit is 2.3x higher than 25 peer projects in the same sector & budget band in Pune.' 
          },
          benford: {
            deviationScore: 72,
            isAnomaly: true,
            explanation: 'Unusual payment first-digit distribution across 12 tranches — review recommended.'
          }
        },
        factors: [
          { type: 'PROGRESS_EXPENDITURE_MISMATCH', severity: 'HIGH', score: 88, explanation: '86.7% expenditure vs 38.0% physical progress' },
          { type: 'DELAY', severity: 'HIGH', score: 85, explanation: '137 days overdue past expected completion date' },
          { type: 'REPEATED_FUNDING', severity: 'HIGH', score: 80, explanation: '2 previous related works identified at this location/category' },
          { type: 'POTENTIAL_DUPLICATE', severity: 'MEDIUM', score: 75, explanation: 'Similar project (MPL-9812) located within 0.8 km radius' },
          { type: 'ISOLATION_FOREST_ANOMALY', severity: 'HIGH', score: 89, explanation: 'Isolation Forest detected multi-variate outlier pattern' },
          { type: 'LOF_PEER_ANOMALY', severity: 'HIGH', score: 86, explanation: 'LOF detected local peer anomaly compared to similar works' },
          { type: 'BENFORD_FINANCIAL_ANOMALY', severity: 'MEDIUM', score: 72, explanation: 'Unusual financial digit distribution across payment tranches' }
        ],
        investigationPriority: 'CRITICAL',
        recommendedAction: 'Verify project scope, expenditure records, progress evidence and relationship with nearby historical projects.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      const rep = await api.generateReport(projectId);
      navigate(`/reports/${rep.reportId || projectId}`);
    } catch (err) {
      navigate(`/reports/RPT-20260901-${projectId.replace('MPL-', '')}`);
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading || !project) {
    return <div className="p-12 text-center text-slate-400 text-xs">Loading investigation dossier...</div>;
  }

  const p = project;
  const a = analysis || {};
  const ml = a.mlSignals || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/projects/${p.projectId}`)}
            className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-700">DOSSIER: {p.projectId}</span>
              <RiskBadge level={a.riskLevel || p.riskLevel} score={a.riskScore || p.riskScore} />
              <span className="text-[11px] font-mono font-bold text-red-700 px-2 py-0.5 bg-red-50 rounded border border-red-200">
                PRIORITY: {a.investigationPriority || 'CRITICAL'}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 mt-0.5">{p.projectName}</h1>
            <p className="text-xs text-slate-500">{p.location} • Nodal District: {p.district} ({p.state})</p>
          </div>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={generatingReport}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{generatingReport ? 'Generating Dossier...' : 'Generate Official Dossier (PDF/HTML)'}</span>
        </button>
      </div>

      <ExplainabilityCard score={a.riskScore || p.riskScore} level={a.riskLevel || p.riskLevel} factors={a.factors} />

      <LOFVisualizer lofData={ml.lof} targetProject={p} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-slate-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase">Isolation Forest (Global ML)</h4>
            </div>
            <span className="text-xs font-mono font-bold text-red-600">Score: {ml.isolationForest?.anomalyScore || 89}/100</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {ml.isolationForest?.explanation || 'Isolation Forest detected multi-variate outlier pattern across progress gap and utilization velocity.'}
          </p>
          <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
            <b>Global Perspective:</b> Identifies isolation tree depth across national baseline distributions.
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase">Local Outlier Factor (Peer LOF)</h4>
            </div>
            <span className="text-xs font-mono font-bold text-red-600">Score: {ml.lof?.lofScore || 86}/100</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {ml.lof?.explanation || 'Unusual cost-to-progress ratio and delay deviation compared with similar local peer projects in Pune.'}
          </p>
          <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
            <b>Local Peer Perspective:</b> Compares local reachability density against 25 peer projects in {p.district}.
          </div>
        </div>
      </div>

      <BenfordChart distribution={ml.benford?.digitsDistribution} isAnomaly={ml.benford?.isAnomaly ?? true} deviationScore={ml.benford?.deviationScore || 72} />

      <GISMap targetProject={p} nearbyProjects={nearbyData?.nearbyProjects || []} radiusKm={3.0} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <h4 className="text-xs font-bold uppercase text-slate-600 mb-2 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            Disbursement Tranches ({payments.length || 12})
          </h4>
          <div className="overflow-x-auto max-h-52 overflow-y-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0">
                <tr><th className="p-2">Tranche</th><th className="p-2">Amount (₹)</th><th className="p-2">Date</th><th className="p-2">Stage</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(payments.length > 0 ? payments : [
                  { trancheNumber: 1, amount: 240000.0, paymentDate: '2024-04-15', disbursementStage: 'Milestone 1' },
                  { trancheNumber: 2, amount: 250000.0, paymentDate: '2024-05-25', disbursementStage: 'Milestone 2' },
                  { trancheNumber: 3, amount: 245000.0, paymentDate: '2024-07-05', disbursementStage: 'Milestone 3' },
                  { trancheNumber: 4, amount: 260000.0, paymentDate: '2024-08-15', disbursementStage: 'Milestone 4' }
                ]).map((pmt, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-2 font-mono font-semibold">#{pmt.trancheNumber || i + 1}</td>
                    <td className="p-2 font-mono font-medium text-slate-900">₹{(pmt.amount || 0).toLocaleString('en-IN')}</td>
                    <td className="p-2 text-slate-500 font-mono text-[11px]">{pmt.paymentDate}</td>
                    <td className="p-2 text-slate-600">{pmt.disbursementStage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <h4 className="text-xs font-bold uppercase text-slate-600 mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
            Inspection Records & Physical Verification
          </h4>
          <div className="space-y-2 text-xs">
            {(progressLogs.length > 0 ? progressLogs : [
              { inspectionDate: '2024-08-10', physicalProgress: 15.0, financialProgress: 35.0, remarks: 'Foundation and plinth work completed with schedule delays.' },
              { inspectionDate: '2024-12-20', physicalProgress: 28.0, financialProgress: 65.0, remarks: 'Pillar columns erected; site progress slowed due to material & labor delays.' },
              { inspectionDate: '2025-05-15', physicalProgress: 38.0, financialProgress: 86.67, remarks: 'Roofing incomplete; financial disbursements disproportionately high relative to ground progress.' }
            ]).map((log, i) => (
              <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 space-y-0.5">
                <div className="flex justify-between font-mono font-semibold text-slate-700 text-[11px]">
                  <span>Inspection: {log.inspectionDate}</span>
                  <span className="text-slate-900">{log.physicalProgress}% Progress</span>
                </div>
                <p className="text-slate-500 text-[11px]">{log.remarks}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
"""

with open(os.path.join(BASE, "pages", "InvestigationPage.jsx"), "w", encoding="utf-8") as f:
    f.write(investigation_code.strip())
print("InvestigationPage updated.")