'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, MapPin } from 'lucide-react';
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
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                        opacity: 1,
                        scale: isHighlighted ? 1.2 : 1,
                        boxShadow: isHighlighted ? '0 0 30px rgba(118, 75, 162, 0.8)' : 'none'
                    }}
                    transition={{ duration: 0.5, delay: level * 0.1 }}
                    className="glass-card p-3 mb-4 relative"
                    style={{
                        minWidth: '120px',
                        borderColor: isHighlighted ? '#764ba2' : undefined
                    }}
                >
                    <div className="text-center">
                        <div className="font-bold text-lg text-purple-400">{node.data.code}</div>
                        <div className="text-xs text-secondary truncate">{node.data.city}</div>
                    </div>
                    {level > 0 && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs font-mono bg-purple-500 bg-opacity-20 px-2 rounded">
                            L{level}
                        </div>
                    )}
                </motion.div>

                {(node.left || node.right) && (
                    <div className="flex gap-8">
                        <div className="flex flex-col items-center">
                            {node.left && (
                                <>
                                    <div className="w-px h-8 bg-purple-500 opacity-50"></div>
                                    {renderTree(node.left, level + 1, 'left')}
                                </>
                            )}
                        </div>
                        <div className="flex flex-col items-center">
                            {node.right && (
                                <>
                                    <div className="w-px h-8 bg-purple-500 opacity-50"></div>
                                    {renderTree(node.right, level + 1, 'right')}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">Binary Search Tree - Route Network</h2>
                        <p className="text-secondary text-sm">Hierarchical structure with O(log n) search</p>
                    </div>
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => insertRoute()}
                            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg font-semibold text-sm flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Insert Route
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={searchRoute}
                            className="px-4 py-2 bg-white bg-opacity-10 rounded-lg font-semibold text-sm flex items-center gap-2"
                        >
                            <Search className="w-4 h-4" />
                            Search
                        </motion.button>
                    </div>
                </div>

                {/* Tree Visualization */}
                <div className="overflow-auto max-h-[600px] p-4">
                    {!tree.root ? (
                        <div className="text-center py-12 text-secondary">
                            <MapPin className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p>Tree is empty. Insert routes to begin.</p>
                        </div>
                    ) : (
                        <div className="flex justify-center pt-4">
                            {renderTree(tree.root)}
                        </div>
                    )}
                </div>

                {operation && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-purple-500 bg-opacity-10 border border-purple-500 rounded-lg"
                    >
                        <p className="font-mono text-sm">{operation}</p>
                    </motion.div>
                )}
            </div>

            {/* Right Panel */}
            <div className="space-y-6">
                {learningMode && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-6"
                    >
                        <h3 className="text-xl font-bold mb-4">📚 BST Properties</h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <h4 className="font-semibold text-purple-400 mb-2">Time Complexity</h4>
                                <ul className="space-y-1 text-secondary">
                                    <li>• Search: <span className="text-yellow-400 font-mono">O(log n)</span></li>
                                    <li>• Insert: <span className="text-yellow-400 font-mono">O(log n)</span></li>
                                    <li>• Delete: <span className="text-yellow-400 font-mono">O(log n)</span></li>
                                    <li className="text-xs">Average case for balanced tree</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-purple-400 mb-2">Space Complexity</h4>
                                <p className="text-secondary">
                                    <span className="text-purple-400 font-mono">O(n)</span>
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-purple-400 mb-2">Key Features</h4>
                                <ul className="space-y-1 text-secondary">
                                    <li>✓ Ordered data</li>
                                    <li>✓ Fast search/insert/delete</li>
                                    <li>✓ In-order gives sorted</li>
                                    <li>✓ Hierarchical relationships</li>
                                </ul>
                            </div>

                            <div className="code-block">
                                <code>{`// BST Insert\nif (val < node.val)\n  node.left = insert(val)\nelse\n  node.right = insert(val)\n\n// Search - O(log n)`}</code>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold mb-4">Statistics</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-secondary">Total Nodes:</span>
                            <span className="font-bold text-xl">{routes.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-secondary">Height:</span>
                            <span className="font-mono text-sm">~{Math.ceil(Math.log2(routes.length + 1))}</span>
                        </div>
                        {searchResult && (
                            <div className="pt-3 border-t border-white border-opacity-10">
                                <div className="text-xs text-secondary mb-1">Last Search Result:</div>
                                <div className="font-bold">{searchResult.code}</div>
                                <div className="text-xs text-secondary">{searchResult.name}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Routes List */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-3">All Routes (In-Order)</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {routes.map((route) => (
                            <div key={route.code} className="text-sm p-2 bg-white bg-opacity-5 rounded">
                                <span className="font-mono text-purple-400">{route.code}</span>
                                <span className="text-secondary ml-2">- {route.city}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
