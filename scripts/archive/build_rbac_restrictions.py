import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src"

def save(rel_path, content):
    full = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Updated: {rel_path}")

# =========================================================================
# 1. ProjectListPage.jsx (Strict Jurisdiction Filtering & Lock for MP)
# =========================================================================
save("pages/ProjectListPage.jsx", """import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, FileText, Lock, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import { authService } from '../services/auth';
import RiskBadge from '../components/RiskBadge';
import StatusBadge from '../components/StatusBadge';

export default function ProjectListPage() {
  const navigate = useNavigate();
  const user = authService.getUser() || { roleId: 'MP', district: 'Pune', jurisdiction: 'Pune Parliamentary Constituency' };
  
  const isMP = user.roleId === 'MP';
  const isDistrict = user.roleId === 'DISTRICT';
  const isLockedDistrict = isMP || isDistrict;
  const lockedDistrictValue = user.district || 'Pune';

  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size] = useState(15);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [district, setDistrict] = useState(isLockedDistrict ? lockedDistrictValue : '');
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
      const activeDistrict = isLockedDistrict ? lockedDistrictValue : district;
      const params = {
        page,
        size,
        sortBy,
        sortDirection,
        ...(query ? { query } : {}),
        ...(activeDistrict ? { district: activeDistrict } : {}),
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
    if (!isLockedDistrict) {
      setDistrict('');
    }
    setProjectType('');
    setStatus('');
    setRiskLevel('');
    setSortBy('riskScore');
    setSortDirection('desc');
    setPage(0);
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {isMP ? 'My Constituency Works Portfolio' : 'MPLADS Project Registry'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isMP ? (
              <span>Showing works recommended within <b>{user.jurisdiction || 'Pune Parliamentary Constituency'}</b></span>
            ) : (
              <span>{total.toLocaleString('en-IN')} monitored works in registry</span>
            )}
          </p>
        </div>

        {isMP && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-md text-xs font-mono">
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>Jurisdiction Restriction: Pune PC Only</span>
          </div>
        )}
      </div>

      {/* Single-Row Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={isMP ? "Search within your constituency works..." : "Search by Project ID, title, or location..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-slate-800"
            />
          </div>

          {/* District Selector (Locked for MP / District Officer) */}
          {isLockedDistrict ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-slate-100 rounded-lg text-xs text-slate-700 font-mono">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>{lockedDistrictValue} (Constituency Locked)</span>
            </div>
          ) : (
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
          )}

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
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-slate-400">
                    Loading records...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-slate-400">
                    No matching works found in your constituency.
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
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/projects/${p.projectId}`)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => navigate(`/reports/${p.projectId}`)}
                          title="Generate Official Dossier"
                          className="p-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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

# =========================================================================
# 2. ProjectDetailPage.jsx (Access Control Enforcement for Other Constituencies)
# =========================================================================
save("pages/ProjectDetailPage.jsx", """import React, { useState, useEffect } from 'react';
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
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';
import { authService } from '../services/auth';
import RiskBadge from '../components/RiskBadge';
import StatusBadge from '../components/StatusBadge';
import ExplainabilityCard from '../components/ExplainabilityCard';

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const user = authService.getUser() || { roleId: 'MP', district: 'Pune', jurisdiction: 'Pune Parliamentary Constituency' };

  const isMP = user.roleId === 'MP';
  const isDistrict = user.roleId === 'DISTRICT';

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

  // STRICT JURISDICTION ENFORCEMENT
  // An MP or District Officer cannot inspect projects outside their assigned district
  const isUnauthorized = (isMP || isDistrict) && p.district && p.district !== 'Pune';

  if (isUnauthorized) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-red-200 rounded-2xl shadow-sm text-center space-y-4">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Jurisdiction Access Restricted</h2>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            As {isMP ? "Hon'ble Member of Parliament for" : "District Officer for"}{' '}
            <b>{user.jurisdiction || 'Pune Parliamentary Constituency'}</b>, your authorization is strictly restricted to works recommended within your constituency.
          </p>
          <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500 font-mono">
            <div>Requested Work ID: <b>{p.projectId}</b></div>
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
""")

# =========================================================================
# 3. Sidebar.jsx (Role-Aware Menu Labels)
# =========================================================================
save("components/Sidebar.jsx", """import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  AlertCircle, 
  FileSearch,
  Lock
} from 'lucide-react';
import { authService } from '../services/auth';

export default function Sidebar() {
  const user = authService.getUser() || { roleId: 'MP', jurisdiction: 'Pune Parliamentary Constituency' };
  const isMP = user.roleId === 'MP';

  const links = [
    { to: '/dashboard', label: isMP ? 'Constituency Cockpit' : 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: isMP ? 'My Constituency Works' : 'Project Registry', icon: FolderKanban },
    { to: '/projects/MPL-10482', label: 'Priority Case (MPL-10482)', icon: AlertCircle, highlight: true },
    { to: '/investigation/MPL-10482', label: 'Investigation Workspace', icon: FileSearch },
  ];

  return (
    <aside className="w-56 bg-slate-50 border-r border-slate-200 min-h-[calc(100vh-3.5rem)] p-4 flex flex-col justify-between font-sans">
      <div>
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Navigation</p>
        <nav className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold'
                      : item.highlight
                      ? 'text-orange-700 hover:bg-orange-50/70 font-semibold'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  }`
                }
              >
                <Icon className={`w-4 h-4 ${item.highlight ? 'text-orange-600' : ''}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-500 space-y-1">
        <div className="flex items-center gap-1 font-semibold text-slate-800">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Role-Based Access</span>
        </div>
        <p className="text-[10px] leading-tight text-slate-400">
          {isMP ? 'Constrained to Pune Parliamentary Constituency works.' : 'Authority authorization active.'}
        </p>
      </div>
    </aside>
  );
}
""")

print("ProjectListPage, ProjectDetailPage, and Sidebar updated with strict RBAC restrictions.")