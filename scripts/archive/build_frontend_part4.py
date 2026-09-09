import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src"

def save(rel_path, content):
    full = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Created page: {rel_path}")

# 2. pages/DashboardPage.jsx
save("pages/DashboardPage.jsx", """import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderKanban, 
  AlertOctagon, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Copy, 
  Repeat, 
  ArrowUpRight,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink
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
        console.warn('Using fallback summary data:', err);
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
            { month: 'Sep 2025', critical: 3, high: 25 },
            { month: 'Oct 2025', critical: 4, high: 30 },
            { month: 'Nov 2025', critical: 2, high: 28 },
            { month: 'Dec 2025', critical: 5, high: 34 },
            { month: 'Jan 2026', critical: 4, high: 32 },
            { month: 'Feb 2026', critical: 6, high: 38 }
          ],
          priorityQueue: [
            {
              projectId: 'MPL-10482',
              projectName: 'Construction of Community Infrastructure',
              district: 'Pune',
              riskScore: 94,
              riskLevel: 'CRITICAL',
              primaryFlag: 'Cost overrun, low physical progress, delay & repeated funding'
            },
            {
              projectId: 'MPL-9182',
              projectName: 'CC Paver Road and Stormwater Drain',
              district: 'Lucknow',
              riskScore: 91,
              riskLevel: 'HIGH',
              primaryFlag: 'Budget overrun 20% & 180 days delay'
            },
            {
              projectId: 'MPL-7721',
              projectName: 'Installation of Solar RO Water Plant',
              district: 'Bengaluru Urban',
              riskScore: 87,
              riskLevel: 'HIGH',
              primaryFlag: 'Repeated funding in same ward & milestone delay'
            },
            {
              projectId: 'MPL-6651',
              projectName: 'Underground Drainage and Sewer Line',
              district: 'Ahmedabad',
              riskScore: 83,
              riskLevel: 'HIGH',
              primaryFlag: 'Potential duplicate project within 1.0 km radius'
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
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gov-navy to-blue-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              NATIONAL MONITORING COCKPIT
            </span>
            <span className="text-xs text-slate-300">Live Telemetry</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">MPLADS Risk Prioritization Dashboard</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Autonomous multi-signal risk prioritization engine detecting budget overruns, timeline variances, repeated fund allocations, and geospatial overlap.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/projects/MPL-10482')}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Inspect Flagship Demo (MPL-10482)</span>
          </button>
        </div>
      </div>

      {/* Top KPI Cards (7 exact prompt metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <KPICard
          title="Total Projects"
          value={s.totalProjects || 12482}
          subtitle="Active MPLADS portfolio"
          icon={FolderKanban}
          color="blue"
        />
        <KPICard
          title="Critical Risk"
          value={s.criticalRisk || 47}
          subtitle="Immediate investigation"
          icon={AlertOctagon}
          color="red"
        />
        <KPICard
          title="High Risk"
          value={s.highRisk || 386}
          subtitle="Review recommended"
          icon={AlertTriangle}
          color="orange"
        />
        <KPICard
          title="Delayed"
          value={s.delayed || 912}
          subtitle="Past milestone date"
          icon={Clock}
          color="amber"
        />
        <KPICard
          title="Cost Anomalies"
          value={s.costAnomalies || 386}
          subtitle="Disproportionate spend"
          icon={TrendingUp}
          color="red"
        />
        <KPICard
          title="Potential Duplicates"
          value={s.potentialDuplicates || 74}
          subtitle="Spatial proximity overlap"
          icon={Copy}
          color="orange"
        />
        <KPICard
          title="Repeated Funding"
          value={s.repeatedFunding || 91}
          subtitle="Same zone history"
          icon={Repeat}
          color="amber"
        />
      </div>

      {/* Main Charts & Priority Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Charts & Geographic Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RiskDistributionChart distribution={s.riskDistribution} />
            <ProjectStatusChart distribution={s.statusDistribution} />
          </div>

          <RiskTrendChart trends={s.monthlyRiskTrend} />

          {/* GIS Geographic Risk Preview */}
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

        {/* Right Col: Investigation Priority Queue */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  Investigation Priority Queue
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Top-ranked projects requiring officer review</p>
              </div>
              <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded border border-red-300">
                ACTION REQUIRED
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {(s.priorityQueue || []).map((item, index) => (
                <div
                  key={item.projectId}
                  onClick={() => navigate(`/projects/${item.projectId}`)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                    item.projectId === 'MPL-10482'
                      ? 'bg-red-50/70 border-red-300 ring-2 ring-red-500/20'
                      : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                        {index + 1}. {item.projectId}
                      </span>
                      {item.projectId === 'MPL-10482' && (
                        <span className="text-[9px] bg-amber-500 text-slate-950 font-extrabold px-1.5 py-0.2 rounded uppercase">
                          Demo Focus
                        </span>
                      )}
                    </div>
                    <RiskBadge level={item.riskLevel} score={item.riskScore} />
                  </div>

                  <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {item.projectName}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    {item.district} District
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between">
                    <span className="text-slate-500 truncate mr-2 font-mono text-[10px]">
                      {item.primaryFlag}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/projects')}
              className="w-full mt-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Full Project Registry ({s.totalProjects || '12,482'})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
""")

