/**
 * ReportGenerator — Generates and downloads an HTML investigation report.
 * Design: Liquid Crystal Glass — Black & White
 */
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const B = { fontFamily: "'Inter', system-ui, sans-serif" };

export default function ReportGenerator({ result }) {
  const generateReport = () => {
    if (!result) return;

    const { summary, suspicious_accounts, fraud_rings } = result;
    const timestamp = new Date().toLocaleString();

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fraud Investigation Report — ${timestamp}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',system-ui,sans-serif; background:#000; color:#e2e8f0; padding:40px; }
  .container { max-width:900px; margin:0 auto; }
  h1 { font-size:28px; color:#ffffff; margin-bottom:8px; }
  h2 { font-size:20px; color:rgba(255,255,255,0.6); margin:32px 0 16px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px; }
  .subtitle { color:rgba(255,255,255,0.3); font-size:14px; margin-bottom:32px; }
  .summary-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin:24px 0; }
  .stat-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:20px; text-align:center; }
  .stat-value { font-size:32px; font-weight:bold; color:#fff; }
  .stat-label { font-size:12px; color:rgba(255,255,255,0.25); text-transform:uppercase; margin-top:4px; }
  table { width:100%; border-collapse:collapse; margin:16px 0; }
  th { background:rgba(255,255,255,0.03); color:rgba(255,255,255,0.3); text-align:left; padding:12px; font-size:13px; text-transform:uppercase; }
  td { padding:12px; border-bottom:1px solid rgba(255,255,255,0.03); font-size:14px; color:rgba(255,255,255,0.5); }
  .score-high { color:#fff; font-weight:bold; }
  .score-med { color:rgba(255,255,255,0.6); font-weight:bold; }
  .pattern-tag { display:inline-block; background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.5); padding:2px 8px; border-radius:20px; font-size:11px; margin:2px; border:1px solid rgba(255,255,255,0.06); }
  .ring-tag { color:rgba(255,255,255,0.5); font-weight:600; font-family:monospace; }
  .footer { margin-top:48px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.04); color:rgba(255,255,255,0.15); font-size:12px; text-align:center; }
  @media print { body { background:#fff; color:#1e293b; }
    .stat-card, th { background:#f1f5f9; border-color:#e2e8f0; }
    td { border-color:#e2e8f0; }
    .score-high { color:#111; } .score-med { color:#333; }
    .pattern-tag { background:#f1f5f9; color:#333; }
  }
</style>
</head>
<body>
<div class="container">
  <h1>Fraud Investigation Report</h1>
  <p class="subtitle">Generated: ${timestamp} • Quantara Detection Engine</p>

  <h2>Summary</h2>
  <div class="summary-grid">
    <div class="stat-card"><div class="stat-value">${summary.total_accounts_analyzed}</div><div class="stat-label">Accounts Analyzed</div></div>
    <div class="stat-card"><div class="stat-value">${summary.suspicious_accounts_flagged}</div><div class="stat-label">Suspicious Flagged</div></div>
    <div class="stat-card"><div class="stat-value">${summary.fraud_rings_detected}</div><div class="stat-label">Fraud Rings</div></div>
    <div class="stat-card"><div class="stat-value">${summary.processing_time_seconds}s</div><div class="stat-label">Processing Time</div></div>
  </div>

  <h2>Suspicious Accounts (${suspicious_accounts.length})</h2>
  <table>
    <thead><tr><th>Account ID</th><th>Score</th><th>Ring</th><th>Detected Patterns</th></tr></thead>
    <tbody>
      ${suspicious_accounts.map(a => `<tr>
        <td style="font-family:monospace;color:rgba(255,255,255,0.5)">${a.account_id}</td>
        <td class="${a.suspicion_score >= 80 ? 'score-high' : 'score-med'}">${a.suspicion_score}</td>
        <td class="ring-tag">${a.ring_id || '—'}</td>
        <td>${(a.detected_patterns || []).map(p => `<span class="pattern-tag">${p}</span>`).join(' ')}</td>
      </tr>`).join('')}
    </tbody>
  </table>

  <h2>Fraud Rings (${fraud_rings.length})</h2>
  <table>
    <thead><tr><th>Ring ID</th><th>Members</th><th>Type</th><th>Risk Score</th></tr></thead>
    <tbody>
      ${fraud_rings.map(r => `<tr>
        <td class="ring-tag">${r.ring_id}</td>
        <td>${r.member_accounts.map(m => `<span class="pattern-tag">${m}</span>`).join(' ')}</td>
        <td>${r.pattern_type}</td>
        <td class="${r.risk_score >= 80 ? 'score-high' : 'score-med'}">${r.risk_score}</td>
      </tr>`).join('')}
    </tbody>
  </table>

  <div class="footer">
    Quantara — Graph-Based Financial Crime Detection System<br>
    This report is auto-generated. Verify findings before taking action.
  </div>
</div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fraud_report_${new Date().toISOString().slice(0, 10)}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(255,255,255,0.06)' }}
      whileTap={{ scale: 0.97 }}
      onClick={generateReport}
      disabled={!result}
      className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white text-black hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]"
      style={B}
    >
      <FileText size={14} />
      <span>Generate Report</span>
    </motion.button>
  );
}
