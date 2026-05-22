/**
 * ExportCSV — Download suspicious accounts as CSV.
 * Design: Liquid Crystal Glass — Black & White
 */
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

const B = { fontFamily: "'Inter', system-ui, sans-serif" };

export default function ExportCSV({ accounts }) {
    const handleExport = () => {
        if (!accounts || accounts.length === 0) return;

        const headers = ['Account ID', 'Suspicion Score', 'Ring ID', 'Detected Patterns'];
        const rows = accounts.map(a => [
            a.account_id,
            a.suspicion_score,
            a.ring_id || '',
            (a.detected_patterns || []).join('; '),
        ]);

        const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `suspicious_accounts_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(255,255,255,0.06)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExport}
            disabled={!accounts?.length}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)',
                ...B,
            }}
        >
            <Download size={14} />
            <span>Export CSV</span>
        </motion.button>
    );
}
