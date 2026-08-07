import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_OFFICER } from '../utils/mockData';

// NOTE: Firebase Auth is integrated but uses mock data for demo mode
// When Firebase is configured, real auth will be used automatically

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [officer, setOfficer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing demo session
    const savedUser = localStorage.getItem('tvds_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setOfficer(MOCK_OFFICER);
    }
    setLoading(false);
  }, []);

  const login = async (policeId, password, opts = {}) => {
    // Demo: accept any credentials with valid police ID format
    if (!policeId || !password) throw new Error('Please fill in all fields');
    if (policeId.length < 3) throw new Error('Invalid Police ID');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, opts.dryRun ? 600 : 1200));

    // dryRun = only validate, don't set state (used before face verification)
    if (opts.dryRun) return { valid: true };

    const mockUser = {
      uid: 'demo-uid',
      policeId,
      email: MOCK_OFFICER.email,
      displayName: MOCK_OFFICER.fullName,
    };

    localStorage.setItem('tvds_user', JSON.stringify(mockUser));
    localStorage.setItem('tvds_last_login', new Date().toISOString());
    setUser(mockUser);
    setOfficer({ ...MOCK_OFFICER, policeId, lastLogin: new Date().toISOString() });
    return mockUser;
  };

  const signup = async (formData) => {
    const required = ['fullName', 'policeId', 'designation', 'station', 'district', 'email', 'password'];
    for (const field of required) {
      if (!formData[field]) throw new Error(`${field} is required`);
    }
    if (formData.password !== formData.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    if (formData.password.length < 6) throw new Error('Password must be at least 6 characters');

    await new Promise(resolve => setTimeout(resolve, 1500));

    const newUser = {
      uid: `uid-${Date.now()}`,
      policeId: formData.policeId,
      email: formData.email,
      displayName: formData.fullName,
    };

    localStorage.setItem('tvds_user', JSON.stringify(newUser));
    setUser(newUser);
    setOfficer({
      ...MOCK_OFFICER,
      fullName: formData.fullName,
      policeId: formData.policeId,
      designation: formData.designation,
      station: formData.station,
      district: formData.district,
      email: formData.email,
      casesProcessed: 0,
      casesUploaded: 0,
      reviewsCompleted: 0,
    });
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('tvds_user');
    setUser(null);
    setOfficer(null);
  };

  return (
    <AuthContext.Provider value={{ user, officer, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
