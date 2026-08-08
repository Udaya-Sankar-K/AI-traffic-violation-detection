import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, AlertCircle, Eye } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { MOCK_VIOLATIONS, SEVERITY_CONFIG, ALL_VIOLATION_TYPE_NAMES, VIOLATION_META } from '../utils/mockData';

const ITEMS_PER_PAGE = 6;

const STATUS_STYLES = {
  Pending: { color: '#C9824B', bg: 'rgba(201,130,75,0.1)', border: 'rgba(201,130,75,0.25)' },
  Confirmed: { color: '#C94C4C', bg: 'rgba(201,76,76,0.1)', border: 'rgba(201,76,76,0.25)' },
  Resolved: { color: '#287C78', bg: 'rgba(40,124,120,0.1)', border: 'rgba(40,124,120,0.25)' },
  'Action Taken': { color: '#287C78', bg: 'rgba(40,124,120,0.1)', border: 'rgba(40,124,120,0.25)' },
};

export default function RecordsPage() {
  const [search,         setSearch]         = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterType,     setFilterType]     = useState('All');
  const [filterStatus,   setFilterStatus]   = useState('All');
  const [sortBy,         setSortBy]         = useState('timestamp');
  const [sortDir,        setSortDir]        = useState('desc');
  const [page,           setPage]           = useState(1);

  const filtered = useMemo(() => {
    let data = [...MOCK_VIOLATIONS];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(v =>
        v.id.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q) ||
        v.officerName.toLowerCase().includes(q) ||
        v.plateNumber?.toLowerCase().includes(q) ||
        v.location?.toLowerCase().includes(q)
      );
    }
    if (filterSeverity !== 'All') data = data.filter(v => v.severity === filterSeverity);
    if (filterType !== 'All')     data = data.filter(v => v.type === filterType);
    if (filterStatus !== 'All')   data = data.filter(v => v.status === filterStatus);
    data.sort((a, b) => {
      let av = a[sortBy], bv = b[sortBy];
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [search, filterSeverity, filterType, filterStatus, sortBy, sortDir]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
    setPage(1);
  };

  return (
    <AppLayout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#202421', fontFamily: 'Poppins', marginBottom: 4 }}>
              Violation Records
            </h2>
            <p style={{ fontSize: 13, color: '#8A9090' }}>
              {filtered.length} records found
            </p>
          </div>
          <div style={{ display: 'flex', gap: 6, fontSize: 12 }}>
            {['Total', 'Pending', 'Confirmed', 'Resolved'].map((s, i) => (
              <div key={s} style={{
                padding: '6px 14px',
                background: '#FFFFFF',
                border: '1px solid rgba(32,36,33,0.1)',
                borderRadius: 10,
                color: '#5A6060',
              }}>
                <span style={{ color: '#202421', fontWeight: 700 }}>
                  {i === 0 ? MOCK_VIOLATIONS.length : MOCK_VIOLATIONS.filter(v => v.status === s).length}
                </span> {s}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ flex: '1 1 220px', position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#8A9090' }} />
          <input
            className="input-field"
            placeholder="Search by ID, type, officer, plate, locationâ€¦"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ paddingLeft: 38 }}
          />
        </div>

        {/* Violation Type filter */}
        <select
          className="input-field"
          value={filterType}
          onChange={e => { setFilterType(e.target.value); setPage(1); }}
          style={{ width: 210, cursor: 'pointer' }}
        >
          <option value="All">All Violation Types</option>
          {ALL_VIOLATION_TYPE_NAMES.map(t => (
            <option key={t} value={t}>{VIOLATION_META[t]?.icon} {t}</option>
          ))}
        </select>

        {/* Severity filter */}
        <select
          className="input-field"
          value={filterSeverity}
          onChange={e => { setFilterSeverity(e.target.value); setPage(1); }}
          style={{ width: 140, cursor: 'pointer' }}
        >
          <option value="All">All Severity</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>

        {/* Status filter */}
        <select
          className="input-field"
          value={filterStatus}
          onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
          style={{ width: 140, cursor: 'pointer' }}
        >
          <option value="All">All Status</option>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Resolved</option>
          <option>Action Taken</option>
        </select>
      </div>

      {/* Active filter chips */}
      {(filterType !== 'All' || filterSeverity !== 'All' || filterStatus !== 'All') && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          {filterType !== 'All' && (
            <span style={{ padding: '4px 12px', background: 'rgba(40,124,120,0.08)', border: '1px solid rgba(40,124,120,0.2)', borderRadius: 20, fontSize: 12, color: '#287C78', display: 'flex', alignItems: 'center', gap: 5 }}>
              {VIOLATION_META[filterType]?.icon} {filterType}
              <button onClick={() => setFilterType('All')} style={{ background: 'none', border: 'none', color: '#8A9090', cursor: 'pointer', padding: 0, fontSize: 14, lineHeight: 1 }}>Ã—</button>
            </span>
          )}
          {filterSeverity !== 'All' && (
            <span style={{ padding: '4px 12px', background: 'rgba(201,76,76,0.1)', border: '1px solid rgba(201,76,76,0.25)', borderRadius: 20, fontSize: 12, color: '#C94C4C', display: 'flex', alignItems: 'center', gap: 5 }}>
              Severity: {filterSeverity}
              <button onClick={() => setFilterSeverity('All')} style={{ background: 'none', border: 'none', color: '#8A9090', cursor: 'pointer', padding: 0, fontSize: 14, lineHeight: 1 }}>Ã—</button>
            </span>
          )}
          {filterStatus !== 'All' && (
            <span style={{ padding: '4px 12px', background: 'rgba(40,124,120,0.08)', border: '1px solid rgba(40,124,120,0.2)', borderRadius: 20, fontSize: 12, color: '#287C78', display: 'flex', alignItems: 'center', gap: 5 }}>
              Status: {filterStatus}
              <button onClick={() => setFilterStatus('All')} style={{ background: 'none', border: 'none', color: '#8A9090', cursor: 'pointer', padding: 0, fontSize: 14, lineHeight: 1 }}>Ã—</button>
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                {[
                  { label: 'Record ID', key: 'id' },
                  { label: 'Violation Type', key: 'type' },
                  { label: 'Severity', key: 'severity' },
                  { label: 'Date & Time', key: 'timestamp' },
                  { label: 'Confidence', key: 'confidence' },
                  { label: 'Officer', key: 'officerName' },
                  { label: 'Status', key: 'status' },
                  { label: '', key: null },
                ].map(col => (
                  <th
                    key={col.label}
                    onClick={() => col.key && toggleSort(col.key)}
                    style={{ cursor: col.key ? 'pointer' : 'default', userSelect: 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      {col.label}
                      {sortBy === col.key && (
                        <span style={{ color: '#287C78' }}>{sortDir === 'asc' ? 'â†‘' : 'â†“'}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((v, i) => {
                const sev = SEVERITY_CONFIG[v.severity];
                const sta = STATUS_STYLES[v.status];
                return (
                  <motion.tr
                    key={v.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <td>
                      <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#287C78' }}>{v.id}</div>
                      {v.repeatOffender && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3, fontSize: 10, color: '#C94C4C' }}>
                          <AlertCircle size={9} /> Repeat Offender
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 15 }}>{VIOLATION_META[v.type]?.icon ?? 'âš ï¸'}</span>
                        <div>
                          <div style={{ fontSize: 12.5, color: '#202421', fontWeight: 600 }}>{v.type}</div>
                          {v.subViolations?.length > 0 && (
                            <div style={{ display: 'flex', gap: 4, marginTop: 3, flexWrap: 'wrap' }}>
                              {v.subViolations.slice(0, 2).map(sv => (
                                <span key={sv} style={{ fontSize: 9.5, padding: '1px 6px', background: 'rgba(201,76,76,0.1)', border: '1px solid rgba(201,76,76,0.25)', borderRadius: 8, color: '#C94C4C' }}>{sv}</span>
                              ))}
                              {v.subViolations.length > 2 && <span style={{ fontSize: 9.5, color: '#8A9090' }}>+{v.subViolations.length - 2}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${v.severity === 'Critical' ? 'badge-red' : v.severity === 'High' ? 'badge-red' : v.severity === 'Medium' ? 'badge-orange' : 'badge-green'}`}>
                        {v.severity}
                      </span>
                    </td>
                    <td style={{ fontSize: 12 }}>
                      <div style={{ color: '#202421' }}>{new Date(v.timestamp).toLocaleDateString('en-IN')}</div>
                      <div style={{ color: '#8A9090' }}>{new Date(v.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 60 }}>
                          <div className="progress-fill" style={{ width: `${v.confidence}%` }} />
                        </div>
                        <span style={{ fontSize: 12, color: '#287C78', fontWeight: 600 }}>{v.confidence}%</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12.5, color: '#202421' }}>{v.officerName}</div>
                      <div style={{ fontSize: 10.5, color: '#8A9090' }}>{v.officerId}</div>
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 12px', borderRadius: 20,
                        fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                        background: sta?.bg, color: sta?.color,
                        border: `1px solid ${sta?.border}`,
                      }}>
                        {v.status}
                      </span>
                    </td>
                    <td>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A9090', padding: '4px 8px' }}>
                        <Eye size={15} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(32,36,33,0.1)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ fontSize: 12, color: '#8A9090' }}>
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}â€“{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} records
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                width: 32, height: 32, background: '#FFFFFF',
                border: '1px solid rgba(32,36,33,0.1)', borderRadius: 8,
                cursor: page === 1 ? 'not-allowed' : 'pointer', color: '#8A9090',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: page === 1 ? 0.4 : 1,
              }}
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                style={{
                  width: 32, height: 32,
                  background: page === i + 1 ? '#287C78' : '#FFFFFF',
                  border: `1px solid ${page === i + 1 ? '#287C78' : 'rgba(32,36,33,0.1)'}`,
                  borderRadius: 8, cursor: 'pointer',
                  fontSize: 13, fontWeight: 600,
                  color: page === i + 1 ? '#FFFFFF' : '#8A9090',
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                width: 32, height: 32, background: '#FFFFFF',
                border: '1px solid rgba(32,36,33,0.1)', borderRadius: 8,
                cursor: page === totalPages ? 'not-allowed' : 'pointer', color: '#8A9090',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: page === totalPages ? 0.4 : 1,
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}


