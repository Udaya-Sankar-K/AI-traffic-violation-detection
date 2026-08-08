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

// Floating particle removed

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
        background: '#FFFFFF',
        border: `1px solid rgba(32,36,33,0.1)`,
        boxShadow: '0 1px 4px rgba(32,36,33,0.08)',
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
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#202421', marginBottom: 8, fontFamily: 'Poppins' }}>
        {title}
      </h3>
      <p style={{ fontSize: 13.5, color: '#5A6060', lineHeight: 1.7 }}>{description}</p>
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
          background: '#287C78',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(40,124,120,0.15)',
        }}>
          <Icon size={22} color="white" />
        </div>
        <div style={{
          position: 'absolute', top: -6, right: -6,
          width: 20, height: 20,
          background: '#FFFFFF',
          border: '2px solid #287C78',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, fontWeight: 800, color: '#287C78',
        }}>
          {step}
        </div>
      </div>
      <div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#202421', marginBottom: 8, fontFamily: 'Poppins' }}>
          {title}
        </h3>
        <p style={{ fontSize: 14, color: '#5A6060', lineHeight: 1.7 }}>{description}</p>
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
        border: '1px solid rgba(32,36,33,0.1)',
        boxShadow: '0 1px 4px rgba(32,36,33,0.08)',
        borderRadius: 14,
        overflow: 'hidden',
        background: open ? 'rgba(40,124,120,0.08)' : '#FFFFFF',
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
        <span style={{ fontSize: 14.5, fontWeight: 600, color: '#202421' }}>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={18} color="#5A6060" />
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
            <p style={{ padding: '0 22px 18px', fontSize: 14, color: '#5A6060', lineHeight: 1.7 }}>{a}</p>
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
          border: `1px solid rgba(40,124,120,${0.15 + i * 0.05})`,
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
          background: 'linear-gradient(90deg, #287C78, transparent)',
          borderRadius: 2,
        }}
      />

      {/* Center dot */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 12, height: 12,
        background: '#287C78',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 2px 8px rgba(40,124,120,0.15)',
      }} />

      {/* Detection blips */}
      {[
        { top: '28%', left: '65%', color: '#C94C4C', label: 'Violation' },
        { top: '60%', left: '25%', color: '#C9824B', label: 'Helmet' },
        { top: '70%', left: '70%', color: '#287C78', label: 'Clear' },
        { top: '20%', left: '35%', color: '#C94C4C', label: 'Signal' },
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
            background: '#FFFFFF',
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
            border: '2px solid rgba(40,124,120,0.6)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ scale: [1, 12], opacity: [0.6, 0] }}
          transition={{ duration: 3, delay: i * 1, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {/* Corner labels */}
      <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 10, color: '#287C78', fontFamily: 'monospace', fontWeight: 600 }}>
        LIVE SCAN
      </div>
      <div style={{ position: 'absolute', bottom: 10, left: 10, fontSize: 10, color: '#8A9090', fontFamily: 'monospace' }}>
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
  { icon: Eye, title: 'AI Violation Detection', description: 'Upload images or videos and get instant AI-powered detection with confidence scores and bounding box annotations.', color: '#287C78' },
  { icon: AlertTriangle, title: 'Severity Scoring', description: 'Every violation is automatically scored from Low to Critical, enabling prioritized enforcement responses.', color: '#C94C4C' },
  { icon: Activity, title: 'Repeat Offender Tracking', description: 'Vehicles with multiple violations are automatically flagged with warning badges and violation history.', color: '#C9824B' },
  { icon: Zap, title: 'Smart Recommendations', description: 'AI generates zone-specific enforcement recommendations based on violation patterns and hotspot data.', color: '#287C78' },
  { icon: MapPin, title: 'Violation Hotspot Maps', description: 'Visualize high-risk zones with our heatmap-style analytics to deploy enforcement resources effectively.', color: '#287C78' },
  { icon: Bell, title: 'Real-Time Alerts', description: 'Instant notifications for high-severity violations, sudden spikes, and repeat offenders require immediate action.', color: '#287C78' },
  { icon: Lock, title: 'Evidence Authenticity', description: 'Cryptographic file hashing and timestamp verification ensures evidence integrity for legal proceedings.', color: '#287C78' },
  { icon: BarChart3, title: 'Advanced Analytics', description: 'Daily, weekly, and monthly violation trends with officer performance tracking and exportable reports.', color: '#287C78' },
];

const steps = [
  { icon: Upload, title: 'Upload Evidence', description: 'The officer uploads a traffic image or video from field devices or a dashcam. Supports JPG, PNG, and MP4 formats up to 100MB.' },
  { icon: Cpu, title: 'AI Analysis', description: 'The AI model scans the media and identifies potential violations with confidence scores and bounding box annotations.' },
  { icon: Eye, title: 'Officer Review', description: 'The officer reviews the AI output, verifies the detected violation, and decides whether to confirm or dismiss the case.' },
  { icon: Database, title: 'Violation Record', description: 'Confirmed violations are stored in the centralized database. The officer can generate PDF/Excel reports and export records.' },
];

const techStack = [
  { name: 'React.js', color: '#287C78', desc: 'Frontend Framework' },
  { name: 'Node.js', color: '#287C78', desc: 'Backend Runtime' },
  { name: 'Firebase', color: '#C9824B', desc: 'Auth & Database' },
  { name: 'YOLO / Roboflow', color: '#287C78', desc: 'AI Detection Engine' },
  { name: 'Tailwind CSS', color: '#287C78', desc: 'UI Styling' },
  { name: 'Framer Motion', color: '#287C78', desc: 'Animations' },
  { name: 'Recharts', color: '#287C78', desc: 'Data Visualization' },
  { name: 'Vercel + Render', color: '#287C78', desc: 'Deployment' },
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
    <div style={{ background: '#F7F6F2', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Navbar */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 32 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <div style={{
              width: 38, height: 38,
              background: '#287C78',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={18} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#202421', fontFamily: 'Poppins', lineHeight: 1 }}>TVDS</div>
              <div style={{ fontSize: 9, color: '#8A9090', fontWeight: 500, letterSpacing: 0.5 }}>AI Traffic Enforcement</div>
            </div>
          </div>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {['Features', 'How It Works', 'Technology', 'FAQ'].map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/ /g, '-')}`}
                style={{ fontSize: 13.5, color: '#5A6060', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#202421'}
                onMouseLeave={e => e.target.style.color = '#5A6060'}
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
                color: '#202421', padding: '8px 18px', borderRadius: 9,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.target.style.borderColor = '#287C78'; e.target.style.color = '#287C78'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.color = '#202421'; }}
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

      {/* â”€â”€â”€ HERO SECTION â”€â”€â”€ */}
      <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 80 }}>
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
                background: 'rgba(40,124,120,0.08)',
                border: '1px solid rgba(40,124,120,0.2)',
                borderRadius: 20, padding: '6px 16px',
                marginBottom: 24,
              }}
            >

              <div className="animate-blink" style={{ width: 6, height: 6, background: '#287C78', borderRadius: '50%' }} />
              <span style={{ fontSize: 12, color: '#287C78', fontWeight: 600, letterSpacing: 0.5 }}>
                FOR TRAFFIC ENFORCEMENT OFFICERS
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                fontSize: 52, fontWeight: 800, lineHeight: 1.12,
                color: '#202421', fontFamily: 'Poppins', marginBottom: 24,
              }}
            >
              AI-Powered Traffic
              <br />
              <span className="gradient-text" style={{ color: '#287C78' }}>Violation Detection</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{ fontSize: 15.5, color: '#5A6060', lineHeight: 1.75, marginBottom: 12, maxWidth: 480 }}
            >
              Smarter tools for traffic enforcement officers.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              style={{ fontSize: 14.5, color: '#8A9090', lineHeight: 1.75, marginBottom: 36, maxWidth: 480 }}
            >
              Upload traffic images or videos, let AI detect violations automatically,
              then review and record confirmed cases â€” all from one platform.
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
              style={{ display: 'flex', gap: 32, paddingTop: 28, borderTop: '1px solid rgba(32,36,33,0.08)' }}
            >
              {[
                { label: 'Model Accuracy (demo)', value: 94, suffix: '%' },
                { label: 'Violation Types Supported', value: 7, suffix: '' },
                { label: 'Processing Time', value: 3, suffix: 's avg' },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#202421', fontFamily: 'Poppins' }}>
                    <Counter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div style={{ fontSize: 12, color: '#8A9090', fontWeight: 500 }}>{stat.label}</div>
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
              background: 'rgba(40,124,120,0.05)',
              border: '1px solid rgba(40,124,120,0.15)',
              borderRadius: 28,
              padding: 32,
              position: 'relative',
              backdropFilter: 'blur(20px)',
            }}>
              {/* Top bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, padding: '0 8px' }}>
                <div style={{ width: 8, height: 8, background: '#C94C4C', borderRadius: '50%' }} />
                <div style={{ width: 8, height: 8, background: '#C9824B', borderRadius: '50%' }} />
                <div style={{ width: 8, height: 8, background: '#287C78', borderRadius: '50%' }} />
                <div style={{ flex: 1, height: 1, background: 'rgba(32,36,33,0.08)' }} />
                <span style={{ fontSize: 11, color: '#8A9090', fontFamily: 'monospace' }}>
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
                  <div className="animate-blink" style={{ width: 6, height: 6, background: '#287C78', borderRadius: '50%' }} />
                  <span style={{ fontSize: 11, color: '#287C78', fontFamily: 'monospace' }}>SCANNING ACTIVE</span>
                </div>
                <span style={{ fontSize: 11, color: '#8A9090', fontFamily: 'monospace' }}>
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
                background: 'rgba(201,76,76,0.1)',
                border: '1px solid rgba(201,76,76,0.3)',
                borderRadius: 12, padding: '10px 14px',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div style={{ fontSize: 10, color: '#C94C4C', fontWeight: 600 }}>VIOLATION DETECTED</div>
              <div style={{ fontSize: 12, color: '#202421', fontWeight: 700 }}>Signal Jumping</div>
              <div style={{ fontSize: 10, color: '#8A9090' }}>Confidence: 94.7%</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              style={{
                position: 'absolute', bottom: 30, left: -35,
                background: 'rgba(40,124,120,0.08)',
                border: '1px solid rgba(40,124,120,0.25)',
                borderRadius: 12, padding: '10px 14px',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div style={{ fontSize: 10, color: '#287C78', fontWeight: 600 }}>EVIDENCE SAVED</div>
              <div style={{ fontSize: 12, color: '#202421', fontWeight: 700 }}>VIO-2024-4829</div>
              <div style={{ fontSize: 10, color: '#8A9090' }}>Integrity: VERIFIED</div>
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
          <span style={{ fontSize: 11, color: '#8A9090', letterSpacing: 2, textTransform: 'uppercase' }}>Scroll</span>
          <ChevronDown size={16} color="#8A9090" />
        </motion.div>
      </section>

      {/* â”€â”€â”€ SYSTEM CAPABILITIES BAR â”€â”€â”€ */}
      <section style={{ padding: '40px 24px', background: 'rgba(40,124,120,0.05)', borderTop: '1px solid rgba(40,124,120,0.1)', borderBottom: '1px solid rgba(40,124,120,0.1)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 28, fontSize: 11, color: '#8A9090', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>
            System Capabilities
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {[
              { icon: Camera, label: 'Image & Video Upload', value: 100, suffix: 'MB max', color: '#287C78' },
              { icon: AlertTriangle, label: 'Violation Types', value: 7, suffix: ' categories', color: '#C94C4C' },
              { icon: CheckCircle, label: 'AI Detection Speed', value: 3, suffix: 's avg', color: '#287C78' },
              { icon: Users, label: 'Multi-Officer Support', value: null, suffix: 'Role-based access', color: '#287C78' },
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
                <div style={{ fontSize: stat.value ? 26 : 15, fontWeight: 800, color: '#202421', fontFamily: 'Poppins' }}>
                  {stat.value ? <Counter target={stat.value} suffix={stat.suffix} /> : stat.suffix}
                </div>
                <div style={{ fontSize: 12, color: '#8A9090', marginTop: 4 }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ FEATURES SECTION â”€â”€â”€ */}
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
              display: 'inline-block', fontSize: 12, color: '#287C78', fontWeight: 600,
              letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16,
              padding: '6px 16px', background: 'rgba(40,124,120,0.08)',
              border: '1px solid rgba(40,124,120,0.2)', borderRadius: 20,
            }}>
              Platform Features
            </div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: '#202421', fontFamily: 'Poppins', marginBottom: 16 }}>
              Everything you need for
              <br /><span className="gradient-text">Smart Traffic Enforcement</span>
            </h2>
            <p style={{ fontSize: 16, color: '#5A6060', maxWidth: 540, margin: '0 auto' }}>
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

      {/* â”€â”€â”€ HOW IT WORKS â”€â”€â”€ */}
      <section id="how-it-works" style={{
        padding: '100px 24px',
        background: 'linear-gradient(180deg, transparent, rgba(40,124,120,0.04), transparent)',
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
                display: 'inline-block', fontSize: 12, color: '#287C78', fontWeight: 600,
                letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16,
                padding: '6px 16px', background: 'rgba(40,124,120,0.08)',
                border: '1px solid rgba(40,124,120,0.2)', borderRadius: 20,
              }}>
                How It Works
              </div>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: '#202421', fontFamily: 'Poppins', marginBottom: 16 }}>
                From upload to
                <br /><span className="gradient-text">violation record</span>
                <br />in seconds
              </h2>
              <p style={{ fontSize: 15, color: '#5A6060', marginBottom: 44, lineHeight: 1.7 }}>
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
              background: '#FFFFFF',
              border: '1px solid rgba(32,36,33,0.1)',
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
            }}
          >
            {/* Browser chrome */}
            <div style={{ padding: '12px 16px', background: 'rgba(2,6,23,0.8)', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(32,36,33,0.08)' }}>
              {['#C94C4C', '#C9824B', '#287C78'].map(c => (
                <div key={c} style={{ width: 10, height: 10, background: c, borderRadius: '50%', opacity: 0.8 }} />
              ))}
              <div style={{ flex: 1, height: 22, background: '#FFFFFF', borderRadius: 6, marginLeft: 8 }} />
            </div>

            <div style={{ padding: 20 }}>
              {/* Detection result mock */}
              <div style={{ marginBottom: 16, padding: 16, background: 'rgba(201,76,76,0.08)', border: '1px solid rgba(201,76,76,0.2)', borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#C94C4C' }}>âš  VIOLATION DETECTED</span>
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
                      <div style={{ fontSize: 10, color: '#8A9090' }}>{k}</div>
                      <div style={{ fontSize: 12, color: '#202421', fontWeight: 600 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendation */}
              <div style={{ padding: 14, background: 'rgba(40,124,120,0.06)', border: '1px solid rgba(40,124,120,0.15)', borderRadius: 10, marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: '#287C78', fontWeight: 600, marginBottom: 6 }}>ðŸ¤– AI RECOMMENDATION</div>
                <div style={{ fontSize: 12, color: '#5A6060', lineHeight: 1.6 }}>
                  Increase signal monitoring during peak traffic hours. Consider automated red-light camera installation.
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, padding: '9px 0', background: 'linear-gradient(135deg,#2563EB,#1D4ED8)', borderRadius: 9, textAlign: 'center', fontSize: 12, color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                  Save Record
                </div>
                <div style={{ flex: 1, padding: '9px 0', background: '#FFFFFF', border: '1px solid rgba(32,36,33,0.12)', borderRadius: 9, textAlign: 'center', fontSize: 12, color: '#5A6060', cursor: 'pointer' }}>
                  Download PDF
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* â”€â”€â”€ VIOLATION TYPES â”€â”€â”€ */}
      <section id="violation-types" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <div style={{
              display: 'inline-block', fontSize: 12, color: '#C9824B', fontWeight: 600,
              letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14,
              padding: '6px 16px', background: 'rgba(201,130,75,0.08)',
              border: '1px solid rgba(201,130,75,0.2)', borderRadius: 20,
            }}>
              Supported Violations
            </div>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: '#202421', fontFamily: 'Poppins', marginBottom: 12 }}>
              What the system can detect
            </h2>
            <p style={{ fontSize: 14, color: '#8A9090', maxWidth: 520, margin: '0 auto' }}>
              The AI engine is trained to identify the following traffic violation categories.
              All detections are reviewed and confirmed by the officer before being recorded.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
              { emoji: 'ðŸª–', label: 'Helmetless Riding',        desc: 'Two-wheeler rider without helmet',             color: '#C9824B', status: 'Supported' },
              { emoji: 'ðŸš¦', label: 'Signal Jumping',            desc: 'Crossing a red traffic signal',               color: '#C94C4C', status: 'Supported' },
              { emoji: 'ðŸ…¿ï¸', label: 'Illegal Parking',           desc: 'Parking in prohibited areas',                 color: '#287C78', status: 'Supported' },
              { emoji: 'ðŸš«', label: 'No-Parking Zone',           desc: 'Stopping in marked no-parking zones',        color: '#287C78', status: 'Supported' },
              { emoji: 'ðŸ¦“', label: 'Zebra Crossing Violation',  desc: 'Blocking a pedestrian crossing',             color: '#C9824B', status: 'Supported' },
              { emoji: 'â†©ï¸', label: 'Wrong-Way Driving',         desc: 'Travelling against traffic direction',       color: '#DC2626', status: 'Supported' },
              { emoji: 'ðŸï¸', label: 'Triple Riding',              desc: 'Three or more persons on a two-wheeler',    color: '#10B981', status: 'Supported' },
            ].map((v, i) => (
              <motion.div
                key={v.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                viewport={{ once: true }}
                style={{
                  padding: '18px 16px',
                  background: '#FFFFFF',
                  border: `1px solid ${v.color}20`,
                  borderRadius: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ fontSize: 24, lineHeight: 1 }}>{v.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#202421', lineHeight: 1.3 }}>{v.label}</div>
                <div style={{ fontSize: 11.5, color: '#8A9090', lineHeight: 1.5, flex: 1 }}>{v.desc}</div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: 10, fontWeight: 600, color: '#287C78',
                  background: 'rgba(40,124,120,0.08)',
                  border: '1px solid rgba(40,124,120,0.2)',
                  borderRadius: 6, padding: '3px 8px', width: 'fit-content',
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#287C78' }} />
                  {v.status}
                </div>
              </motion.div>
            ))}
            {/* Placeholder 8th card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.42 }}
              viewport={{ once: true }}
              style={{
                padding: '18px 16px',
                background: 'rgba(255,255,255,0.01)',
                border: '1px dashed rgba(32,36,33,0.1)',
                borderRadius: 16,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 8, textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 22, color: '#5A6060' }}>+</div>
              <div style={{ fontSize: 12, color: '#8A9090', fontWeight: 600 }}>More categories</div>
              <div style={{ fontSize: 11, color: '#5A6060' }}>Connect a custom YOLO model to expand detection</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ WHY IT MATTERS â”€â”€â”€ */}
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
              display: 'inline-block', fontSize: 12, color: '#C9824B', fontWeight: 600,
              letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16,
              padding: '6px 16px', background: 'rgba(201,130,75,0.08)',
              border: '1px solid rgba(201,130,75,0.2)', borderRadius: 20,
            }}>
              Why It Matters
            </div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: '#202421', fontFamily: 'Poppins', marginBottom: 16 }}>
              Real Impact on
              <span className="gradient-text-warm"> Road Safety</span>
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              {
                icon: TrendingUp, color: '#287C78',
                title: '70% Faster Processing',
                desc: 'AI reduces manual violation review time from 15 minutes to under 30 seconds per case.',
              },
              {
                icon: Shield, color: '#287C78',
                title: 'Legal-Grade Evidence',
                desc: 'Cryptographic evidence verification makes every detection court-admissible and tamper-proof.',
              },
              {
                icon: MapPin, color: '#C94C4C',
                title: 'Smarter Deployment',
                desc: 'Hotspot analytics help authorities allocate enforcement resources where they matter most.',
              },
              {
                icon: Activity, color: '#287C78',
                title: 'Repeat Offender Control',
                desc: 'Automatic flagging of repeat violators enables targeted legal action and deterrence.',
              },
              {
                icon: Globe, color: '#287C78',
                title: 'Smart City Ready',
                desc: 'Built for CCTV integration and real-time monitoring to scale with smart city infrastructure.',
              },
              {
                icon: Layers, color: '#C9824B',
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
                  background: '#FFFFFF',
                  border: '1px solid rgba(32,36,33,0.08)',
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
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#202421', fontFamily: 'Poppins' }}>
                    {item.title}
                  </h3>
                </div>
                <p style={{ fontSize: 13.5, color: '#5A6060', lineHeight: 1.7 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ TECHNOLOGY STACK â”€â”€â”€ */}
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
              display: 'inline-block', fontSize: 12, color: '#287C78', fontWeight: 600,
              letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16,
              padding: '6px 16px', background: 'rgba(139,92,246,0.08)',
              border: '1px solid rgba(139,92,246,0.2)', borderRadius: 20,
            }}>
              Technology Stack
            </div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: '#202421', fontFamily: 'Poppins' }}>
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
                  background: '#FFFFFF',
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
                <div style={{ fontSize: 14, fontWeight: 700, color: '#202421', marginBottom: 4 }}>{tech.name}</div>
                <div style={{ fontSize: 11, color: '#8A9090' }}>{tech.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ DEMO REQUEST FORM â”€â”€â”€ */}
      <section id="demo-request" style={{ padding: '100px 24px', background: 'rgba(40,124,120,0.04)', borderTop: '1px solid rgba(40,124,120,0.1)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#202421', fontFamily: 'Poppins', marginBottom: 12 }}>
              Request a <span className="gradient-text">Live Demo</span>
            </h2>
            <p style={{ fontSize: 15, color: '#5A6060' }}>
              See the platform in action with your own traffic footage.
            </p>
          </motion.div>

          {demoSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                textAlign: 'center', padding: '48px 32px',
                background: 'rgba(40,124,120,0.08)',
                border: '1px solid rgba(40,124,120,0.25)',
                borderRadius: 20,
              }}
            >
              <CheckCircle size={48} color="#287C78" style={{ marginBottom: 16 }} />
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#202421', marginBottom: 10 }}>Demo Request Received!</h3>
              <p style={{ color: '#5A6060', fontSize: 14 }}>Our team will contact you within 24 hours to schedule your personalized demo.</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              onSubmit={handleDemoSubmit}
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(32,36,33,0.1)',
                borderRadius: 24,
                padding: 36,
                display: 'flex', flexDirection: 'column', gap: 18,
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#5A6060', marginBottom: 6, display: 'block' }}>Full Name</label>
                  <input
                    className="input-field"
                    placeholder="Rahul Sharma"
                    value={demoForm.name}
                    onChange={e => setDemoForm({ ...demoForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#5A6060', marginBottom: 6, display: 'block' }}>Organization</label>
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
                <label style={{ fontSize: 12, color: '#5A6060', marginBottom: 6, display: 'block' }}>Official Email</label>
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
                <label style={{ fontSize: 12, color: '#5A6060', marginBottom: 6, display: 'block' }}>Designation</label>
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

      {/* â”€â”€â”€ FAQ â”€â”€â”€ */}
      <section id="faq" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#202421', fontFamily: 'Poppins', marginBottom: 12 }}>
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((faq, i) => <FAQItem key={i} {...faq} index={i} />)}
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ CTA BANNER â”€â”€â”€ */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(135deg, rgba(40,124,120,0.15), rgba(40,124,120,0.1))',
              border: '1px solid rgba(40,124,120,0.25)',
              borderRadius: 28,
              padding: '56px 48px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(40,124,120,0.08) 0%, transparent 70%)',
            }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 12, color: '#287C78', fontWeight: 600, letterSpacing: 2, marginBottom: 20, textTransform: 'uppercase' }}>
                Ready to Transform Traffic Enforcement?
              </div>
              <h2 style={{ fontSize: 38, fontWeight: 800, color: '#202421', fontFamily: 'Poppins', marginBottom: 16 }}>
                Start detecting violations with AI today
              </h2>
              <p style={{ fontSize: 15, color: '#5A6060', marginBottom: 36 }}>
                Built for traffic enforcement officers. Upload evidence, let AI assist,
                review results, and record confirmed violations â€” all in one place.
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

      {/* â”€â”€â”€ FOOTER â”€â”€â”€ */}
      <footer style={{
        borderTop: '1px solid rgba(32,36,33,0.08)',
        padding: '48px 24px 32px',
        background: '#202421',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 36, height: 36,
                  background: '#287C78',
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Shield size={16} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#202421', fontFamily: 'Poppins' }}>TVDS</div>
                  <div style={{ fontSize: 10, color: '#8A9090' }}>AI Traffic Enforcement</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#8A9090', lineHeight: 1.7, maxWidth: 280 }}>
                AI-powered traffic violation detection system for modern traffic authorities. Smarter enforcement, safer roads.
              </p>
            </div>

            {[
              { title: 'Platform', links: ['Dashboard', 'Upload Evidence', 'Analytics', 'Reports'] },
              { title: 'Features', links: ['AI Detection', 'Hotspot Maps', 'Smart Alerts', 'Evidence Auth'] },
              { title: 'Resources', links: ['Documentation', 'API Reference', 'Setup Guide', 'Contact'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#202421', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {col.title}
                </div>
                {col.links.map(link => (
                  <div key={link} style={{ fontSize: 13, color: '#8A9090', marginBottom: 10, cursor: 'pointer', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#5A6060'}
                    onMouseLeave={e => e.target.style.color = '#8A9090'}
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
            <div style={{ fontSize: 12, color: '#8A9090' }}>
              Â© 2024 TVDS â€” AI Smart Traffic Violation Detection System. All rights reserved.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#8A9090' }}>
              <div style={{ width: 6, height: 6, background: '#287C78', borderRadius: '50%', animation: 'blink 1.5s infinite' }} />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

