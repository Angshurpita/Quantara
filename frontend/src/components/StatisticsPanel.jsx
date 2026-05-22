/**
 * StatisticsPanel — Pie chart showing distribution of detected patterns.
 * Design: Liquid Crystal Glass — Black & White
 * Note: The pie chart retains distinct shades for readability.
 */
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart } from 'lucide-react';

const H = { fontFamily: "'Inter', system-ui, sans-serif" };
const B = { fontFamily: "'Inter', system-ui, sans-serif" };

/* Monochrome shades for chart segments — distinct enough to read */
const PATTERN_COLORS = {
    'cycle': '#ffffff',
    'fan_in': '#d4d4d4',
    'fan_out': '#a3a3a3',
    'passthrough_shell': '#8a8a8a',
    'temporal_clustering': '#737373',
    'amount_anomaly': '#5c5c5c',
    'round_amount_structuring': '#474747',
    'rapid_dormancy': '#363636',
    'layered_chain': '#c0c0c0',
    'legitimate_merchant': '#e0e0e0',
};

const PATTERN_LABELS = {
    'cycle': 'Cycles',
    'fan_in': 'Fan-In',
    'fan_out': 'Fan-Out',
    'passthrough_shell': 'Pass-Through',
    'temporal_clustering': 'Temporal Burst',
    'amount_anomaly': 'Amount Anomaly',
    'round_amount_structuring': 'Round Amounts',
    'rapid_dormancy': 'Rapid Dormancy',
    'layered_chain': 'Layered Chain',
    'legitimate_merchant': 'Merchant',
};

function normKey(p) {
    if (p.startsWith('cycle_length_')) return 'cycle';
    return p;
}

export default function StatisticsPanel({ suspiciousAccounts }) {
    const stats = useMemo(() => {
        if (!suspiciousAccounts) return [];
        const counts = {};
        suspiciousAccounts.forEach(a => {
            (a.detected_patterns || []).forEach(p => {
                const k = normKey(p);
                counts[k] = (counts[k] || 0) + 1;
            });
        });
        return Object.entries(counts)
            .map(([key, count]) => ({
                key,
                count,
                label: PATTERN_LABELS[key] || key,
                color: PATTERN_COLORS[key] || '#6b7280',
            }))
            .sort((a, b) => b.count - a.count);
    }, [suspiciousAccounts]);

    const total = stats.reduce((s, v) => s + v.count, 0);

    if (!stats.length) return null;

    const radius = 60;
    const circumference = 2 * Math.PI * radius;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden"
            style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
            }}
        >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />

            <div className="p-6">
                <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <PieChart size={14} className="text-white/40" />
                    </div>
                    <h2 className="text-lg font-bold text-white" style={H}>
                        Pattern Distribution
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Donut Chart */}
                    <div className="relative flex-shrink-0">
                        <svg width="160" height="160" viewBox="0 0 160 160">
                            {stats.map((item, index) => {
                                const pct = item.count / total;
                                const dash = circumference * pct;
                                const gap = circumference - dash;
                                const currentOffset = stats.slice(0, index).reduce((sum, prevItem) => sum + (circumference * (prevItem.count / total)), 0);

                                return (
                                    <circle
                                        key={item.key}
                                        cx="80" cy="80" r={radius}
                                        fill="none"
                                        stroke={item.color}
                                        strokeWidth="20"
                                        strokeDasharray={`${dash} ${gap}`}
                                        strokeDashoffset={-currentOffset}
                                        className="transition-all duration-500"
                                        style={{ filter: `drop-shadow(0 0 4px ${item.color}33)` }}
                                    />
                                );
                            })}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white" style={H}>{total}</p>
                                <p className="text-[10px] text-white/25 uppercase tracking-wider" style={B}>Patterns</p>
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 flex-1">
                        {stats.map((item, i) => (
                            <motion.div
                                key={item.key}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + i * 0.04 }}
                                className="flex items-center gap-2.5 group"
                            >
                                <div className="w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-transparent group-hover:ring-white/20 transition-all"
                                    style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}44` }} />
                                <span className="text-sm text-white/30 group-hover:text-white/60 transition-colors" style={B}>{item.label}</span>
                                <span className="text-sm font-bold text-white ml-auto" style={H}>{item.count}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
