import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, Upload, FileText, BarChart3, AlertTriangle,
  User, LogOut, Bell, Shield, MapPin, TrendingUp, ChevronLeft,
  ChevronRight, FileBarChart
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/upload', icon: Upload, label: 'Upload Evidence' },
  { path: '/records', icon: FileText, label: 'Violation Records' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/hotspots', icon: MapPin, label: 'Hotspot Map' },
  { path: '/alerts', icon: Bell, label: 'Smart Alerts', badge: 2 },
  { path: '/reports', icon: FileBarChart, label: 'Reports' },
  { path: '/performance', icon: TrendingUp, label: 'Performance' },
  { path: '/profile', icon: User, label: 'My Profile' },
];

export default function AppLayout({ children }) {
  const { officer, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0F172A' }}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
              zIndex: 40, display: 'block'
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          background: '#020617',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          zIndex: 50,
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div style={{
          padding: '20px 16px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          minHeight: 72,
        }}>
          <div style={{
            width: 36, height: 36, minWidth: 36,
            background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={18} color="white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC', fontFamily: 'Poppins', lineHeight: 1.2 }}>
                  TVDS
                </div>
                <div style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>
                  Traffic Violation AI
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
          <div style={{ fontSize: 10, color: '#334155', fontWeight: 600, padding: '8px 8px 6px', letterSpacing: 1, textTransform: 'uppercase' }}>
            {!collapsed ? 'Main Menu' : ''}
          </div>
          {navItems.map(({ path, icon: Icon, label, badge }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              style={{ marginBottom: 2, position: 'relative', overflow: 'hidden' }}
            >
              <Icon size={18} style={{ minWidth: 18 }} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ whiteSpace: 'nowrap', flex: 1 }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {badge && !collapsed && (
                <span style={{
                  background: '#EF4444', color: 'white', fontSize: 10,
                  fontWeight: 700, padding: '1px 6px', borderRadius: 10,
                }}>
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Officer card */}
        <div style={{
          padding: '12px 8px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 8px',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.03)',
          }}>
            <div style={{
              width: 32, height: 32, minWidth: 32,
              background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'white',
            }}>
              {officer?.fullName?.charAt(0) || 'O'}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ flex: 1, minWidth: 0 }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#F8FAFC', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {officer?.fullName || 'Officer'}
                  </div>
                  <div style={{ fontSize: 10, color: '#64748B' }}>{officer?.policeId || 'POL-0000'}</div>
                </motion.div>
              )}
            </AnimatePresence>
            {!collapsed && (
              <button
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: 4 }}
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)',
            width: 24, height: 24,
            background: '#2563EB',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white',
            zIndex: 10,
          }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>

      {/* Main */}
      <motion.main
        animate={{ marginLeft: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}
      >
        {/* Top Header */}
        <header style={{
          height: 64,
          background: 'rgba(2,6,23,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: 16,
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}>
          {/* Breadcrumb */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: '#64748B' }}>
              Traffic Violation Detection System
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#F8FAFC', fontFamily: 'Poppins' }}>
              {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
            </div>
          </div>

          {/* Status indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20 }}>
            <div style={{ width: 6, height: 6, background: '#22C55E', borderRadius: '50%', animation: 'blink 1.5s infinite' }} />
            <span style={{ fontSize: 11, color: '#22C55E', fontWeight: 600 }}>AI SYSTEM ONLINE</span>
          </div>

          {/* Alerts bell */}
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate('/alerts')}>
            <Bell size={18} color="#94A3B8" />
            <span style={{
              position: 'absolute', top: -4, right: -4,
              width: 14, height: 14, background: '#EF4444',
              borderRadius: '50%', fontSize: 9, fontWeight: 700,
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>2</span>
          </div>

          {/* Avatar */}
          <div
            style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: 'white',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/profile')}
          >
            {officer?.fullName?.charAt(0) || 'O'}
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
