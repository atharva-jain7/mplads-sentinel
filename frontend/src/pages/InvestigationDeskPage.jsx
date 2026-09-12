import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FileSearch, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  ArrowRight, 
  ArrowLeft, 
  Building, 
  User, 
  Plus, 
  Send, 
  History, 
  Calendar, 
  Filter, 
  Search, 
  FileText, 
  Check, 
  ExternalLink,
  ChevronRight,
  ClipboardList,
  MapPin,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { authService } from '../services/auth';
import RiskBadge from '../components/RiskBadge';
import StatusBadge from '../components/StatusBadge';

const LIFECYCLE_STAGES = [
  { id: 'DETECTED', label: '1. Detected', short: 'Detected' },
  { id: 'UNDER_REVIEW', label: '2. Under Review', short: 'Review' },
  { id: 'DOCS_REQUESTED', label: '3. Docs Requested', short: 'Docs' },
  { id: 'FIELD_INSPECTION', label: '4. Field Inspection', short: 'Inspection' },
  { id: 'FINDING_RECORDED', label: '5. Finding Recorded', short: 'Finding' },
  { id: 'CORRECTIVE_ACTION', label: '6. Corrective Action', short: 'Corrective' },
  { id: 'RESOLVED', label: '7. Resolved', short: 'Resolved' }
];

const DEFAULT_CASES = [
  {
    projectId: 'MPL-10482',
    projectName: 'Construction of Community Infrastructure',
    sector: 'Community Infrastructure',
    district: 'Pune',
    state: 'Maharashtra',
    sanctionedAmount: 3000000.0,
    expenditureAmount: 2600000.0,
    progressPercentage: 38.0,
    expectedProgressPercentage: 80.0,
    delayDays: 137,
    status: 'DELAYED',
    riskLevel: 'CRITICAL',
    riskScore: 94,
    stage: 'UNDER_REVIEW',
    assignedOfficer: 'Rajesh Sharma, IAS (District Magistrate)',
    enlistReason: 'Critical progress-expenditure gap (38% physical work completed vs 86.7% funds disbursed) and 137 days schedule delay.',
    auditTrail: [
      {
        officer: 'System Algorithmic Screener',
        action: 'Risk Detected & Flagged',
        timestamp: '2026-08-15 11:20:00',
        comment: 'Multi-signal anomaly fusion identified milestone lag and progress-spend gap.',
        stage: 'DETECTED'
      },
      {
        officer: 'Rajesh Sharma, IAS',
        action: 'Under Administrative Review',
        timestamp: '2026-08-20 14:45:00',
        comment: 'Opened formal investigation file. Sanctioned MB measurement logs requested from Implementing Agency.',
        stage: 'UNDER_REVIEW'
      }
    ]
  },
  {
    projectId: 'MPL-10495',
    projectName: 'Primary Health Sub-Centre Building',
    sector: 'Health & Sanitation',
    district: 'Pune',
    state: 'Maharashtra',
    sanctionedAmount: 2500000.0,
    expenditureAmount: 2250000.0,
    progressPercentage: 42.0,
    expectedProgressPercentage: 85.0,
    delayDays: 104,
    status: 'DELAYED',
    riskLevel: 'CRITICAL',
    riskScore: 88,
    stage: 'FIELD_INSPECTION',
    assignedOfficer: 'Dr. Ananya Deshmukh (Addl. Collector, Pune)',
    enlistReason: 'Physical progress stall reported at plinth stage despite 90% fund disbursement. Contractor non-responsive to engineering notice.',
    auditTrail: [
      {
        officer: 'System Algorithmic Screener',
        action: 'Risk Detected & Flagged',
        timestamp: '2026-08-18 09:30:00',
        comment: 'Flagged for severe milestone variance and high risk score (88).',
        stage: 'DETECTED'
      },
      {
        officer: 'Dr. Ananya Deshmukh',
        action: 'Under Administrative Review',
        timestamp: '2026-08-24 11:15:00',
        comment: 'Case registered. Discrepancy observed in 2nd tranche MB record.',
        stage: 'UNDER_REVIEW'
      },
      {
        officer: 'Dr. Ananya Deshmukh',
        action: 'Field Inspection Scheduled',
        timestamp: '2026-09-02 16:00:00',
        comment: 'Site inspection squad notified. Physical inspection fixed for 14-Sept-2026.',
        stage: 'FIELD_INSPECTION'
      }
    ]
  },
  {
    projectId: 'MPL-10512',
    projectName: 'Village Connectivity Blacktop Road',
    sector: 'Roads & Pathways',
    district: 'Pune',
    state: 'Maharashtra',
    sanctionedAmount: 3500000.0,
    expenditureAmount: 3100000.0,
    progressPercentage: 50.0,
    expectedProgressPercentage: 90.0,
    delayDays: 85,
    status: 'DELAYED',
    riskLevel: 'CRITICAL',
    riskScore: 82,
    stage: 'DOCS_REQUESTED',
    assignedOfficer: 'Vikram Patil (Executive Engineer, Vigilance)',
    enlistReason: 'Proximity alert: identical road stretch sanctioned under PMGSY within 350 meters. Potential duplicate funding query.',
    auditTrail: [
      {
        officer: 'System Algorithmic Screener',
        action: 'Spatial Overlap Detected',
        timestamp: '2026-08-22 14:00:00',
        comment: 'Haversine proximity check identified potential spatial duplication within 350m.',
        stage: 'DETECTED'
      },
      {
        officer: 'Vikram Patil',
        action: 'Documents Requested',
        timestamp: '2026-08-29 10:30:00',
        comment: 'Demanded geo-tagged coordinates and GIS demarcation from Rural Roads Wing.',
        stage: 'DOCS_REQUESTED'
      }
    ]
  },
  {
    projectId: 'MPL-9812',
    projectName: 'Community Hall Renovation Work',
    sector: 'Community Infrastructure',
    district: 'Pune',
    state: 'Maharashtra',
    sanctionedAmount: 1500000.0,
    expenditureAmount: 1450000.0,
    progressPercentage: 100.0,
    expectedProgressPercentage: 100.0,
    delayDays: 0,
    status: 'COMPLETED',
    riskLevel: 'HIGH',
    riskScore: 62,
    stage: 'RESOLVED',
    assignedOfficer: 'Rajesh Sharma, IAS (District Magistrate)',
    enlistReason: 'Proximity overlap with adjacent Anganwadi project cleared after site verification.',
    auditTrail: [
      {
        officer: 'System Algorithmic Screener',
        action: 'Proximity Warning',
        timestamp: '2026-08-10 10:00:00',
        comment: 'Adjacent community infrastructure detected within 500m radius.',
        stage: 'DETECTED'
      },
      {
        officer: 'Field Officer',
        action: 'Physical Verification Conducted',
        timestamp: '2026-08-14 15:20:00',
        comment: 'On-site GPS survey verified distinct land parcels and non-overlapping asset structures.',
        stage: 'FIELD_INSPECTION'
      },
      {
        officer: 'Rajesh Sharma, IAS',
        action: 'Case Marked Resolved',
        timestamp: '2026-08-28 17:00:00',
        comment: 'Satisfactory verification report submitted. Geo-tagged completion certificate archived. Risk de-escalated.',
        stage: 'RESOLVED'
      }
    ]
  }
];

