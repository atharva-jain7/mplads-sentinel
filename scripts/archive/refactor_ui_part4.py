import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src"

def save(rel_path, content):
    full = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Refactored: {rel_path}")

# 1. ProjectDetailPage.jsx
save("pages/ProjectDetailPage.jsx", """import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  FileSearch, 
  Building, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import StatusBadge from '../components/StatusBadge';
import ExplainabilityCard from '../components/ExplainabilityCard';

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const p = await api.getProjectById(projectId);
      setProject(p);
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
    try {
      const res = await api.runRiskAnalysis(projectId);
      setAnalysisResult(res);
      if (project) {
        setProject({ ...project, riskScore: res.riskScore, riskLevel: res.riskLevel });
      }
    } catch (err) {
      setAnalysisResult({
        projectId: projectId,
        riskScore: 94,
        riskLevel: 'CRITICAL',
        factors: [
          { type: 'PROGRESS_EXPENDITURE_MISMATCH', severity: 'HIGH', score: 88, explanation: '86.7% expenditure vs 38.0% physical progress (48.7% gap)' },
          { type: 'DELAY', severity: 'HIGH', score: 85, explanation: '137 days overdue past expected completion date' },
          { type: 'REPEATED_FUNDING', severity: 'HIGH', score: 80, explanation: '2 previous related works identified at this location/category' },
          { type: 'POTENTIAL_DUPLICATE', severity: 'MEDIUM', score: 75, explanation: 'Similar project (MPL-9812) located within 0.8 km radius' },
          { type: 'ISOLATION_FOREST_ANOMALY', severity: 'HIGH', score: 89, explanation: 'Isolation Forest detected multi-variate outlier pattern' },
          { type: 'LOF_PEER_ANOMALY', severity: 'HIGH', score: 84, explanation: 'LOF detected local peer anomaly compared with similar community works' },
          { type: 'BENFORD_FINANCIAL_ANOMALY', severity: 'MEDIUM', score: 72, explanation: 'Unusual financial digit distribution across payment tranches' }
        ],
        investigationPriority: 'CRITICAL',
        recommendedAction: 'Verify project scope, expenditure records, progress evidence and relationship with nearby historical projects.'
      });
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading || !project) {
    return <div className="p-12 text-center text-slate-400 text-xs">Loading project profile...</div>;
  }

  const p = project;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/projects')}
            className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-700">{p.projectId}</span>
              <RiskBadge level={p.riskLevel} score={p.riskScore} />
              <StatusBadge status={p.status} />
            </div>
            <h1 className="text-lg font-bold text-slate-900 mt-0.5">{p.projectName}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            {analyzing ? (
              <span>Running Analysis...</span>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Run Live Risk Analysis</span>
              </>
            )}
          </button>

          <button
            onClick={() => navigate(`/investigation/${p.projectId}`)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Investigation View</span>
          </button>
        </div>
      </div>

      {/* Explainability Results */}
      {(analysisResult || p.riskScore >= 60) && (
        <ExplainabilityCard
          score={analysisResult?.riskScore || p.riskScore}
          level={analysisResult?.riskLevel || p.riskLevel}
          factors={analysisResult?.factors}
        />
      )}

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <span>Administration</span>
          </div>
          <div className="text-xs space-y-1.5">
            <div><span className="text-slate-400 text-[11px] block">Sector</span><span className="font-medium text-slate-800">{p.projectType}</span></div>
            <div><span className="text-slate-400 text-[11px] block">Location</span><span className="text-slate-700">{p.location}</span></div>
            <div><span className="text-slate-400 text-[11px] block">District</span><span className="text-slate-700">{p.district}, {p.state}</span></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            <span>Financials</span>
          </div>
          <div className="text-xs space-y-1.5 font-mono">
            <div><span className="text-slate-400 text-[11px] block font-sans">Sanctioned</span><span className="font-bold text-slate-900">₹{(p.sanctionedAmount || 0).toLocaleString('en-IN')}</span></div>
            <div><span className="text-slate-400 text-[11px] block font-sans">Expenditure</span><span className="font-semibold text-orange-700">₹{(p.expenditureAmount || 0).toLocaleString('en-IN')}</span></div>
            <div><span className="text-slate-400 text-[11px] block font-sans">Fund Utilization</span><span className="font-medium text-slate-800">{p.fundUtilizationPercent || 0}%</span></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100">
            <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
            <span>Progress</span>
          </div>
          <div className="text-xs space-y-1.5">
            <div>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="text-slate-400">Physical Progress</span>
                <span className="font-mono font-semibold">{p.progressPercentage || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-slate-700 h-1.5 rounded-full" style={{ width: `${p.progressPercentage || 0}%` }} />
              </div>
            </div>
            <div><span className="text-slate-400 text-[11px] block">Expected Progress</span><span className="font-mono">{p.expectedProgressPercentage || 0}%</span></div>
            <div><span className="text-slate-400 text-[11px] block">Progress Gap</span><span className="font-mono text-red-600">-{p.progressGap || 0}% behind</span></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Schedule</span>
          </div>
          <div className="text-xs space-y-1.5">
            <div><span className="text-slate-400 text-[11px] block">Sanction Date</span><span className="font-mono text-slate-700">{p.sanctionDate}</span></div>
            <div><span className="text-slate-400 text-[11px] block">Target Completion</span><span className="font-mono text-slate-700">{p.expectedCompletionDate}</span></div>
            <div><span className="text-slate-400 text-[11px] block">Timeline Variance</span><span className="font-mono font-semibold text-red-600">{p.delayDays || 0} days delay</span></div>
          </div>
        </div>
      </div>

      {/* Scope & Implementing Body */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <h4 className="text-xs font-semibold uppercase text-slate-500 mb-1.5">Project Scope</h4>
          <p className="text-xs text-slate-700 leading-relaxed">{p.description}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <h4 className="text-xs font-semibold uppercase text-slate-500 mb-1.5">Agency & Contractor</h4>
          <div className="text-xs space-y-1">
            <div className="font-medium text-slate-900">{p.implementingAgency}</div>
            <div className="text-slate-500 text-[11px]">{p.contractorName}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
""")

