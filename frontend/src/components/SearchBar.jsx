/**
 * SearchBar — Search for an account and highlight it on the graph.
 * Design: Liquid Crystal Glass — Black & White
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Check } from 'lucide-react';

const B = { fontFamily: "'Inter', system-ui, sans-serif" };

export default function SearchBar({ cyInstance }) {
    const [query, setQuery] = useState('');
    const [found, setFound] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        const q = query.trim();
        if (!q || !cyInstance) return;

        cyInstance.elements().removeClass('search-highlight search-dimmed highlighted-edge');

        const node = cyInstance.getElementById(q);

        if (node && node.length > 0) {
            cyInstance.elements().addClass('search-dimmed');
            const neighborhood = node.neighborhood().add(node);
            neighborhood.removeClass('search-dimmed');
            node.addClass('search-highlight');
            node.connectedEdges().addClass('highlighted-edge');
            cyInstance.animate({ center: { eles: node }, zoom: 1.5 }, { duration: 500 });
            setFound(true);
        } else {
            setFound(false);
        }
    };

    const handleClear = () => {
        setQuery('');
        setFound(null);
        if (cyInstance) {
            cyInstance.elements().removeClass('search-highlight search-dimmed highlighted-edge');
            cyInstance.fit(undefined, 40);
        }
    };

    return (
        <form onSubmit={handleSearch} className="flex items-center gap-2" style={B}>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search account ID..."
                    className="text-sm text-white/70 rounded-xl pl-9 pr-3 py-2.5 w-56 outline-none placeholder-white/15 transition-all duration-300"
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        fontFamily: "'Inter', system-ui, sans-serif",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.boxShadow = '0 0 20px rgba(255,255,255,0.03)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.06)'; e.target.style.boxShadow = 'none'; }}
                />
                <Search size={14} className="absolute left-3 top-3 text-white/20" />
            </div>
            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="px-4 py-2.5 bg-white text-black text-sm font-semibold rounded-xl transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                style={B}
            >
                Find
            </motion.button>
            {found !== null && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    type="button"
                    onClick={handleClear}
                    className="p-2 text-white/20 hover:text-white/60 rounded-lg hover:bg-white/[0.05] transition-all cursor-pointer"
                >
                    <X size={14} />
                </motion.button>
            )}
            {found === false && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/40 text-xs">
                    Not found
                </motion.span>
            )}
            {found === true && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1 text-white/60 text-xs">
                    <Check size={12} /> Found
                </motion.span>
            )}
        </form>
    );
}
