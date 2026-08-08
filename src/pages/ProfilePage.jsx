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
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#202421', fontFamily: 'Poppins', marginBottom: 4 }}>
          My Profile
        </h2>
        <p style={{ fontSize: 13, color: '#8A9090' }}>Manage your officer account information</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
        {/* Left: Avatar card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="glass-card" style={{ padding: 28, textAlign: 'center' }}>
            {/* Avatar */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 18 }}>
              <div style={{
                width: 90, height: 90,
                background: '#287C78',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 34, fontWeight: 800, color: 'white',
                margin: '0 auto',
                boxShadow: '0 2px 8px rgba(40,124,120,0.15)',
              }}>
                {officer?.fullName?.charAt(0) || 'O'}
              </div>
              <div style={{
                position: 'absolute', bottom: 2, right: 2,
                width: 22, height: 22,
                background: '#287C78',
                border: '3px solid #FFFFFF',
                borderRadius: '50%',
              }} />
            </div>

            <div style={{ fontSize: 18, fontWeight: 800, color: '#202421', fontFamily: 'Poppins', marginBottom: 4 }}>
              {officer?.fullName}
            </div>
            <div style={{ fontSize: 13, color: '#8A9090', marginBottom: 4 }}>
              {officer?.designation}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px',
              background: 'rgba(40,124,120,0.1)', border: '1px solid rgba(40,124,120,0.2)',
              borderRadius: 20, fontSize: 12, color: '#287C78', fontWeight: 600,
              marginBottom: 20,
            }}>
              <Shield size={11} /> {officer?.policeId}
            </div>

            <div style={{
              padding: '14px 16px',
              background: 'rgba(40,124,120,0.08)',
              border: '1px solid rgba(40,124,120,0.2)',
              borderRadius: 12,
            }}>
              <div style={{ fontSize: 11, color: '#8A9090', marginBottom: 2 }}>Last Login</div>
              <div style={{ fontSize: 13, color: '#287C78', fontWeight: 600 }}>
                {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="glass-card" style={{ padding: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#202421', marginBottom: 14 }}>
              Activity Summary
            </div>
            {[
              { label: 'Cases Uploaded', value: officer?.casesUploaded || 168, color: '#287C78' },
              { label: 'Cases Processed', value: officer?.casesProcessed || 145, color: '#287C78' },
              { label: 'Reviews Completed', value: officer?.reviewsCompleted || 132, color: '#287C78' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(32,36,33,0.1)' }}>
                <span style={{ fontSize: 12.5, color: '#5A6060' }}>{s.label}</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Badge */}
          <div className="glass-card" style={{ padding: 22, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>ðŸ…</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#202421', marginBottom: 4 }}>Active Investigator</div>
            <div style={{ fontSize: 11, color: '#8A9090' }}>Awarded for 100+ cases processed</div>
          </div>
        </div>

        {/* Right: Profile details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="glass-card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#202421', fontFamily: 'Poppins' }}>
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
                    style={{ padding: '7px 14px', background: 'none', border: '1px solid rgba(32,36,33,0.1)', borderRadius: 9, fontSize: 12.5, color: '#5A6060', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
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
                style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, padding: '10px 14px', background: 'rgba(40,124,120,0.1)', border: '1px solid rgba(40,124,120,0.2)', borderRadius: 10 }}
              >
                <CheckCircle size={14} color="#287C78" />
                <span style={{ fontSize: 13, color: '#287C78' }}>Profile updated successfully!</span>
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
                  <label style={{ fontSize: 11.5, color: '#8A9090', fontWeight: 500, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
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
                      background: 'rgba(32,36,33,0.02)',
                      border: '1px solid rgba(32,36,33,0.1)',
                      borderRadius: 10,
                      fontSize: 13.5, color: field.editable ? '#202421' : '#5A6060',
                      fontWeight: field.editable ? 500 : 400,
                    }}>
                      {field.value || form[field.key] || officer?.[field.key] || 'â€”'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Security section */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#202421', fontFamily: 'Poppins', marginBottom: 18 }}>
              Security Settings
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                style={{
                  flex: 1, padding: '12px 16px',
                  background: 'rgba(40,124,120,0.08)', border: '1px solid rgba(40,124,120,0.2)',
                  borderRadius: 12, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}
              >
                <Lock size={16} color="#287C78" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#202421' }}>Change Password</div>
                  <div style={{ fontSize: 11, color: '#8A9090' }}>Last changed 90 days ago</div>
                </div>
              </button>
              <button
                onClick={logout}
                style={{
                  flex: 1, padding: '12px 16px',
                  background: 'rgba(201,76,76,0.08)', border: '1px solid rgba(201,76,76,0.25)',
                  borderRadius: 12, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}
              >
                <Shield size={16} color="#C94C4C" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#C94C4C' }}>Sign Out</div>
                  <div style={{ fontSize: 11, color: '#8A9090' }}>End current session</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