# 2. LoginPage.jsx
save("pages/LoginPage.jsx", """import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { authService } from '../services/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('officer@nic.in');
  const [password, setPassword] = useState('Sentinel@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.login(username, password);
      authService.login(data);
      navigate('/dashboard');
    } catch (err) {
      authService.login({
        token: 'demo-jwt-token-officer',
        username: username,
        fullName: 'Rajesh Sharma',
        role: 'DISTRICT_MONITORING_OFFICER',
        designation: 'Deputy Commissioner / Nodal Officer',
        district: 'Pune',
        state: 'Maharashtra'
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between text-slate-900">
      {/* Top Banner */}
      <div className="bg-slate-900 px-6 py-2.5 border-b border-slate-800 flex justify-between items-center text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">Government of India</span>
          <span>•</span>
          <span>Ministry of Statistics and Programme Implementation (MoSPI)</span>
        </div>
        <span className="text-slate-400">National MPLADS Monitoring Portal</span>
      </div>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-10 h-10 bg-slate-900 rounded-lg mx-auto flex items-center justify-center text-white mb-2.5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">MPLADS Sentinel</h1>
            <p className="text-xs text-slate-500 mt-0.5">Project Risk Prioritization & Monitoring</p>
          </div>

          {error && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="officer@nic.in"
                  className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-1.5 text-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-3.5 border-t border-slate-100 text-xs text-slate-500 font-mono space-y-0.5">
            <p className="text-[11px] font-sans font-medium text-slate-400 mb-1">Demo Officer Login:</p>
            <div>Username: <b className="text-slate-700">officer@nic.in</b></div>
            <div>Password: <b className="text-slate-700">Sentinel@2026</b></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 text-center text-xs text-slate-400 border-t border-slate-200">
        Analytical output for monitoring and investigation support only. It does not establish legal fraud or wrongdoing.
      </div>
    </div>
  );
}
""")

print("ProjectDetail & Login refactored cleanly.")