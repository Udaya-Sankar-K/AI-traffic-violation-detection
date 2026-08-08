import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { runDetection } from '../services/aiDetection';
import { Shield } from 'lucide-react';

const stages = [
  { label: 'Uploading evidence to secure server', duration: 600 },
  { label: 'Preprocessing and normalizing image', duration: 700 },
  { label: 'Running YOLO object detection model', duration: 900 },
  { label: 'Analyzing violation patterns', duration: 700 },
  { label: 'Calculating confidence scores', duration: 500 },
  { label: 'Generating AI recommendations', duration: 400 },
  { label: 'Finalizing violation report', duration: 400 },
];

export default function ProcessingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');
  const { file, fileType, preview } = location.state || {};

  useEffect(() => {
    let stageIndex = 0;
    let elapsed = 0;
    const totalTime = stages.reduce((acc, s) => acc + s.duration, 0);

    const runStages = async () => {
      for (let i = 0; i < stages.length; i++) {
        setCurrentStage(i);
        await new Promise(r => setTimeout(r, stages[i].duration));
        elapsed += stages[i].duration;
        setProgress(Math.floor((elapsed / totalTime) * 85));
      }
    };

    const dotsTimer = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 400);

    const process = async () => {
      await runStages();
      const result = await runDetection(file);
      setProgress(100);
      clearInterval(dotsTimer);
      await new Promise(r => setTimeout(r, 600));
      navigate('/results', { state: { result, preview, fileType } });
    };

    process();
    return () => clearInterval(dotsTimer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh', background: '#F7F6F2',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Animated grid */}
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.05 }} />

      {/* Radial gradients */}
      <div style={{ position: 'absolute', top: '30%', left: '30%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(40,124,120,0.05) 0%, transparent 60%)', borderRadius: '50%', transform: 'translate(-50%, -50%)' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', maxWidth: 480, padding: '0 24px', position: 'relative', zIndex: 1 }}
      >
        {/* Radar animation */}
        <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 36px' }}>
          {/* Outer rings */}
          {[1, 0.75, 0.5].map((scale, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                border: `1px solid rgba(40,124,120,${0.15 + i * 0.08})`,
                borderRadius: '50%',
                transform: `scale(${scale})`,
              }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
            />
          ))}

          {/* Rotating arm */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              width: '50%', height: 2,
              transformOrigin: '0 50%',
              background: 'linear-gradient(90deg, #287C78, transparent)',
            }}
          />

          {/* Center shield */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 48, height: 48,
            background: '#287C78',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(40,124,120,0.15)',
          }}>
            <Shield size={22} color="white" />
          </div>

          {/* Pulse rings */}
          {[0, 0.8, 1.6].map(delay => (
            <motion.div
              key={delay}
              style={{
                position: 'absolute', top: '50%', left: '50%',
                width: 48, height: 48,
                border: '2px solid rgba(40,124,120,0.3)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{ scale: [1, 3.5], opacity: [0.7, 0] }}
              transition={{ duration: 2.4, delay, repeat: Infinity, ease: 'easeOut' }}
            />
          ))}

          {/* Blips */}
          {[
            { top: '20%', left: '70%', delay: 0.4 },
            { top: '65%', left: '20%', delay: 1.1 },
            { top: '75%', left: '75%', delay: 0.7 },
          ].map((blip, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute', top: blip.top, left: blip.left,
                width: 8, height: 8, borderRadius: '50%',
                background: '#C94C4C',
              }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 0.5] }}
              transition={{ duration: 1.5, delay: blip.delay, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Title */}
        <motion.h2
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ fontSize: 22, fontWeight: 800, color: '#202421', fontFamily: 'Poppins', marginBottom: 10 }}
        >
          Analyzing Evidence with AI{dots}
        </motion.h2>

        <p style={{ fontSize: 14, color: '#5A6060', marginBottom: 32, lineHeight: 1.6 }}>
          Our AI model is scanning your uploaded media for traffic violations.
          This usually takes a few seconds.
        </p>

        {/* Stage indicator */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid rgba(32,36,33,0.1)',
          boxShadow: '0 1px 4px rgba(32,36,33,0.08)',
          borderRadius: 14,
          padding: '16px 20px',
          marginBottom: 20,
          textAlign: 'left',
        }}>
          <div style={{ fontSize: 11, color: '#8A9090', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Current Stage</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{
                width: 16, height: 16,
                border: '2px solid rgba(40,124,120,0.3)',
                borderTopColor: '#287C78',
                borderRadius: '50%',
              }}
            />
            <span style={{ fontSize: 13.5, color: '#202421', fontWeight: 500 }}>
              {stages[Math.min(currentStage, stages.length - 1)].label}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#5A6060', marginBottom: 8 }}>
            <span>Processing...</span>
            <span style={{ color: '#287C78', fontWeight: 600 }}>{progress}%</span>
          </div>
          <div className="progress-bar" style={{ height: 8 }}>
            <motion.div
              className="progress-fill"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              style={{ background: '#287C78' }}
            />
          </div>
        </div>

        {/* Stage list */}
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {stages.map((stage, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 11.5, color: i < currentStage ? '#287C78' : i === currentStage ? '#202421' : '#8A9090',
              transition: 'color 0.3s',
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i < currentStage ? '#287C78' : i === currentStage ? '#287C78' : '#8A9090',
                transition: 'background 0.3s',
              }} />
              {stage.label}
              {i < currentStage && <span style={{ marginLeft: 'auto', fontSize: 10 }}>✓</span>}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
