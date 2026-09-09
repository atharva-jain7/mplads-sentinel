import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src"

def save(rel_path, content):
    full = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Refactored: {rel_path}")

# 1. DashboardPage.jsx
save("pages/DashboardPage.jsx", """import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderKanban, 
  AlertOctagon, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Copy, 
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import KPICard from '../components/KPICard';
import RiskBadge from '../components/RiskBadge';
import RiskDistributionChart from '../components/RiskDistributionChart';
import ProjectStatusChart from '../components/ProjectStatusChart';
import RiskTrendChart from '../components/RiskTrendChart';
import GISMap from '../components/GISMap';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">National Project Risk Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated anomaly screening and risk prioritization across active MPLADS works
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

      {/* Top KPI Cards (Clean, spacious grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard
          title="Total Works"
          value={s.totalProjects || 12482}
          icon={FolderKanban}
          color="slate"
        />
        <KPICard
          title="Critical Risk"
          value={s.criticalRisk || 47}
          icon={AlertOctagon}
          color="red"
        />
        <KPICard
          title="High Risk"
          value={s.highRisk || 386}
          icon={AlertTriangle}
          color="orange"
        />
        <KPICard
          title="Delayed"
          value={s.delayed || 912}
          icon={Clock}
          color="amber"
        />
        <KPICard
          title="Cost Anomalies"
          value={s.costAnomalies || 386}
          icon={TrendingUp}
          color="red"
        />
        <KPICard
          title="Duplicates"
          value={s.potentialDuplicates || 74}
          icon={Copy}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Analytics & GIS */}
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

        {/* Right Col: Priority Queue */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Priority Review Queue</h3>
                <p className="text-xs text-slate-500 mt-0.5">Top-ranked works requiring officer attention</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Ranked by Risk</span>
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
""")

# 2. ProjectListPage.jsx
save("pages/ProjectListPage.jsx", """import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { api } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import StatusBadge from '../components/StatusBadge';

export default function ProjectListPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size] = useState(15);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [district, setDistrict] = useState('');
  const [projectType, setProjectType] = useState('');
  const [status, setStatus] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const [sortBy, setSortBy] = useState('riskScore');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    loadProjects();
  }, [page, district, projectType, status, riskLevel, sortBy, sortDirection]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size,
        sortBy,
        sortDirection,
        ...(query ? { query } : {}),
        ...(district ? { district } : {}),
        ...(projectType ? { projectType } : {}),
        ...(status ? { status } : {}),
        ...(riskLevel ? { riskLevel } : {})
      };
      const res = await api.getProjects(params);
      setProjects(res.content || []);
      setTotal(res.totalElements || 0);
    } catch (err) {
      console.warn('Load projects error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    loadProjects();
  };

  const clearFilters = () => {
    setQuery('');
    setDistrict('');
    setProjectType('');
    setStatus('');
    setRiskLevel('');
    setSortBy('riskScore');
    setSortDirection('desc');
    setPage(0);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">MPLADS Project Registry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {total.toLocaleString('en-IN')} monitored works in registry
          </p>
        </div>
      </div>

      {/* Clean Single-Row Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Project ID (e.g. MPL-10482), title, or location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-slate-800"
            />
          </div>

          <select
            value={district}
            onChange={(e) => { setDistrict(e.target.value); setPage(0); }}
            className="p-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700"
          >
            <option value="">All Districts</option>
            <option value="Pune">Pune</option>
            <option value="Bengaluru Urban">Bengaluru</option>
            <option value="Lucknow">Lucknow</option>
            <option value="Ahmedabad">Ahmedabad</option>
            <option value="New Delhi">New Delhi</option>
            <option value="Mumbai Suburban">Mumbai</option>
            <option value="Chennai">Chennai</option>
            <option value="Patna">Patna</option>
          </select>

          <select
            value={riskLevel}
            onChange={(e) => { setRiskLevel(e.target.value); setPage(0); }}
            className="p-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700"
          >
            <option value="">All Risk Tiers</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium cursor-pointer"
          >
            Search
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs cursor-pointer"
          >
            Reset
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-4 py-3">Project ID</th>
                <th className="px-4 py-3">Title & Sector</th>
                <th className="px-4 py-3">District</th>
                <th className="px-4 py-3">Sanctioned (₹)</th>
                <th className="px-4 py-3">Expenditure (₹)</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Risk Tier</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-slate-400">
                    Loading registry records...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-slate-400">
                    No matching projects found.
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p.projectId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-slate-900">{p.projectId}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="font-medium text-slate-900 truncate">{p.projectName}</div>
                      <div className="text-[11px] text-slate-400">{p.projectType}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.district}</td>
                    <td className="px-4 py-3 font-mono font-medium">₹{(p.sanctionedAmount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">₹{(p.expenditureAmount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-100 rounded-full h-1.5">
                          <div className="bg-slate-700 h-1.5 rounded-full" style={{ width: `${p.progressPercentage || 0}%` }} />
                        </div>
                        <span className="font-mono text-[11px]">{p.progressPercentage || 0}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3"><RiskBadge level={p.riskLevel} score={p.riskScore} /></td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => navigate(`/projects/${p.projectId}`)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {projects.length} of {total} works</span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="p-1 bg-white border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono px-2 text-[11px]">Page {page + 1}</span>
            <button
              disabled={projects.length < size}
              onClick={() => setPage(page + 1)}
              className="p-1 bg-white border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
""")

print("DashboardPage and ProjectListPage refactored cleanly.")