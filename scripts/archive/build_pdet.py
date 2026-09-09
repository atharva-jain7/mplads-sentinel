import os
BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src"

code = """import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  FileSearch, 
  FileText,
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
      console.warn('Project detail fallback:', err);
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
      console.warn('Run analysis fallback:', err);
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

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
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
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Investigation View</span>
          </button>

          <button
            onClick={() => navigate(`/reports/${p.projectId}`)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Official Dossier</span>
          </button>
        </div>
      </div>

      {(analysisResult || p.riskScore >= 60) && (
        <ExplainabilityCard
          score={analysisResult?.riskScore || p.riskScore}
          level={analysisResult?.riskLevel || p.riskLevel}
          factors={analysisResult?.factors}
        />
      )}

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
"""

with open(os.path.join(BASE, "pages", "ProjectDetailPage.jsx"), "w", encoding="utf-8") as f:
    f.write(code.strip())
print("ProjectDetailPage updated.")