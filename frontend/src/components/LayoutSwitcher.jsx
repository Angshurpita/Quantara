/**
 * LayoutSwitcher — Toggle between graph layout algorithms.
 * Design: Liquid Crystal Glass — Black & White
 */
import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';

const B = { fontFamily: "'Inter', system-ui, sans-serif" };

const LAYOUTS = [
    { key: 'cose', label: 'Force-Directed', icon: '◎' },
    { key: 'circle', label: 'Circular', icon: '○' },
    { key: 'breadthfirst', label: 'Hierarchical', icon: '△' },
    { key: 'grid', label: 'Grid', icon: '▦' },
    { key: 'concentric', label: 'Concentric', icon: '◉' },
];

export default function LayoutSwitcher({ cyInstance }) {
    const applyLayout = (layoutName) => {
        if (!cyInstance) return;

        const layoutOpts = {
            name: layoutName,
            animate: true,
            animationDuration: 600,
            padding: 40,
        };

        if (layoutName === 'cose') {
            layoutOpts.nodeRepulsion = () => 8000;
            layoutOpts.idealEdgeLength = () => 120;
        }
        if (layoutName === 'concentric') {
            layoutOpts.concentric = (node) => node.data('score') || 0;
            layoutOpts.levelWidth = () => 2;
        }
        if (layoutName === 'breadthfirst') {
            layoutOpts.directed = true;
            layoutOpts.spacingFactor = 1.2;
        }

        const layout = cyInstance.layout(layoutOpts);
        layout.run();
    };

    return (
        <div className="flex items-center gap-1.5" style={B}>
            <div className="flex items-center gap-1 text-white/20 mr-1">
                <LayoutGrid size={12} />
                <span className="text-[11px]">Layout:</span>
            </div>
            {LAYOUTS.map(l => (
                <motion.button
                    key={l.key}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => applyLayout(l.key)}
                    title={l.label}
                    className="w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-all cursor-pointer text-white/30 hover:text-white/60"
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(255,255,255,0.03)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                    {l.icon}
                </motion.button>
            ))}
        </div>
    );
}
