import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  CheckCircle2, 
  Video, 
  StopCircle, 
  Download, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  FileText, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 7 Chapters in the Walkthrough Video
const CHAPTERS = [
  { id: 0, time: '00:00', title: 'Home & Detection Signals', duration: 15 },
  { id: 1, time: '00:15', title: 'Role-Based Authentication', duration: 12 },
  { id: 2, time: '00:27', title: 'Executive Dashboard & GIS Map', duration: 18 },
  { id: 3, time: '00:45', title: 'Project Risk Priority Registry', duration: 16 },
  { id: 4, time: '01:01', title: 'Deep Project Inspection & AI Triggers', duration: 18 },
  { id: 5, time: '01:19', title: '7-Stage Investigation Desk', duration: 18 },
  { id: 6, time: '01:37', title: 'Audit Trail & Case Resolution', duration: 15 }
];

const TOTAL_DURATION = CHAPTERS.reduce((acc, c) => acc + c.duration, 0); // 112 seconds total

export default function LiveDemoVideoPlayer({ onClose }) {
  const navigate = useNavigate();

  // Playback state
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0); // in seconds
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Screen recording state
  const [isRecordingScreen, setIsRecordingScreen] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const screenStreamRef = useRef(null);
  const timerRef = useRef(null);

  // Determine active chapter based on currentTime
  let accumulated = 0;
  let activeChapter = CHAPTERS[0];
  for (let c of CHAPTERS) {
    if (currentTime >= accumulated && currentTime < accumulated + c.duration) {
      activeChapter = c;
      break;
    }
    accumulated += c.duration;
  }

  // Playback ticker
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= TOTAL_DURATION) {
            setIsPlaying(false);
            return TOTAL_DURATION;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const handleSeek = (seconds) => {
    setCurrentTime(Math.min(TOTAL_DURATION, Math.max(0, seconds)));
  };

  const jumpToChapter = (chapId) => {
    let acc = 0;
    for (let i = 0; i < chapId; i++) {
      acc += CHAPTERS[i].duration;
    }
    setCurrentTime(acc);
    setIsPlaying(true);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Browser Screen Recording Feature (Allowing users to record their own live walkthrough!)
  const startScreenRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always', displaySurface: 'browser' },
        audio: true
      });
      screenStreamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedBlobUrl(url);
        setIsRecordingScreen(false);
        clearInterval(timerRef.current);
      };

      mediaRecorder.start();
      setIsRecordingScreen(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => setRecordingSeconds(s => s + 1), 1000);

      stream.getVideoTracks()[0].onended = () => {
        if (mediaRecorder.state !== 'inactive') mediaRecorder.stop();
      };
    } catch (err) {
      console.warn('Screen recording error / canceled:', err);
      setIsRecordingScreen(false);
    }
  };

  const stopScreenRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(t => t.stop());
    }
  };

  return (
    <div className="flex flex-col bg-slate-950 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-2xl max-w-5xl w-full">
      {/* 1. Video Player Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#071321] border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold text-slate-200">MPLADS Sentinel — Live System Demonstration</span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline font-mono px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50 text-[10px]">
            1080p 60fps HD Walkthrough
          </span>
        </div>

        {/* Action Controls & Recording */}
        <div className="flex items-center gap-3">
          {/* Native Screen Recorder Button */}
          {!isRecordingScreen ? (
            <button
              onClick={startScreenRecording}
              className="flex items-center gap-1.5 px-3 py-1 bg-red-600/90 hover:bg-red-500 text-white font-semibold rounded-lg text-[11px] transition-all cursor-pointer shadow-xs"
              title="Record your own screen of the live system"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Record Live Screen</span>
            </button>
          ) : (
            <button
              onClick={stopScreenRecording}
              className="flex items-center gap-1.5 px-3 py-1 bg-red-700 animate-pulse text-white font-semibold rounded-lg text-[11px] transition-all cursor-pointer shadow-xs"
            >
              <StopCircle className="w-3.5 h-3.5" />
              <span>Stop Recording ({formatTime(recordingSeconds)})</span>
            </button>
          )}

          {recordedBlobUrl && (
            <a
              href={recordedBlobUrl}
              download="mplads-sentinel-walkthrough.webm"
              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-[11px] transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          )}
        </div>
      </div>

      {/* 2. Main Simulated Video Screen (Dynamic Renderings of Actual System Steps) */}
      <div className="relative aspect-video bg-slate-900 overflow-hidden flex flex-col justify-between select-none">
        
        {/* SCENE RENDERING BASED ON ACTIVE CHAPTER */}
        <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between">
          
          {/* Chapter 0: Home & AI Signals */}
          {activeChapter.id === 0 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-xs">
                    01
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-white">Public Portal & Multi-Signal Detection Radar</h3>
                    <p className="text-[11px] text-slate-400">Autonomous Sentinel Scanning Engine for 543 Constituencies</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  SCHEME TELEMETRY ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-auto">
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <div className="text-[10px] text-slate-400">Total Monitored</div>
                  <div className="text-xl font-bold font-mono text-white mt-0.5">1,250 Works</div>
                  <div className="text-[9px] text-emerald-400">543 Lok Sabha Seats</div>
                </div>
                <div className="p-3 bg-red-950/50 rounded-xl border border-red-800/80">
                  <div className="text-[10px] text-red-300">Capital at Risk</div>
                  <div className="text-xl font-bold font-mono text-red-400 mt-0.5">₹42.80 Cr</div>
                  <div className="text-[9px] text-red-300">Flagged For Action</div>
                </div>
                <div className="p-3 bg-red-950/50 rounded-xl border border-red-800/80">
                  <div className="text-[10px] text-red-300">Critical Works</div>
                  <div className="text-xl font-bold font-mono text-red-400 mt-0.5">47 Works</div>
                  <div className="text-[9px] text-red-300">Score &ge; 80 (Stop Work)</div>
                </div>
                <div className="p-3 bg-amber-950/50 rounded-xl border border-amber-800/80">
                  <div className="text-[10px] text-amber-300">Early Warning</div>
                  <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">90 Days</div>
                  <div className="text-[9px] text-amber-300">Predictive Overrun Model</div>
                </div>
              </div>

              {/* Simulated Cursor Clicking "Enter Sentinel" */}
              <div className="flex items-center justify-between bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-xs text-slate-300">Surveillance Trigger: <b>5 Analytical AI Engines (LOF, Benford, Spatial Haversine)</b></span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-amber-400 animate-pulse">Auto-Navigating to Role Sign In...</span>
                  <div className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded text-xs shadow-md">
                    Enter Sentinel &rarr;
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chapter 1: Role-Based Authentication */}
          {activeChapter.id === 1 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-xs">
                    02
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-white">Role-Gated Operational Sign In</h3>
                    <p className="text-[11px] text-slate-400">Multi-tier authorization configured for Ministry, State, District, and MP</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                  RBAC ENFORCED
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-auto">
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 text-center opacity-70">
                  <div className="text-xs font-bold text-slate-300">Hon'ble MP</div>
                  <div className="text-[10px] text-slate-400 mt-1">Constituency Cockpit</div>
                </div>
                <div className="p-3 bg-blue-950/80 rounded-xl border-2 border-blue-500 text-center relative shadow-lg">
                  <div className="absolute -top-2 right-2 px-1.5 py-0.2 bg-blue-500 text-slate-950 font-bold text-[8px] rounded">
                    ACTIVE SELECTION
                  </div>
                  <div className="text-xs font-bold text-white">District Authority</div>
                  <div className="text-[10px] text-blue-300 mt-1">Deputy Commissioner (Pune)</div>
                  <div className="text-[9px] font-mono text-emerald-400 mt-1">Full Enforcement Rights</div>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 text-center opacity-70">
                  <div className="text-xs font-bold text-slate-300">State Nodal Authority</div>
                  <div className="text-[10px] text-slate-400 mt-1">Maharashtra State Oversight</div>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 text-center opacity-70">
                  <div className="text-xs font-bold text-slate-300">The Ministry</div>
                  <div className="text-[10px] text-slate-400 mt-1">MoSPI Central Command</div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-blue-950/30 p-2.5 rounded-xl border border-blue-900/60">
                <span className="text-xs text-blue-200">Session Initialized: <b>Deputy Commissioner / District Nodal Officer, Pune</b></span>
                <span className="text-[10px] font-mono text-emerald-400">Authenticated via Gov JWT Token</span>
              </div>
            </div>
          )}

          {/* Chapter 2: Executive Dashboard & GIS */}
          {activeChapter.id === 2 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center font-bold text-xs">
                    03
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-white">Executive Dashboard: Live GIS & Square Bar Telemetry</h3>
                    <p className="text-[11px] text-slate-400">Pune District Administration • OpenStreetMap Live Geospatial Layer</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  LIVE GIS SURVEILLANCE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-auto">
                {/* Simulated GIS Map Container */}
                <div className="h-28 sm:h-36 bg-slate-950 rounded-xl border border-slate-700 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                  {/* Simulated Map Markers */}
                  <div className="absolute top-6 left-12 flex items-center gap-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>MPL-10482 (Critical 94)</span>
                  </div>
                  <div className="absolute bottom-8 right-16 flex items-center gap-1 bg-amber-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                    <span>MPL-9182 (High 91)</span>
                  </div>
                  <div className="text-center z-10">
                    <span className="text-xs font-mono font-bold text-slate-300">OpenStreetMap Multi-Layer GIS</span>
                    <p className="text-[10px] text-slate-500">Proximity Overlap & Cluster Detection</p>
                  </div>
                </div>

                {/* Simulated Square Bar Chart */}
                <div className="h-28 sm:h-36 bg-slate-950 rounded-xl border border-slate-700 p-2.5 flex flex-col justify-between">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Anomaly Velocity Trend</span>
                    <span className="text-red-400">■ Critical (47)</span>
                    <span className="text-amber-400">■ High (186)</span>
                  </div>
                  {/* Square Columns Simulation */}
                  <div className="h-16 flex items-end justify-around border-b border-l border-slate-700 px-2">
                    <div className="flex items-end gap-1"><div className="w-2.5 h-4 bg-red-600" /><div className="w-2.5 h-8 bg-amber-500" /></div>
                    <div className="flex items-end gap-1"><div className="w-2.5 h-6 bg-red-600" /><div className="w-2.5 h-10 bg-amber-500" /></div>
                    <div className="flex items-end gap-1"><div className="w-2.5 h-9 bg-red-600" /><div className="w-2.5 h-11 bg-amber-500" /></div>
                    <div className="flex items-end gap-1"><div className="w-2.5 h-12 bg-red-600" /><div className="w-2.5 h-13 bg-amber-500" /></div>
                  </div>
                  <div className="text-[9px] text-center text-slate-500 font-mono">Sep 2025 — Feb 2026 Monthly Trend</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-800/40 p-2 rounded-xl">
                <span>Surveillance Status: <b>4 Critical & 18 High-Attention Works Detected in Pune</b></span>
                <span className="text-amber-400 font-bold text-[11px]">Advancing to Risk Registry &rarr;</span>
              </div>
            </div>
          )}

          {/* Chapter 3: Project Risk Priority Registry */}
          {activeChapter.id === 3 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center font-bold text-xs">
                    04
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-white">PROJECT RISK PRIORITY REGISTRY</h3>
                    <p className="text-[11px] text-slate-400">Sorted dynamically from Highest Risk Score to Lowest</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                  RANKED WORKSPACE
                </span>
              </div>

              <div className="space-y-2 my-auto">
                <div className="p-2.5 bg-red-950/40 rounded-xl border border-red-800/80 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 bg-red-600 text-white font-bold font-mono text-[9px] rounded">SCORE 94</span>
                      <span className="font-bold text-white">MPL-10482: Construction of Community Infrastructure</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Ward 14, Haveli Taluka, Pune • ₹30.0L Sanctioned • ₹26.0L Disbursed (86.7%)</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-1 bg-blue-600 text-white font-bold rounded text-[10px]">Inspect &rarr;</span>
                    <span className="px-2 py-1 bg-amber-500 text-slate-950 font-bold rounded text-[10px]">Send to Desk</span>
                  </div>
                </div>

                <div className="p-2.5 bg-amber-950/40 rounded-xl border border-amber-800/80 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 font-bold font-mono text-[9px] rounded">SCORE 91</span>
                      <span className="font-bold text-white">MPL-9182: CC Paver Road and Stormwater Drain</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Sector 4, Gomti Nagar • 180 Days Delay • 20% Budget Overrun</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[10px]">Inspect &rarr;</span>
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[10px]">Dossier</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-800/40 p-2 rounded-xl text-xs text-slate-400">
                <span>Action Selected: <b>Opening Unified Project Inspection for MPL-10482</b></span>
                <span className="text-blue-400 font-bold text-[11px]">Loading Explainability Dossier...</span>
              </div>
            </div>
          )}

          {/* Chapter 4: Deep Project Inspection */}
          {activeChapter.id === 4 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-xs">
                    05
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-white">Unified Project Inspection: MPL-10482</h3>
                    <p className="text-[11px] text-slate-400">Explainable Multi-Signal Evidence & 3-Year Historical Comparison</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                  CRITICAL ANOMALY DETECTED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-auto">
                <div className="p-2.5 bg-slate-800/70 rounded-xl border border-slate-700 text-xs space-y-1">
                  <div className="text-[10px] text-red-400 font-bold">1. SPEND VS PROGRESS GAP</div>
                  <div className="text-sm font-bold font-mono text-white">48.7% Divergence</div>
                  <p className="text-[10px] text-slate-400">86.7% Funds Disbursed vs 38.0% Ground Completion.</p>
                </div>
                <div className="p-2.5 bg-slate-800/70 rounded-xl border border-slate-700 text-xs space-y-1">
                  <div className="text-[10px] text-amber-400 font-bold">2. 3-YEAR SECTOR BENCHMARK</div>
                  <div className="text-sm font-bold font-mono text-white">+39.5% Cost Variance</div>
                  <p className="text-[10px] text-slate-400">Sanctioned cost exceeds historical sector median by ₹8.5L.</p>
                </div>
                <div className="p-2.5 bg-slate-800/70 rounded-xl border border-slate-700 text-xs space-y-1">
                  <div className="text-[10px] text-purple-400 font-bold">3. CONTRACTOR SATURATION</div>
                  <div className="text-sm font-bold font-mono text-white">Apex Civil Works Ltd.</div>
                  <p className="text-[10px] text-slate-400">6 concurrent active works held; 137 days schedule delay.</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-red-950/30 p-2 rounded-xl border border-red-900/50 text-xs">
                <span className="text-red-300">Decision: <b>Sending to Investigation Desk to Halt Further Tranches</b></span>
                <span className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded text-[11px]">
                  [Send to Investigation Desk]
                </span>
              </div>
            </div>
          )}

          {/* Chapter 5: 7-Stage Investigation Desk */}
          {activeChapter.id === 5 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-xs">
                    06
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-white">INVESTIGATION DESK — Case #INV-10482</h3>
                    <p className="text-[11px] text-slate-400">7-Stage Statutory Lifecycle & Enforcement Directives</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                  STAGE 4: FIELD INSPECTION
                </span>
              </div>

              {/* 7-Stage Visual Pipeline */}
              <div className="my-auto space-y-3">
                <div className="grid grid-cols-7 gap-1 text-center text-[8px] font-mono">
                  <div className="p-1.5 bg-emerald-900/60 border border-emerald-600 rounded text-emerald-300">1. Detected</div>
                  <div className="p-1.5 bg-emerald-900/60 border border-emerald-600 rounded text-emerald-300">2. Review</div>
                  <div className="p-1.5 bg-emerald-900/60 border border-emerald-600 rounded text-emerald-300">3. Docs Req</div>
                  <div className="p-1.5 bg-amber-500 text-slate-950 font-bold rounded animate-pulse">4. Field Insp</div>
                  <div className="p-1.5 bg-slate-800 border border-slate-700 rounded text-slate-500">5. Finding</div>
                  <div className="p-1.5 bg-slate-800 border border-slate-700 rounded text-slate-500">6. Notice</div>
                  <div className="p-1.5 bg-slate-800 border border-slate-700 rounded text-slate-500">7. Resolved</div>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">Directive: Junior Engineer Dispatched for Site Measurement</div>
                    <div className="text-[10px] text-slate-400">Order Reference: DC/PUN/MPLADS/2026/0842 • Tranche 3 Payment Frozen</div>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 bg-red-600 text-white font-bold rounded text-[10px]">Freeze Tranche</span>
                    <span className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded text-[10px]">Record MB Audit</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-800/40 p-2 rounded-xl text-xs text-slate-400">
                <span>Audit Status: <b>Field team completed inspection. Proceeding to resolution.</b></span>
                <span className="text-emerald-400 font-bold text-[11px]">Advancing to Final Resolution...</span>
              </div>
            </div>
          )}

          {/* Chapter 6: Audit Trail & Case Resolution */}
          {activeChapter.id === 6 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs">
                    07
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-white">Statutory Audit Trail & Case Resolution</h3>
                    <p className="text-[11px] text-slate-400">Non-Repudiable Digital Trail • Public Capital Safeguarded</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  CASE RESOLVED
                </span>
              </div>

              <div className="my-auto space-y-2 text-xs">
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl space-y-1">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-emerald-400 font-bold">OFFICER: Rajesh Sharma (Deputy Commissioner)</span>
                    <span className="text-slate-400">12 Sep 2026, 17:40 IST</span>
                  </div>
                  <div className="text-slate-200 text-[11px]">
                    "Contractor submitted updated Measurement Book. Tranche 3 adjusted by ₹4.0 Lakhs. Physical progress verified at 75%. Project returned to compliance."
                  </div>
                </div>

                <div className="p-2 bg-slate-800/60 rounded-lg text-center text-slate-300 text-[11px] font-mono">
                  ★ ₹4.0 Lakhs Capital Loss Prevented • Complete Digital Evidence Trail Preserved
                </div>
              </div>

              <div className="flex items-center justify-between bg-emerald-950/40 p-2 rounded-xl border border-emerald-900/50 text-xs">
                <span className="text-emerald-300 font-bold">Walkthrough Complete!</span>
                <button
                  onClick={() => {
                    if (onClose) onClose();
                    navigate('/login');
                  }}
                  className="px-4 py-1.5 bg-amber-400 text-slate-950 font-bold rounded-lg hover:bg-amber-300 text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Experience Live System</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Subtitle / Narration Banner across bottom of simulated screen */}
        <div className="bg-slate-950/90 border-t border-slate-800 p-2 text-center text-xs font-sans text-amber-300 drop-shadow flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">
            {activeChapter.id === 0 && "Autonomous engine monitors 543 Parliamentary seats, highlighting ₹42.8 Cr capital at risk."}
            {activeChapter.id === 1 && "Role-based access authenticates District Monitoring Officer with statutory enforcement powers."}
            {activeChapter.id === 2 && "Dashboard integrates OpenStreetMap real-time GIS clustering and dynamic square bar telemetry."}
            {activeChapter.id === 3 && "Project Risk Priority Registry ranks works from highest to lowest composite risk score."}
            {activeChapter.id === 4 && "Inspection Workspace exposes 48.7% progress-spend divergence and +39.5% cost inflation."}
            {activeChapter.id === 5 && "Investigation Desk freezes payments, records orders, and dispatches site verification squads."}
            {activeChapter.id === 6 && "Non-repudiable audit logs preserve legal accountability and successfully safeguard public funds."}
          </span>
        </div>
      </div>

      {/* 3. Scrubbable Progress Bar & Video Player Controls */}
      <div className="p-4 bg-[#0a192f] border-t border-slate-800 space-y-3">
        
        {/* Scrubber Bar */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-slate-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <div 
            className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer relative group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              handleSeek(pct * TOTAL_DURATION);
            }}
          >
            <div 
              style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-150 relative"
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-400 w-10">
            {formatTime(TOTAL_DURATION)}
          </span>
        </div>

        {/* Buttons Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          
          {/* Left Play Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md cursor-pointer transition-transform transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => {
                setCurrentTime(0);
                setIsPlaying(true);
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded cursor-pointer"
              title="Replay from start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Speed Control */}
            <div className="flex items-center gap-1 font-mono text-[11px] bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              <span className="text-slate-400">Speed:</span>
              <button
                onClick={() => setPlaybackSpeed(s => s === 1 ? 1.5 : s === 1.5 ? 2 : 1)}
                className="font-bold text-amber-400 cursor-pointer"
              >
                {playbackSpeed}x
              </button>
            </div>
          </div>

          {/* Chapter Quick Selector Pills */}
          <div className="flex items-center gap-1 overflow-x-auto py-1 text-[10px] font-mono">
            {CHAPTERS.map((c) => (
              <button
                key={c.id}
                onClick={() => jumpToChapter(c.id)}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors whitespace-nowrap ${
                  activeChapter.id === c.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {c.id + 1}. {c.title.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Right Action: Launch Live System */}
          <button
            onClick={() => {
              if (onClose) onClose();
              navigate('/login');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-xs cursor-pointer border border-slate-700 transition-colors"
          >
            <span>Launch Live Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
