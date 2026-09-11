import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ArrowLeft, TrendingUp, ShieldCheck, Filter } from 'lucide-react';
import { api } from '../services/api';
import { authService } from '../services/auth';
import RiskDistributionChart from '../components/RiskDistributionChart';
import ProjectStatusChart from '../components/ProjectStatusChart';
import RiskTrendChart from '../components/RiskTrendChart';
import AssetCreationTracker from '../components/AssetCreationTracker';
import EarlyWarningComplianceRadar from '../components/EarlyWarningComplianceRadar';

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const user = authService.getUser() || { roleId: 'MINISTRY', jurisdiction: 'National Central Oversight' };
  const isMP = user.roleId === 'MP';
  const isDistrict = user.roleId === 'DISTRICT';
  const isState = user.roleId === 'STATE';

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState(isDistrict ? 'Pune' : '');
  const [selectedState, setSelectedState] = useState(isState ? 'Maharashtra' : '');

  useEffect(() => {
    async function loadAnalytics() {
      setLoading(true);
      try {
        const queryParams = {};
        if (isMP || isDistrict) {
          queryParams.district = 'Pune';
        } else if (isState) {
          queryParams.state = 'Maharashtra';
        } else {
          if (selectedDistrict) queryParams.district = selectedDistrict;
          if (selectedState) queryParams.state = selectedState;
        }

        const res = await api.getDashboardSummary(queryParams);
        setSummary(res);
      } catch (err) {
        console.warn('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [selectedDistrict, selectedState, user.roleId]);

  const s = summary || {
    riskDistribution: isDistrict ? { low: 62, medium: 13, high: 18, critical: 4 } : { low: 850, medium: 167, high: 186, critical: 47 },
    statusDistribution: isDistrict
      ? { RECOMMENDED: 6, SANCTIONED: 12, IN_PROGRESS: 48, DELAYED: 18, OVERDUE: 4, COMPLETED: 9 }
      : { RECOMMENDED: 75, SANCTIONED: 145, IN_PROGRESS: 620, DELAYED: 210, OVERDUE: 60, COMPLETED: 140 },
    monthlyRiskTrend: [
      { month: 'Sep', critical: 2, high: 12, medium: 8, low: 45 },
      { month: 'Oct', critical: 3, high: 15, medium: 10, low: 52 },
      { month: 'Nov', critical: 2, high: 14, medium: 9, low: 48 },
      { month: 'Dec', critical: 4, high: 18, medium: 12, low: 60 },
      { month: 'Jan', critical: 3, high: 16, medium: 11, low: 55 },
      { month: 'Feb', critical: 4, high: 18, medium: 13, low: 62 }
    ]
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="hover:text-slate-900 font-medium flex items-center gap-1 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>
        <span>/</span>
        <span className="text-slate-800 font-semibold">Analytics</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-slate-900" />
              <span>Risk & Performance Analytics</span>
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-300">
              {isMP ? 'CONSTITUENCY TELEMETRY' : isDistrict ? 'DISTRICT BENCHMARKS' : isState ? 'STATE TELEMETRY' : 'NATIONAL TELEMETRY'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-model statistical telemetry, historical risk trends, and cross-sector execution benchmarks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Overview</span>
          </button>
        </div>
      </div>

      {/* Scope Controls */}
      {!isDistrict && !isMP && (
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3 text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Scope:</span>
          </span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="p-1.5 border border-slate-300 rounded-lg bg-white text-slate-800"
          >
            <option value="">All States (National Level)</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Karnataka">Karnataka</option>
          </select>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="p-1.5 border border-slate-300 rounded-lg bg-white text-slate-800"
          >
            <option value="">All Districts</option>
            <option value="Pune">Pune</option>
            <option value="Mumbai Suburban">Mumbai Suburban</option>
            <option value="Bengaluru Urban">Bengaluru Urban</option>
          </select>
        </div>
      )}

      {/* Historical Trend Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <RiskTrendChart trends={s.monthlyRiskTrend} />
      </div>

      {/* 2-Column Risk Distribution & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <RiskDistributionChart distribution={s.riskDistribution} />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <ProjectStatusChart distribution={s.statusDistribution} />
        </div>
      </div>

      {/* Asset Creation & Compliance Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AssetCreationTracker />
        <EarlyWarningComplianceRadar />
      </div>
    </div>
  );
}
