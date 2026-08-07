import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, Video, X, FileCheck, Zap, AlertCircle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback((accepted, rejected) => {
    setError('');
    if (rejected.length > 0) {
      setError('Invalid file type. Please upload JPG, PNG, MP4, or MOV.');
      return;
    }
    const f = accepted[0];
    setFile(f);
    setFileType(f.type.startsWith('video') ? 'video' : 'image');
    if (f.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onload = e => setPreview(e.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'], 'video/*': ['.mp4', '.mov', '.avi'] },
    maxSize: 100 * 1024 * 1024,
    multiple: false,
  });

  const handleDetect = async () => {
    if (!file) return;
    setUploading(true);

    // Store detection context
    sessionStorage.setItem('tvds_file_name', file.name);
    sessionStorage.setItem('tvds_file_type', fileType);
    if (preview) sessionStorage.setItem('tvds_preview', preview);

    navigate('/processing', { state: { file, fileType, preview } });
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setFileType(null);
    setError('');
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 6 }}>
            Upload Evidence
          </h2>
          <p style={{ fontSize: 14, color: '#64748B' }}>
            Upload traffic images or videos for AI-powered violation detection
          </p>
        </motion.div>

        {/* Supported formats info */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          {[
            { icon: Image, label: 'Images', formats: 'JPG, PNG, WEBP', color: '#2563EB' },
            { icon: Video, label: 'Videos', formats: 'MP4, MOV, AVI', color: '#06B6D4' },
            { icon: FileCheck, label: 'Max Size', formats: '100 MB', color: '#22C55E' },
          ].map(item => (
            <div key={item.label} style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
            }}>
              <item.icon size={16} color={item.color} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#F8FAFC' }}>{item.label}</div>
                <div style={{ fontSize: 10, color: '#64748B' }}>{item.formats}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Dropzone */}
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              {...getRootProps()}
              style={{
                border: `2px dashed ${isDragActive ? '#2563EB' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 20,
                padding: '60px 40px',
                textAlign: 'center',
                cursor: 'pointer',
                background: isDragActive ? 'rgba(37,99,235,0.07)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.3s',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <input {...getInputProps()} />
              <motion.div animate={isDragActive ? { scale: 1.1 } : { scale: 1 }} transition={{ duration: 0.2 }}>
                <div style={{
                  width: 80, height: 80,
                  background: isDragActive ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isDragActive ? 'rgba(37,99,235,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  transition: 'all 0.3s',
                }}>
                  <Upload size={32} color={isDragActive ? '#2563EB' : '#475569'} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#F8FAFC', marginBottom: 8, fontFamily: 'Poppins' }}>
                  {isDragActive ? 'Drop your file here' : 'Drag & Drop Evidence File'}
                </div>
                <div style={{ fontSize: 14, color: '#64748B', marginBottom: 20 }}>
                  or click to browse from your device
                </div>
                <div style={{
                  display: 'inline-block',
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                  borderRadius: 10,
                  fontSize: 13.5, fontWeight: 600, color: 'white',
                }}>
                  Choose File
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(37,99,235,0.25)',
                borderRadius: 20,
                overflow: 'hidden',
              }}
            >
              {/* Preview */}
              <div style={{ position: 'relative', background: '#020617', minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {preview ? (
                  <img src={preview} alt="preview" style={{ maxWidth: '100%', maxHeight: 340, objectFit: 'contain' }} />
                ) : (
                  <div style={{ textAlign: 'center', padding: 40 }}>
                    <Video size={48} color="#06B6D4" style={{ marginBottom: 12 }} />
                    <div style={{ fontSize: 14, color: '#94A3B8' }}>{file.name}</div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Video file ready for processing</div>
                  </div>
                )}

                {/* Scan overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  border: '2px solid rgba(6,182,212,0.2)',
                  borderRadius: 0,
                  pointerEvents: 'none',
                }} />

                {/* Remove button */}
                <button
                  onClick={clearFile}
                  style={{
                    position: 'absolute', top: 12, right: 12,
                    width: 32, height: 32,
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '50%', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={14} color="#EF4444" />
                </button>
              </div>

              {/* File info */}
              <div style={{ padding: '18px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#F8FAFC' }}>{file.name}</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {fileType === 'video' ? 'Video' : 'Image'} file
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20 }}>
                    <FileCheck size={12} color="#22C55E" />
                    <span style={{ fontSize: 11, color: '#22C55E', fontWeight: 600 }}>File Verified</span>
                  </div>
                </div>

                {/* Evidence info */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                  {[
                    ['Upload Time', new Date().toLocaleTimeString('en-IN')],
                    ['File Type', file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN'],
                    ['Integrity', 'VERIFIED'],
                  ].map(([k, v]) => (
                    <div key={k} style={{ textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: 10, color: '#64748B', marginBottom: 4 }}>{k}</div>
                      <div style={{ fontSize: 12, color: '#F8FAFC', fontWeight: 600 }}>{v}</div>
                    </div>
                  ))}
                </div>

                {error && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10 }}>
                    <AlertCircle size={14} color="#EF4444" />
                    <span style={{ fontSize: 13, color: '#EF4444' }}>{error}</span>
                  </div>
                )}

                <motion.button
                  onClick={handleDetect}
                  disabled={uploading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%', padding: '14px 24px',
                    background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                    border: 'none', borderRadius: 12,
                    fontSize: 15, fontWeight: 700, color: 'white',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    boxShadow: '0 8px 25px rgba(37,99,235,0.35)',
                  }}
                >
                  <Zap size={18} />
                  Detect Violations with AI
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && !file && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10 }}>
            <AlertCircle size={14} color="#EF4444" />
            <span style={{ fontSize: 13, color: '#EF4444' }}>{error}</span>
          </div>
        )}

        {/* Tips */}
        <div style={{ marginTop: 24, padding: '18px 22px', background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.12)', borderRadius: 14 }}>
          <div style={{ fontSize: 12, color: '#06B6D4', fontWeight: 600, marginBottom: 8 }}>💡 TIPS FOR BEST RESULTS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {[
              'Use clear, high-resolution images (min 640×480)',
              'Ensure good lighting conditions in the footage',
              'Include full vehicle and violation in frame',
              'Videos should be at least 3 seconds long',
            ].map(tip => (
              <div key={tip} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 12, color: '#94A3B8' }}>
                <div style={{ width: 4, height: 4, background: '#06B6D4', borderRadius: '50%', marginTop: 5, minWidth: 4 }} />
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
