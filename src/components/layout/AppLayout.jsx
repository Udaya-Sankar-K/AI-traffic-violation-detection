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
  { path: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/upload',      icon: Upload,           label: 'Upload Evidence' },
  { path: '/records',     icon: FileText,         label: 'Violation Records' },
  { path: '/analytics',   icon: BarChart3,        label: 'Analytics' },
  { path: '/hotspots',    icon: MapPin,           label: 'Hotspot Map' },
  { path: '/alerts',      icon: Bell,             label: 'Smart Alerts', badge: 2 },
  { path: '/reports',     icon: FileBarChart,     label: 'Reports' },
  { path: '/performance', icon: TrendingUp,       label: 'Performance' },
  { path: '/profile',     icon: User,             label: 'My Profile' },
];

export default function AppLayout({ children }) {
  const { officer, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F7F6F2' }}>

      {/* ── Sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 236 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        style={{
          background: '#202421',
          borderRight: '1px solid rgba(255,255,255,0.07)',
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
          padding: '18px 14px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', gap: 12,
          minHeight: 68,
        }}>
          <div style={{
            width: 34, height: 34, minWidth: 34,
            background: '#287C78',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Shield size={17} color="white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', fontFamily: 'Poppins', lineHeight: 1.2 }}>
                  TVDS
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 400, letterSpacing: 0.3 }}>
                  AI Traffic Enforcement
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 6px', overflowY: 'auto', overflowX: 'hidden' }}>
          {!collapsed && (
            <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.25)', fontWeight: 600, padding: '8px 8px 6px', letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: 'Poppins' }}>
              Main Menu
            </div>
          )}
          {navItems.map(({ path, icon: Icon, label, badge }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              style={{ marginBottom: 2, position: 'relative' }}
            >
              <Icon size={17} style={{ minWidth: 17 }} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ whiteSpace: 'nowrap', flex: 1, fontSize: 13.5 }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {badge && !collapsed && (
                <span style={{
                  background: '#C94C4C', color: 'white', fontSize: 9.5,
                  fontWeight: 700, padding: '1px 6px', borderRadius: 10,
                }}>
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Officer card */}
        <div style={{ padding: '10px 6px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 8px', borderRadius: 8,
            background: 'rgba(255,255,255,0.05)',
          }}>
            <div style={{
              width: 30, height: 30, minWidth: 30,
              background: '#287C78',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0,
            }}>
              {officer?.fullName?.charAt(0) || 'O'}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ flex: 1, minWidth: 0 }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {officer?.fullName || 'Officer'}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{officer?.policeId || 'POL-0000'}</div>
                </motion.div>
              )}
            </AnimatePresence>
            {!collapsed && (
              <button
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 4, borderRadius: 6, transition: 'color 0.2s' }}
                title="Logout"
                onMouseEnter={e => e.currentTarget.style.color = '#C94C4C'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
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
            position: 'absolute', right: -11, top: '50%', transform: 'translateY(-50%)',
            width: 22, height: 22,
            background: '#287C78',
            border: 'none', borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', zIndex: 10,
            boxShadow: '0 2px 8px rgba(40,124,120,0.35)',
          }}
        >
          {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
        </button>
      </motion.aside>

      {/* ── Main ── */}
      <motion.main
        animate={{ marginLeft: collapsed ? 68 : 236 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}
      >
        {/* Top Header */}
        <header style={{
          height: 60,
          background: '#FFFFFF',
          borderBottom: '1px solid rgba(32,36,33,0.1)',
          display: 'flex', alignItems: 'center',
          padding: '0 24px', gap: 16,
          position: 'sticky', top: 0, zIndex: 30,
          boxShadow: '0 1px 4px rgba(32,36,33,0.06)',
        }}>
          {/* Breadcrumb */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: '#8A9090', fontFamily: 'Poppins', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Traffic Enforcement System
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#202421', fontFamily: 'Poppins' }}>
              {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
            </div>
          </div>

          {/* AI online status */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 12px',
            background: 'rgba(40,124,120,0.08)',
            border: '1px solid rgba(40,124,120,0.2)',
            borderRadius: 20,
          }}>
            <div className="animate-blink" style={{ width: 6, height: 6, background: '#287C78', borderRadius: '50%' }} />
            <span style={{ fontSize: 11, color: '#287C78', fontWeight: 600, fontFamily: 'Poppins' }}>AI SYSTEM ONLINE</span>
          </div>

          {/* Alerts bell */}
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate('/alerts')}>
            <Bell size={18} color="#5A6060" />
            <span style={{
              position: 'absolute', top: -4, right: -4,
              width: 14, height: 14, background: '#C94C4C',
              borderRadius: '50%', fontSize: 9, fontWeight: 700,
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>2</span>
          </div>

          {/* Avatar */}
          <div
            style={{
              width: 34, height: 34,
              background: '#287C78',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: 'white',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/profile')}
          >
            {officer?.fullName?.charAt(0) || 'O'}
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, padding: 22, overflowY: 'auto' }}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            {children}
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
