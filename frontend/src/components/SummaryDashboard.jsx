/**
 * SummaryDashboard — Summary statistics cards.
 * Design: Liquid Crystal Glass — Black & White
 */
import { motion } from 'framer-motion';
import { Users, AlertTriangle, Link2, Zap } from 'lucide-react';

const H = { fontFamily: "'Inter', system-ui, sans-serif" };
const B = { fontFamily: "'Inter', system-ui, sans-serif" };

const STATS_CONFIG = [
    { key: 'total_accounts_analyzed', label: 'Total Accounts', icon: Users },
    { key: 'suspicious_accounts_flagged', label: 'Suspicious Flagged', icon: AlertTriangle },
    { key: 'fraud_rings_detected', label: 'Fraud Rings', icon: Link2 },
    { key: 'processing_time_seconds', label: 'Processing Time', icon: Zap, suffix: 's' },
];

export default function SummaryDashboard({ summary }) {
    if (!summary) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS_CONFIG.map((stat, i) => {
                const Icon = stat.icon;
                const value = summary[stat.key];

                return (
                    <motion.div
                        key={stat.key}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: i * 0.08 }}
                        whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(255,255,255,0.03)' }}
                        className="relative group rounded-2xl overflow-hidden cursor-default"
                        style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            backdropFilter: 'blur(12px)',
                        }}
                    >
                        {/* Top line */}
                        <div className="absolute top-0 left-0 right-0 h-[1px] opacity-40 group-hover:opacity-70 transition-opacity"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />

                        <div className="p-5 flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                }}>
                                <Icon size={18} className="text-white/40" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white" style={H}>
                                    {value}{stat.suffix || ''}
                                </p>
                                <p className="text-[11px] text-white/25 uppercase tracking-wider" style={B}>
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
