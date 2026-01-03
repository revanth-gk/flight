'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, UserMinus, ArrowRight } from 'lucide-react';
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
            <div className="lg:col-span-2 glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">Linked List - Passenger Queue</h2>
                        <p className="text-secondary text-sm">Dynamic nodes with O(1) insertion at ends</p>
                    </div>
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={addPassengerFirst}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 rounded-lg font-semibold text-sm flex items-center gap-2"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add First
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={addPassenger}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 rounded-lg font-semibold text-sm flex items-center gap-2"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add Last
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={removeFirst}
                            className="px-4 py-2 bg-white bg-opacity-10 rounded-lg font-semibold text-sm flex items-center gap-2"
                        >
                            <UserMinus className="w-4 h-4" />
                            Remove First
                        </motion.button>
                    </div>
                </div>

                {/* Linked List Visualization */}
                <div className="overflow-x-auto pb-4">
                    {passengers.length === 0 ? (
                        <div className="text-center py-12 text-secondary">
                            <UserPlus className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p>No passengers in list. Click "Add" to begin.</p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 min-w-max">
                            <div className="text-xs font-mono bg-green-500 bg-opacity-20 px-2 py-1 rounded">
                                HEAD
                            </div>
                            <AnimatePresence mode="popLayout">
                                {passengers.map((passenger, index) => (
                                    <motion.div
                                        key={passenger.id}
                                        initial={{ opacity: 0, scale: 0.8, x: -50 }}
                                        animate={{
                                            opacity: 1,
                                            scale: highlightedIndex === index ? 1.1 : 1,
                                            x: 0,
                                            boxShadow: highlightedIndex === index ? '0 0 30px rgba(56, 239, 125, 0.6)' : 'none'
                                        }}
                                        exit={{ opacity: 0, scale: 0.8, x: 50 }}
                                        transition={{ duration: 0.5 }}
                                        className="flex items-center gap-2"
                                    >
                                        {/* Node */}
                                        <div className="glass-card p-4 w-56 relative group">
                                            <div className="flex items-start justify-between mb-2">
                                                <span className="text-xs font-mono bg-green-500 bg-opacity-20 px-2 py-1 rounded">
                                                    Node {index}
                                                </span>
                                                <motion.button
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => removePassenger(passenger.id)}
                                                    className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <UserMinus className="w-4 h-4" />
                                                </motion.button>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="font-bold">{passenger.name}</div>
                                                <div className="text-xs text-secondary truncate">{passenger.email}</div>
                                                <div className="text-xs text-secondary">{passenger.phone}</div>
                                            </div>

                                            {/* Pointer visualization */}
                                            <div className="mt-2 pt-2 border-t border-white border-opacity-10">
                                                <div className="text-xs text-green-400 font-mono">
                                                    next → {index < passengers.length - 1 ? `Node ${index + 1}` : 'null'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        {index < passengers.length - 1 && (
                                            <motion.div
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                className="flex items-center"
                                            >
                                                <motion.div
                                                    animate={{ x: [0, 5, 0] }}
                                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                                >
                                                    <ArrowRight className="w-8 h-8 text-green-400" />
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div className="text-xs font-mono bg-green-500 bg-opacity-20 px-2 py-1 rounded">
                                TAIL
                            </div>
                        </div>
                    )}
                </div>

                {operation && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-green-500 bg-opacity-10 border border-green-500 rounded-lg"
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
                        <h3 className="text-xl font-bold mb-4">📚 Linked List Properties</h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <h4 className="font-semibold text-green-400 mb-2">Time Complexity</h4>
                                <ul className="space-y-1 text-secondary">
                                    <li>• Access: <span className="text-yellow-400 font-mono">O(n)</span></li>
                                    <li>• Search: <span className="text-yellow-400 font-mono">O(n)</span></li>
                                    <li>• Insert (head/tail): <span className="text-green-400 font-mono">O(1)</span></li>
                                    <li>• Delete (head): <span className="text-green-400 font-mono">O(1)</span></li>
                                    <li>• Delete (middle): <span className="text-yellow-400 font-mono">O(n)</span></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-green-400 mb-2">Space Complexity</h4>
                                <p className="text-secondary">
                                    <span className="text-green-400 font-mono">O(n)</span> - Extra space for pointers
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-green-400 mb-2">Key Features</h4>
                                <ul className="space-y-1 text-secondary">
                                    <li>✓ Dynamic size</li>
                                    <li>✓ Fast insertion/deletion at ends</li>
                                    <li>✓ No wasted space</li>
                                    <li>✗ Sequential access only</li>
                                </ul>
                            </div>

                            <div className="code-block">
                                <code>{`// Node Structure\nclass Node {\n  data: Passenger\n  next: Node | null\n}\n\n// Insert at head - O(1)\nnewNode.next = head\nhead = newNode`}</code>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold mb-4">Statistics</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-secondary">Total Passengers:</span>
                            <span className="font-bold text-xl">{passengers.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-secondary">Memory per Node:</span>
                            <span className="font-mono text-sm">~48 bytes</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-secondary">Total Memory:</span>
                            <span className="font-mono text-sm">{passengers.length * 48} bytes</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
