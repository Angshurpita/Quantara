/**
 * LayerToggles — Toggle detection pattern layers on/off on the graph.
 * Design: Liquid Crystal Glass — Black & White
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';

const B = { fontFamily: "'Inter', system-ui, sans-serif" };

const LAYERS = [
    { key: 'cycles', label: 'Cycle Rings', icon: '◆' },
    { key: 'fan_in', label: 'Fan-In', icon: '▼' },
    { key: 'fan_out', label: 'Fan-Out', icon: '▲' },
    { key: 'passthrough', label: 'Pass-Through', icon: '►' },
    { key: 'round_amount', label: 'Round Amount', icon: '●' },
    { key: 'anomaly', label: 'Anomaly', icon: '◇' },
    { key: 'merchant', label: 'Merchants', icon: '■' },
];

function patternMatchesLayer(pattern, layerKey) {
    if (layerKey === 'cycles') return pattern.startsWith('cycle_length_');
    if (layerKey === 'fan_in') return pattern === 'fan_in';
    if (layerKey === 'fan_out') return pattern === 'fan_out';
    if (layerKey === 'passthrough') return pattern === 'passthrough_shell';
    if (layerKey === 'round_amount') return pattern === 'round_amount_structuring';
    if (layerKey === 'anomaly') return pattern === 'amount_anomaly';
    if (layerKey === 'merchant') return pattern === 'legitimate_merchant';
    return false;
}

export default function LayerToggles({ cyInstance, suspiciousAccounts }) {
    const [active, setActive] = useState(() => {
        const init = {};
        LAYERS.forEach(l => { init[l.key] = true; });
        return init;
    });

    const applyFilters = (filters) => {
        if (!cyInstance) return;

        const patternMap = {};
        (suspiciousAccounts || []).forEach(a => {
            patternMap[a.account_id] = a.detected_patterns || [];
        });

        cyInstance.nodes().forEach(node => {
            const id = node.data('id');
            const patterns = patternMap[id];

            if (!patterns || patterns.length === 0) {
                node.style('display', 'element');
                return;
            }

            const hasActiveMatch = patterns.some(p => {
                for (const layer of LAYERS) {
                    if (filters[layer.key] && patternMatchesLayer(p, layer.key)) {
                        return true;
                    }
                }
                return false;
            });

            node.style('display', hasActiveMatch ? 'element' : 'none');
        });

        cyInstance.edges().forEach(edge => {
            const srcVisible = edge.source().style('display') !== 'none';
            const tgtVisible = edge.target().style('display') !== 'none';
            edge.style('display', srcVisible && tgtVisible ? 'element' : 'none');
        });
    };

    const toggle = (key) => {
        setActive(prev => {
            const next = { ...prev, [key]: !prev[key] };
            applyFilters(next);
            return next;
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative rounded-2xl overflow-hidden"
            style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
            }}
        >
            <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Layers size={13} className="text-white/30" />
                    <h3 className="text-xs font-bold text-white/30 uppercase tracking-wider" style={B}>Detection Layers</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {LAYERS.map(layer => (
                        <motion.button
                            key={layer.key}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => toggle(layer.key)}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
                            style={active[layer.key] ? {
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                color: '#ffffff',
                                boxShadow: '0 0 12px rgba(255,255,255,0.04)',
                                ...B,
                            } : {
                                border: '1px solid rgba(255,255,255,0.06)',
                                color: 'rgba(255,255,255,0.25)',
                                background: 'transparent',
                                ...B,
                            }}
                        >
                            <span>{layer.icon}</span>
                            <span>{layer.label}</span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
