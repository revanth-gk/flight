'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, LogOut, Users } from 'lucide-react';
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

        queue.enqueue(passenger);
        const newPassengers = queue.toArray();
        setOperation(`Enqueue O(1): Added ${passenger.name} to queue`);
        setPassengers(newPassengers);
        setAnimatingIndex(newPassengers.length - 1);
        setTimeout(() => setAnimatingIndex(null), 600);
    };

    const dequeuePassenger = () => {
        const removed = queue.dequeue();
        if (removed) {
            setOperation(`Dequeue O(1): ${removed.name} boarded the flight`);
            setAnimatingIndex(0);
            setTimeout(() => {
                setPassengers(queue.toArray());
                setAnimatingIndex(null);
            }, 500);
        }
    };

    const viewFront = () => {
        const front = queue.front();
        if (front) {
            setOperation(`Front O(1): Next to board is ${front.name}`);
            setAnimatingIndex(0);
            setTimeout(() => setAnimatingIndex(null), 1500);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">Queue - Boarding Queue</h2>
                        <p className="text-secondary text-sm">FIFO structure for fair passenger boarding</p>
                    </div>
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={enqueuePassenger}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 rounded-lg font-semibold text-sm flex items-center gap-2"
                        >
                            <UserPlus className="w-4 h-4" />
                            Enqueue
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={dequeuePassenger}
                            className="px-4 py-2 bg-white bg-opacity-10 rounded-lg font-semibold text-sm flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Dequeue
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={viewFront}
                            className="px-4 py-2 bg-white bg-opacity-10 rounded-lg font-semibold text-sm flex items-center gap-2"
                        >
                            <Users className="w-4 h-4" />
                            Front
                        </motion.button>
                    </div>
                </div>

                {/* Queue Visualization */}
                <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="text-xs font-mono bg-red-500 bg-opacity-20 px-3 py-1 rounded">
                            FRONT (Exit)
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-r from-red-500 to-transparent"></div>
                        <div className="text-xs font-mono bg-red-500 bg-opacity-20 px-3 py-1 rounded">
                            REAR (Entry)
                        </div>
                    </div>

                    <div className="overflow-x-auto pb-4">
                        {passengers.length === 0 ? (
                            <div className="text-center py-12 text-secondary">
                                <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                <p>Queue is empty. Enqueue passengers to begin.</p>
                            </div>
                        ) : (
                            <div className="flex items-stretch gap-3">
                                <AnimatePresence mode="popLayout">
                                    {passengers.map((passenger, index) => (
                                        <motion.div
                                            key={passenger.id}
                                            initial={{ opacity: 0, x: 100, scale: 0.8 }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                                scale: animatingIndex === index ? 1.1 : 1,
                                                boxShadow: animatingIndex === index ? '0 0 30px rgba(244, 92, 67, 0.6)' : 'none'
                                            }}
                                            exit={{ opacity: 0, x: -100, scale: 0.8 }}
                                            transition={{
                                                duration: 0.5,
                                                type: 'spring'
                                            }}
                                            className="flex-shrink-0"
                                        >
                                            <div className="glass-card p-4 w-52 h-full relative">
                                                {index === 0 && (
                                                    <div className="absolute -top-3 left-4 text-xs font-mono bg-red-500 px-2 py-1 rounded z-10">
                                                        NEXT
                                                    </div>
                                                )}

                                                <div className="flex items-start justify-between mb-2">
                                                    <span className="text-xs font-mono bg-red-500 bg-opacity-20 px-2 py-1 rounded">
                                                        Position {index + 1}
                                                    </span>
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="font-bold text-lg">{passenger.name}</div>
                                                    <div className="text-xs text-secondary truncate">{passenger.email}</div>
                                                    <div className="text-xs text-secondary">{passenger.phone}</div>
                                                </div>

                                                {/* Queue position indicator */}
                                                <div className="mt-3 pt-3 border-t border-white border-opacity-10">
                                                    <div className="text-xs text-secondary">
                                                        {index === 0 ? 'Boarding now' : `Wait: ${index} ahead`}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Flow indicator */}
                    <div className="flex items-center gap-2 mt-4">
                        <div className="text-xs text-secondary">Flow direction:</div>
                        <motion.div
                            animate={{ x: [-5, 5, -5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="flex-1 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full"
                        ></motion.div>
                        <div className="text-xs text-secondary">→ Exit</div>
                    </div>
                </div>

                {operation && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg"
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
                        <h3 className="text-xl font-bold mb-4">📚 Queue Properties</h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <h4 className="font-semibold text-red-400 mb-2">Time Complexity</h4>
                                <ul className="space-y-1 text-secondary">
                                    <li>• Enqueue: <span className="text-green-400 font-mono">O(1)</span></li>
                                    <li>• Dequeue: <span className="text-green-400 font-mono">O(1)*</span></li>
                                    <li>• Front: <span className="text-green-400 font-mono">O(1)</span></li>
                                    <li className="text-xs">* With circular buffer implementation</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-red-400 mb-2">Space Complexity</h4>
                                <p className="text-secondary">
                                    <span className="text-red-400 font-mono">O(n)</span>
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-red-400 mb-2">Key Features</h4>
                                <ul className="space-y-1 text-secondary">
                                    <li>✓ FIFO (First In First Out)</li>
                                    <li>✓ Fair ordering</li>
                                    <li>✓ BFS traversal</li>
                                    <li>✓ Task scheduling</li>
                                </ul>
                            </div>

                            <div className="code-block">
                                <code>{`// Queue Operations\nqueue.enqueue(passenger) // O(1)\n\nconst next = queue.dequeue() // O(1)\n\nconst first = queue.front() // O(1)`}</code>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold mb-4">Statistics</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-secondary">Queue Size:</span>
                            <span className="font-bold text-xl">{passengers.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-secondary">Front Passenger:</span>
                            <span className="font-mono text-sm truncate max-w-[150px]">
                                {passengers.length > 0 ? passengers[0].name : 'None'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-secondary">Is Empty:</span>
                            <span className="font-mono text-sm">{passengers.length === 0 ? 'true' : 'false'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-secondary">Wait Time:</span>
                            <span className="font-mono text-sm">{passengers.length * 2} min</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
