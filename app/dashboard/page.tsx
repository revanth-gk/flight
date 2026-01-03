'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, GitBranch, Layers, List, Hash, BookOpen, Play, Pause, Home, ArrowLeft } from 'lucide-react';
import ArrayVisualizer from './visualizers/ArrayVisualizer';
import LinkedListVisualizer from './visualizers/LinkedListVisualizer';
import StackVisualizer from './visualizers/StackVisualizer';
import QueueVisualizer from './visualizers/QueueVisualizer';
import TreeVisualizer from './visualizers/TreeVisualizer';
import HashMapVisualizer from './visualizers/HashMapVisualizer';

type DataStructure = 'array' | 'linkedlist' | 'stack' | 'queue' | 'tree' | 'hashmap';

export default function Dashboard() {
    const searchParams = useSearchParams();
    const structureParam = searchParams.get('structure');

    const [activeStructure, setActiveStructure] = useState<DataStructure>('array');
    const [learningMode, setLearningMode] = useState(false);
    const [demoMode, setDemoMode] = useState(false);

    // Set active structure from URL parameter
    useEffect(() => {
        if (structureParam && ['array', 'linkedlist', 'stack', 'queue', 'tree', 'hashmap'].includes(structureParam)) {
            setActiveStructure(structureParam as DataStructure);
        }
    }, [structureParam]);

    const structures = [
        { id: 'array' as DataStructure, name: 'Array', icon: Database, color: '#667eea' },
        { id: 'linkedlist' as DataStructure, name: 'Linked List', icon: GitBranch, color: '#38ef7d' },
        { id: 'stack' as DataStructure, name: 'Stack', icon: Layers, color: '#f2c94c' },
        { id: 'queue' as DataStructure, name: 'Queue', icon: List, color: '#f45c43' },
        { id: 'tree' as DataStructure, name: 'Tree', icon: GitBranch, color: '#764ba2' },
        { id: 'hashmap' as DataStructure, name: 'HashMap', icon: Hash, color: '#11998e' },
    ];

    const renderVisualizer = () => {
        const props = { learningMode, demoMode };

        switch (activeStructure) {
            case 'array': return <ArrayVisualizer {...props} />;
            case 'linkedlist': return <LinkedListVisualizer {...props} />;
            case 'stack': return <StackVisualizer {...props} />;
            case 'queue': return <QueueVisualizer {...props} />;
            case 'tree': return <TreeVisualizer {...props} />;
            case 'hashmap': return <HashMapVisualizer {...props} />;
        }
    };

    return (
        <div className="min-h-screen grid-pattern p-6">
            <div className="max-w-[1800px] mx-auto">
                {/* Header */}
                <div className="glass-card p-6 mb-6">
                    <div className="flex flex-col gap-4">
                        {/* Top Row: Back Button and Title */}
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <Link href="/">
                                        <motion.button
                                            whileHover={{ scale: 1.05, x: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg font-semibold transition-all"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            <span className="hidden sm:inline">Home</span>
                                        </motion.button>
                                    </Link>
                                    <div>
                                        <h1 className="text-3xl font-bold">Flight Management Dashboard</h1>
                                    </div>
                                </div>
                                <p className="text-secondary ml-0 sm:ml-20">Interactive Data Structures Visualization Platform</p>
                            </div>

                            <div className="flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setLearningMode(!learningMode)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${learningMode
                                        ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg shadow-purple-500/50'
                                        : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                                        }`}
                                >
                                    <BookOpen className="w-5 h-5" />
                                    <span className="hidden md:inline">Learning Mode</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setDemoMode(!demoMode)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${demoMode
                                        ? 'bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg shadow-green-500/50'
                                        : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                                        }`}
                                >
                                    {demoMode ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                    <span className="hidden md:inline">Demo Mode</span>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Structure Tabs */}
                <div className="glass-card p-4 mb-6">
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {structures.map((structure) => (
                            <motion.button
                                key={structure.id}
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveStructure(structure.id)}
                                className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold whitespace-nowrap transition-all relative ${activeStructure === structure.id
                                    ? 'bg-white bg-opacity-20 shadow-xl'
                                    : 'bg-white bg-opacity-5 hover:bg-opacity-15'
                                    }`}
                                style={{
                                    border: activeStructure === structure.id
                                        ? `2px solid ${structure.color}`
                                        : '2px solid transparent',
                                    boxShadow: activeStructure === structure.id
                                        ? `0 0 20px ${structure.color}40, 0 4px 16px rgba(0,0,0,0.4)`
                                        : 'none',
                                }}
                            >
                                <structure.icon
                                    className="w-5 h-5 transition-all"
                                    style={{
                                        color: activeStructure === structure.id ? structure.color : '#94a3b8',
                                        filter: activeStructure === structure.id ? 'drop-shadow(0 0 8px currentColor)' : 'none'
                                    }}
                                />
                                <span className={activeStructure === structure.id ? 'text-white' : 'text-gray-300'}>
                                    {structure.name}
                                </span>
                                {activeStructure === structure.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full"
                                        style={{ backgroundColor: structure.color }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Visualizer Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeStructure}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderVisualizer()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
