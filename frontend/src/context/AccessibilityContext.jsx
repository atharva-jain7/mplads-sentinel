import React, { createContext, useContext, useState, useEffect } from 'react';

export const translations = {
  EN: {
    // Top Bar
    govIndia: 'Government of India · MPLADS Monitoring',
    mospi: 'Ministry of Statistics & Programme Implementation (MoSPI)',
    fontSize: 'Font Size',
    
    // Header & Navigation
    appName: 'MPLADS Sentinel',
    appSubtitle: 'AI AUDIT PRIORITIZATION · SIH 2026',
    navHome: 'Home',
    navAbout: 'About the Scheme',
    navHow: 'How It Works',
    navSignals: 'Detection Signals',
    navDashboard: 'Dashboard',
    navProjects: 'Projects',
    navDesk: 'Investigation Desk',
    navLogin: 'Login',
    navSignOut: 'Sign Out',
    
    // Hero
    heroTitlePrefix: 'MPLADS Sentinel:',
    heroTitleSuffix: 'Better Monitoring',
    heroSubtitle: 'Transforming MPLADS monitoring from reactive audits to proactive decision-support with AI.',
    enterSentinel: 'Enter Sentinel',
    exploreSystem: 'Explore the System',
    trustBadge: 'Explainable AI · Human-in-the-loop · Evidence-backed',
    docButton: 'Documentation & Architecture',
    
    // Telemetry
    parliamentarySeats: 'Parliamentary Seats',
    lokSabhaConst: 'Lok Sabha Constituencies',
    annualAllocation: 'Annual Allocation',
    perMpYear: 'Per Hon\'ble MP / Year',
    monitoredWorks: 'Monitored Works',
    activeDatabase: 'Active Scheme Database',
    capitalAtRisk: 'Capital at Risk',
    flaggedVerification: 'Flagged for Verification',
    criticalFlagged: 'Critical Flagged',
    stopWorkRule: 'Score ≥ 80 (Stop Work)',
    earlyWarning: 'Early Warning',
    delayWarning: 'Predictive Delay Warning',
    
    // About
    statutoryMandate: 'STATUTORY MANDATE & CONTEXT',
    aboutTitle: 'About the MPLADS Scheme & The Need for Sentinel',
    aboutDesc: 'The Member of Parliament Local Area Development Scheme (MPLADS) enables Hon\'ble MPs to recommend works of developmental nature with emphasis on the creation of durable community assets based on locally felt needs.',
    card1Title: '1. Durable Community Infrastructure',
    card1Desc: 'Mandated under MoSPI Guidelines Chapter 3: Creation of tangible, public-use assets including drinking water complexes, public libraries, school classrooms, community sheds, and rural access roads on government land.',
    card2Title: '2. The 3-Year Post-Mortem Audit Lag',
    card2Desc: 'Traditional CAG and district audits discover contractor defaults, expenditure overruns, and unverified assets 24 to 36 months after funds have already been released, making financial recovery virtually impossible.',
    card3Title: '3. Proactive Decision-Support Solution',
    card3Desc: 'MPLADS Sentinel acts as an autonomous vigilance co-pilot. It ingests ongoing project data, evaluates multi-signal risk vectors in real time, and equips authorities with an Investigation Desk before payments are disbursed.',
    
    // How it works
    pipelineBadge: 'THE 4-STEP SURVEILLANCE PIPELINE',
    howTitle: 'How MPLADS Sentinel Operates',
    howDesc: 'From raw e-SAKSHI data ingestion to targeted statutory resolution',
    step1Num: 'STEP 01',
    step1Title: 'Data Ingestion & Normalization',
    step1Desc: 'Ingests sanction amounts, expenditure tranches, milestone progress percentages, and GPS coordinates from e-SAKSHI.',
    step2Num: 'STEP 02',
    step2Title: 'Multi-Signal AI Scanning',
    step2Desc: 'Executes 5 analytical models concurrently: Progress Drift, LOF cost outliers, Benford voucher analysis, Haversine GIS, and contractor saturation.',
    step3Num: 'STEP 03',
    step3Title: 'Composite Risk Prioritization',
    step3Desc: 'Assigns every project a 0–100 Composite Risk Score and sorts works into Critical (≥80), High (60–79), Medium, and Low tiers.',
    step4Num: 'STEP 04',
    step4Title: 'Investigation Desk & Enforcement',
    step4Desc: 'Nodal officers review explainable audit triggers, freeze fund disbursements, dispatch field inspections, and record non-repudiable audit logs.',
    
    // Signals
    radarBadge: 'INTELLIGENCE RADAR',
    signalsTitle: '5 Core Algorithmic Detection Signals',
    signalsDesc: 'Mathematical, statistical, and spatial engines continuously auditing project health',
    sig1Badge: 'CRITICAL SIGNAL',
    sig1Title: '1. Progress-Spend Disparity Drift',
    sig1Desc: 'Detects works where cumulative financial disbursement outpaces physical ground completion by > 25%. Prevents contractor advances released without verified Measurement Book (MB) recordings.',
    sig1Formula: 'Formula: Gap = Fund Utilization% - Physical Progress%',
    sig2Badge: 'HIGH ATTENTION',
    sig2Title: '2. Local Outlier Factor (LOF) Cost Outlier',
    sig2Desc: 'Multivariate density-based clustering compares sanctioned budgets against the 3-year historical median for identical works in the same district. Flags inflated estimates (e.g. +39.5% cost variance).',
    sig2Formula: 'Algorithm: LOF(k=20) on Cost vs Scope & Sector Median',
    sig3Badge: 'FORENSIC AUDIT',
    sig3Title: '3. Benford\'s Law Voucher Forensics',
    sig3Desc: 'Analyzes contractor disbursement voucher amounts against logarithmic first-digit frequency distribution. Flags artificial split transactions designed to bypass higher tender approval thresholds.',
    sig3Formula: 'Model: Chi-Square P-Value on Log10(1 + 1/d)',
    sig4Badge: 'GEOSPATIAL AUDIT',
    sig4Title: '4. Geospatial Overlap & Proximity Scanner',
    sig4Desc: 'Scans a 500-meter to 3.0-km radius around GPS coordinates and runs semantic matching on work descriptions to prevent double-funding identical roads, borewells, or sheds across Municipal and State schemes.',
    sig4Formula: 'Engine: Haversine Geodesic Distance ≤ 500m Buffer',
    sig5Badge: 'BOTTLENECK RADAR',
    sig5Title: '5. Contractor Saturation & Monopolization',
    sig5Desc: 'Identifies civil contractors awarded excessive concurrent active works (>5 works) across a taluka with historical delay variance >40%, predicting institutional delays months in advance.',
    sig5Formula: 'Metric: Active Works Concentration & Delay Cadence',
    uniqBadge: 'System Uniqueness',
    uniqTitle: 'Active AI vs. Passive e-SAKSHI',
    uniqDesc: 'While e-SAKSHI passively stores data entered by clerks, Sentinel actively mines cross-field relationships to surface actionable fraud risks before funds are lost.',
    viewPriorityQueue: 'View Priority Queue',
    
    // Roles
    rolesTitle: 'Role-Gated Operational Portals',
    rolesDesc: 'Configured specifically for Ministry, State, District, and MP workflows',
    roleMp: 'Hon\'ble MP',
    roleMpDesc: 'Constituency Cockpit, entitlement quota utilization, delivered community assets, and real-time works tracking.',
    roleDistrict: 'District Authority',
    roleDistrictDesc: 'Full operational enforcement, Measurement Book verification, contractor scrutiny, and Investigation Desk dispatch.',
    roleState: 'State Nodal Authority',
    roleStateDesc: 'Inter-district progress comparison, state-wide fund flow velocity, and infrastructure delivery monitoring.',
    roleMinistry: 'The Ministry (MoSPI)',
    roleMinistryDesc: 'All-India surveillance, national critical risk rankings, policy compliance, and central audit dossiers.',
    
    // Documentation Modal
    docModalTitle: 'MPLADS Sentinel Documentation & Architecture',
    docArchTitle: 'System Architecture Overview',
    docArchDesc: 'MPLADS Sentinel is engineered on a decoupled microservices architecture with a React 18 SPA frontend, Spring Boot 3 (Java 21) enterprise backend, and Python FastAPI analytical engines. It evaluates project risks across 5 independent analytical triggers to yield a unified Composite Risk Score (0–100).',
    docStatTitle: 'STATUTORY COMPLIANCE:',
    docStatDesc: 'Built in strict adherence to MoSPI Revised MPLADS Guidelines (Feb 2023), General Financial Rules (GFR 2017) Rule 238, and Central Vigilance Commission (CVC) public procurement norms.',
    docDeskTitle: 'Investigation Desk Lifecycle',
    docDeskDesc: 'Features a 7-stage non-repudiable audit workflow: Detected → Under Review → Documents Requested → Field Inspection → Finding Recorded → Corrective Action → Resolved.',
    closeDoc: 'Close Documentation',
    
    // Footer
    footerTitle: 'MPLADS Sentinel — Autonomous Vigilance & Audit Prioritization System',
    footerSub: 'Engineered for the Ministry of Statistics and Programme Implementation (MoSPI), Government of India.',
    footerSih: 'Smart India Hackathon 2026 Prototype',
    footerGfr: 'Statutory Compliance: GFR 2017 Rule 238',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms of Use',
    footerGuidelines: 'Guidelines',
    footerPortal: 'National Portal of India',
    rightsReserved: 'All rights reserved.'
  },
  HI: {
    // Top Bar
    govIndia: 'भारत सरकार · सांसद स्थानीय क्षेत्र विकास योजना (MPLADS) निगरानी',
    mospi: 'सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)',
    fontSize: 'फ़ॉन्ट आकार',
    
    // Header & Navigation
    appName: 'एमपीलैड्स सेंटिनल',
    appSubtitle: 'एआई ऑडिट प्राथमिकता · एसआईएच 2026',
    navHome: 'मुख्य पृष्ठ',
    navAbout: 'योजना के बारे में',
    navHow: 'कार्यप्रणाली',
    navSignals: 'पहचान संकेत (सिग्नल)',
    navDashboard: 'डैशबोर्ड',
    navProjects: 'परियोजनाएं',
    navDesk: 'जांच डेस्क',
    navLogin: 'लॉग इन',
    navSignOut: 'साइन आउट',
    
    // Hero
    heroTitlePrefix: 'एमपीलैड्स सेंटिनल:',
    heroTitleSuffix: 'बेहतर निगरानी',
    heroSubtitle: 'एआई द्वारा एमपीलैड्स निगरानी को प्रतिक्रियाशील ऑडिट से सक्रिय निर्णय-समर्थन में रूपांतरित करना।',
    enterSentinel: 'सेंटिनल में प्रवेश करें',
    exploreSystem: 'सिस्टम का अन्वेषण करें',
    trustBadge: 'व्याख्यात्मक एआई · मानव-निगरानी · साक्ष्य-समर्थित',
    docButton: 'दस्तावेज़ एवं वास्तुकला',
    
    // Telemetry
    parliamentarySeats: 'संसदीय सीटें',
    lokSabhaConst: 'लोकसभा निर्वाचन क्षेत्र',
    annualAllocation: 'वार्षिक आवंटन',
    perMpYear: 'प्रति माननीय सांसद / वर्ष',
    monitoredWorks: 'निगरानी अधीन कार्य',
    activeDatabase: 'सक्रिय योजना डेटाबेस',
    capitalAtRisk: 'जोखिम पूंजी',
    flaggedVerification: 'सत्यापन हेतु चिह्नित',
    criticalFlagged: 'गंभीर चिह्नित कार्य',
    stopWorkRule: 'स्कोर ≥ 80 (कार्य रोकें)',
    earlyWarning: 'प्रारंभिक चेतावनी',
    delayWarning: 'अनुमानित विलंब चेतावनी',
    
    // About
    statutoryMandate: 'वैधानिक जनादेश एवं संदर्भ',
    aboutTitle: 'एमपीलैड्स योजना और सेंटिनल की आवश्यकता',
    aboutDesc: 'सांसद स्थानीय क्षेत्र विकास योजना (एमपीलैड्स) माननीय सांसदों को स्थानीय आवश्यकताओं के आधार पर टिकाऊ सामुदायिक परिसंपत्तियों के निर्माण हेतु विकासात्मक कार्यों की अनुशंसा करने में सक्षम बनाती है।',
    card1Title: '1. टिकाऊ सामुदायिक अवसंरचना',
    card1Desc: 'MoSPI दिशानिर्देश अध्याय 3 के तहत अनिवार्य: सरकारी भूमि पर पेयजल परिसर, सार्वजनिक पुस्तकालय, स्कूल कक्षाएं, सामुदायिक शेड और ग्रामीण पहुंच सड़कों सहित ठोस, सार्वजनिक उपयोग की संपत्तियों का निर्माण।',
    card2Title: '2. 3-वर्षीय पोस्ट-मॉर्टम ऑडिट विलंब',
    card2Desc: 'पारंपरिक सीएजी और जिला ऑडिट फंड जारी होने के 24 से 36 महीने बाद ठेकेदार चूक, व्यय में वृद्धि और असत्यापित संपत्तियों की पहचान करते हैं, जिससे वित्तीय वसूली लगभग असंभव हो जाती है।',
    card3Title: '3. सक्रिय निर्णय-समर्थन समाधान',
    card3Desc: 'एमपीलैड्स सेंटिनल एक स्वायत्त सतर्कता सह-पायलट के रूप में कार्य करता है। यह वास्तविक समय में चल रही परियोजना डेटा का विश्लेषण करता है और भुगतान से पहले अधिकारियों को जांच डेस्क उपलब्ध कराता है।',
    
    // How it works
    pipelineBadge: '4-चरणीय निगरानी पाइपलाइन',
    howTitle: 'एमपीलैड्स सेंटिनल कैसे कार्य करता है',
    howDesc: 'ई-साक्षी के कच्चे डेटा अंतर्ग्रहण से लेकर लक्षित वैधानिक समाधान तक',
    step1Num: 'कदम 01',
    step1Title: 'डेटा अंतर्ग्रहण व मानकीकरण',
    step1Desc: 'ई-साक्षी से स्वीकृति राशि, व्यय किश्तें, चरणबद्ध प्रगति प्रतिशत और जीपीएस निर्देशांक प्राप्त करता है।',
    step2Num: 'कदम 02',
    step2Title: 'बहु-सिग्नल एआई स्कैनिंग',
    step2Desc: '5 विश्लेषणात्मक मॉडल एक साथ चलाता है: प्रगति विचलन, एलओएफ लागत विसंगति, बेनफोर्ड वाउचर विश्लेषण, हैवरसाइन जीआईएस और ठेकेदार संतृप्ति।',
    step3Num: 'कदम 03',
    step3Title: 'समग्र जोखिम प्राथमिकता',
    step3Desc: 'प्रत्येक परियोजना को 0-100 समग्र जोखिम स्कोर प्रदान करता है और कार्यों को गंभीर (≥80), उच्च (60-79), मध्यम व निम्न श्रेणियों में वर्गीकृत करता है।',
    step4Num: 'कदम 04',
    step4Title: 'जांच डेस्क एवं प्रवर्तन',
    step4Desc: 'नोडल अधिकारी स्पष्ट ऑडिट ट्रिगर्स की समीक्षा करते हैं, फंड वितरण रोकते हैं, स्थलीय निरीक्षण भेजते हैं और गैर-खंडन योग्य ऑडिट लॉग दर्ज करते हैं।',
    
    // Signals
    radarBadge: 'खुफिया रडार',
    signalsTitle: '5 प्रमुख एल्गोरिथम पहचान संकेत',
    signalsDesc: 'परियोजना स्वास्थ्य की निरंतर लेखापरीक्षा करने वाले गणितीय, सांख्यिकीय और स्थानिक इंजन',
    sig1Badge: 'गंभीर संकेत',
    sig1Title: '1. प्रगति-व्यय असमानता विचलन',
    sig1Desc: 'उन कार्यों की पहचान करता है जहां संचयी वित्तीय वितरण भौतिक प्रगति से 25% से अधिक आगे निकल जाता है। बिना सत्यापित माप पुस्तिका (MB) के ठेकेदार अग्रिम भुगतान रोकता है।',
    sig1Formula: 'सूत्र: अंतर = निधि उपयोग% - भौतिक प्रगति%',
    sig2Badge: 'उच्च ध्यान',
    sig2Title: '2. लोकल आउटलायर फैक्टर (LOF) लागत विसंगति',
    sig2Desc: 'समान जिले में समान कार्यों के 3-वर्षीय ऐतिहासिक औसत से स्वीकृत बजट की तुलना करता है। अत्यधिक अनुमानित लागत को चिह्नित करता है (उदा. +39.5% लागत अंतर)।',
    sig2Formula: 'एल्गोरिदम: LOF(k=20) लागत बनाम दायरा और क्षेत्रीय औसत',
    sig3Badge: 'फोरेंसिक ऑडिट',
    sig3Title: '3. बेनफोर्ड नियम वाउचर फोरेंसिक',
    sig3Desc: 'ठेकेदार वितरण वाउचर राशियों के प्रथम-अंक आवृत्ति वितरण का विश्लेषण करता है। उच्च निविदा अनुमोदन सीमा से बचने के लिए विभाजित कृत्रिम लेनदेन को चिह्नित करता है।',
    sig3Formula: 'मॉडल: Chi-Square P-Value on Log10(1 + 1/d)',
    sig4Badge: 'भू-स्थानिक ऑडिट',
    sig4Title: '4. भू-स्थानिक ओवरलैप एवं निकटता स्कैनर',
    sig4Desc: 'जीपीएस निर्देशांक के चारों ओर 500 मी से 3 किमी त्रिज्या को स्कैन करता है और समान सड़कों, नलकूपों या शेडों के दोहरे वित्तपोषण को रोकता है।',
    sig4Formula: 'इंजन: हैवरसाइन भू-दूरी ≤ 500 मी बफ़र',
    sig5Badge: 'अवरोध रडार',
    sig5Title: '5. ठेकेदार संतृप्ति एवं एकाधिकार',
    sig5Desc: 'एक ही तहसील में अत्यधिक समवर्ती सक्रिय कार्यों (>5 कार्य) और >40% ऐतिहासिक विलंब वाले सिविल ठेकेदारों की पहचान कर संभावित देरी का पूर्वानुमान लगाता है।',
    sig5Formula: 'मीट्रिक: सक्रिय कार्य संकेंद्रण एवं विलंब दर',
    uniqBadge: 'सिस्टम की विशिष्टता',
    uniqTitle: 'सक्रिय एआई बनाम निष्क्रिय ई-साक्षी',
    uniqDesc: 'जबकि ई-साक्षी लिपिकों द्वारा दर्ज डेटा को केवल संग्रहीत करता है, सेंटिनल फंड के नुकसान से पहले कार्रवाई योग्य धोखाधड़ी जोखिमों को उजागर करता है।',
    viewPriorityQueue: 'प्राथमिकता कतार देखें',
    
    // Roles
    rolesTitle: 'भूमिका-आधारित संचालन पोर्टल',
    rolesDesc: 'मंत्रालय, राज्य, जिला और सांसद कार्यप्रवाह के लिए विशेष रूप से कॉन्फ़िगर किया गया',
    roleMp: 'माननीय सांसद',
    roleMpDesc: 'संसदीय क्षेत्र कॉकपिट, कोटा उपयोग, प्रदत्त सामुदायिक परिसंपत्तियां और वास्तविक समय कार्य ट्रैकिंग।',
    roleDistrict: 'जिला प्राधिकरण',
    roleDistrictDesc: 'पूर्ण परिचालन प्रवर्तन, माप पुस्तिका (MB) सत्यापन, ठेकेदार संवीक्षा और जांच डेस्क प्रेषण।',
    roleState: 'राज्य नोडल प्राधिकरण',
    roleStateDesc: 'अंतर-जिला प्रगति तुलना, राज्यव्यापी निधि प्रवाह वेग और अवसंरचना वितरण निगरानी।',
    roleMinistry: 'मंत्रालय (MoSPI)',
    roleMinistryDesc: 'अखिल भारतीय निगरानी, राष्ट्रीय गंभीर जोखिम रैंकिंग, नीति अनुपालन और केंद्रीय ऑडिट डोजियर।',
    
    // Documentation Modal
    docModalTitle: 'एमपीलैड्स सेंटिनल दस्तावेज़ एवं वास्तुकला',
    docArchTitle: 'सिस्टम वास्तुकला अवलोकन',
    docArchDesc: 'एमपीलैड्स सेंटिनल को रिएक्ट 18 एसपीए फ्रंटएंड, स्प्रिंग बूट 3 (जावा 21) एंटरप्राइज बैकएंड और पायथन फास्टएपीआई विश्लेषणात्मक इंजनों के साथ डिकपल्ड माइक्रोसर्विसेज आर्किटेक्चर पर तैयार किया गया है। यह 0–100 समग्र जोखिम स्कोर प्रदान करता है।',
    docStatTitle: 'वैधानिक अनुपालन:',
    docStatDesc: 'MoSPI संशोधित MPLADS दिशानिर्देश (फरवरी 2023), सामान्य वित्तीय नियम (GFR 2017 नियम 238), और केंद्रीय सतर्कता आयोग (CVC) सार्वजनिक खरीद मानदंडों के कड़े अनुपालन में निर्मित।',
    docDeskTitle: 'जांच डेस्क जीवनचक्र',
    docDeskDesc: '7-चरणीय गैर-खंडन योग्य ऑडिट कार्यप्रवाह: चिह्नित → समीक्षाधीन → दस्तावेज़ अनुरोध → स्थलीय निरीक्षण → निष्कर्ष दर्ज → सुधारात्मक कार्रवाई → निस्तारित।',
    closeDoc: 'दस्तावेज़ बंद करें',
    
    // Footer
    footerTitle: 'एमपीलैड्स सेंटिनल — स्वायत्त सतर्कता एवं ऑडिट प्राथमिकता प्रणाली',
    footerSub: 'सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI), भारत सरकार के लिए विकसित।',
    footerSih: 'स्मार्ट इंडिया हैकथॉन 2026 प्रोटोटाइप',
    footerGfr: 'वैधानिक अनुपालन: जीएफआर 2017 नियम 238',
    footerPrivacy: 'गोपनीयता नीति',
    footerTerms: 'उपयोग की शर्तें',
    footerGuidelines: 'दिशानिर्देश',
    footerPortal: 'भारत का राष्ट्रीय पोर्टल',
    rightsReserved: 'सर्वाधिकार सुरक्षित।'
  }
};

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  // Initialize language from localStorage or default to 'EN'
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('mplads_lang') || 'EN';
  });

  // Initialize font size scale: 'sm' | 'normal' | 'lg'
  const [fontSizeScale, setFontSizeScaleState] = useState(() => {
    return localStorage.getItem('mplads_font_size') || 'normal';
  });

  // Apply font size scale to document root element
  const setFontSizeScale = (scale) => {
    setFontSizeScaleState(scale);
    localStorage.setItem('mplads_font_size', scale);
  };

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('mplads_lang', newLang);
  };

  useEffect(() => {
    if (fontSizeScale === 'sm') {
      document.documentElement.style.fontSize = '14px'; // Accessible smaller scale
    } else if (fontSizeScale === 'lg') {
      document.documentElement.style.fontSize = '18.5px'; // Accessible larger scale
    } else {
      document.documentElement.style.fontSize = '16px'; // Default normal scale
    }
  }, [fontSizeScale]);

  useEffect(() => {
    document.documentElement.lang = lang === 'HI' ? 'hi' : 'en';
  }, [lang]);

  const t = translations[lang] || translations.EN;
  const isHindi = lang === 'HI';

  return (
    <AccessibilityContext.Provider
      value={{
        lang,
        setLang,
        fontSizeScale,
        setFontSizeScale,
        t,
        isHindi
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    return {
      lang: 'EN',
      setLang: () => {},
      fontSizeScale: 'normal',
      setFontSizeScale: () => {},
      t: translations.EN,
      isHindi: false
    };
  }
  return context;
}