# 3. pages/ProjectListPage.jsx
save("pages/ProjectListPage.jsx", """import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
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

  // Filter States
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
      console.warn('Failed to load project list:', err);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">MPLADS Project Registry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Search, filter, and inspect {total.toLocaleString('en-IN')} monitored works with explainable anomaly flags
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Project ID (e.g. MPL-10482), title, or location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            Reset
          </button>
        </form>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
          <select
            value={district}
            onChange={(e) => { setDistrict(e.target.value); setPage(0); }}
            className="p-2 border border-slate-300 rounded-md text-xs bg-white text-slate-700"
          >
            <option value="">All Districts</option>
            <option value="Pune">Pune (Maharashtra)</option>
            <option value="Bengaluru Urban">Bengaluru Urban (Karnataka)</option>
            <option value="Lucknow">Lucknow (UP)</option>
            <option value="Ahmedabad">Ahmedabad (Gujarat)</option>
            <option value="New Delhi">New Delhi</option>
            <option value="Mumbai Suburban">Mumbai Suburban</option>
            <option value="Chennai">Chennai (Tamil Nadu)</option>
            <option value="Patna">Patna (Bihar)</option>
          </select>

          <select
            value={projectType}
            onChange={(e) => { setProjectType(e.target.value); setPage(0); }}
            className="p-2 border border-slate-300 rounded-md text-xs bg-white text-slate-700"
          >
            <option value="">All Project Types</option>
            <option value="Community Infrastructure">Community Infrastructure</option>
            <option value="Drinking Water">Drinking Water</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Education">Education</option>
            <option value="Roads and Pathways">Roads and Pathways</option>
            <option value="Health and Family Welfare">Health and Family Welfare</option>
            <option value="Irrigation Facilities">Irrigation Facilities</option>
            <option value="Electricity and Energy">Electricity and Energy</option>
          </select>

          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(0); }}
            className="p-2 border border-slate-300 rounded-md text-xs bg-white text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="DELAYED">Delayed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="OVERDUE">Overdue</option>
            <option value="SANCTIONED">Sanctioned</option>
            <option value="RECOMMENDED">Recommended</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            value={riskLevel}
            onChange={(e) => { setRiskLevel(e.target.value); setPage(0); }}
            className="p-2 border border-slate-300 rounded-md text-xs bg-white text-slate-700 font-semibold text-red-700"
          >
            <option value="">All Risk Tiers</option>
            <option value="CRITICAL">Critical (80-100)</option>
            <option value="HIGH">High (60-79)</option>
            <option value="MEDIUM">Medium (30-59)</option>
            <option value="LOW">Low (0-29)</option>
          </select>
        </div>
      </div>

      {/* Project Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Project ID</th>
                <th className="px-4 py-3">Project Name / Type</th>
                <th className="px-4 py-3">District</th>
                <th className="px-4 py-3 cursor-pointer hover:text-slate-900" onClick={() => {
                  setSortBy('sanctionedAmount');
                  setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
                }}>
                  <div className="flex items-center gap-1">
                    <span>Sanctioned (₹)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3">Expenditure (₹)</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 cursor-pointer hover:text-slate-900" onClick={() => {
                  setSortBy('riskScore');
                  setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
                }}>
                  <div className="flex items-center gap-1">
                    <span>Risk Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-slate-400">
                    <span className="inline-block w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Loading MPLADS registry records...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-slate-500">
                    No matching projects found. Try resetting filters.
                  </td>
                </tr>
              ) : (
                projects.map((p) => {
                  const isDemoCase = p.projectId === 'MPL-10482';
                  return (
                    <tr
                      key={p.projectId}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isDemoCase ? 'bg-amber-50/50 font-semibold' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span>{p.projectId}</span>
                          {isDemoCase && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Flagship Demo Case" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <div className="font-semibold text-slate-900 truncate" title={p.projectName}>
                          {p.projectName}
                        </div>
                        <div className="text-[11px] text-slate-500">{p.projectType}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{p.district}</td>
                      <td className="px-4 py-3 font-mono font-semibold">
                        ₹{(p.sanctionedAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600">
                        ₹{(p.expenditureAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-slate-200 rounded-full h-1.5">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: `${Math.min(100, p.progressPercentage || 0)}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px]">{p.progressPercentage || 0}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3">
                        <RiskBadge level={p.riskLevel} score={p.riskScore} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => navigate(`/projects/${p.projectId}`)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-600 rounded border border-blue-200 transition-colors"
                        >
                          Analyze
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <b className="text-slate-800">{projects.length}</b> of <b className="text-slate-800">{total}</b> projects
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="p-1.5 bg-white border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono px-2">Page {page + 1}</span>
            <button
              disabled={projects.length < size}
              onClick={() => setPage(page + 1)}
              className="p-1.5 bg-white border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
""")

print("DashboardPage & ProjectListPage created.")