import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, 
  AlertOctagon, 
  AlertTriangle, 
  Search, 
  Filter, 
  ArrowRight, 
  FileSearch, 
  FileText, 
  TrendingUp, 
  Clock, 
  Building, 
  MapPin, 
  ShieldAlert,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { authService } from '../services/auth';
import RiskBadge from '../components/RiskBadge';
import StatusBadge from '../components/StatusBadge';
import Tooltip from '../components/Tooltip';

export default function RankingsPage() {
  const navigate = useNavigate();
  const user = authService.getUser() || { roleId: 'MINISTRY', jurisdiction: 'National Central Oversight' };

  const [projects, setProjects] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'HIGH' | 'DELAYED'

  useEffect(() => {
    loadRankings();
    api.getDistricts()
      .then((data) => { if (data && data.length > 0) setDistricts(data); })
      .catch((err) => console.warn('Failed to load districts:', err));
  }, []);

  const loadRankings = async () => {
    setLoading(true);
    try {
      // Fetch top 50 projects sorted descending by risk score
      const res = await api.getProjects({
        size: 50,
        sortBy: 'riskScore',
        sortDirection: 'desc'
      });
      setProjects(res.content || []);
    } catch (err) {
      console.warn('Rankings load fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter projects by tab, district, and search query
  const filteredProjects = projects.filter((p) => {
    if (activeTab === 'CRITICAL' && p.riskLevel !== 'CRITICAL') return false;
    if (activeTab === 'HIGH' && p.riskLevel !== 'HIGH' && p.riskLevel !== 'CRITICAL') return false;
    if (activeTab === 'DELAYED' && (!p.delayDays || p.delayDays <= 30)) return false;

    if (selectedDistrict && p.district !== selectedDistrict) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = p.projectId && p.projectId.toLowerCase().includes(q);
      const matchName = p.projectName && p.projectName.toLowerCase().includes(q);
      const matchDist = p.district && p.district.toLowerCase().includes(q);
      const matchAgency = p.implementingAgency && p.implementingAgency.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchDist && !matchAgency) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner & Header */}
      <div className="space-y-3 pb-2 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Priority Cases Ranking
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-300 font-bold">
                RISK SORTED
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-signal risk ranking to triage supervisory audits and field investigations across registered works
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono">Sorted by:</span>
            <span className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 font-mono">
              Composite Risk Score (100 → 0)
            </span>
          </div>
        </div>

        {/* Administrative Review Guidance Disclaimer */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-slate-800">Administrative Review Guidance: </span>
            <span>
              Ranking is based on a composite risk score combining financial anomalies, timeline slippage, spatial proximity, and audit trail discrepancies. Intended to guide administrative review, not determine culpability or establish legal wrongdoing.
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Severity Tabs */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs overflow-x-auto">
            {[
              { id: 'ALL', label: 'All Ranked Cases' },
              { id: 'CRITICAL', label: 'Critical Priority (≥ 80)' },
              { id: 'HIGH', label: 'High Attention (≥ 60)' },
              { id: 'DELAYED', label: 'Chronically Delayed' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* District Selector & Search */}
          <div className="flex items-center gap-2">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="p-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 focus:outline-none focus:border-slate-800"
            >
              <option value="">All Districts (National)</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search ranked projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs w-44 sm:w-56 focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ranked Project Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
            Calculating and sorting multi-model criticalness rankings...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
            No projects matched the selected ranking filter.
          </div>
        ) : (
          filteredProjects.map((p, idx) => {
            const isCritical = p.riskScore >= 80;
            const isHigh = p.riskScore >= 60 && p.riskScore < 80;
            const rankNumber = idx + 1;

            return (
              <div
                key={p.projectId}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-xs transition-all space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-start gap-3">
                    {/* Priority Queue Badge */}
                    <div className="w-12 h-11 rounded-lg bg-slate-900 text-white flex flex-col items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs">
                      <span className="text-[8px] uppercase tracking-wider text-slate-400">Rank</span>
                      <span className="text-sm font-black">{rankNumber < 10 ? `P0${rankNumber}` : `P${rankNumber}`}</span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-700">{p.projectId}</span>
                        <RiskBadge level={p.riskLevel} score={p.riskScore} />
                        <StatusBadge status={p.status} />
                        <span className="text-[11px] font-medium text-slate-500 font-mono">
                          {p.district}, {p.state || 'India'}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1 hover:text-blue-600 cursor-pointer"
                          onClick={() => navigate(`/projects/${p.projectId}`)}>
                        {p.projectName}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Agency: <b>{p.implementingAgency || 'District Engineering Cell'}</b> • Contractor: <b>{p.contractorName || 'Government Registered Contractor'}</b>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => navigate(`/investigation/${p.projectId}`)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <FileSearch className="w-3.5 h-3.5" />
                      <span>Investigate</span>
                    </button>
                    <button
                      onClick={() => navigate(`/reports/${p.projectId}`)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs border border-slate-200 transition-colors cursor-pointer"
                    >
                      Dossier
                    </button>
                  </div>
                </div>

                {/* Progress & Financial Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                      <span>Physical Progress vs Target</span>
                      <span className="font-mono font-bold text-slate-900">{p.progressPercentage}% / {p.expectedProgressPercentage || 80}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${p.progressPercentage < 50 && p.delayDays > 0 ? 'bg-red-500' : 'bg-slate-800'}`}
                        style={{ width: `${Math.min(100, p.progressPercentage || 0)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-around text-xs bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Sanctioned</div>
                      <div className="font-mono font-bold text-slate-800">₹{(p.sanctionedAmount || 0).toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Disbursed</div>
                      <div className="font-mono font-bold text-slate-800">₹{(p.expenditureAmount || 0).toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Fund Used</div>
                      <div className="font-mono font-bold text-slate-800">{p.fundUtilizationPercent || 0}%</div>
                    </div>
                  </div>

                  {/* Primary Anomaly Reason Pill */}
                  <div className="flex items-center">
                    <div className="w-full p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-950">Key Trigger: </span>
                        <span>
                          {p.progressGap > 20 
                            ? `Progress gap of ${p.progressGap}% with ${p.delayDays}d overdue execution.`
                            : p.delayDays > 30
                            ? `Delayed by ${p.delayDays} days past target completion date.`
                            : 'Multi-variate timeline & peer unit-cost anomaly.'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
