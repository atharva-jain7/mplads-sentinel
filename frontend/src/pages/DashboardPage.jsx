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
        const queryParams = {};
        if (isMP || isDistrict) {
          queryParams.district = 'Pune';
        } else if (isState) {
          queryParams.state = 'Maharashtra';
        } else if (selectedDistrict) {
          queryParams.district = selectedDistrict;
        } else if (selectedState) {
          queryParams.state = selectedState;
        }

        const res = await api.getDashboardSummary(queryParams);
        setSummary(res);
        try {
          const pRes = await api.getProjects({
            district: queryParams.district || 'Pune',
            size: 15,
            sortBy: 'riskScore',
            sortDirection: 'desc'
          });
          if (pRes && pRes.content && pRes.content.length > 0) {
            setConstituencyWorks(pRes.content);
          }
        } catch (errProjects) {
          console.warn('Could not fetch constituency works live:', errProjects);
        }
      } catch (err) {
        console.warn('Dashboard summary fetch failed, using jurisdiction fallback:', err);
        const isPuneScope = isMP || isDistrict || selectedDistrict === 'Pune';
        setSummary({
          totalProjects: isPuneScope ? 97 : (isState ? 248 : 1250),
          criticalRisk: isPuneScope ? 4 : (isState ? 12 : 47),
          highRisk: isPuneScope ? 18 : (isState ? 54 : 186),
          delayed: isPuneScope ? 22 : (isState ? 68 : 312),
          costAnomalies: isPuneScope ? 11 : (isState ? 35 : 142),
          potentialDuplicates: isPuneScope ? 3 : (isState ? 9 : 34),
          repeatedFunding: isPuneScope ? 2 : (isState ? 8 : 28),
          rupeesAtRisk: isPuneScope ? 7800000.0 : (isState ? 19800000.0 : 42800000.0),
          jurisdictionLabel: isPuneScope ? "Pune District Administration" : (isState ? "Maharashtra State Level" : "National Central Oversight"),
          datasetType: "Prototype Demonstration Dataset",
          dataQuality: {
            overallScore: 96.2,
            financialCompleteness: 98.4,
            progressCompleteness: 95.8,
            gpsCompleteness: 97.1,
            completionCompleteness: 93.5,
            recordsAnalyzed: isPuneScope ? 97 : (isState ? 248 : 1250),
            lastUpdated: new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString('en-IN')
          },
          riskDistribution: isPuneScope ? { low: 62, medium: 13, high: 18, critical: 4 } : { low: 850, medium: 167, high: 186, critical: 47 },
          statusDistribution: isPuneScope 
            ? { RECOMMENDED: 6, SANCTIONED: 12, IN_PROGRESS: 48, DELAYED: 18, OVERDUE: 4, COMPLETED: 9 }
            : { RECOMMENDED: 75, SANCTIONED: 145, IN_PROGRESS: 620, DELAYED: 210, OVERDUE: 60, COMPLETED: 140 },
          monthlyRiskTrend: [
            { month: 'Sep', critical: 2, high: 12 },
            { month: 'Oct', critical: 3, high: 15 },
            { month: 'Nov', critical: 2, high: 14 },
            { month: 'Dec', critical: 4, high: 18 },
            { month: 'Jan', critical: 3, high: 16 },
            { month: 'Feb', critical: 4, high: 18 }
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
              district: 'Pune',
              riskScore: 91,
              riskLevel: 'HIGH',
              primaryFlag: '20% budget overrun & 180 days delay'
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedDistrict, selectedState, user.roleId]);

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
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Data Analysis Current • {s.dataQuality?.lastUpdated ? `Updated ${s.dataQuality.lastUpdated.split(' ')[1] || s.dataQuality.lastUpdated}` : 'Live'}</span>
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

          {/* WHAT NEEDS MY ATTENTION? (Requirement 10) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                <h3 className="text-sm font-bold text-slate-900">What Needs My Attention?</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-red-50 text-red-700 rounded border border-red-200">
                  ACTION REQUIRED
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {displayWorks.filter(w => (w.delayDays > 0 || w.riskScore >= 60)).length} Priority Cases Flagged in Pune
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {displayWorks.filter(w => (w.delayDays > 0 || w.riskScore >= 60)).slice(0, 4).map((work) => (
                <div key={work.projectId} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-2.5">
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs pb-1 border-b border-slate-200/60">
                      <span className="font-bold text-slate-900">{work.projectId}</span>
                      <RiskBadge level={work.riskLevel} score={work.riskScore} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-2 line-clamp-1">{work.projectName}</h4>
                    <p className="text-[11px] text-red-700 mt-1 font-medium leading-tight">
                      Reason: {work.attention || (work.delayDays > 0 ? `${work.delayDays} days delayed past sanctioned deadline.` : 'Progress and financial disbursement variance.')}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1 text-[11px] font-mono border-t border-slate-200/60">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Amount:</span>
                      <span className="font-bold text-slate-900">₹{(work.sanctionedAmount || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Progress:</span>
                      <span className="font-bold text-slate-900">{work.progressPercentage || 0}% / {work.expectedProgressPercentage || 80}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Delay:</span>
                      <span className="font-bold text-red-700">{work.delayDays || 0} Days</span>
                    </div>

                    <button
                      onClick={() => navigate(`/investigation/${work.projectId}`)}
                      className="w-full mt-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
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
              <button
                onClick={() => navigate('/projects')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View All Constituency Works</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="px-4 py-2.5">Work ID</th>
                    <th className="px-4 py-2.5">Project Title & Sector</th>
                    <th className="px-4 py-2.5">Sanctioned (₹)</th>
                    <th className="px-4 py-2.5">Disbursed (₹)</th>
                    <th className="px-4 py-2.5">Physical Progress</th>
                    <th className="px-4 py-2.5">Timeline Status</th>
                    <th className="px-4 py-2.5">Risk Tier</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayWorks.slice(0, 5).map((work) => (
                    <tr key={work.projectId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-2.5 font-mono font-semibold text-slate-900">{work.projectId}</td>
                      <td className="px-4 py-2.5 max-w-xs">
                        <div className="font-medium text-slate-900">{work.projectName}</div>
                        <div className="text-[11px] text-slate-400">{work.sector}</div>
                      </td>
                      <td className="px-4 py-2.5 font-mono font-medium">₹{work.sanctionedAmount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-600">₹{work.expenditureAmount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-14 bg-slate-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${work.progressPercentage < 50 && work.delayDays > 0 ? 'bg-rose-500' : 'bg-slate-700'}`}
                              style={{ width: `${work.progressPercentage}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] font-semibold">{work.progressPercentage}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        {work.delayDays > 0 ? (
                          <span className="text-rose-700 font-mono font-semibold">{work.delayDays}d Delay</span>
                        ) : (
                          <span className="text-emerald-700 font-medium">On Schedule</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <RiskBadge level={work.riskLevel} score={work.riskScore} />
                      </td>
                      <td className="px-4 py-2.5 text-right">
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
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
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

          {/* Civic Amenities Asset Creation Tracker & Early Warning Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AssetCreationTracker />
            <EarlyWarningComplianceRadar />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NON-MP STAKEHOLDER VIEWS (Ministry, State Nodal Authority, District)       */}
      {/* ========================================================================= */}
      {!isMP && (
        <div className="space-y-6">
          {/* Top 6 KPI Cards (Above the fold - Section 6 & 7) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <KPICard
              title={isMinistry ? "Total Works" : isState ? "State Works" : "District Works"}
              value={s.totalProjects || (isDistrict ? 97 : isState ? 248 : 1250)}
              subtitle={isMinistry ? "PAN-India registry" : isState ? "Maharashtra portfolio" : "Pune District"}
            />
            
            <KPICard
              title="₹ at Risk"
              value={`₹${(((s.rupeesAtRisk || (isDistrict ? 7800000 : isState ? 19800000 : 42800000))) / 10000000).toFixed(2)} Cr`}
              subtitle="High/critical exposure"
            />

            <KPICard
              title="Critical Cases"
              value={s.criticalRisk || (isDistrict ? 4 : isState ? 12 : 47)}
              subtitle="+8 flagged this month"
            />
            
            <KPICard
              title="High Attention"
              value={s.highRisk || (isDistrict ? 18 : isState ? 54 : 186)}
              subtitle="Schedule & cost lag"
            />
            
            <KPICard
              title="Extended Delays"
              value={s.delayed || (isDistrict ? 22 : isState ? 68 : 312)}
              subtitle=">90 days overdue"
            />
            
            <KPICard
              title="Potential Duplicates"
              value={s.potentialDuplicates || (isDistrict ? 3 : isState ? 9 : 34)}
              subtitle="GIS proximity overlaps"
            />
          </div>

          {/* Compact Horizontal Filter Toolbar (Section 8) */}
          <div className="bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mr-1">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Filters:</span>
              </span>

              {isMinistry && (
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="p-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 font-medium"
                >
                  <option value="">All States (National)</option>
                  {availableStates.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              )}

              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="p-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 font-medium"
              >
                <option value="">{isDistrict ? 'Pune District (Locked)' : 'All Districts / Areas'}</option>
                {displayedDistricts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="p-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 font-medium"
              >
                <option value="">All Sectors</option>
                <option value="Community Infrastructure">Community Infrastructure</option>
                <option value="Roads & Pathways">Roads & Pathways</option>
                <option value="Drinking Water">Drinking Water</option>
                <option value="Health & Sanitation">Health & Sanitation</option>
                <option value="Education">Education</option>
                <option value="Irrigation">Irrigation</option>
              </select>

              {(selectedState || selectedDistrict || selectedMP || selectedSector) && (
                <button
                  onClick={handleResetFilters}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-xs font-medium cursor-pointer transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-mono">
                Showing <b>{(filteredQueue !== null ? filteredQueue : (s.priorityQueue || [])).length}</b> of <b>{s.totalProjects || (isDistrict ? 97 : isState ? 248 : 1250)}</b> works
              </span>
              <button
                onClick={() => {
                  const params = new URLSearchParams();
                  if (selectedDistrict) params.set('district', selectedDistrict);
                  if (selectedSector) params.set('projectType', selectedSector);
                  navigate(`/projects?${params.toString()}`);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-slate-200"
              >
                <span>Registry</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Priority Scrutiny Queue (Top 5 Priority Cases Preview) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    {isDistrict ? "Field Verification Queue (Pune District)" : "Executive Priority Review Queue"}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-red-50 text-red-700 font-bold rounded border border-red-200">
                    Top 5 {isDistrict ? "Operational Action Cases" : "Risk Prioritized Cases"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isDistrict 
                    ? 'High-urgency works requiring immediate field verification, measurement book auditing, and contractor inspection'
                    : (filteredQueue !== null
                      ? `Displaying top 5 of ${filteredQueue.length} prioritized cases matching active filter criteria`
                      : 'Highest risk works requiring administrative scrutiny, proactive intervention and executive review')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (selectedDistrict) params.set('district', selectedDistrict);
                    if (selectedSector) params.set('projectType', selectedSector);
                    navigate(`/priority-cases${params.toString() ? `?${params.toString()}` : ''}`);
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <span>View Full Priority Queue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (selectedDistrict) params.set('district', selectedDistrict);
                    if (selectedSector) params.set('projectType', selectedSector);
                    navigate(`/projects${params.toString() ? `?${params.toString()}` : ''}`);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                >
                  <span>Registry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="px-4 py-2.5">Priority</th>
                    <th className="px-4 py-2.5">Project</th>
                    <th className="px-4 py-2.5">Location</th>
                    <th className="px-4 py-2.5">Amount</th>
                    <th className="px-4 py-2.5">Progress</th>
                    <th className="px-4 py-2.5">Delay</th>
                    <th className="px-4 py-2.5">Risk</th>
                    <th className="px-4 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(filteredQueue !== null ? filteredQueue : (s.priorityQueue || [])).length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-4 py-10 text-center text-slate-400">
                        No critical cases matching the active filter criteria.
                      </td>
                    </tr>
                  ) : (
                    (filteredQueue !== null ? filteredQueue : (s.priorityQueue || [])).slice(0, 5).map((item, index) => {
                      const pNumber = index + 1;
                      const pLabel = pNumber < 10 ? `P0${pNumber}` : `P${pNumber}`;
                      return (
                        <tr
                          key={item.projectId}
                          className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                          onClick={() => navigate(`/investigation/${item.projectId}`)}
                        >
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white font-mono font-bold text-[10px]">
                                {pLabel}
                              </span>
                              <span className="font-mono text-xs text-slate-500">{item.projectId}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 max-w-xs">
                            <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                              {item.projectName}
                            </div>
                            <div className="text-[11px] text-slate-400">{item.projectType || item.sector || 'Infrastructure'}</div>
                          </td>
                          <td className="px-4 py-2.5 text-slate-600 text-xs">
                            <div className="font-medium text-slate-800">{item.district || 'Pune'}</div>
                            <div className="text-[10px] text-slate-400">{item.state || 'Maharashtra'}</div>
                          </td>
                          <td className="px-4 py-2.5 font-mono text-xs">
                            <div className="font-semibold text-slate-900">
                              ₹{((item.sanctionedAmount || 2500000) / 100000).toFixed(1)} L
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Disbursed: ₹{((item.expenditureAmount || 1800000) / 100000).toFixed(1)} L
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-14 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-slate-700 h-1.5 rounded-full"
                                  style={{ width: `${item.progressPercentage || 40}%` }}
                                />
                              </div>
                              <span className="font-mono text-[11px] font-semibold">{item.progressPercentage || 40}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-xs">
                            {(item.delayDays && item.delayDays > 0) ? (
                              <span className="text-rose-700 font-mono font-semibold">{item.delayDays}d Delay</span>
                            ) : (
                              <span className="text-slate-500 font-medium">On Schedule</span>
                            )}
                          </td>
                          <td className="px-4 py-2.5">
                            <RiskBadge level={item.riskLevel} score={item.riskScore} />
                          </td>
                          <td className="px-4 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => navigate(`/investigation/${item.projectId}`)}
                                className="px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                              >
                                {isDistrict ? 'Inspect' : 'Investigate'}
                              </button>
                              <button
                                onClick={() => navigate(`/reports/${item.projectId}`)}
                                title="AI-Generated Review Report"
                                className="px-2 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <FileText className="w-3 h-3" />
                                <span>Report</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer: Summary & Link to full queue */}
            <div className="p-3 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 px-4 gap-2">
              <span className="font-mono text-[11px]">
                Showing top {Math.min(5, (filteredQueue !== null ? filteredQueue : (s.priorityQueue || [])).length)} of {(filteredQueue !== null ? filteredQueue : (s.priorityQueue || [])).length} prioritized cases
              </span>
              <button
                onClick={() => {
                  const params = new URLSearchParams();
                  if (selectedDistrict) params.set('district', selectedDistrict);
                  if (selectedSector) params.set('projectType', selectedSector);
                  navigate(`/priority-cases${params.toString() ? `?${params.toString()}` : ''}`);
                }}
                className="font-semibold text-slate-900 hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Open full queue with anomaly & duplicate indicators</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Implementing Agency Performance Card (Requirement 11 for District) */}
          {isDistrict && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Implementing Agency Performance Scrutiny (Pune District)</h4>
                  <p className="text-xs text-slate-500">Cross-agency execution velocity, delayed work ratios & measurement book auditing</p>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                  3 Registered Agencies
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 font-mono text-xs">
                  <div className="font-bold text-slate-900 font-sans text-xs">Public Works Department (PWD)</div>
                  <div className="flex justify-between text-[11px] text-slate-600"><span>Assigned Works:</span><b>42</b></div>
                  <div className="flex justify-between text-[11px] text-slate-600"><span>Avg Delay:</span><b className="text-red-700">48 Days</b></div>
                  <div className="flex justify-between text-[11px] text-slate-600"><span>Cost Overrun Rate:</span><b className="text-orange-700">14.2%</b></div>
                  <div className="pt-1 text-[10px] text-amber-800 font-sans font-medium">Field inspection scheduled</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 font-mono text-xs">
                  <div className="font-bold text-slate-900 font-sans text-xs">Zilla Parishad Construction Wing</div>
                  <div className="flex justify-between text-[11px] text-slate-600"><span>Assigned Works:</span><b>35</b></div>
                  <div className="flex justify-between text-[11px] text-slate-600"><span>Avg Delay:</span><b className="text-red-700">31 Days</b></div>
                  <div className="flex justify-between text-[11px] text-slate-600"><span>Cost Overrun Rate:</span><b className="text-emerald-700">6.8%</b></div>
                  <div className="pt-1 text-[10px] text-emerald-800 font-sans font-medium">MB entries up to date</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 font-mono text-xs">
                  <div className="font-bold text-slate-900 font-sans text-xs">State Water Supply Board</div>
                  <div className="flex justify-between text-[11px] text-slate-600"><span>Assigned Works:</span><b>20</b></div>
                  <div className="flex justify-between text-[11px] text-slate-600"><span>Avg Delay:</span><b className="text-emerald-700">12 Days</b></div>
                  <div className="flex justify-between text-[11px] text-slate-600"><span>Cost Overrun Rate:</span><b className="text-emerald-700">2.1%</b></div>
                  <div className="pt-1 text-[10px] text-blue-800 font-sans font-medium">Compliance verified</div>
                </div>
              </div>
            </div>
          )}

          {/* 2-Column Previews: GIS Surveillance & Risk Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Geospatial Risk Surveillance Preview */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Geospatial Risk Surveillance</h4>
                  <p className="text-xs text-slate-500">Live geographic clustering and proximity overlap surveillance</p>
                </div>
                <button
                  onClick={() => navigate('/gis')}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-800 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Open Full GIS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-200">
                <GISMap role={user.roleId || 'MINISTRY'} height="330px" />
              </div>
            </div>

            {/* Right: Risk Trends & Analytics Preview */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Risk Trends & Analytics</h4>
                  <p className="text-xs text-slate-500">Monthly anomaly telemetry and multi-sector risk drift</p>
                </div>
                <button
                  onClick={() => navigate('/analytics')}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-800 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Open Full Analytics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-3">
                <RiskTrendChart trends={s.monthlyRiskTrend} />
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                    <div className="text-slate-500 text-[11px] font-medium">Critical Risk Works</div>
                    <div className="text-lg font-bold font-mono text-red-700 mt-0.5">{s.criticalRiskProjects ?? 0}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Composite Score &ge; 80</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                    <div className="text-slate-500 text-[11px] font-medium">High Attention Works</div>
                    <div className="text-lg font-bold font-mono text-orange-600 mt-0.5">{s.highRiskProjects ?? 0}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Composite Score 60-79</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Durable Asset Creation & Compliance Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AssetCreationTracker />
            <EarlyWarningComplianceRadar />
          </div>
        </div>
      )}
    </div>
  );
}