const STORAGE_KEY = 'investigation_desk_cases';

export default function InvestigationDeskPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = authService.getUser() || { fullName: 'Rajesh Sharma, IAS', roleId: 'DISTRICT', jurisdiction: 'Pune' };
  
  const isMP = user.roleId === 'MP';

  // Load cases from localStorage or fallback to DEFAULT_CASES
  const [cases, setCases] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading investigation cases from localStorage:', e);
    }
    return DEFAULT_CASES;
  });

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'resolved' | 'all'
  const [searchTerm, setSearchTerm] = useState('');

  // Selected case
  const paramCaseId = searchParams.get('caseId');
  const [selectedCaseId, setSelectedCaseId] = useState(paramCaseId || cases[0]?.projectId);

  // Sync paramCaseId if changed from URL
  useEffect(() => {
    if (paramCaseId && cases.some(c => c.projectId === paramCaseId)) {
      setSelectedCaseId(paramCaseId);
    }
  }, [paramCaseId, cases]);

  // Persist cases on update
  const saveCases = (updated) => {
    setCases(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error saving to localStorage:', e);
    }
  };

  const selectedCase = cases.find(c => c.projectId === selectedCaseId) || cases[0];

  // Action modal state
  const [modalAction, setModalAction] = useState(null);
  const [actionComment, setActionComment] = useState('');

  // Strict role gate: MP role cannot access Investigation Desk
  if (isMP) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-amber-200 rounded-2xl shadow-sm text-center space-y-4 font-sans">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Enforcement Desk Restricted</h2>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            The <b>Investigation Desk</b> is an operational administrative workspace reserved for District, State, and Ministry authorities to record findings and enforce corrective measures.
          </p>
          <p className="text-xs text-slate-500 mt-2">
            As Hon'ble Member of Parliament, track your constituency allocations and early warnings via the Cockpit and My Works.
          </p>
        </div>
        <div className="flex gap-2 justify-center pt-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            View My Works
          </button>
        </div>
      </div>
    );
  }

  // Filter cases based on active tab and search
  const filteredCases = cases.filter(c => {
    const matchesSearch = !searchTerm || 
      c.projectId.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.sector?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'active') return c.stage !== 'RESOLVED';
    if (activeTab === 'resolved') return c.stage === 'RESOLVED';
    return true;
  });

  const activeCount = cases.filter(c => c.stage !== 'RESOLVED').length;
  const resolvedCount = cases.filter(c => c.stage === 'RESOLVED').length;
  const inspectionCount = cases.filter(c => c.stage === 'FIELD_INSPECTION').length;
  const correctiveCount = cases.filter(c => c.stage === 'CORRECTIVE_ACTION').length;

  const currentStageIndex = selectedCase 
    ? LIFECYCLE_STAGES.findIndex(s => s.id === selectedCase.stage)
    : 0;

  // Handle stage change or adding action
  const handleRecordAction = (actionName, targetStage) => {
    if (!actionComment.trim() || !selectedCase) return;

    const newLog = {
      officer: user.fullName || 'District Monitoring Officer',
      action: actionName,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      comment: actionComment.trim(),
      stage: targetStage || selectedCase.stage
    };

    const newStage = targetStage || selectedCase.stage;

    const updated = cases.map(c => {
      if (c.projectId === selectedCase.projectId) {
        return {
          ...c,
          stage: newStage,
          status: newStage === 'RESOLVED' ? 'COMPLETED' : c.status,
          riskLevel: newStage === 'RESOLVED' ? 'LOW' : c.riskLevel,
          auditTrail: [newLog, ...(c.auditTrail || [])]
        };
      }
      return c;
    });

    saveCases(updated);
    setModalAction(null);
    setActionComment('');
  };

  const handleStageClick = (targetStageId) => {
    if (!selectedCase || selectedCase.stage === targetStageId) return;
    const stageObj = LIFECYCLE_STAGES.find(s => s.id === targetStageId);
    setModalAction({
      label: `Update Status to ${stageObj?.short}`,
      stage: targetStageId
    });
  };

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-slate-900 text-white rounded-lg">
              <FileSearch className="w-5 h-5 text-amber-400" />
            </span>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              INVESTIGATION DESK
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-rose-50 text-rose-700 rounded border border-rose-200">
              OPERATIONAL ENFORCEMENT
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Operational case management, 7-stage lifecycle pipeline, and non-repudiable corrective action audit tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="text-slate-400 text-[11px] block uppercase font-mono">Logged Official</span>
            <span className="font-semibold text-slate-800">{user.fullName || 'Rajesh Sharma, IAS'}</span>
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Project Risk Priority</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Investigations</span>
            <AlertOctagon className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-700">{activeCount}</div>
          <span className="text-[11px] text-slate-500">Under scrutiny</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Field Inspections</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600">{inspectionCount}</div>
          <span className="text-[11px] text-slate-500">Scheduled on site</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Corrective Actions</span>
            <ShieldAlert className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-700">{correctiveCount}</div>
          <span className="text-[11px] text-slate-500">Notices issued</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Resolved Cases</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700">{resolvedCount}</div>
          <span className="text-[11px] text-slate-500">Closed & verified</span>
        </div>
      </div>

      {/* Main 2-Column Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Investigation Queue Selector (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Tabs */}
          <div className="bg-white p-1 rounded-xl border border-slate-200 flex text-xs font-semibold">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'resolved'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Resolved ({resolvedCount})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({cases.length})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search case ID, project or district..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:border-slate-800"
            />
          </div>

          {/* Cases List */}
          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {filteredCases.length === 0 ? (
              <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-xs text-slate-400">
                No cases found in this view.
              </div>
            ) : (
              filteredCases.map((c) => {
                const isSelected = selectedCase?.projectId === c.projectId;
                const stageObj = LIFECYCLE_STAGES.find(s => s.id === c.stage);
                return (
                  <div
                    key={c.projectId}
                    onClick={() => {
                      setSelectedCaseId(c.projectId);
                      setSearchParams({ caseId: c.projectId });
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`font-mono text-xs font-bold ${isSelected ? 'text-amber-400' : 'text-slate-800'}`}>
                        {c.projectId}
                      </span>
                      <RiskBadge level={c.riskLevel} score={c.riskScore} />
                    </div>

                    <div className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {c.projectName}
                    </div>

                    <div className={`text-[11px] mt-0.5 truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {c.district}, {c.state} • {c.sector}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/40 text-[11px]">
                      <span className={`px-2 py-0.5 rounded font-mono font-semibold text-[10px] ${
                        isSelected 
                          ? 'bg-slate-800 text-amber-300 border border-slate-700' 
                          : c.stage === 'RESOLVED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {stageObj?.short || c.stage}
                      </span>
                      <span className={`font-mono ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                        {c.delayDays > 0 ? `${c.delayDays}d lag` : 'On schedule'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Case Workspace (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedCase ? (
            <>
              {/* Selected Case Header Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-700">{selectedCase.projectId}</span>
                      <RiskBadge level={selectedCase.riskLevel} score={selectedCase.riskScore} />
                      <StatusBadge status={selectedCase.status} />
                    </div>
                    <h2 className="text-base font-bold text-slate-900 mt-1">{selectedCase.projectName}</h2>
                    <p className="text-xs text-slate-500">
                      {selectedCase.district}, {selectedCase.state} • Sector: {selectedCase.sector}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/projects/${selectedCase.projectId}`)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Inspect Profile</span>
                    </button>
                    <button
                      onClick={() => navigate(`/reports/${selectedCase.projectId}`)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Case Dossier</span>
                    </button>
                  </div>
                </div>

                {/* 4 Financial & Schedule Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Sanctioned</span>
                    <span className="text-sm font-bold font-mono text-slate-900">
                      ₹{((selectedCase.sanctionedAmount || 0) / 100000).toFixed(1)} Lakhs
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Disbursed</span>
                    <span className="text-sm font-bold font-mono text-rose-700">
                      ₹{((selectedCase.expenditureAmount || 0) / 100000).toFixed(1)} Lakhs
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Physical Done</span>
                    <span className="text-sm font-bold font-mono text-slate-900">
                      {selectedCase.progressPercentage}%
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Schedule Lag</span>
                    <span className="text-sm font-bold font-mono text-rose-700">
                      {selectedCase.delayDays > 0 ? `${selectedCase.delayDays} Days` : 'On Time'}
                    </span>
                  </div>
                </div>

                {/* Enlistment Reason Banner */}
                {selectedCase.enlistReason && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Investigation Rationale: </span>
                      {selectedCase.enlistReason}
                    </div>
                  </div>
                )}
              </div>

              {/* 7-Stage Interactive Lifecycle Bar */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      7-Stage Investigation Lifecycle
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Click any stage or use administrative actions to transition case
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                    Stage {currentStageIndex + 1} of 7: {LIFECYCLE_STAGES[currentStageIndex]?.short}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
                  {LIFECYCLE_STAGES.map((st, idx) => {
                    const isDone = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleStageClick(st.id)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : isDone
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium hover:bg-emerald-100'
                            : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 hover:text-slate-700'
                        }`}
                      >
                        <div className="text-[9px] font-mono uppercase font-bold">Step 0{idx + 1}</div>
                        <div className="text-[11px] font-bold truncate mt-0.5">{st.short}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Quick Administrative Action Buttons */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Direct Administrative Actions:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Start Formal Review', stage: 'UNDER_REVIEW' },
                      { label: 'Request Measurement Book (MB)', stage: 'DOCS_REQUESTED' },
                      { label: 'Schedule Field Verification', stage: 'FIELD_INSPECTION' },
                      { label: 'Record Physical Finding', stage: 'FINDING_RECORDED' },
                      { label: 'Issue Corrective Notice', stage: 'CORRECTIVE_ACTION' },
                      { label: 'Mark Case Resolved', stage: 'RESOLVED' }
                    ].map((act, i) => (
                      <button
                        key={i}
                        onClick={() => setModalAction(act)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          act.stage === 'RESOLVED'
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                        }`}
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Modal for recording action */}
                {modalAction && (
                  <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-3 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        Record Action: <span className="text-blue-700">{modalAction.label}</span>
                      </span>
                      <button
                        onClick={() => setModalAction(null)}
                        className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                    <textarea
                      value={actionComment}
                      onChange={(e) => setActionComment(e.target.value)}
                      placeholder="Enter official observation, order reference number, or instructions for non-repudiable audit trail..."
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-800 font-mono"
                      rows={2}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setModalAction(null)}
                        className="px-3 py-1 bg-slate-200 text-slate-700 rounded text-xs cursor-pointer"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleRecordAction(modalAction.label, modalAction.stage)}
                        disabled={!actionComment.trim()}
                        className="px-4 py-1 bg-slate-900 text-white font-semibold rounded text-xs hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Save & Append to Audit Log
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Tracking Audit Trail */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-slate-500" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Non-Repudiable Action Tracking Log
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {selectedCase.auditTrail?.length || 0} Recorded Actions
                  </span>
                </div>

                <div className="space-y-3">
                  {(!selectedCase.auditTrail || selectedCase.auditTrail.length === 0) ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No actions recorded yet for this case.
                    </div>
                  ) : (
                    selectedCase.auditTrail.map((log, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{log.officer}</span>
                            <span className="px-2 py-0.5 bg-white text-slate-700 border border-slate-200 rounded font-semibold text-[10px]">
                              {log.action}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">
                            {log.timestamp}
                          </span>
                        </div>
                        <p className="text-slate-600 font-mono text-[11px] pt-1 leading-relaxed">
                          "{log.comment}"
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
              Select a case from the left queue to open operational workspace.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
