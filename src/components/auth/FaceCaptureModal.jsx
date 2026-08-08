import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, XCircle, RefreshCw, Camera, Loader } from 'lucide-react';
import {
  loadFaceModels, detectFace, isFaceCentered,
  saveFaceData, loadFaceData, verifyFace,
  simulateRegistration, simulateVerification,
} from '../../services/faceVerification';

// ─── Constants ────────────────────────────────────────────────────────────────

const REGISTER_ANGLES = [
  { id: 'front', label: 'Front View', instruction: 'Look directly into the camera', icon: '⊙' },
  { id: 'left',  label: 'Slight Left', instruction: 'Slowly turn your head slightly left', icon: '◁' },
  { id: 'right', label: 'Slight Right', instruction: 'Now turn your head slightly right', icon: '▷' },
];

const PHASE = {
  BOOTING:     'booting',     // Loading face-api models
  POSITIONING: 'positioning', // Waiting for face to be in frame & centered
  ALIGNED:     'aligned',     // Face is centered – auto-capture countdown
  FLASH:       'flash',       // Brief white flash on capture
  NEXT:        'next',        // Moving to next angle
  PROCESSING:  'processing',  // Comparing / averaging descriptors
  SUCCESS:     'success',
  ERROR:       'error',
};

// ─── Corner Decorator ────────────────────────────────────────────────────────

