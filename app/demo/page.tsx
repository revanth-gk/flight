'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DemoPage() {
    const [currentDemo, setCurrentDemo] = useState(0);

    const demos = [
        {
            title: 'Array Operations',
            description: 'Watch flights being added to the schedule with O(1) access time',
            color: '#667eea',
        },
        {
            title: 'Linked List Traversal',
            description: 'See passengers being added and removed with pointer animations',
            color: '#38ef7d',
        },
        {
            title: 'Stack Push/Pop',
            description: 'Operation history tracked with LIFO visualization',
            color: '#f2c94c',
        },
        {
            title: 'Queue Processing',
            description: 'FIFO boarding queue with smooth enqueue/dequeue animations',
            color: '#f45c43',
        },
        {
            title: 'Tree Search',
            description: 'Binary search tree with O(log n) route searching',
            color: '#764ba2',
        },
        {
            title: 'HashMap Lookup',
            description: 'Hash-based seat booking with collision handling',
            color: '#11998e',
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDemo((prev) => (prev + 1) % demos.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen grid-pattern flex items-center justify-center p-6">
            <div className="max-w-4xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-12 text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="inline-block mb-6"
                    >
                        <Sparkles className="w-16 h-16 text-purple-500" />
                    </motion.div>

                    <h1 className="text-5xl font-bold mb-4">
                        <span className="text-gradient">Demo Mode</span>
                    </h1>

                    <p className="text-xl text-secondary mb-12">
                        Auto-running demonstrations of all data structures
                    </p>

                    {/* Demo Carousel */}
                    <div className="mb-12 min-h-[200px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentDemo}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div
                                    className="p-8 rounded-2xl mb-6"
                                    style={{
                                        background: `linear-gradient(135deg, ${demos[currentDemo].color}22 0%, ${demos[currentDemo].color}44 100%)`,
                                        border: `2px solid ${demos[currentDemo].color}`,
                                    }}
                                >
                                    <h2 className="text-3xl font-bold mb-4" style={{ color: demos[currentDemo].color }}>
                                        {demos[currentDemo].title}
                                    </h2>
                                    <p className="text-lg text-secondary">
                                        {demos[currentDemo].description}
                                    </p>
                                </div>

                                {/* Progress Dots */}
                                <div className="flex justify-center gap-2">
                                    {demos.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentDemo(index)}
                                            className={`w-3 h-3 rounded-full transition-all ${index === currentDemo
                                                ? 'bg-purple-500 w-8'
                                                : 'bg-white bg-opacity-20'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center">
                        <Link href="/dashboard">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-gradient text-lg px-8 py-4 flex items-center gap-3"
                            >
                                <PlayCircle className="w-6 h-6" />
                                Try Interactive Dashboard
                            </motion.button>
                        </Link>
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="glass-card px-8 py-4 text-lg font-semibold"
                            >
                                Back to Home
                            </motion.button>
                        </Link>
                    </div>

                    {/* Feature Highlights */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        <div>
                            <div className="text-3xl mb-2">⚡</div>
                            <h3 className="font-bold mb-2">Real-time Visualization</h3>
                            <p className="text-sm text-secondary">
                                Every operation animated with smooth transitions
                            </p>
                        </div>
                        <div>
                            <div className="text-3xl mb-2">🎓</div>
                            <h3 className="font-bold mb-2">Learning Mode</h3>
                            <p className="text-sm text-secondary">
                                Complexity analysis and pseudocode for each operation
                            </p>
                        </div>
                        <div>
                            <div className="text-3xl mb-2">🎨</div>
                            <h3 className="font-bold mb-2">Beautiful UI</h3>
                            <p className="text-sm text-secondary">
                                Dark theme with glassmorphism and premium effects
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
