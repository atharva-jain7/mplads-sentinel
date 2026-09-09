import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  MapPin, 
  TrendingUp, 
  BarChart3, 
  FileText, 
  Lock, 
  Building, 
  UserCheck, 
  Landmark,
  Compass,
  Cpu
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      {/* 1. Official Government Top Header with National Ribbon */}
      <header className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 shadow-sm">
        {/* National Tricolor Accent Strip */}
        <div className="h-1 w-full flex">
          <div className="h-full w-1/3 bg-[#FF9933]"></div>
          <div className="h-full w-1/3 bg-white"></div>
          <div className="h-full w-1/3 bg-[#138808]"></div>
        </div>

        {/* Official Sub-Bar */}
        <div className="bg-[#071321] border-b border-slate-800/80 px-4 sm:px-8 py-1.5 text-[11px] text-slate-300">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100">भारत सरकार</span>
              <span>•</span>
              <span className="font-semibold text-slate-200">GOVERNMENT OF INDIA</span>
              <span className="hidden md:inline">•</span>
              <span className="text-slate-400 hidden md:inline">सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-amber-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>National Prototype Portal Active</span>
            </div>
          </div>
        </div>

        {/* Main Header Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white">MPLADS SENTINEL</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-amber-400 font-bold rounded border border-slate-700">
                  DECISION SUPPORT
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Members of Parliament Local Area Development Scheme</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <span>Access Sentinel Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        
        {/* PROTOTYPE / LEGAL DISCLAIMER BANNER */}
        <div className="bg-amber-50/90 border border-amber-300/80 rounded-2xl p-4 sm:p-5 text-slate-800 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
              <Scale className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">
                  Official Statutory & Prototype Notice
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-amber-200 text-amber-900 rounded">
                  DEMONSTRATION SYSTEM
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed text-[11.5px]">
                <b>MPLADS Sentinel</b> is a decision-support and risk-prioritization prototype engineered under the 
                Smart India Hackathon (SIH) framework for the <b>Ministry of Statistics and Programme Implementation (MoSPI)</b>. 
                All multi-model anomaly ratings, geospatial overlap flags, and financial scores are generated purely for 
                <b> administrative monitoring, proactive risk verification, and technical assistance</b>. 
                They do not constitute legal findings of financial impropriety or formal disciplinary charges under the MPLADS Guidelines.
              </p>
            </div>
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>AI Anomaly Detection & Geospatial Surveillance</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              AI-Powered Monitoring & Analytics Platform for MPLADS Works
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Enabling proactive oversight of civic amenities, fund utilization, and community durable assets across 
              <b> 543 Parliamentary Constituencies</b>. Sentinel combines five statistical and machine-learning engines 
              to surface delayed works, cost overrun anomalies, and geographic duplicates before funds are disbursed.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <span>Enter Sentinel Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => {
                  const el = document.getElementById('architecture-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs sm:text-sm transition-all border border-slate-200 cursor-pointer"
              >
                Explore System Architecture
              </button>
            </div>
          </div>
        </div>

        {/* NATIONAL SCHEME SNAPSHOT METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Monitored Seats</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">543</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Lok Sabha Parliamentary Constituencies</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sanctioned Works</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">1,250+</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Active community projects registered</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Fund Scope</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">?5,000+ Cr</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Annual MPLADS entitlement funds</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Anomaly Engines</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">5 AI Models</div>
            <p className="text-[11px] text-slate-400 mt-0.5">IF, LOF, Benford, Geospatial & Rules</p>
          </div>
        </div>

        {/* 4 CORE ANALYTICAL PILLARS (Clean, Easy to Digest) */}
        <div id="architecture-section" className="space-y-4 pt-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Core Decision Support Capabilities</h2>
            <p className="text-xs text-slate-500 mt-0.5">Multi-signal algorithmic inspection built into the national sentinel framework</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">1. Timeline & Spend Gap</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Isolation Forest detects works where cumulative expenditure outpaces ground progress (e.g. 86% funds disbursed against 38% completion).
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">2. Peer Group Deviation</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Local Outlier Factor (LOF) compares project cost per unit of progress against historical peer community works in the same district.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">3. Benford Voucher Auditing</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Evaluates contractor payment disbursement vouchers against logarithmic first-digit frequency laws to flag artificial transaction clusters.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">4. GIS Overlap Scanner</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Haversine geospatial engine scans a 3.0 km radius around GPS coordinates to prevent duplicate sanctions for identical community assets.
              </p>
            </div>
          </div>
        </div>

        {/* ROLE-BASED ACCESS OVERVIEW CARD */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Stakeholder Portals & Authorization Tiers</h3>
              <p className="text-xs text-slate-500 mt-0.5">Strict role-based access control configured before sign in</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 font-semibold">
              RBAC Enforced
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Member of Parliament</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Constituency Cockpit, entitlement quota utilization, asset creation tracker, and works portfolio.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>District Authority</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                District execution queue, measurement book audits, contractor scrutiny, and inspection radar.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Building className="w-3.5 h-3.5 text-orange-600" />
                <span>State Nodal Authority</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                State-wide project registry, inter-district fund flow, and infrastructure delivery monitoring.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Landmark className="w-3.5 h-3.5 text-purple-600" />
                <span>The Ministry (MoSPI)</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                All-India surveillance, national critical risk rankings, policy compliance, and central audit dossiers.
              </p>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              <span>Select Role & Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </main>

      {/* 3. Official Government Institutional Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-6 px-4 sm:px-8 mt-12 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>MPLADS Sentinel Portal</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Ministry of Statistics and Programme Implementation ? Government of India
            </p>
          </div>

          <div className="text-[11px] text-slate-500 max-w-md text-center md:text-right">
            Designed and developed as an AI Decision Support Prototype. Hosted on institutional servers under MoSPI oversight guidelines.
          </div>
        </div>
      </footer>
    </div>
  );
}
