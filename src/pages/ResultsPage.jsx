import React, { useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import {
  AlertTriangle, CheckCircle, Download, RotateCcw, Save,
  Shield, Clock, Car, Hash, MapPin, Zap, AlertCircle,
  User, FileCheck, Activity, Lightbulb
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { SEVERITY_CONFIG, RECOMMENDATIONS, VIOLATION_META } from '../utils/mockData';
import { useAuth } from '../contexts/AuthContext';

// Annotated Image - draws bounding boxes over the image
function AnnotatedImage({ preview, boundingBoxes, violationType }) {
  const canvasRef = useRef(null);

  const drawAnnotations = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      boundingBoxes?.forEach(box => {
        const x = (box.x / 100) * img.width;
        const y = (box.y / 100) * img.height;
        const w = (box.width / 100) * img.width;
        const h = (box.height / 100) * img.height;

        ctx.strokeStyle = '#C94C4C';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, w, h);

        // Label background
        ctx.fillStyle = 'rgba(201, 76, 76, 0.85)';
        ctx.fillRect(x, y - 26, 160, 24);

        // Label text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Poppins';
        ctx.fillText(`${violationType} ${(box.confidence * 100).toFixed(1)}%`, x + 6, y - 9);
      });
    };

    if (preview) img.src = preview;
  }, [preview, boundingBoxes, violationType]);

  React.useEffect(() => {
    if (preview) drawAnnotations();
  }, [preview, boundingBoxes, drawAnnotations]);

  if (!preview) {
    return (
      <div style={{
        width: '100%', minHeight: 220,
        background: '#FFFFFF',
        borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 12,
        border: '1px dashed rgba(32,36,33,0.1)',
        boxShadow: '0 1px 4px rgba(32,36,33,0.08)',
      }}>
        <Car size={40} color="#5A6060" />
        <div style={{ fontSize: 13, color: '#8A9090' }}>Video file — frame preview not available</div>
        {boundingBoxes?.length > 0 && (
          <div style={{
            padding: '8px 16px',
            background: 'rgba(201,76,76,0.1)', border: '1px solid rgba(201,76,76,0.25)',
            borderRadius: 10, fontSize: 13, color: '#C94C4C', fontWeight: 600,
          }}>
            {boundingBoxes.length} violation{boundingBoxes.length > 1 ? 's' : ''} detected in video
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ width: '100%', display: 'block' }} />
      {/* AI overlay label */}
      <div style={{
        position: 'absolute', top: 10, left: 10,
        padding: '4px 10px',
        background: '#FFFFFF',
        border: '1px solid rgba(40,124,120,0.2)',
        borderRadius: 6, fontSize: 10, color: '#287C78', fontWeight: 700,
        boxShadow: '0 1px 4px rgba(32,36,33,0.08)',
      }}>
        AI ANNOTATED
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { officer } = useAuth();
  const { result, preview, fileType } = location.state || {};

  if (!result) {
    navigate('/upload');
    return null;
  }

  const severity       = SEVERITY_CONFIG[result.severity]       || SEVERITY_CONFIG.Medium;
  const violationType  = result.isMultipleViolations ? 'Multiple Violations' : result.type;
  const recommendation = RECOMMENDATIONS[violationType] || RECOMMENDATIONS['Multiple Violations'];
  const violationMeta  = VIOLATION_META[result.type]  || {};

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Traffic Violation Detection Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Record ID: ${result.recordId}`, 20, 35);
    doc.text(`Detection Time: ${new Date(result.timestamp).toLocaleString()}`, 20, 45);
    if (result.isMultipleViolations) {
      doc.text(`Violations Detected: ${result.totalViolations}`, 20, 55);
      doc.text(`Overall Severity: ${result.overallSeverity}`, 20, 65);
      doc.text(`Overall Confidence: ${result.confidence}%`, 20, 75);
      let y = 85;
      result.violations?.forEach((v, i) => {
        doc.text(`  ${i + 1}. ${v.type} — ${v.severity} — ${v.confidence.toFixed(1)}%`, 20, y);
        y += 10;
      });
    } else {
      doc.text(`Violation Type: ${result.type}`, 20, 55);
      doc.text(`Severity: ${result.severity}`, 20, 65);
      doc.text(`Confidence: ${result.confidence}%`, 20, 75);
      doc.text(`Vehicle Type: ${result.vehicleType}`, 20, 85);
      doc.text(`Location: ${result.location}`, 20, 95);
    }
    doc.text(`Officer: ${officer?.fullName} (${officer?.policeId})`, 20, 110);
    doc.text(`Evidence Integrity: ${result.evidenceIntegrity}`, 20, 120);
    if (result.isRepeatOffender) {
      doc.text(`REPEAT OFFENDER — ${result.previousViolations} previous violations`, 20, 130);
    }
    doc.save(`TVDS-${result.recordId}.pdf`);
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 24 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#202421', fontFamily: 'Poppins', marginBottom: 4 }}>
                Detection Results
              </h2>
              <p style={{ fontSize: 13, color: '#8A9090' }}>
                Record ID: <span style={{ color: '#287C78', fontWeight: 600 }}>{result.recordId}</span>
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => navigate('/upload')}
                className="btn-secondary"
                style={{ padding: '9px 18px', fontSize: 13 }}
              >
                <RotateCcw size={14} /> Analyze Another
              </button>
              <button onClick={downloadPDF} className="btn-primary" style={{ padding: '9px 18px', fontSize: 13 }}>
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main content grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left: Image + Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Detection Status Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                padding: '16px 20px',
                background: result.violationDetected ? 'rgba(201,76,76,0.1)' : 'rgba(40,124,120,0.08)',
                border: `1px solid ${result.violationDetected ? 'rgba(201,76,76,0.25)' : 'rgba(40,124,120,0.2)'}`,
                borderRadius: 14,
                display: 'flex', alignItems: 'center', gap: 12,
              }}
            >
              {result.violationDetected ? (
                <AlertTriangle size={24} color="#C94C4C" />
              ) : (
                <CheckCircle size={24} color="#287C78" />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: result.violationDetected ? '#C94C4C' : '#287C78', fontFamily: 'Poppins' }}>
                  {result.isMultipleViolations
                    ? `${result.totalViolations} Violations Detected`
                    : result.violationDetected ? 'Violation Detected' : 'No Violation Found'}
                </div>
                <div style={{ fontSize: 12, color: '#5A6060', marginTop: 2 }}>
                  Processed in {result.processingTime}s • AI Confidence: {result.confidence}%
                </div>
              </div>
              {/* Model support badge */}
              {violationMeta.modelSupported === false && (
                <span style={{ fontSize: 10, padding: '3px 8px', background: 'rgba(201,130,75,0.1)', border: '1px solid rgba(201,130,75,0.25)', borderRadius: 8, color: '#C9824B', fontWeight: 600 }}>
                  SIMULATION
                </span>
              )}
            </motion.div>

            {/* Annotated Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card"
              style={{ padding: 16, background: '#FFFFFF', border: '1px solid rgba(32,36,33,0.1)', boxShadow: '0 1px 4px rgba(32,36,33,0.08)' }}
            >
              <div style={{ fontSize: 12, color: '#8A9090', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                Evidence Media
              </div>
              <AnnotatedImage
                preview={preview}
                boundingBoxes={result.boundingBoxes}
                violationType={result.type}
              />
            </motion.div>

            {/* Evidence Authenticity */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card"
              style={{ padding: 18, background: '#FFFFFF', border: '1px solid rgba(32,36,33,0.1)', boxShadow: '0 1px 4px rgba(32,36,33,0.08)' }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: '#202421', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileCheck size={14} color="#287C78" /> Evidence Authenticity
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['Upload Timestamp', new Date(result.timestamp).toLocaleString('en-IN')],
                  ['File Integrity', result.evidenceIntegrity],
                  ['File Hash', result.fileHash?.substring(0, 28) + '...'],
                  ['File Size', result.fileSize],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                    <span style={{ color: '#8A9090' }}>{k}</span>
                    <span style={{ color: v === 'VERIFIED' ? '#287C78' : '#202421', fontWeight: 600, fontFamily: v.startsWith('SHA') ? 'monospace' : 'inherit', fontSize: v.startsWith('SHA') ? 10 : 12 }}>
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Violation Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {result.violationDetected && (
              <>
                {/* Violation Info Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="glass-card"
                  style={{ padding: 22, position: 'relative', overflow: 'hidden', background: '#FFFFFF', border: '1px solid rgba(32,36,33,0.1)', boxShadow: '0 1px 4px rgba(32,36,33,0.08)' }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: severity.color }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#8A9090', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Violation Type</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 22 }}>{violationMeta.icon ?? '⚠️'}</span>
                        <div style={{ fontSize: 17, fontWeight: 800, color: '#202421', fontFamily: 'Poppins' }}>
                          {result.isMultipleViolations ? `${result.totalViolations} Violations` : result.type}
                        </div>
                      </div>
                    </div>
                    <span className={`badge ${result.severity === 'Critical' ? 'badge-critical' : result.severity === 'High' ? 'badge-red' : result.severity === 'Medium' ? 'badge-orange' : 'badge-green'}`}>
                      {result.severity}
                    </span>
                  </div>

                  {/* Confidence gauge */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#5A6060', marginBottom: 6 }}>
                      <span>Detection Confidence</span>
                      <span style={{ color: '#287C78', fontWeight: 700 }}>{result.confidence}%</span>
                    </div>
                    <div className="progress-bar" style={{ height: 10 }}>
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        style={{ background: `linear-gradient(90deg, ${severity.color}80, ${severity.color})` }}
                      />
                    </div>
                  </div>

                  {/* Info grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      { icon: Car, label: 'Vehicle Type', value: result.vehicleType },
                      { icon: Hash, label: 'Record ID', value: result.recordId },
                      { icon: MapPin, label: 'Location', value: result.location?.split(',')[0] },
                      { icon: Clock, label: 'Timestamp', value: new Date(result.timestamp).toLocaleTimeString('en-IN') },
                      { icon: Shield, label: 'Plate (Est.)', value: result.plateNumber },
                      { icon: User, label: 'Officer ID', value: officer?.policeId },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} style={{ padding: '10px 12px', background: '#FFFFFF', borderRadius: 10, border: '1px solid rgba(32,36,33,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#8A9090', marginBottom: 4 }}>
                          <Icon size={10} /> {label}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#202421', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Multiple Violations Breakdown */}
                {result.isMultipleViolations && result.violations?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card"
                    style={{ padding: 20, background: '#FFFFFF', border: '1px solid rgba(32,36,33,0.1)', boxShadow: '0 1px 4px rgba(32,36,33,0.08)' }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#202421', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <AlertTriangle size={14} color="#C94C4C" />
                      {result.totalViolations} Detected Violations
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {result.violations.map((v, i) => {
                        const vm = VIOLATION_META[v.type] || {};
                        const sv = SEVERITY_CONFIG[v.severity] || SEVERITY_CONFIG.Medium;
                        return (
                          <div key={i} style={{
                            padding: '12px 14px',
                            background: '#FFFFFF',
                            border: `1px solid ${sv.border}`,
                            borderRadius: 10,
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 18 }}>{vm.icon ?? '⚠️'}</span>
                                <div>
                                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#202421' }}>{v.type}</div>
                                  <div style={{ fontSize: 10, color: '#8A9090' }}>{v.vehicleType} • {vm.modelSupported ? 'AI Detected' : 'Simulated'}</div>
                                </div>
                              </div>
                              <span className={`badge ${v.severity === 'Critical' ? 'badge-critical' : v.severity === 'High' ? 'badge-red' : v.severity === 'Medium' ? 'badge-orange' : 'badge-green'}`} style={{ fontSize: 9 }}>
                                {v.severity}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div className="progress-bar" style={{ flex: 1, height: 5 }}>
                                <motion.div
                                  className="progress-fill"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${v.confidence}%` }}
                                  transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                                  style={{ background: sv.color }}
                                />
                              </div>
                              <span style={{ fontSize: 11, color: '#287C78', fontWeight: 700, minWidth: 38 }}>{v.confidence.toFixed(1)}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Repeat Offender Warning */}
                {result.isRepeatOffender && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    style={{
                      padding: '14px 18px',
                      background: 'rgba(201,76,76,0.1)',
                      border: '1px solid rgba(201,76,76,0.25)',
                      borderRadius: 14,
                      display: 'flex', alignItems: 'center', gap: 12,
                    }}
                  >
                    <AlertCircle size={24} color="#C94C4C" />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#C94C4C', marginBottom: 2 }}>
                        ⚠ REPEAT OFFENDER DETECTED
                      </div>
                      <div style={{ fontSize: 12, color: '#5A6060' }}>
                        This vehicle has {result.previousViolations} previous violation records. Escalate for legal action.
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* AI Recommendation */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card"
                  style={{ padding: 20, background: '#FFFFFF', border: '1px solid rgba(32,36,33,0.1)', boxShadow: '0 1px 4px rgba(32,36,33,0.08)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 28, height: 28, background: 'rgba(40,124,120,0.08)', border: '1px solid rgba(40,124,120,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Lightbulb size={14} color="#287C78" />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#202421' }}>AI Recommendation</div>
                    <span style={{ marginLeft: 'auto', fontSize: 10, color: '#287C78', fontWeight: 600, padding: '2px 8px', background: 'rgba(40,124,120,0.08)', border: '1px solid rgba(40,124,120,0.2)', borderRadius: 10 }}>
                      {recommendation.priority} Priority
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#5A6060', lineHeight: 1.7, marginBottom: 12 }}>
                    {recommendation.text}
                  </p>
                  <div style={{ fontSize: 12, color: '#287C78', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Zap size={12} /> Suggested Action: {recommendation.action}
                  </div>
                </motion.div>
              </>
            )}

            {/* Save record button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => navigate('/records')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%', padding: '14px 24px',
                background: '#287C78',
                border: 'none', borderRadius: 12,
                fontSize: 14.5, fontWeight: 700, color: 'white',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                boxShadow: '0 2px 8px rgba(40,124,120,0.15)',
              }}
            >
              <Save size={16} /> Save Record to Database
            </motion.button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
