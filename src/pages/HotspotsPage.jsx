import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, TrendingUp, Flame } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { MOCK_HOTSPOTS } from '../utils/mockData';

const RISK_CONFIG = {
  Critical: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', intensity: 1 },
  High: { color: '#F97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)', intensity: 0.75 },
  Medium: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', intensity: 0.5 },
  Low: { color: '#22C55E', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)', intensity: 0.25 },
};

// Mock heatmap grid cells
const GRID_CELLS = Array.from({ length: 10 * 12 }, (_, i) => ({
  id: i,
  intensity: Math.random(),
  violations: Math.floor(Math.random() * 150),
}));

function HeatmapCell({ intensity, violations, index }) {
  const alpha = 0.05 + intensity * 0.7;
  const color = intensity > 0.7 ? `rgba(239,68,68,${alpha})`
    : intensity > 0.45 ? `rgba(249,115,22,${alpha})`
    : intensity > 0.25 ? `rgba(245,158,11,${alpha})`
    : `rgba(34,197,94,${alpha * 0.6})`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.003 }}
      className="hotspot-cell"
      title={`${violations} violations`}
      style={{
        background: color,
        border: `1px solid ${color.replace(/[\d.]+\)$/, '0.6)')}`,
        width: '100%',
        aspectRatio: 1,
        borderRadius: 4,
        cursor: 'pointer',
      }}
    />
  );
}

export default function HotspotsPage() {
  const [selected, setSelected] = useState(null);

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 4 }}>
          Violation Hotspot Map
        </h2>
        <p style={{ fontSize: 13, color: '#64748B' }}>High-risk zones ranked by violation frequency</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 20 }}>
        {/* Left: Ranked Hotspots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header card */}
          <div className="glass-card" style={{ padding: '18px 22px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Flame size={18} color="#EF4444" />
              <div style={{ fontSize: 14, fontWeight: 700, color: '#F8FAFC' }}>Active Hotspots</div>
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>
              {MOCK_HOTSPOTS.filter(h => h.risk === 'Critical' || h.risk === 'High').length} high-risk zones require immediate attention
            </div>
          </div>

          {/* Hotspot list */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={14} color="#2563EB" /> Top Risk Locations
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {MOCK_HOTSPOTS.map((spot, i) => {
                const conf = RISK_CONFIG[spot.risk];
                const maxCount = MOCK_HOTSPOTS[0].count;
                return (
                  <motion.div
                    key={spot.location}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    style={{
                      padding: '12px 16px',
                      background: conf.bg,
                      border: `1px solid ${conf.border}`,
                      borderRadius: 12,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          width: 22, height: 22, background: `${conf.color}20`,
                          border: `1px solid ${conf.color}40`,
                          borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, fontWeight: 800, color: conf.color,
                        }}>
                          {i + 1}
                        </span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#F8FAFC' }}>{spot.location}</div>
                        </div>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10,
                        background: conf.bg, color: conf.color, border: `1px solid ${conf.border}`,
                      }}>
                        {spot.risk}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(spot.count / maxCount) * 100}%` }}
                          transition={{ duration: 0.8, delay: i * 0.07 }}
                          style={{ height: '100%', background: conf.color, borderRadius: 3 }}
                        />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: conf.color, minWidth: 30 }}>
                        {spot.count}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Heatmap */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Legend */}
          <div className="glass-card" style={{ padding: '14px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC' }}>Zone Violation Heatmap</div>
              <div style={{ display: 'flex', gap: 12 }}>
                {['Low', 'Medium', 'High', 'Critical'].map((l, i) => {
                  const colors = ['#22C55E', '#F59E0B', '#F97316', '#EF4444'];
                  return (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#94A3B8' }}>
                      <div style={{ width: 12, height: 12, background: colors[i], borderRadius: 2, opacity: 0.7 }} />
                      {l}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Heatmap grid */}
          <div className="glass-card" style={{ padding: 20, flex: 1 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: 4,
            }}>
              {GRID_CELLS.map((cell, i) => (
                <HeatmapCell key={cell.id} intensity={cell.intensity} violations={cell.violations} index={i} />
              ))}
            </div>
            <div style={{ marginTop: 16, fontSize: 11, color: '#475569', textAlign: 'center' }}>
              Bangalore City Grid — Each cell represents a 500m × 500m zone
            </div>
          </div>

          {/* Zone stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'Critical Zones', value: 3, color: '#EF4444' },
              { label: 'High Risk Zones', value: 7, color: '#F97316' },
              { label: 'Medium Zones', value: 18, color: '#F59E0B' },
              { label: 'Safe Zones', value: 92, color: '#22C55E' },
            ].map(s => (
              <div key={s.label} className="glass-card" style={{ padding: '14px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: 'Poppins' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
