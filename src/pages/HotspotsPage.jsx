import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, TrendingUp, Flame } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { MOCK_HOTSPOTS } from '../utils/mockData';

const RISK_CONFIG = {
  Critical: { color: '#C94C4C', bg: 'rgba(201,76,76,0.12)', border: 'rgba(201,76,76,0.25)', intensity: 1 },
  High: { color: '#C94C4C', bg: 'rgba(201,76,76,0.1)', border: 'rgba(201,76,76,0.25)', intensity: 0.75 },
  Medium: { color: '#C9824B', bg: 'rgba(201,130,75,0.1)', border: 'rgba(201,130,75,0.25)', intensity: 0.5 },
  Low: { color: '#287C78', bg: 'rgba(40,124,120,0.08)', border: 'rgba(40,124,120,0.2)', intensity: 0.25 },
};

// Mock heatmap grid cells
const GRID_CELLS = Array.from({ length: 10 * 12 }, (_, i) => ({
  id: i,
  intensity: Math.random(),
  violations: Math.floor(Math.random() * 150),
}));

function HeatmapCell({ intensity, violations, index }) {
  const alpha = 0.05 + intensity * 0.7;
  const color = intensity > 0.7 ? `rgba(201,76,76,${alpha})`
    : intensity > 0.45 ? `rgba(201,76,76,${alpha})`
    : intensity > 0.25 ? `rgba(201,130,75,${alpha})`
    : `rgba(40,124,120,${alpha * 0.6})`;

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
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#202421', fontFamily: 'Poppins', marginBottom: 4 }}>
          Violation Hotspot Map
        </h2>
        <p style={{ fontSize: 13, color: '#8A9090' }}>High-risk zones ranked by violation frequency</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 20 }}>
        {/* Left: Ranked Hotspots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header card */}
          <div className="glass-card" style={{ padding: '18px 22px', background: 'rgba(201,76,76,0.06)', border: '1px solid rgba(201,76,76,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Flame size={18} color="#C94C4C" />
              <div style={{ fontSize: 14, fontWeight: 700, color: '#202421' }}>Active Hotspots</div>
            </div>
            <div style={{ fontSize: 12, color: '#5A6060' }}>
              {MOCK_HOTSPOTS.filter(h => h.risk === 'Critical' || h.risk === 'High').length} high-risk zones require immediate attention
            </div>
          </div>

          {/* Hotspot list */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#202421', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={14} color="#287C78" /> Top Risk Locations
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
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#202421' }}>{spot.location}</div>
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
                      <div style={{ flex: 1, height: 5, background: 'rgba(32,36,33,0.1)', borderRadius: 3 }}>
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
              <div style={{ fontSize: 13, fontWeight: 700, color: '#202421' }}>Zone Violation Heatmap</div>
              <div style={{ display: 'flex', gap: 12 }}>
                {['Low', 'Medium', 'High', 'Critical'].map((l, i) => {
                  const colors = ['#287C78', '#C9824B', '#C94C4C', '#C94C4C'];
                  return (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#5A6060' }}>
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
            <div style={{ marginTop: 16, fontSize: 11, color: '#8A9090', textAlign: 'center' }}>
              Bangalore City Grid â€” Each cell represents a 500m Ã— 500m zone
            </div>
          </div>

          {/* Zone stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'Critical Zones', value: 3, color: '#C94C4C' },
              { label: 'High Risk Zones', value: 7, color: '#C94C4C' },
              { label: 'Medium Zones', value: 18, color: '#C9824B' },
              { label: 'Safe Zones', value: 92, color: '#287C78' },
            ].map(s => (
              <div key={s.label} className="glass-card" style={{ padding: '14px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: 'Poppins' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#8A9090', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

