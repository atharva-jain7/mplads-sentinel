import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Cpu,
  X,
  ExternalLink,
  Clock,
  Sparkles,
  Database,
  Eye,
  AlertOctagon,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

// Background images for the rotating hero slideshow
const HERO_BACKGROUNDS = [
  {
    url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=2000&q=80',
    title: 'New Parliament House (Sansad Bhavan)',
    location: 'Central Vista, New Delhi'
  },
  {
    url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=2000&q=80',
    title: 'Kartavya Path & Rashtrapati Bhavan',
    location: 'New Delhi'
  },
  {
    url: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=2000&q=80',
    title: 'Strategic Public Infrastructure & Connectivity',
    location: 'National Highways & Rural Bridges'
  },
  {
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80',
    title: 'Civic Community Infrastructure & Urban Governance',
    location: 'Municipal Development Centers'
  },
  {
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2000&q=80',
    title: 'Digital India & Smart Governance Telemetry',
    location: 'Real-time Autonomous Decision Support'
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang, fontSizeScale, setFontSizeScale, t, isHindi } = useAccessibility();

  // Background carousel state
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Modals state
  const [showDocModal, setShowDocModal] = useState(false);

  // Auto-rotate hero background images every 5.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Handle anchor scrolling if hash is present in URL (e.g. #signals)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [location]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      
      {/* ========================================================================= */}
      {/* 1. TOP STATUTORY ACCESSIBILITY BAR                                        */}
      {/* ========================================================================= */}
      <div className="bg-[#071321] border-b border-slate-800 text-slate-300 text-[11px] px-4 sm:px-8 py-1.5 select-none z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">{t.govIndia}</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400 font-hindi">{t.mospi}</span>
          </div>
          
          {/* Language & Accessibility Controls */}
          <div className="flex items-center gap-3 text-[11px] font-mono">
            {/* EN / HI Language Switcher */}
            <div className="flex items-center gap-1 border-r border-slate-700 pr-3">
              <button
                onClick={() => setLang('EN')}
                className={`px-2 py-0.5 rounded text-xs transition-all cursor-pointer ${
                  lang === 'EN' 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => setLang('HI')}
                className={`px-2 py-0.5 rounded text-xs transition-all cursor-pointer ${
                  lang === 'HI' 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="हिन्दी (Hindi) भाषा चुनें"
              >
                HI
              </button>
            </div>

            {/* A- / A / A+ Font Accessibility Resizing */}
            <div className="flex items-center gap-1">
              <span className="text-slate-400 text-[10px] hidden sm:inline mr-0.5">{t.fontSize}:</span>
              <button
                onClick={() => setFontSizeScale('sm')}
                className={`px-2 py-0.5 rounded text-xs transition-all cursor-pointer ${
                  fontSizeScale === 'sm' 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={isHindi ? "फ़ॉन्ट आकार छोटा करें (A-)" : "Decrease font size (A-)"}
              >
                A-
              </button>
              <button
                onClick={() => setFontSizeScale('normal')}
                className={`px-2 py-0.5 rounded text-xs transition-all cursor-pointer ${
                  fontSizeScale === 'normal' 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={isHindi ? "सामान्य फ़ॉन्ट आकार (A)" : "Reset font size (A)"}
              >
                A
              </button>
              <button
                onClick={() => setFontSizeScale('lg')}
                className={`px-2 py-0.5 rounded text-xs transition-all cursor-pointer ${
                  fontSizeScale === 'lg' 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={isHindi ? "फ़ॉन्ट आकार बड़ा करें (A+)" : "Increase font size (A+)"}
              >
                A+
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN NAVIGATION HEADER                                                 */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#0a192f]/95 backdrop-blur-md text-white border-b border-slate-800/80 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          
          {/* Official Emblem & Branding */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* National Crest Badge */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-600/80 flex items-center justify-center text-amber-400 shadow-md group-hover:border-amber-400/80 transition-all">
              <ShieldCheck className="w-6 h-6" />
            </div>
            
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {isHindi ? 'भारत सरकार' : 'Government of India'}
              </div>
              <div className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>{t.appName}</span>
              </div>
              <div className="text-[9.5px] font-mono tracking-widest text-sky-400 font-bold">
                {t.appSubtitle}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-white font-semibold hover:text-amber-400 transition-colors cursor-pointer border-b-2 border-amber-400 pb-0.5"
            >
              {t.navHome}
            </button>
            <button
              onClick={() => scrollToSection('about-scheme')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              {t.navAbout}
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              {t.navHow}
            </button>
            <button
              onClick={() => scrollToSection('signals')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              {t.navSignals}
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              {t.navDashboard}
            </button>
          </nav>

          {/* Login Pill Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-full text-xs sm:text-sm transition-all shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5"
            >
              {t.navLogin}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. HERO SECTION WITH CHANGING BACKGROUND IMAGES                           */}
      {/* ========================================================================= */}
      <section 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative min-h-[620px] sm:min-h-[700px] flex flex-col justify-between overflow-hidden text-white"
      >
        {/* Dynamic Background Image Layers with Cross-Fade */}
        {HERO_BACKGROUNDS.map((bg, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              idx === currentBgIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
            style={{ backgroundImage: `url(${bg.url})` }}
          />
        ))}

        {/* Deep Slate/Navy Semi-Transparent Overlay & Radial Vignette for High-Contrast Text */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/85 via-[#0a192f]/75 to-[#071321]/95 backdrop-brightness-75" />
        <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />

        {/* Main Hero Foreground Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-12 text-center flex flex-col items-center space-y-6">
          
          {/* Main Hero Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight max-w-4xl drop-shadow-md">
            {t.heroTitlePrefix} <br className="hidden sm:inline" />
            <span className="text-white">{t.heroTitleSuffix}</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed drop-shadow-sm font-normal">
            {t.heroSubtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {/* Saffron/Amber Gradient Primary Button */}
            <button
              onClick={() => navigate('/login')}
              className="px-7 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{t.enterSentinel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Secondary Glassmorphic Button */}
            <button
              onClick={() => scrollToSection('signals')}
              className="px-6 py-3.5 bg-slate-900/60 hover:bg-slate-900/90 text-white font-semibold rounded-xl text-sm sm:text-base border border-slate-500/60 backdrop-blur-md transition-all cursor-pointer shadow-md"
            >
              {t.exploreSystem}
            </button>
          </div>

          {/* Trust Badge Sub-Tagline */}
          <div className="text-slate-300 font-mono text-xs sm:text-sm tracking-wide pt-1">
            {t.trustBadge}
          </div>

          {/* Quick Action Circular Icon Button */}
          <div className="flex items-center justify-center pt-4">
            {/* Documentation Button */}
            <button
              onClick={() => setShowDocModal(true)}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-slate-900/80 border border-slate-600/80 flex items-center justify-center text-slate-200 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-400 shadow-md transition-all transform group-hover:scale-110">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white transition-colors">
                {t.docButton}
              </span>
            </button>
          </div>

          {/* Background Carousel Controls Indicator */}
          <div className="flex items-center gap-2 pt-2">
            {HERO_BACKGROUNDS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBgIndex(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === currentBgIndex ? 'w-6 bg-amber-400' : 'w-1.5 bg-slate-500 hover:bg-slate-300'
                }`}
                title={`Switch to ${HERO_BACKGROUNDS[i].title}`}
              />
            ))}
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            {HERO_BACKGROUNDS[currentBgIndex].title} ({HERO_BACKGROUNDS[currentBgIndex].location})
          </div>
        </div>

        {/* ===================================================================== */}
        {/* INDIAN NATIONAL TRICOLOR FLOWING WAVE                                 */}
        {/* ===================================================================== */}
        <div className="relative w-full overflow-hidden leading-none z-20">
          <svg
            className="w-full h-12 sm:h-16 md:h-20"
            viewBox="0 0 1440 120"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Saffron Ribbon (Top) */}
            <path
              d="M0,40 C320,120 480,0 720,50 C960,100 1120,20 1440,70 L1440,120 L0,120 Z"
              fill="#FF9933"
            />
            {/* White Ribbon (Middle) */}
            <path
              d="M0,60 C300,130 500,20 740,70 C980,110 1140,40 1440,85 L1440,120 L0,120 Z"
              fill="#FFFFFF"
            />
            {/* India Green Ribbon (Bottom) */}
            <path
              d="M0,80 C280,135 520,40 760,85 C1000,120 1160,60 1440,95 L1440,120 L0,120 Z"
              fill="#138808"
            />
          </svg>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. NATIONAL SCHEME TELEMETRY BANNER                                       */}
      {/* ========================================================================= */}
      <section className="bg-white border-b border-slate-200 py-6 px-4 sm:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.parliamentarySeats}</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 mt-0.5">543</div>
            <div className="text-[10px] text-slate-400">{t.lokSabhaConst}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.annualAllocation}</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-blue-700 mt-0.5">
              {isHindi ? '₹5.0 करोड़' : '₹5.0 Cr'}
            </div>
            <div className="text-[10px] text-slate-400">{t.perMpYear}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.monitoredWorks}</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 mt-0.5">1,250+</div>
            <div className="text-[10px] text-slate-400">{t.activeDatabase}</div>
          </div>

          <div className="p-3 bg-red-50/70 rounded-xl border border-red-200">
            <div className="text-[10px] font-bold text-red-700 uppercase tracking-wider">{t.capitalAtRisk}</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-red-700 mt-0.5">
              {isHindi ? '₹42.8 करोड़' : '₹42.8 Cr'}
            </div>
            <div className="text-[10px] text-red-500">{t.flaggedVerification}</div>
          </div>

          <div className="p-3 bg-red-50/70 rounded-xl border border-red-200">
            <div className="text-[10px] font-bold text-red-700 uppercase tracking-wider">{t.criticalFlagged}</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-red-700 mt-0.5">47</div>
            <div className="text-[10px] text-red-500">{t.stopWorkRule}</div>
          </div>

          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
            <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">{t.earlyWarning}</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-amber-700 mt-0.5">
              {isHindi ? '90 दिन' : '90 Days'}
            </div>
            <div className="text-[10px] text-amber-600">{t.delayWarning}</div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ABOUT THE SCHEME SECTION (#about-scheme)                              */}
      {/* ========================================================================= */}
      <section id="about-scheme" className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-12 space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-bold">
            <Landmark className="w-3.5 h-3.5" />
            <span>{t.statutoryMandate}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t.aboutTitle}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t.aboutDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{t.card1Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.card1Desc}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{t.card2Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.card2Desc}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{t.card3Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.card3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. HOW IT WORKS SECTION (#how-it-works)                                  */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="bg-slate-100/80 border-y border-slate-200 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
              <Cpu className="w-3.5 h-3.5" />
              <span>{t.pipelineBadge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {t.howTitle}
            </h2>
            <p className="text-sm text-slate-600">
              {t.howDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 relative">
              <div className="text-xs font-mono font-bold text-amber-600">{t.step1Num}</div>
              <h4 className="text-sm font-bold text-slate-900">{t.step1Title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 relative">
              <div className="text-xs font-mono font-bold text-blue-600">{t.step2Num}</div>
              <h4 className="text-sm font-bold text-slate-900">{t.step2Title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 relative">
              <div className="text-xs font-mono font-bold text-purple-600">{t.step3Num}</div>
              <h4 className="text-sm font-bold text-slate-900">{t.step3Title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 relative">
              <div className="text-xs font-mono font-bold text-emerald-600">{t.step4Num}</div>
              <h4 className="text-sm font-bold text-slate-900">{t.step4Title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.step4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. DETECTION SIGNALS SHOWCASE (#signals - Matching user URL!)             */}
      {/* ========================================================================= */}
      <section id="signals" className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-12 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-bold">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>{t.radarBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t.signalsTitle}
          </h2>
          <p className="text-sm text-slate-600">
            {t.signalsDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Signal 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-red-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                {t.sig1Badge}
              </span>
              <TrendingUp className="w-4 h-4 text-red-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{t.sig1Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.sig1Desc}
            </p>
            <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
              {t.sig1Formula}
            </div>
          </div>

          {/* Signal 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-amber-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                {t.sig2Badge}
              </span>
              <BarChart3 className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{t.sig2Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.sig2Desc}
            </p>
            <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
              {t.sig2Formula}
            </div>
          </div>

          {/* Signal 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {t.sig3Badge}
              </span>
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{t.sig3Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.sig3Desc}
            </p>
            <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
              {t.sig3Formula}
            </div>
          </div>

          {/* Signal 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {t.sig4Badge}
              </span>
              <Compass className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{t.sig4Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.sig4Desc}
            </p>
            <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
              {t.sig4Formula}
            </div>
          </div>

          {/* Signal 5 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-purple-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                {t.sig5Badge}
              </span>
              <Building className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{t.sig5Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.sig5Desc}
            </p>
            <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
              {t.sig5Formula}
            </div>
          </div>

          {/* Uniqueness Callout Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl border border-slate-700 shadow-xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                {t.uniqBadge}
              </div>
              <h3 className="text-sm font-bold text-white mt-1">
                {t.uniqTitle}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-1">
                {t.uniqDesc}
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-between transition-all cursor-pointer"
            >
              <span>{t.viewPriorityQueue}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. ROLE-BASED ACCESS OVERVIEW                                             */}
      {/* ========================================================================= */}
      <section className="bg-slate-100/80 border-t border-slate-200 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t.rolesTitle}
            </h2>
            <p className="text-xs text-slate-600">
              {t.rolesDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                <UserCheck className="w-4 h-4" />
                <span>{t.roleMp}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {t.roleMpDesc}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs">
                <MapPin className="w-4 h-4" />
                <span>{t.roleDistrict}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {t.roleDistrictDesc}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-orange-700 font-bold text-xs">
                <Building className="w-4 h-4" />
                <span>{t.roleState}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {t.roleStateDesc}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-xs">
                <Landmark className="w-4 h-4" />
                <span>{t.roleMinistry}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {t.roleMinistryDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. DOCUMENTATION MODAL                                                    */}
      {/* ========================================================================= */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 bg-[#0a192f] text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">{t.docModalTitle}</h3>
              </div>
              <button 
                onClick={() => setShowDocModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{t.docArchTitle}</h4>
                <p>
                  {t.docArchDesc}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-mono font-bold text-slate-900">{t.docStatTitle}</span>
                <p className="text-[11px] text-slate-600">
                  {t.docStatDesc}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">{t.docDeskTitle}</h4>
                <p>
                  {t.docDeskDesc}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowDocModal(false)}
                  className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  {t.closeDoc}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. INSTITUTIONAL GOVERNMENT FOOTER                                       */}
      {/* ========================================================================= */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-8 px-4 sm:px-8 mt-12 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="space-y-1.5">
            <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>{t.footerTitle}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {t.footerSub}
            </p>
            <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2 justify-center md:justify-start">
              <span>{t.footerSih}</span>
              <span>•</span>
              <span>{t.footerGfr}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 max-w-md text-center md:text-right space-y-1">
            <div>
              {isHindi 
                ? 'एक एआई निर्णय-समर्थन प्रोटोटाइप के रूप में विकसित। सभी बहु-सिग्नल जोखिम स्कोर वैधानिक सत्यापन के लिए सलाहकारी हैं।'
                : 'Designed as an AI Decision Support Prototype. All multi-signal risk scores are advisory for statutory verification.'
              }
            </div>
            <div className="text-slate-400 font-mono">
              {isHindi 
                ? 'अंतिम सिस्टम सिंक: 12 सितंबर 2026, 23:30 IST • प्रोटोटाइप सक्रिय'
                : 'Last System Sync: 12 September 2026, 23:30 IST • Prototype Active'
              }
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
