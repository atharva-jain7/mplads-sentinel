import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, FileText, Lock, ShieldAlert, UploadCloud, Globe, Building, Filter } from 'lucide-react';
import { api } from '../services/api';
import { authService } from '../services/auth';
import RiskBadge from '../components/RiskBadge';
import StatusBadge from '../components/StatusBadge';

export default function ProjectListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = authService.getUser() || { roleId: 'MINISTRY', jurisdiction: 'National Central Oversight' };
  
  const isMP = user.roleId === 'MP';
  const isState = user.roleId === 'STATE';
  const isMinistry = user.roleId === 'MINISTRY' || !user.roleId;

  // ONLY lock district for MP! Ministry and State Nodal can view all cases
  const isLockedDistrict = isMP;
  const lockedDistrictValue = 'Pune';

  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size] = useState(15);
  const [loading, setLoading] = useState(true);
  const [availableDistricts, setAvailableDistricts] = useState([]);

  // Initialize from searchParams if navigated from Dashboard or elsewhere
  const initialDistrict = searchParams.get('district') || (isLockedDistrict ? lockedDistrictValue : '');
  const initialSector = searchParams.get('projectType') || '';
  const initialRiskLevel = searchParams.get('riskLevel') || '';
  const initialQuery = searchParams.get('query') || '';

  const [query, setQuery] = useState(initialQuery);
  const [district, setDistrict] = useState(initialDistrict);
  const [projectType, setProjectType] = useState(initialSector);
  const [status, setStatus] = useState('');
  const [riskLevel, setRiskLevel] = useState(initialRiskLevel);
  const [sortBy, setSortBy] = useState('riskScore');
  const [sortDirection, setSortDirection] = useState('desc');

  const renderRiskFlags = (p) => {
    const flags = [];
    const pGap = p.progressGap || (p.expectedProgressPercentage && p.progressPercentage ? Math.max(0, p.expectedProgressPercentage - p.progressPercentage) : 0);
    
    if (pGap > 15) {
      flags.push({ label: `Physical Lag (${pGap.toFixed(0)}%)`, severity: 'high' });
    }
    if (p.delayDays > 30) {
      flags.push({ label: `Schedule Delay (${p.delayDays}d overdue)`, severity: 'high' });
    }
    if ((p.expenditureAmount && p.sanctionedAmount && p.expenditureAmount > p.sanctionedAmount) || (p.fundUtilizationPercent && p.fundUtilizationPercent > 100)) {
      flags.push({ label: 'Expenditure Exceeds Sanction', severity: 'critical' });
    }
    if (p.riskScore >= 80) {
      flags.push({ label: 'Proximity & Scope Overlap', severity: 'critical' });
    }
    if (p.riskScore >= 60 && flags.length === 0) {
      flags.push({ label: 'Milestone Discrepancy Signal', severity: 'medium' });
    }

    if (flags.length === 0) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
          Compliant
        </span>
      );
    }

    const hasCritical = flags.some(f => f.severity === 'critical') || p.riskScore >= 80;
    const hasHigh = flags.some(f => f.severity === 'high') || p.riskScore >= 60;

    return (
      <div className="relative group inline-block">
        <button
          type="button"
          tabIndex={0}
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border cursor-help transition-all ${
            hasCritical
              ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
              : hasHigh
              ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${hasCritical ? 'bg-rose-500' : hasHigh ? 'bg-amber-500' : 'bg-slate-400'}`} />
          <span>{flags.length} Risk Indicator{flags.length > 1 ? 's' : ''}</span>
        </button>

        {/* Hover / Focus Tooltip Popover */}
        <div className="absolute right-0 sm:left-0 bottom-full mb-1.5 hidden group-hover:flex group-focus-within:flex flex-col gap-1.5 z-40 p-2.5 bg-slate-900 text-white rounded-lg shadow-xl text-[11px] min-w-[220px] border border-slate-700 pointer-events-none">
          <div className="font-semibold text-slate-300 pb-1 border-b border-slate-800 flex items-center justify-between">
            <span>Detected Risk Signals</span>
            <span className="text-[10px] text-amber-400 font-mono">({flags.length} active)</span>
          </div>
          {flags.map((f, i) => (
            <div key={i} className="flex items-start gap-1.5 text-slate-200">
              <span className="text-amber-400 font-bold mt-0.5">•</span>
              <span className="leading-tight">{f.label}</span>
            </div>
          ))}
          <div className="pt-1 text-[9px] text-slate-400 border-t border-slate-800 italic">
            Screening signal only • Does not establish fraud
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    api.getDistricts()
      .then((data) => {
        if (data && data.length > 0) setAvailableDistricts(data);
      })
      .catch((err) => console.warn('Could not load districts:', err));
  }, []);

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
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {isMP && "My Constituency Works Portfolio (Pune PC)"}
              {isState && "Maharashtra State Project Registry (All State Works)"}
              {isMinistry && "National Project Registry (All-India Surveillance)"}
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-300">
              {isMinistry ? 'PAN-INDIA ACCESS' : isState ? 'STATE-WIDE ACCESS' : 'CONSTITUENCY ONLY'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isMP ? (
              <span>Showing works recommended within <b>{user.jurisdiction || 'Pune Parliamentary Constituency'}</b></span>
            ) : isState ? (
              <span>Monitoring all sanctioned works across Maharashtra state • {total.toLocaleString('en-IN')} records available</span>
            ) : (
              <span>Central oversight across 543 Parliamentary Constituencies • {total.toLocaleString('en-IN')} records registered</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isMP && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-md text-xs font-mono">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Jurisdiction: Pune PC Only</span>
            </div>
          )}
          <button
            onClick={() => navigate('/import')}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Import Real CSV Data</span>
          </button>
        </div>
      </div>

      {/* Single-Row Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={isMP ? "Search within your constituency works..." : "Search across all India projects by ID, title, contractor, or location..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-slate-800"
            />
          </div>

          {/* District Selector (Locked ONLY for MP) */}
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
              <option value="">{isState ? "All State Districts (Maharashtra)" : "All Districts (National)"}</option>
              {availableDistricts.length > 0 ? (
                availableDistricts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))
              ) : (
                <>
                  <option value="Pune">Pune</option>
                  <option value="Mumbai Suburban">Mumbai Suburban</option>
                  <option value="Bengaluru Urban">Bengaluru Urban</option>
                  <option value="Lucknow">Lucknow</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="New Delhi">New Delhi</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Patna">Patna</option>
                  <option value="Varanasi">Varanasi</option>
                  <option value="Mysuru">Mysuru</option>
                </>
              )}
            </select>

          )}

          <select
            value={projectType}
            onChange={(e) => { setProjectType(e.target.value); setPage(0); }}
            className="p-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700"
          >
            <option value="">All Sectors</option>
            <option value="Community Infrastructure">Community Infrastructure</option>
            <option value="Roads & Pathways">Roads & Pathways</option>
            <option value="Drinking Water">Drinking Water</option>
            <option value="Health & Sanitation">Health & Sanitation</option>
            <option value="Education">Education</option>
            <option value="Irrigation">Irrigation</option>
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

          <select
            value={`${sortBy}_${sortDirection}`}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'riskScore_desc') { setSortBy('riskScore'); setSortDirection('desc'); }
              else if (val === 'expenditureAmount_desc') { setSortBy('expenditureAmount'); setSortDirection('desc'); }
              else if (val === 'fundUtilizationPercent_desc') { setSortBy('fundUtilizationPercent'); setSortDirection('desc'); }
              else if (val === 'delayDays_desc') { setSortBy('delayDays'); setSortDirection('desc'); }
              else if (val === 'progressPercentage_asc') { setSortBy('progressPercentage'); setSortDirection('asc'); }
              else if (val === 'updatedAt_desc') { setSortBy('updatedAt'); setSortDirection('desc'); }
              setPage(0);
            }}
            className="p-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 font-medium"
          >
            <option value="riskScore_desc">Sort: Highest Risk (Default)</option>
            <option value="expenditureAmount_desc">Sort: Highest Expenditure</option>
            <option value="fundUtilizationPercent_desc">Sort: Largest Cost Variance</option>
            <option value="delayDays_desc">Sort: Longest Delay</option>
            <option value="progressPercentage_asc">Sort: Lowest Progress</option>
            <option value="updatedAt_desc">Sort: Recently Updated</option>
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
        <div className="overflow-x-auto max-h-[650px] relative">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium sticky top-0 z-10 shadow-xs">
              <tr>
                <th className="px-4 py-2.5">Work ID</th>
                <th className="px-4 py-2.5">Title & Sector</th>
                <th className="px-4 py-2.5">Location</th>
                <th className="px-4 py-2.5">Amount</th>
                <th className="px-4 py-2.5">Progress</th>
                <th className="px-4 py-2.5">Status & Timeline</th>
                <th className="px-4 py-2.5">Risk Tier</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-slate-400">
                    Loading registry records...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-slate-400">
                    No matching works found.
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p.projectId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-2.5 font-mono font-semibold text-slate-900">{p.projectId}</td>
                    <td className="px-4 py-2.5 max-w-xs">
                      <div className="font-medium text-slate-900 truncate">{p.projectName}</div>
                      <div className="text-[11px] text-slate-400">{p.projectType}</div>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">
                      <div className="font-medium text-slate-800">{p.district}</div>
                      <div className="text-[10px] text-slate-400">{p.state}</div>
                    </td>
                    <td className="px-4 py-2.5 font-mono">
                      <div className="font-semibold text-slate-900">₹{(p.sanctionedAmount || 0).toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-slate-400">Disbursed: ₹{(p.expenditureAmount || 0).toLocaleString('en-IN')}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-100 rounded-full h-1.5">
                          <div className="bg-slate-700 h-1.5 rounded-full" style={{ width: `${p.progressPercentage || 0}%` }} />
                        </div>
                        <span className="font-mono text-[11px]">{p.progressPercentage || 0}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <StatusBadge status={p.status} />
                        {p.delayDays > 0 && (
                          <span className="text-[10px] font-mono text-rose-700 font-semibold">{p.delayDays}d Lag</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5"><RiskBadge level={p.riskLevel} score={p.riskScore} /></td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/projects/${p.projectId}`)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => navigate(`/reports/${p.projectId}`)}
                          title="Generate Statutory Dossier"
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Dossier</span>
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