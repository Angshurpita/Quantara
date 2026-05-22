/**
 * AdminPanel.jsx — Premium Admin Dashboard
 *
 * Design: Liquid Crystal Glass — Black & White
 * - Sidebar navigation with glassmorphism
 * - Monochrome accents, Inter font
 * - Animated stat cards, premium tables
 * - All existing functionality preserved (CRUD users, view history)
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Activity, Shield, Trash2, Plus, X, Clock, LogOut,
    Search, UserPlus, Eye, EyeOff, AlertCircle, UserCheck, History,
    Radar, LayoutDashboard, Settings, ChevronRight, ArrowLeft,
    TrendingUp, FileText, UserX,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { getAllUsers, getAllHistory, deleteUserProfile } from '../firebase/firestore';
import { signUp } from '../firebase/auth';

const H = { fontFamily: "'Inter', system-ui, sans-serif" };
const B = { fontFamily: "'Inter', system-ui, sans-serif" };

/* ────── Animation Variants ────── */
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

/* ════════════════════════════════════════════════════════════════════════
   STAT CARD
   ════════════════════════════════════════════════════════════════════════ */
const StatCard = ({ icon: Icon, label, value, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.45 }}
        whileHover={{ y: -3 }}
        className="relative group rounded-2xl overflow-hidden cursor-default"
        style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
        }}
    >
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
        <div className="p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                <Icon size={18} className="text-white/40" />
            </div>
            <div>
                <p className="text-2xl font-bold text-white" style={H}>{value}</p>
                <p className="text-[11px] text-white/25 uppercase tracking-wider" style={B}>{label}</p>
            </div>
        </div>
    </motion.div>
);

/* ════════════════════════════════════════════════════════════════════════
   CREATE USER MODAL
   ════════════════════════════════════════════════════════════════════════ */
const CreateUserModal = ({ isOpen, onClose, onCreated }) => {
    const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' });
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.username || !form.email || !form.password) {
            setError('All fields are required');
            return;
        }
        setLoading(true);
        setError('');
        try {
            // Create user via Firebase Auth + Firestore profile
            const fbUser = await signUp(form.email, form.password, form.username, form.role);
            onCreated({ uid: fbUser.uid, username: form.username, email: form.email, role: form.role, isActive: true });
            onClose();
            setForm({ username: '', email: '', password: '', role: 'user' });
        } catch (err) {
            let msg = err.message;
            if (msg.includes('auth/email-already-in-use')) msg = 'Email is already registered';
            else if (msg.includes('auth/weak-password')) msg = 'Password must be at least 6 characters';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const inputClass = "w-full rounded-xl py-3 px-4 text-white text-sm focus:outline-none transition-all placeholder-white/20";
    const inputStyle = {
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        ...B,
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
                    style={{
                        background: 'rgba(0,0,0,0.95)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(24px)',
                    }}
                >
                    {/* Top gradient accent */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] rounded-t-2xl"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />

                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2" style={H}>
                            <UserPlus size={18} className="text-white/40" />
                            Create New User
                        </h3>
                        <button onClick={onClose} className="text-slate-500 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.05] transition-all cursor-pointer">
                            <X size={16} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-[11px] text-slate-500 mb-1.5 block uppercase tracking-wider" style={B}>Username</label>
                            <input
                                type="text"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                className={inputClass}
                                style={inputStyle}
                                placeholder="john_doe"
                                onFocus={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.boxShadow = '0 0 15px rgba(255,255,255,0.03)'; }}
                                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>
                        <div>
                            <label className="text-[11px] text-slate-500 mb-1.5 block uppercase tracking-wider" style={B}>Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className={inputClass}
                                style={inputStyle}
                                placeholder="john@example.com"
                                onFocus={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.boxShadow = '0 0 15px rgba(255,255,255,0.03)'; }}
                                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>
                        <div className="relative">
                            <label className="text-[11px] text-slate-500 mb-1.5 block uppercase tracking-wider" style={B}>Password</label>
                            <input
                                type={showPwd ? 'text' : 'password'}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className={inputClass}
                                style={{ ...inputStyle, paddingRight: '3rem' }}
                                placeholder="••••••••"
                                onFocus={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.boxShadow = '0 0 15px rgba(255,255,255,0.03)'; }}
                                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                            />
                            <button type="button" onClick={() => setShowPwd(!showPwd)}
                                className="absolute right-3 top-9 text-white/20 hover:text-white/50 transition-colors cursor-pointer">
                                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                        <div>
                            <label className="text-[11px] text-slate-500 mb-1.5 block uppercase tracking-wider" style={B}>Role</label>
                            <div className="flex gap-3">
                                {['user', 'admin'].map((r) => (
                                    <motion.button
                                        key={r}
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setForm({ ...form, role: r })}
                                        className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
                                        style={form.role === r ? {
                                            background: 'rgba(255,255,255,0.08)',
                                            border: '1px solid rgba(255,255,255,0.15)',
                                            color: '#ffffff',
                                            boxShadow: '0 0 15px rgba(255,255,255,0.04)',
                                            ...B,
                                        } : {
                                            background: 'rgba(255,255,255,0.02)',
                                            border: '1px solid rgba(255,255,255,0.06)',
                                            color: '#64748b',
                                            ...B,
                                        }}
                                    >
                                        {r === 'admin' ? '🛡️ Admin' : '👤 User'}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-red-300 text-sm px-4 py-2.5 rounded-xl"
                                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                            >
                                <AlertCircle size={14} />
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.01, boxShadow: '0 0 30px rgba(255,255,255,0.08)' }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-bold text-black text-sm bg-white disabled:opacity-50 transition-all cursor-pointer hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]"
                            style={B}
                        >
                            {loading ? 'Creating...' : 'Create User'}
                        </motion.button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

