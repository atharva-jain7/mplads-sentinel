import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Cpu, 
  Compass, 
  DollarSign, 
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';
import { authService } from '../services/auth';
import RiskBadge from '../components/RiskBadge';
import ExplainabilityCard from '../components/ExplainabilityCard';
import BenfordChart from '../components/BenfordChart';
import LOFVisualizer from '../components/LOFVisualizer';
import GISMap from '../components/GISMap';

export default function InvestigationPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const user = authService.getUser();
  const isMP = user.roleId === 'MP';
  const isDistrict = user.roleId === 'DISTRICT';

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
      console.warn('Investigation load fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      navigate(`/reports/${projectId}`);
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading || !project) {
    return <div className="p-12 text-center text-slate-400 text-xs">Loading investigation dossier...</div>;
  }

  const p = project;

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
            <b>{user.jurisdiction || 'Pune Parliamentary Constituency'}</b>, your investigation workspace is strictly restricted to works recommended within your constituency.
          </p>
          <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500 font-mono">
            <div>Requested Case: <b>{p.projectId}</b></div>
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

  const mlSignals = analysis?.mlSignals || {};
  const lofData = mlSignals.lof || {};
  const benfordData = mlSignals.benford || {};
  const nearbyProjects = nearbyData?.nearbyProjects || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-sans">
      {/* Top Header */}
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
              <span className="text-xs font-mono font-bold text-slate-700">{p.projectId}</span>
              <RiskBadge level={analysis?.riskLevel || p.riskLevel} score={analysis?.riskScore || p.riskScore} />
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">
                OFFICIAL INVESTIGATION DOSSIER
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 mt-0.5">{p.projectName}</h1>
          </div>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={generatingReport}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Generate Official Dossier</span>
        </button>
      </div>

      {/* Section 1: Executive Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">1. Administrative & Financial Overview</h3>
          <span className="text-xs font-mono text-slate-500">ID: {p.projectId}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div><span className="text-slate-400 block text-[11px]">Sanctioned Amount</span><span className="font-mono font-bold text-slate-900">₹{(p.sanctionedAmount || 0).toLocaleString('en-IN')}</span></div>
          <div><span className="text-slate-400 block text-[11px]">Expenditure Disbursed</span><span className="font-mono font-bold text-orange-700">₹{(p.expenditureAmount || 0).toLocaleString('en-IN')}</span></div>
          <div><span className="text-slate-400 block text-[11px]">Physical Progress</span><span className="font-mono font-bold text-slate-900">{p.progressPercentage || 0}%</span></div>
          <div><span className="text-slate-400 block text-[11px]">Timeline Delay</span><span className="font-mono font-bold text-red-700">{p.delayDays || 0} Days</span></div>
        </div>
      </div>

      {/* Section 2: Explainability Findings */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">2. Explainable Anomaly Rationale</h3>
        <ExplainabilityCard
          score={analysis?.riskScore || p.riskScore}
          level={analysis?.riskLevel || p.riskLevel}
          factors={analysis?.factors}
        />
      </div>

      {/* Section 3: LOF Peer Density */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">3. District Peer Group Outlier Analysis</h3>
        <LOFVisualizer
          lofData={lofData}
          targetProject={p}
          district={p.district}
          sector={p.projectType}
        />
      </div>

      {/* Section 4: Benford's Law Financial Distribution */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">4. Payment Voucher Digit Analysis</h3>
        <BenfordChart benfordResult={benfordData} />
      </div>

      {/* Section 5: GIS Proximity */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">5. Geospatial Radius & Scope Proximity</h3>
        <GISMap
          targetProject={p}
          nearbyProjects={nearbyProjects}
          radiusKm={3.0}
        />
      </div>
    </div>
  );
}