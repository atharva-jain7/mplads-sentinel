import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src"

dashboard_code = """import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  DollarSign,
  Layers,
  MapPin
} from 'lucide-react';
import { api } from '../services/api';
import { authService } from '../services/auth';
import KPICard from '../components/KPICard';
import RiskBadge from '../components/RiskBadge';
import StatusBadge from '../components/StatusBadge';
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

  // Get logged-in user and their role (Selected BEFORE login)
  const user = authService.getUser() || {
    roleId: 'MP',
    fullName: "Hon'ble MP (Pune Constituency)",
    jurisdiction: 'Pune Parliamentary Constituency',
    district: 'Pune',
    state: 'Maharashtra'
  };

  const isMP = user.roleId === 'MP';
  const isMinistry = user.roleId === 'MINISTRY';
  const isState = user.roleId === 'STATE';
  const isDistrict = user.roleId === 'DISTRICT';

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

  // Works recommended by the MP in Pune Parliamentary Constituency
  const mpAssignedWorks = [
    {
      projectId: 'MPL-10482',
      projectName: 'Construction of Community Infrastructure',
      sector: 'Community Infrastructure',
      sanctionedAmount: 3000000.0,
      expenditureAmount: 2600000.0,
      progressPercentage: 38.0,
      expectedProgressPercentage: 80.0,
      delayDays: 137,
      status: 'DELAYED',
      riskLevel: 'CRITICAL',
      riskScore: 94,
      attention: 'Critical milestone lag (38% vs 80%) & 137 days delay. Site verification requested.'
    },
    {
      projectId: 'MPL-9812',
      projectName: 'Community Hall Renovation Work',
      sector: 'Community Infrastructure',
      sanctionedAmount: 1500000.0,
      expenditureAmount: 1450000.0,
      progressPercentage: 95.0,
      expectedProgressPercentage: 95.0,
      delayDays: 0,
      status: 'COMPLETED',
      riskLevel: 'HIGH',
      riskScore: 62,
      attention: 'Work completed. Proximity verification with nearby works recommended.'
    },
    {
      projectId: 'MPL-7731',
      projectName: 'Public Library and Study Hall',
      sector: 'Education',
      sanctionedAmount: 2000000.0,
      expenditureAmount: 1200000.0,
      progressPercentage: 60.0,
      expectedProgressPercentage: 65.0,
      delayDays: 15,
      status: 'IN_PROGRESS',
      riskLevel: 'MEDIUM',
      riskScore: 45,
      attention: 'Civil construction on schedule. Roofing phase initiated.'
    },
    {
      projectId: 'MPL-6621',
      projectName: 'Ward Multipurpose Shed Construction',
      sector: 'Community Infrastructure',
      sanctionedAmount: 1800000.0,
      expenditureAmount: 1700000.0,
      progressPercentage: 85.0,
      expectedProgressPercentage: 85.0,
      delayDays: 0,
      status: 'IN_PROGRESS',
      riskLevel: 'MEDIUM',
      riskScore: 55,
      attention: 'Finishing work in progress. Scheduled completion in 30 days.'
    },
    {
      projectId: 'MPL-01560',
      projectName: 'Science Lab Equipment and Building',
      sector: 'Education',
      sanctionedAmount: 1200000.0,
      expenditureAmount: 1150000.0,
      progressPercentage: 79.0,
      expectedProgressPercentage: 80.0,
      delayDays: 5,
      status: 'IN_PROGRESS',
      riskLevel: 'LOW',
      riskScore: 28,
      attention: 'Lab equipment procured and installed. Inspection certificate awaited.'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Role Banner / Profile Context Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
            {isMP ? <User className="w-5 h-5" /> : <Building className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900">
                {isMP && "Hon'ble Member of Parliament Decision Support Cockpit"}
                {isMinistry && "Central Ministry Executive Monitoring Cockpit (MoSPI)"}
                {isState && "State Nodal Authority Oversight Console (Maharashtra)"}
                {isDistrict && "District Authority Implementation Workspace (Pune District)"}
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-300">
                {user.jurisdiction}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isMP && "Your constituency works, quota entitlement utilization & community assets delivery status"}
              {isMinistry && "All-India scheme implementation, national anomaly distribution & central policy compliance"}
              {isState && "State-level fund flow, inter-district execution performance & bottleneck tracking"}
              {isDistrict && "Field verification queue, implementing agency accountability & MB auditing"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => navigate('/projects/MPL-10482')}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Inspect Priority Case (MPL-10482)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MP-SPECIFIC VIEW: Entitlement Quota Bar & Constituency Portfolio           */}
      {/* ========================================================================= */}
      {isMP && (
        <div className="space-y-6">
          {/* MP Fund Entitlement & Allocation Bar */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Constituency Fund Entitlement & Quota Utilization</h3>
                <p className="text-xs text-slate-500">Official annual allocation for Pune Parliamentary Constituency</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-[11px] text-slate-400 block uppercase">Annual Quota</span>
                <span className="text-base font-bold text-slate-900">₹5,00,00,000</span>
              </div>
            </div>

            {/* Quota Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-700 font-medium">
                <span>Sanctioned Allocation: <b>₹3.80 Cr (76.0%)</b></span>
                <span className="text-slate-500 font-mono">Disbursed on Site: ₹2.95 Cr (59.0%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                <div style={{ width: '59%' }} className="bg-emerald-600 h-full" title="Disbursed: ₹2.95 Cr" />
                <div style={{ width: '17%' }} className="bg-blue-600 h-full" title="Sanctioned Balance: ₹0.85 Cr" />
                <div style={{ width: '10%' }} className="bg-amber-500 h-full" title="Recommended: ₹0.50 Cr" />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                <span>₹2.95 Cr Disbursed</span>
                <span>₹3.80 Cr Sanctioned</span>
                <span>₹4.30 Cr Recommended</span>
                <span>₹5.00 Cr Quota</span>
              </div>
            </div>

            {/* 4 Entitlement Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Recommended</span>
                <div className="text-base font-bold font-mono text-slate-900">34 Works</div>
                <span className="text-[10px] text-slate-500 font-mono">₹4.30 Cr Total</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Sanctioned</span>
                <div className="text-base font-bold font-mono text-blue-700">28 Works</div>
                <span className="text-[10px] text-slate-500 font-mono">₹3.80 Cr Approved</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Completed</span>
                <div className="text-base font-bold font-mono text-emerald-700">19 Assets</div>
                <span className="text-[10px] text-slate-500 font-mono">Civic Amenities</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Available Quota</span>
                <div className="text-base font-bold font-mono text-slate-900">₹70 Lakhs</div>
                <span className="text-[10px] text-slate-500 font-mono">For New Works</span>
              </div>
            </div>
          </div>

          {/* MP Assigned Works & Execution Progress Tracker */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Your Recommended Works & On-Site Execution Progress
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track physical progress, expenditure disbursements and delays across works assigned to your constituency
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                {mpAssignedWorks.length} Active Portfolio Works
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="px-4 py-3">Work ID</th>
                    <th className="px-4 py-3">Project Title & Sector</th>
                    <th className="px-4 py-3">Sanctioned (₹)</th>
                    <th className="px-4 py-3">Disbursed (₹)</th>
                    <th className="px-4 py-3">Physical Progress</th>
                    <th className="px-4 py-3">Timeline Status</th>
                    <th className="px-4 py-3">Risk Tier</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mpAssignedWorks.map((work) => (
                    <tr key={work.projectId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-slate-900">{work.projectId}</td>
                      <td className="px-4 py-3 max-w-xs">
                        <div className="font-medium text-slate-900">{work.projectName}</div>
                        <div className="text-[11px] text-slate-400">{work.sector}</div>
                        <div className="text-[10px] text-amber-700 mt-0.5 font-medium">{work.attention}</div>
                      </td>
                      <td className="px-4 py-3 font-mono font-medium">₹{work.sanctionedAmount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">₹{work.expenditureAmount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-14 bg-slate-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${work.progressPercentage < 50 && work.delayDays > 0 ? 'bg-red-500' : 'bg-slate-700'}`}
                              style={{ width: `${work.progressPercentage}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] font-semibold">{work.progressPercentage}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {work.delayDays > 0 ? (
                          <span className="text-red-700 font-mono font-semibold">{work.delayDays}d Delay</span>
                        ) : (
                          <span className="text-emerald-700 font-medium">On Schedule</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <RiskBadge level={work.riskLevel} score={work.riskScore} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/projects/${work.projectId}`)}
                            className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                          <button
                            onClick={() => navigate(`/reports/${work.projectId}`)}
                            className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                          >
                            Dossier
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Civic Amenities Asset Creation Tracker & Early Warning Radar for MP */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AssetCreationTracker />
            <EarlyWarningComplianceRadar />
          </div>

          {/* GIS Map of MP's Constituency Works */}
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
      )}

      {/* ========================================================================= */}
      {/* NON-MP STAKEHOLDER VIEWS (Ministry, State Nodal Authority, District)       */}
      {/* ========================================================================= */}
      {!isMP && (
        <div className="space-y-6">
          {/* Top 6 KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <KPICard
              title={isMinistry ? "All-India Works" : isState ? "State Works" : "District Works"}
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

          {/* Durable Asset Creation & Compliance Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AssetCreationTracker />
            <EarlyWarningComplianceRadar />
          </div>

          {/* Main Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
      )}
    </div>
  );
}
"""

with open(os.path.join(BASE, "pages", "DashboardPage.jsx"), "w", encoding="utf-8") as f:
    f.write(dashboard_code.strip())
print("DashboardPage tailored for MP and Stakeholder roles.")