import React, { useState, useEffect } from 'react';
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
  MapPin,
  Filter,
  RotateCcw,
  FileText,
  BarChart3,
  Compass
} from 'lucide-react';
import { api } from '../services/api';
import { authService } from '../services/auth';
import KPICard from '../components/KPICard';
import Tooltip from '../components/Tooltip';
import RiskBadge from '../components/RiskBadge';
import StatusBadge from '../components/StatusBadge';
import RiskDistributionChart from '../components/RiskDistributionChart';
import ProjectStatusChart from '../components/ProjectStatusChart';
import RiskTrendChart from '../components/RiskTrendChart';
import GISMap from '../components/GISMap';
import AssetCreationTracker from '../components/AssetCreationTracker';
import EarlyWarningComplianceRadar from '../components/EarlyWarningComplianceRadar';

const MP_CONSTITUENCY_DATA = [
  { mp: 'Smt. Supriya Sule', constituency: 'Pune / Baramati', district: 'Pune', state: 'Maharashtra' },
  { mp: 'Shri Rajnath Singh', constituency: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh' },
  { mp: 'Shri Narendra Modi', constituency: 'Varanasi', district: 'Varanasi', state: 'Uttar Pradesh' },
  { mp: 'Shri Nitin Gadkari', constituency: 'Nagpur', district: 'Nagpur', state: 'Maharashtra' },
  { mp: 'Shri P. C. Mohan', constituency: 'Bengaluru Central', district: 'Bengaluru Urban', state: 'Karnataka' },
  { mp: 'Shri Hasmukh Patel', constituency: 'Ahmedabad East', district: 'Ahmedabad', state: 'Gujarat' },
  { mp: 'Smt. Bansuri Swaraj', constituency: 'New Delhi', district: 'New Delhi', state: 'Delhi' },
  { mp: 'Shri Piyush Goyal', constituency: 'Mumbai North', district: 'Mumbai Suburban', state: 'Maharashtra' },
  { mp: 'Shri Ravi Shankar Prasad', constituency: 'Patna Sahib', district: 'Patna', state: 'Bihar' },
  { mp: 'Smt. Manju Sharma', constituency: 'Jaipur', district: 'Jaipur', state: 'Rajasthan' },
  { mp: 'Dr. Kalanidhi Veeraswamy', constituency: 'Chennai North', district: 'Chennai', state: 'Tamil Nadu' },
  { mp: 'Shri Asaduddin Owaisi', constituency: 'Hyderabad', district: 'Hyderabad', state: 'Telangana' },
  { mp: 'Shri Sudip Bandyopadhyay', constituency: 'Kolkata North', district: 'Kolkata', state: 'West Bengal' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [constituencyWorks, setConstituencyWorks] = useState([]);

  // Layered view states
  const [activeLayer, setActiveLayer] = useState('QUEUE'); // 'QUEUE' | 'GIS' | 'ANALYTICS' | 'COMPLIANCE'
  const [mpActiveLayer, setMpActiveLayer] = useState('WORKS'); // 'WORKS' | 'ASSETS' | 'GIS'

  // Filter states
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedMP, setSelectedMP] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [filteredQueue, setFilteredQueue] = useState(null);
  const [filtering, setFiltering] = useState(false);

  // Get logged-in user and their role (Selected BEFORE login)
  const user = authService.getUser() || { roleId: 'MINISTRY', jurisdiction: 'National Central Oversight' };

  const isMP = user.roleId === 'MP';
  const isMinistry = user.roleId === 'MINISTRY';
  const isState = user.roleId === 'STATE';
  const isDistrict = user.roleId === 'DISTRICT';

  useEffect(() => {
    api.getDistricts()
      .then((data) => { if (data && data.length > 0) setAvailableDistricts(data); })
      .catch((err) => console.warn('Could not load districts:', err));
  }, []);

  useEffect(() => {
    if (!selectedState && !selectedDistrict && !selectedMP && !selectedSector) {
      setFilteredQueue(null);
      return;
    }

    async function applyDashboardFilters() {
      setFiltering(true);
      try {
        const params = {
          size: 8,
          sortBy: 'riskScore',
          sortDirection: 'desc',
          ...(selectedDistrict ? { district: selectedDistrict } : {}),
          ...(selectedSector ? { projectType: selectedSector } : {})
        };
        const res = await api.getProjects(params);
        if (res && res.content) {
          setFilteredQueue(res.content);
        }
      } catch (err) {
        console.warn('Dashboard queue filter error:', err);
      } finally {
        setFiltering(false);
      }
    }
    applyDashboardFilters();
  }, [selectedState, selectedDistrict, selectedMP, selectedSector]);

  const handleStateChange = (stateName) => {
    setSelectedState(stateName);
    setSelectedDistrict('');
    setSelectedMP('');
  };

  const handleDistrictChange = (distName) => {
    setSelectedDistrict(distName);
    const match = MP_CONSTITUENCY_DATA.find((item) => item.district === distName);
    if (match) {
      setSelectedMP(match.mp);
      setSelectedState(match.state);
    } else {
      setSelectedMP('');
    }
  };

  const handleMPChange = (mpName) => {
    setSelectedMP(mpName);
    const match = MP_CONSTITUENCY_DATA.find((item) => item.mp === mpName);
    if (match) {
      setSelectedDistrict(match.district);
      setSelectedState(match.state);
    }
  };

  const handleResetFilters = () => {
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedMP('');
    setSelectedSector('');
    setFilteredQueue(null);
  };

  const availableStates = ['Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Gujarat', 'Delhi', 'Tamil Nadu', 'Telangana', 'Rajasthan', 'Bihar', 'West Bengal'];

  const displayedDistricts = selectedState
    ? MP_CONSTITUENCY_DATA.filter((x) => x.state === selectedState).map((x) => x.district)
    : (availableDistricts.length > 0 ? availableDistricts : MP_CONSTITUENCY_DATA.map((x) => x.district));

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getDashboardSummary();
        setSummary(res);
        try {
          const pRes = await api.getProjects({ district: 'Pune', size: 10, sortBy: 'riskScore', sortDirection: 'desc' });
          if (pRes && pRes.content && pRes.content.length > 0) {
            setConstituencyWorks(pRes.content);
          }
        } catch (errProjects) {
          console.warn('Could not fetch constituency works live:', errProjects);
        }
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

  // Display constituency works live from database if available, else fallback
  const displayWorks = constituencyWorks.length > 0 ? constituencyWorks : [
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
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-[11px] font-mono text-slate-600 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>National Telemetry Synchronized</span>
          </div>
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
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-700 font-medium">
                <Tooltip title="SANCTIONED ALLOCATION" content="Approved by District Magistrate after technical feasibility appraisal." position="top">
                  <span className="cursor-help flex items-center gap-1">
                    Sanctioned Allocation: <b>₹3.80 Cr (76.0%)</b>
                  </span>
                </Tooltip>
                <Tooltip title="DISBURSED ON SITE" content="Released in tranches against verified Measurement Book milestone entries." position="top">
                  <span className="text-slate-500 font-mono cursor-help">Disbursed on Site: ₹2.95 Cr (59.0%)</span>
                </Tooltip>
              </div>

              <Tooltip title="ANNUAL QUOTA BREAKDOWN" content="Rule 2.1: ₹5.00 Cr annual entitlement under MPLADS scheme guidelines." position="top" className="w-full">
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex cursor-help shadow-inner border border-slate-200">
                  <div style={{ width: '59%' }} className="bg-emerald-600 h-full transition-all" title="Disbursed: ₹2.95 Cr" />
                  <div style={{ width: '17%' }} className="bg-blue-600 h-full transition-all" title="Sanctioned Balance: ₹0.85 Cr" />
                  <div style={{ width: '10%' }} className="bg-amber-500 h-full transition-all" title="Recommended: ₹0.50 Cr" />
                </div>
              </Tooltip>

              <div className="flex justify-between text-[11px] text-slate-400 pt-0.5 font-mono">
                <Tooltip title="DISBURSED" content="Actual funds transferred to Implementing Agencies.">
                  <span className="cursor-help hover:text-slate-700">₹2.95 Cr Disbursed</span>
                </Tooltip>
                <Tooltip title="SANCTIONED" content="Formally sanctioned by District Collector.">
                  <span className="cursor-help hover:text-slate-700">₹3.80 Cr Sanctioned</span>
                </Tooltip>
                <Tooltip title="RECOMMENDED" content="Projects recommended by Hon'ble MP awaiting scrutiny.">
                  <span className="cursor-help hover:text-slate-700">₹4.30 Cr Recommended</span>
                </Tooltip>
                <Tooltip title="ANNUAL QUOTA" content="Maximum annual entitlement under MoSPI guidelines.">
                  <span className="cursor-help hover:text-slate-700">₹5.00 Cr Quota</span>
                </Tooltip>
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

          {/* MP Layer Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2.5">
            <button
              onClick={() => setMpActiveLayer('WORKS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                mpActiveLayer === 'WORKS'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Assigned Constituency Works</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                mpActiveLayer === 'WORKS' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-700'
              }`}>
                {displayWorks.length}
              </span>
            </button>

            <button
              onClick={() => setMpActiveLayer('ASSETS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                mpActiveLayer === 'ASSETS'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Durable Assets & Compliance Radar</span>
            </button>

            <button
              onClick={() => setMpActiveLayer('GIS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                mpActiveLayer === 'GIS'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Constituency GIS Proximity Scanner</span>
            </button>
          </div>

          {/* Layer 1: MP Assigned Works & Execution Progress Tracker */}
          {mpActiveLayer === 'WORKS' && (
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
                  {displayWorks.length} Active Portfolio Works
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
                    {displayWorks.map((work) => (
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
                              className="px-2.5 py-1 text-xs font-semibold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors cursor-pointer"
                            >
                              Inspect
                            </button>
                            <button
                              onClick={() => navigate(`/reports/${work.projectId}`)}
                              title="Generate Official Dossier"
                              className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" />
                              <span>Dossier</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Layer 2: Civic Amenities Asset Creation Tracker & Early Warning Radar */}
          {mpActiveLayer === 'ASSETS' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AssetCreationTracker />
              <EarlyWarningComplianceRadar />
            </div>
          )}

          {/* Layer 3: GIS Map of MP's Constituency Works */}
          {mpActiveLayer === 'GIS' && (
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
              role="MP"
            />
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* NON-MP STAKEHOLDER VIEWS (Ministry, State Nodal Authority, District)       */}
      {/* ========================================================================= */}
      {!isMP && (
        <div className="space-y-6">
          {/* Executive Area & Parliamentary Scrutiny Filter Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
                  <Filter className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Executive Scope & Area Scrutiny Filter
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Filter dashboard telemetry, anomaly signals, and priority queue by State, Area/Constituency, Hon'ble MP, or Sector
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {(selectedState || selectedDistrict || selectedMP || selectedSector) && (
                  <button
                    onClick={handleResetFilters}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (selectedDistrict) params.set('district', selectedDistrict);
                    if (selectedSector) params.set('projectType', selectedSector);
                    navigate(`/projects?${params.toString()}`);
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>View in Project Registry</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Filter Select Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* State Filter */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  State / Territory
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:border-slate-800 font-medium"
                >
                  <option value="">All States (National)</option>
                  {availableStates.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Area / Constituency Filter */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Area / Constituency / District
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:border-slate-800 font-medium"
                >
                  <option value="">All Areas & Constituencies</option>
                  {displayedDistricts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Hon'ble MP Filter */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Hon'ble Member of Parliament
                </label>
                <select
                  value={selectedMP}
                  onChange={(e) => handleMPChange(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:border-slate-800 font-medium"
                >
                  <option value="">All Hon'ble MPs</option>
                  {MP_CONSTITUENCY_DATA.map((item) => (
                    <option key={item.mp} value={item.mp}>
                      {item.mp} ({item.constituency})
                    </option>
                  ))}
                </select>
              </div>

              {/* Development Sector Filter */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Development Sector
                </label>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:border-slate-800 font-medium"
                >
                  <option value="">All Development Sectors</option>
                  <option value="Community Infrastructure">Community Infrastructure</option>
                  <option value="Roads & Pathways">Roads & Pathways</option>
                  <option value="Drinking Water">Drinking Water</option>
                  <option value="Health & Sanitation">Health & Sanitation</option>
                  <option value="Education">Education</option>
                  <option value="Irrigation">Irrigation</option>
                </select>
              </div>
            </div>

            {/* Active Scope Tag Pill */}
            {(selectedState || selectedDistrict || selectedMP || selectedSector) && (
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 pt-1">
                <span className="font-semibold text-slate-700">Active Scope:</span>
                <span className="font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                  {[selectedState, selectedDistrict, selectedMP, selectedSector].filter(Boolean).join(' • ')}
                </span>
                {filtering && <span className="text-amber-600 animate-pulse text-[10px] font-mono">Filtering live database queue...</span>}
              </div>
            )}
          </div>

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

          {/* Executive Layer Selector Navigation */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2.5">
            <button
              onClick={() => setActiveLayer('QUEUE')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeLayer === 'QUEUE'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Priority Scrutiny Queue</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                activeLayer === 'QUEUE' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-700'
              }`}>
                {(filteredQueue !== null ? filteredQueue : (s.priorityQueue || [])).length}
              </span>
            </button>

            <button
              onClick={() => setActiveLayer('GIS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeLayer === 'GIS'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Geospatial Risk Surveillance</span>
            </button>

            <button
              onClick={() => setActiveLayer('ANALYTICS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeLayer === 'ANALYTICS'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Statistical Telemetry & Trends</span>
            </button>

            <button
              onClick={() => setActiveLayer('COMPLIANCE')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeLayer === 'COMPLIANCE'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Durable Assets & Compliance Radar</span>
            </button>
          </div>

          {/* Layer 1: Priority Scrutiny Queue (Main List) */}
          {activeLayer === 'QUEUE' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Executive Priority Scrutiny Queue
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-red-50 text-red-700 font-bold rounded border border-red-200">
                      High-Risk Verification
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {filteredQueue !== null
                      ? `Displaying ${filteredQueue.length} prioritized cases matching active area/sector filter`
                      : 'National priority cases requiring immediate administrative review and on-site audit'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const params = new URLSearchParams();
                      if (selectedDistrict) params.set('district', selectedDistrict);
                      if (selectedSector) params.set('projectType', selectedSector);
                      navigate(`/projects?${params.toString()}`);
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Open Full Registry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                    <tr>
                      <th className="px-4 py-3">Rank & Work ID</th>
                      <th className="px-4 py-3">Project Title & Sector</th>
                      <th className="px-4 py-3">District / State</th>
                      <th className="px-4 py-3">Financials (Sanctioned)</th>
                      <th className="px-4 py-3">Physical Progress</th>
                      <th className="px-4 py-3">Risk Tier</th>
                      <th className="px-4 py-3">Anomaly Trigger</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(filteredQueue !== null ? filteredQueue : (s.priorityQueue || [])).length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-4 py-12 text-center text-slate-400">
                          No critical cases matching the active filter criteria.
                        </td>
                      </tr>
                    ) : (
                      (filteredQueue !== null ? filteredQueue : (s.priorityQueue || [])).map((item, index) => (
                        <tr
                          key={item.projectId}
                          className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                          onClick={() => navigate(`/projects/${item.projectId}`)}
                        >
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-[10px] flex items-center justify-center border border-slate-200">
                                {index + 1}
                              </span>
                              <span className="font-mono font-bold text-slate-900">{item.projectId}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 max-w-xs">
                            <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                              {item.projectName}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{item.projectType || 'Community Infrastructure'}</div>
                          </td>
                          <td className="px-4 py-3.5 text-slate-600">
                            <div className="font-medium text-slate-800">{item.district}</div>
                            <div className="text-[10px] text-slate-400">{item.state || 'National'}</div>
                          </td>
                          <td className="px-4 py-3.5 font-mono">
                            <div className="font-semibold text-slate-900">
                              ₹{((item.sanctionedAmount || 2500000) / 100000).toFixed(1)} Lakhs
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Disbursed: ₹{((item.expenditureAmount || 1800000) / 100000).toFixed(1)}L
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-slate-700 h-1.5 rounded-full"
                                  style={{ width: `${item.progressPercentage || 40}%` }}
                                />
                              </div>
                              <span className="font-mono text-[11px] font-semibold">{item.progressPercentage || 40}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <RiskBadge level={item.riskLevel} score={item.riskScore} />
                          </td>
                          <td className="px-4 py-3.5 max-w-xs">
                            <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.8 rounded border border-amber-200 block truncate">
                              {item.primaryFlag || 'Multi-model milestone & budget discrepancy'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => navigate(`/projects/${item.projectId}`)}
                                className="px-2.5 py-1 text-xs font-semibold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors cursor-pointer"
                              >
                                Inspect
                              </button>
                              <button
                                onClick={() => navigate(`/reports/${item.projectId}`)}
                                title="Generate Official Dossier"
                                className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <FileText className="w-3 h-3" />
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
            </div>
          )}

          {/* Layer 2: Geospatial Risk Surveillance */}
          {activeLayer === 'GIS' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">National Geospatial Surveillance Layer</h3>
                  <p className="text-xs text-slate-500">Live geographic clustering and proximity overlap surveillance</p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                  Interactive GIS Grid
                </span>
              </div>
              <GISMap role={user.roleId || 'MINISTRY'} />
            </div>
          )}

          {/* Layer 3: Statistical Telemetry & Trends */}
          {activeLayer === 'ANALYTICS' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RiskDistributionChart distribution={s.riskDistribution} />
                <ProjectStatusChart distribution={s.statusDistribution} />
              </div>
              <RiskTrendChart trends={s.monthlyRiskTrend} />
            </div>
          )}

          {/* Layer 4: Durable Asset Creation & Compliance Radar */}
          {activeLayer === 'COMPLIANCE' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AssetCreationTracker />
              <EarlyWarningComplianceRadar />
            </div>
          )}
        </div>
      )}
    </div>
  );
}