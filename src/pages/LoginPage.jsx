import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle, Lock, User, Scan, Fingerprint } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import FaceCaptureModal from '../components/auth/FaceCaptureModal';

export default function LoginPage() {
  const navigate   = useNavigate();
  const { login }  = useAuth();

  const [form,     setForm]     = useState({ policeId: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [step,     setStep]     = useState(1);   // 1 = credentials, 2 = face verify

  // ── Step 1: Validate credentials → open face modal ─────────────────────

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate credentials first (but don't complete login yet)
      await login(form.policeId, form.password, { dryRun: true });
    } catch (err) {
      // If credentials are invalid stop here
      if (err.message?.toLowerCase().includes('invalid') ||
          err.message?.toLowerCase().includes('password') ||
          err.message?.toLowerCase().includes('not found')) {
        setError(err.message);
        setLoading(false);
        return;
      }
      // Otherwise allow demo mode through (credentials accepted)
    }

    setLoading(false);
    setStep(2); // open face verification
  };

  // ── Step 2: Face verified → complete login ──────────────────────────────

  const handleFaceSuccess = async () => {
    setStep(1);
    setLoading(true);
    setError('');
    try {
      await login(form.policeId, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleFaceCancel = () => {
    setStep(1);
    setError('Face verification is required to access the system. Please try again.');
  };

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <>
      <div style={{
        minHeight: '100vh', background: '#0F172A',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid bg */}
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
        {/* Orbs */}
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 440, padding: '0 24px', position: 'relative', zIndex: 1 }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4, type: 'spring' }}
              style={{
                width: 64, height: 64,
                background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                borderRadius: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 12px 40px rgba(37,99,235,0.4)',
              }}
            >
              <Shield size={28} color="white" />
            </motion.div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 6 }}>
              Officer Sign In
            </h1>
            <p style={{ fontSize: 13.5, color: '#64748B' }}>Traffic Violation Detection System</p>
          </div>

          {/* 2-Factor Indicators */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
            {[
              { n: 1, icon: Lock, label: 'Credentials', active: step >= 1 },
              { n: 2, icon: Scan, label: 'Face Verify', active: step >= 2 },
            ].map(s => (
              <motion.div
                key={s.n}
                animate={{
                  background: s.active ? 'rgba(37,99,235,0.1)' : 'rgba(255,255,255,0.02)',
                  borderColor: s.active ? 'rgba(37,99,235,0.3)' : 'rgba(255,255,255,0.07)',
                }}
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: 12, border: '1px solid',
                  display: 'flex', alignItems: 'center', gap: 9,
                }}
              >
                <motion.div
                  animate={{
                    background: s.active ? 'linear-gradient(135deg, #2563EB, #06B6D4)' : 'rgba(255,255,255,0.04)',
                  }}
                  style={{
                    width: 28, height: 28, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <s.icon size={13} color={s.active ? 'white' : '#475569'} />
                </motion.div>
                <div>
                  <div style={{ fontSize: 10, color: '#64748B', marginBottom: 1 }}>Step {s.n}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: s.active ? '#F8FAFC' : '#475569' }}>
                    {s.label}
                  </div>
                </div>
                {step > s.n && (
                  <CheckCircle size={14} color="#22C55E" style={{ marginLeft: 'auto' }} />
                )}
              </motion.div>
            ))}
          </div>

          {/* Card */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 24, padding: 32,
            backdropFilter: 'blur(20px)',
          }}>
            {/* Demo hint */}
            <div style={{
              background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)',
              borderRadius: 10, padding: '10px 14px', marginBottom: 24,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <CheckCircle size={14} color="#06B6D4" />
              <span style={{ fontSize: 12, color: '#94A3B8' }}>
                <strong style={{ color: '#06B6D4' }}>Demo:</strong> Any Police ID + 6+ char password → face verification auto-succeeds
              </span>
            </div>

            <AnimatePresence mode="wait">
              {/* ─ Step 1: Credentials form ─ */}
              {!loading && (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleCredentialsSubmit}
                  style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
                >
                  <div>
                    <label style={{ fontSize: 12.5, color: '#94A3B8', fontWeight: 500, marginBottom: 7, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <User size={13} /> Police ID / Force Number
                    </label>
                    <input
                      className="input-field"
                      placeholder="POL-9821"
                      value={form.policeId}
                      onChange={e => setForm({ ...form, policeId: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 12.5, color: '#94A3B8', fontWeight: 500, marginBottom: 7, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Lock size={13} /> Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        className="input-field"
                        type={showPass ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        style={{ paddingRight: 44 }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: 10, padding: '10px 14px',
                      }}
                    >
                      <AlertCircle size={14} color="#EF4444" />
                      <span style={{ fontSize: 13, color: '#EF4444' }}>{error}</span>
                    </motion.div>
                  )}

                  {/* Security info */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: '#475569',
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 9,
                  }}>
                    <Fingerprint size={13} color="#2563EB" />
                    Face biometric verification required after credentials
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary"
                    disabled={loading}
                    style={{ padding: '13px 24px', justifyContent: 'center', fontSize: 14.5 }}
                  >
                    <Shield size={16} /> Verify Credentials →
                  </motion.button>
                </motion.form>
              )}

              {/* ─ Loading: completing login ─ */}
              {loading && (
                <motion.div
                  key="auth"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ textAlign: 'center', padding: '36px 0' }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: 40, height: 40,
                      border: '3px solid rgba(37,99,235,0.2)',
                      borderTopColor: '#2563EB',
                      borderRadius: '50%', margin: '0 auto 16px',
                    }}
                  />
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 6 }}>
                    Completing Sign In…
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>
                    Face verified · Loading dashboard
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13.5, color: '#64748B' }}>
            New officer?{' '}
            <Link to="/signup" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Create account</Link>
          </p>
          <p style={{ textAlign: 'center', marginTop: 10, fontSize: 13, color: '#475569' }}>
            <Link to="/" style={{ color: '#475569', textDecoration: 'none' }}>← Back to Home</Link>
          </p>
        </motion.div>
      </div>

      {/* Face verification modal */}
      <AnimatePresence>
        {step === 2 && (
          <FaceCaptureModal
            mode="verify"
            policeId={form.policeId || 'DEMO'}
            onSuccess={handleFaceSuccess}
            onCancel={handleFaceCancel}
          />
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
