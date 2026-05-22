/**
 * FilterDropdown — Filter suspicious accounts by risk level.
 * Design: Liquid Crystal Glass — Black & White
 */
import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';

const B = { fontFamily: "'Inter', system-ui, sans-serif" };

export default function FilterDropdown({ accounts, onFilter }) {
    const [level, setLevel] = useState('all');

    const handleChange = (e) => {
        setLevel(e.target.value);
        onFilter(e.target.value);
    };

    const counts = useMemo(() => {
        if (!accounts) return { high: 0, medium: 0, low: 0 };
        return {
            high: accounts.filter(a => a.suspicion_score >= 80).length,
            medium: accounts.filter(a => a.suspicion_score >= 60 && a.suspicion_score < 80).length,
            low: accounts.filter(a => a.suspicion_score < 60 && a.suspicion_score > 0).length,
        };
    }, [accounts]);

    return (
        <div className="flex items-center gap-2.5" style={B}>
            <div className="flex items-center gap-1.5 text-white/20">
                <Filter size={13} />
                <span className="text-xs font-medium">Risk Level:</span>
            </div>
            <select
                value={level}
                onChange={handleChange}
                className="text-sm text-white/60 rounded-xl px-3 py-2 outline-none cursor-pointer transition-all appearance-none"
                style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    fontFamily: "'Inter', system-ui, sans-serif",
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.06)'; }}
            >
                <option value="all" style={{ background: '#000' }}>All Accounts</option>
                <option value="high" style={{ background: '#000' }}>● High (80+) — {counts.high}</option>
                <option value="medium" style={{ background: '#000' }}>◐ Medium (60-79) — {counts.medium}</option>
                <option value="low" style={{ background: '#000' }}>○ Low (&lt;60) — {counts.low}</option>
            </select>
        </div>
    );
}
