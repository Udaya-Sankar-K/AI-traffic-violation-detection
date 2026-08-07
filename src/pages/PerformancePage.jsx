import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Upload, CheckCircle, Target,
  Activity, Shield
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../contexts/AuthContext';

const OFFICERS = [
  {
    name: 'Rahul Sharma',
    id: 'POL-9821',
    designation: 'Sub-Inspector',
    casesUploaded: 168,
    casesProcessed: 145,
    reviewsCompleted: 132,
    avgConfidence: 93.4,
    criticalCases: 12,
    rank: 1,
  },
  {
    name: 'Priya Nair',
    id: 'POL-4456',
    designation: 'ASI',
    casesUploaded: 142,
    casesProcessed: 128,
    reviewsCompleted: 115,
    avgConfidence: 91.2,
    criticalCases: 8,
    rank: 2,
  },
  {
    name: 'Arjun Mehta',
    id: 'POL-7732',
    designation: 'Inspector',
    casesUploaded: 198,
    casesProcessed: 184,
    reviewsCompleted: 171,
    avgConfidence: 95.7,
    criticalCases: 21,
    rank: 3,
  },
];

const WEEKLY_PERFORMANCE = [
  { day: 'Mon', cases: 8, reviews: 7 },
  { day: 'Tue', cases: 12, reviews: 10 },
  { day: 'Wed', cases: 15, reviews: 13 },
  { day: 'Thu', cases: 9, reviews: 8 },
  { day: 'Fri', cases: 18, reviews: 16 },
  { day: 'Sat', cases: 14, reviews: 12 },
  { day: 'Sun', cases: 6, reviews: 5 },
];

const RADAR_DATA = [
  { metric: 'Upload Speed', A: 88 },
  { metric: 'Accuracy', A: 94 },
  { metric: 'Case Volume', A: 86 },
  { metric: 'Review Rate', A: 91 },
  { metric: 'Response Time', A: 78 },
  { metric: 'Critical Cases', A: 72 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px' }}>
        <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6 }}>{label}</div>
        {payload.map(p => (
          <div key={p.name} style={{ fontSize: 13, color: p.color || p.fill, fontWeight: 600 }}>
            {p.name}: {p.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function PerformancePage() {
  const { officer } = useAuth();
  const [selectedOfficer, setSelectedOfficer] = useState(0);
  const sel = OFFICERS[selectedOfficer];

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 4 }}>
          Officer Performance
        </h2>
        <p style={{ fontSize: 13, color: '#64748B' }}>Track individual and team performance metrics</p>
      </motion.div>

      {/* My performance banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(6,182,212,0.06))',
          border: '1px solid rgba(37,99,235,0.2)',
          borderRadius: 18, padding: '22px 28px',
          display: 'grid', gridTemplateColumns: 'auto 1fr repeat(4, auto)',
          gap: 28, alignItems: 'center',
          marginBottom: 24,
        }}
      >
        {/* Avatar */}
        <div style={{
          width: 56, height: 56,
          background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, fontWeight: 700, color: 'white',
        }}>
          {officer?.fullName?.charAt(0) || 'O'}
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC', fontFamily: 'Poppins' }}>
            {officer?.fullName}
          </div>
          <div style={{ fontSize: 12, color: '#64748B' }}>{officer?.designation} • {officer?.policeId}</div>
        </div>
        {[
          { icon: Upload, label: 'Cases Uploaded', value: officer?.casesUploaded || 168, color: '#2563EB' },
          { icon: Activity, label: 'Processed', value: officer?.casesProcessed || 145, color: '#06B6D4' },
          { icon: CheckCircle, label: 'Reviewed', value: officer?.reviewsCompleted || 132, color: '#22C55E' },
          { icon: Target, label: 'Avg. Accuracy', value: '93.4%', color: '#F97316' },
        ].map(m => (
          <div key={m.label} style={{ textAlign: 'center', padding: '0 16px', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
            <m.icon size={14} color={m.color} style={{ marginBottom: 4 }} />
            <div style={{ fontSize: 22, fontWeight: 800, color: m.color, fontFamily: 'Poppins' }}>{m.value}</div>
            <div style={{ fontSize: 11, color: '#64748B' }}>{m.label}</div>
          </div>
        ))}
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Weekly performance chart */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 4 }}>
            Weekly Activity
          </div>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 18 }}>Cases uploaded vs reviewed this week</div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={WEEKLY_PERFORMANCE}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cases" name="Uploaded" fill="#2563EB" radius={[3, 3, 0, 0]} />
              <Bar dataKey="reviews" name="Reviewed" fill="#22C55E" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar chart */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 4 }}>
            Performance Radar
          </div>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 18 }}>Multi-dimensional performance score</div>
          <ResponsiveContainer width="100%" height={210}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748B', fontSize: 10 }} />
              <Radar name="Performance" dataKey="A" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Officer leaderboard */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 6 }}>
          🏆 Officer Leaderboard
        </div>
        <div style={{ fontSize: 12, color: '#64748B', marginBottom: 20 }}>Top performers this month</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {OFFICERS.map((off, i) => (
            <motion.div
              key={off.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedOfficer(i)}
              whileHover={{ y: -4 }}
              style={{
                padding: 20,
                background: selectedOfficer === i ? 'rgba(37,99,235,0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${selectedOfficer === i ? 'rgba(37,99,235,0.35)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 16,
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s',
              }}
            >
              {/* Rank badge */}
              <div style={{
                position: 'absolute', top: 12, right: 12,
                width: 28, height: 28,
                background: i === 0 ? '#F59E0B20' : i === 1 ? '#94A3B820' : '#CD7C2F20',
                border: `1px solid ${i === 0 ? '#F59E0B40' : i === 1 ? '#94A3B840' : '#CD7C2F40'}`,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12,
              }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
              </div>

              <div style={{
                width: 44, height: 44,
                background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700, color: 'white',
                marginBottom: 12,
              }}>
                {off.name.charAt(0)}
              </div>

              <div style={{ fontSize: 14, fontWeight: 700, color: '#F8FAFC', marginBottom: 2 }}>{off.name}</div>
              <div style={{ fontSize: 11, color: '#64748B', marginBottom: 16 }}>{off.designation} • {off.id}</div>

              {[
                ['Uploaded', off.casesUploaded, '#2563EB'],
                ['Processed', off.casesProcessed, '#06B6D4'],
                ['Reviewed', off.reviewsCompleted, '#22C55E'],
              ].map(([label, value, color]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: '#64748B' }}>{label}</span>
                  <span style={{ color, fontWeight: 700 }}>{value}</span>
                </div>
              ))}

              <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: '#64748B', marginBottom: 2 }}>Avg. Confidence</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#22C55E' }}>{off.avgConfidence}%</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
