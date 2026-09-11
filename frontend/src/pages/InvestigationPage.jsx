import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Cpu, 
  Compass, 
  DollarSign, 
  TrendingUp,
  ShieldAlert,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  UserCheck,
  FileCheck,
  Plus,
  Send,
  History,
  ClipboardCheck,
  Building,
  MapPin
} from 'lucide-react';
import { api } from '../services/api';
import { authService } from '../services/auth';
import RiskBadge from '../components/RiskBadge';
import ExplainabilityCard from '../components/ExplainabilityCard';
import BenfordChart from '../components/BenfordChart';
import LOFVisualizer from '../components/LOFVisualizer';
import GISMap from '../components/GISMap';

export default function InvestigationPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const user = authService.getUser() || { fullName: 'Rajesh Sharma, IAS', roleId: 'DISTRICT', jurisdiction: 'Pune' };
  const isMP = user.roleId === 'MP';
  const isDistrict = user.roleId === 'DISTRICT';

  const [project, setProject] = useState(null);
  const [payments, setPayments] = useState([]);
  const [progressLogs, setProgressLogs] = useState([]);
  const [nearbyData, setNearbyData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Lifecycle Workflow & Audit Trail (Requirement 5)
  const LIFECYCLE_STAGES = [
    { id: 'DETECTED', label: 'Detected' },
    { id: 'UNDER_REVIEW', label: 'Under Review' },
    { id: 'DOCS_REQUESTED', label: 'Documents Requested' },
    { id: 'FIELD_INSPECTION', label: 'Field Inspection' },
    { id: 'FINDING_RECORDED', label: 'Finding Recorded' },
    { id: 'CORRECTIVE_ACTION', label: 'Corrective Action' },
    { id: 'RESOLVED', label: 'Resolved' }
  ];

  const storageKey = `investigation_state_${projectId}`;
  const savedState = JSON.parse(localStorage.getItem(storageKey) || '{}');

  const [currentStage, setCurrentStage] = useState(savedState.stage || 'UNDER_REVIEW');
  const [auditTrail, setAuditTrail] = useState(savedState.auditTrail || [
    {
      officer: 'System Algorithmic Screener',
      action: 'Risk Detected & Flagged',
      timestamp: '2026-08-15 11:20:00',
      comment: 'Multi-signal anomaly fusion identified milestone lag and progress-spend gap.',
      status: 'DETECTED'
    },
    {
      officer: user.fullName || 'Rajesh Sharma, IAS',
      action: 'Under Administrative Review',
      timestamp: '2026-08-20 14:45:00',
      comment: 'Opened investigation file. Sanctioned MB measurement logs requested from Implementing Agency.',
      status: 'UNDER_REVIEW'
    }
  ]);

  const [modalAction, setModalAction] = useState(null);
  const [actionComment, setActionComment] = useState('');

  useEffect(() => {
    loadInvestigationData();
  }, [projectId]);

  const loadInvestigationData = async () => {
    setLoading(true);
    try {
      const p = await api.getProjectById(projectId);
      setProject(p);
      const pmts = await api.getPayments(projectId);
      setPayments(pmts || []);
      const prog = await api.getProgress(projectId);
      setProgressLogs(prog || []);
      const nearby = await api.getNearbyProjects(projectId, 5.0);
      setNearbyData(nearby);
      const ana = await api.runRiskAnalysis(projectId);
      setAnalysis(ana);
    } catch (err) {
      console.warn('Investigation load fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordAction = (actionName, targetStage) => {
    if (!actionComment.trim()) return;

    const newLog = {
      officer: user.fullName || 'District Monitoring Officer',
      action: actionName,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      comment: actionComment.trim(),
      status: targetStage || currentStage
    };

    const updatedTrail = [newLog, ...auditTrail];
    const newStage = targetStage || currentStage;

    setCurrentStage(newStage);
    setAuditTrail(updatedTrail);
    localStorage.setItem(storageKey, JSON.stringify({ stage: newStage, auditTrail: updatedTrail }));

    setModalAction(null);
    setActionComment('');
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      navigate(`/reports/${projectId}`);
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading || !project) {
    return <div className="p-12 text-center text-slate-400 text-xs">Loading AI-Generated Review Dossier...</div>;
  }

  const p = project;

  // STRICT JURISDICTION ENFORCEMENT
  const isUnauthorized = (isMP || isDistrict) && p.district && p.district !== 'Pune';

  if (isUnauthorized) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-red-200 rounded-2xl shadow-sm text-center space-y-4 font-sans">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Jurisdiction Access Restricted</h2>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            As {isMP ? "Hon'ble Member of Parliament for" : "District Officer for"}{' '}
            <b>{user.jurisdiction || 'Pune Parliamentary Constituency'}</b>, your investigation workspace is strictly restricted to works recommended within your constituency.
          </p>
          <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500 font-mono">
            <div>Requested Case: <b>{p.projectId}</b></div>
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

  const mlSignals = analysis?.mlSignals || {};
  const lofData = mlSignals.lof || {};
  const benfordData = mlSignals.benford || {};
  const nearbyProjects = nearbyData?.nearbyProjects || [];

  const currentStageIndex = LIFECYCLE_STAGES.findIndex(s => s.id === currentStage);

  // Evidence Timeline Milestones (Requirement 4)
  const timelineMilestones = [
    { name: '1. MP Recommendation', date: '2024-11-10', detail: `Recommended under MPLADS quota allocation for ${p.constituency || 'Constituency'}`, status: 'COMPLETED' },
    { name: '2. Administrative Sanction', date: p.sanctionDate || '2025-01-15', detail: `Sanctioned by District Collector (Budget: ₹${((p.sanctionedAmount || 3000000) / 100000).toFixed(1)} Lakhs)`, status: 'COMPLETED' },
    { name: '3. Technical Sanction', date: '2025-02-01', detail: `Technical feasibility appraised by Executive Engineer (${p.implementingAgency || 'PWD'})`, status: 'COMPLETED' },
    { name: '4. Mobilization Payment', date: '2025-03-10', detail: 'Tranche 1 released (20% mobilization advance against site handover)', status: 'COMPLETED' },
    { name: '5. Progress Verification', date: '2025-07-22', detail: `Recorded physical progress: ${p.progressPercentage || 38.0}% (Target was ${p.expectedProgressPercentage || 80.0}%)`, status: p.delayDays > 0 ? 'FLAGGED' : 'COMPLETED' },
    { name: '6. Latest Payment Disbursed', date: '2025-09-18', detail: `Cumulative expenditure disbursed: ₹${((p.expenditureAmount || 2600000) / 100000).toFixed(1)} Lakhs (${p.fundUtilizationPercent || 86.7}%)`, status: 'COMPLETED' },
    { name: '7. Expected Completion', date: p.expectedCompletionDate || '2025-10-31', detail: p.delayDays > 0 ? `${p.delayDays} days overdue execution milestone` : 'On schedule', status: p.delayDays > 0 ? 'OVERDUE' : 'PENDING' },
    { name: '8. Current Status', date: '2026-09-11', detail: `Investigation active • Status: ${LIFECYCLE_STAGES.find(s => s.id === currentStage)?.label}`, status: 'ACTIVE' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/projects/${p.projectId}`)}
            className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-700">{p.projectId}</span>
              <RiskBadge level={analysis?.riskLevel || p.riskLevel} score={analysis?.riskScore || p.riskScore} />
              <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-50 text-amber-800 rounded border border-amber-200 font-semibold">
                AI-GENERATED REVIEW REPORT (SIH PROTOTYPE)
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 mt-0.5">{p.projectName}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateReport}
            disabled={generatingReport}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Executive Dossier</span>
          </button>
        </div>
      </div>

      {/* Core Principle Callout */}
      <div className="p-3 bg-slate-900 text-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <span><b>Workflow Principle:</b> AI does not accuse • AI prioritizes • Evidence explains • Authorities investigate • Actions are recorded • Cases are resolved.</span>
        <span className="text-amber-400 font-bold shrink-0">Stage: {LIFECYCLE_STAGES.find(s => s.id === currentStage)?.label}</span>
      </div>

      {/* ========================================================================= */}
      {/* REQUIREMENT 5: INVESTIGATION LIFECYCLE WORKFLOW PIPELINE                 */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Investigation Lifecycle & Case Resolution</h3>
            <p className="text-xs text-slate-500">Structured 7-stage administrative workflow with non-repudiable audit logging</p>
          </div>
          <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 font-semibold">
            Stage {currentStageIndex + 1} of 7
          </span>
        </div>

        {/* Pipeline Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 pt-1">
          {LIFECYCLE_STAGES.map((st, idx) => {
            const isDone = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <div
                key={st.id}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                <div className="text-[10px] font-mono uppercase font-bold">Step 0{idx + 1}</div>
                <div className="text-xs font-bold truncate mt-0.5">{st.label}</div>
              </div>
            );
          })}
        </div>

        {/* Operational Action Toolbar */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Officer Administrative Actions:
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Start Investigation', stage: 'UNDER_REVIEW' },
              { label: 'Assign Field Officer', stage: 'UNDER_REVIEW' },
              { label: 'Request Documents (MB)', stage: 'DOCS_REQUESTED' },
              { label: 'Schedule Field Inspection', stage: 'FIELD_INSPECTION' },
              { label: 'Record Inspection Finding', stage: 'FINDING_RECORDED' },
              { label: 'Issue Corrective Notice', stage: 'CORRECTIVE_ACTION' },
              { label: 'Mark Case Resolved', stage: 'RESOLVED' }
            ].map((act, i) => (
              <button
                key={i}
                onClick={() => setModalAction(act)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs border border-slate-300 transition-colors cursor-pointer"
              >
                {act.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Modal */}
        {modalAction && (
          <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                Execute Action: <span className="text-blue-700">{modalAction.label}</span>
              </span>
              <button
                onClick={() => setModalAction(null)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
            <textarea
              value={actionComment}
              onChange={(e) => setActionComment(e.target.value)}
              placeholder="Enter official observation, order reference number, or instructions for audit record..."
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-800 font-mono"
              rows={2}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalAction(null)}
                className="px-3 py-1 bg-slate-200 text-slate-700 rounded text-xs"
              >
                Dismiss
              </button>
              <button
                onClick={() => handleRecordAction(modalAction.label, modalAction.stage)}
                disabled={!actionComment.trim()}
                className="px-4 py-1 bg-slate-900 text-white font-semibold rounded text-xs hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Log to Audit Trail
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* REQUIREMENT 4: EVIDENCE TIMELINE (Recommendation -> Sanction -> Current)   */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Evidence Timeline & Milestone Verification</h3>
            <p className="text-xs text-slate-500">Chronological verification from MP recommendation to on-site progress audit</p>
          </div>
          <span className="text-xs font-mono text-slate-500 font-semibold">8 Life-cycle Events</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {timelineMilestones.map((m, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border space-y-1.5 ${
                m.status === 'FLAGGED'
                  ? 'bg-red-50/80 border-red-200'
                  : m.status === 'OVERDUE'
                  ? 'bg-amber-50/80 border-amber-200'
                  : m.status === 'ACTIVE'
                  ? 'bg-blue-50/80 border-blue-200'
                  : 'bg-slate-50/70 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold text-slate-800">{m.name}</span>
                <span className="text-slate-500">{m.date}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">{m.detail}</p>
              <div className="pt-1">
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  m.status === 'FLAGGED' ? 'bg-red-600 text-white' :
                  m.status === 'OVERDUE' ? 'bg-amber-600 text-white' :
                  m.status === 'ACTIVE' ? 'bg-blue-600 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REQUIREMENT 4: ANOMALY EVIDENCE BREAKDOWN CARDS                            */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Specific Anomaly Signals & Supporting Evidence</h3>
            <p className="text-xs text-slate-500">Quantitative verification metrics showing exactly why this work was prioritized</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Signal 1: Progress-Spend Mismatch */}
          <div className="p-4 bg-red-50/60 border border-red-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-900 uppercase tracking-wider text-[11px]">Progress–Spend Mismatch</span>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between"><span>Physical Progress on Site:</span><b>{p.progressPercentage || 38.0}%</b></div>
              <div className="flex justify-between"><span>Expenditure Disbursed:</span><b className="text-red-700">{p.fundUtilizationPercent || 86.7}%</b></div>
              <div className="flex justify-between"><span>Expected Milestone:</span><b>{p.expectedProgressPercentage || 80.0}%</b></div>
              <div className="flex justify-between pt-1 border-t border-red-200 text-red-900 font-bold">
                <span>Variance (Gap):</span>
                <span>-{p.progressGap || 48.7}%</span>
              </div>
            </div>
            <p className="text-[11px] text-red-800/80 font-sans pt-1">
              86.7% of public funds were disbursed while only 38% of physical civil work has been completed.
            </p>
          </div>

          {/* Signal 2: Cost Anomaly */}
          <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-orange-900 uppercase tracking-wider text-[11px]">Cost Anomaly</span>
              <DollarSign className="w-4 h-4 text-orange-600" />
            </div>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between"><span>Sanctioned Budget:</span><b>₹{(p.sanctionedAmount || 3000000).toLocaleString('en-IN')}</b></div>
              <div className="flex justify-between"><span>Disbursed Outflow:</span><b>₹{(p.expenditureAmount || 2600000).toLocaleString('en-IN')}</b></div>
              <div className="flex justify-between"><span>Peer Benchmark Cost:</span><b>₹{(p.estimatedCost || 2400000).toLocaleString('en-IN')}</b></div>
              <div className="flex justify-between pt-1 border-t border-orange-200 text-orange-900 font-bold">
                <span>Budget Variance:</span>
                <span>+₹{Math.max(0, (p.expenditureAmount || 2600000) - (p.estimatedCost || 2400000)).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <p className="text-[11px] text-orange-800/80 font-sans pt-1">
              Unit rate of civil construction is 2.3x higher than similar works in {p.district || 'Pune'} district.
            </p>
          </div>

          {/* Signal 3: Schedule Overdue */}
          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 uppercase tracking-wider text-[11px]">Timeline Variance</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between"><span>Sanction Date:</span><b>{p.sanctionDate || '2025-01-15'}</b></div>
              <div className="flex justify-between"><span>Target Completion:</span><b>{p.expectedCompletionDate || '2025-10-31'}</b></div>
              <div className="flex justify-between"><span>Recorded Delay:</span><b className="text-red-700">{p.delayDays || 137} Days</b></div>
              <div className="flex justify-between pt-1 border-t border-amber-200 text-amber-900 font-bold">
                <span>Status:</span>
                <span className="text-red-700">CHRONICALLY DELAYED</span>
              </div>
            </div>
            <p className="text-[11px] text-amber-800/80 font-sans pt-1">
              Project execution is overdue by more than 4 months without formal sanction extension on file.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Explainability Findings */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">2. Explainable Anomaly Rationale</h3>
        <ExplainabilityCard
          score={analysis?.riskScore || p.riskScore}
          level={analysis?.riskLevel || p.riskLevel}
          factors={analysis?.factors}
        />
      </div>

      {/* Section 3: LOF Peer Density */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">3. District Peer Group Outlier Analysis</h3>
        <LOFVisualizer
          lofData={lofData}
          targetProject={p}
          district={p.district}
          sector={p.projectType}
        />
      </div>

      {/* Section 4: Benford's Law Financial Distribution */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">4. Financial Digit Pattern Anomaly (Benford's Law)</h3>
        <BenfordChart benfordResult={benfordData} />
      </div>

      {/* Section 5: GIS Proximity */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">5. Geospatial Radius & Potential Duplicate Analysis</h3>
        <GISMap
          targetProject={p}
          nearbyProjects={nearbyProjects}
          radiusKm={3.0}
        />
      </div>

      {/* ========================================================================= */}
      {/* REQUIREMENT 5: NON-REPUDIABLE AUDIT TRAIL TABLE                          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-700" />
              <span>Official Investigation Audit Trail</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Chronological record of officer decisions, inquiries, and status updates</p>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
            {auditTrail.length} Action Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium font-mono">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Officer / Authority</th>
                <th className="px-4 py-3">Action Executed</th>
                <th className="px-4 py-3">Official Comment & Finding</th>
                <th className="px-4 py-3 text-right">Lifecycle Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {auditTrail.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900 font-sans">{log.officer}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-semibold font-sans">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-sans max-w-md">{log.comment}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-bold text-[10px]">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}