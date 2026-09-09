import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src"

code = """import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderKanban, 
  AlertOctagon, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Copy, 
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import KPICard from '../components/KPICard';
import RiskBadge from '../components/RiskBadge';
import RiskDistributionChart from '../components/RiskDistributionChart';
import ProjectStatusChart from '../components/ProjectStatusChart';
import RiskTrendChart from '../components/RiskTrendChart';
import GISMap from '../components/GISMap';
import AssetCreationTracker from '../components/AssetCreationTracker';
import EarlyWarningComplianceRadar from '../components/EarlyWarningComplianceRadar';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stakeholderRole, setStakeholderRole] = useState('DISTRICT'); // 'MINISTRY' | 'STATE' | 'DISTRICT' | 'MP'

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getDashboardSummary();
        setSummary(res);
      } catch (err) {
        setSummary({
          totalProjects: 12482,
          criticalRisk: 47,
          highRisk: 386,
          delayed: 912,
          costAnomalies: 386,
          potentialDuplicates: 74,
          repeatedFunding: 91,
          riskDistribution: { low: 10185, medium: 1864, high: 386, critical: 47 },
          statusDistribution: { RECOMMENDED: 820, SANCTIONED: 1450, IN_PROGRESS: 6120, DELAYED: 912, OVERDUE: 340, COMPLETED: 2840 },
          monthlyRiskTrend: [
            { month: 'Sep', critical: 3, high: 25 },
            { month: 'Oct', critical: 4, high: 30 },
            { month: 'Nov', critical: 2, high: 28 },
            { month: 'Dec', critical: 5, high: 34 },
            { month: 'Jan', critical: 4, high: 32 },
            { month: 'Feb', critical: 6, high: 38 }
          ],
          priorityQueue: [
            {
              projectId: 'MPL-10482',
              projectName: 'Construction of Community Infrastructure',
              district: 'Pune',
              riskScore: 94,
              riskLevel: 'CRITICAL',
              primaryFlag: 'Cost overrun, progress gap & delay'
            },
            {
              projectId: 'MPL-9182',
              projectName: 'CC Paver Road and Stormwater Drain',
              district: 'Lucknow',
              riskScore: 91,
              riskLevel: 'HIGH',
              primaryFlag: '20% budget overrun & 180 days delay'
            },
            {
              projectId: 'MPL-7721',
              projectName: 'Installation of Solar RO Water Plant',
              district: 'Bengaluru Urban',
              riskScore: 87,
              riskLevel: 'HIGH',
              primaryFlag: 'Repeated funding & milestone delay'
            },
            {
              projectId: 'MPL-6651',
              projectName: 'Underground Drainage and Sewer Line',
              district: 'Ahmedabad',
              riskScore: 83,
              riskLevel: 'HIGH',
              primaryFlag: 'Nearby duplicate work within 1.0 km'
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const s = summary || {};

  const roleConfigs = {
    MINISTRY: {
      title: 'Central Ministry Decision Support Cockpit',
      subtitle: 'All-India Scheme Implementation, Macro Anomaly Distribution & National Policy Compliance',
      advisory: 'National Perspective: Monitoring 12,482 active works across 543 Parliamentary Constituencies.',
      badge: 'MINISTRY PERSPECTIVE (MoSPI)'
    },
    STATE: {
      title: 'State Nodal Authority Monitoring Console',
      subtitle: 'State-Level Fund Flow, Inter-District Implementation Performance & Bottleneck Resolution (Maharashtra)',
      advisory: 'State Perspective: Pune, Mumbai, and Nagpur districts monitored for state-level milestone compliance.',
      badge: 'STATE NODAL AUTHORITY'
    },
    DISTRICT: {
      title: 'District Nodal Authority Operational Dashboard',
      subtitle: 'District Collector / Magistrate Executive Action Workspace (Pune District)',
      advisory: 'District Action Queue: 4 works requiring immediate on-site MB physical inspection and UC verification.',
      badge: 'DISTRICT AUTHORITY (PUNE)'
    },
    MP: {
      title: "Hon'ble Member of Parliament Constituency Dashboard",
      subtitle: 'Constituency Development Tracker, Community Assets Creation & Fund Utilization Status (Pune PC)',
      advisory: 'Constituency Progress: ₹4.30 Cr sanctioned against ₹5.00 Cr annual entitlement. 934 durable assets created.',
      badge: 'PARLIAMENTARY CONSTITUENCY'
    }
  };

  const currentRole = roleConfigs[stakeholderRole];

  return (
    <div className="space-y-6">
      {/* Stakeholder Perspective Selector Bar */}
      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">
            Stakeholder Role:
          </span>
          <div className="inline-flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setStakeholderRole('MINISTRY')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                stakeholderRole === 'MINISTRY' ? 'bg-slate-900 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              The Ministry
            </button>
            <button
              onClick={() => setStakeholderRole('STATE')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                stakeholderRole === 'STATE' ? 'bg-slate-900 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              State Nodal Authority
            </button>
            <button
              onClick={() => setStakeholderRole('DISTRICT')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                stakeholderRole === 'DISTRICT' ? 'bg-slate-900 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              District Authority
            </button>
            <button
              onClick={() => setStakeholderRole('MP')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                stakeholderRole === 'MP' ? 'bg-slate-900 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Member of Parliament
            </button>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-300">
          {currentRole.badge}
        </span>
      </div>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{currentRole.title}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentRole.subtitle}
          </p>
        </div>

        <button
          onClick={() => navigate('/projects/MPL-10482')}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>Inspect Priority Case (MPL-10482)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Context Advisory Banner */}
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
        <span><b>Role Directives:</b> {currentRole.advisory}</span>
        <span className="font-mono text-[11px] text-slate-500">Auto-Refreshed</span>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard
          title="Monitored Works"
          value={s.totalProjects || 12482}
          icon={FolderKanban}
          color="slate"
        />
        <KPICard
          title="Critical Priority"
          value={s.criticalRisk || 47}
          icon={AlertOctagon}
          color="red"
        />
        <KPICard
          title="High Attention"
          value={s.highRisk || 386}
          icon={AlertTriangle}
          color="orange"
        />
        <KPICard
          title="Delayed Execution"
          value={s.delayed || 912}
          icon={Clock}
          color="amber"
        />
        <KPICard
          title="Cost Overruns"
          value={s.costAnomalies || 386}
          icon={TrendingUp}
          color="red"
        />
        <KPICard
          title="Duplicate Overlaps"
          value={s.potentialDuplicates || 74}
          icon={Copy}
          color="orange"
        />
      </div>

      {/* Durable Asset Creation & Early Warning Compliance Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AssetCreationTracker />
        <EarlyWarningComplianceRadar />
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Distribution, Status, Trends & GIS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RiskDistributionChart distribution={s.riskDistribution} />
            <ProjectStatusChart distribution={s.statusDistribution} />
          </div>

          <RiskTrendChart trends={s.monthlyRiskTrend} />

          <GISMap
            targetProject={{
              projectId: 'MPL-10482',
              projectName: 'Construction of Community Infrastructure',
              latitude: 18.52043,
              longitude: 73.85674,
              riskScore: 94,
              riskLevel: 'CRITICAL'
            }}
            nearbyProjects={[
              { projectId: 'MPL-9812', projectName: 'Community Hall Renovation Work', latitude: 18.52512, longitude: 73.86145, distanceKm: 0.8, potentialOverlap: true },
              { projectId: 'MPL-7731', projectName: 'Public Library and Study Hall', latitude: 18.51234, longitude: 73.84912, distanceKm: 1.2, potentialOverlap: false },
              { projectId: 'MPL-6621', projectName: 'Ward Multipurpose Shed Construction', latitude: 18.53120, longitude: 73.84890, distanceKm: 1.5, potentialOverlap: true }
            ]}
            radiusKm={3.0}
          />
        </div>

        {/* Right Col: Priority Review Queue */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Priority Review Queue</h3>
                <p className="text-xs text-slate-500 mt-0.5">Ranked cases requiring executive review</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Risk Prioritized</span>
            </div>

            <div className="mt-3 space-y-2.5">
              {(s.priorityQueue || []).map((item, index) => (
                <div
                  key={item.projectId}
                  onClick={() => navigate(`/projects/${item.projectId}`)}
                  className="p-3 bg-slate-50/70 hover:bg-slate-100/80 rounded-lg border border-slate-200/80 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-slate-800">
                      {index + 1}. {item.projectId}
                    </span>
                    <RiskBadge level={item.riskLevel} score={item.riskScore} />
                  </div>

                  <h4 className="text-xs font-semibold text-slate-800 truncate">
                    {item.projectName}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {item.district} District • <span className="text-slate-600">{item.primaryFlag}</span>
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/projects')}
              className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition-colors cursor-pointer"
            >
              Open Full Project Registry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
"""

with open(os.path.join(BASE, "pages", "DashboardPage.jsx"), "w", encoding="utf-8") as f:
    f.write(code.strip())
print("DashboardPage updated with Multi-Role Switcher, Asset Tracker, and Early Warning Radar.")