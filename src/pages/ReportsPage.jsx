import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileBarChart, Download, Calendar, FileText, Table2, CheckCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import AppLayout from '../components/layout/AppLayout';
import { MOCK_VIOLATIONS } from '../utils/mockData';

const REPORT_TYPES = [
  { id: 'daily', label: 'Daily Report', icon: Calendar, desc: 'Today\'s violation summary', color: '#2563EB' },
  { id: 'weekly', label: 'Weekly Report', icon: FileText, desc: 'Last 7 days statistics', color: '#06B6D4' },
  { id: 'monthly', label: 'Monthly Report', icon: Table2, desc: 'Full month analysis', color: '#22C55E' },
];

export default function ReportsPage() {
  const [selected, setSelected] = useState('daily');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState('');

  const handleGenerate = async (format) => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1500));

    if (format === 'pdf') {
      const doc = new jsPDF();
      const title = REPORT_TYPES.find(r => r.id === selected)?.label || 'Violation Report';
      doc.setFontSize(20);
      doc.text(title, 20, 25);
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 38);
      doc.text('AI Smart Traffic Violation Detection System', 20, 48);
      doc.line(20, 54, 190, 54);

      doc.setFontSize(11);
      let y = 65;
      doc.text('Summary:', 20, y); y += 10;
      doc.text(`Total Violations: ${MOCK_VIOLATIONS.length}`, 25, y); y += 8;
      doc.text(`Pending: ${MOCK_VIOLATIONS.filter(v => v.status === 'Pending').length}`, 25, y); y += 8;
      doc.text(`Resolved: ${MOCK_VIOLATIONS.filter(v => v.status === 'Resolved').length}`, 25, y); y += 8;
      doc.text(`Avg. Confidence: 91.4%`, 25, y); y += 16;

      doc.text('Violation Records:', 20, y); y += 10;
      MOCK_VIOLATIONS.slice(0, 8).forEach(v => {
        doc.text(`• ${v.id} | ${v.type} | ${v.severity} | ${v.confidence}% | ${v.status}`, 25, y);
        y += 8;
      });

      doc.save(`TVDS-${title.replace(/ /g, '-')}-${Date.now()}.pdf`);
      setGenerated('pdf');
    } else if (format === 'excel') {
      // Create CSV as Excel alternative (xlsx needs more setup)
      const headers = ['Record ID', 'Violation Type', 'Severity', 'Confidence', 'Officer', 'Status', 'Date'];
      const rows = MOCK_VIOLATIONS.map(v => [
        v.id, v.type, v.severity, `${v.confidence}%`, v.officerName, v.status,
        new Date(v.timestamp).toLocaleDateString(),
      ]);
      const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TVDS-Report-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setGenerated('excel');
    }

    setGenerating(false);
    setTimeout(() => setGenerated(''), 3000);
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#F8FAFC', fontFamily: 'Poppins', marginBottom: 4 }}>
          Reports
        </h2>
        <p style={{ fontSize: 13, color: '#64748B' }}>Generate and export violation reports</p>
      </motion.div>

      {/* Report type selection */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {REPORT_TYPES.map(r => (
          <motion.button
            key={r.id}
            onClick={() => setSelected(r.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '22px 24px',
              background: selected === r.id ? `${r.color}12` : 'rgba(255,255,255,0.02)',
              border: `1px solid ${selected === r.id ? r.color + '40' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 16,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <div style={{
              width: 44, height: 44,
              background: `${r.color}18`,
              border: `1px solid ${r.color}30`,
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 14,
            }}>
              <r.icon size={20} color={r.color} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#F8FAFC', marginBottom: 4 }}>{r.label}</div>
            <div style={{ fontSize: 12, color: '#64748B' }}>{r.desc}</div>
            {selected === r.id && (
              <div style={{ marginTop: 10, fontSize: 11, color: r.color, fontWeight: 600 }}>✓ Selected</div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Report preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#F8FAFC', marginBottom: 18 }}>
            Report Preview — {REPORT_TYPES.find(r => r.id === selected)?.label}
          </div>

          {/* Preview content */}
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC', marginBottom: 4, fontFamily: 'Poppins' }}>
              Traffic Violation Detection System
            </div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 16 }}>
              {REPORT_TYPES.find(r => r.id === selected)?.label} • Generated {new Date().toLocaleDateString('en-IN')}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
              {[
                ['Total Cases', MOCK_VIOLATIONS.length],
                ['Pending', MOCK_VIOLATIONS.filter(v => v.status === 'Pending').length],
                ['Resolved', MOCK_VIOLATIONS.filter(v => v.status === 'Resolved').length],
                ['Avg. Conf.', '91.4%'],
              ].map(([k, v]) => (
                <div key={k} style={{ textAlign: 'center', padding: '10px 8px', background: 'rgba(37,99,235,0.08)', borderRadius: 8, border: '1px solid rgba(37,99,235,0.15)' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#2563EB' }}>{v}</div>
                  <div style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>{k}</div>
                </div>
              ))}
            </div>

            {/* Mini table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr>
                  {['Record ID', 'Type', 'Severity', 'Conf.', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '6px 8px', color: '#64748B', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_VIOLATIONS.slice(0, 5).map(v => (
                  <tr key={v.id}>
                    <td style={{ padding: '7px 8px', color: '#06B6D4', fontFamily: 'monospace', fontSize: 10 }}>{v.id}</td>
                    <td style={{ padding: '7px 8px', color: '#F8FAFC' }}>{v.type}</td>
                    <td style={{ padding: '7px 8px' }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: v.severity === 'High' || v.severity === 'Critical' ? '#EF4444' : v.severity === 'Medium' ? '#F97316' : '#22C55E' }}>
                        {v.severity}
                      </span>
                    </td>
                    <td style={{ padding: '7px 8px', color: '#22C55E', fontWeight: 600 }}>{v.confidence}%</td>
                    <td style={{ padding: '7px 8px', color: '#94A3B8' }}>{v.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: 10, color: '#475569', marginTop: 8 }}>
              + {MOCK_VIOLATIONS.length - 5} more records in full report
            </div>
          </div>
        </div>

        {/* Export panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="glass-card" style={{ padding: 22 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#F8FAFC', marginBottom: 16 }}>Export Report</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { format: 'pdf', label: 'Download PDF', icon: FileBarChart, color: '#EF4444', desc: 'Printable, court-ready format' },
                { format: 'excel', label: 'Download CSV/Excel', icon: Table2, color: '#22C55E', desc: 'Spreadsheet for analysis' },
              ].map(opt => (
                <motion.button
                  key={opt.format}
                  onClick={() => handleGenerate(opt.format)}
                  disabled={generating}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '14px 16px',
                    background: `${opt.color}10`,
                    border: `1px solid ${opt.color}30`,
                    borderRadius: 12,
                    cursor: generating ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: 12,
                    opacity: generating ? 0.6 : 1,
                  }}
                >
                  {generated === opt.format ? (
                    <CheckCircle size={20} color="#22C55E" />
                  ) : (
                    <opt.icon size={20} color={opt.color} />
                  )}
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC' }}>
                      {generating ? 'Generating...' : generated === opt.format ? 'Downloaded!' : opt.label}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>{opt.desc}</div>
                  </div>
                  {!generating && <Download size={14} color={opt.color} style={{ marginLeft: 'auto' }} />}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Report info */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC', marginBottom: 12 }}>Report Contents</div>
            {[
              'Executive Summary',
              'Violation Breakdown by Type',
              'Severity Distribution',
              'Officer Performance Data',
              'Hotspot Analysis',
              'Full Violation Records',
              'Evidence Authenticity Log',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 12, color: '#94A3B8' }}>
                <CheckCircle size={12} color="#22C55E" /> {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
