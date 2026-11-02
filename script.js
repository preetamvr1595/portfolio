/* ==========================================================================
   PREETHAM V R — SCRIPT LOGIC & INTERACTIVITY
   Exact Matching of christendijoux.com Interactions, Animations & Canvases
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. PRELOADER / SHELL COUNTER (000 -> 100)
  const shell = document.getElementById('shell');
  const shellCount = document.getElementById('shell-count');
  const shellBar = document.getElementById('shell-bar');
  let count = 0;

  const countInterval = setInterval(() => {
    count += Math.floor(Math.random() * 8) + 3;
    if (count >= 100) {
      count = 100;
      clearInterval(countInterval);
      if (shellCount) shellCount.textContent = '100';
      if (shellBar) shellBar.style.transform = 'scaleX(1)';
      setTimeout(() => {
        if (shell) shell.classList.add('done');
      }, 400);
    } else {
      const padded = ('00' + count).slice(-3);
      if (shellCount) shellCount.textContent = padded;
      if (shellBar) shellBar.style.transform = `scaleX(${count / 100})`;
    }
  }, 45);


  // 2. LIVE LOCAL TIME CLOCK (IST / Davangere)
  const clockEl = document.getElementById('localClock');
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    const timeStr = now.toLocaleTimeString('en-US', options).replace(':', ' ');
    clockEl.textContent = timeStr;
  }
  updateClock();
  setInterval(updateClock, 1000);


  // 3. INTERACTIVE 3D DITHERED HERO SPHERE CANVAS
  let heroSpinSpeed = 1.0;
  const heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let width, height, cx, cy;
    let mouseX = 0, mouseY = 0;
    let targetRotX = 0, targetRotY = 0;
    let rotX = 0.3, rotY = 0;

    function resizeHero() {
      width = heroCanvas.parentElement.offsetWidth;
      height = heroCanvas.parentElement.offsetHeight;
      heroCanvas.width = width * window.devicePixelRatio;
      heroCanvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      cx = width / 2;
      cy = height / 2;
    }
    resizeHero();
    window.addEventListener('resize', resizeHero);

    window.addEventListener('mousemove', (e) => {
      const rect = heroCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left - cx;
      const y = e.clientY - rect.top - cy;
      targetRotY = (x / width) * 1.5;
      targetRotX = -(y / height) * 1.5;
    });

    const numPoints = 850;
    const points = [];
    const radius = Math.min(width, height) * 0.38;

    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(-1 + (2 * i) / numPoints);
      const theta = Math.sqrt(numPoints * Math.PI) * phi;
      points.push({
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi)
      });
    }

    function renderHero() {
      ctx.clearRect(0, 0, width, height);
      rotX += (targetRotX - rotX) * 0.05 + 0.001 * heroSpinSpeed;
      rotY += (targetRotY - rotY) * 0.05 + 0.003 * heroSpinSpeed;

      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

      points.forEach(pt => {
        let x1 = pt.x * cosY + pt.z * sinY;
        let z1 = -pt.x * sinY + pt.z * cosY;

        let y2 = pt.y * cosX - z1 * sinX;
        let z2 = pt.y * sinX + z1 * cosX;

        const fov = 420;
        const scale = fov / (fov + z2);
        const px = cx + x1 * scale;
        const py = cy + y2 * scale;

        if (z2 > -fov) {
          const alpha = Math.max(0.08, (z2 + radius) / (2 * radius));
          const size = Math.max(0.8, scale * 1.6);
          ctx.fillStyle = `rgba(242, 242, 238, ${alpha * 0.85})`;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      requestAnimationFrame(renderHero);
    }
    requestAnimationFrame(renderHero);
  }


  // 4. INTERACTIVE 3D JOURNEY GLOBE CANVAS (Christen Dijoux exact feature)
  const journeyCanvas = document.getElementById('journeyGlobeCanvas');
  if (journeyCanvas) {
    const jCtx = journeyCanvas.getContext('2d');
    let jW, jH, jCx, jCy;
    let jRotY = 0;

    function resizeJourney() {
      jW = journeyCanvas.parentElement.offsetWidth;
      jH = journeyCanvas.parentElement.offsetHeight;
      journeyCanvas.width = jW * window.devicePixelRatio;
      journeyCanvas.height = jH * window.devicePixelRatio;
      jCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
      jCx = jW / 2;
      jCy = jH / 2;
    }
    resizeJourney();
    window.addEventListener('resize', resizeJourney);

    const jPoints = [];
    const jNum = 650;
    const jRadius = Math.min(jW, jH) * 0.36;

    for (let i = 0; i < jNum; i++) {
      const phi = Math.acos(-1 + (2 * i) / jNum);
      const theta = Math.sqrt(jNum * Math.PI) * phi;
      jPoints.push({
        x: jRadius * Math.cos(theta) * Math.sin(phi),
        y: jRadius * Math.sin(theta) * Math.sin(phi),
        z: jRadius * Math.cos(phi)
      });
    }

    function renderJourneyGlobe() {
      jCtx.clearRect(0, 0, jW, jH);
      jRotY += 0.005;

      const cosY = Math.cos(jRotY), sinY = Math.sin(jRotY);
      const cosX = Math.cos(0.25), sinX = Math.sin(0.25);

      // Render latitude/orbit lines
      jCtx.strokeStyle = 'rgba(242, 242, 238, 0.1)';
      jCtx.lineWidth = 1;
      jCtx.beginPath();
      jCtx.ellipse(jCx, jCy, jRadius * 1.05, jRadius * 0.35, -0.2, 0, Math.PI * 2);
      jCtx.stroke();

      jPoints.forEach(pt => {
        let x1 = pt.x * cosY + pt.z * sinY;
        let z1 = -pt.x * sinY + pt.z * cosY;

        let y2 = pt.y * cosX - z1 * sinX;
        let z2 = pt.y * sinX + z1 * cosX;

        const fov = 380;
        const scale = fov / (fov + z2);
        const px = jCx + x1 * scale;
        const py = jCy + y2 * scale;

        if (z2 > -fov) {
          const alpha = Math.max(0.1, (z2 + jRadius) / (2 * jRadius));
          jCtx.fillStyle = `rgba(242, 242, 238, ${alpha * 0.9})`;
          jCtx.beginPath();
          jCtx.arc(px, py, scale * 1.4, 0, Math.PI * 2);
          jCtx.fill();
        }
      });

      // Target pin for Davangere / India
      const pinX = jRadius * 0.6 * Math.cos(jRotY);
      const pinZ = jRadius * 0.6 * Math.sin(jRotY);
      if (pinZ > 0) {
        const pinPx = jCx + pinX;
        const pinPy = jCy - jRadius * 0.25;
        jCtx.fillStyle = '#22c55e';
        jCtx.beginPath();
        jCtx.arc(pinPx, pinPy, 4, 0, Math.PI * 2);
        jCtx.fill();

        jCtx.strokeStyle = 'rgba(34, 197, 94, 0.5)';
        jCtx.beginPath();
        jCtx.arc(pinPx, pinPy, 8 + Math.sin(Date.now() * 0.005) * 3, 0, Math.PI * 2);
        jCtx.stroke();
      }

      requestAnimationFrame(renderJourneyGlobe);
    }
    requestAnimationFrame(renderJourneyGlobe);
  }


  // 5. GENERATIVE PILLAR CANVASES (Radial Rays, Topographic Wave, Matrix Map)

  // Pillar 1: Radial Ray Singularity Canvas
  const rayCanvas = document.getElementById('radialRayCanvas');
  if (rayCanvas) {
    const rCtx = rayCanvas.getContext('2d');
    let rW, rH, rAngle = 0;

    function resizeRay() {
      rW = rayCanvas.parentElement.offsetWidth;
      rH = rayCanvas.parentElement.offsetHeight;
      rayCanvas.width = rW * window.devicePixelRatio;
      rayCanvas.height = rH * window.devicePixelRatio;
      rCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resizeRay();
    window.addEventListener('resize', resizeRay);

    function renderRays() {
      rCtx.clearRect(0, 0, rW, rH);
      const cx = rW / 2;
      const cy = rH / 2;
      rAngle += 0.003;

      const numRays = 180;
      for (let i = 0; i < numRays; i++) {
        const theta = (i / numRays) * Math.PI * 2 + rAngle;
        const len = Math.max(rW, rH) * 0.65 + Math.sin(theta * 8 + rAngle * 5) * 20;
        const alpha = 0.08 + Math.abs(Math.sin(theta * 4)) * 0.45;

        rCtx.strokeStyle = `rgba(242, 242, 238, ${alpha})`;
        rCtx.lineWidth = 1;
        rCtx.beginPath();
        rCtx.moveTo(cx + Math.cos(theta) * 28, cy + Math.sin(theta) * 28);
        rCtx.lineTo(cx + Math.cos(theta) * len, cy + Math.sin(theta) * len);
        rCtx.stroke();
      }

      // Center ring
      rCtx.strokeStyle = '#f2f2ee';
      rCtx.lineWidth = 2;
      rCtx.beginPath();
      rCtx.arc(cx, cy, 26, 0, Math.PI * 2);
      rCtx.stroke();

      requestAnimationFrame(renderRays);
    }
    requestAnimationFrame(renderRays);
  }

  // Pillar 2: Topographic Wave Canvas (Joy Division Style)
  const waveCanvas = document.getElementById('topoWaveCanvas');
  if (waveCanvas) {
    const wCtx = waveCanvas.getContext('2d');
    let wW, wH, wTime = 0;

    function resizeWave() {
      wW = waveCanvas.parentElement.offsetWidth;
      wH = waveCanvas.parentElement.offsetHeight;
      waveCanvas.width = wW * window.devicePixelRatio;
      waveCanvas.height = wH * window.devicePixelRatio;
      wCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resizeWave();
    window.addEventListener('resize', resizeWave);

    function renderWave() {
      wCtx.clearRect(0, 0, wW, wH);
      wTime += 0.02;

      const lines = 18;
      const stepY = (wH - 60) / lines;
      wCtx.lineWidth = 1.2;

      for (let j = 0; j < lines; j++) {
        const baseY = 40 + j * stepY;
        wCtx.beginPath();
        wCtx.strokeStyle = `rgba(242, 242, 238, ${0.25 + (j / lines) * 0.65})`;

        for (let x = 0; x <= wW; x += 10) {
          const normX = (x - wW / 2) / (wW * 0.35);
          const bell = Math.exp(-normX * normX * 2);
          const wave = Math.sin(normX * 6 + wTime + j * 0.4) * 25 * bell;
          const y = baseY - wave;

          if (x === 0) wCtx.moveTo(x, y);
          else wCtx.lineTo(x, y);
        }
        wCtx.stroke();
      }

      requestAnimationFrame(renderWave);
    }
    requestAnimationFrame(renderWave);
  }

  // Pillar 3: Matrix Map Canvas
  const mapCanvas = document.getElementById('matrixMapCanvas');
  if (mapCanvas) {
    const mCtx = mapCanvas.getContext('2d');
    let mW, mH, mTime = 0;

    function resizeMap() {
      mW = mapCanvas.parentElement.offsetWidth;
      mH = mapCanvas.parentElement.offsetHeight;
      mapCanvas.width = mW * window.devicePixelRatio;
      mapCanvas.height = mH * window.devicePixelRatio;
      mCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resizeMap();
    window.addEventListener('resize', resizeMap);

    function renderMap() {
      mCtx.clearRect(0, 0, mW, mH);
      mTime += 0.03;

      const cols = Math.floor(mW / 16);
      const rows = Math.floor(mH / 16);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * 16 + 8;
          const y = r * 16 + 8;
          const d = Math.sin(c * 0.15 + mTime) * Math.cos(r * 0.15 + mTime);
          const alpha = Math.max(0.04, Math.abs(d) * 0.7);

          mCtx.fillStyle = `rgba(242, 242, 238, ${alpha})`;
          mCtx.beginPath();
          mCtx.arc(x, y, 1.2, 0, Math.PI * 2);
          mCtx.fill();
        }
      }

      requestAnimationFrame(renderMap);
    }
    requestAnimationFrame(renderMap);
  }


  // 6. FOOTER TOPOGRAPHIC WIREFRAME WAVE CANVAS (Christen Dijoux exact footer)
  const footerWaveCanvas = document.getElementById('footerWaveCanvas');
  if (footerWaveCanvas) {
    const fCtx = footerWaveCanvas.getContext('2d');
    let fW, fH, fTime = 0;

    function resizeFooterWave() {
      fW = footerWaveCanvas.parentElement.offsetWidth;
      fH = footerWaveCanvas.parentElement.offsetHeight;
      footerWaveCanvas.width = fW * window.devicePixelRatio;
      footerWaveCanvas.height = fH * window.devicePixelRatio;
      fCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resizeFooterWave();
    window.addEventListener('resize', resizeFooterWave);

    function renderFooterWave() {
      fCtx.clearRect(0, 0, fW, fH);
      fTime += 0.015;

      const lines = 14;
      const stepY = (fH - 20) / lines;
      fCtx.lineWidth = 1;

      for (let j = 0; j < lines; j++) {
        const baseY = 20 + j * stepY;
        fCtx.beginPath();
        fCtx.strokeStyle = `rgba(242, 242, 238, ${0.15 + (j / lines) * 0.5})`;

        for (let x = 0; x <= fW; x += 12) {
          const normX = (x - fW / 2) / (fW * 0.38);
          const bell = Math.exp(-normX * normX * 1.8);
          const wave = Math.sin(normX * 8 + fTime + j * 0.35) * 24 * bell;
          const y = baseY - wave;

          if (x === 0) fCtx.moveTo(x, y);
          else fCtx.lineTo(x, y);
        }
        fCtx.stroke();
      }

      requestAnimationFrame(renderFooterWave);
    }
    requestAnimationFrame(renderFooterWave);
  }


  // 7. INTERACTIVE STAR HUNTER EASTER EGG (Christen Dijoux signature)
  const starBtns = [
    document.getElementById('starBtn1'),
    document.getElementById('starBtn2'),
    document.getElementById('starBtn3')
  ];
  const starCounter = document.getElementById('starCounter');
  let starsFound = new Set();

  starBtns.forEach((btn, index) => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      playSyntheticClick();
      if (starsFound.has(index)) {
        starsFound.delete(index);
        btn.textContent = '☆';
        btn.classList.remove('starred');
      } else {
        starsFound.add(index);
        btn.textContent = '★';
        btn.classList.add('starred');
        showToast(`Found star ${starsFound.size} of 3! ★`);
        if (starsFound.size === 3) {
          setTimeout(() => {
            showToast('✦✦✦ All 3 stars collected! Secret unlocked.');
          }, 600);
        }
      }
      if (starCounter) starCounter.textContent = starsFound.size;
    });
  });

  function showToast(msg) {
    const existing = document.querySelector('.custom-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.style.cssText = `
      position: fixed;
      top: 64px;
      right: 24px;
      z-index: 1000;
      background: #050505;
      color: #f2f2ee;
      border: 1px solid rgba(242, 242, 238, 0.4);
      padding: 8px 16px;
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      box-shadow: 0 4px 20px rgba(0,0,0,0.8);
      animation: fadeIn 0.3s ease;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 2400);
  }


  // 8. LANGUAGE SWITCHER TOGGLE
  const langFrBtn = document.getElementById('langFrBtn');
  const langEnBtn = document.getElementById('langEnBtn');
  if (langFrBtn && langEnBtn) {
    langFrBtn.addEventListener('click', () => {
      langFrBtn.classList.add('active');
      langEnBtn.classList.remove('active');
      showToast('Version française sélectionnée');
    });
    langEnBtn.addEventListener('click', () => {
      langEnBtn.classList.add('active');
      langFrBtn.classList.remove('active');
      showToast('English version selected');
    });
  }


  // 9. EXPANDED PROJECTS DATA (10 Core Projects from GitHub & Live Deployments)
  const projectsData = [
    {
      id: '01',
      title: 'F1 Race Predictor — Live API & Telemetry ML Pipeline',
      category: 'APPLIED MACHINE LEARNING · REAL-TIME DATA PIPELINES',
      year: '2026',
      github: 'https://github.com/preetamvr1595/F1-Race-Predictor-Live-API-Data-Pipeline',
      live: 'https://f1-race-predictor-live-api-data-pipeline.onrender.com',
      filter: 'ml',
      overview: 'An end-to-end real-time telemetry streaming and predictive machine learning pipeline for Formula 1 races. Ingests live telemetry APIs, cleans weather and tire degradation feeds, extracts delta pacing features, and predicts podium finishes using gradient-boosted ensembles.',
      features: [
        'Live API ingestion pipeline processing official lap times, driver sectors, and tire compound degradation in real time.',
        'Feature engineering incorporating rolling tire degradation slopes, historical driver circuit performance, and safety car probability.',
        'Ensemble classification and regression models benchmarked with low inference latency (<18ms).',
        'Deployed to Render production with interactive dashboard and real-time inference endpoints.'
      ],
      stack: ['Python', 'FastF1 API', 'Scikit-learn', 'XGBoost', 'Feature Engineering', 'Docker', 'Render']
    },
    {
      id: '02',
      title: 'NexusDesk — Multi-Agent AI IT Service Desk',
      category: 'AUTONOMOUS AI AGENTS · LLMS & LANGGRAPH',
      year: '2026',
      github: 'https://github.com/preetamvr1595/NexusDesk-AI-IT-Service-Desk',
      filter: 'agents',
      overview: 'Autonomous multi-agent enterprise IT Service Management architecture powered by LangGraph, LangChain, Flask, and local Ollama inference. Autonomous specialized agents route incidents, run diagnostics, query knowledge bases, and resolve software/hardware faults.',
      features: [
        'Multi-agent graph workflow: Router Agent -> Triage Agent -> Knowledge Retrieval Agent -> Resolution Agent.',
        'Graph state memory maintaining session context, severity triage, and human-in-the-loop escalation paths.',
        'Local offline inference powered by Ollama models for privacy-preserving enterprise deployment.',
        'Automated ticket lifecycle management with structured JSON API outputs.'
      ],
      stack: ['LangGraph', 'LangChain', 'Multi-Agent Systems', 'Ollama', 'Flask', 'Python', 'Vector DB']
    },
    {
      id: '03',
      title: 'AI-Detection & Content Humanizer Platform',
      category: 'NATURAL LANGUAGE PROCESSING · ML & STYLISTICS',
      year: '2026',
      github: 'https://github.com/preetamvr1595/AI-Detection-Humanizer',
      filter: 'nlp',
      overview: 'Machine learning pipeline and web application designed to analyze AI-generated text, compute linguistic entropy, perplexity, and burstiness distributions, and rewrite robotic syntax into natural human-like prose.',
      features: [
        'Linguistic feature extraction calculating cross-token perplexity, n-gram burstiness, and sentence length variance.',
        'Supervised classifier distinguishing between LLM outputs (GPT-4, Claude) and genuine human writing.',
        'Style-transfer humanizer rewriting syntax, injecting rhythm, and eliminating repetitive semantic patterns.',
        'Interactive side-by-side text analysis dashboard with real-time probability scoring.'
      ],
      stack: ['Python', 'NLP', 'Scikit-learn', 'Perplexity Scoring', 'Tokenization', 'FastAPI']
    },
    {
      id: '04',
      title: 'Mental Health AI Companion & Empathy Engine',
      category: 'CONVERSATIONAL AI · EMOTION & SENTIMENT',
      year: '2026',
      github: 'https://github.com/preetamvr1595/-Mental-Health-Chatbot',
      filter: 'agents',
      overview: 'An empathetic conversational agent designed to overcome cold, clinical chatbot responses. Bridges the gap between automated availability and human emotional validation by analyzing sentiment valence and emotional distress signals.',
      features: [
        'Multi-label emotion detection classifying distress, frustration, anxiety, and burnout from free-form user text.',
        'Adaptive psychological validation templates offering non-judgmental, compassionate active-listening responses.',
        'Crisis trigger keyword detection with immediate safety hotline escalation protocols.',
        'Interactive real-time chat interface with mood timeline visualization.'
      ],
      stack: ['TypeScript', 'Conversational AI', 'Sentiment Analysis', 'Emotion Classification', 'REST API']
    },
    {
      id: '05',
      title: 'Diabetic Retinopathy — Medical Computer Vision Screening',
      category: 'DEEP LEARNING & HEALTHCARE AI',
      year: '2026',
      github: 'https://github.com/preetamvr1595/Diabetic-Retinopathy-Novel-Filter',
      filter: 'vision',
      overview: 'High-stakes computer vision deep learning model designed for automated medical screening, analyzing high-resolution retinal fundus imagery to grade microaneurysms, hemorrhages, and exudates across 5 clinical severity stages.',
      features: [
        'Novel contrast normalization pipeline applying Contrast Limited Adaptive Histogram Equalization (CLAHE) and circular optic disc masks.',
        'Convolutional Neural Network architecture with transfer learning baselines and spatial attention mechanisms.',
        'Categorization across 5 severity stages (No DR, Mild, Moderate, Severe, Proliferative).',
        'Rigorous evaluation reporting ROC-AUC of 0.94 and high Quadratic Weighted Kappa validation.'
      ],
      stack: ['PyTorch', 'Computer Vision', 'CNNs', 'OpenCV', 'CLAHE Filtering', 'Healthcare AI']
    },
    {
      id: '06',
      title: 'InsightAI — Enterprise Analytics & Automated EDA',
      category: 'DATA ANALYTICS & VISUALIZATION',
      year: '2026',
      github: 'https://github.com/preetamvr1595/InsightAI-Analytics',
      filter: 'saas',
      overview: 'An end-to-end automated exploratory data analysis and visual intelligence platform that eliminates boilerplate data wrangling, extracting statistical patterns, correlations, and distribution anomalies from tabular datasets.',
      features: [
        'Automated exploratory pipelines: automatic type inference, missing value imputation, and correlation heatmaps.',
        'Statistical distribution analysis identifying skewness, kurtosis, and multi-collinear variables.',
        'High-density visualization dashboard translating raw features into executive summary graphics.',
        'Exportable analytical reports with zero configuration.'
      ],
      stack: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Automated EDA', 'Power BI']
    },
    {
      id: '07',
      title: 'Bengaluru Real Estate — Valuation & Outlier Engineering ML',
      category: 'MACHINE LEARNING & PIPELINES',
      year: '2026',
      github: 'https://github.com/preetamvr1595/bengaluru-real-estate-analytics-ml',
      filter: 'ml',
      overview: 'Robust machine learning valuation engine engineered on 13,000+ real estate records. Incorporates rigorous data cleaning, location-based standard deviation outlier removal, one-hot encoding across 200+ micro-locations, and linear regression modeling.',
      features: [
        'Custom feature cleaning converting mixed area units, divergent BHK configurations, and noisy price fields.',
        'Location-grouped outlier filtering removing extreme price-per-square-foot anomalies.',
        'Dimensionality reduction and one-hot encoding across 200+ micro-locations using frequency thresholds.',
        'Linear regression and ensemble baseline benchmarking with validated RMSE and R2 scores.'
      ],
      stack: ['Scikit-learn', 'Feature Engineering', 'Outlier Filtering', 'EDA', 'Python', 'FastAPI']
    },
    {
      id: '08',
      title: 'Luxury E-Commerce Jewellery Platform',
      category: 'FULL-STACK E-COMMERCE & WEB APPLICATION',
      year: '2026',
      github: 'https://github.com/preetamvr1595/jewellers',
      live: 'https://jewellers-q3kn.onrender.com',
      filter: 'saas',
      overview: 'High-performance e-commerce and showcase platform built for luxury jewellery retail, featuring live gold rate calculation, diamond carat categorization, interactive catalog filtering, responsive showcase galleries, and modern micro-animations.',
      features: [
        'Direct live web store deployed on Render cloud with lightning-fast initial load and responsive layout.',
        'Filtered jewelry catalog by material (Gold, Diamond, Platinum), purity, and collection types.',
        'Dynamic pricing module reflecting live precious metals rates and craftsmanship weight calculations.',
        'Sleek modern editorial user experience tailored for high-end luxury retail presentation.'
      ],
      stack: ['JavaScript', 'HTML5', 'Modern CSS', 'Responsive UI/UX', 'Cloud Deployment', 'Render']
    },
    {
      id: '09',
      title: 'WhatsApp CRM & Omnichannel Broadcast Engine',
      category: 'SAAS PLATFORM & API AUTOMATION',
      year: '2026',
      github: 'https://github.com/preetamvr1595/whatsapp-crm',
      filter: 'saas',
      overview: 'Self-hostable WhatsApp CRM built with Next.js 16, Supabase, and Meta Cloud API. Features a shared team inbox, customer CDP, sales pipelines, mass broadcast scheduler, no-code automations, and interactive WhatsApp chat flows.',
      features: [
        'Direct Meta Cloud API webhook integration for instantaneous two-way messaging and media handling.',
        'Shared collaborative team inbox with agent assignments, internal notes, and conversation tags.',
        'Customer data platform (CDP) tracking interaction history, order statuses, and pipeline stages.',
        'Automated broadcast messaging engine complying with Meta opt-in policies and rate limits.'
      ],
      stack: ['Next.js 16', 'TypeScript', 'Supabase', 'Meta Cloud API', 'Webhooks', 'TailwindCSS']
    },
    {
      id: '10',
      title: 'SANJEEVANI-X (UB-1104) — AI Emergency Response Grid',
      category: 'EMERGENCY AI & VISUAL ENHANCEMENT',
      year: '2026',
      github: 'https://github.com/preetamvr1595/UB-1104',
      filter: 'vision',
      overview: 'Ultra-advanced AI emergency grid designed for situational awareness, real-time visual enhancement under degraded low-light/fog conditions, and rapid geo-spatial emergency dispatching.',
      features: [
        'Real-time image contrast and luminance enhancement for emergency camera feeds.',
        'Spatial clustering of incoming emergency incident pings for prioritized dispatch triage.',
        'Interactive HUD situational awareness grid for emergency response coordination.',
        'Modular architecture ready for edge device deployment in emergency vehicles.'
      ],
      stack: ['Computer Vision', 'Deep Learning', 'Emergency AI', 'Image Enhancement', 'JavaScript']
    }
  ];

  const projectModal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalTag = document.getElementById('modalTag');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');
  const modalGithub = document.getElementById('modalGithub');

  function openProjectModal(index) {
    const p = projectsData[index];
    if (!p || !projectModal) return;

    modalTag.textContent = `${p.id} / 10 · ${p.category} · ${p.year}`;
    modalTitle.textContent = p.title;

    let html = `
      <p style="margin-bottom: 16px; font-size: 15px; color: var(--paper);">${p.overview}</p>
      <h4>Key Technical Highlights</h4>
      <ul>
        ${p.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
      <h4>Technologies & Toolkit</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
        ${p.stack.map(s => `<span class="chip">${s}</span>`).join('')}
      </div>
      ${p.live ? `
      <div style="margin-top: 20px;">
        <a class="btn-solid btn-live-accent" href="${p.live}" target="_blank" rel="noreferrer" style="display: inline-flex; align-items: center; gap: 8px;">
          LAUNCH LIVE APPLICATION ↗
        </a>
      </div>
      ` : ''}
    `;

    modalContent.innerHTML = html;
    modalGithub.href = p.github;
    projectModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (projectModal) {
      projectModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (modalClose) modalClose.addEventListener('click', closeProjectModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProjectModal();
  });

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = parseInt(btn.getAttribute('data-project-index'), 10);
      openProjectModal(idx);
    });
  });

  // Projects Category Filter Handler
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-slide');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filter === 'all' || cardCategory === filter || (filter === 'ml' && (cardCategory === 'ml' || cardCategory === 'vision'))) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 10. 3D INTERACTIVE PLOPPY ROBOT AGENT (Exact match with user image & mouse tracking)
  const robotCanvas = document.getElementById('ploppyRobotCanvas');
  const speechBubble = document.getElementById('ploppySpeechBubble');
  let ploppyBlink = false;
  let ploppyBounce = 0;
  let ploppySpeechIndex = 0;
  const ploppyPhrases = [
    "Tracking cursor coordinates... Neural pipelines running at 100%!",
    "F1 Race Predictor API is streaming live telemetry. Inference: 14ms.",
    "NexusDesk multi-agent graph loaded: LangGraph & LangChain active.",
    "Retinal fundus computer vision model ready. ROC-AUC: 0.94.",
    "Preetham's AI engineering stack verified. Ready to collaborate!",
    "Click me again to run another neural diagnostics test!"
  ];

  if (robotCanvas) {
    const rCtx = robotCanvas.getContext('2d');
    let rW, rH;
    let rMouseX = 0, rMouseY = 0;
    let currentHeadRotY = 0, currentHeadRotX = 0;
    let eyeOffsetX = 0, eyeOffsetY = 0;

    function resizeRobot() {
      rW = robotCanvas.parentElement.offsetWidth;
      rH = robotCanvas.parentElement.offsetHeight;
      robotCanvas.width = rW * window.devicePixelRatio;
      robotCanvas.height = rH * window.devicePixelRatio;
      rCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resizeRobot();
    window.addEventListener('resize', resizeRobot);

    // Track mouse over entire window for seamless tracking
    window.addEventListener('mousemove', (e) => {
      const rect = robotCanvas.getBoundingClientRect();
      const canvasCenterX = rect.left + rect.width / 2;
      const canvasCenterY = rect.top + rect.height / 2;
      
      const dx = (e.clientX - canvasCenterX) / (window.innerWidth / 2);
      const dy = (e.clientY - canvasCenterY) / (window.innerHeight / 2);

      rMouseX = Math.max(-1, Math.min(1, dx));
      rMouseY = Math.max(-1, Math.min(1, dy));
    });

    // Blinking timer
    setInterval(() => {
      ploppyBlink = true;
      setTimeout(() => { ploppyBlink = false; }, 160);
    }, 3800);

    // Click on robot triggers cheerful bounce & speech cycle
    robotCanvas.parentElement.addEventListener('click', () => {
      playSyntheticClick();
      ploppyBounce = 18;
      ploppySpeechIndex = (ploppySpeechIndex + 1) % ploppyPhrases.length;
      if (speechBubble) {
        speechBubble.innerHTML = `✦ <span class="highlight">Ploppy:</span> "${ploppyPhrases[ploppySpeechIndex]}"`;
        speechBubble.style.transform = 'scale(1.03)';
        setTimeout(() => { speechBubble.style.transform = 'scale(1)'; }, 200);
      }
    });

    let animTime = 0;
    function renderPloppy() {
      rCtx.clearRect(0, 0, rW, rH);
      animTime += 0.03;

      if (ploppyBounce > 0) ploppyBounce *= 0.88;

      // Smooth lerp to mouse
      currentHeadRotY += (rMouseX * 0.45 - currentHeadRotY) * 0.08;
      currentHeadRotX += (rMouseY * 0.35 - currentHeadRotX) * 0.08;
      eyeOffsetX += (rMouseX * 12 - eyeOffsetX) * 0.12;
      eyeOffsetY += (rMouseY * 9 - eyeOffsetY) * 0.12;

      const idleHover = Math.sin(animTime) * 6 - ploppyBounce;
      const centerX = rW / 2;
      const centerY = rH / 2 + 10 + idleHover;

      // 1. Perspective Wireframe Shadow & Floor Glow
      const shadowGrad = rCtx.createRadialGradient(centerX, centerY + 130, 10, centerX, centerY + 130, 90);
      shadowGrad.addColorStop(0, 'rgba(0, 210, 255, 0.25)');
      shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.7)');
      shadowGrad.addColorStop(1, 'transparent');
      rCtx.fillStyle = shadowGrad;
      rCtx.beginPath();
      rCtx.ellipse(centerX, centerY + 130, 85, 20, 0, 0, Math.PI * 2);
      rCtx.fill();

      // 2. Torso (Matte Graphite Black)
      rCtx.save();
      rCtx.translate(centerX, centerY + 55);
      rCtx.rotate(currentHeadRotY * 0.25);

      // Torso body
      rCtx.fillStyle = '#111317';
      rCtx.strokeStyle = 'rgba(0, 210, 255, 0.3)';
      rCtx.lineWidth = 1.5;
      rCtx.beginPath();
      rCtx.roundRect(-42, -10, 84, 70, 16);
      rCtx.fill();
      rCtx.stroke();

      // Torso glossy highlight
      const torsoGrad = rCtx.createLinearGradient(-42, -10, 42, 60);
      torsoGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
      torsoGrad.addColorStop(0.5, 'transparent');
      torsoGrad.addColorStop(1, 'rgba(0, 210, 255, 0.08)');
      rCtx.fillStyle = torsoGrad;
      rCtx.fill();

      // Glowing Cyan Chest Indicator Bar
      const chestPulse = (Math.sin(animTime * 3) + 1) * 0.5;
      rCtx.fillStyle = `rgba(0, 245, 212, ${0.4 + chestPulse * 0.6})`;
      rCtx.shadowColor = '#00f5d4';
      rCtx.shadowBlur = 12;
      rCtx.beginPath();
      rCtx.roundRect(-16, 12, 32, 6, 3);
      rCtx.fill();
      rCtx.shadowBlur = 0;

      // Robotic Arms
      rCtx.fillStyle = '#16191f';
      rCtx.strokeStyle = 'rgba(0, 210, 255, 0.2)';
      // Left arm
      rCtx.beginPath();
      rCtx.roundRect(-54, -4, 12, 45, 6);
      rCtx.fill();
      rCtx.stroke();
      // Right arm
      rCtx.beginPath();
      rCtx.roundRect(42, -4, 12, 45, 6);
      rCtx.fill();
      rCtx.stroke();

      // Robotic Legs & Boots
      rCtx.fillStyle = '#0d0f13';
      rCtx.strokeStyle = 'rgba(0, 210, 255, 0.3)';
      // Left leg
      rCtx.beginPath();
      rCtx.roundRect(-26, 60, 20, 35, 6);
      rCtx.fill();
      rCtx.stroke();
      // Right leg
      rCtx.beginPath();
      rCtx.roundRect(6, 60, 20, 35, 6);
      rCtx.fill();
      rCtx.stroke();

      rCtx.restore();

      // 3. Head & Monitor Helmet (Moves with mouse in 3D perspective!)
      rCtx.save();
      rCtx.translate(centerX + currentHeadRotY * 18, centerY - 35 + currentHeadRotX * 12);
      rCtx.rotate(currentHeadRotY * 0.4);

      // Headset / Ear Dials on Sides
      // Left ear dial with cyan ring
      rCtx.fillStyle = '#141820';
      rCtx.strokeStyle = '#00d2ff';
      rCtx.lineWidth = 2.5;
      rCtx.shadowColor = '#00d2ff';
      rCtx.shadowBlur = 10;
      rCtx.beginPath();
      rCtx.arc(-82, 0, 14, 0, Math.PI * 2);
      rCtx.fill();
      rCtx.stroke();
      // Right ear dial with cyan ring
      rCtx.beginPath();
      rCtx.arc(82, 0, 14, 0, Math.PI * 2);
      rCtx.fill();
      rCtx.stroke();
      rCtx.shadowBlur = 0;

      // Antennas
      rCtx.strokeStyle = 'rgba(0, 210, 255, 0.5)';
      rCtx.lineWidth = 3;
      rCtx.beginPath();
      rCtx.moveTo(-74, -4);
      rCtx.lineTo(-84, -42);
      rCtx.moveTo(74, -4);
      rCtx.lineTo(84, -42);
      rCtx.stroke();
      // Antenna glowing tips
      rCtx.fillStyle = '#00f5d4';
      rCtx.shadowColor = '#00f5d4';
      rCtx.shadowBlur = 10;
      rCtx.beginPath();
      rCtx.arc(-84, -44, 4, 0, Math.PI * 2);
      rCtx.arc(84, -44, 4, 0, Math.PI * 2);
      rCtx.fill();
      rCtx.shadowBlur = 0;

      // Main Helmet Monitor Head (Matte Black with Chamfer)
      rCtx.fillStyle = '#121418';
      rCtx.strokeStyle = 'rgba(0, 210, 255, 0.35)';
      rCtx.lineWidth = 2;
      rCtx.beginPath();
      rCtx.roundRect(-75, -60, 150, 120, 28);
      rCtx.fill();
      rCtx.stroke();

      // Beveled helmet top light
      const helmetGrad = rCtx.createLinearGradient(-75, -60, 75, 60);
      helmetGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      helmetGrad.addColorStop(0.3, 'transparent');
      helmetGrad.addColorStop(0.8, 'rgba(0, 180, 255, 0.08)');
      helmetGrad.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
      rCtx.fillStyle = helmetGrad;
      rCtx.fill();

      // Inset Glossy Screen Visor
      rCtx.fillStyle = '#06080b';
      rCtx.strokeStyle = 'rgba(0, 245, 212, 0.4)';
      rCtx.lineWidth = 1.5;
      rCtx.beginPath();
      rCtx.roundRect(-60, -46, 120, 92, 18);
      rCtx.fill();
      rCtx.stroke();

      // Screen scanlines
      rCtx.fillStyle = 'rgba(0, 210, 255, 0.03)';
      for (let sl = -44; sl < 44; sl += 6) {
        rCtx.fillRect(-58, sl, 116, 2);
      }

      // Visor diagonal glass reflection
      rCtx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      rCtx.beginPath();
      rCtx.moveTo(-50, -42);
      rCtx.lineTo(-20, -42);
      rCtx.lineTo(-45, 42);
      rCtx.lineTo(-55, 42);
      rCtx.closePath();
      rCtx.fill();

      // 4. Glowing Cyan Pixelated Matrix Eyes (Tracks mouse + blinks!)
      if (!ploppyBlink) {
        const eyeW = 20, eyeH = 26;
        const leftEyeX = -32 + eyeOffsetX;
        const rightEyeX = 14 + eyeOffsetX;
        const eyeY = -12 + eyeOffsetY;

        rCtx.shadowColor = '#00f5d4';
        rCtx.shadowBlur = 14;
        rCtx.fillStyle = '#00f5d4';

        // Draw 3x4 pixel grid eyes (Exact like user's photo!)
        function drawPixelEye(startX, startY) {
          const pixelSize = 5.5;
          const gap = 1.8;
          for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 3; col++) {
              rCtx.fillRect(startX + col * (pixelSize + gap), startY + row * (pixelSize + gap), pixelSize, pixelSize);
            }
          }
        }

        drawPixelEye(leftEyeX, eyeY);
        drawPixelEye(rightEyeX, eyeY);
        rCtx.shadowBlur = 0;
      } else {
        // Blinking line
        rCtx.strokeStyle = '#00f5d4';
        rCtx.shadowColor = '#00f5d4';
        rCtx.shadowBlur = 8;
        rCtx.lineWidth = 3;
        rCtx.beginPath();
        rCtx.moveTo(-32 + eyeOffsetX, -2 + eyeOffsetY);
        rCtx.lineTo(-12 + eyeOffsetX, -2 + eyeOffsetY);
        rCtx.moveTo(14 + eyeOffsetX, -2 + eyeOffsetY);
        rCtx.lineTo(34 + eyeOffsetX, -2 + eyeOffsetY);
        rCtx.stroke();
        rCtx.shadowBlur = 0;
      }

      rCtx.restore();

      requestAnimationFrame(renderPloppy);
    }
    requestAnimationFrame(renderPloppy);
  }

  // 11. INTERACTIVE AI ASSISTANT (Chat Drawer with Ploppy Persona)
  const assistantTrigger = document.getElementById('assistantTrigger');
  const chatDrawer = document.getElementById('chatDrawer');
  const chatClose = document.getElementById('chatClose');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const tooltipClose = document.getElementById('tooltipClose');
  const assistantTooltip = document.getElementById('assistantTooltip');

  if (tooltipClose && assistantTooltip) {
    tooltipClose.addEventListener('click', (e) => {
      e.stopPropagation();
      assistantTooltip.style.display = 'none';
    });
  }

  const assistantKnowledge = {
    background: "Preetham V R is a final-year MCA student specializing in AI & Data Analytics at GM University, Davangere, Karnataka. With a strong mathematical grounding, he focuses on machine learning, deep learning, computer vision, and autonomous agent workflows.",
    projects: "Preetham has built 10 state-of-the-art projects: 1) F1 Race Predictor (Live API & ML pipeline on Render), 2) NexusDesk (LangGraph Multi-Agent IT Service Desk), 3) AI-Detection & Humanizer, 4) Mental Health Chatbot, 5) Diabetic Retinopathy Vision CNN (AUC 0.94), 6) InsightAI Analytics, 7) Bengaluru Real Estate ML, 8) Luxury Jewellery E-Commerce (Live on Render), 9) WhatsApp CRM (Next.js 16 & Meta Cloud API), and 10) SANJEEVANI-X AI Emergency Grid.",
    skills: "His core tech stack includes Python, PyTorch, Scikit-learn, LangGraph, LangChain, Multi-Agent Systems, OpenCV, FastF1, Pandas, NumPy, FastAPI, Next.js, TypeScript, SQL, Docker, and foundational Mathematics (Linear Algebra, Multivariable Calculus, Statistics).",
    contact: "You can reach Preetham directly via email at preetham.vr.ai@gmail.com, on LinkedIn (https://www.linkedin.com/in/preetham-v-r-865770378/), or explore his repositories on GitHub (https://github.com/preetamvr1595). He is actively open to AI/ML engineering roles, research collaborations, and internships.",
    live: "Preetham has two live cloud deployments: 1) F1 Race Predictor (https://f1-race-predictor-live-api-data-pipeline.onrender.com) and 2) Luxury Jewellery Platform (https://jewellers-q3kn.onrender.com)."
  };

  function toggleChat() {
    if (!chatDrawer) return;
    chatDrawer.classList.toggle('open');
    if (chatDrawer.classList.contains('open')) {
      if (assistantTooltip) assistantTooltip.style.display = 'none';
      if (chatInput) chatInput.focus();
    }
  }


  if (assistantTrigger) assistantTrigger.addEventListener('click', toggleChat);
  if (chatClose) chatClose.addEventListener('click', toggleChat);
  const talkWithPloppyBtn = document.getElementById('talkWithPloppyBtn');
  if (talkWithPloppyBtn) talkWithPloppyBtn.addEventListener('click', toggleChat);

  function appendMessage(sender, text) {
    if (!chatMessages) return;
    const msg = document.createElement('div');
    msg.className = `msg ${sender}`;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleUserQuery(query) {
    if (!query.trim()) return;
    appendMessage('user', query);
    if (chatInput) chatInput.value = '';

    const lower = query.toLowerCase();
    let reply = "I'm Preetham's portfolio assistant. He specializes in AI & Data Analytics, focusing on machine learning, deep learning, and data pipelines. Feel free to explore his projects or get in touch via email!";

    if (lower.includes('project') || lower.includes('work') || lower.includes('built')) {
      reply = assistantKnowledge.projects;
    } else if (lower.includes('skill') || lower.includes('stack') || lower.includes('python') || lower.includes('tech')) {
      reply = assistantKnowledge.skills;
    } else if (lower.includes('about') || lower.includes('who') || lower.includes('education') || lower.includes('college')) {
      reply = assistantKnowledge.background;
    } else if (lower.includes('contact') || lower.includes('email') || lower.includes('hire') || lower.includes('job') || lower.includes('opportunity')) {
      reply = assistantKnowledge.contact;
    }

    setTimeout(() => {
      appendMessage('bot', reply);
    }, 450);
  }

  if (chatSendBtn && chatInput) {
    chatSendBtn.addEventListener('click', () => handleUserQuery(chatInput.value));
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleUserQuery(chatInput.value);
    });
  }

  document.querySelectorAll('.prompt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.getAttribute('data-prompt');
      handleUserQuery(prompt);
    });
  });


  // 11. TERMINAL CONTACT FORM INTERACTIVITY
  const terminalForm = document.getElementById('terminalForm');
  if (terminalForm) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value;
      const email = document.getElementById('senderEmail').value;
      const message = document.getElementById('senderMessage').value;

      if (!name || !email || !message) {
        showToast('Please fill out all fields.');
        return;
      }

      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Hi Preetham,\n\n${message}\n\nFrom: ${name} (${email})`);
      window.location.href = `mailto:preetham.vr.ai@gmail.com?subject=${subject}&body=${body}`;

      showToast('Opening your email client...');
      terminalForm.reset();
    });
  }


  // 12. LAB EXPERIMENTS
  const negativeModeTrigger = document.getElementById('toggleNegativeMode');
  if (negativeModeTrigger) {
    negativeModeTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      document.documentElement.classList.toggle('negative-mode');
      const active = document.documentElement.classList.contains('negative-mode');
      showToast(active ? 'Negative Mode: ACTIVE' : 'Negative Mode: OFF');
    });
  }

  const audioToggle = document.getElementById('toggleAudio');
  if (audioToggle) {
    audioToggle.addEventListener('click', (e) => {
      e.preventDefault();
      playSyntheticClick();
      showToast('Audio Synthesis: PING');
    });
  }

  const triggerGlobeSpin = document.getElementById('triggerGlobeSpin');
  if (triggerGlobeSpin) {
    triggerGlobeSpin.addEventListener('click', (e) => {
      e.preventDefault();
      heroSpinSpeed = 4.5;
      showToast('Sphere Angular Velocity Boosted ↗');
      setTimeout(() => {
        heroSpinSpeed = 1.0;
      }, 2500);
    });
  }

  function playSyntheticClick() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (err) {
      console.log('AudioContext not allowed without interaction');
    }
  }


  // 13. COOKIE BANNER DISMISSAL
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieDecline = document.getElementById('cookieDecline');

  if (localStorage.getItem('pv_consent')) {
    if (cookieBanner) cookieBanner.classList.add('hidden');
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('pv_consent', 'accepted');
      if (cookieBanner) cookieBanner.classList.add('hidden');
      showToast('Preferences saved');
    });
  }
  if (cookieDecline) {
    cookieDecline.addEventListener('click', () => {
      localStorage.setItem('pv_consent', 'declined');
      if (cookieBanner) cookieBanner.classList.add('hidden');
      showToast('Non-essential cookies declined');
    });
  }


  // 14. CUSTOM CURSOR
  const cursor = document.getElementById('customCursor');
  if (cursor && window.innerWidth > 1024) {
    window.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });

    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .lab-card, .skill-box, .project-slide, .exp-row, .edu-card, .journey-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }


  // 15. SMOOTH NAV HIGHLIGHTING ON SCROLL
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 160;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });


  // 16. MOBILE MENU DRAWER TOGGLE
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      mobileMenuBtn.textContent = mobileDrawer.classList.contains('open') ? '✕' : '☰';
    });

    mobileDrawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.textContent = '☰';
      });
    });
  }

});
// Step 51: style: enhance responsive layout for tablet viewports (768px - 1024px)
