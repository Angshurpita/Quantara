/**
 * LandingPage.jsx — Quantara Landing Page
 * Liquid Crystal Glass Design — Black & White
 */
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Shield, Activity, Network, Eye, BarChart3,
  Zap, Lock, Terminal, Cpu, ChevronDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

/* ── Font Styles ────────────────────────────────────────────── */
const H = { fontFamily: "'Inter', system-ui, sans-serif" };
const B = { fontFamily: "'Inter', system-ui, sans-serif" };

/* ── Reveal on Scroll ───────────────────────────────────────── */
const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
    {children}
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════
   ① NAVIGATION — Liquid Crystal Glass
   ═══════════════════════════════════════════════════════════════ */
const Nav = () => {
  const nav = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'var(--lcg-header)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(1.2)' : 'none',
        borderBottom: scrolled ? '1px solid var(--lcg-line-6)' : '1px solid transparent',
      }}>
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => nav('/')}>
          <img src="/logo.png" alt="Quantara" className="h-10 w-auto object-contain" />
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {['Features', 'Process', 'Showcase'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              className="px-4 py-2 text-[13px] font-medium tracking-wide uppercase text-white/40 hover:text-white transition-colors duration-300"
              style={B}>
              {l}
            </a>
          ))}
        </div>

        {/* Theme toggle + CTA */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => nav('/login')}
            className="px-6 py-2.5 text-[13px] font-semibold tracking-wide cursor-pointer
                     bg-white text-black rounded-full
                     hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]
                     transition-all duration-300"
            style={B}>
            Get Started
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ② HERO — Minimalist Crystal
   ═══════════════════════════════════════════════════════════════ */
