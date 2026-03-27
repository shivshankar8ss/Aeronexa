import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  .lp-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #ffffff;
    color: #0f172a;
    overflow-x: hidden;
  }

  /* ── Animated gradient orbs ── */
  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    animation: orbFloat 8s ease-in-out infinite;
  }
  .orb-1 { width:520px;height:520px;background:radial-gradient(circle,rgba(186,230,255,0.55) 0%,transparent 70%); top:-120px;left:-100px;animation-delay:0s; }
  .orb-2 { width:400px;height:400px;background:radial-gradient(circle,rgba(224,242,254,0.6) 0%,transparent 70%);  top:60px;right:-80px;animation-delay:-3s; }
  .orb-3 { width:300px;height:300px;background:radial-gradient(circle,rgba(254,240,138,0.25) 0%,transparent 70%); bottom:80px;left:30%;animation-delay:-5s; }
  @keyframes orbFloat {
    0%,100% { transform: translateY(0px) scale(1); }
    50%      { transform: translateY(-30px) scale(1.04); }
  }

  /* ── Grid texture overlay ── */
  .grid-texture {
    position:absolute;inset:0;pointer-events:none;
    background-image:
      linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* ── Hero AQI dial ── */
  .aqi-dial {
    position:relative;
    width:240px;height:240px;
    border-radius:50%;
    background:white;
    box-shadow: 0 0 0 1px rgba(14,165,233,0.12), 0 24px 64px rgba(14,165,233,0.12), 0 4px 16px rgba(0,0,0,0.04);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    animation: dialAppear 1s cubic-bezier(0.34,1.56,0.64,1) 0.4s both;
  }
  @keyframes dialAppear {
    from { opacity:0; transform:scale(0.7) translateY(20px); }
    to   { opacity:1; transform:scale(1) translateY(0); }
  }
  .aqi-dial::before {
    content:'';position:absolute;inset:-3px;border-radius:50%;
    background:conic-gradient(
      #16a34a 0deg 72deg,
      #eab308 72deg 144deg,
      #f97316 144deg 180deg,
      #ef4444 180deg 252deg,
      #9333ea 252deg 324deg,
      #be123c 324deg 360deg
    );
    z-index:-1;filter:blur(1px);opacity:0.7;
  }

  /* ── Floating metric cards ── */
  .metric-float {
    position:absolute;
    background:white;
    border:1px solid rgba(14,165,233,0.12);
    border-radius:16px;
    padding:12px 16px;
    box-shadow:0 8px 32px rgba(0,0,0,0.06);
    animation: floatCard 6s ease-in-out infinite;
    backdrop-filter:blur(8px);
  }
  .metric-float:nth-child(2) { animation-delay:-2s; }
  .metric-float:nth-child(3) { animation-delay:-4s; }
  @keyframes floatCard {
    0%,100% { transform:translateY(0); }
    50%      { transform:translateY(-8px); }
  }

  /* ── Hero text animations ── */
  .hero-badge   { animation: fadeSlideUp 0.6s ease 0.1s both; }
  .hero-title   { animation: fadeSlideUp 0.6s ease 0.2s both; }
  .hero-sub     { animation: fadeSlideUp 0.6s ease 0.35s both; }
  .hero-ctas    { animation: fadeSlideUp 0.6s ease 0.5s both; }
  .hero-trust   { animation: fadeSlideUp 0.6s ease 0.65s both; }
  @keyframes fadeSlideUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ── Feature cards ── */
  .feat-card {
    background:white;
    border:1px solid #f1f5f9;
    border-radius:20px;
    padding:28px;
    transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    cursor:default;
  }
  .feat-card:hover {
    transform:translateY(-6px);
    border-color:rgba(14,165,233,0.25);
    box-shadow:0 20px 60px rgba(14,165,233,0.1);
  }
  .feat-icon {
    width:52px;height:52px;border-radius:14px;
    display:flex;align-items:center;justify-content:center;
    font-size:24px;margin-bottom:16px;
    transition:transform 0.3s ease;
  }
  .feat-card:hover .feat-icon { transform:scale(1.1) rotate(-4deg); }

  /* ── AQI scale bar ── */
  .aqi-scale-bar {
    height:10px;border-radius:99px;
    background:linear-gradient(90deg,
      #16a34a 0%,#86efac 16.6%,
      #eab308 16.6%,#fde047 33.2%,
      #f97316 33.2%,#fdba74 49.8%,
      #ef4444 49.8%,#fca5a5 66.4%,
      #9333ea 66.4%,#d8b4fe 83%,
      #be123c 83%,#fda4af 100%
    );
  }

  /* ── Stats counter ── */
  .stat-num {
    font-size:2.5rem;font-weight:800;
    background:linear-gradient(135deg,#0ea5e9,#0284c7);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;
    background-clip:text;
  }

  /* ── Testimonial cards ── */
  .testi-card {
    background:#f8fafc;
    border:1px solid #f1f5f9;
    border-radius:20px;padding:28px;
    transition:all 0.25s ease;
  }
  .testi-card:hover { background:white; box-shadow:0 8px 32px rgba(0,0,0,0.06); }

  /* ── CTA section ── */
  .cta-section {
    background:linear-gradient(135deg,#0ea5e9 0%,#0284c7 50%,#0369a1 100%);
    position:relative;overflow:hidden;
  }
  .cta-section::before {
    content:'';position:absolute;inset:0;
    background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  /* ── Navbar ── */
  .lp-nav {
    position:fixed;top:0;left:0;right:0;z-index:100;
    transition:all 0.3s ease;
  }
  .lp-nav.scrolled {
    background:rgba(255,255,255,0.9);
    backdrop-filter:blur(20px);
    border-bottom:1px solid rgba(14,165,233,0.08);
    box-shadow:0 2px 24px rgba(0,0,0,0.04);
  }

  /* ── Scroll reveal ── */
  .reveal { opacity:0; transform:translateY(28px); transition:all 0.7s cubic-bezier(0.22,1,0.36,1); }
  .reveal.visible { opacity:1; transform:translateY(0); }

  /* ── Pulse ring around dial ── */
  @keyframes pingRing {
    0%   { transform:scale(1);opacity:0.6; }
    100% { transform:scale(1.35);opacity:0; }
  }
  .ping-ring {
    position:absolute;inset:-16px;border-radius:50%;
    border:2px solid rgba(14,165,233,0.3);
    animation:pingRing 2.4s ease-out infinite;
  }
  .ping-ring-2 {
    position:absolute;inset:-32px;border-radius:50%;
    border:1px solid rgba(14,165,233,0.15);
    animation:pingRing 2.4s ease-out 0.8s infinite;
  }
`;

const FEATURES = [
  { icon:'🛰️', bg:'#eff6ff', title:'Real-Time AQI', desc:'Instant air quality data fetched from your exact GPS coordinates via AQICN & OpenWeather APIs.' },
  { icon:'🧬', bg:'#f0fdf4', title:'Health Score', desc:'Dynamic 0–100 health score calculated from your cumulative AQI exposure over 48 hours.' },
  { icon:'🔮', bg:'#faf5ff', title:'AQI Forecast', desc:'Moving-average algorithm with linear trend dampening predicts your next 6 hours of air quality.' },
  { icon:'🩺', bg:'#fff7ed', title:'Personalized Advice', desc:'Context-aware recommendations — from "open windows" to "emergency mask required" — tailored to your data.' },
  { icon:'📊', bg:'#f0f9ff', title:'Interactive Charts', desc:'AQI history, exposure breakdown, and health trend charts with 24h granularity using Chart.js.' },
  { icon:'🗺️', bg:'#fefce8', title:'28-Day Heatmap', desc:'Visual calendar heatmap of your daily average AQI exposure — identify your worst pollution days at a glance.' },
];

const AQI_LEVELS = [
  { label:'Good',       range:'0–50',   color:'#16a34a', bg:'#f0fdf4', desc:'Safe to breathe' },
  { label:'Moderate',   range:'51–100', color:'#ca8a04', bg:'#fefce8', desc:'Mild irritation' },
  { label:'Sensitive',  range:'101–150',color:'#ea580c', bg:'#fff7ed', desc:'Breathing discomfort' },
  { label:'Unhealthy',  range:'151–200',color:'#dc2626', bg:'#fef2f2', desc:'Lung impact' },
  { label:'Very Bad',   range:'201–300',color:'#9333ea', bg:'#faf5ff', desc:'Severe risk' },
  { label:'Hazardous',  range:'300+',   color:'#be123c', bg:'#fff1f2', desc:'Emergency' },
];

const STATS = [
  { num:'6', suffix:' APIs', label:'Data sources' },
  { num:'10', suffix:'min', label:'Cache refresh' },
  { num:'48', suffix:'h', label:'Exposure window' },
  { num:'28', suffix:' days', label:'Heatmap history' },
];

const TESTIMONIALS = [
  { quote:"Aeronexa made me realize my morning commute was the most polluted part of my day. I changed my route and my health score improved by 18 points.", name:'Shivshankar', role:'Daily commuter, Bhagalpur' },
  { quote:"The AQI forecast helped me plan my daughter's outdoor playtime. It's incredibly accurate and the UI is so clean.", name:'Himanshu', role:'Parent, Mumbai' },
  { quote:"As someone with asthma, knowing the AQI before stepping out is life-changing. The alerts are perfectly timed.", name:'Anubhav Raj', role:'Student, Patna' },
];

// Animated counter hook
function useCounter(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

export default function LandingPage() {
  const [scrolled, setScrolled]   = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  // Navbar scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Stats visibility observer
  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{STYLES}</style>
      <div className="lp-root">

        {/* ── NAVBAR ──*/}
        <nav className={`lp-nav px-6 py-4 ${scrolled ? 'scrolled' : ''}`}>
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-sky-500 rounded-xl flex items-center justify-center shadow-sm shadow-sky-200">
                <span className="text-base">🌬️</span>
              </div>
              <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontWeight:800, fontSize:'1.1rem', color:'#0f172a' }}>
                Aeronexa
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Features','How it works','AQI Guide'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g,'-')}`}
                  className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                  {item}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2">
                Sign In
              </Link>
              <Link to="/register"
                className="text-sm font-bold text-white bg-sky-500 hover:bg-sky-600 transition-all px-5 py-2.5 rounded-xl shadow-sm shadow-sky-200 hover:shadow-sky-300 hover:-translate-y-0.5">
                Get Started →
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
          <div className="grid-texture" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />

          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Left: Text */}
              <div>
                <div className="hero-badge inline-flex items-center gap-2 bg-sky-50 border border-sky-100 text-sky-700 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse" />
                  Live Air Quality Tracking
                </div>

                <h1 className="hero-title text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-6">
                  Breathe{' '}
                  <span style={{
                    background:'linear-gradient(135deg,#0ea5e9,#0284c7)',
                    WebkitBackgroundClip:'text',
                    WebkitTextFillColor:'transparent',
                    backgroundClip:'text',
                  }}>
                    smarter.
                  </span>
                  <br />
                  Live healthier.
                </h1>

                <p className="hero-sub text-lg text-slate-500 leading-relaxed mb-8 max-w-lg" style={{ fontWeight:400 }}>
                  Aeronexa tracks real-time air quality at your location, calculates your personal health exposure score, and gives AI-powered advice — so you always know what you're breathing.
                </p>

                <div className="hero-ctas flex flex-wrap gap-3 mb-10">
                  <Link to="/register"
                    className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-sky-200 hover:shadow-sky-300 hover:-translate-y-0.5">
                    Start Tracking Free
                    <span className="text-base">→</span>
                  </Link>
                  <a href="#how-it-works"
                    className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-7 py-3.5 rounded-xl text-sm border border-slate-200 transition-all hover:-translate-y-0.5">
                    See how it works
                  </a>
                </div>

                <div className="hero-trust flex items-center gap-6 flex-wrap">
                  {[
                    { icon:'🛡️', text:'No credit card' },
                    { icon:'📍', text:'Location-aware' },
                    { icon:'⚡', text:'Updates every 10 min' },
                  ].map((t) => (
                    <div key={t.text} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <span>{t.icon}</span>{t.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: AQI Dial visual */}
              <div className="relative flex items-center justify-center h-96">
                {/* Floating metric cards */}
                <div className="metric-float" style={{ top:'8%', left:'4%' }}>
                  <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'10px', color:'#94a3b8', marginBottom:4 }}>HEALTH SCORE</div>
                  <div style={{ fontSize:'22px', fontWeight:800, color:'#16a34a' }}>87<span style={{ fontSize:'12px', color:'#94a3b8' }}>/100</span></div>
                </div>

                <div className="metric-float" style={{ top:'10%', right:'2%' }}>
                  <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'10px', color:'#94a3b8', marginBottom:4 }}>FORECAST +3h</div>
                  <div style={{ fontSize:'18px', fontWeight:800, color:'#ca8a04' }}>62 🟡</div>
                </div>

                <div className="metric-float" style={{ bottom:'14%', left:'0%' }}>
                  <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'10px', color:'#94a3b8', marginBottom:4 }}>PM2.5</div>
                  <div style={{ fontSize:'18px', fontWeight:800, color:'#0ea5e9' }}>18 <span style={{ fontSize:'11px', color:'#94a3b8' }}>µg/m³</span></div>
                </div>

                <div className="metric-float" style={{ bottom:'18%', right:'0%' }}>
                  <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'10px', color:'#94a3b8', marginBottom:4 }}>RISK LEVEL</div>
                  <div style={{ fontSize:'14px', fontWeight:800, color:'#16a34a' }}>✅ Low</div>
                </div>

                {/* Central AQI Dial */}
                <div className="relative">
                  <div className="ping-ring" />
                  <div className="ping-ring-2" />
                  <div className="aqi-dial">
                    <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'11px', color:'#94a3b8', marginBottom:4, letterSpacing:'2px' }}>LIVE AQI</div>
                    <div style={{ fontSize:'64px', fontWeight:900, color:'#16a34a', lineHeight:1, letterSpacing:'-3px' }}>42</div>
                    <div className="mt-2 px-3 py-1 rounded-full text-xs font-bold" style={{ background:'#f0fdf4', color:'#16a34a', border:'1px solid #bbf7d0' }}>
                      🟢 Good
                    </div>
                    <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'10px', color:'#94a3b8', marginTop:8 }}>Safe to breathe</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section ref={statsRef} className="py-16 border-y border-slate-100 bg-slate-50/50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {STATS.map((s, i) => (
                <StatCounter key={i} {...s} visible={statsVisible} delay={i * 150} />
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 reveal">
              <div className="inline-block bg-sky-50 border border-sky-100 text-sky-600 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider mb-4">
                Features
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                Everything you need to<br />understand your air
              </h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto" style={{ fontWeight:400 }}>
                From raw sensor data to actionable health insights — Aeronexa handles the science so you don't have to.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f, i) => (
                <div key={i} className={`feat-card reveal`} style={{ transitionDelay:`${i * 80}ms` }}>
                  <div className="feat-icon" style={{ background: f.bg }}>{f.icon}</div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="py-24 px-6 bg-slate-50/60">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 reveal">
              <div className="inline-block bg-sky-50 border border-sky-100 text-sky-600 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider mb-4">
                How it works
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                Up and running in 30 seconds
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step:'01', icon:'📍', title:'Allow location', desc:'Aeronexa uses your GPS to pinpoint your exact location — no manual city entry needed.' },
                { step:'02', icon:'📡', title:'Fetch live data', desc:'We pull real-time AQI data from AQICN and OpenWeather APIs, cached for performance.' },
                { step:'03', icon:'💡', title:'Get insights', desc:'Your personal health score, forecasts, and tailored advice update every 10 minutes automatically.' },
              ].map((s, i) => (
                <div key={i} className="reveal text-center" style={{ transitionDelay:`${i * 120}ms` }}>
                  <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm text-2xl mb-5">
                    {s.icon}
                    <span style={{
                      position:'absolute', top:-8, right:-8,
                      background:'#0ea5e9', color:'white',
                      fontFamily:'JetBrains Mono,monospace', fontSize:'10px', fontWeight:700,
                      width:22, height:22, borderRadius:'50%',
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>{s.step}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Connector line */}
            <div className="hidden md:flex items-center justify-center mt-0 -mt-32 mb-16 pointer-events-none select-none">
              <div className="w-full max-w-md border-t-2 border-dashed border-sky-100 mx-auto" style={{ marginTop:'-60px', zIndex:0 }} />
            </div>
          </div>
        </section>

        {/* ── AQI GUIDE ── */}
        <section id="aqi-guide" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 reveal">
              <div className="inline-block bg-sky-50 border border-sky-100 text-sky-600 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider mb-4">
                AQI Guide
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                What does AQI mean?
              </h2>
              <p className="text-slate-500 text-base max-w-lg mx-auto" style={{ fontWeight:400 }}>
                Air Quality Index is a standardized scale that tells you how clean or polluted the air is — and what health effects to expect.
              </p>
            </div>

            {/* Scale bar */}
            <div className="reveal mb-10">
              <div className="aqi-scale-bar mb-3" />
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>0</span><span>50</span><span>100</span><span>150</span><span>200</span><span>300</span><span>500</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {AQI_LEVELS.map((l, i) => (
                <div key={i} className="reveal rounded-2xl p-4 text-center border transition-all hover:-translate-y-1"
                  style={{ background:l.bg, borderColor: l.color+'25', transitionDelay:`${i*60}ms` }}>
                  <div className="text-xl font-extrabold mb-1" style={{ color:l.color }}>{l.label}</div>
                  <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'11px', color:l.color, opacity:0.7, marginBottom:6 }}>{l.range}</div>
                  <div className="text-xs text-slate-500">{l.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="py-24 px-6 bg-slate-50/60">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 reveal">
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                People breathing easier
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className={`testi-card reveal`} style={{ transitionDelay:`${i*100}ms` }}>
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => <span key={j} className="text-yellow-400 text-sm">★</span>)}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{t.name}</div>
                      <div className="text-xs text-slate-400">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA SECTION ── */}
        <section className="cta-section py-24 px-6">
          <div className="max-w-3xl mx-auto text-center relative z-10 reveal">
            <div className="text-5xl mb-6">🌬️</div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              Know what you breathe.<br />Every single day.
            </h2>
            <p className="text-sky-100 text-lg mb-10 max-w-xl mx-auto" style={{ fontWeight:400 }}>
              Join thousands who've taken control of their air quality health. Free forever. No credit card.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register"
                className="inline-flex items-center justify-center gap-2 bg-white text-sky-600 hover:bg-sky-50 font-bold px-8 py-4 rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-xl">
                Create Free Account →
              </Link>
              <Link to="/login"
                className="inline-flex items-center justify-center gap-2 bg-sky-400/30 hover:bg-sky-400/40 border border-sky-300/40 text-white font-semibold px-8 py-4 rounded-xl text-sm transition-all">
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOOTER ─ */}
        <footer className="py-10 px-6 border-t border-slate-100">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-sky-500 rounded-lg flex items-center justify-center">
                <span className="text-sm">🌬️</span>
              </div>
              <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontWeight:800, color:'#0f172a' }}>Aeronexa</span>
              <span className="text-xs text-slate-400 ml-2">Air Quality Intelligence</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span>Data: AQICN · OpenWeatherMap</span>
              <span>·</span>
              <span>© {new Date().getFullYear()} Aeronexa</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login"    className="text-sm text-slate-400 hover:text-slate-700 transition-colors">Sign In</Link>
              <Link to="/register" className="text-sm font-semibold text-sky-500 hover:text-sky-600 transition-colors">Register</Link>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}

// ── StatCounter component 
function StatCounter({ num, suffix, label, visible, delay }) {
  const target = parseInt(num) || 0;
  const count  = useCounter(target, 1400, visible);
  return (
    <div className="reveal" style={{ transitionDelay:`${delay}ms` }}>
      <div className="stat-num">{visible ? count : 0}{suffix}</div>
      <div className="text-sm text-slate-500 mt-1 font-medium">{label}</div>
    </div>
  );
}