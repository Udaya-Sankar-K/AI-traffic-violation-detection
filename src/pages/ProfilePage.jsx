import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, MapPin, BadgeCheck, Shield, Edit3, Save, X,
  Clock, Lock, CheckCircle
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { officer, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: officer?.fullName || '',
    designation: officer?.designation || '',
    station: officer?.station || '',
    district: officer?.district || '',
    email: officer?.email || '',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 800));
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 4 }}>
          My Profile
        </h2>
        <p style={{ fontSize: 13, color: '#64748B' }}>Manage your officer account information</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
        {/* Left: Avatar card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="glass-card" style={{ padding: 28, textAlign: 'center' }}>
            {/* Avatar */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 18 }}>
              <div style={{
                width: 90, height: 90,
                background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 34, fontWeight: 800, color: 'white',
                margin: '0 auto',
                boxShadow: '0 12px 40px rgba(37,99,235,0.4)',
              }}>
                {officer?.fullName?.charAt(0) || 'O'}
              </div>
              <div style={{
                position: 'absolute', bottom: 2, right: 2,
                width: 22, height: 22,
                background: '#22C55E',
                border: '3px solid #0F172A',
                borderRadius: '50%',
              }} />
            </div>

            <div style={{ fontSize: 18, fontWeight: 800, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 4 }}>
              {officer?.fullName}
            </div>
            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 4 }}>
              {officer?.designation}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px',
              background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.25)',
              borderRadius: 20, fontSize: 12, color: '#2563EB', fontWeight: 600,
              marginBottom: 20,
            }}>
              <Shield size={11} /> {officer?.policeId}
            </div>

            <div style={{
              padding: '14px 16px',
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 12,
            }}>
              <div style={{ fontSize: 11, color: '#64748B', marginBottom: 2 }}>Last Login</div>
              <div style={{ fontSize: 13, color: '#22C55E', fontWeight: 600 }}>
                {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="glass-card" style={{ padding: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC', marginBottom: 14 }}>
              Activity Summary
            </div>
            {[
              { label: 'Cases Uploaded', value: officer?.casesUploaded || 168, color: '#2563EB' },
              { label: 'Cases Processed', value: officer?.casesProcessed || 145, color: '#06B6D4' },
              { label: 'Reviews Completed', value: officer?.reviewsCompleted || 132, color: '#22C55E' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 12.5, color: '#94A3B8' }}>{s.label}</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Badge */}
          <div className="glass-card" style={{ padding: 22, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🏅</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#F8FAFC', marginBottom: 4 }}>Active Investigator</div>
            <div style={{ fontSize: 11, color: '#64748B' }}>Awarded for 100+ cases processed</div>
          </div>
        </div>

        {/* Right: Profile details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="glass-card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', fontFamily: 'Poppins' }}>
                Officer Details
              </div>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="btn-secondary"
                  style={{ padding: '7px 16px', fontSize: 12.5 }}
                >
                  <Edit3 size={13} /> Edit Profile
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setEditing(false)}
                    style={{ padding: '7px 14px', background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, fontSize: 12.5, color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <X size={13} /> Cancel
                  </button>
                  <button onClick={handleSave} className="btn-primary" style={{ padding: '7px 16px', fontSize: 12.5 }}>
                    <Save size={13} /> Save
                  </button>
                </div>
              )}
            </div>

            {saved && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, padding: '10px 14px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 10 }}
              >
                <CheckCircle size={14} color="#22C55E" />
                <span style={{ fontSize: 13, color: '#22C55E' }}>Profile updated successfully!</span>
              </motion.div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {[
                { key: 'fullName', label: 'Full Name', icon: User, editable: true },
                { key: 'policeId', label: 'Police ID', icon: BadgeCheck, editable: false, value: officer?.policeId },
                { key: 'designation', label: 'Designation', icon: Shield, editable: true },
                { key: 'badge', label: 'Badge Number', icon: BadgeCheck, editable: false, value: officer?.badge || 'KA/SI/2019/0821' },
                { key: 'station', label: 'Police Station', icon: MapPin, editable: true },
                { key: 'district', label: 'District', icon: MapPin, editable: true },
                { key: 'email', label: 'Official Email', icon: Mail, editable: true },
                { key: 'joinDate', label: 'Join Date', icon: Clock, editable: false, value: '15 Mar 2019' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontSize: 11.5, color: '#64748B', fontWeight: 500, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <field.icon size={11} /> {field.label}
                  </label>
                  {editing && field.editable ? (
                    <input
                      className="input-field"
                      value={form[field.key] || ''}
                      onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      style={{ fontSize: 13 }}
                    />
                  ) : (
                    <div style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 10,
                      fontSize: 13.5, color: field.editable ? '#F8FAFC' : '#94A3B8',
                      fontWeight: field.editable ? 500 : 400,
                    }}>
                      {field.value || form[field.key] || officer?.[field.key] || '—'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Security section */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 18 }}>
              Security Settings
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                style={{
                  flex: 1, padding: '12px 16px',
                  background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)',
                  borderRadius: 12, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}
              >
                <Lock size={16} color="#2563EB" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#F8FAFC' }}>Change Password</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Last changed 90 days ago</div>
                </div>
              </button>
              <button
                onClick={logout}
                style={{
                  flex: 1, padding: '12px 16px',
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 12, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}
              >
                <Shield size={16} color="#EF4444" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#EF4444' }}>Sign Out</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>End current session</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
