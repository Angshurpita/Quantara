/**
 * DashboardPage — Liquid Crystal Glass Design
 * Black & White monochrome aesthetic
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Shield, LogOut,
    Loader2, BarChart3, ChevronRight, Clock, User,
    Maximize2, Minimize2, PanelLeftClose, PanelLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UploadCSV from '../components/UploadCSV';
import SummaryDashboard from '../components/SummaryDashboard';
import GraphVisualization from '../components/GraphVisualization';
import SuspiciousTable from '../components/SuspiciousTable';
import FraudRingsTable from '../components/FraudRingsTable';
import JsonDownload from '../components/JsonDownload';
import ReportGenerator from '../components/ReportGenerator';
import FilterDropdown from '../components/FilterDropdown';
import SearchBar from '../components/SearchBar';
import LayerToggles from '../components/LayerToggles';
import UploadHistory from '../components/UploadHistory';
import { saveHistory } from '../firebase/firestore';
import StatisticsPanel from '../components/StatisticsPanel';
import ExportCSV from '../components/ExportCSV';
import LayoutSwitcher from '../components/LayoutSwitcher';
import ThemeToggle from '../components/ThemeToggle';

const H = { fontFamily: "'Inter', system-ui, sans-serif" };
const B = { fontFamily: "'Inter', system-ui, sans-serif" };

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [riskFilter, setRiskFilter] = useState('all');
    const [cyInstance, setCyInstance] = useState(null);
    const [fullscreenGraph, setFullscreenGraph] = useState(false);
    const [fsCyInstance, setFsCyInstance] = useState(null);
    const [fsSidebarOpen, setFsSidebarOpen] = useState(true);

    /* ESC key to exit fullscreen */
    const handleEsc = useCallback((e) => {
        if (e.key === 'Escape') setFullscreenGraph(false);
    }, []);
    useEffect(() => {
        if (fullscreenGraph) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [fullscreenGraph, handleEsc]);

    const handleResult = (data) => setResult(data);
    const handleUploadResult = (data, fileName) => {
        setResult(data);
        // Save to Firestore for authenticated users
        if (user && user.role !== 'guest' && user.uid) {
            saveHistory(user.uid, {
                action: 'upload_csv',
                fileName: fileName || 'uploaded.csv',
                details: `Analyzed ${data.summary?.total_accounts_analyzed || 0} accounts`,
                summary: data.summary,
                result: data,
            }).catch(err => console.warn('Failed to save history to Firestore:', err));
        }
    };
    const handleLogout = () => { logout(); navigate('/', { replace: true }); };

    const filteredAccounts = (() => {
        if (!result?.suspicious_accounts) return [];
        const accts = result.suspicious_accounts;
        switch (riskFilter) {
            case 'high': return accts.filter(a => a.suspicion_score >= 80);
            case 'medium': return accts.filter(a => a.suspicion_score >= 60 && a.suspicion_score < 80);
            case 'low': return accts.filter(a => a.suspicion_score < 60);
            default: return accts;
        }
    })();

    const btnClass = `flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl border transition-all cursor-pointer`;

    return (
        <div className="min-h-screen bg-black text-white" style={B}>
            {/* Crystal background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="crystal-bg-orb" style={{ width: 500, height: 500, top: '-10%', left: '-5%' }} />
                <div className="crystal-bg-orb" style={{ width: 400, height: 400, bottom: '-10%', right: '-5%', animationDelay: '-8s' }} />
            </div>

            {/* Nav */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="sticky top-0 z-50"
                style={{
                    backdropFilter: 'blur(24px)',
                    background: 'var(--lcg-header)',
                    borderBottom: '1px solid var(--lcg-line-6)',
                }}>
                <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
                    {/* Left */}
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/')}
                            className={`${btnClass} text-white/30 hover:text-white/60 bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12]`}
                            style={B}>
                            <ArrowLeft size={14} /> <span>Home</span>
                        </motion.button>
                        <img src="/logo.png" alt="Quantara" className="h-10 w-auto object-contain opacity-70" />
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-2">
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/profile')}
                            className={`${btnClass} bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12]`}>
                            <div className="w-6 h-6 rounded-md bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-white/50 text-[10px] font-bold">
                                {user?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <span className="text-sm text-white/40 hidden sm:inline" style={B}>{user?.username}</span>
                        </motion.button>

                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/history')}
                            className={`${btnClass} text-white/30 bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12]`}
                            title="History" style={B}>
                            <Clock size={12} /> <span className="hidden sm:inline">History</span>
                        </motion.button>

                        {user?.role === 'admin' && (
                            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                onClick={() => navigate('/admin')}
                                className={`${btnClass} text-white/40 bg-white/[0.05] border-white/[0.08] hover:border-white/[0.15]`}
                                style={B}>
                                <Shield size={12} /> <span className="hidden sm:inline">Admin</span>
                            </motion.button>
                        )}

                        <UploadHistory onLoadResult={handleResult} />
                        <ThemeToggle />

                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            onClick={handleLogout}
                            className={`${btnClass} text-red-400/60 bg-red-500/5 border-red-500/10 hover:bg-red-500/10 hover:border-red-500/20`}
                            title="Logout" style={B}>
                            <LogOut size={12} /> <span className="hidden sm:inline">Logout</span>
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            {/* Main */}
            <main className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8 py-8">
                {/* Upload */}
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }} className="max-w-2xl mx-auto mb-10">
                    <UploadCSV onResult={(data) => handleUploadResult(data)} onLoading={setLoading} firebaseUser={user?.firebaseUser} />
                </motion.section>

                {/* Loading */}
                {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] mb-5">
                            <Loader2 size={28} className="text-white/40" />
                        </motion.div>
                        <p className="text-white/60 font-semibold text-lg" style={H}>Analyzing transaction graph…</p>
                        <p className="text-white/25 text-sm mt-1" style={B}>Running fraud detection algorithms</p>
                    </motion.div>
                )}

                {/* Results */}
                {result && !loading && (
                    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
                        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                                    <BarChart3 size={16} className="text-white/40" />
                                </div>
                                <h2 className="text-xl font-bold text-white" style={H}>Analysis Results</h2>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <ReportGenerator result={result} />
                                <JsonDownload result={result} />
                                <ExportCSV accounts={result.suspicious_accounts} />
                            </div>
                        </motion.div>

                        <motion.div variants={fadeUp}><SummaryDashboard summary={result.summary} /></motion.div>
                        <motion.div variants={fadeUp}><StatisticsPanel suspiciousAccounts={result.suspicious_accounts} summary={result.summary} /></motion.div>
                        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
                            <SearchBar cyInstance={cyInstance} />
                            <LayoutSwitcher cyInstance={cyInstance} />
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,255,255,0.08)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFullscreenGraph(true)}
                                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl cursor-pointer transition-all"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08))',
                                    border: '1px solid rgba(168,85,247,0.2)',
                                    color: 'rgba(196,181,253,0.9)',
                                    ...B,
                                }}
                                title="Open Fullscreen Graph Analysis"
                            >
                                <Maximize2 size={13} />
                                <span className="hidden sm:inline">Fullscreen</span>
                            </motion.button>
                        </motion.div>
                        <motion.div variants={fadeUp}><LayerToggles cyInstance={cyInstance} suspiciousAccounts={result.suspicious_accounts} /></motion.div>
                        <motion.div variants={fadeUp}><GraphVisualization graphData={result.graph_data} suspiciousAccounts={result.suspicious_accounts} onCyReady={setCyInstance} /></motion.div>

                        <motion.div variants={fadeUp} className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                                <ChevronRight size={16} className="text-white/30" />
                                <h3 className="text-lg font-bold text-white" style={H}>Detailed Tables</h3>
                            </div>
                            <FilterDropdown accounts={result.suspicious_accounts} onFilter={setRiskFilter} />
                        </motion.div>

                        <motion.div variants={fadeUp} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <SuspiciousTable accounts={filteredAccounts} />
                            <FraudRingsTable rings={result.fraud_rings} />
                        </motion.div>
                    </motion.div>
                )}

                {/* ═══════════ FULLSCREEN GRAPH OVERLAY ═══════════ */}
                <AnimatePresence>
                    {fullscreenGraph && result && (
                        <motion.div
                            key="fs-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-[9999] flex"
                            style={{ background: 'var(--lcg-page)' }}
                        >
                            {/* ── Sidebar Panel ── */}
                            <AnimatePresence>
                                {fsSidebarOpen && (
                                    <motion.aside
                                        key="fs-sidebar"
                                        initial={{ x: -320, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -320, opacity: 0 }}
                                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                        className="w-[320px] flex-shrink-0 h-full overflow-y-auto border-r"
                                        style={{
                                            background: 'var(--lcg-glass-2)',
                                            borderColor: 'var(--lcg-line-6)',
                                            backdropFilter: 'blur(24px)',
                                        }}
                                    >
                                        <div className="p-4 space-y-4">
                                            {/* Sidebar header */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                                                        style={{
                                                            background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))',
                                                            border: '1px solid rgba(168,85,247,0.15)',
                                                        }}>
                                                        <BarChart3 size={12} className="text-purple-300" />
                                                    </div>
                                                    <h3 className="text-sm font-bold text-white" style={H}>Graph Controls</h3>
                                                </div>
                                                <button
                                                    onClick={() => setFsSidebarOpen(false)}
                                                    className="p-1.5 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/[0.05] transition-all cursor-pointer"
                                                    title="Hide sidebar"
                                                >
                                                    <PanelLeftClose size={14} />
                                                </button>
                                            </div>

                                            {/* Search */}
                                            <div className="rounded-xl p-3" style={{ background: 'var(--lcg-glass-3)', border: '1px solid var(--lcg-line-6)' }}>
                                                <p className="text-[10px] text-white/25 uppercase tracking-wider mb-2" style={B}>Search</p>
                                                <SearchBar cyInstance={fsCyInstance} />
                                            </div>

                                            {/* Layout */}
                                            <div className="rounded-xl p-3" style={{ background: 'var(--lcg-glass-3)', border: '1px solid var(--lcg-line-6)' }}>
                                                <p className="text-[10px] text-white/25 uppercase tracking-wider mb-2" style={B}>Layout</p>
                                                <LayoutSwitcher cyInstance={fsCyInstance} />
                                            </div>

                                            {/* Layer Toggles */}
                                            <LayerToggles cyInstance={fsCyInstance} suspiciousAccounts={result.suspicious_accounts} />

                                            {/* Statistics */}
                                            <StatisticsPanel suspiciousAccounts={result.suspicious_accounts} summary={result.summary} />

                                            {/* Summary */}
                                            <SummaryDashboard summary={result.summary} />
                                        </div>
                                    </motion.aside>
                                )}
                            </AnimatePresence>

                            {/* ── Main Graph Area ── */}
                            <div className="flex-1 flex flex-col h-full relative">
                                {/* Fullscreen Top Bar */}
                                <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
                                    style={{
                                        background: 'var(--lcg-glass-2)',
                                        borderColor: 'var(--lcg-line-6)',
                                        backdropFilter: 'blur(24px)',
                                    }}>
                                    <div className="flex items-center gap-3">
                                        {!fsSidebarOpen && (
                                            <motion.button
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                onClick={() => setFsSidebarOpen(true)}
                                                className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all cursor-pointer"
                                                title="Show sidebar"
                                            >
                                                <PanelLeft size={16} />
                                            </motion.button>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1), rgba(236,72,153,0.08))',
                                                    border: '1px solid rgba(168,85,247,0.15)',
                                                }}>
                                                <Maximize2 size={14} className="text-purple-300" />
                                            </div>
                                            <div>
                                                <h2 className="text-sm font-bold text-white" style={H}>Fullscreen Graph Analysis</h2>
                                                <p className="text-[10px] text-white/20" style={B}>
                                                    {result.summary.total_accounts_analyzed} nodes · {result.graph_data?.edges?.length || 0} edges · Press ESC to exit
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ThemeToggle />
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setFullscreenGraph(false)}
                                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-xl cursor-pointer transition-all"
                                            style={{
                                                background: 'var(--lcg-glass-5)',
                                                border: '1px solid var(--lcg-line-10)',
                                                color: 'var(--lcg-ink-60)',
                                                ...B,
                                            }}
                                        >
                                            <Minimize2 size={13} />
                                            Exit Fullscreen
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Graph fills remaining space */}
                                <div className="flex-1 relative min-h-0 overflow-hidden">
                                    <GraphVisualization
                                        graphData={result.graph_data}
                                        suspiciousAccounts={result.suspicious_accounts}
                                        onCyReady={setFsCyInstance}
                                        fullscreen={true}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/[0.04] mt-16">
                <div className="max-w-[1600px] mx-auto px-8 py-6 flex items-center justify-between">
                    <img src="/logo.png" alt="Quantara" className="h-7 w-auto object-contain opacity-40" />
                    <span className="text-white/10 text-[10px]" style={B}>Graph-Based Financial Crime Detection</span>
                </div>
            </footer>
        </div>
    );
}
