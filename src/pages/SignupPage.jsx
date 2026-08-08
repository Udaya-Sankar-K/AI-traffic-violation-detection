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
                  ? '#287C78'
                  : '#FFFFFF',
                borderColor: step >= s.n ? '#287C78' : 'rgba(32,36,33,0.1)',
                boxShadow: step === s.n ? '0 2px 8px rgba(40,124,120,0.15)' : 'none',
              }}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid', fontSize: 13, fontWeight: 700,
                color: step >= s.n ? 'white' : '#8A9090',
                fontFamily: 'Poppins'
              }}
            >
              {step > s.n ? 'âœ“' : s.n}
            </motion.div>
            <div style={{ fontSize: 10, color: step >= s.n ? '#5A6060' : '#8A9090', whiteSpace: 'nowrap', fontFamily: 'Poppins' }}>{s.label}</div>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              height: 2, width: 60, margin: '0 6px', marginBottom: 18,
              background: step > s.n
                ? '#287C78'
                : 'rgba(32,36,33,0.1)',
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

  // â”€â”€ Step 1: validate form â†’ open face modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

  // â”€â”€ Step 2: face registration complete â†’ create account â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

  // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  return (
    <>
      <div style={{
        minHeight: '100vh', background: '#F7F6F2',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
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
                { icon: 'ðŸ”', text: 'AI-powered violation detection' },
                { icon: 'ðŸ“‹', text: 'Centralized records management' },
                { icon: 'ðŸ“Š', text: 'Real-time analytics dashboard' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(32,36,33,0.05)', borderRadius: 10 }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontFamily: 'Poppins' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          style={{
            width: '100%', maxWidth: 560,
            marginLeft: '42%',
            padding: '40px 52px',
            position: 'relative', zIndex: 1,
            maxHeight: '100vh',
            overflowY: 'auto'
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#202421', fontFamily: 'Poppins', marginBottom: 6 }}>
              Officer Registration
            </h1>
            <p style={{ fontSize: 13.5, color: '#8A9090', fontFamily: 'Poppins' }}>Create your TVDS officer account</p>
          </div>

          {/* Step indicator */}
          <StepIndicator step={step} />

          {/* Card */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid rgba(32,36,33,0.1)',
            borderRadius: 16, padding: '28px',
            boxShadow: '0 2px 12px rgba(32,36,33,0.07)',
          }}>
            <AnimatePresence mode="wait">
              {/* â”€ Step 1: Form â”€ */}
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
                        <label style={{ fontSize: 12, color: '#5A6060', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'Poppins' }}>
                          <f.icon size={12} color="#287C78" /> {f.label}
                        </label>
                        {f.type === 'select' ? (
                          <select
                            className="input-field"
                            value={form[f.key] || ''}
                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                            required
                            style={{ cursor: 'pointer', fontFamily: 'Poppins', backgroundColor: '#FFFFFF', borderColor: 'rgba(32,36,33,0.2)' }}
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
                            style={{ fontFamily: 'Poppins', backgroundColor: '#FFFFFF', borderColor: 'rgba(32,36,33,0.2)' }}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Password row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 12, color: '#5A6060', fontWeight: 500, marginBottom: 6, display: 'block', fontFamily: 'Poppins' }}>Password</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          className="input-field"
                          type={showPass ? 'text' : 'password'}
                          placeholder="Min. 6 characters"
                          value={form.password || ''}
                          onChange={e => setForm({ ...form, password: e.target.value })}
                          style={{ paddingRight: 40, fontFamily: 'Poppins', backgroundColor: '#FFFFFF', borderColor: 'rgba(32,36,33,0.2)' }}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8A9090' }}
                        >
                          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: '#5A6060', fontWeight: 500, marginBottom: 6, display: 'block', fontFamily: 'Poppins' }}>Confirm Password</label>
                      <input
                        className="input-field"
                        type="password"
                        placeholder="Confirm password"
                        value={form.confirmPassword || ''}
                        onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                        required
                        style={{ fontFamily: 'Poppins', backgroundColor: '#FFFFFF', borderColor: 'rgba(32,36,33,0.2)' }}
                      />
                    </div>
                  </div>

                  {/* Match indicator */}
                  {form.password && form.confirmPassword && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: 'Poppins' }}>
                      {form.password === form.confirmPassword ? (
                        <><CheckCircle size={13} color="#287C78" /><span style={{ color: '#287C78' }}>Passwords match</span></>
                      ) : (
                        <><AlertCircle size={13} color="#C94C4C" /><span style={{ color: '#C94C4C' }}>Passwords do not match</span></>
                      )}
                    </div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: 'rgba(201,76,76,0.1)', border: '1px solid rgba(201,76,76,0.25)',
                        borderRadius: 10, padding: '10px 14px',
                      }}
                    >
                      <AlertCircle size={14} color="#C94C4C" />
                      <span style={{ fontSize: 13, color: '#C94C4C', fontFamily: 'Poppins' }}>{error}</span>
                    </motion.div>
                  )}

                  {/* Face registration info banner */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 16px',
                    background: 'rgba(40,124,120,0.08)',
                    border: '1px solid rgba(40,124,120,0.2)',
                    borderRadius: 12,
                  }}>
                    <Scan size={18} color="#287C78" style={{ minWidth: 18 }} />
                    <div style={{ fontSize: 12.5, color: '#5A6060', lineHeight: 1.5, fontFamily: 'Poppins' }}>
                      After submitting, <strong style={{ color: '#287C78' }}>biometric face registration</strong> will be required
                      as a second security layer. Please ensure your webcam is accessible.
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary"
                    style={{ padding: '13px 24px', justifyContent: 'center', fontSize: 14.5, marginTop: 4, fontFamily: 'Poppins' }}
                  >
                    <Scan size={16} /> Continue to Face Registration â†’
                  </motion.button>
                </motion.form>
              )}

              {/* â”€ Loading state (creating account after face) â”€ */}
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
                      border: '3px solid rgba(40,124,120,0.2)',
                      borderTopColor: '#287C78',
                      borderRadius: '50%', margin: '0 auto 18px',
                    }}
                  />
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#202421', fontFamily: 'Poppins', marginBottom: 6 }}>
                    Creating Your Accountâ€¦
                  </div>
                  <div style={{ fontSize: 13, color: '#5A6060', fontFamily: 'Poppins' }}>
                    Face data registered Â· Setting up officer profile
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13.5, color: '#8A9090', fontFamily: 'Poppins' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: '#287C78', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
          <p style={{ textAlign: 'center', marginTop: 10, fontSize: 13, color: '#8A9090', fontFamily: 'Poppins' }}>
            <Link to="/" style={{ color: '#8A9090', textDecoration: 'none' }}>â† Back to Home</Link>
          </p>
        </motion.div>
      </div>

      {/* Face capture modal â€” rendered outside main layout */}
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

