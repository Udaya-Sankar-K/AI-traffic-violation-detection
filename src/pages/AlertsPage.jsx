import React from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, AlertCircle, TrendingUp, X, Check } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { MOCK_ALERTS } from '../utils/mockData';

const ALL_ALERTS = [
  ...MOCK_ALERTS,
  {
    id: 'ALT-005',
    type: 'HIGH',
    title: 'Signal Jump Cluster',
    message: 'Hosur Road reported 8 signal jumping violations in 2 hours.',
    time: '2 hrs ago',
    isRead: true,
  },
  {
    id: 'ALT-006',
    type: 'CRITICAL',
    title: 'Wrong-Way Driving Detected',
    message: 'Wrong-way vehicle detected on Outer Ring Road. Emergency alert sent.',
    time: '3 hrs ago',
    isRead: true,
  },
  {
    id: 'ALT-007',
    type: 'SPIKE',
    title: 'Weekend Violation Spike',
    message: 'Saturday violations up 38% vs previous week average.',
    time: '5 hrs ago',
    isRead: true,
  },
];

const TYPE_CONFIG = {
  CRITICAL: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', label: '🔴 CRITICAL', icon: AlertTriangle },
  REPEAT_OFFENDER: { color: '#F97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)', label: '⚠ REPEAT OFFENDER', icon: AlertCircle },
  HIGH: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', label: '🟡 HIGH', icon: Bell },
  SPIKE: { color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)', label: '📈 SPIKE', icon: TrendingUp },
};

export default function AlertsPage() {
  const unread = ALL_ALERTS.filter(a => !a.isRead).length;

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 4 }}>
              Smart Alerts
            </h2>
            <p style={{ fontSize: 13, color: '#64748B' }}>
              {unread} unread alerts requiring attention
            </p>
          </div>
          <button className="btn-secondary" style={{ padding: '8px 18px', fontSize: 13 }}>
            <Check size={14} /> Mark All Read
          </button>
        </div>
      </motion.div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Critical', count: ALL_ALERTS.filter(a => a.type === 'CRITICAL').length, color: '#EF4444' },
          { label: 'Repeat Offenders', count: ALL_ALERTS.filter(a => a.type === 'REPEAT_OFFENDER').length, color: '#F97316' },
          { label: 'High Severity', count: ALL_ALERTS.filter(a => a.type === 'HIGH').length, color: '#F59E0B' },
          { label: 'Spikes', count: ALL_ALERTS.filter(a => a.type === 'SPIKE').length, color: '#8B5CF6' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 8, height: 8, background: s.color, borderRadius: '50%', boxShadow: `0 0 8px ${s.color}` }} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color, fontFamily: 'Poppins' }}>{s.count}</div>
              <div style={{ fontSize: 11.5, color: '#64748B' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts list */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bell size={15} color="#EF4444" />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#F8FAFC' }}>All Alerts</span>
        </div>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ALL_ALERTS.map((alert, i) => {
            const conf = TYPE_CONFIG[alert.type] || TYPE_CONFIG.HIGH;
            const Icon = conf.icon;
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  padding: '16px 18px',
                  background: conf.bg,
                  border: `1px solid ${conf.border}`,
                  borderRadius: 14,
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                  position: 'relative',
                  opacity: alert.isRead ? 0.75 : 1,
                }}
              >
                {/* Unread indicator */}
                {!alert.isRead && (
                  <div style={{
                    position: 'absolute', top: 16, right: 16,
                    width: 8, height: 8, background: conf.color, borderRadius: '50%',
                    animation: 'blink 1.5s infinite',
                  }} />
                )}

                <div style={{
                  width: 38, height: 38, minWidth: 38,
                  background: `${conf.color}18`,
                  border: `1px solid ${conf.color}35`,
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={18} color={conf.color} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: conf.color }}>{conf.label}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#F8FAFC', marginBottom: 4 }}>
                    {alert.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: '#94A3B8', lineHeight: 1.5 }}>
                    {alert.message}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 6 }}>{alert.time}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