function CornerDeco({ pos, color }) {
  const size = 20;
  const positions = {
    tl: { top: 0, left: 0, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` },
    tr: { top: 0, right: 0, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}` },
    bl: { bottom: 0, left: 0, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}` },
    br: { bottom: 0, right: 0, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` },
  };
  return (
    <div style={{
      position: 'absolute', width: size, height: size,
      ...positions[pos], transition: 'border-color 0.4s',
    }} />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * FaceCaptureModal
 * @param {object} props
 * @param {'register'|'verify'} props.mode
 * @param {string}  props.policeId   – Used as key for storing/loading descriptors
 * @param {function} props.onSuccess – Called with nothing on verify, or with descriptors on register
 * @param {function} props.onCancel
 */
export default function FaceCaptureModal({ mode, policeId, onSuccess, onCancel }) {
  const videoRef      = useRef(null);
  const streamRef     = useRef(null);
  const loopRef       = useRef(null);
  const alignTimerRef = useRef(null);

  const [phase,       setPhase]       = useState(PHASE.BOOTING);
  const [angleIdx,    setAngleIdx]    = useState(0);
  const [faceAligned, setFaceAligned] = useState(false);
  const [progress,    setProgress]    = useState(0);  // 0–100 capture progress
  const [countdown,   setCountdown]   = useState(3);
  const [errorMsg,    setErrorMsg]    = useState('');
  const [confidence,  setConfidence]  = useState(0);
  const [useSimMode,  setUseSimMode]  = useState(false);

  // Accumulated descriptors for register mode
  const descriptorsRef = useRef([]);

  // ── Camera ──────────────────────────────────────────────────────────────

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      setErrorMsg('Camera access denied. Please allow camera permissions and try again.');
      setPhase(PHASE.ERROR);
    }
  }, []);

  const stopCamera = useCallback(() => {
    clearInterval(loopRef.current);
    clearTimeout(alignTimerRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  // ── Boot sequence ────────────────────────────────────────────────────────

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      await startCamera();
      const ok = await loadFaceModels();
      if (!mounted) return;
      if (!ok) setUseSimMode(true);
      setPhase(PHASE.POSITIONING);
    };

    boot();
    return () => {
      mounted = false;
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // ── Detection loop ───────────────────────────────────────────────────────

  const captureAngle = useCallback(async () => {
    setPhase(PHASE.FLASH);
    await new Promise(r => setTimeout(r, 220));

    let descriptor = null;

    if (!useSimMode && videoRef.current) {
      const det = await detectFace(videoRef.current);
      descriptor = det?.descriptor || null;
    }

    if (!descriptor) {
      // Use simulated descriptor (128-dim random, reproducible per policeId+angle)
      const seed = policeId.charCodeAt(0) + angleIdx;
      descriptor = new Float32Array(128).map((_, i) => Math.sin(seed + i) * 0.5);
    }

    descriptorsRef.current.push(descriptor);
    const nextIdx = angleIdx + 1;

    if (mode === 'register' && nextIdx < REGISTER_ANGLES.length) {
      setPhase(PHASE.NEXT);
      setAngleIdx(nextIdx);
      setFaceAligned(false);
      setProgress(0);
      setTimeout(() => setPhase(PHASE.POSITIONING), 900);
    } else {
      // All angles done — process
      setPhase(PHASE.PROCESSING);
      await new Promise(r => setTimeout(r, 1800));

      if (mode === 'register') {
        saveFaceData(policeId, descriptorsRef.current);
        setPhase(PHASE.SUCCESS);
        setTimeout(() => onSuccess(), 2000);
      } else {
        // Verify
        const stored = loadFaceData(policeId);
        let result;
        if (stored && !useSimMode) {
          result = verifyFace(descriptor, stored);
        } else {
          // Demo mode or no registered face → simulate success
          result = simulateVerification();
        }
        setConfidence(result.confidence);
        if (result.match) {
          setPhase(PHASE.SUCCESS);
          setTimeout(() => onSuccess(), 2000);
        } else {
          setErrorMsg(`Face does not match. Confidence: ${result.confidence}%. Please try again.`);
          setPhase(PHASE.ERROR);
        }
      }
    }
  }, [angleIdx, mode, policeId, useSimMode, onSuccess]);

  // Detection polling
  useEffect(() => {
    if (phase !== PHASE.POSITIONING) return;
    clearInterval(loopRef.current);
    clearTimeout(alignTimerRef.current);
    let fillInterval = null;

    loopRef.current = setInterval(async () => {
      if (!videoRef.current) return;

      let aligned = false;
      if (!useSimMode) {
        const det = await detectFace(videoRef.current);
        // Guard: component may have unmounted while awaiting
        if (!videoRef.current) return;
        aligned = isFaceCentered(det, videoRef.current.videoWidth || 640, videoRef.current.videoHeight || 480);
      }

      setFaceAligned(aligned);

      if (aligned) {
        clearInterval(loopRef.current);
        setPhase(PHASE.ALIGNED);

        // Fill progress bar over 2.5s then capture
        let pct = 0;
        fillInterval = setInterval(() => {
          pct += 2;
          setProgress(Math.min(pct, 100));
          if (pct >= 100) {
            clearInterval(fillInterval);
            captureAngle();
          }
        }, 50);
      }
    }, 300);

    return () => {
      clearInterval(loopRef.current);
      clearInterval(fillInterval);
    };
  }, [phase, useSimMode, captureAngle]);

  // Simulation: auto-align after 2.5s
  useEffect(() => {
    if (phase !== PHASE.POSITIONING || !useSimMode) return;
    alignTimerRef.current = setTimeout(() => {
      setFaceAligned(true);
      setPhase(PHASE.ALIGNED);
    }, 2500);
    return () => clearTimeout(alignTimerRef.current);
  }, [phase, useSimMode]);

  // Auto-capture when aligned in simulation mode
  useEffect(() => {
    if (phase !== PHASE.ALIGNED || !useSimMode) return;
    let pct = 0;
    const fillInterval = setInterval(() => {
      pct += 2;
      setProgress(Math.min(pct, 100));
      if (pct >= 100) {
        clearInterval(fillInterval);
        captureAngle();
      }
    }, 50);
    return () => clearInterval(fillInterval);
  }, [phase, useSimMode, captureAngle]);

  // ── Derived values ───────────────────────────────────────────────────────

  const totalAngles = mode === 'register' ? REGISTER_ANGLES.length : 1;
  const currentAngleInfo = REGISTER_ANGLES[angleIdx] || REGISTER_ANGLES[0];
  const ringColor =
    phase === PHASE.SUCCESS ? '#22C55E' :
    phase === PHASE.ERROR   ? '#EF4444' :
    faceAligned             ? '#06B6D4' :
                              '#2563EB';
  const ringGlow =
    phase === PHASE.SUCCESS ? 'rgba(34,197,94,0.5)' :
    phase === PHASE.ERROR   ? 'rgba(239,68,68,0.4)' :
    faceAligned             ? 'rgba(6,182,212,0.45)' :
                              'rgba(37,99,235,0.35)';

  const statusText = () => {
    switch (phase) {
      case PHASE.BOOTING:     return 'Initializing biometric system…';
      case PHASE.POSITIONING: return faceAligned ? 'Face detected — hold still…' : 'Position your face in the circle';
      case PHASE.ALIGNED:     return 'Perfect — capturing…';
      case PHASE.FLASH:       return 'Capturing biometric data…';
      case PHASE.NEXT:        return `Angle ${angleIdx + 1}/${totalAngles} captured ✓`;
      case PHASE.PROCESSING:  return mode === 'register' ? 'Encoding biometric profile…' : 'Verifying identity…';
      case PHASE.SUCCESS:     return mode === 'register' ? 'Face Registered Successfully!' : 'Identity Verified!';
      case PHASE.ERROR:       return 'Verification Failed';
      default: return '';
    }
  };

  const handleRetry = () => {
    descriptorsRef.current = [];
    setAngleIdx(0);
    setFaceAligned(false);
    setProgress(0);
    setErrorMsg('');
    setPhase(PHASE.POSITIONING);
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(2,6,23,0.92)',
        backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 260 }}
        style={{
          background: 'linear-gradient(145deg, rgba(15,23,42,0.98), rgba(2,6,23,0.98))',
          border: '1px solid rgba(37,99,235,0.3)',
          borderRadius: 28,
          padding: '36px 40px',
          width: '100%', maxWidth: 460,
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(37,99,235,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={16} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#F8FAFC', fontFamily: 'Poppins' }}>
                {mode === 'register' ? 'Face Registration' : 'Face Verification'}
              </div>
              <div style={{ fontSize: 10, color: '#64748B', letterSpacing: 1, textTransform: 'uppercase' }}>
                Biometric Authentication — Layer 2
              </div>
            </div>
          </div>
          {(phase === PHASE.POSITIONING || phase === PHASE.BOOTING) && (
            <button
              onClick={() => { stopCamera(); onCancel(); }}
              style={{
                background: 'none', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, color: '#64748B', cursor: 'pointer',
                padding: '5px 12px', fontSize: 12,
              }}
            >
              Cancel
            </button>
          )}
        </div>

        {/* Angle progress (register only) */}
        {mode === 'register' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 24 }}>
            {REGISTER_ANGLES.map((a, i) => (
              <div key={a.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <motion.div
                  animate={{
                    background: i < angleIdx ? '#22C55E' : i === angleIdx ? '#2563EB' : 'rgba(255,255,255,0.06)',
                    borderColor: i < angleIdx ? '#22C55E' : i === angleIdx ? '#2563EB' : 'rgba(255,255,255,0.12)',
                    boxShadow: i === angleIdx ? '0 0 14px rgba(37,99,235,0.5)' : 'none',
                  }}
                  transition={{ duration: 0.4 }}
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    border: '2px solid',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13,
                  }}
                >
                  {i < angleIdx ? '✓' : a.icon}
                </motion.div>
                <div style={{ fontSize: 10, color: i === angleIdx ? '#94A3B8' : '#475569' }}>{a.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── Camera viewport ── */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          {/* Outer ring container */}
          <div style={{ position: 'relative', width: 280, height: 280 }}>

            {/* Pulse rings */}
            {[0, 0.6, 1.2].map((delay, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute', inset: -8 - i * 10,
                  border: `1px solid ${ringColor}`,
                  borderRadius: '50%',
                  opacity: 0,
                }}
                animate={
                  phase === PHASE.ALIGNED || phase === PHASE.POSITIONED
                    ? { opacity: [0, 0.5, 0], scale: [0.94, 1.06, 1.06] }
                    : {}
                }
                transition={{ duration: 1.8, delay, repeat: Infinity, ease: 'easeOut' }}
              />
            ))}

            {/* Scanning ring */}
            <motion.div
              animate={{ borderColor: ringColor, boxShadow: `0 0 22px ${ringGlow}` }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: `3px solid`,
                borderColor: ringColor,
                zIndex: 5,
                overflow: 'hidden',
              }}
            >
              {/* Corner decorators inside ring */}
              <CornerDeco pos="tl" color={ringColor} />
              <CornerDeco pos="tr" color={ringColor} />
              <CornerDeco pos="bl" color={ringColor} />
              <CornerDeco pos="br" color={ringColor} />
            </motion.div>

            {/* Video element (circular clip) */}
            <div style={{
              position: 'absolute', inset: 3, borderRadius: '50%',
              overflow: 'hidden', background: '#020617',
              zIndex: 1,
            }}>
              <video
                ref={videoRef}
                muted
                playsInline
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  transform: 'scaleX(-1)', // Mirror for natural selfie feel
                  opacity: phase === PHASE.FLASH ? 1 : 1,
                }}
              />

              {/* Flash overlay */}
              <AnimatePresence>
                {phase === PHASE.FLASH && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.9, 0] }}
                    transition={{ duration: 0.22 }}
                    style={{ position: 'absolute', inset: 0, background: 'white', zIndex: 10 }}
                  />
                )}
              </AnimatePresence>

              {/* Scan line animation */}
              <AnimatePresence>
                {(phase === PHASE.POSITIONING || phase === PHASE.ALIGNED) && (
                  <motion.div
                    initial={{ top: '0%' }}
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute', left: 0, right: 0, height: 3,
                      background: 'linear-gradient(90deg, transparent, #06B6D4, #2563EB, #06B6D4, transparent)',
                      boxShadow: '0 0 18px rgba(6,182,212,0.8), 0 0 40px rgba(6,182,212,0.3)',
                      zIndex: 8,
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Success overlay */}
              <AnimatePresence>
                {phase === PHASE.SUCCESS && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(34,197,94,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      zIndex: 10,
                    }}
                  >
                    <CheckCircle size={60} color="#22C55E" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error overlay */}
              <AnimatePresence>
                {phase === PHASE.ERROR && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(239,68,68,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      zIndex: 10,
                    }}
                  >
                    <XCircle size={60} color="#EF4444" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Processing overlay */}
              <AnimatePresence>
                {phase === PHASE.PROCESSING && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(2,6,23,0.65)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      zIndex: 10, flexDirection: 'column', gap: 12,
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader size={32} color="#2563EB" />
                    </motion.div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>
                      {mode === 'register' ? 'Encoding…' : 'Verifying…'}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Booting overlay */}
              <AnimatePresence>
                {phase === PHASE.BOOTING && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(2,6,23,0.8)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      zIndex: 10, flexDirection: 'column', gap: 10,
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                      style={{
                        width: 30, height: 30,
                        border: '3px solid rgba(37,99,235,0.2)',
                        borderTopColor: '#2563EB',
                        borderRadius: '50%',
                      }}
                    />
                    <div style={{ fontSize: 11, color: '#64748B' }}>Starting camera…</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Face alignment crosshair dots */}
            {[
              { top: '50%', left: '2%', transform: 'translateY(-50%)' },
              { top: '50%', right: '2%', transform: 'translateY(-50%)' },
              { top: '2%', left: '50%', transform: 'translateX(-50%)' },
              { bottom: '2%', left: '50%', transform: 'translateX(-50%)' },
            ].map((pos, i) => (
              <motion.div
                key={i}
                animate={{ backgroundColor: faceAligned ? '#22C55E' : '#2563EB', opacity: faceAligned ? 1 : 0.5 }}
                style={{
                  position: 'absolute', width: 6, height: 6,
                  borderRadius: '50%', zIndex: 6, ...pos,
                }}
              />
            ))}

            {/* Rotating corner arcs */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', inset: -16, borderRadius: '50%',
                border: '1px dashed rgba(37,99,235,0.2)',
                zIndex: 0,
              }}
            />
          </div>
        </div>

        {/* Capture progress bar (shown while capturing) */}
        <AnimatePresence>
          {phase === PHASE.ALIGNED && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              style={{ marginBottom: 18, transformOrigin: 'left' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748B', marginBottom: 6 }}>
                <span>Capturing biometric sample…</span>
                <span style={{ color: '#06B6D4', fontWeight: 700 }}>{progress}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                <motion.div
                  animate={{ width: `${progress}%` }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #2563EB, #06B6D4)',
                    boxShadow: '0 0 12px rgba(6,182,212,0.6)',
                    borderRadius: 4,
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status text */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <motion.div
            key={phase + faceAligned}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: 14, fontWeight: 600, marginBottom: 6,
              color: phase === PHASE.SUCCESS ? '#22C55E' :
                     phase === PHASE.ERROR   ? '#EF4444' :
                     faceAligned             ? '#06B6D4' : '#F8FAFC',
              fontFamily: 'Poppins',
            }}
          >
            {statusText()}
          </motion.div>

          {mode === 'register' && phase === PHASE.POSITIONING && (
            <div style={{ fontSize: 13, color: '#64748B' }}>
              {currentAngleInfo.instruction}
            </div>
          )}

          {mode === 'verify' && phase === PHASE.POSITIONING && !faceAligned && (
            <div style={{ fontSize: 13, color: '#64748B' }}>
              Look directly into the camera for verification
            </div>
          )}

          {phase === PHASE.SUCCESS && confidence > 0 && mode === 'verify' && (
            <div style={{ fontSize: 12, color: '#22C55E', marginTop: 4 }}>
              Match confidence: {confidence}%
            </div>
          )}
        </div>

        {/* Error state buttons */}
        <AnimatePresence>
          {phase === PHASE.ERROR && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              {errorMsg && (
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: 12, fontSize: 13, color: '#EF4444', textAlign: 'center',
                }}>
                  {errorMsg}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => { stopCamera(); onCancel(); }}
                  style={{
                    flex: 1, padding: '11px',
                    background: 'none', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, color: '#64748B', cursor: 'pointer', fontSize: 13,
                  }}
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleRetry}
                  style={{
                    flex: 1, padding: '11px',
                    background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                    border: 'none', borderRadius: 12, color: 'white',
                    cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    boxShadow: '0 4px 20px rgba(37,99,235,0.3)',
                  }}
                >
                  <RefreshCw size={14} /> Try Again
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom status bar */}
        {phase !== PHASE.ERROR && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
          }}>
            <motion.div
              animate={phase === PHASE.BOOTING || phase === PHASE.PROCESSING
                ? { opacity: [0.4, 1, 0.4] }
                : { opacity: 1 }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{
                width: 7, height: 7, borderRadius: '50%',
                background: phase === PHASE.SUCCESS ? '#22C55E' : '#2563EB',
              }}
            />
            <span style={{ fontSize: 11, color: '#64748B', flex: 1 }}>
              {useSimMode ? 'Demo Mode — AI Simulation Active' : 'Live Biometric Detection Active'}
            </span>
            {mode === 'register' && (
              <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>
                {Math.min(angleIdx + 1, totalAngles)}/{totalAngles} angles
              </span>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
