/**
 * ThemeToggle — Liquid Crystal Glass Dark ↔ Light toggle.
 * Toggles .light-mode on <html>, persists in localStorage.
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('mule_theme') !== 'light';
    });

    /* Sync on mount */
    useEffect(() => {
        if (!isDark) {
            document.documentElement.classList.add('light-mode');
        } else {
            document.documentElement.classList.remove('light-mode');
        }
    }, [isDark]);

    const toggle = () => {
        const next = !isDark;
        setIsDark(next);
        if (next) {
            document.documentElement.classList.remove('light-mode');
            localStorage.setItem('mule_theme', 'dark');
        } else {
            document.documentElement.classList.add('light-mode');
            localStorage.setItem('mule_theme', 'light');
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggle}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer"
            style={{
                background: 'var(--lcg-glass-3)',
                border: '1px solid var(--lcg-line-6)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--lcg-line-15)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--lcg-line-6)'; }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            <motion.div
                key={isDark ? 'moon' : 'sun'}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
            >
                {isDark
                    ? <Moon size={14} style={{ color: 'var(--lcg-ink-30)' }} />
                    : <Sun size={14} style={{ color: 'var(--lcg-ink-50)' }} />
                }
            </motion.div>
        </motion.button>
    );
}