/* ════════════════════════════════════════════════════════════════════════
   MAIN ADMIN PANEL
   ════════════════════════════════════════════════════════════════════════ */
export default function AdminPanel({ user, onLogout, onBackToDashboard }) {
    const [activeSection, setActiveSection] = useState('overview');
    const [users, setUsers] = useState([]);
    const [history, setHistory] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Fetch data
    useEffect(() => {
        fetchUsers();
        fetchHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchUsers = async () => {
        try {
            const allUsers = await getAllUsers();
            setUsers(allUsers);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
    };

    const fetchHistory = async () => {
        try {
            const allHistory = await getAllHistory();
            // Normalize timestamps from Firestore
            setHistory(allHistory.map(h => ({
                ...h,
                file_name: h.fileName || h.file_name || '',
                timestamp: h.timestamp?.toDate?.() ? h.timestamp.toDate().toISOString() : h.timestamp,
            })));
        } catch (err) {
            console.error('Failed to fetch history:', err);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUserProfile(userId);
            setUsers(users.filter((u) => u.uid !== userId));
            setDeleteConfirm(null);
            fetchHistory();
        } catch (err) {
            console.error('Failed to delete user:', err);
        }
    };

    const filteredUsers = users.filter(
        (u) =>
            u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const adminCount = users.filter((u) => u.role === 'admin').length;
    const userCount = users.filter((u) => u.role === 'user').length;
    const activeUsers = users.filter((u) => u.is_active).length;
    const todayActions = history.filter((h) => {
        const d = new Date(h.timestamp);
        const now = new Date();
        return d.toDateString() === now.toDateString();
    }).length;

    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'history', label: 'History', icon: History },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-black text-white" style={B}>
            {/* Crystal background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="crystal-bg-orb" style={{ width: 500, height: 500, top: '-10%', left: '-5%' }} />
                <div className="crystal-bg-orb" style={{ width: 400, height: 400, bottom: '-10%', right: '-5%', animationDelay: '-8s' }} />
            </div>

            <div className="relative z-10 flex min-h-screen">
                {/* ══════ SIDEBAR ══════ */}
                <motion.aside
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="hidden lg:flex flex-col w-64 border-r border-white/[0.06] sticky top-0 h-screen"
                    style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(24px)' }}
                >
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-white/[0.06]">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="Quantara" className="h-10 w-auto object-contain" />
                        </div>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;
                            return (
                                <motion.button
                                    key={item.id}
                                    whileHover={{ x: 3 }}
                                    onClick={() => setActiveSection(item.id)}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer"
                                    style={isActive ? {
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#ffffff',
                                        ...B,
                                    } : {
                                        background: 'transparent',
                                        border: '1px solid transparent',
                                        color: 'rgba(255,255,255,0.3)',
                                        ...B,
                                    }}
                                >
                                    <Icon size={16} />
                                    {item.label}
                                    {isActive && <ChevronRight size={14} className="ml-auto" />}
                                </motion.button>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-white/[0.06] space-y-2">
                        <div className="flex items-center gap-2 px-4 py-2">
                            <ThemeToggle />
                            <span className="text-[11px] text-white/25 uppercase tracking-wider" style={B}>Theme</span>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onBackToDashboard}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-slate-500 hover:text-white rounded-xl hover:bg-white/[0.03] transition-all cursor-pointer"
                            style={B}
                        >
                            <ArrowLeft size={13} />
                            Back to Dashboard
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onLogout}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:text-red-300 rounded-xl hover:bg-red-500/[0.06] transition-all cursor-pointer"
                            style={B}
                        >
                            <LogOut size={13} />
                            Logout
                        </motion.button>

                        {/* User badge */}
                        <div className="flex items-center gap-2.5 px-4 py-3 mt-2 rounded-xl"
                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                            <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white/50 text-xs font-bold">
                                {user?.username?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white/60" style={B}>{user?.username}</p>
                                <p className="text-[10px] text-white/25" style={B}>Administrator</p>
                            </div>
                        </div>
                    </div>
                </motion.aside>

                {/* ══════ MAIN CONTENT ══════ */}
                <div className="flex-1 flex flex-col">
                    {/* Mobile Header */}
                    <motion.header
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:hidden sticky top-0 z-40 border-b border-white/[0.06]"
                        style={{ backdropFilter: 'blur(24px)', background: 'rgba(0,0,0,0.7)' }}
                    >
                        <div className="px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src="/logo.png" alt="Quantara" className="h-9 w-auto object-contain" />
                            </div>
                            <div className="flex items-center gap-2">
                                <ThemeToggle />
                                <button onClick={onBackToDashboard} className="px-3 py-2 text-xs text-slate-400 hover:text-white bg-white/[0.03] rounded-xl border border-white/[0.06] cursor-pointer" style={B}>
                                    <ArrowLeft size={13} />
                                </button>
                                <button onClick={onLogout} className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl cursor-pointer">
                                    <LogOut size={14} />
                                </button>
                            </div>
                        </div>
                        {/* Mobile tabs */}
                        <div className="flex gap-1 px-4 pb-3 overflow-x-auto">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg whitespace-nowrap transition-all cursor-pointer"
                                    style={activeSection === item.id ? {
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#ffffff',
                                        ...B,
                                    } : {
                                        background: 'transparent',
                                        border: '1px solid transparent',
                                        color: 'rgba(255,255,255,0.3)',
                                        ...B,
                                    }}
                                >
                                    <item.icon size={12} />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </motion.header>

                    {/* Content */}
                    <main className="flex-1 p-6 md:p-8 max-w-[1200px] w-full mx-auto">
                        <AnimatePresence mode="wait">
                            {/* ─── OVERVIEW ─── */}
                            {activeSection === 'overview' && (
                                <motion.div key="overview" variants={stagger} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="space-y-6">
                                    <motion.div variants={fadeUp}>
                                        <h2 className="text-2xl font-bold text-white mb-1" style={H}>
                                            Dashboard Overview
                                        </h2>
                                        <p className="text-sm text-slate-500" style={B}>System status and key metrics</p>
                                    </motion.div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <StatCard icon={Users} label="Total Users" value={users.length} delay={0.1} />
                                        <StatCard icon={Shield} label="Admins" value={adminCount} delay={0.15} />
                                        <StatCard icon={UserCheck} label="Active Users" value={activeUsers} delay={0.2} />
                                        <StatCard icon={Activity} label="Actions Today" value={todayActions} delay={0.25} />
                                    </div>

                                    {/* Quick stats panel */}
                                    <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Recent Activity */}
                                        <div className="rounded-2xl p-5 overflow-hidden relative"
                                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
                                            <div className="absolute top-0 left-0 right-0 h-[1px] opacity-40"
                                                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
                                            <div className="flex items-center gap-2 mb-4">
                                                <TrendingUp size={14} className="text-white/40" />
                                                <h3 className="text-sm font-bold text-slate-300" style={H}>Recent Activity</h3>
                                            </div>
                                            <div className="space-y-2">
                                                {history.slice(0, 5).map((h, i) => (
                                                    <motion.div
                                                        key={h.id}
                                                        initial={{ opacity: 0, x: -8 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.3 + i * 0.05 }}
                                                        className="flex items-center gap-3 text-xs p-2.5 rounded-lg"
                                                        style={{ background: 'rgba(255,255,255,0.02)' }}
                                                    >
                                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] ${h.action === 'upload_csv' ? 'bg-white/[0.06] text-white/50' :
                                                            h.action === 'login' ? 'bg-white/[0.06] text-white/50' :
                                                                h.action === 'create_user' ? 'bg-white/[0.06] text-white/50' :
                                                                    'bg-white/[0.06] text-white/50'
                                                            }`}>
                                                            {h.action === 'upload_csv' ? <FileText size={10} /> :
                                                                h.action === 'login' ? <UserCheck size={10} /> :
                                                                    h.action === 'create_user' ? <UserPlus size={10} /> :
                                                                        <UserX size={10} />}
                                                        </div>
                                                        <span className="text-slate-400 flex-1 truncate">{h.username || 'N/A'} — {h.action.replace(/_/g, ' ')}</span>
                                                        <span className="text-slate-600 flex-shrink-0">{h.timestamp ? new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                                    </motion.div>
                                                ))}
                                                {history.length === 0 && (
                                                    <p className="text-slate-600 text-xs py-4 text-center">No activity yet</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* User Distribution */}
                                        <div className="rounded-2xl p-5 overflow-hidden relative"
                                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
                                            <div className="absolute top-0 left-0 right-0 h-[1px] opacity-40"
                                                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
                                            <div className="flex items-center gap-2 mb-4">
                                                <Users size={14} className="text-white/40" />
                                                <h3 className="text-sm font-bold text-slate-300" style={H}>User Breakdown</h3>
                                            </div>
                                            <div className="space-y-4">
                                                {[
                                                    { label: 'Administrators', count: adminCount, total: users.length, color: '#ffffff' },
                                                    { label: 'Regular Users', count: userCount, total: users.length, color: '#a3a3a3' },
                                                    { label: 'Active', count: activeUsers, total: users.length, color: '#d4d4d4' },
                                                ].map(item => (
                                                    <div key={item.label}>
                                                        <div className="flex items-center justify-between text-xs mb-1.5">
                                                            <span className="text-slate-400" style={B}>{item.label}</span>
                                                            <span className="text-white font-bold" style={H}>{item.count}</span>
                                                        </div>
                                                        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: item.total ? `${(item.count / item.total) * 100}%` : '0%' }}
                                                                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                                                className="h-full rounded-full"
                                                                style={{ background: item.color, boxShadow: `0 0 10px ${item.color}44` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* ─── USERS ─── */}
                            {activeSection === 'users' && (
                                <motion.div key="users" variants={stagger} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="space-y-5">
                                    <motion.div variants={fadeUp} className="flex items-center justify-between flex-wrap gap-3">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white" style={H}>
                                                User Management
                                            </h2>
                                            <p className="text-sm text-slate-500 mt-0.5" style={B}>{users.length} total users</p>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(255,255,255,0.08)' }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => setShowCreateModal(true)}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-sm font-semibold transition-all cursor-pointer hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]"
                                            style={B}
                                        >
                                            <Plus size={16} />
                                            Create User
                                        </motion.button>
                                    </motion.div>

                                    {/* Search */}
                                    <motion.div variants={fadeUp} className="relative max-w-md">
                                        <Search size={14} className="absolute left-3.5 top-3 text-slate-600" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search users by name or email..."
                                            className="w-full rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none transition-all"
                                            style={{
                                                background: 'rgba(255,255,255,0.03)',
                                                border: '1px solid rgba(255,255,255,0.06)',
                                                ...B,
                                            }}
                                            onFocus={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.boxShadow = '0 0 20px rgba(255,255,255,0.03)'; }}
                                            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.06)'; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </motion.div>

                                    {/* User Table */}
                                    <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden"
                                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
                                        <div className="absolute top-0 left-0 right-0 h-[1px] opacity-40"
                                            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr>
                                                        {['User', 'Email', 'Role', 'Status', 'Created', 'Actions'].map((h, i) => (
                                                            <th key={i} className={`px-5 py-3.5 text-[11px] uppercase tracking-wider font-semibold text-white/30 ${i === 5 ? 'text-right' : 'text-left'}`}
                                                                style={{ background: 'rgba(255,255,255,0.02)', ...B, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                                                {h}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredUsers.map((u, i) => (
                                                        <motion.tr
                                                            key={u.uid}
                                                            initial={{ opacity: 0, x: -15 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.04 }}
                                                            className="group hover:bg-white/[0.02] transition-colors"
                                                        >
                                                            <td className="px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${u.role === 'admin'
                                                                        ? 'bg-white/[0.08] border border-white/[0.12] text-white/70'
                                                                        : 'bg-white/[0.04] border border-white/[0.08] text-white/50'
                                                                        }`}>
                                                                        {u.username[0].toUpperCase()}
                                                                    </div>
                                                                    <span className="text-sm font-medium text-white" style={B}>{u.username}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3.5 text-slate-400 text-sm" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', ...B }}>{u.email}</td>
                                                            <td className="px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                                <span className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                                                                    style={u.role === 'admin' ? {
                                                                        background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.12)',
                                                                    } : {
                                                                        background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.06)',
                                                                    }}>
                                                                    {u.role === 'admin' ? '🛡️ Admin' : '👤 User'}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                                <span className="flex items-center gap-1.5 text-xs">
                                                                    <span className={`w-2 h-2 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-red-500'}`}
                                                                        style={{ boxShadow: u.is_active ? '0 0 6px rgba(16,185,129,0.5)' : '0 0 6px rgba(239,68,68,0.5)' }} />
                                                                    <span className={u.is_active ? 'text-emerald-400' : 'text-red-400'} style={B}>
                                                                        {u.is_active ? 'Active' : 'Inactive'}
                                                                    </span>
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3.5 text-slate-600 text-xs" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', ...B }}>
                                                                {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                                                            </td>
                                                            <td className="px-5 py-3.5 text-right" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                                {u.username !== user.username && (
                                                                    deleteConfirm === u.uid ? (
                                                                        <div className="flex items-center justify-end gap-2">
                                                                            <motion.button
                                                                                whileTap={{ scale: 0.95 }}
                                                                                onClick={() => handleDeleteUser(u.uid)}
                                                                                className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-500 transition-colors cursor-pointer"
                                                                                style={B}
                                                                            >
                                                                                Confirm
                                                                            </motion.button>
                                                                            <button
                                                                                onClick={() => setDeleteConfirm(null)}
                                                                                className="px-3 py-1.5 text-xs rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                                                                                style={{ background: 'rgba(255,255,255,0.05)', ...B }}
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <motion.button
                                                                            whileHover={{ scale: 1.1 }}
                                                                            whileTap={{ scale: 0.9 }}
                                                                            onClick={() => setDeleteConfirm(u.uid)}
                                                                            className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                                                                            title="Delete user"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </motion.button>
                                                                    )
                                                                )}
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {filteredUsers.length === 0 && (
                                            <div className="text-center py-16">
                                                <Users size={36} className="mx-auto mb-3 text-slate-700" />
                                                <p className="text-slate-600 text-sm" style={B}>No users found</p>
                                            </div>
                                        )}
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* ─── HISTORY ─── */}
                            {activeSection === 'history' && (
                                <motion.div key="history" variants={stagger} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="space-y-5">
                                    <motion.div variants={fadeUp}>
                                        <h2 className="text-2xl font-bold text-white" style={H}>
                                            Usage History
                                        </h2>
                                        <p className="text-sm text-slate-500 mt-0.5" style={B}>{history.length} total actions tracked</p>
                                    </motion.div>

                                    <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden"
                                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr>
                                                        {['User', 'Action', 'File', 'Details', 'Timestamp'].map((h, i) => (
                                                            <th key={i} className="px-5 py-3.5 text-left text-[11px] uppercase tracking-wider font-semibold text-white/30"
                                                                style={{ background: 'rgba(255,255,255,0.02)', ...B, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                                                {h}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {history.map((h, i) => (
                                                        <motion.tr
                                                            key={h.id}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.03 }}
                                                            className="hover:bg-white/[0.02] transition-colors"
                                                        >
                                                            <td className="px-5 py-3 text-white text-sm font-medium" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', ...B }}>{h.username || 'N/A'}</td>
                                                            <td className="px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                                <span className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                                                                    style={
                                                                        h.action === 'upload_csv' ? { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' } :
                                                                            h.action === 'login' ? { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.06)' } :
                                                                                h.action === 'create_user' ? { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.07)' } :
                                                                                    { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.06)' }
                                                                    }>
                                                                    {h.action === 'upload_csv' ? '📊 Upload' :
                                                                        h.action === 'login' ? '🔑 Login' :
                                                                            h.action === 'create_user' ? '👤 Create User' :
                                                                                h.action === 'delete_user' ? '🗑️ Delete User' :
                                                                                    h.action}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3 text-slate-400 text-sm" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', ...B }}>{h.file_name || '—'}</td>
                                                            <td className="px-5 py-3 text-slate-600 text-xs max-w-xs truncate" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', ...B }}>{h.details || '—'}</td>
                                                            <td className="px-5 py-3 text-slate-600 text-xs" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', ...B }}>
                                                                {h.timestamp ? new Date(h.timestamp).toLocaleString() : 'N/A'}
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {history.length === 0 && (
                                            <div className="text-center py-16">
                                                <Clock size={36} className="mx-auto mb-3 text-slate-700" />
                                                <p className="text-slate-600 text-sm" style={B}>No usage history yet</p>
                                            </div>
                                        )}
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* ─── SETTINGS ─── */}
                            {activeSection === 'settings' && (
                                <motion.div key="settings" variants={stagger} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="space-y-5">
                                    <motion.div variants={fadeUp}>
                                        <h2 className="text-2xl font-bold text-white" style={H}>
                                            System Settings
                                        </h2>
                                        <p className="text-sm text-slate-500 mt-0.5" style={B}>Configure system behavior and preferences</p>
                                    </motion.div>

                                    <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* System Info */}
                                        <div className="rounded-2xl p-5 relative overflow-hidden"
                                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
                                            <div className="absolute top-0 left-0 right-0 h-[1px] opacity-40"
                                                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
                                            <div className="flex items-center gap-2 mb-4">
                                                <Settings size={14} className="text-white/40" />
                                                <h3 className="text-sm font-bold text-slate-300" style={H}>System Information</h3>
                                            </div>
                                            <div className="space-y-3">
                                                {[
                                                    { label: 'Application', value: 'Money Muling Detection Engine' },
                                                    { label: 'Backend API', value: API },
                                                    { label: 'Auth Type', value: 'JWT (Bearer Token)' },
                                                    { label: 'Graph Engine', value: 'Cytoscape.js' },
                                                    { label: 'Analysis Engine', value: 'NetworkX + Custom Algorithms' },
                                                ].map(item => (
                                                    <div key={item.label} className="flex items-center justify-between py-2 px-3 rounded-lg"
                                                        style={{ background: 'rgba(255,255,255,0.01)' }}>
                                                        <span className="text-xs text-slate-500" style={B}>{item.label}</span>
                                                        <span className="text-xs text-slate-300 font-mono">{item.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="rounded-2xl p-5 relative overflow-hidden"
                                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
                                            <div className="absolute top-0 left-0 right-0 h-[1px] opacity-40"
                                                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
                                            <div className="flex items-center gap-2 mb-4">
                                                <Radar size={14} className="text-white/40" />
                                                <h3 className="text-sm font-bold text-slate-300" style={H}>Quick Actions</h3>
                                            </div>
                                            <div className="space-y-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    onClick={() => { setActiveSection('users'); setShowCreateModal(true); }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-all cursor-pointer"
                                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', ...B, color: 'rgba(255,255,255,0.6)' }}
                                                >
                                                    <UserPlus size={14} />
                                                    <span>Create New User</span>
                                                    <ChevronRight size={14} className="ml-auto text-slate-600" />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    onClick={onBackToDashboard}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-all cursor-pointer"
                                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', ...B, color: 'rgba(255,255,255,0.6)' }}
                                                >
                                                    <LayoutDashboard size={14} />
                                                    <span>Go to Analysis Dashboard</span>
                                                    <ChevronRight size={14} className="ml-auto text-slate-600" />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    onClick={() => { fetchUsers(); fetchHistory(); }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-all cursor-pointer"
                                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', ...B, color: 'rgba(255,255,255,0.6)' }}
                                                >
                                                    <Activity size={14} />
                                                    <span>Refresh All Data</span>
                                                    <ChevronRight size={14} className="ml-auto text-slate-600" />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>

                    {/* Footer */}
                    <footer className="border-t border-white/[0.04] mt-auto">
                        <div className="px-8 py-5 flex items-center justify-between">
                            <img src="/logo.png" alt="Quantara" className="h-6 w-auto object-contain opacity-30" />
                            <span className="text-white/10 text-[10px]" style={B}>Quantara — Financial Crime Detection</span>
                        </div>
                    </footer>
                </div>
            </div>

            {/* Create User Modal */}
            <CreateUserModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreated={(newUser) => {
                    setUsers([newUser, ...users]);
                    fetchHistory();
                }}
            />
        </div>
    );
}