const Hero = () => {
  const nav = useNavigate();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -80]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Crystal background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="crystal-bg-orb" style={{ width: 600, height: 600, top: '10%', left: '20%', animationDelay: '0s' }} />
        <div className="crystal-bg-orb" style={{ width: 500, height: 500, bottom: '10%', right: '15%', animationDelay: '-7s' }} />
        <div className="crystal-bg-orb" style={{ width: 400, height: 400, top: '50%', left: '60%', animationDelay: '-14s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />

      <motion.div style={{ opacity, y }} className="relative z-10 text-center px-6 max-w-[900px] mx-auto">
        {/* Badge */}
        <Reveal>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-8
                       border border-white/10 bg-white/[0.03] backdrop-blur-md">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/50" style={B}>
              Financial Crime Detection
            </span>
          </motion.div>
        </Reveal>

        {/* Headline */}
        <Reveal delay={0.1}>
          <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.04em] mb-8" style={H}>
            <span className="text-white">Uncover</span>
            <br />
            <span className="text-white/30">Hidden Fraud</span>
            <br />
            <span className="shimmer-text">Networks.</span>
          </h1>
        </Reveal>

        {/* Subtitle */}
        <Reveal delay={0.2}>
          <p className="text-[17px] text-white/35 max-w-[520px] mx-auto mb-12 leading-relaxed" style={B}>
            Graph-powered AI that analyzes millions of transactions in real-time.
            Detect money muling rings that traditional systems miss entirely.
          </p>
        </Reveal>

        {/* Buttons */}
        <Reveal delay={0.3}>
          <div className="flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(255,255,255,0.12)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => nav('/login')}
              className="group px-8 py-4 bg-white text-black font-semibold text-[15px] rounded-full
                         cursor-pointer flex items-center gap-2 transition-all duration-300"
              style={B}>
              Start Analyzing
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </Reveal>

        {/* Stats row */}
        <Reveal delay={0.4}>
          <div className="flex items-center justify-center gap-12 mt-16">
            {[
              { value: '94.8%', label: 'Accuracy' },
              { value: '<60ms', label: 'Response' },
              { value: '83%', label: 'Precision' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-white tracking-tight" style={H}>{s.value}</div>
                <div className="text-[10px] text-white/25 uppercase tracking-[0.15em] mt-1" style={B}>{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <ChevronDown size={20} className="text-white/20" />
      </motion.div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ③ FEATURES — Crystal Glass Bento Grid
   ═══════════════════════════════════════════════════════════════ */
const features = [
  {
    icon: Network,
    title: 'Graph Analysis',
    desc: 'Build real-time transaction graphs revealing circular flows, mule networks, and velocity anomalies.',
    large: true,
  },
  {
    icon: Zap,
    title: 'Real-time Scoring',
    desc: 'Sub-50ms ML-powered risk assessment on every transaction.',
  },
  {
    icon: Shield,
    title: 'Zero-Trust Security',
    desc: 'Enterprise encryption. Your data never leaves your infrastructure.',
  },
  {
    icon: Eye,
    title: 'Pattern Detection',
    desc: 'Identify complex fraud schemes through multi-hop relationship analysis.',
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    desc: 'Interactive dashboards with exportable compliance reports.',
  },
  {
    icon: Lock,
    title: 'SOC2 Compliant',
    desc: 'Bank-grade security with GDPR compliance and on-premise deployment.',
  },
];

const Features = () => (
  <section id="features" className="py-24 px-6 relative">
    {/* Separator */}
    <div className="liquid-line max-w-[600px] mx-auto mb-24" />

    <div className="max-w-[1200px] mx-auto">
      <Reveal>
        <div className="text-center mb-16">
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-white/25 block mb-4" style={B}>
            Capabilities
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-[-0.03em]" style={H}>
            What makes us <span className="text-white/25">different</span>
          </h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <motion.div
              whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.12)' }}
              transition={{ duration: 0.3 }}
              className={`group relative p-8 rounded-2xl cursor-default h-full
                         border border-white/[0.06] bg-white/[0.02]
                         hover:bg-white/[0.04] transition-all duration-500
                         ${f.large ? 'lg:col-span-2 lg:row-span-2' : ''}`}
              style={{ backdropFilter: 'blur(8px)' }}>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.08]
                              flex items-center justify-center mb-6
                              group-hover:bg-white/[0.08] group-hover:border-white/[0.15]
                              transition-all duration-500">
                <f.icon size={22} className="text-white/40 group-hover:text-white/70 transition-colors duration-500" />
              </div>

              <h3 className={`font-bold text-white mb-3 tracking-tight ${f.large ? 'text-2xl' : 'text-lg'}`} style={H}>
                {f.title}
              </h3>
              <p className="text-white/30 text-[14px] leading-relaxed" style={B}>{f.desc}</p>

              {/* Corner highlight */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100
                              transition-opacity duration-700 pointer-events-none rounded-tr-2xl"
                style={{ background: 'radial-gradient(circle at top right, rgba(255,255,255,0.03), transparent 70%)' }} />
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════
   ④ PROCESS — Crystal Timeline
   ═══════════════════════════════════════════════════════════════ */
const processSteps = [
  { icon: Terminal, title: 'Upload Data', desc: 'Drop CSV files or connect via API.' },
  { icon: Cpu, title: 'Build Graph', desc: 'Real-time transaction relationship graphs.' },
  { icon: Eye, title: 'Detect Anomalies', desc: 'ML scans for mule patterns & fraud rings.' },
  { icon: BarChart3, title: 'Get Reports', desc: 'Interactive dashboards & compliance exports.' },
];

const Process = () => (
  <section id="process" className="py-24 px-6 relative">
    <div className="liquid-line max-w-[600px] mx-auto mb-24" />

    <div className="max-w-[1200px] mx-auto">
      <Reveal>
        <div className="text-center mb-16">
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-white/25 block mb-4" style={B}>
            Process
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-[-0.03em]" style={H}>
            Four steps to <span className="text-white/25">clarity</span>
          </h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {processSteps.map((s, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="group relative p-8 rounded-2xl h-full
                         border border-white/[0.06] bg-white/[0.02]
                         hover:bg-white/[0.04] hover:border-white/[0.12]
                         transition-all duration-500"
              style={{ backdropFilter: 'blur(8px)' }}>

              {/* Step number */}
              <div className="absolute top-6 right-6 text-[48px] font-bold text-white/[0.03]
                              group-hover:text-white/[0.06] transition-colors duration-500 leading-none" style={H}>
                {i + 1}
              </div>

              <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/[0.08]
                              flex items-center justify-center mb-5
                              group-hover:bg-white/[0.08] transition-all duration-500">
                <s.icon size={18} className="text-white/40 group-hover:text-white/70 transition-colors" />
              </div>

              <h3 className="text-[17px] font-bold text-white mb-2 tracking-tight" style={H}>{s.title}</h3>
              <p className="text-white/30 text-[13px] leading-relaxed" style={B}>{s.desc}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════
   ⑤ SHOWCASE — Interactive Graph Demo
   ═══════════════════════════════════════════════════════════════ */
const InteractiveGraphDemo = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener('resize', resize);

    const nodes = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 1,
    }));

    const draw = () => {
      time += 0.005;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Update nodes
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });

      // Draw edges
      nodes.forEach((a, i) => {
        nodes.forEach((b, j) => {
          if (j <= i) return;
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.12;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach(n => {
        const pulse = Math.sin(time * 2 + n.x * 0.01) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.15 + pulse * 0.2})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

const Showcase = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section id="showcase" ref={ref} className="py-24 px-6 relative">
      <div className="liquid-line max-w-[600px] mx-auto mb-24" />

      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <div className="text-center mb-14">
            <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-white/25 block mb-4" style={B}>
              Visualization
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-[-0.03em]" style={H}>
              See what others <span className="text-white/25">can't see</span>
            </h2>
          </div>
        </Reveal>

        <Reveal>
          <motion.div
            style={{ y: imgY }}
            className="relative rounded-2xl overflow-hidden
                       border border-white/[0.06] hover:border-white/[0.1]
                       transition-all duration-700 group">
            <div className="aspect-[21/9] relative bg-black">
              <InteractiveGraphDemo />

              {/* Left overlay */}
              <div className="absolute left-5 bottom-5 md:left-6 md:bottom-6">
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="p-4 bg-black/60 backdrop-blur-xl rounded-xl border border-white/[0.08]">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
                    <span className="text-white/40 text-[10px] font-mono tracking-widest uppercase">Live Monitor</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: 'Suspicious', value: '23' },
                      { label: 'Fraud Rings', value: '3' },
                      { label: 'Blocked', value: '847' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between gap-6">
                        <span className="text-[11px] text-white/30" style={B}>{item.label}</span>
                        <span className="text-[12px] font-mono font-bold text-white/60">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right floating chips */}
              <div className="absolute right-5 top-5 md:right-6 md:top-6 flex flex-col gap-2">
                <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="px-3 py-2 bg-black/60 backdrop-blur-xl rounded-lg border border-white/[0.08]">
                  <span className="text-white/40 text-[10px] font-mono">NODES: 2,847</span>
                </motion.div>
                <motion.div animate={{ y: [3, -3, 3] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="px-3 py-2 bg-black/60 backdrop-blur-xl rounded-lg border border-white/[0.08]">
                  <span className="text-white/40 text-[10px] font-mono">EDGES: 14.2K</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ⑥ CTA — Crystal Call to Action
   ═══════════════════════════════════════════════════════════════ */
const CTA = () => {
  const nav = useNavigate();
  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-[700px] mx-auto text-center relative z-10">
        <Reveal>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-[-0.03em] text-white" style={H}>
            Ready to stop fraud?
          </h2>
          <p className="text-[16px] text-white/30 mb-12 max-w-md mx-auto leading-relaxed" style={B}>
            Start analyzing your transaction data in minutes. Free tier available.
          </p>
          <div className="flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 50px rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => nav('/login')}
              className="group px-10 py-4 bg-white text-black font-semibold text-[15px] rounded-full
                         cursor-pointer flex items-center gap-2 transition-all duration-300"
              style={B}>
              Try Demo
              <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </motion.button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ⑦ FOOTER — Crystal Minimal
   ═══════════════════════════════════════════════════════════════ */
const Footer = () => (
  <footer className="pt-16 pb-8 px-6 relative">
    <div className="liquid-line max-w-[600px] mx-auto mb-16" />

    <div className="max-w-[1200px] mx-auto">
      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 mb-16">
        {/* Brand */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Quantara" className="h-8 w-auto object-contain opacity-70" />
            <span className="text-lg font-bold text-white/80 tracking-tight" style={H}>Quantara</span>
          </div>
          <p className="text-white/25 text-[13px] leading-relaxed max-w-sm" style={B}>
            Next-generation graph-powered financial crime detection.
            Uncover hidden networks before they impact your business.
          </p>
        </div>

        {/* Platform */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white/30 font-semibold tracking-wider text-[11px] uppercase" style={H}>Platform</h4>
          <div className="flex flex-col gap-2.5">
            {['Features', 'Process', 'Showcase'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`}
                className="text-white/20 hover:text-white/50 text-[13px] font-medium transition-colors w-fit" style={B}>
                {l}
              </a>
            ))}
          </div>
        </div>

        {/* App */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white/30 font-semibold tracking-wider text-[11px] uppercase" style={H}>Application</h4>
          <div className="flex flex-col gap-2.5">
            <a href="/login" className="text-white/20 hover:text-white/50 text-[13px] font-medium transition-colors w-fit" style={B}>Sign In</a>
            <a href="/dashboard" className="text-white/20 hover:text-white/50 text-[13px] font-medium transition-colors w-fit" style={B}>Dashboard</a>
            <a href="/admin" className="text-white/20 hover:text-white/50 text-[13px] font-medium transition-colors w-fit" style={B}>Admin</a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/[0.04] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/15 text-[12px]" style={B}>
          © {new Date().getFullYear()} Quantara. All rights reserved.
        </p>
        <p className="text-white/10 text-[11px]" style={B}>
          Securing financial infrastructure through advanced graph modeling.
        </p>
      </div>
    </div>
  </footer>
);



/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="bg-black min-h-screen text-white crystal-noise" style={B}>
      <Nav />
      <Hero />
      <Features />
      <Process />
      <Showcase />
      <CTA />
      <Footer />
    </div>
  );
}
