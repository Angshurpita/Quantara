/**
 * LoginPage — Liquid Crystal Glass Design
 * Now powered by Firebase Authentication.
 * Supports: Guest (anonymous), User (email/password), Admin (email/password + role check)
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, User, Lock, ArrowRight, Eye, EyeOff, Sparkles,
    AlertCircle, ArrowLeft, Mail, UserPlus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signIn, signUp, signInAsGuest, signInWithGoogle } from '../firebase/auth';
import ThemeToggle from '../components/ThemeToggle';

const H = { fontFamily: "'Inter', system-ui, sans-serif" };
const B = { fontFamily: "'Inter', system-ui, sans-serif" };

export default function LoginPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState('guest');
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);

    useEffect(() => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
        }
    }, [user, navigate]);

    useEffect(() => {
        setError('');
        setIsSignUp(false);
        setEmail('');
        setPassword('');
        setUsername('');
    }, [activeTab]);

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 600);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            setError('Please fill in all fields');
            triggerShake();
            return;
        }
        if (isSignUp && !username.trim()) {
            setError('Please enter a username');
            triggerShake();
            return;
        }
        setLoading(true);
        setError('');
        try {
            if (isSignUp) {
                const role = activeTab === 'admin' ? 'admin' : 'user';
                await signUp(email, password, username, role);
            } else {
                await signIn(email, password);
            }
            // Auth state change will trigger navigation via useEffect
        } catch (err) {
            let msg = err.message;
            if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password') || msg.includes('auth/user-not-found')) {
                msg = 'Invalid email or password';
            } else if (msg.includes('auth/email-already-in-use')) {
                msg = 'This email is already registered';
            } else if (msg.includes('auth/weak-password')) {
                msg = 'Password must be at least 6 characters';
            } else if (msg.includes('auth/invalid-email')) {
                msg = 'Please enter a valid email address';
            }
            setError(msg);
            triggerShake();
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        setLoading(true);
        setError('');
        try {
            await signInAsGuest();
            // Auth state change will trigger navigation
        } catch (err) {
            setError(err.message);
            triggerShake();
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            await signInWithGoogle();
        } catch (err) {
            let msg = err.message;
            if (msg.includes('popup-closed-by-user')) msg = 'Sign-in popup was closed';
            else if (msg.includes('popup-blocked')) msg = 'Popup was blocked by your browser';
            setError(msg);
            triggerShake();
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'guest', label: 'Guest', icon: Sparkles },
        { id: 'user', label: 'User', icon: User },
        { id: 'admin', label: 'Admin', icon: Shield },
    ];

    const inputClass = `w-full rounded-xl py-3 text-white text-sm focus:outline-none transition-all
                      placeholder-white/20 bg-white/[0.03] border border-white/[0.08]
                      focus:border-white/20 focus:shadow-[0_0_20px_rgba(255,255,255,0.03)]`;

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
            {/* Crystal background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="crystal-bg-orb" style={{ width: 500, height: 500, top: '-10%', left: '-5%' }} />
                <div className="crystal-bg-orb" style={{ width: 400, height: 400, bottom: '-10%', right: '-5%', animationDelay: '-8s' }} />
            </div>

            {/* Grid */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.015]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                    backgroundSize: '80px 80px',
                }} />

            <div className="relative z-10 w-full max-w-md mx-4">
                {/* Theme toggle + Back row */}
                <div className="flex items-center justify-between mb-6">
                    <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate('/')}
                        whileHover={{ x: -4 }}
                        className="mb-6 text-white/25 hover:text-white/60 flex items-center gap-2 text-sm transition-colors cursor-pointer"
                        style={B}>
                        <ArrowLeft size={15} />
                        Back
                    </motion.button>
                    <ThemeToggle />
                </div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className={shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}>

                    <div className="rounded-2xl p-7 relative overflow-hidden"
                        style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            backdropFilter: 'blur(24px)',
                            boxShadow: '0 20px 80px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255,255,255,0.04) inset',
                        }}>

                        {/* Top accent line */}
                        <div className="absolute top-0 left-0 right-0 h-[1px]"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />

                        {/* Logo */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
                            className="flex justify-center mb-5">
                            <div className="h-14 rounded-xl overflow-hidden opacity-80">
                                <img src="/logo.png" alt="Quantara" className="h-full w-auto object-contain" />
                            </div>
                        </motion.div>

                        <h2 className="text-2xl font-bold text-center mb-1 text-white" style={H}>Welcome Back</h2>
                        <p className="text-white/25 text-center text-sm mb-7" style={B}>
                            Sign in to access the detection engine
                        </p>

                        {/* Tabs */}
                        <div className="relative flex rounded-xl p-1 mb-7"
                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                            <motion.div
                                className="absolute top-1 bottom-1 rounded-lg"
                                style={{
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                }}
                                animate={{
                                    left: activeTab === 'guest' ? '4px' : activeTab === 'user' ? 'calc(33.33% + 4px)' : 'calc(66.66% + 4px)',
                                    width: 'calc(33.33% - 8px)',
                                }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        if (tab.id === 'guest') { setActiveTab('guest'); }
                                        else { setActiveTab(tab.id); }
                                    }}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium
                    relative z-10 transition-colors cursor-pointer
                    ${activeTab === tab.id ? 'text-white/80' : 'text-white/25 hover:text-white/40'}`}
                                    style={B}>
                                    <tab.icon size={13} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Guest Form */}
                        {activeTab === 'guest' ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 mt-2">
                                <p className="text-white/30 text-center text-sm leading-relaxed" style={B}>
                                    Explore the dashboard instantly — no account needed.
                                </p>
                                <motion.button
                                    type="button"
                                    onClick={handleGuestLogin}
                                    disabled={loading}
                                    whileHover={{ scale: loading ? 1 : 1.01, boxShadow: loading ? 'none' : '0 0 30px rgba(255,255,255,0.08)' }}
                                    whileTap={{ scale: loading ? 1 : 0.99 }}
                                    className={`w-full py-3.5 rounded-xl font-semibold text-sm cursor-pointer transition-all
                                        ${loading ? 'opacity-50 cursor-wait bg-white/10 text-white/50' : 'bg-white text-black'}`}
                                    style={B}>
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full" />
                                            Signing in...
                                        </div>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <Sparkles size={16} /> Continue as Guest <ArrowRight size={16} />
                                        </span>
                                    )}
                                </motion.button>
                            </motion.div>
                        ) : (
                            /* Email/Password Form */
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Username (sign-up only) */}
                                <AnimatePresence>
                                    {isSignUp && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="group overflow-hidden"
                                        >
                                            <label className="text-[10px] text-white/20 mb-1.5 block uppercase tracking-widest" style={B}>Username</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <UserPlus size={14} className="text-white/20 group-focus-within:text-white/50 transition-colors" />
                                                </div>
                                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                                                    placeholder="Choose a display name" className={`${inputClass} pl-10 pr-4`}
                                                    style={B} autoComplete="name" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Email */}
                                <div className="group">
                                    <label className="text-[10px] text-white/20 mb-1.5 block uppercase tracking-widest" style={B}>Email</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Mail size={14} className="text-white/20 group-focus-within:text-white/50 transition-colors" />
                                        </div>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter email" className={`${inputClass} pl-10 pr-4`}
                                            style={B} autoComplete="email" />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="group">
                                    <label className="text-[10px] text-white/20 mb-1.5 block uppercase tracking-widest" style={B}>Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Lock size={14} className="text-white/20 group-focus-within:text-white/50 transition-colors" />
                                        </div>
                                        <input type={showPassword ? 'text' : 'password'} value={password}
                                            onChange={(e) => setPassword(e.target.value)} placeholder="Enter password"
                                            className={`${inputClass} pl-10 pr-12`} style={B} autoComplete="current-password" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/20 hover:text-white/50 transition-colors cursor-pointer">
                                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Error */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8, height: 0 }}
                                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                                            exit={{ opacity: 0, y: -8, height: 0 }}
                                            className="flex items-center gap-2 text-red-400/80 text-sm px-4 py-2.5 rounded-xl"
                                            style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', ...B }}>
                                            <AlertCircle size={14} /> {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Submit */}
                                <motion.button
                                    type="submit" disabled={loading}
                                    whileHover={{ scale: loading ? 1 : 1.01, boxShadow: loading ? 'none' : '0 0 30px rgba(255,255,255,0.08)' }}
                                    whileTap={{ scale: loading ? 1 : 0.99 }}
                                    className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all cursor-pointer
                    ${loading ? 'opacity-50 cursor-wait bg-white/10 text-white/50' : 'bg-white text-black'}`}
                                    style={B}>
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full" />
                                            {isSignUp ? 'Creating account...' : 'Authenticating...'}
                                        </div>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            {isSignUp ? (
                                                <><UserPlus size={16} /> Create {activeTab === 'admin' ? 'Admin' : 'User'} Account</>
                                            ) : (
                                                <>{activeTab === 'admin' ? 'Sign in as Admin' : 'Sign in as User'} <ArrowRight size={16} /></>
                                            )}
                                        </span>
                                    )}
                                </motion.button>

                                {/* Divider */}
                                <div className="flex items-center gap-3 my-1">
                                    <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                                    <span className="text-[10px] text-white/20 uppercase tracking-widest" style={B}>or</span>
                                    <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                                </div>

                                {/* Google Sign-In */}
                                <motion.button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    whileHover={{ scale: loading ? 1 : 1.01, borderColor: 'rgba(255,255,255,0.15)' }}
                                    whileTap={{ scale: loading ? 1 : 0.99 }}
                                    className={`w-full py-3 rounded-xl font-medium text-sm transition-all cursor-pointer flex items-center justify-center gap-2.5
                                        ${loading ? 'opacity-40 cursor-wait' : 'hover:bg-white/[0.04]'}`}
                                    style={{
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        color: 'rgba(255,255,255,0.6)',
                                        ...B,
                                    }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Continue with Google
                                </motion.button>

                                {/* Toggle Sign Up / Sign In */}
                                <button
                                    type="button"
                                    onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                                    className="w-full text-center text-white/25 hover:text-white/50 text-xs transition-colors cursor-pointer py-1"
                                    style={B}
                                >
                                    {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                                </button>
                            </form>
                        )}

                        {/* Footer note */}
                        <p className="text-center text-white/15 text-[11px] mt-5 flex items-center justify-center gap-1.5" style={B}>
                            {activeTab === 'admin' ? 'Admin accounts have full system access' : 'Powered by Firebase Authentication'}
                        </p>
                    </div>
                </motion.div>
            </div>

            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>
        </div>
    );
}
