import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle, Shield, Upload, FileText, BarChart3,
  Activity, Clock, CheckCircle, ArrowRight,
  MapPin, Bell, ChevronUp, ChevronDown
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_DAILY_TREND, MOCK_VIOLATIONS, SEVERITY_CONFIG, MOCK_ALERTS, MOCK_CATEGORY_DATA, VIOLATION_META } from '../utils/mockData';

function StatCard({ icon: Icon, label, value, change, color, sub }) {
  const isUp = change >= 0;
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="stat-card"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Glow top border */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} color={color} />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 12, color: isUp ? '#22C55E' : '#EF4444', fontWeight: 600,
        }}>
          {isUp ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {Math.abs(change)}%
        </div>
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 4 }}>
        {value.toLocaleString()}
      </div>
      <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>{sub}</div>}
    </motion.div>
  );
}

function QuickAction({ icon: Icon, label, color, path, navigate }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(path)}
      style={{
        background: `${color}10`,
        border: `1px solid ${color}25`,
        borderRadius: 14,
        padding: '16px 14px',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        transition: 'all 0.2s',
        flex: 1,
      }}
    >
      <div style={{
        width: 44, height: 44,
        background: `${color}20`,
        border: `1px solid ${color}30`,
        borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} color={color} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#CBD5E1' }}>{label}</span>
    </motion.button>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px' }}>
        <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6 }}>{label}</div>
        {payload.map(p => (
          <div key={p.name} style={{ fontSize: 13, color: p.color, fontWeight: 600 }}>
            {p.name}: {p.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { officer } = useAuth();
  const [animatedValues, setAnimatedValues] = useState({
    total: 0, today: 0, helmet: 0, signal: 0, noParking: 0, zebra: 0, wrongWay: 0, triple: 0
  });

  useEffect(() => {
    const targets = {
      total: 1284, today: 47, helmet: 412, signal: 318, noParking: 189, zebra: 143, wrongWay: 97, triple: 76
    };
    const duration = 1500;
    const start = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimatedValues(Object.fromEntries(
        Object.entries(targets).map(([k, v]) => [k, Math.floor(v * ease)])
      ));
      if (progress === 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, []);

  return (
    <AppLayout>
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(6,182,212,0.06))',
          border: '1px solid rgba(37,99,235,0.2)',
          borderRadius: 18,
          padding: '20px 28px',
          marginBottom: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4, fontWeight: 500 }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#F8FAFC', fontFamily: 'Poppins' }}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'},
            {' '}{officer?.fullName?.split(' ')[0] || 'Officer'} 👋
          </div>
          <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>
            {officer?.designation} • {officer?.station}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20 }}>
          <div className="animate-blink" style={{ width: 7, height: 7, background: '#22C55E', borderRadius: '50%' }} />
          <span style={{ fontSize: 12, color: '#22C55E', fontWeight: 600 }}>SYSTEM ONLINE</span>
        </div>
      </motion.div>

      {/* Stats grid — Row 1: totals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 14 }}>
        <StatCard icon={Activity}      label="Total Violations"       value={animatedValues.total}    change={12}  color="#2563EB" sub="All time" />
        <StatCard icon={Clock}         label="Today's Detections"      value={animatedValues.today}    change={8}   color="#06B6D4" sub="Last 24 hours" />
        <StatCard icon={Shield}        label="Helmetless Riding"       value={animatedValues.helmet}   change={5}   color="#F97316" sub="Top category" />
        <StatCard icon={AlertTriangle} label="Signal Jumping"          value={animatedValues.signal}   change={-3}  color="#EF4444" sub="High severity" />
      </div>
      {/* Stats grid — Row 2: new categories */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard icon={MapPin}        label="No-Parking Violations"  value={animatedValues.noParking} change={14} color="#8B5CF6" sub="This month" />
        <StatCard icon={CheckCircle}   label="Zebra-Crossing"         value={animatedValues.zebra}     change={7}  color="#F59E0B" sub="High priority" />
        <StatCard icon={ArrowRight}    label="Wrong-Way Driving"      value={animatedValues.wrongWay}  change={-5} color="#DC2626" sub="Dangerous" />
        <StatCard icon={Bell}          label="Triple Riding"           value={animatedValues.triple}    change={3}  color="#10B981" sub="Two-wheelers" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Violation Trend Chart */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', fontFamily: 'Poppins' }}>Weekly Violation Trend</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>Last 7 days — all categories</div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 10 }}>
              {[
                ['Total',      '#2563EB'],
                ['Helmet',     '#F97316'],
                ['Signal',     '#EF4444'],
                ['No-Parking', '#8B5CF6'],
                ['Zebra',      '#F59E0B'],
                ['Wrong-Way',  '#DC2626'],
                ['Triple',     '#10B981'],
              ].map(([n, c]) => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#94A3B8' }}>
                  <div style={{ width: 8, height: 2, background: c, borderRadius: 1 }} />{n}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MOCK_DAILY_TREND}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="violations" name="Total"      stroke="#2563EB" fill="url(#blueGrad)" strokeWidth={2} dot={false} />
              <Line  type="monotone" dataKey="helmets"   name="Helmet"     stroke="#F97316" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
              <Line  type="monotone" dataKey="signals"   name="Signal"     stroke="#EF4444" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
              <Line  type="monotone" dataKey="noParking" name="No-Parking" stroke="#8B5CF6" strokeWidth={1.5} dot={false} strokeDasharray="3 3" />
              <Line  type="monotone" dataKey="zebra"     name="Zebra"      stroke="#F59E0B" strokeWidth={1.5} dot={false} strokeDasharray="3 3" />
              <Line  type="monotone" dataKey="wrongWay"  name="Wrong-Way" stroke="#DC2626" strokeWidth={1.5} dot={false} />
              <Line  type="monotone" dataKey="triple"    name="Triple"     stroke="#10B981" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 4 }}>Quick Actions</div>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 18 }}>Frequently used tools</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <QuickAction icon={Upload} label="Upload Evidence" color="#2563EB" path="/upload" navigate={navigate} />
            <QuickAction icon={FileText} label="View Records" color="#06B6D4" path="/records" navigate={navigate} />
            <QuickAction icon={BarChart3} label="Analytics" color="#22C55E" path="/analytics" navigate={navigate} />
            <QuickAction icon={Bell} label="Alerts" color="#EF4444" path="/alerts" navigate={navigate} />
          </div>

          {/* Detection accuracy */}
          <div style={{ marginTop: 20, padding: 16, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#94A3B8' }}>AI Detection Accuracy</span>
              <span style={{ fontSize: 13, color: '#22C55E', fontWeight: 700 }}>94.7%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: '0%' }}
                animate={{ width: '94.7%' }}
                transition={{ duration: 1.5, delay: 0.5 }}
                style={{ background: 'linear-gradient(90deg, #22C55E, #06B6D4)' }}
              />
            </div>
            <div style={{ fontSize: 10, color: '#64748B', marginTop: 6 }}>Based on last 500 detections</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent Activity */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', fontFamily: 'Poppins' }}>Recent Activity</div>
            <button
              onClick={() => navigate('/records')}
              style={{ fontSize: 12, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MOCK_VIOLATIONS.slice(0, 6).map(v => (
              <div key={v.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.04)',
              }}>
                <div style={{
                  width: 36, height: 36, minWidth: 36,
                  background: `${SEVERITY_CONFIG[v.severity]?.color}18`,
                  border: `1px solid ${SEVERITY_CONFIG[v.severity]?.color}30`,
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}>
                  {VIOLATION_META[v.type]?.icon ?? '⚠️'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#F8FAFC', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {v.type}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>
                    {v.id} • {new Date(v.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span className={`badge badge-${v.severity === 'Critical' ? 'red' : v.severity === 'High' ? 'red' : v.severity === 'Medium' ? 'orange' : 'green'}`}>
                  {v.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts + Smart City */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Live Alerts */}
          <div className="glass-card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', fontFamily: 'Poppins', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bell size={15} color="#EF4444" /> Live Alerts
              </div>
              <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 600 }}>2 UNREAD</span>
            </div>
            {MOCK_ALERTS.slice(0, 3).map(alert => (
              <div key={alert.id} style={{
                display: 'flex', gap: 10, padding: '9px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}>
                <div style={{
                  width: 8, height: 8, minWidth: 8, borderRadius: '50%',
                  marginTop: 4,
                  background: alert.type === 'CRITICAL' ? '#EF4444' : alert.type === 'REPEAT_OFFENDER' ? '#F97316' : '#F59E0B',
                  ...(alert.isRead ? {} : { animation: 'blink 1.5s infinite' }),
                }} />
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: alert.isRead ? '#94A3B8' : '#F8FAFC' }}>{alert.title}</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{alert.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Smart City Readiness */}
          <div className="glass-card" style={{ padding: 22 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 14 }}>
              🏙️ Smart City Readiness
            </div>
            {[
              ['CCTV Integration', true, '#06B6D4'],
              ['E-Challan Generation', true, '#22C55E'],
              ['Real-Time Monitoring', false, '#F97316'],
              ['Smart City Deployment', false, '#8B5CF6'],
            ].map(([label, ready, color]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <span style={{ fontSize: 12.5, color: '#94A3B8' }}>{label}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                  background: ready ? 'rgba(34,197,94,0.1)' : 'rgba(249,115,22,0.1)',
                  color: ready ? '#22C55E' : '#F97316',
                  border: `1px solid ${ready ? 'rgba(34,197,94,0.3)' : 'rgba(249,115,22,0.3)'}`,
                }}>
                  {ready ? 'READY' : 'COMING SOON'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
