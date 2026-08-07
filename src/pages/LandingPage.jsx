import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Shield, Eye, Zap, BarChart3, Bell, Lock, ChevronDown, ArrowRight,
  Camera, AlertTriangle, CheckCircle, Activity, MapPin, Users, Upload,
  Cpu, Database, Globe, Star, ChevronRight, Play,
  TrendingUp, Radio, Layers, Server
} from 'lucide-react';

// Animated Counter
function Counter({ target, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true);
        let start = 0;
        const step = target / (duration * 60);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 1000 / 60);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, started]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// Floating particle
function Particle({ style }) {
  return (
    <motion.div
      style={{
        position: 'absolute', width: 4, height: 4,
        borderRadius: '50%', background: '#2563EB', opacity: 0.4, ...style,
      }}
      animate={{ y: [-20, 20, -20], opacity: [0.2, 0.6, 0.2] }}
      transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

// Feature Card
function FeatureCard({ icon: Icon, title, description, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.01 }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid rgba(255,255,255,0.08)`,
        borderRadius: 20,
        padding: 28,
        cursor: 'default',
        transition: 'border-color 0.3s',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="feature-card-hover"
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      }} />
      <div style={{
        width: 52, height: 52,
        background: `${color}18`,
        border: `1px solid ${color}40`,
        borderRadius: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 18,
      }}>
        <Icon size={22} color={color} />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC', marginBottom: 8, fontFamily: 'Poppins' }}>
        {title}
      </h3>
      <p style={{ fontSize: 13.5, color: '#94A3B8', lineHeight: 1.7 }}>{description}</p>
    </motion.div>
  );
}

// Step Card
function StepCard({ step, title, description, icon: Icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: step % 2 === 0 ? 40 : -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}
    >
      <div style={{ position: 'relative' }}>
        <div style={{
          width: 56, height: 56, minWidth: 56,
          background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 25px rgba(37,99,235,0.35)',
        }}>
          <Icon size={22} color="white" />
        </div>
        <div style={{
          position: 'absolute', top: -6, right: -6,
          width: 20, height: 20,
          background: '#0F172A',
          border: '2px solid #2563EB',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, fontWeight: 800, color: '#2563EB',
        }}>
          {step}
        </div>
      </div>
      <div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#F8FAFC', marginBottom: 8, fontFamily: 'Poppins' }}>
          {title}
        </h3>
        <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.7 }}>{description}</p>
      </div>
    </motion.div>
  );
}

// FAQ Item
function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      viewport={{ once: true }}
      style={{
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14,
        overflow: 'hidden',
        background: open ? 'rgba(37,99,235,0.05)' : 'rgba(255,255,255,0.02)',
        transition: 'all 0.3s',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', background: 'none', border: 'none',
          padding: '18px 22px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 14.5, fontWeight: 600, color: '#F8FAFC' }}>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={18} color="#64748B" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p style={{ padding: '0 22px 18px', fontSize: 14, color: '#94A3B8', lineHeight: 1.7 }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Radar / AI Visualization
function RadarVisualization() {
  return (
    <div style={{ position: 'relative', width: 380, height: 380, margin: '0 auto' }}>
      {/* Outer rings */}
      {[1, 0.7, 0.5, 0.35].map((scale, i) => (
        <div key={i} style={{
          position: 'absolute',
          inset: 0,
          border: `1px solid rgba(37,99,235,${0.15 + i * 0.05})`,
          borderRadius: '50%',
          transform: `scale(${scale})`,
          top: '50%', left: '50%',
          width: '100%', height: '100%',
          marginTop: `-${scale * 190}px`,
          marginLeft: `-${scale * 190}px`,
        }} />
      ))}

      {/* Rotating radar arm */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '50%', height: 2,
          transformOrigin: '0 50%',
          background: 'linear-gradient(90deg, #2563EB, transparent)',
          borderRadius: 2,
        }}
      />

      {/* Center dot */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 12, height: 12,
        background: '#2563EB',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 20px rgba(37,99,235,0.8)',
      }} />

      {/* Detection blips */}
      {[
        { top: '28%', left: '65%', color: '#EF4444', label: 'Violation' },
        { top: '60%', left: '25%', color: '#F97316', label: 'Helmet' },
        { top: '70%', left: '70%', color: '#22C55E', label: 'Clear' },
        { top: '20%', left: '35%', color: '#EF4444', label: 'Signal' },
      ].map((blip, i) => (
        <motion.div
          key={i}
          style={{ position: 'absolute', top: blip.top, left: blip.left }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
        >
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: blip.color,
            boxShadow: `0 0 10px ${blip.color}`,
          }} />
          <div style={{
            position: 'absolute', top: -20, left: 12,
            background: 'rgba(2,6,23,0.9)',
            border: `1px solid ${blip.color}40`,
            borderRadius: 6,
            padding: '2px 8px',
            fontSize: 10, fontWeight: 600, color: blip.color,
            whiteSpace: 'nowrap',
          }}>
            {blip.label}
          </div>
        </motion.div>
      ))}

      {/* Pulse rings from center */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 12, height: 12,
            border: '2px solid rgba(37,99,235,0.6)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ scale: [1, 12], opacity: [0.6, 0] }}
          transition={{ duration: 3, delay: i * 1, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {/* Corner labels */}
      <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 10, color: '#2563EB', fontFamily: 'monospace', fontWeight: 600 }}>
        LIVE SCAN
      </div>
      <div style={{ position: 'absolute', bottom: 10, left: 10, fontSize: 10, color: '#64748B', fontFamily: 'monospace' }}>
        AI-TVDS v2.4
      </div>
    </div>
  );
}

const faqs = [
  { q: 'How accurate is the AI detection?', a: 'Our AI model achieves 94-97% detection accuracy for common violations like helmet missing and signal jumping, trained on thousands of real traffic images from Indian roads.' },
  { q: 'What types of violations can be detected?', a: 'The system detects helmet violations, signal jumping, illegal parking, wrong-way driving, mobile usage while driving, no seatbelt, over-speeding indicators, and multiple simultaneous violations.' },
  { q: 'Is the system CCTV-compatible?', a: 'Yes, the Smart City Readiness module includes CCTV integration architecture. Officers can connect existing CCTV feeds for real-time monitoring (available in the Pro plan).' },
  { q: 'How is evidence authenticity verified?', a: 'Every uploaded file receives a SHA-256 hash, upload timestamp, and GPS metadata (if available). The Evidence Authenticity Indicator shows VERIFIED status for untampered files.' },
  { q: 'Can multiple officers use the system?', a: 'Yes, the system supports unlimited officer accounts with role-based access. Each officer has their own performance dashboard and case tracking.' },
  { q: 'Is there an offline mode?', a: 'The platform is cloud-based and requires internet connectivity. However, we are developing an offline detection module for remote deployment scenarios.' },
];

const features = [
  { icon: Eye, title: 'AI Violation Detection', description: 'Upload images or videos and get instant AI-powered detection with confidence scores and bounding box annotations.', color: '#2563EB' },
  { icon: AlertTriangle, title: 'Severity Scoring', description: 'Every violation is automatically scored from Low to Critical, enabling prioritized enforcement responses.', color: '#EF4444' },
  { icon: Activity, title: 'Repeat Offender Tracking', description: 'Vehicles with multiple violations are automatically flagged with warning badges and violation history.', color: '#F97316' },
  { icon: Zap, title: 'Smart Recommendations', description: 'AI generates zone-specific enforcement recommendations based on violation patterns and hotspot data.', color: '#06B6D4' },
  { icon: MapPin, title: 'Violation Hotspot Maps', description: 'Visualize high-risk zones with our heatmap-style analytics to deploy enforcement resources effectively.', color: '#22C55E' },
  { icon: Bell, title: 'Real-Time Alerts', description: 'Instant notifications for high-severity violations, sudden spikes, and repeat offenders require immediate action.', color: '#8B5CF6' },
  { icon: Lock, title: 'Evidence Authenticity', description: 'Cryptographic file hashing and timestamp verification ensures evidence integrity for legal proceedings.', color: '#F59E0B' },
  { icon: BarChart3, title: 'Advanced Analytics', description: 'Daily, weekly, and monthly violation trends with officer performance tracking and exportable reports.', color: '#EC4899' },
];

const steps = [
  { icon: Upload, title: 'Upload Evidence', description: 'Officers upload traffic images or videos directly from field devices. Supports JPG, PNG, MP4 formats up to 100MB.' },
  { icon: Cpu, title: 'AI Analysis', description: 'Our YOLO-based AI model scans the media in seconds, identifying violations with precise bounding box annotations.' },
  { icon: AlertTriangle, title: 'Get Results', description: 'View detected violations with confidence scores, severity ratings, AI recommendations, and evidence authenticity status.' },
  { icon: Database, title: 'Save & Report', description: 'Records are stored in the centralized database. Generate PDF/Excel reports and export violation data instantly.' },
];

const techStack = [
  { name: 'React.js', color: '#61DAFB', desc: 'Frontend Framework' },
  { name: 'Node.js', color: '#22C55E', desc: 'Backend Runtime' },
  { name: 'Firebase', color: '#F97316', desc: 'Auth & Database' },
  { name: 'YOLO / Roboflow', color: '#8B5CF6', desc: 'AI Detection Engine' },
  { name: 'Tailwind CSS', color: '#06B6D4', desc: 'UI Styling' },
  { name: 'Framer Motion', color: '#EC4899', desc: 'Animations' },
  { name: 'Recharts', color: '#F59E0B', desc: 'Data Visualization' },
  { name: 'Vercel + Render', color: '#2563EB', desc: 'Deployment' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [demoForm, setDemoForm] = useState({ name: '', org: '', email: '', role: '' });
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    setDemoSubmitted(true);
  };

  return (
    <div style={{ background: '#0F172A', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Navbar */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 32 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <div style={{
              width: 38, height: 38,
              background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={18} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#F8FAFC', fontFamily: 'Poppins', lineHeight: 1 }}>TVDS</div>
              <div style={{ fontSize: 9, color: '#64748B', fontWeight: 500, letterSpacing: 0.5 }}>AI Traffic Enforcement</div>
            </div>
          </div>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {['Features', 'How It Works', 'Technology', 'FAQ'].map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/ /g, '-')}`}
                style={{ fontSize: 13.5, color: '#94A3B8', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#F8FAFC'}
                onMouseLeave={e => e.target.style.color = '#94A3B8'}
              >
                {link}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
                color: '#F8FAFC', padding: '8px 18px', borderRadius: 9,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.target.style.borderColor = '#2563EB'; e.target.style.color = '#2563EB'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.color = '#F8FAFC'; }}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: 13 }}
            >
              Get Started <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 80 }}>
        {/* Background grid */}
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />

        {/* Gradient orbs */}
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: 700, height: 700,
          background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-10%',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <Particle key={i} style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }} />
        ))}

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', width: '100%' }}>
          {/* Left: Text */}
          <motion.div style={{ y: heroY }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(37,99,235,0.1)',
                border: '1px solid rgba(37,99,235,0.3)',
                borderRadius: 20, padding: '6px 16px',
                marginBottom: 24,
              }}
            >
              <div className="animate-blink" style={{ width: 6, height: 6, background: '#22C55E', borderRadius: '50%' }} />
              <span style={{ fontSize: 12, color: '#06B6D4', fontWeight: 600, letterSpacing: 0.5 }}>
                POWERED BY ARTIFICIAL INTELLIGENCE
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                fontSize: 54, fontWeight: 800, lineHeight: 1.1,
                color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 24,
              }}
            >
              Smarter Traffic
              <br />
              <span className="gradient-text">Enforcement</span>
              <br />
              Powered by AI
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{ fontSize: 16, color: '#94A3B8', lineHeight: 1.75, marginBottom: 36, maxWidth: 480 }}
            >
              Detect traffic violations from images and videos within seconds using Artificial Intelligence.
              Transform manual monitoring into a faster, smarter, and scalable traffic management workflow.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 48 }}
            >
              <button
                onClick={() => navigate('/signup')}
                className="btn-primary"
                style={{ padding: '13px 28px', fontSize: 14.5 }}
              >
                <Play size={16} /> Explore Platform
              </button>
              <a href="#demo-request">
                <button className="btn-secondary" style={{ padding: '13px 28px', fontSize: 14.5 }}>
                  <Radio size={16} /> Request Demo
                </button>
              </a>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ display: 'flex', gap: 32, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              {[
                { label: 'Detection Accuracy', value: 96, suffix: '%' },
                { label: 'Violations Processed', value: 12400, suffix: '+' },
                { label: 'Officers Onboarded', value: 340, suffix: '+' },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#F8FAFC', fontFamily: 'Poppins' }}>
                    <Counter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Radar Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="animate-float"
            style={{ position: 'relative' }}
          >
            {/* Outer glow card */}
            <div style={{
              background: 'rgba(37,99,235,0.05)',
              border: '1px solid rgba(37,99,235,0.15)',
              borderRadius: 28,
              padding: 32,
              position: 'relative',
              backdropFilter: 'blur(20px)',
            }}>
              {/* Top bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, padding: '0 8px' }}>
                <div style={{ width: 8, height: 8, background: '#EF4444', borderRadius: '50%' }} />
                <div style={{ width: 8, height: 8, background: '#F97316', borderRadius: '50%' }} />
                <div style={{ width: 8, height: 8, background: '#22C55E', borderRadius: '50%' }} />
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>
                  TVDS-AI-SCANNER
                </span>
              </div>

              <RadarVisualization />

              {/* Bottom status bar */}
              <div style={{
                marginTop: 20, padding: '12px 16px',
                background: 'rgba(0,0,0,0.3)', borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="animate-blink" style={{ width: 6, height: 6, background: '#22C55E', borderRadius: '50%' }} />
                  <span style={{ fontSize: 11, color: '#22C55E', fontFamily: 'monospace' }}>SCANNING ACTIVE</span>
                </div>
                <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>
                  4 DETECTIONS
                </span>
              </div>
            </div>

            {/* Floating violation cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', top: -20, right: -30,
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 12, padding: '10px 14px',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div style={{ fontSize: 10, color: '#EF4444', fontWeight: 600 }}>VIOLATION DETECTED</div>
              <div style={{ fontSize: 12, color: '#F8FAFC', fontWeight: 700 }}>Signal Jumping</div>
              <div style={{ fontSize: 10, color: '#64748B' }}>Confidence: 94.7%</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              style={{
                position: 'absolute', bottom: 30, left: -35,
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.25)',
                borderRadius: 12, padding: '10px 14px',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div style={{ fontSize: 10, color: '#22C55E', fontWeight: 600 }}>EVIDENCE SAVED</div>
              <div style={{ fontSize: 12, color: '#F8FAFC', fontWeight: 700 }}>VIO-2024-4829</div>
              <div style={{ fontSize: 10, color: '#64748B' }}>Integrity: VERIFIED</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          }}
        >
          <span style={{ fontSize: 11, color: '#475569', letterSpacing: 2, textTransform: 'uppercase' }}>Scroll</span>
          <ChevronDown size={16} color="#475569" />
        </motion.div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section style={{ padding: '48px 24px', background: 'rgba(37,99,235,0.05)', borderTop: '1px solid rgba(37,99,235,0.1)', borderBottom: '1px solid rgba(37,99,235,0.1)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {[
            { icon: Camera, label: 'Files Analyzed', value: 12400, suffix: '+', color: '#2563EB' },
            { icon: AlertTriangle, label: 'Violations Detected', value: 9840, suffix: '+', color: '#EF4444' },
            { icon: CheckCircle, label: 'Cases Resolved', value: 8200, suffix: '+', color: '#22C55E' },
            { icon: Users, label: 'Active Officers', value: 340, suffix: '+', color: '#06B6D4' },
          ].map(stat => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center' }}
            >
              <div style={{
                width: 44, height: 44,
                background: `${stat.color}18`,
                border: `1px solid ${stat.color}30`,
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px',
              }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#F8FAFC', fontFamily: 'Poppins' }}>
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 4 }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section id="features" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <div style={{
              display: 'inline-block', fontSize: 12, color: '#06B6D4', fontWeight: 600,
              letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16,
              padding: '6px 16px', background: 'rgba(6,182,212,0.08)',
              border: '1px solid rgba(6,182,212,0.2)', borderRadius: 20,
            }}>
              Platform Features
            </div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 16 }}>
              Everything you need for
              <br /><span className="gradient-text">Smart Traffic Enforcement</span>
            </h2>
            <p style={{ fontSize: 16, color: '#94A3B8', maxWidth: 540, margin: '0 auto' }}>
              A complete suite of AI-powered tools designed for modern traffic authorities.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 0.07} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" style={{
        padding: '100px 24px',
        background: 'linear-gradient(180deg, transparent, rgba(37,99,235,0.04), transparent)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          {/* Left: Steps */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div style={{
                display: 'inline-block', fontSize: 12, color: '#22C55E', fontWeight: 600,
                letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16,
                padding: '6px 16px', background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20,
              }}>
                How It Works
              </div>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 16 }}>
                From upload to
                <br /><span className="gradient-text">violation record</span>
                <br />in seconds
              </h2>
              <p style={{ fontSize: 15, color: '#94A3B8', marginBottom: 44, lineHeight: 1.7 }}>
                Our streamlined workflow makes it easy for officers to submit and process traffic evidence with minimal training.
              </p>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {steps.map((step, i) => (
                <StepCard key={step.title} step={i + 1} {...step} delay={i * 0.1} />
              ))}
            </div>
          </div>

          {/* Right: Mock dashboard preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
            }}
          >
            {/* Browser chrome */}
            <div style={{ padding: '12px 16px', background: 'rgba(2,6,23,0.8)', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['#EF4444', '#F97316', '#22C55E'].map(c => (
                <div key={c} style={{ width: 10, height: 10, background: c, borderRadius: '50%', opacity: 0.8 }} />
              ))}
              <div style={{ flex: 1, height: 22, background: 'rgba(255,255,255,0.04)', borderRadius: 6, marginLeft: 8 }} />
            </div>

            <div style={{ padding: 20 }}>
              {/* Detection result mock */}
              <div style={{ marginBottom: 16, padding: 16, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#EF4444' }}>⚠ VIOLATION DETECTED</span>
                  <span className="badge badge-red">HIGH</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    ['Type', 'Signal Jumping'],
                    ['Confidence', '94.7%'],
                    ['Vehicle', 'Car'],
                    ['Record ID', 'VIO-2024-8829'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 10, color: '#64748B' }}>{k}</div>
                      <div style={{ fontSize: 12, color: '#F8FAFC', fontWeight: 600 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendation */}
              <div style={{ padding: 14, background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 10, marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: '#06B6D4', fontWeight: 600, marginBottom: 6 }}>🤖 AI RECOMMENDATION</div>
                <div style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.6 }}>
                  Increase signal monitoring during peak traffic hours. Consider automated red-light camera installation.
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, padding: '9px 0', background: 'linear-gradient(135deg,#2563EB,#1D4ED8)', borderRadius: 9, textAlign: 'center', fontSize: 12, color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                  Save Record
                </div>
                <div style={{ flex: 1, padding: '9px 0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, textAlign: 'center', fontSize: 12, color: '#94A3B8', cursor: 'pointer' }}>
                  Download PDF
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── WHY IT MATTERS ─── */}
      <section id="why-it-matters" style={{ padding: '100px 24px', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <div style={{
              display: 'inline-block', fontSize: 12, color: '#F97316', fontWeight: 600,
              letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16,
              padding: '6px 16px', background: 'rgba(249,115,22,0.08)',
              border: '1px solid rgba(249,115,22,0.2)', borderRadius: 20,
            }}>
              Why It Matters
            </div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 16 }}>
              Real Impact on
              <span className="gradient-text-warm"> Road Safety</span>
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              {
                icon: TrendingUp, color: '#22C55E',
                title: '70% Faster Processing',
                desc: 'AI reduces manual violation review time from 15 minutes to under 30 seconds per case.',
              },
              {
                icon: Shield, color: '#2563EB',
                title: 'Legal-Grade Evidence',
                desc: 'Cryptographic evidence verification makes every detection court-admissible and tamper-proof.',
              },
              {
                icon: MapPin, color: '#EF4444',
                title: 'Smarter Deployment',
                desc: 'Hotspot analytics help authorities allocate enforcement resources where they matter most.',
              },
              {
                icon: Activity, color: '#06B6D4',
                title: 'Repeat Offender Control',
                desc: 'Automatic flagging of repeat violators enables targeted legal action and deterrence.',
              },
              {
                icon: Globe, color: '#8B5CF6',
                title: 'Smart City Ready',
                desc: 'Built for CCTV integration and real-time monitoring to scale with smart city infrastructure.',
              },
              {
                icon: Layers, color: '#F97316',
                title: 'Data-Driven Enforcement',
                desc: 'Analytics dashboards give commanders actionable insights for policy and deployment decisions.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                style={{
                  padding: 28,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 18,
                  transition: 'all 0.3s',
                }}
                whileHover={{ scale: 1.02, borderColor: `${item.color}40` }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{
                    width: 44, height: 44,
                    background: `${item.color}15`,
                    border: `1px solid ${item.color}30`,
                    borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <item.icon size={20} color={item.color} />
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', fontFamily: 'Poppins' }}>
                    {item.title}
                  </h3>
                </div>
                <p style={{ fontSize: 13.5, color: '#94A3B8', lineHeight: 1.7 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TECHNOLOGY STACK ─── */}
      <section id="technology" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <div style={{
              display: 'inline-block', fontSize: 12, color: '#8B5CF6', fontWeight: 600,
              letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16,
              padding: '6px 16px', background: 'rgba(139,92,246,0.08)',
              border: '1px solid rgba(139,92,246,0.2)', borderRadius: 20,
            }}>
              Technology Stack
            </div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: '#F8FAFC', fontFamily: 'Poppins' }}>
              Built with <span className="gradient-text">Production-Grade</span> Tech
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -4 }}
                style={{
                  padding: '20px 24px',
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${tech.color}20`,
                  borderRadius: 16,
                  textAlign: 'center',
                  cursor: 'default',
                  transition: 'all 0.3s',
                }}
              >
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: tech.color,
                  margin: '0 auto 12px',
                  boxShadow: `0 0 12px ${tech.color}`,
                }} />
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F8FAFC', marginBottom: 4 }}>{tech.name}</div>
                <div style={{ fontSize: 11, color: '#64748B' }}>{tech.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEMO REQUEST FORM ─── */}
      <section id="demo-request" style={{ padding: '100px 24px', background: 'rgba(37,99,235,0.04)', borderTop: '1px solid rgba(37,99,235,0.1)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 12 }}>
              Request a <span className="gradient-text">Live Demo</span>
            </h2>
            <p style={{ fontSize: 15, color: '#94A3B8' }}>
              See the platform in action with your own traffic footage.
            </p>
          </motion.div>

          {demoSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                textAlign: 'center', padding: '48px 32px',
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.25)',
                borderRadius: 20,
              }}
            >
              <CheckCircle size={48} color="#22C55E" style={{ marginBottom: 16 }} />
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#F8FAFC', marginBottom: 10 }}>Demo Request Received!</h3>
              <p style={{ color: '#94A3B8', fontSize: 14 }}>Our team will contact you within 24 hours to schedule your personalized demo.</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              onSubmit={handleDemoSubmit}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 24,
                padding: 36,
                display: 'flex', flexDirection: 'column', gap: 18,
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6, display: 'block' }}>Full Name</label>
                  <input
                    className="input-field"
                    placeholder="Rahul Sharma"
                    value={demoForm.name}
                    onChange={e => setDemoForm({ ...demoForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6, display: 'block' }}>Organization</label>
                  <input
                    className="input-field"
                    placeholder="Karnataka Police"
                    value={demoForm.org}
                    onChange={e => setDemoForm({ ...demoForm, org: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6, display: 'block' }}>Official Email</label>
                <input
                  className="input-field"
                  type="email"
                  placeholder="officer@police.gov.in"
                  value={demoForm.email}
                  onChange={e => setDemoForm({ ...demoForm, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6, display: 'block' }}>Designation</label>
                <select
                  className="input-field"
                  value={demoForm.role}
                  onChange={e => setDemoForm({ ...demoForm, role: e.target.value })}
                  required
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Select your role</option>
                  <option>Inspector</option>
                  <option>Sub-Inspector</option>
                  <option>ASI</option>
                  <option>Constable</option>
                  <option>Commissioner</option>
                  <option>Other</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '13px 24px', justifyContent: 'center', fontSize: 14.5 }}>
                <Radio size={16} /> Submit Demo Request
              </button>
            </motion.form>
          )}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 12 }}>
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((faq, i) => <FAQItem key={i} {...faq} index={i} />)}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(6,182,212,0.1))',
              border: '1px solid rgba(37,99,235,0.25)',
              borderRadius: 28,
              padding: '56px 48px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(37,99,235,0.08) 0%, transparent 70%)',
            }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 12, color: '#06B6D4', fontWeight: 600, letterSpacing: 2, marginBottom: 20, textTransform: 'uppercase' }}>
                Ready to Transform Traffic Enforcement?
              </div>
              <h2 style={{ fontSize: 38, fontWeight: 800, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 16 }}>
                Start detecting violations with AI today
              </h2>
              <p style={{ fontSize: 15, color: '#94A3B8', marginBottom: 36 }}>
                Join hundreds of traffic officers already using TVDS to make roads safer.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                <button onClick={() => navigate('/signup')} className="btn-primary" style={{ padding: '13px 32px', fontSize: 14.5 }}>
                  Get Started Free <ArrowRight size={16} />
                </button>
                <button onClick={() => navigate('/login')} className="btn-secondary" style={{ padding: '13px 32px', fontSize: 14.5 }}>
                  Sign In
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '48px 24px 32px',
        background: '#020617',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 36, height: 36,
                  background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Shield size={16} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#F8FAFC', fontFamily: 'Poppins' }}>TVDS</div>
                  <div style={{ fontSize: 10, color: '#64748B' }}>AI Traffic Enforcement</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, maxWidth: 280 }}>
                AI-powered traffic violation detection system for modern traffic authorities. Smarter enforcement, safer roads.
              </p>
            </div>

            {[
              { title: 'Platform', links: ['Dashboard', 'Upload Evidence', 'Analytics', 'Reports'] },
              { title: 'Features', links: ['AI Detection', 'Hotspot Maps', 'Smart Alerts', 'Evidence Auth'] },
              { title: 'Resources', links: ['Documentation', 'API Reference', 'Setup Guide', 'Contact'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#F8FAFC', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {col.title}
                </div>
                {col.links.map(link => (
                  <div key={link} style={{ fontSize: 13, color: '#64748B', marginBottom: 10, cursor: 'pointer', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#94A3B8'}
                    onMouseLeave={e => e.target.style.color = '#64748B'}
                  >
                    {link}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{
            paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ fontSize: 12, color: '#475569' }}>
              © 2024 TVDS — AI Smart Traffic Violation Detection System. All rights reserved.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#475569' }}>
              <div style={{ width: 6, height: 6, background: '#22C55E', borderRadius: '50%', animation: 'blink 1.5s infinite' }} />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
