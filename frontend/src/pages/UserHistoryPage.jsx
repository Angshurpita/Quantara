/**
 * UserHistoryPage — Liquid Crystal Glass Design
 * Black & White monochrome aesthetic
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Clock, ArrowLeft, LogOut, FileText, Activity, User, Search, Filter,
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

import { getUserHistory } from '../firebase/firestore';

const H = { fontFamily: "'Inter', system-ui, sans-serif" };
const B = { fontFamily: "'Inter', system-ui, sans-serif" };

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

export default function UserHistoryPage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAction, setFilterAction] = useState('all');

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user?.uid) { setLoading(false); return; }
            try {
                const entries = await getUserHistory(user.uid);
                // Normalize field names for backward compatibility
                setHistory(entries.map(e => ({
                    ...e,
                    file_name: e.fileName || e.file_name || '',
                    timestamp: e.timestamp?.toDate?.() ? e.timestamp.toDate().toISOString() : e.timestamp,
                })));
            } catch (err) {
                console.error('Failed to fetch history:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user?.uid]);

    const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

    const filteredHistory = history.filter((h) => {
        const matchSearch = !searchTerm ||
            (h.file_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.action.toLowerCase().includes(searchTerm.toLowerCase());
        const matchFilter = filterAction === 'all' || h.action === filterAction;
        return matchSearch && matchFilter;
    });

    const uniqueActions = [...new Set(history.map((h) => h.action))];

    return (
        <div className="min-h-screen bg-black text-white" style={B}>
            {/* Crystal background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="crystal-bg-orb" style={{ width: 500, height: 500, top: '-10%', left: '-5%' }} />
                <div className="crystal-bg-orb" style={{ width: 400, height: 400, bottom: '-10%', right: '-5%', animationDelay: '-8s' }} />
            </div>

            <div className="relative z-10">
                {/* Nav */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sticky top-0 z-40 border-b border-white/[0.06]"
                    style={{ backdropFilter: 'blur(24px)', background: 'rgba(0,0,0,0.7)' }}>
                    <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                                <Clock size={14} className="text-white/40" />
                            </div>
                            <div>
                                <h1 className="text-base font-bold text-white" style={H}>My History</h1>
                                <p className="text-[10px] text-white/20 tracking-wider uppercase">Upload & Activity Log</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs text-white/30 hover:text-white/60 rounded-xl transition-all cursor-pointer
                           bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12]"
                                style={B}>
                                <ArrowLeft size={13} /> Dashboard
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="p-2 text-red-400/50 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all cursor-pointer">
                                <LogOut size={14} />
                            </motion.button>
                        </div>
                    </div>
                </motion.header>

                <main className="max-w-5xl mx-auto px-6 py-8">
                    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">
                        {/* Header */}
                        <motion.div variants={fadeUp}>
                            <h2 className="text-2xl font-bold text-white" style={H}>Activity History</h2>
                            <p className="text-sm text-white/25 mt-0.5" style={B}>{history.length} total actions</p>
                        </motion.div>

                        {/* Stats */}
                        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                                { label: 'Total Actions', value: history.length },
                                { label: 'Uploads', value: history.filter(h => h.action === 'upload_csv').length },
                                { label: 'Logins', value: history.filter(h => h.action === 'login').length },
                            ].map((stat, i) => (
                                <motion.div key={stat.label}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.05 }}
                                    whileHover={{ y: -2 }}
                                    className="rounded-xl p-4 relative overflow-hidden cursor-default
                             bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1]
                             transition-all duration-300"
                                    style={{ backdropFilter: 'blur(12px)' }}>
                                    <div className="absolute top-0 left-0 right-0 h-[1px]"
                                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
                                    <p className="text-xl font-bold text-white" style={H}>{stat.value}</p>
                                    <p className="text-[10px] text-white/20 uppercase tracking-wider mt-0.5" style={B}>{stat.label}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Search & Filter */}
                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search size={14} className="absolute left-3.5 top-3 text-white/20" />
                                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by file name or action..."
                                    className="w-full rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none transition-all
                             placeholder-white/15 bg-white/[0.03] border border-white/[0.06]
                             focus:border-white/[0.15] focus:shadow-[0_0_20px_rgba(255,255,255,0.02)]"
                                    style={B} />
                            </div>
                            <div className="relative">
                                <Filter size={13} className="absolute left-3 top-3 text-white/20" />
                                <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)}
                                    className="rounded-xl py-2.5 pl-9 pr-8 text-white text-sm focus:outline-none transition-all
                             appearance-none cursor-pointer bg-white/[0.03] border border-white/[0.06]"
                                    style={B}>
                                    <option value="all" style={{ background: '#000' }}>All Actions</option>
                                    {uniqueActions.map(a => (
                                        <option key={a} value={a} style={{ background: '#000' }}>{a.replace(/_/g, ' ')}</option>
                                    ))}
                                </select>
                            </div>
                        </motion.div>

                        {/* Table */}
                        {loading ? (
                            <motion.div variants={fadeUp} className="text-center py-20">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                    className="w-8 h-8 border-2 border-white/10 border-t-white/50 rounded-full mx-auto mb-3" />
                                <p className="text-white/25 text-sm" style={B}>Loading history...</p>
                            </motion.div>
                        ) : (
                            <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden"
                                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr>
                                                {['Action', 'File', 'Details', 'Timestamp'].map((h, i) => (
                                                    <th key={i} className="px-5 py-3.5 text-left text-[11px] uppercase tracking-wider font-semibold text-white/25"
                                                        style={{ background: 'rgba(255,255,255,0.02)', ...B, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredHistory.map((h, i) => (
                                                <motion.tr key={h.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.03 }}
                                                    className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium
                                             bg-white/[0.04] text-white/50 border border-white/[0.06]">
                                                            {h.action.replace(/_/g, ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3.5 text-white/40 text-sm" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', ...B }}>
                                                        {h.file_name || '—'}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-white/20 text-xs max-w-xs truncate" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', ...B }}>
                                                        {h.details || '—'}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-white/20 text-xs" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', ...B }}>
                                                        {h.timestamp ? new Date(h.timestamp).toLocaleString() : 'N/A'}
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {filteredHistory.length === 0 && (
                                    <div className="text-center py-16">
                                        <Clock size={36} className="mx-auto mb-3 text-white/10" />
                                        <p className="text-white/20 text-sm" style={B}>
                                            {history.length === 0 ? 'No activity yet — start by uploading a CSV!' : 'No results match your filter'}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                </main>

                <footer className="border-t border-white/[0.04] mt-8">
                    <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
                        <img src="/logo.png" alt="Quantara" className="h-6 w-auto object-contain opacity-30" />
                        <span className="text-white/10 text-[10px]" style={B}>Quantara — Financial Crime Detection</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
