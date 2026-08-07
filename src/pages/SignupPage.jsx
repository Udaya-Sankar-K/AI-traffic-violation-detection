import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle, User, Mail, MapPin, BadgeCheck, Scan } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import FaceCaptureModal from '../components/auth/FaceCaptureModal';

const fields = [
  { key: 'fullName',     label: 'Full Name',               placeholder: 'Rahul Kumar Sharma',       icon: User,       type: 'text' },
  { key: 'policeId',     label: 'Police ID / Force Number', placeholder: 'POL-9821',                 icon: BadgeCheck, type: 'text' },
  { key: 'designation',  label: 'Designation',              placeholder: '',                          icon: BadgeCheck, type: 'select',
    options: ['Sub-Inspector', 'Inspector', 'ASI', 'Constable', 'Head Constable', 'DySP', 'Commissioner'] },
  { key: 'station',      label: 'Police Station',           placeholder: 'MG Road Police Station',   icon: MapPin,     type: 'text' },
  { key: 'district',     label: 'District',                 placeholder: 'Central Bangalore',        icon: MapPin,     type: 'text' },
  { key: 'email',        label: 'Official Email',           placeholder: 'officer@police.gov.in',    icon: Mail,       type: 'email' },
];

// Step indicator component
function StepIndicator({ step }) {
  const steps = [
    { n: 1, label: 'Officer Details' },
    { n: 2, label: 'Face Registration' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 28 }}>
      {steps.map((s, i) => (
        <React.Fragment key={s.n}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <motion.div
              animate={{
                background: step >= s.n
                  ? 'linear-gradient(135deg, #2563EB, #06B6D4)'
                  : 'rgba(255,255,255,0.04)',
                borderColor: step >= s.n ? '#2563EB' : 'rgba(255,255,255,0.1)',
                boxShadow: step === s.n ? '0 0 16px rgba(37,99,235,0.45)' : 'none',
              }}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid', fontSize: 13, fontWeight: 700,
                color: step >= s.n ? 'white' : '#475569',
              }}
            >
              {step > s.n ? '✓' : s.n}
            </motion.div>
            <div style={{ fontSize: 10, color: step >= s.n ? '#94A3B8' : '#475569', whiteSpace: 'nowrap' }}>{s.label}</div>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              height: 2, width: 60, margin: '0 6px', marginBottom: 18,
              background: step > s.n
                ? 'linear-gradient(90deg, #2563EB, #06B6D4)'
                : 'rgba(255,255,255,0.06)',
              transition: 'background 0.4s',
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [step,     setStep]     = useState(1);           // 1 = form, 2 = face modal
  const [form,     setForm]     = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [faceDone, setFaceDone] = useState(false);       // face registration completed

  // ── Step 1: validate form → open face modal ────────────────────────────

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.policeId?.trim()) {
      setError('Police ID is required.');
      return;
    }
    if ((form.password || '').length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setStep(2); // open face registration modal
  };

  // ── Step 2: face registration complete → create account ───────────────

  const handleFaceSuccess = async () => {
    setFaceDone(true);
    setStep(1); // go back to form view (not visible, just state) while creating account
    setLoading(true);
    setError('');
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleFaceCancel = () => {
    setStep(1); // return to form without creating account
  };

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <>
      <div style={{
        minHeight: '100vh', background: '#0F172A',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', padding: '40px 24px',
      }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 560, position: 'relative', zIndex: 1 }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              width: 60, height: 60,
              background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
              borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px',
              boxShadow: '0 10px 30px rgba(37,99,235,0.4)',
            }}>
              <Shield size={26} color="white" />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 6 }}>
              Officer Registration
            </h1>
            <p style={{ fontSize: 13.5, color: '#64748B' }}>Create your TVDS officer account</p>
          </div>

          {/* Step indicator */}
          <StepIndicator step={step} />

          {/* Card */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 24, padding: '32px',
            backdropFilter: 'blur(20px)',
          }}>
            <AnimatePresence mode="wait">
              {/* ─ Step 1: Form ─ */}
              {step === 1 && !loading && (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleFormSubmit}
                  style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {fields.map(f => (
                      <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <f.icon size={12} /> {f.label}
                        </label>
                        {f.type === 'select' ? (
                          <select
                            className="input-field"
                            value={form[f.key] || ''}
                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                            required
                            style={{ cursor: 'pointer' }}
                          >
                            <option value="">Select...</option>
                            {f.options.map(o => <option key={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input
                            className="input-field"
                            type={f.type}
                            placeholder={f.placeholder}
                            value={form[f.key] || ''}
                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                            required
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Password row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, marginBottom: 6, display: 'block' }}>Password</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          className="input-field"
                          type={showPass ? 'text' : 'password'}
                          placeholder="Min. 6 characters"
                          value={form.password || ''}
                          onChange={e => setForm({ ...form, password: e.target.value })}
                          style={{ paddingRight: 40 }}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                        >
                          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, marginBottom: 6, display: 'block' }}>Confirm Password</label>
                      <input
                        className="input-field"
                        type="password"
                        placeholder="Confirm password"
                        value={form.confirmPassword || ''}
                        onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Match indicator */}
                  {form.password && form.confirmPassword && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                      {form.password === form.confirmPassword ? (
                        <><CheckCircle size={13} color="#22C55E" /><span style={{ color: '#22C55E' }}>Passwords match</span></>
                      ) : (
                        <><AlertCircle size={13} color="#EF4444" /><span style={{ color: '#EF4444' }}>Passwords do not match</span></>
                      )}
                    </div>
                  )}

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

                  {/* Face registration info banner */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 16px',
                    background: 'rgba(6,182,212,0.06)',
                    border: '1px solid rgba(6,182,212,0.18)',
                    borderRadius: 12,
                  }}>
                    <Scan size={18} color="#06B6D4" style={{ minWidth: 18 }} />
                    <div style={{ fontSize: 12.5, color: '#94A3B8', lineHeight: 1.5 }}>
                      After submitting, <strong style={{ color: '#06B6D4' }}>biometric face registration</strong> will be required
                      as a second security layer. Please ensure your webcam is accessible.
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary"
                    style={{ padding: '13px 24px', justifyContent: 'center', fontSize: 14.5, marginTop: 4 }}
                  >
                    <Scan size={16} /> Continue to Face Registration →
                  </motion.button>
                </motion.form>
              )}

              {/* ─ Loading state (creating account after face) ─ */}
              {loading && (
                <motion.div
                  key="creating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ textAlign: 'center', padding: '48px 0' }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: 44, height: 44,
                      border: '3px solid rgba(37,99,235,0.2)',
                      borderTopColor: '#2563EB',
                      borderRadius: '50%', margin: '0 auto 18px',
                    }}
                  />
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 6 }}>
                    Creating Your Account…
                  </div>
                  <div style={{ fontSize: 13, color: '#64748B' }}>
                    Face data registered · Setting up officer profile
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13.5, color: '#64748B' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
          <p style={{ textAlign: 'center', marginTop: 10, fontSize: 13, color: '#475569' }}>
            <Link to="/" style={{ color: '#475569', textDecoration: 'none' }}>← Back to Home</Link>
          </p>
        </motion.div>
      </div>

      {/* Face capture modal — rendered outside main layout */}
      <AnimatePresence>
        {step === 2 && (
          <FaceCaptureModal
            mode="register"
            policeId={form.policeId || 'UNKNOWN'}
            onSuccess={handleFaceSuccess}
            onCancel={handleFaceCancel}
          />
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
