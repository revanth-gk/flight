'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, LogOut, Users, Key, MonitorPlay } from 'lucide-react';
import { BoardingQueue, type Passenger } from '@/lib/dataStructures';
import { generateId, getRandomName, generateEmail, generatePhone } from '@/lib/utils';

interface Props {
    learningMode: boolean;
    demoMode: boolean;
}

export default function QueueVisualizer({ learningMode, demoMode }: Props) {
    const [queue] = useState(() => new BoardingQueue<Passenger>());
    const [passengers, setPassengers] = useState<Passenger[]>([]);
    const [operation, setOperation] = useState<string>('');
    const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

    useEffect(() => {
        if (demoMode) {
            runDemo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [demoMode]);

    const runDemo = async () => {
        for (let i = 0; i < 5; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            enqueuePassenger();
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
        for (let i = 0; i < 2; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            dequeuePassenger();
        }
    };

    const enqueuePassenger = () => {
        const name = getRandomName();
        const passenger: Passenger = {
            id: generateId(),
            name,
            email: generateEmail(name),
            phone: generatePhone(),
        };

        const newPassengers = [...passengers, passenger];
        queue.enqueue(passenger); // Sync logical state
        setOperation(`Enqueue O(1): Added ${passenger.name} to queue`);
        setPassengers(newPassengers);
        setAnimatingIndex(newPassengers.length - 1);
        setTimeout(() => setAnimatingIndex(null), 600);
    };

    const dequeuePassenger = () => {
        if (passengers.length === 0) return;
        const removed = passengers[0];
        setOperation(`Dequeue O(1): ${removed.name} boarded the flight`);
        setAnimatingIndex(0);

        setTimeout(() => {
            queue.dequeue(); // Sync logical state
            setPassengers(prev => prev.slice(1));
            setAnimatingIndex(null);
        }, 500);
    };

    const viewFront = () => {
        const front = passengers[0];
        if (front) {
            setOperation(`Front O(1): Next to board is ${front.name}`);
            setAnimatingIndex(0);
            setTimeout(() => setAnimatingIndex(null), 1500);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 panel relative overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-8 z-10 relative">
                    <div>
                        <h2 className="text-2xl font-bold mb-1 text-shadow-sm flex items-center gap-2">
                            <Users className="w-6 h-6 text-orange-500" />
                            Queue - Boarding Line
                        </h2>
                        <p className="text-secondary text-sm">FIFO structure for fair passenger boarding</p>
                    </div>
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(249, 115, 22, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={enqueuePassenger}
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold text-white shadow-lg text-sm flex items-center gap-2"
                        >
                            <UserPlus className="w-4 h-4" />
                            Enqueue
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={dequeuePassenger}
                            className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl font-bold text-white shadow-lg text-sm flex items-center gap-2 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Dequeue
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={viewFront}
                            className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl font-bold text-white shadow-lg text-sm flex items-center gap-2 transition-colors"
                        >
                            <MonitorPlay className="w-4 h-4" />
                            Front
                        </motion.button>
                    </div>
                </div>

                {/* Queue Visualization */}
                <div className="flex-1 relative min-h-[350px] bg-black/20 rounded-2xl border border-white/5 p-6 overflow-hidden flex flex-col">
                    <div className="absolute inset-0 grid-pattern opacity-30" />

                    <div className="flex items-center gap-4 mb-8 z-10 w-full">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]" />
                            <span className="text-xs font-bold text-red-500 tracking-widest uppercase">Front (Exit)</span>
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-r from-red-500 via-orange-500 to-transparent opacity-50 relative">
                            <motion.div
                                animate={{ x: [-100, 100] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-orange-500 tracking-widest uppercase">Rear (Entry)</span>
                            <div className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_10px_#f97316]" />
                        </div>
                    </div>

                    <div className="overflow-x-auto pb-4 no-scrollbar flex-1 flex items-center z-10">
                        {passengers.length === 0 ? (
                            <div className="w-full text-center text-secondary flex flex-col items-center justify-center">
                                <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                    <Users className="w-10 h-10 text-orange-500 opacity-60" />
                                </div>
                                <p className="text-lg font-medium">Queue is empty</p>
                                <p className="text-sm opacity-60">Enqueue passengers to start boarding</p>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 px-4 min-w-max mx-auto">
                                <AnimatePresence mode="popLayout">
                                    {passengers.map((passenger, index) => (
                                        <motion.div
                                            key={passenger.id}
                                            layout
                                            initial={{ opacity: 0, x: 100, scale: 0.8 }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                                scale: animatingIndex === index ? 1.05 : 1,
                                                zIndex: passengers.length - index
                                            }}
                                            exit={{ opacity: 0, x: -100, scale: 0.8, filter: "blur(10px)" }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 400,
                                                damping: 25
                                            }}
                                            className="relative"
                                        >
                                            <div
                                                className={`glass-card p-4 w-48 relative transition-all duration-300 ${animatingIndex === index
                                                        ? 'border-orange-500 ring-2 ring-orange-500/30'
                                                        : 'hover:border-orange-500/50'
                                                    }`}
                                                style={{
                                                    background: animatingIndex === index
                                                        ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(124, 45, 18, 0.8) 100%)'
                                                        : undefined
                                                }}
                                            >
                                                {index === 0 && (
                                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 w-full text-center">
                                                        <span className="text-[10px] font-bold font-mono bg-red-500 text-white px-2 py-0.5 rounded shadow-lg uppercase tracking-wider">
                                                            Boarding Now
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-3 mb-3 mt-1">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-sm truncate w-28">{passenger.name}</div>
                                                        <div className="text-[10px] text-secondary font-mono">
                                                            ID: {passenger.id.substring(0, 4)}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px]">
                                                    <span className="text-secondary">Est. Wait</span>
                                                    <span className="font-mono font-bold text-orange-300">{index * 2}m</span>
                                                </div>
                                            </div>

                                            {/* Connector */}
                                            {index < passengers.length - 1 && (
                                                <div className="absolute top-1/2 -right-6 w-4 h-[2px] bg-white/10"></div>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
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
                            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center gap-3 shadow-lg backdrop-blur-sm">
                                <div className="p-2 bg-orange-500/20 rounded-lg">
                                    <MonitorPlay className="w-5 h-5 text-orange-500" />
                                </div>
                                <p className="font-mono text-sm text-orange-100">{operation}</p>
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
                        className="glass-card p-6 border-l-4 border-l-orange-500"
                    >
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-2xl">📚</span> Properties
                        </h3>
                        <div className="space-y-5 text-sm">
                            <div className="p-3 bg-white/5 rounded-lg">
                                <h4 className="font-bold text-orange-500 mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-orange-500" /> Time Complexity
                                </h4>
                                <ul className="space-y-2 text-secondary ml-1">
                                    <li className="flex justify-between">Enqueue <span className="text-green-400 font-mono font-bold bg-green-400/10 px-2 rounded">O(1)</span></li>
                                    <li className="flex justify-between">Dequeue <span className="text-green-400 font-mono font-bold bg-green-400/10 px-2 rounded">O(1)</span></li>
                                    <li className="flex justify-between">Front <span className="text-green-400 font-mono font-bold bg-green-400/10 px-2 rounded">O(1)</span></li>
                                    <li className="flex justify-between">Search <span className="text-red-400 font-mono font-bold bg-red-400/10 px-2 rounded">O(n)</span></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-orange-500 mb-2">Space Complexity</h4>
                                <p className="text-secondary p-2 border border-white/10 rounded-lg bg-black/20">
                                    <span className="text-orange-500 font-mono font-bold">O(n)</span> - Linear growth
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-orange-500 mb-2">Key Features</h4>
                                <ul className="space-y-2 text-secondary">
                                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span> FIFO (First In First Out)</li>
                                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Fair resource scheduling</li>
                                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Buffer management</li>
                                </ul>
                            </div>

                            <div className="code-block text-xs">
                                <code>{`// Queue Operations
queue.enqueue(x)   // O(1)
const x = queue.dequeue() // O(1)
const front = queue.peek() // O(1)`}</code>
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 relative overflow-hidden group"
                >
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/20 rounded-full blur-xl group-hover:bg-orange-500/30 transition-colors" />

                    <h3 className="text-xl font-bold mb-4 relative z-10">Statistics</h3>
                    <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <span className="text-secondary">People in Line</span>
                            <span className="font-bold text-2xl text-white">{passengers.length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <span className="text-secondary">Next Boarding</span>
                            <span className="font-mono text-sm text-orange-500 truncate max-w-[120px]">
                                {passengers.length > 0 ? passengers[0].name.split(' ')[0] : '-'}
                            </span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-2">
                            <motion.div
                                className="h-full bg-orange-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((passengers.length / 10) * 100, 100)}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <div className="text-xs text-center text-muted">
                            Queue Capacity Usage
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
