/**
 * FraudRingsTable — Table of detected fraud rings.
 * Design: Liquid Crystal Glass — Black & White
 */
import { motion } from 'framer-motion';
import { Link2 } from 'lucide-react';

const H = { fontFamily: "'Inter', system-ui, sans-serif" };
const B = { fontFamily: "'Inter', system-ui, sans-serif" };

export default function FraudRingsTable({ rings }) {
    const getScoreStyle = (score) => {
        if (score >= 80) return { bg: 'rgba(255,255,255,0.08)', color: '#ffffff', border: 'rgba(255,255,255,0.15)' };
        if (score >= 60) return { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: 'rgba(255,255,255,0.1)' };
        return { bg: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.06)' };
    };

    if (!rings || rings.length === 0) return null;

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
            <div className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />

            <div className="p-6">
                <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <Link2 size={14} className="text-white/40" />
                    </div>
                    <h2 className="text-lg font-bold text-white" style={H}>
                        Fraud Rings Detected ({rings.length})
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                {['Ring ID', 'Members', 'Pattern', 'Risk Score'].map((label, i) => (
                                    <th key={i} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-white/30"
                                        style={{ background: 'rgba(255,255,255,0.02)', ...B, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        {label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rings.map((ring) => {
                                const scoreStyle = getScoreStyle(ring.risk_score);
                                return (
                                    <tr key={ring.ring_id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-4 py-3 font-mono font-bold text-sm text-white/50" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            {ring.ring_id}
                                        </td>
                                        <td className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            <div className="flex flex-wrap gap-1">
                                                {ring.member_accounts.map((acc) => (
                                                    <span key={acc} className="inline-block text-[11px] font-mono px-2 py-0.5 rounded-full"
                                                        style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                                        {acc}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            <span className="inline-block text-[11px] capitalize px-2 py-0.5 rounded-full"
                                                style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                                {ring.pattern_type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold"
                                                style={{ background: scoreStyle.bg, color: scoreStyle.color, border: `1px solid ${scoreStyle.border}` }}>
                                                {ring.risk_score}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
