'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, MapPin, Network, GitGraph } from 'lucide-react';
import { RouteTree, TreeNode, type Route } from '@/lib/dataStructures';
import { airportCodes } from '@/lib/utils';

interface Props {
    learningMode: boolean;
    demoMode: boolean;
}

export default function TreeVisualizer({ learningMode, demoMode }: Props) {
    const [tree] = useState(() => new RouteTree());
    const [routes, setRoutes] = useState<Route[]>([]);
    const [searchResult, setSearchResult] = useState<Route | null>(null);
    const [operation, setOperation] = useState<string>('');
    const [highlightPath, setHighlightPath] = useState<string[]>([]);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (demoMode) {
            runDemo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [demoMode]);

    const runDemo = async () => {
        const demoAirports = airportCodes.slice(0, 7);
        for (const airport of demoAirports) {
            await new Promise(resolve => setTimeout(resolve, 800));
            insertRoute(airport);
        }
    };

    const insertRoute = (airport?: typeof airportCodes[0]) => {
        const route = airport || airportCodes[Math.floor(Math.random() * airportCodes.length)];

        if (routes.find(r => r.code === route.code)) {
            setOperation(`Insert: ${route.code} already exists`);
            return;
        }

        tree.insert(route);
        setOperation(`Insert O(log n): Added ${route.code} - ${route.name}`);
        setRoutes(tree.inorder());
    };

    const searchRoute = () => {
        if (routes.length === 0) return;

        const randomRoute = routes[Math.floor(Math.random() * routes.length)];
        const result = tree.search(randomRoute.code);

        if (result) {
            setSearchResult(result);
            setOperation(`Search O(log n): Found ${result.code} - ${result.name}`);
            setHighlightPath([result.code]);
            setTimeout(() => {
                setSearchResult(null);
                setHighlightPath([]);
            }, 2000);
        }
    };

    const renderTree = (
        node: TreeNode<Route> | null,
        level = 0,
        position: 'left' | 'right' | 'root' = 'root'
    ): React.ReactElement | null => {
        if (!node) return null;

        const isHighlighted = highlightPath.includes(node.data.code);

        return (
            <div className="flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: -20 }}
                    animate={{
                        opacity: 1,
                        scale: isHighlighted ? 1.2 : 1,
                        y: 0,
                        zIndex: isHighlighted ? 10 : 0
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative z-10"
                >
                    <div
                        className={`glass-card p-3 mb-4 min-w-[100px] text-center transition-all duration-300 ${isHighlighted ? 'border-purple-400 ring-4 ring-purple-400/20 bg-purple-900/50' : 'hover:border-purple-400/50'
                            }`}
                    >
                        {level > 0 && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="text-[10px] font-mono bg-purple-500 text-white px-1.5 py-0.5 rounded shadow-sm opacity-60">
                                    L{level}
                                </span>
                            </div>
                        )}

                        <div className="font-bold text-lg text-purple-300 font-mono">{node.data.code}</div>
                        <div className="text-[10px] text-secondary truncate max-w-[100px] mx-auto opacity-70">
                            {node.data.city}
                        </div>
                    </div>
                </motion.div>

                {(node.left || node.right) && (
                    <div className="flex gap-4 relative pt-4">
                        {/* Connecting Lines */}
                        <svg className="absolute top-0 left-0 w-full h-4 pointer-events-none overflow-visible">
                            {node.left && (
                                <line
                                    x1="50%" y1="0"
                                    x2="25%" y2="100%"
                                    stroke="#a855f7"
                                    strokeWidth="2"
                                    strokeOpacity="0.3"
                                />
                            )}
                            {node.right && (
                                <line
                                    x1="50%" y1="0"
                                    x2="75%" y2="100%"
                                    stroke="#a855f7"
                                    strokeWidth="2"
                                    strokeOpacity="0.3"
                                />
                            )}
                        </svg>

                        <div className="flex flex-col items-center">
                            {node.left ? renderTree(node.left, level + 1, 'left') : <div className="w-16" />}
                        </div>
                        <div className="flex flex-col items-center">
                            {node.right ? renderTree(node.right, level + 1, 'right') : <div className="w-16" />}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 panel relative overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-8 z-10 relative">
                    <div>
                        <h2 className="text-2xl font-bold mb-1 text-shadow-sm flex items-center gap-2">
                            <Network className="w-6 h-6 text-purple-400" />
                            BST - Route Network
                        </h2>
                        <p className="text-secondary text-sm">Hierarchical structure with O(log n) search</p>
                    </div>
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168, 85, 247, 0.6)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => insertRoute()}
                            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 border border-purple-400/50 rounded-xl font-bold text-white shadow-lg text-sm flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Insert Route
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={searchRoute}
                            className="px-4 py-2 bg-white/5 border border-white/20 hover:border-purple-400/50 hover:bg-purple-500/20 rounded-xl font-bold text-white shadow-lg text-sm flex items-center gap-2 transition-colors"
                        >
                            <Search className="w-4 h-4" />
                            Search
                        </motion.button>
                    </div>
                </div>

                {/* Tree Visualization */}
                <div className="flex-1 relative bg-black/20 rounded-2xl border border-white/5 overflow-hidden flex flex-col min-h-[500px]">
                    <div className="absolute inset-0 grid-pattern opacity-30" />

                    {/* Controls */}
                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                        <button onClick={() => setScale(s => Math.min(s + 0.1, 1.5))} className="p-2 bg-white/10 rounded-lg hover:bg-white/20">+</button>
                        <button onClick={() => setScale(s => Math.max(s - 0.1, 0.5))} className="p-2 bg-white/10 rounded-lg hover:bg-white/20">-</button>
                    </div>

                    <div className="flex-1 overflow-auto p-8 flex items-start justify-center">
                        {!tree.root ? (
                            <div className="text-center py-20 text-secondary flex flex-col items-center justify-center">
                                <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                    <GitGraph className="w-12 h-12 text-purple-400 opacity-60" />
                                </div>
                                <p className="text-xl font-medium text-purple-200">Network is empty</p>
                                <p className="text-sm opacity-60 mt-2">Insert routes to build the network</p>
                            </div>
                        ) : (
                            <motion.div
                                style={{ scale }}
                                className="origin-top transition-transform duration-200"
                            >
                                {renderTree(tree.root)}
                            </motion.div>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {operation && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            className="mt-4"
                        >
                            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center gap-3 shadow-lg backdrop-blur-sm">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <Search className="w-5 h-5 text-purple-400" />
                                </div>
                                <p className="font-mono text-sm text-purple-100">{operation}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Right Panel */}
            <div className="space-y-6">
                {learningMode && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-6 border-l-4 border-l-purple-500"
                    >
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-2xl">📚</span> BST Properties
                        </h3>
                        <div className="space-y-5 text-sm">
                            <div className="p-3 bg-white/5 rounded-lg">
                                <h4 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-purple-400" /> Time Complexity
                                </h4>
                                <ul className="space-y-2 text-secondary ml-1">
                                    <li className="flex justify-between">Search <span className="text-yellow-400 font-mono font-bold bg-yellow-400/10 px-2 rounded">O(log n)</span></li>
                                    <li className="flex justify-between">Insert <span className="text-yellow-400 font-mono font-bold bg-yellow-400/10 px-2 rounded">O(log n)</span></li>
                                    <li className="flex justify-between">Delete <span className="text-yellow-400 font-mono font-bold bg-yellow-400/10 px-2 rounded">O(log n)</span></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-purple-400 mb-2">Space Complexity</h4>
                                <p className="text-secondary p-2 border border-white/10 rounded-lg bg-black/20">
                                    <span className="text-purple-400 font-mono font-bold">O(n)</span> - Linear growth
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-purple-400 mb-2">Key Features</h4>
                                <ul className="space-y-2 text-secondary">
                                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Hierarchical Data</li>
                                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Sorted In-order</li>
                                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Efficient Search</li>
                                </ul>
                            </div>

                            <div className="code-block text-xs">
                                <code>{`// BST Insert
if (val < node.val)
  node.left = insert(val)
else
  node.right = insert(val)

// Search - O(log n)`}</code>
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 relative overflow-hidden group"
                >
                    <div className="absolute -right-4 -top-4 w-40 h-40 bg-purple-500/10 rounded-full blur-[50px] group-hover:bg-purple-500/20 transition-colors" />

                    <h3 className="text-xl font-bold mb-4 relative z-10 flex items-center gap-2">
                        <span className="text-purple-400">📊</span> Live Statistics
                    </h3>
                    <div className="relative z-10 space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-xs font-bold text-secondary uppercase tracking-widest border-b border-white/10 pb-2">
                            <div>Metric</div>
                            <div className="text-right">Value</div>
                        </div>

                        <div className="space-y-1">
                            <div className="grid grid-cols-2 gap-4 p-3 bg-gradient-to-r from-white/5 to-transparent rounded-lg border border-white/5 hover:border-purple-500/30 transition-colors group/row">
                                <div className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 group-hover/row:shadow-[0_0_8px_rgba(192,132,252,1)] transition-shadow"></div>
                                    Total Nodes
                                </div>
                                <div className="text-right font-mono font-bold text-lg text-white text-shadow-sm">
                                    {routes.length}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 p-3 bg-gradient-to-r from-white/5 to-transparent rounded-lg border border-white/5 hover:border-purple-500/30 transition-colors group/row">
                                <div className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover/row:shadow-[0_0_8px_rgba(129,140,248,1)] transition-shadow"></div>
                                    Tree Height
                                </div>
                                <div className="text-right font-mono font-bold text-sm text-purple-300">
                                    ~{Math.ceil(Math.log2(routes.length + 1))} <span className="text-[10px] text-secondary">levels</span>
                                </div>
                            </div>
                        </div>

                        {searchResult && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <div className="text-xs text-secondary mb-2 uppercase tracking-wide">Last Search Result</div>
                                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="font-mono font-bold text-purple-300">{searchResult.code}</span>
                                        <span className="text-xs text-white/70">{searchResult.name}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Routes List */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        All Routes (In-Order)
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {routes.map((route) => (
                            <div key={route.code} className="text-sm p-2 bg-white/5 rounded hover:bg-white/10 transition-colors flex justify-between">
                                <span className="font-mono text-purple-400 font-bold">{route.code}</span>
                                <span className="text-secondary truncate ml-4">{route.city}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
