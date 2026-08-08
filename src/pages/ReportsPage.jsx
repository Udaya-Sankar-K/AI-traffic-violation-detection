import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileBarChart, Download, Calendar, FileText, Table2, CheckCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import AppLayout from '../components/layout/AppLayout';
import { MOCK_VIOLATIONS } from '../utils/mockData';

const REPORT_TYPES = [
  { id: 'daily', label: 'Daily Report', icon: Calendar, desc: 'Today\'s violation summary', color: '#287C78' },
  { id: 'weekly', label: 'Weekly Report', icon: FileText, desc: 'Last 7 days statistics', color: '#287C78' },
  { id: 'monthly', label: 'Monthly Report', icon: Table2, desc: 'Full month analysis', color: '#287C78' },
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
        doc.text(`â€¢ ${v.id} | ${v.type} | ${v.severity} | ${v.confidence}% | ${v.status}`, 25, y);
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
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#202421', fontFamily: 'Poppins', marginBottom: 4 }}>
          Reports
        </h2>
        <p style={{ fontSize: 13, color: '#8A9090' }}>Generate and export violation reports</p>
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
              border: `1px solid ${selected === r.id ? r.color + '40' : 'rgba(32,36,33,0.1)'}`,
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
            <div style={{ fontSize: 14, fontWeight: 700, color: '#202421', marginBottom: 4 }}>{r.label}</div>
            <div style={{ fontSize: 12, color: '#8A9090' }}>{r.desc}</div>
            {selected === r.id && (
              <div style={{ marginTop: 10, fontSize: 11, color: r.color, fontWeight: 600 }}>âœ“ Selected</div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Report preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#202421', marginBottom: 18 }}>
            Report Preview â€” {REPORT_TYPES.find(r => r.id === selected)?.label}
          </div>

          {/* Preview content */}
          <div style={{ background: 'rgba(32,36,33,0.02)', borderRadius: 12, padding: 20, border: '1px solid rgba(32,36,33,0.05)' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#202421', marginBottom: 4, fontFamily: 'Poppins' }}>
              Traffic Violation Detection System
            </div>
            <div style={{ fontSize: 12, color: '#8A9090', marginBottom: 16 }}>
              {REPORT_TYPES.find(r => r.id === selected)?.label} â€¢ Generated {new Date().toLocaleDateString('en-IN')}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
              {[
                ['Total Cases', MOCK_VIOLATIONS.length],
                ['Pending', MOCK_VIOLATIONS.filter(v => v.status === 'Pending').length],
                ['Resolved', MOCK_VIOLATIONS.filter(v => v.status === 'Resolved').length],
                ['Avg. Conf.', '91.4%'],
              ].map(([k, v]) => (
                <div key={k} style={{ textAlign: 'center', padding: '10px 8px', background: 'rgba(40,124,120,0.08)', borderRadius: 8, border: '1px solid rgba(40,124,120,0.15)' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#287C78' }}>{v}</div>
                  <div style={{ fontSize: 10, color: '#8A9090', marginTop: 2 }}>{k}</div>
                </div>
              ))}
            </div>

            {/* Mini table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr>
                  {['Record ID', 'Type', 'Severity', 'Conf.', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '6px 8px', color: '#8A9090', borderBottom: '1px solid rgba(32,36,33,0.1)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_VIOLATIONS.slice(0, 5).map(v => (
                  <tr key={v.id}>
                    <td style={{ padding: '7px 8px', color: '#287C78', fontFamily: 'monospace', fontSize: 10 }}>{v.id}</td>
                    <td style={{ padding: '7px 8px', color: '#202421' }}>{v.type}</td>
                    <td style={{ padding: '7px 8px' }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: v.severity === 'High' || v.severity === 'Critical' ? '#C94C4C' : v.severity === 'Medium' ? '#C9824B' : '#287C78' }}>
                        {v.severity}
                      </span>
                    </td>
                    <td style={{ padding: '7px 8px', color: '#287C78', fontWeight: 600 }}>{v.confidence}%</td>
                    <td style={{ padding: '7px 8px', color: '#5A6060' }}>{v.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: 10, color: '#8A9090', marginTop: 8 }}>
              + {MOCK_VIOLATIONS.length - 5} more records in full report
            </div>
          </div>
        </div>

        {/* Export panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="glass-card" style={{ padding: 22 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#202421', marginBottom: 16 }}>Export Report</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { format: 'pdf', label: 'Download PDF', icon: FileBarChart, color: '#C94C4C', desc: 'Printable, court-ready format' },
                { format: 'excel', label: 'Download CSV/Excel', icon: Table2, color: '#287C78', desc: 'Spreadsheet for analysis' },
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
                    <CheckCircle size={20} color="#287C78" />
                  ) : (
                    <opt.icon size={20} color={opt.color} />
                  )}
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#202421' }}>
                      {generating ? 'Generating...' : generated === opt.format ? 'Downloaded!' : opt.label}
                    </div>
                    <div style={{ fontSize: 11, color: '#8A9090' }}>{opt.desc}</div>
                  </div>
                  {!generating && <Download size={14} color={opt.color} style={{ marginLeft: 'auto' }} />}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Report info */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#202421', marginBottom: 12 }}>Report Contents</div>
            {[
              'Executive Summary',
              'Violation Breakdown by Type',
              'Severity Distribution',
              'Officer Performance Data',
              'Hotspot Analysis',
              'Full Violation Records',
              'Evidence Authenticity Log',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 12, color: '#5A6060' }}>
                <CheckCircle size={12} color="#287C78" /> {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

