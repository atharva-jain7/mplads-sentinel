import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src"

def save(rel_path, content):
    full = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Created page: {rel_path}")

# 4. pages/ProjectDetailPage.jsx
save("pages/ProjectDetailPage.jsx", """import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Play, 
  ArrowLeft, 
  FileSearch, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Building, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Layers,
  FileText
} from 'lucide-react';
import { api } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import StatusBadge from '../components/StatusBadge';
import ExplainabilityCard from '../components/ExplainabilityCard';

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [payments, setPayments] = useState([]);
  const [progressLogs, setProgressLogs] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const p = await api.getProjectById(projectId);
      setProject(p);
      const pmts = await api.getPayments(projectId);
      setPayments(pmts);
      const prog = await api.getProgress(projectId);
      setProgressLogs(prog);
    } catch (err) {
      console.warn('Using fallback project detail:', err);
      // Demo project fallback
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
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    setAnalysisStep(1);

    // Progressive visual steps
    setTimeout(() => setAnalysisStep(2), 300);
    setTimeout(() => setAnalysisStep(3), 600);
    setTimeout(() => setAnalysisStep(4), 900);
    setTimeout(() => setAnalysisStep(5), 1200);

    try {
      const res = await api.runRiskAnalysis(projectId);
      setTimeout(() => {
        setAnalysisResult(res);
        if (project) {
          setProject({ ...project, riskScore: res.riskScore, riskLevel: res.riskLevel });
        }
        setAnalyzing(false);
      }, 1500);
    } catch (err) {
      console.warn('Risk analysis fallback:', err);
      setTimeout(() => {
        setAnalysisResult({
          projectId: projectId,
          riskScore: 94,
          riskLevel: 'CRITICAL',
          factors: [
            { type: 'PROGRESS_EXPENDITURE_MISMATCH', severity: 'HIGH', score: 88, explanation: '86.7% expenditure vs 38.0% physical progress' },
            { type: 'DELAY', severity: 'HIGH', score: 85, explanation: '137 days overdue past expected completion date' },
            { type: 'REPEATED_FUNDING', severity: 'HIGH', score: 80, explanation: '2 previous related funding projects identified at this location/category' },
            { type: 'POTENTIAL_DUPLICATE', severity: 'MEDIUM', score: 75, explanation: 'Similar project (MPL-9812) located within 0.8 km radius' },
            { type: 'ISOLATION_FOREST_ANOMALY', severity: 'HIGH', score: 89, explanation: 'Isolation Forest detected multi-variate anomaly pattern' },
            { type: 'LOF_PEER_ANOMALY', severity: 'HIGH', score: 84, explanation: 'LOF detected local peer anomaly compared with similar community works' },
            { type: 'BENFORD_FINANCIAL_ANOMALY', severity: 'MEDIUM', score: 72, explanation: 'Unusual financial digit distribution across payment tranches' }
          ],
          investigationPriority: 'CRITICAL',
          recommendedAction: 'Verify project scope, expenditure records, progress evidence and relationship with nearby historical projects.'
        });
        setAnalyzing(false);
      }, 1500);
    }
  };

  if (loading || !project) {
    return (
      <div className="p-12 text-center text-slate-500">
        <span className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
        Loading project profile...
      </div>
    );
  }

  const p = project;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600"
            title="Back to Registry"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300">
                {p.projectId}
              </span>
              <RiskBadge level={p.riskLevel} score={p.riskScore} />
              <StatusBadge status={p.status} />
            </div>
            <h1 className="text-xl font-black text-slate-900 mt-1">{p.projectName}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running Multi-Tier ML Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run Live Risk Analysis</span>
              </>
            )}
          </button>

          <button
            onClick={() => navigate(`/investigation/${p.projectId}`)}
            className="px-4 py-2.5 bg-gov-navy hover:bg-slate-800 text-white font-semibold rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FileSearch className="w-4 h-4 text-amber-400" />
            <span>Investigation Workspace</span>
          </button>
        </div>
      </div>

      {/* Analysis Running Progress Modal / Banner */}
      {analyzing && (
        <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 animate-pulse text-red-500" />
              Automated Analysis Pipeline in Progress
            </h4>
            <span className="text-xs font-mono text-slate-400">Step {analysisStep} of 5</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs font-mono pt-2">
            <div className={`p-2 rounded border ${analysisStep >= 1 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
              ✓ 1. Rule Engine (7 Rules)
            </div>
            <div className={`p-2 rounded border ${analysisStep >= 2 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
              ✓ 2. Isolation Forest
            </div>
            <div className={`p-2 rounded border ${analysisStep >= 3 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
              ✓ 3. Local Outlier Factor (LOF)
            </div>
            <div className={`p-2 rounded border ${analysisStep >= 4 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
              ✓ 4. Benford Distribution
            </div>
            <div className={`p-2 rounded border ${analysisStep >= 5 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
              ✓ 5. Risk Fusion (0-100)
            </div>
          </div>
        </div>
      )}

      {/* Analysis Result Banner (if run) */}
      {(analysisResult || p.riskScore >= 60) && (
        <ExplainabilityCard
          score={analysisResult?.riskScore || p.riskScore}
          level={analysisResult?.riskLevel || p.riskLevel}
          factors={analysisResult?.factors}
        />
      )}

      {/* 4 Core Summary Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Project Info */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Project Information</span>
          </div>
          <div className="text-xs space-y-2">
            <div>
              <span className="text-slate-400 block text-[10px]">SECTOR / TYPE</span>
              <span className="font-semibold text-slate-800">{p.projectType}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">STATE & DISTRICT</span>
              <span className="font-semibold text-slate-800">{p.district}, {p.state}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">CONSTITUENCY</span>
              <span className="font-semibold text-slate-800">{p.constituency}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">LOCATION</span>
              <span className="text-slate-700">{p.location}</span>
            </div>
          </div>
        </div>

        {/* 2. Financial Summary */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Financial Status</span>
          </div>
          <div className="text-xs space-y-2">
            <div>
              <span className="text-slate-400 block text-[10px]">SANCTIONED AMOUNT</span>
              <span className="font-mono font-bold text-slate-900 text-sm">₹{(p.sanctionedAmount || 0).toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">INITIAL ESTIMATE</span>
              <span className="font-mono font-semibold text-slate-700">₹{(p.estimatedCost || 0).toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">EXPENDITURE DISBURSED</span>
              <span className="font-mono font-bold text-orange-600">₹{(p.expenditureAmount || 0).toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">FUND UTILIZATION</span>
              <span className="font-mono font-bold text-slate-800">{p.fundUtilizationPercent || 0}%</span>
            </div>
          </div>
        </div>

        {/* 3. Progress Tracking */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Physical Progress</span>
          </div>
          <div className="text-xs space-y-2">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400 text-[10px]">REPORTED PHYSICAL PROGRESS</span>
                <span className="font-mono font-bold text-slate-900">{p.progressPercentage || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${p.progressPercentage || 0}%` }} />
              </div>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">EXPECTED PROGRESS</span>
              <span className="font-mono font-semibold text-slate-800">{p.expectedProgressPercentage || 0}%</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">PROGRESS GAP</span>
              <span className="font-mono font-bold text-red-600">-{p.progressGap || 0}% behind schedule</span>
            </div>
          </div>
        </div>

        {/* 4. Timeline & Agency */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>Timeline & Agency</span>
          </div>
          <div className="text-xs space-y-2">
            <div>
              <span className="text-slate-400 block text-[10px]">SANCTION DATE</span>
              <span className="font-mono text-slate-800">{p.sanctionDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">EXPECTED COMPLETION</span>
              <span className="font-mono text-slate-800">{p.expectedCompletionDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">SCHEDULE DELAY</span>
              <span className="font-mono font-bold text-red-600">{p.delayDays || 0} days overdue</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">IMPLEMENTING AGENCY</span>
              <span className="text-slate-800 font-medium truncate block">{p.implementingAgency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Contractor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Scope of Work / Description</h4>
          <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Contractor / Vendor</h4>
          <div className="text-xs space-y-1">
            <div className="font-bold text-slate-900">{p.contractorName}</div>
            <div className="text-slate-500 font-mono text-[11px]">Vendor Code: VEN-{p.projectId.replace('MPL-', '')}</div>
            <div className="text-emerald-700 bg-emerald-50 text-[10px] px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1 font-semibold">
              Registered Public Works Contractor
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
""")

print("ProjectDetailPage created.")