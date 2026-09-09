import os
BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src"

code = """import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">MPLADS Project Registry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {total.toLocaleString('en-IN')} monitored works • Official dossiers available for all records
          </p>
        </div>
      </div>

      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Project ID (e.g. MPL-10482, MPL-01868), title, or location..."
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
"""

with open(os.path.join(BASE, "pages", "ProjectListPage.jsx"), "w", encoding="utf-8") as f:
    f.write(code.strip())
print("ProjectListPage updated.")