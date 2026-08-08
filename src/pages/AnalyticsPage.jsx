import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import AppLayout from '../components/layout/AppLayout';
import { MOCK_DAILY_TREND, MOCK_MONTHLY_TREND, MOCK_CATEGORY_DATA, MOCK_VIOLATIONS, VIOLATION_META } from '../utils/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#F7F6F2', border: '1px solid rgba(32,36,33,0.12)', borderRadius: 10, padding: '10px 14px' }}>
        <div style={{ fontSize: 12, color: '#5A6060', marginBottom: 6 }}>{label}</div>
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

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#5A6060" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11}>
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

function ChartCard({ title, subtitle, children, span = 1 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
      style={{ padding: 24, gridColumn: span > 1 ? `span ${span}` : undefined }}
    >
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#202421', fontFamily: 'Poppins' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: '#8A9090', marginTop: 2 }}>{subtitle}</div>}
      </div>
      {children}
    </motion.div>
  );
}

// Derives ranked violation list from MOCK_CATEGORY_DATA â€” auto-updates when new categories added
const TOP_VIOLATIONS = MOCK_CATEGORY_DATA.map(d => ({
  type: d.name,
  count: Math.round(d.value * 13), // scale % â†’ approximate case count
  pct: d.value,
  color: d.color,
}));

export default function AnalyticsPage() {
  const avgConfidence = (MOCK_VIOLATIONS.reduce((a, v) => a + v.confidence, 0) / MOCK_VIOLATIONS.length).toFixed(1);

  return (
    <AppLayout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#202421', fontFamily: 'Poppins', marginBottom: 4 }}>
          Analytics
        </h2>
        <p style={{ fontSize: 13, color: '#8A9090' }}>
          Comprehensive violation statistics and trend analysis
        </p>
      </motion.div>

      {/* Summary stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Avg. Confidence', value: `${avgConfidence}%`, color: '#287C78', sub: 'AI detection accuracy' },
          { label: 'Peak Day',        value: 'Friday',             color: '#287C78', sub: '68 violations avg.' },
          { label: 'Top Violation',   value: 'Helmetless Riding',  color: '#C9824B', sub: '28% of all cases' },
          { label: 'Resolution Rate', value: '78.4%',              color: '#287C78', sub: 'Cases closed' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: 'Poppins', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12.5, color: '#202421', fontWeight: 600 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: '#8A9090', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Daily Trend */}
        <ChartCard title="Daily Violation Trend" subtitle="Last 7 days breakdown by type">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MOCK_DAILY_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF" />
              <XAxis dataKey="day" tick={{ fill: '#8A9090', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8A9090', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 10, color: '#5A6060' }} />
              <Bar dataKey="helmets"   name="Helmetless" fill="#C9824B" radius={[3,3,0,0]} stackId="a" />
              <Bar dataKey="signals"   name="Signal"     fill="#C94C4C" radius={[0,0,0,0]} stackId="a" />
              <Bar dataKey="noParking" name="No-Parking" fill="#8B5CF6" radius={[0,0,0,0]} stackId="a" />
              <Bar dataKey="zebra"     name="Zebra"      fill="#C9824B" radius={[0,0,0,0]} stackId="a" />
              <Bar dataKey="wrongWay"  name="Wrong-Way" fill="#DC2626" radius={[0,0,0,0]} stackId="a" />
              <Bar dataKey="triple"    name="Triple"     fill="#10B981" radius={[3,3,0,0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Category Pie */}
        <ChartCard title="Violation Categories" subtitle="Distribution by type">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={MOCK_CATEGORY_DATA}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                labelLine={false}
              >
                {MOCK_CATEGORY_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {MOCK_CATEGORY_DATA.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#5A6060' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, minWidth: 8 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
                <span style={{ marginLeft: 'auto', color: d.color, fontWeight: 600 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Monthly trend - full width */}
        <ChartCard title="Monthly Violation Statistics" subtitle="Janâ€“Aug 2024 â€” Detected vs Resolved + new categories">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MOCK_MONTHLY_TREND}>
              <defs>
                <linearGradient id="blueGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#287C78" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#287C78" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#287C78" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#287C78" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF" />
              <XAxis dataKey="month" tick={{ fill: '#8A9090', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8A9090', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 10, color: '#5A6060' }} />
              <Area type="monotone" dataKey="violations" name="Detected"   stroke="#287C78" fill="url(#blueGrad2)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="resolved"   name="Resolved"   stroke="#287C78" fill="url(#greenGrad)" strokeWidth={2} dot={false} />
              <Line  type="monotone" dataKey="wrongWay"  name="Wrong-Way" stroke="#DC2626" strokeWidth={1.5} dot={false} strokeDasharray="3 3" />
              <Line  type="monotone" dataKey="zebra"     name="Zebra"      stroke="#C9824B" strokeWidth={1.5} dot={false} strokeDasharray="3 3" />
              <Line  type="monotone" dataKey="noParking" name="No-Parking" stroke="#8B5CF6" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
              <Line  type="monotone" dataKey="triple"    name="Triple"     stroke="#10B981" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

      {/* Top violations + Accuracy */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, marginTop: 20 }}>
        {/* Top violations */}
        <ChartCard title="Top Violation Types" subtitle="Ranked by occurrence frequency">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {TOP_VIOLATIONS.map((v, i) => (
              <div key={v.type}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 22, height: 22, background: `${v.color}20`,
                      border: `1px solid ${v.color}40`,
                      borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 800, color: v.color,
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 13 }}>{VIOLATION_META[v.type]?.icon ?? 'âš ï¸'}</span>
                    <span style={{ color: '#202421', fontWeight: 500 }}>{v.type}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ color: '#8A9090' }}>{v.count} cases</span>
                    <span style={{ color: v.color, fontWeight: 700 }}>{v.pct}%</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${v.pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08 }}
                    style={{ background: `linear-gradient(90deg, ${v.color}80, ${v.color})` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Detection accuracy */}
        <ChartCard title="Detection Accuracy" subtitle="AI model performance metrics">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Overall Accuracy', value: 94.7, color: '#287C78' },
              { label: 'Precision Score', value: 92.3, color: '#287C78' },
              { label: 'Recall Score', value: 96.1, color: '#287C78' },
              { label: 'F1 Score', value: 94.2, color: '#8B5CF6' },
              { label: 'False Positive Rate', value: 5.3, color: '#C9824B' },
            ].map((m, i) => (
              <div key={m.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: '#5A6060' }}>{m.label}</span>
                  <span style={{ color: m.color, fontWeight: 700 }}>{m.value}%</span>
                </div>
                <div className="progress-bar" style={{ height: 5 }}>
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${m.value}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    style={{ background: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </AppLayout>
  );
}

