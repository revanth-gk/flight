'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, RotateCcw, Eye, Layers, Search, AlertCircle } from 'lucide-react';
import { OperationStack, type Operation } from '@/lib/dataStructures';
import { generateId } from '@/lib/utils';

interface Props {
    learningMode: boolean;
    demoMode: boolean;
}

export default function StackVisualizer({ learningMode, demoMode }: Props) {
    const [stack] = useState(() => new OperationStack<Operation>());
    const [operations, setOperations] = useState<Operation[]>([]);
    const [lastOp, setLastOp] = useState<string>('');
    const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

    const operationTypes = [
        'Flight Search',
        'Booking Created',
        'Seat Selected',
        'Payment Processed',
        'Ticket Issued',
        'Check-in Complete'
    ];

    const pushOperation = (opType: string = 'Generic Operation') => {
        const operation: Operation = {
            id: generateId(),
            type: opType,
            dataStructure: 'Stack',
            operation: 'push',
            timestamp: new Date(),
            payload: { action: opType },
            timeComplexity: 'O(1)',
            spaceComplexity: 'O(1)',
        };

        stack.push(operation);
        const newOps = stack.toArray();
        setAnimatingIndex(newOps.length - 1);
        setOperations(newOps);
        setLastOp(`Push O(1): Added "${opType}" to stack`);
        setTimeout(() => setAnimatingIndex(null), 500);
    };

    const popOperation = () => {
        const popped = stack.pop();
        if (popped) {
            setLastOp(`Pop O(1): Removed "${popped.type}" from stack`);
            const newOps = stack.toArray();
            setAnimatingIndex(newOps.length);
            setTimeout(() => {
                setOperations(newOps);
                setAnimatingIndex(null);
            }, 400);
        }
    };

    const peekOperation = () => {
        const top = stack.peek();
        if (top) {
            setLastOp(`Peek O(1): Top element is "${top.type}"`);
            setAnimatingIndex(operations.length - 1);
            setTimeout(() => setAnimatingIndex(null), 1500);
        }
    };

    const runDemo = useCallback(async () => {
        const ops = ['Flight Search', 'Booking Created', 'Seat Selected', 'Payment Processed'];
        for (const op of ops) {
            await new Promise(resolve => setTimeout(resolve, 1200));
            pushOperation(op);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (demoMode) {
            runDemo();
        }
    }, [demoMode, runDemo]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 panel relative overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-8 z-10 relative">
                    <div>
                        <h2 className="text-2xl font-bold mb-1 text-shadow-sm flex items-center gap-2">
                            <Layers className="w-6 h-6 text-yellow-500" />
                            Stack - Operation History
                        </h2>
                        <p className="text-secondary text-sm">LIFO structure for undo/redo operations</p>
                    </div>
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(234, 179, 8, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => pushOperation(operationTypes[Math.floor(Math.random() * operationTypes.length)])}
                            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-700 rounded-xl font-bold text-white shadow-lg text-sm flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Push
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={popOperation}
                            className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl font-bold text-white shadow-lg text-sm flex items-center gap-2 transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Pop
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={peekOperation}
                            className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl font-bold text-white shadow-lg text-sm flex items-center gap-2 transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            Peek
                        </motion.button>
                    </div>
                </div>

                {/* Stack Visualization */}
                <div className="flex-1 relative min-h-[400px] bg-black/20 rounded-2xl border border-white/5 p-6 overflow-hidden flex flex-col justify-end">
                    <div className="absolute inset-0 grid-pattern opacity-30" />

                    <div className="flex flex-col-reverse gap-3 w-full max-w-md mx-auto z-10 pb-4">
                        {operations.length === 0 ? (
                            <div className="text-center py-12 text-secondary flex flex-col items-center absolute inset-0 justify-center">
                                <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                    <Layers className="w-10 h-10 text-yellow-500 opacity-60" />
                                </div>
                                <p className="text-lg font-medium">Stack is empty</p>
                                <p className="text-sm opacity-60">Push operations to begin</p>
                            </div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {operations.map((op, index) => (
                                    <motion.div
                                        key={op.id}
                                        initial={{ opacity: 0, y: -100, scale: 0.8 }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            scale: animatingIndex === index ? 1.05 : 1,
                                            zIndex: index
                                        }}
                                        exit={{ opacity: 0, y: -50, scale: 0.8, transition: { duration: 0.2 } }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 25
                                        }}
                                        className="relative w-full"
                                    >
                                        <div
                                            className={`glass-card p-4 relative transition-all duration-300 ${animatingIndex === index
                                                    ? 'border-yellow-500 ring-2 ring-yellow-500/30'
                                                    : 'hover:border-yellow-500/50'
                                                }`}
                                            style={{
                                                background: animatingIndex === index
                                                    ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(133, 77, 14, 0.8) 100%)'
                                                    : undefined
                                            }}
                                        >
                                            {index === operations.length - 1 && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="absolute -top-3 -right-2 z-10"
                                                >
                                                    <span className="text-[10px] font-bold font-mono bg-yellow-500 text-black px-2 py-0.5 rounded shadow-lg uppercase tracking-wider">
                                                        Top
                                                    </span>
                                                </motion.div>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-mono font-bold text-xs border border-yellow-500/30">
                                                        {index}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-sm">{op.type}</div>
                                                        <div className="text-[10px] text-secondary font-mono">
                                                            {op.timestamp.toLocaleTimeString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-secondary font-mono">
                                                        {op.timeComplexity}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}

                        {/* Stack Base Visual */}
                        <div className="h-4 w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent rounded-full blur-sm mt-2" />
                    </div>
                </div>

                <AnimatePresence>
                    {lastOp && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            className="mt-4"
                        >
                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center gap-3 shadow-lg backdrop-blur-sm">
                                <div className="p-2 bg-yellow-500/20 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                                </div>
                                <p className="font-mono text-sm text-yellow-100">{lastOp}</p>
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
                        className="glass-card p-6 border-l-4 border-l-yellow-500"
                    >
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-2xl">📚</span> Properties
                        </h3>
                        <div className="space-y-5 text-sm">
                            <div className="p-3 bg-white/5 rounded-lg">
                                <h4 className="font-bold text-yellow-500 mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-yellow-500" /> Time Complexity
                                </h4>
                                <ul className="space-y-2 text-secondary ml-1">
                                    <li className="flex justify-between">Push <span className="text-green-400 font-mono font-bold bg-green-400/10 px-2 rounded">O(1)</span></li>
                                    <li className="flex justify-between">Pop <span className="text-green-400 font-mono font-bold bg-green-400/10 px-2 rounded">O(1)</span></li>
                                    <li className="flex justify-between">Peek <span className="text-green-400 font-mono font-bold bg-green-400/10 px-2 rounded">O(1)</span></li>
                                    <li className="flex justify-between">Search <span className="text-red-400 font-mono font-bold bg-red-400/10 px-2 rounded">O(n)</span></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-yellow-500 mb-2">Space Complexity</h4>
                                <p className="text-secondary p-2 border border-white/10 rounded-lg bg-black/20">
                                    <span className="text-yellow-500 font-mono font-bold">O(n)</span> - Linear growth
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-yellow-500 mb-2">Key Features</h4>
                                <ul className="space-y-2 text-secondary">
                                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span> LIFO (Last In First Out)</li>
                                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Undo/Redo operations</li>
                                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Backtracking algorithms</li>
                                </ul>
                            </div>

                            <div className="code-block text-xs">
                                <code>{`// Stack Operations
stack.push(op)     // O(1)
const last = stack.pop() // O(1)
const top = stack.peek() // O(1)`}</code>
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 relative overflow-hidden group"
                >
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-500/20 rounded-full blur-xl group-hover:bg-yellow-500/30 transition-colors" />

                    <h3 className="text-xl font-bold mb-4 relative z-10">Statistics</h3>
                    <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <span className="text-secondary">Stack Depth</span>
                            <span className="font-bold text-2xl text-white">{operations.length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <span className="text-secondary">Top Element</span>
                            <span className="font-mono text-sm text-yellow-500 truncate max-w-[120px]">
                                {operations.length > 0 ? operations[operations.length - 1].type.split(' ')[0] : '-'}
                            </span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-2">
                            <motion.div
                                className="h-full bg-yellow-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((operations.length / 10) * 100, 100)}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <div className="text-xs text-center text-muted">
                            Stack Capacity Usage
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
