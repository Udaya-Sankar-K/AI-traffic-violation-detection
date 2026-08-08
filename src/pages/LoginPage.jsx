import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle, Lock, User, Scan, Fingerprint } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import FaceCaptureModal from '../components/auth/FaceCaptureModal';

export default function LoginPage() {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [form,     setForm]     = useState({ policeId: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [step,     setStep]     = useState(1);

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.policeId, form.password, { dryRun: true });
    } catch (err) {
      if (err.message?.toLowerCase().includes('invalid') ||
          err.message?.toLowerCase().includes('password') ||
          err.message?.toLowerCase().includes('not found')) {
        setError(err.message);
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    setStep(2);
  };

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

  return (
    <>
      <div style={{
        minHeight: '100vh',
        background: '#F7F6F2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle background pattern */}
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />

        {/* Left accent panel */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '42%',
          background: '#202421',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 48,
        }}>
          <div style={{ textAlign: 'center', maxWidth: 320 }}>
            <div style={{
              width: 72, height: 72,
              background: '#287C78',
              borderRadius: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <Shield size={34} color="white" />
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#FFFFFF', fontFamily: 'Poppins', marginBottom: 12 }}>
              TVDS
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: 'Poppins', lineHeight: 1.7 }}>
              AI-Powered Traffic Violation Detection System for Traffic Enforcement Officers
            </p>
            <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '🔍', text: 'AI-powered violation detection' },
                { icon: '📋', text: 'Centralized records management' },
                { icon: '📊', text: 'Real-time analytics dashboard' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontFamily: 'Poppins' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Login form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          style={{
            width: '100%', maxWidth: 460,
            marginLeft: '42%',
            padding: '48px 52px',
            position: 'relative', zIndex: 1,
          }}
        >
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#202421', fontFamily: 'Poppins', marginBottom: 6 }}>
            Officer Sign In
          </h1>
          <p style={{ fontSize: 13.5, color: '#8A9090', fontFamily: 'Poppins', marginBottom: 32 }}>
            Enter your credentials to access the system
          </p>

          {/* 2-Factor step indicators */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
            {[
              { n: 1, icon: Lock,  label: 'Credentials' },
              { n: 2, icon: Scan,  label: 'Face Verify' },
            ].map(s => (
              <div
                key={s.n}
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: 10,
                  border: `1.5px solid ${step >= s.n ? '#287C78' : 'rgba(32,36,33,0.12)'}`,
                  background: step >= s.n ? 'rgba(40,124,120,0.07)' : '#FFFFFF',
                  display: 'flex', alignItems: 'center', gap: 9,
                  transition: 'all 0.25s',
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: step >= s.n ? '#287C78' : 'rgba(32,36,33,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <s.icon size={13} color={step >= s.n ? 'white' : '#8A9090'} />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#8A9090', marginBottom: 1, fontFamily: 'Poppins' }}>Step {s.n}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: step >= s.n ? '#202421' : '#8A9090', fontFamily: 'Poppins' }}>
                    {s.label}
                  </div>
                </div>
                {step > s.n && <CheckCircle size={14} color="#287C78" style={{ marginLeft: 'auto' }} />}
              </div>
            ))}
          </div>

          {/* Card */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid rgba(32,36,33,0.1)',
            borderRadius: 16, padding: 28,
            boxShadow: '0 2px 12px rgba(32,36,33,0.07)',
          }}>
            {/* Demo hint */}
            <div style={{
              background: 'rgba(40,124,120,0.07)',
              border: '1px solid rgba(40,124,120,0.18)',
              borderRadius: 9, padding: '9px 13px', marginBottom: 22,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <CheckCircle size={14} color="#287C78" />
              <span style={{ fontSize: 12, color: '#5A6060', fontFamily: 'Poppins' }}>
                <strong style={{ color: '#287C78' }}>Demo:</strong> Any Police ID + 6+ char password works
              </span>
            </div>

            <AnimatePresence mode="wait">
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
                    <label style={{ fontSize: 12.5, color: '#5A6060', fontWeight: 500, marginBottom: 7, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Poppins' }}>
                      <User size={13} color="#287C78" /> Police ID / Force Number
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
                    <label style={{ fontSize: 12.5, color: '#5A6060', fontWeight: 500, marginBottom: 7, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Poppins' }}>
                      <Lock size={13} color="#287C78" /> Password
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
                        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8A9090' }}
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
                        background: 'rgba(201,76,76,0.08)',
                        border: '1px solid rgba(201,76,76,0.2)',
                        borderRadius: 9, padding: '10px 14px',
                      }}
                    >
                      <AlertCircle size={14} color="#C94C4C" />
                      <span style={{ fontSize: 13, color: '#C94C4C', fontFamily: 'Poppins' }}>{error}</span>
                    </motion.div>
                  )}

                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontSize: 11.5, color: '#8A9090', fontFamily: 'Poppins',
                    padding: '8px 12px',
                    background: '#F7F6F2',
                    border: '1px solid rgba(32,36,33,0.08)',
                    borderRadius: 8,
                  }}>
                    <Fingerprint size={13} color="#287C78" />
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
                      border: '3px solid rgba(40,124,120,0.2)',
                      borderTopColor: '#287C78',
                      borderRadius: '50%', margin: '0 auto 16px',
                    }}
                  />
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#202421', fontFamily: 'Poppins', marginBottom: 6 }}>
                    Completing Sign In…
                  </div>
                  <div style={{ fontSize: 12, color: '#8A9090', fontFamily: 'Poppins' }}>
                    Face verified · Loading dashboard
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13.5, color: '#8A9090', fontFamily: 'Poppins' }}>
            New officer?{' '}
            <Link to="/signup" style={{ color: '#287C78', fontWeight: 600, textDecoration: 'none' }}>Create account</Link>
          </p>
          <p style={{ textAlign: 'center', marginTop: 10, fontSize: 13, color: '#8A9090', fontFamily: 'Poppins' }}>
            <Link to="/" style={{ color: '#8A9090', textDecoration: 'none' }}>← Back to Home</Link>
          </p>
        </motion.div>
      </div>

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
    </>
  );
}
