/**
 * ProfilePage — Liquid Crystal Glass Design
 * Black & White monochrome aesthetic
 */
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    User, Shield, Clock, ArrowLeft, LogOut,
    KeyRound, LayoutDashboard, ChevronRight,
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const H = { fontFamily: "'Inter', system-ui, sans-serif" };
const B = { fontFamily: "'Inter', system-ui, sans-serif" };

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

    const profileItems = [
        { icon: User, label: 'Username', value: user?.username || 'N/A' },
        { icon: Shield, label: 'Role', value: user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User' },
        { icon: KeyRound, label: 'Auth Type', value: user?.isAnonymous ? 'Anonymous (Guest)' : 'Firebase Auth' },
        { icon: Clock, label: 'Email', value: user?.email || 'N/A' },
    ];

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
                    <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                                <User size={14} className="text-white/40" />
                            </div>
                            <div>
                                <h1 className="text-base font-bold text-white" style={H}>My Profile</h1>
                                <p className="text-[10px] text-white/20 tracking-wider uppercase">Account & Settings</p>
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

                <main className="max-w-4xl mx-auto px-6 py-8">
                    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
                        {/* Profile Card */}
                        <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden relative"
                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)' }}>
                            {/* Accent line */}
                            <div className="absolute top-0 left-0 right-0 h-[1px]"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />

                            {/* Banner */}
                            <div className="h-28 relative"
                                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)' }}>
                                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent" />
                            </div>

                            <div className="relative px-6 pb-6 -mt-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                    className="w-20 h-20 rounded-2xl bg-white/[0.06] border border-white/[0.1]
                             flex items-center justify-center text-3xl font-bold text-white/50 mb-4"
                                    style={{ boxShadow: '0 4px 30px rgba(0,0,0,0.3)', ...H }}>
                                    {user?.username?.[0]?.toUpperCase() || 'U'}
                                </motion.div>
                                <h2 className="text-xl font-bold text-white" style={H}>{user?.username}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium
                                   bg-white/[0.05] text-white/40 border border-white/[0.08]">
                                        {user?.role === 'admin' ? '🛡️ Admin' : user?.role === 'guest' ? '✨ Guest' : '👤 User'}
                                    </span>
                                    <span className="flex items-center gap-1 text-[11px] text-white/30">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" />
                                        Online
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Account Details */}
                        <motion.div variants={fadeUp} className="rounded-2xl p-5 relative overflow-hidden"
                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)' }}>
                            <div className="absolute top-0 left-0 right-0 h-[1px]"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-sm font-bold text-white/50" style={H}>Account Details</h3>
                            </div>
                            <div className="space-y-1">
                                {profileItems.map((item, i) => (
                                    <motion.div key={item.label}
                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.05 }}
                                        className="flex items-center justify-between py-3 px-4 rounded-xl transition-all
                               hover:bg-white/[0.02]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                                                <item.icon size={13} className="text-white/30" />
                                            </div>
                                            <span className="text-sm text-white/30" style={B}>{item.label}</span>
                                        </div>
                                        <span className="text-sm text-white font-medium" style={B}>{item.value}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quick Navigation */}
                        <motion.div variants={fadeUp} className="rounded-2xl p-5 relative overflow-hidden"
                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)' }}>
                            <div className="absolute top-0 left-0 right-0 h-[1px]"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
                            <h3 className="text-sm font-bold text-white/50 mb-4" style={H}>Quick Navigation</h3>
                            <div className="space-y-2">
                                {[
                                    { icon: LayoutDashboard, label: 'Analysis Dashboard', desc: 'Upload & analyze CSV data', path: '/dashboard' },
                                    { icon: Clock, label: 'My History', desc: 'View your upload history', path: '/history' },
                                    ...(user?.role === 'admin' ? [{ icon: Shield, label: 'Admin Panel', desc: 'Manage users & settings', path: '/admin' }] : []),
                                ].map((item) => (
                                    <motion.button key={item.label} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                                        onClick={() => navigate(item.path)}
                                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all cursor-pointer
                               bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.1]"
                                        style={B}>
                                        <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                                            <item.icon size={15} className="text-white/30" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-white/70">{item.label}</p>
                                            <p className="text-[11px] text-white/20">{item.desc}</p>
                                        </div>
                                        <ChevronRight size={14} className="text-white/15" />
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </main>

                <footer className="border-t border-white/[0.04] mt-8">
                    <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
                        <img src="/logo.png" alt="Quantara" className="h-6 w-auto object-contain opacity-30" />
                        <span className="text-white/10 text-[10px]" style={B}>Quantara — Financial Crime Detection</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
