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
        <div className="min-h-screen grid-pattern p-4 sm:p-6 lg:p-8">
            <div className="max-w-[1920px] mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="panel mb-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                        <div className="w-64 h-64 bg-indigo-500 rounded-full blur-[100px]" />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center relative z-10">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                                <Link href="/">
                                    <motion.button
                                        whileHover={{ scale: 1.05, x: -4 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="btn-gradient p-2.5 rounded-xl shadow-lg flex items-center justify-center group"
                                    >
                                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                    </motion.button>
                                </Link>
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-bold text-shadow-sm tracking-tight">
                                        Flight Management <span className="text-gradient">Dashboard</span>
                                    </h1>
                                </div>
                            </div>
                            <p className="text-secondary text-lg ml-0 sm:ml-[4.5rem]">
                                Interactive Data Structures Visualization Platform
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02, translateY: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setLearningMode(!learningMode)}
                                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all border ${learningMode
                                    ? 'bg-purple-600/20 border-purple-500 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                                    : 'bg-white/5 border-white/10 text-secondary hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <BookOpen className={`w-5 h-5 ${learningMode ? 'text-purple-400' : ''}`} />
                                <span className="hidden sm:inline">Learning Mode</span>
                                {learningMode && (
                                    <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-pulse ml-2" />
                                )}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02, translateY: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setDemoMode(!demoMode)}
                                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all border ${demoMode
                                    ? 'bg-green-600/20 border-green-500 text-green-200 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                                    : 'bg-white/5 border-white/10 text-secondary hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {demoMode ? <Pause className="w-5 h-5 text-green-400" /> : <Play className="w-5 h-5" />}
                                <span className="hidden sm:inline">Demo Mode</span>
                                {demoMode && (
                                    <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse ml-2" />
                                )}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Data Structure Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-2 mb-8 sticky top-4 z-50 backdrop-blur-2xl bg-black/40 border-white/10"
                >
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar p-1">
                        {structures.map((structure) => (
                            <motion.button
                                key={structure.id}
                                onClick={() => setActiveStructure(structure.id)}
                                className={`flex items-center gap-3 px-5 py-3 rounded-lg font-bold whitespace-nowrap transition-all relative group flex-shrink-0 ${activeStructure === structure.id
                                    ? 'text-white'
                                    : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                {activeStructure === structure.id && (
                                    <motion.div
                                        layoutId="activeTabBackground"
                                        className="absolute inset-0 rounded-lg"
                                        style={{
                                            background: `linear-gradient(135deg, ${structure.color}33 0%, ${structure.color}11 100%)`,
                                            border: `1px solid ${structure.color}66`,
                                            boxShadow: `0 0 20px ${structure.color}22`
                                        }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}

                                <span className="relative z-10 flex items-center gap-3">
                                    <structure.icon
                                        className={`w-5 h-5 transition-all duration-300 ${activeStructure === structure.id ? 'scale-110' : 'group-hover:scale-110'}`}
                                        style={{
                                            color: activeStructure === structure.id ? structure.color : undefined,
                                            filter: activeStructure === structure.id ? `drop-shadow(0 0 8px ${structure.color})` : 'none'
                                        }}
                                    />
                                    {structure.name}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Visualizer Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeStructure}
                        initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {renderVisualizer()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
