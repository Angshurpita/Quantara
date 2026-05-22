/**
 * GraphVisualization — Interactive Cytoscape.js directed graph.
 *
 * - Normal accounts = teal/cyan nodes
 * - Suspicious accounts = orange/amber nodes
 * - Fraud ring members = crimson glow nodes
 * - Click node → shows account details
 * - Hover node → highlights connections
 * - Exposes cy instance via onCyReady callback
 *
 * Design: Liquid Crystal Glass — Multicolor Edition
 * Animated prismatic border, multicolor node glow, glass overlays
 */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, User, AlertTriangle, ZoomIn, ZoomOut, Maximize, RotateCcw, X } from 'lucide-react';
import cytoscape from 'cytoscape';

const H = { fontFamily: "'Inter', system-ui, sans-serif" };
const B = { fontFamily: "'Inter', system-ui, sans-serif" };

/* ── Multicolor Liquid Glass keyframes (injected once) ──────── */
const STYLE_ID = 'liquid-glass-multicolor-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
        @keyframes liquidBorderRotate {
            0%   { --angle: 0deg; }
            100% { --angle: 360deg; }
        }

        @property --angle {
            syntax: '<angle>';
            initial-value: 0deg;
            inherits: false;
        }

        .liquid-glass-border {
            position: relative;
            border-radius: 20px;
            overflow: hidden;
        }
        .liquid-glass-border::before {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: 22px;
            padding: 2px;
            background: conic-gradient(
                from var(--angle),
                rgba(99, 102, 241, 0.5),
                rgba(168, 85, 247, 0.4),
                rgba(236, 72, 153, 0.4),
                rgba(244, 63, 94, 0.3),
                rgba(251, 146, 60, 0.3),
                rgba(250, 204, 21, 0.3),
                rgba(52, 211, 153, 0.4),
                rgba(34, 211, 238, 0.4),
                rgba(99, 102, 241, 0.5)
            );
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            animation: liquidBorderRotate 6s linear infinite;
            pointer-events: none;
            z-index: 1;
        }
        .liquid-glass-border::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 20px;
            background: conic-gradient(
                from var(--angle),
                rgba(99, 102, 241, 0.04),
                rgba(168, 85, 247, 0.03),
                rgba(236, 72, 153, 0.03),
                rgba(34, 211, 238, 0.04),
                rgba(99, 102, 241, 0.04)
            );
            animation: liquidBorderRotate 6s linear infinite;
            pointer-events: none;
            z-index: 0;
        }

        .liquid-glass-glow {
            box-shadow:
                0 0 15px rgba(99, 102, 241, 0.06),
                0 0 40px rgba(168, 85, 247, 0.04),
                0 0 80px rgba(236, 72, 153, 0.03),
                inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .liquid-glass-glow:hover {
            box-shadow:
                0 0 20px rgba(99, 102, 241, 0.1),
                0 0 60px rgba(168, 85, 247, 0.06),
                0 0 100px rgba(236, 72, 153, 0.04),
                inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        @keyframes prismaticShift {
            0%, 100% { background-position: 0% 50%; }
            50%      { background-position: 100% 50%; }
        }

        .prismatic-line {
            height: 1px;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(99, 102, 241, 0.4),
                rgba(168, 85, 247, 0.5),
                rgba(236, 72, 153, 0.4),
                rgba(251, 146, 60, 0.3),
                rgba(52, 211, 153, 0.4),
                rgba(34, 211, 238, 0.4),
                rgba(99, 102, 241, 0.4),
                transparent
            );
            background-size: 200% 100%;
            animation: prismaticShift 4s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
}

export default function GraphVisualization({ graphData, suspiciousAccounts, onCyReady, fullscreen = false }) {
    const containerRef = useRef(null);
    const cyRef = useRef(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);

    useEffect(() => {
        if (!graphData || !containerRef.current) return;

        // Destroy previous instance cleanly
        if (cyRef.current) {
            cyRef.current.destroy();
            cyRef.current = null;
        }

        let destroyed = false;
        let layout = null;

        // Build elements
        const elements = [];
        graphData.nodes.forEach((node) => {
            elements.push({
                data: {
                    id: node.id,
                    label: node.id,
                    isSuspicious: node.is_suspicious,
                    isFraudRing: node.is_fraud_ring_member,
                    score: node.suspicion_score,
                    ringIds: node.ring_ids || [],
                },
            });
        });
        graphData.edges.forEach((edge, idx) => {
            elements.push({
                data: {
                    id: `edge-${idx}`,
                    source: edge.source,
                    target: edge.target,
                    amount: edge.amount,
                    txId: edge.transaction_id,
                    timestamp: edge.timestamp,
                },
            });
        });

        const cy = cytoscape({
            container: containerRef.current,
            elements,
            style: [
                {
                    selector: 'node',
                    style: {
                        label: 'data(label)',
                        'text-valign': 'bottom',
                        'text-halign': 'center',
                        'font-size': '10px',
                        color: 'rgba(255,255,255,0.4)',
                        'text-margin-y': 8,
                        'background-color': '#22d3ee',
                        width: 30,
                        height: 30,
                        'border-width': 2,
                        'border-color': '#67e8f9',
                        'transition-property': 'background-color, width, height, border-color, opacity',
                        'transition-duration': '0.2s',
                    },
                },
                {
                    selector: 'node[?isSuspicious]',
                    style: {
                        'background-color': '#f59e0b',
                        'border-color': '#fbbf24',
                        width: 35,
                        height: 35,
                    },
                },
                {
                    selector: 'node[?isFraudRing]',
                    style: {
                        'background-color': '#ef4444',
                        'border-color': '#fca5a5',
                        'border-width': 3,
                        width: 45,
                        height: 45,
                        'font-size': '11px',
                        'font-weight': 'bold',
                        color: '#fca5a5',
                    },
                },
                {
                    selector: 'edge',
                    style: {
                        width: 2,
                        'line-color': 'rgba(255, 255, 255, 0.2)',
                        'target-arrow-color': 'rgba(255, 255, 255, 0.35)',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'arrow-scale': 1.2,
                        'transition-property': 'line-color, target-arrow-color, width, opacity',
                        'transition-duration': '0.2s',
                    },
                },
                {
                    selector: '.highlighted',
                    style: {
                        'background-color': '#ffffff',
                        'border-color': '#d4d4d4',
                        width: 40,
                        height: 40,
                    },
                },
                {
                    selector: '.highlighted-edge',
                    style: {
                        'line-color': '#ffffff',
                        'target-arrow-color': '#ffffff',
                        width: 3,
                    },
                },
                {
                    selector: '.dimmed',
                    style: { opacity: 0.15 },
                },
                {
                    selector: '.search-highlight',
                    style: {
                        'background-color': '#ffffff',
                        'border-color': '#e5e5e5',
                        'border-width': 4,
                        width: 50,
                        height: 50,
                        'z-index': 999,
                    },
                },
                {
                    selector: '.search-dimmed',
                    style: { opacity: 0.12 },
                },
            ],
            layout: { name: 'preset' },
            minZoom: 0.1,
            maxZoom: 3,
        });

        // Delay layout run to ensure container has real pixel dimensions
        const layoutTimer = setTimeout(() => {
            if (destroyed) return;
            cy.resize();
            layout = cy.layout({
                name: 'cose',
                animate: true,
                animationDuration: 800,
                nodeRepulsion: () => 8000,
                idealEdgeLength: () => 120,
                padding: 40,
                stop: () => { layout = null; },
            });
            layout.run();
        }, 150);

        // Click node
        cy.on('tap', 'node', (e) => {
            if (destroyed) return;
            const node = e.target;
            const data = node.data();
            const account = suspiciousAccounts?.find((a) => a.account_id === data.id);
            setSelectedNode({
                id: data.id,
                score: data.score,
                isSuspicious: data.isSuspicious,
                isFraudRing: data.isFraudRing,
                ringIds: data.ringIds,
                patterns: account?.detected_patterns || [],
            });
        });

        // Click background
        cy.on('tap', (e) => {
            if (destroyed) return;
            if (e.target === cy) setSelectedNode(null);
        });

        // Hover
        cy.on('mouseover', 'node', (e) => {
            if (destroyed) return;
            const node = e.target;
            const neighborhood = node.neighborhood().add(node);
            cy.elements().addClass('dimmed');
            neighborhood.removeClass('dimmed');
            node.connectedEdges().addClass('highlighted-edge');
            neighborhood.nodes().not(node).addClass('highlighted');
        });
        cy.on('mouseout', 'node', () => {
            if (destroyed) return;
            cy.elements().removeClass('dimmed highlighted highlighted-edge');
        });

        cyRef.current = cy;

        // Track zoom level
        cy.on('zoom', () => {
            if (!destroyed) setZoomLevel(cy.zoom());
        });

        // Notify parent that cy is ready
        if (onCyReady) onCyReady(cy);

        // ResizeObserver — auto-resize cy when container dimensions change
        let resizeObserver = null;
        if (containerRef.current) {
            resizeObserver = new ResizeObserver(() => {
                if (!destroyed && cyRef.current) {
                    cyRef.current.resize();
                    cyRef.current.fit(undefined, 40);
                }
            });
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            destroyed = true;
            clearTimeout(layoutTimer);
            if (layout) layout.stop();
            if (resizeObserver) resizeObserver.disconnect();
            cy.removeAllListeners();
            cy.destroy();
            cyRef.current = null;
            if (onCyReady) onCyReady(null);
        };
    }, [graphData, suspiciousAccounts, onCyReady]);

    // Zoom control handlers
    const handleZoomIn = () => {
        const cy = cyRef.current;
        if (!cy) return;
        cy.animate({ zoom: { level: cy.zoom() * 1.3, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } } }, { duration: 300 });
    };
    const handleZoomOut = () => {
        const cy = cyRef.current;
        if (!cy) return;
        cy.animate({ zoom: { level: cy.zoom() / 1.3, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } } }, { duration: 300 });
    };
    const handleFit = () => {
        const cy = cyRef.current;
        if (!cy) return;
        cy.animate({ fit: { padding: 40 } }, { duration: 400 });
    };
    const handleReset = () => {
        const cy = cyRef.current;
        if (!cy) return;
        cy.animate({ zoom: 1, center: { eles: cy.elements() } }, { duration: 400 });
    };

    const zoomBtnClass = "w-9 h-9 rounded-lg flex items-center justify-center text-white/30 hover:text-white transition-all duration-300 cursor-pointer";
    const zoomBtnStyle = {
        background: 'rgba(0,0,0,0.6)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
    };

    if (!graphData) return null;

    return (
        <div
            className={fullscreen ? '' : 'liquid-glass-border liquid-glass-glow'}
            style={fullscreen ? { position: 'absolute', inset: 0 } : {
                background: 'rgba(255,255,255,0.01)',
                backdropFilter: 'blur(16px)',
            }}
        >
            {/* Prismatic top line */}
            {!fullscreen && <div className="prismatic-line" style={{ borderRadius: '20px 20px 0 0' }} />}

            <div style={fullscreen ? { position: 'absolute', inset: 0 } : { padding: '1.5rem', position: 'relative', zIndex: 10 }}>
                {/* Header */}
                {!fullscreen && (
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1), rgba(236,72,153,0.08))',
                                    border: '1px solid rgba(168,85,247,0.15)',
                                }}>
                                <Network size={14} className="text-purple-300" />
                            </div>
                            <h2 className="text-lg font-bold text-white" style={H}>
                                Transaction Graph
                            </h2>
                        </div>
                        <div className="flex items-center gap-4 text-xs" style={B}>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full inline-block"
                                    style={{ background: '#22d3ee', boxShadow: '0 0 8px rgba(34,211,238,0.5)' }} />
                                <span className="text-white/30">Normal</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full inline-block"
                                    style={{ background: '#f59e0b', boxShadow: '0 0 8px rgba(245,158,11,0.5)' }} />
                                <span className="text-white/30">Suspicious</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-4 h-4 rounded-full border-2 inline-block"
                                    style={{ background: '#ef4444', borderColor: '#fca5a5', boxShadow: '0 0 10px rgba(239,68,68,0.5)' }} />
                                <span className="text-white/30">Fraud Ring</span>
                            </span>
                        </div>
                    </div>
                )}

                {/* Graph Canvas */}
                <div style={fullscreen ? { position: 'absolute', inset: 0 } : { position: 'relative' }}>
                    <div ref={containerRef}
                        style={{
                            width: '100%',
                            height: fullscreen ? '100%' : '500px',
                            borderRadius: fullscreen ? 0 : '0.75rem',
                            overflow: 'hidden',
                            background: 'radial-gradient(ellipse at center, rgba(15,10,30,0.85), rgba(0,0,0,0.95))',
                            border: fullscreen ? 'none' : '1px solid rgba(255,255,255,0.04)',
                        }} />

                    {/* Legend overlay (fullscreen) */}
                    {fullscreen && (
                        <div className="absolute top-4 left-4 flex items-center gap-4 text-xs z-20 px-3 py-2 rounded-lg"
                            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full inline-block"
                                    style={{ background: '#22d3ee', boxShadow: '0 0 8px rgba(34,211,238,0.5)' }} />
                                <span className="text-white/30">Normal</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full inline-block"
                                    style={{ background: '#f59e0b', boxShadow: '0 0 8px rgba(245,158,11,0.5)' }} />
                                <span className="text-white/30">Suspicious</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-4 h-4 rounded-full border-2 inline-block"
                                    style={{ background: '#ef4444', borderColor: '#fca5a5', boxShadow: '0 0 10px rgba(239,68,68,0.5)' }} />
                                <span className="text-white/30">Fraud Ring</span>
                            </span>
                        </div>
                    )}

                    {/* Zoom Controls */}
                    <div className="absolute bottom-4 right-4 flex flex-col items-center gap-1.5 z-20">
                        {/* Zoom level badge */}
                        <div className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold mb-1"
                            style={{
                                background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08))',
                                border: '1px solid rgba(168,85,247,0.15)',
                                color: 'rgba(196,181,253,0.7)',
                            }}>
                            {Math.round(zoomLevel * 100)}%
                        </div>
                        <button onClick={handleZoomIn} title="Zoom In" className={zoomBtnClass} style={zoomBtnStyle}>
                            <ZoomIn size={16} />
                        </button>
                        <button onClick={handleZoomOut} title="Zoom Out" className={zoomBtnClass} style={zoomBtnStyle}>
                            <ZoomOut size={16} />
                        </button>
                        <button onClick={handleFit} title="Fit to Screen" className={zoomBtnClass} style={zoomBtnStyle}>
                            <Maximize size={16} />
                        </button>
                        <button onClick={handleReset} title="Reset Zoom" className={zoomBtnClass} style={zoomBtnStyle}>
                            <RotateCcw size={16} />
                        </button>
                    </div>

                    {/* Zoom hint */}
                    <div className="absolute bottom-4 left-4 text-[10px] text-white/15 font-mono z-20" style={B}>
                        Scroll to zoom · Drag to pan
                    </div>
                </div>

                {/* Selected Node Detail Panel */}
                <AnimatePresence>
                    {selectedNode && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -8, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 rounded-xl overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(168,85,247,0.04), rgba(236,72,153,0.03))',
                                border: '1px solid rgba(168,85,247,0.12)',
                            }}
                        >
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-white/80 flex items-center gap-2" style={H}>
                                        <User size={14} className="text-purple-300" />
                                        Account: {selectedNode.id}
                                    </h3>
                                    <button
                                        onClick={() => setSelectedNode(null)}
                                        className="w-6 h-6 rounded-md flex items-center justify-center text-white/20 hover:text-white/60 hover:bg-white/[0.05] transition-all cursor-pointer"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm" style={B}>
                                    <div>
                                        <span className="text-white/25">Score: </span>
                                        <span className={`font-bold ${selectedNode.score >= 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                            {selectedNode.score}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-white/25">Status: </span>
                                        <span className={selectedNode.isSuspicious ? 'text-amber-400' : 'text-emerald-400'}>
                                            {selectedNode.isSuspicious ? '⚠ Suspicious' : '✓ Normal'}
                                        </span>
                                    </div>
                                    {selectedNode.isFraudRing && (
                                        <div className="col-span-2">
                                            <span className="text-white/25">Fraud Ring: </span>
                                            <span className="text-rose-400 font-mono">
                                                {selectedNode.ringIds.join(', ')}
                                            </span>
                                        </div>
                                    )}
                                    {selectedNode.patterns.length > 0 && (
                                        <div className="col-span-2">
                                            <span className="text-white/25">Patterns: </span>
                                            {selectedNode.patterns.map((p) => (
                                                <span key={p} className="inline-block text-[11px] px-2 py-0.5 rounded-full mr-1 mb-1"
                                                    style={{
                                                        background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(236,72,153,0.08))',
                                                        color: 'rgba(196,181,253,0.8)',
                                                        border: '1px solid rgba(168,85,247,0.15)',
                                                    }}>
                                                    {p}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
