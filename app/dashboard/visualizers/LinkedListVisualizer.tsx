'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, UserMinus, ArrowRight, GitBranch, RefreshCw, Search } from 'lucide-react';
import { PassengerList, type Passenger } from '@/lib/dataStructures';
import { generateId, getRandomName, generateEmail, generatePhone } from '@/lib/utils';

interface Props {
    learningMode: boolean;
    demoMode: boolean;
}

export default function LinkedListVisualizer({ learningMode, demoMode }: Props) {
    const [passengerList] = useState(() => new PassengerList());
    const [passengers, setPassengers] = useState<Passenger[]>([]);
    const [operation, setOperation] = useState<string>('');
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

    const addPassenger = () => {
        const name = getRandomName();
        const passenger: Passenger = {
            id: generateId(),
            name,
            email: generateEmail(name),
            phone: generatePhone(),
        };

        passengerList.addLast(passenger);
        setOperation(`Insert O(1): Added ${passenger.name} to end of list`);
        setPassengers(passengerList.toArray());
        setHighlightedIndex(passengerList.size() - 1);
        setTimeout(() => setHighlightedIndex(null), 800);
    };

    const addPassengerFirst = () => {
        const name = getRandomName();
        const passenger: Passenger = {
            id: generateId(),
            name,
            email: generateEmail(name),
            phone: generatePhone(),
        };

        passengerList.addFirst(passenger);
        setOperation(`Insert O(1): Added ${passenger.name} to front of list`);
        setPassengers(passengerList.toArray());
        setHighlightedIndex(0);
        setTimeout(() => setHighlightedIndex(null), 800);
    };

    const removeFirst = () => {
        const removed = passengerList.removeFirst();
        if (removed) {
            setOperation(`Delete O(1): Removed ${removed.name} from front`);
            setPassengers(passengerList.toArray());
        }
    };

    const removePassenger = (id: string) => {
        const success = passengerList.remove(id);
        if (success) {
            setOperation(`Delete O(n): Removed passenger (traversal required)`);
            setPassengers(passengerList.toArray());
        }
    };

    const runDemo = useCallback(async () => {
        for (let i = 0; i < 4; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            addPassenger();
        }
    }, [passengerList]);

    useEffect(() => {
        if (demoMode) {
            runDemo();
        }
    }, [demoMode, runDemo]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 panel relative overflow-hidden">
                <div className="flex items-center justify-between mb-8 z-10 relative">
                    <div>
                        <h2 className="text-2xl font-bold mb-1 text-shadow-sm flex items-center gap-2">
                            <GitBranch className="w-6 h-6 text-green-400" />
                            Linked List - Passenger Queue
                        </h2>
                        <p className="text-secondary text-sm">Dynamic nodes with O(1) insertion at ends</p>
                    </div>
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(74, 222, 128, 0.6)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={addPassengerFirst}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 border border-green-400/50 rounded-xl font-bold text-white shadow-lg text-sm flex items-center gap-2"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add First
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(22, 163, 74, 0.6)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={addPassenger}
                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-800 border border-green-500/50 rounded-xl font-bold text-white shadow-lg text-sm flex items-center gap-2"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add Last
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={removeFirst}
                            className="px-4 py-2 bg-white/5 border border-white/20 hover:border-red-400/50 hover:bg-red-500/20 rounded-xl font-bold text-white shadow-lg text-sm flex items-center gap-2 transition-colors"
                        >
                            <UserMinus className="w-4 h-4" />
                            Pop
                        </motion.button>
                    </div>
                </div>

                {/* Linked List Visualization */}
                <div className="relative min-h-[300px] flex items-center bg-black/20 rounded-2xl border border-white/5 p-6 overflow-hidden">
                    <div className="absolute inset-0 grid-pattern opacity-30" />

                    <div className="overflow-x-auto pb-6 w-full px-2 no-scrollbar z-10">
                        {passengers.length === 0 ? (
                            <div className="text-center w-full py-12 text-secondary flex flex-col items-center">
                                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                    <UserPlus className="w-10 h-10 text-green-400 opacity-60" />
                                </div>
                                <p className="text-lg font-medium">Queue is empty</p>
                                <p className="text-sm opacity-60">Add passengers to start the queue</p>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 min-w-max pt-8">
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-[10px] font-bold text-green-400 tracking-widest">HEAD</span>
                                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#4ade80]" />
                                    <div className="h-8 w-0.5 bg-gradient-to-b from-green-500 to-transparent opacity-50" />
                                </div>

                                <AnimatePresence mode="popLayout">
                                    {passengers.map((passenger, index) => (
                                        <motion.div
                                            key={passenger.id}
                                            initial={{ opacity: 0, scale: 0.5, x: -50 }}
                                            animate={{
                                                opacity: 1,
                                                scale: highlightedIndex === index ? 1.05 : 1,
                                                x: 0,
                                            }}
                                            exit={{ opacity: 0, scale: 0.5, y: 50 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            className="flex items-center"
                                        >
                                            {/* Node */}
                                            <motion.div
                                                className={`glass-card p-4 w-60 relative group transition-all duration-300 ${highlightedIndex === index
                                                    ? 'border-green-400 ring-2 ring-green-400/30'
                                                    : 'hover:border-green-400/50'
                                                    }`}
                                                whileHover={{ y: -5 }}
                                                style={{
                                                    background: highlightedIndex === index
                                                        ? 'linear-gradient(135deg, rgba(74, 222, 128, 0.15) 0%, rgba(6, 78, 59, 0.8) 100%)'
                                                        : undefined
                                                }}
                                            >
                                                <div className="absolute -top-3 left-4">
                                                    <span className="text-[10px] font-bold font-mono bg-green-600 text-white px-2 py-0.5 rounded shadow-lg">
                                                        NODE {index}
                                                    </span>
                                                </div>

                                                <div className="flex items-start justify-between mb-2 mt-1">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                                                        {passenger.name.charAt(0)}
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.2, color: '#ef4444' }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => removePassenger(passenger.id)}
                                                        className="text-white/40 hover:text-red-400 transition-colors"
                                                    >
                                                        <UserMinus className="w-4 h-4" />
                                                    </motion.button>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="font-bold text-white truncate">{passenger.name}</div>
                                                    <div className="text-[10px] text-secondary truncate font-mono bg-black/20 px-1.5 py-0.5 rounded">
                                                        {passenger.email}
                                                    </div>
                                                    <div className="text-[10px] text-secondary">{passenger.phone}</div>
                                                </div>

                                                {/* Pointer visualization */}
                                                <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center">
                                                    <span className="text-[10px] text-secondary">next:</span>
                                                    <span className={`text-[10px] font-mono ${index < passengers.length - 1 ? 'text-green-300' : 'text-white/30'}`}>
                                                        {index < passengers.length - 1 ? `Node ${index + 1}` : 'NULL'}
                                                    </span>
                                                </div>
                                            </motion.div>

                                            {/* Arrow */}
                                            {index < passengers.length - 1 ? (
                                                <div className="px-2 flex items-center justify-center">
                                                    <motion.div
                                                        animate={{ x: [0, 4, 0], opacity: [0.5, 1, 0.5] }}
                                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                                    >
                                                        <ArrowRight className="w-6 h-6 text-green-400/80" />
                                                    </motion.div>
                                                </div>
                                            ) : (
                                                <div className="px-3 flex flex-col items-center gap-1 opacity-50">
                                                    <div className="w-8 h-0.5 bg-white/20" />
                                                    <span className="text-[10px] font-mono">NULL</span>
                                                </div>
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
                            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3 shadow-lg backdrop-blur-sm">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <Search className="w-5 h-5 text-green-400" />
                                </div>
                                <p className="font-mono text-sm text-green-100">{operation}</p>
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
                        className="glass-card p-6 border-l-4 border-l-green-500"
                    >
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-2xl">📚</span> Properties
                        </h3>
                        <div className="space-y-5 text-sm">
                            <div className="p-3 bg-white/5 rounded-lg">
                                <h4 className="font-bold text-green-300 mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-400" /> Time Complexity
                                </h4>
                                <ul className="space-y-2 text-secondary ml-1">
                                    <li className="flex justify-between">Access <span className="text-yellow-400 font-mono font-bold bg-yellow-400/10 px-2 rounded">O(n)</span></li>
                                    <li className="flex justify-between">Search <span className="text-yellow-400 font-mono font-bold bg-yellow-400/10 px-2 rounded">O(n)</span></li>
                                    <li className="flex justify-between">Insert (Head) <span className="text-green-400 font-mono font-bold bg-green-400/10 px-2 rounded">O(1)</span></li>
                                    <li className="flex justify-between">Delete (Head) <span className="text-green-400 font-mono font-bold bg-green-400/10 px-2 rounded">O(1)</span></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-green-300 mb-2">Space Complexity</h4>
                                <p className="text-secondary p-2 border border-white/10 rounded-lg bg-black/20">
                                    <span className="text-green-400 font-mono font-bold">O(n)</span> - Extra memory for pointers
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-green-300 mb-2">Key Features</h4>
                                <ul className="space-y-2 text-secondary">
                                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Dynamic Size</li>
                                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Efficient Insertion/Deletion</li>
                                    <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Sequential Access</li>
                                </ul>
                            </div>

                            <div className="code-block text-xs">
                                <code>{`// Node Structure
class Node {
  data: Passenger
  next: Node | null
}

// Insert Head (O(1))
node.next = head
head = node`}</code>
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 relative overflow-hidden group"
                >
                    <div className="absolute -right-4 -top-4 w-40 h-40 bg-green-500/10 rounded-full blur-[50px] group-hover:bg-green-500/20 transition-colors" />

                    <h3 className="text-xl font-bold mb-4 relative z-10 flex items-center gap-2">
                        <span className="text-green-400">📊</span> Live Statistics
                    </h3>
                    <div className="relative z-10 space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-xs font-bold text-secondary uppercase tracking-widest border-b border-white/10 pb-2">
                            <div>Metric</div>
                            <div className="text-right">Value</div>
                        </div>

                        <div className="space-y-1">
                            <div className="grid grid-cols-2 gap-4 p-3 bg-gradient-to-r from-white/5 to-transparent rounded-lg border border-white/5 hover:border-green-500/30 transition-colors group/row">
                                <div className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 group-hover/row:shadow-[0_0_8px_rgba(74,222,128,1)] transition-shadow"></div>
                                    Total Passengers
                                </div>
                                <div className="text-right font-mono font-bold text-lg text-white text-shadow-sm">
                                    {passengers.length}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 p-3 bg-gradient-to-r from-white/5 to-transparent rounded-lg border border-white/5 hover:border-green-500/30 transition-colors group/row">
                                <div className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 group-hover/row:shadow-[0_0_8px_rgba(250,204,21,1)] transition-shadow"></div>
                                    Total Memory
                                </div>
                                <div className="text-right font-mono font-bold text-sm text-green-300">
                                    {passengers.length * 48} <span className="text-[10px] text-secondary">bytes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
