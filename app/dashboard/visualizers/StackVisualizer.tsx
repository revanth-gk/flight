'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, RotateCcw, Eye, Layers } from 'lucide-react';
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
            <div className="lg:col-span-2 glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">Stack - Operation History</h2>
                        <p className="text-secondary text-sm">LIFO structure for undo/redo operations</p>
                    </div>
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => pushOperation(operationTypes[Math.floor(Math.random() * operationTypes.length)])}
                            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-700 rounded-lg font-semibold text-sm flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Push
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={popOperation}
                            className="px-4 py-2 bg-white bg-opacity-10 rounded-lg font-semibold text-sm flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Pop (Undo)
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={peekOperation}
                            className="px-4 py-2 bg-white bg-opacity-10 rounded-lg font-semibold text-sm flex items-center gap-2"
                        >
                            <Eye className="w-4 h-4" />
                            Peek
                        </motion.button>
                    </div>
                </div>

                {/* Stack Visualization */}
                <div className="flex flex-col-reverse gap-2 min-h-[400px] justify-end">
                    {operations.length === 0 ? (
                        <div className="text-center py-12 text-secondary">
                            <Layers className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p>Stack is empty. Push operations to begin.</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {operations.map((op, index) => (
                                <motion.div
                                    key={op.id}
                                    initial={{ opacity: 0, y: -50, scale: 0.8 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        scale: animatingIndex === index ? 1.05 : 1,
                                        boxShadow: animatingIndex === index ? '0 0 30px rgba(242, 201, 76, 0.6)' : 'none'
                                    }}
                                    exit={{ opacity: 0, y: -50, scale: 0.8 }}
                                    transition={{
                                        duration: 0.4,
                                        type: 'spring',
                                        damping: 15
                                    }}
                                    className="relative"
                                >
                                    <div className="glass-card p-4 relative">
                                        {index === operations.length - 1 && (
                                            <div className="absolute -top-3 left-4 text-xs font-mono bg-yellow-500 bg-opacity-80 px-2 py-1 rounded z-10">
                                                TOP
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-mono bg-yellow-500 bg-opacity-20 px-2 py-1 rounded">
                                                        #{operations.length - index}
                                                    </span>
                                                    <span className="font-bold text-lg">{op.type}</span>
                                                </div>
                                                <div className="mt-2 text-xs text-secondary">
                                                    {op.timestamp.toLocaleTimeString()}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="complexity-badge" style={{ background: '#f2c94c22', color: '#f2c94c' }}>
                                                    {op.timeComplexity}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}

                    {/* Base of stack */}
                    <div className="h-2 bg-gradient-to-r from-yellow-500 to-yellow-700 rounded-full"></div>
                </div>

                {lastOp && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded-lg"
                    >
                        <p className="font-mono text-sm">{lastOp}</p>
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
                        <h3 className="text-xl font-bold mb-4">📚 Stack Properties</h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <h4 className="font-semibold text-yellow-400 mb-2">Time Complexity</h4>
                                <ul className="space-y-1 text-secondary">
                                    <li>• Push: <span className="text-green-400 font-mono">O(1)</span></li>
                                    <li>• Pop: <span className="text-green-400 font-mono">O(1)</span></li>
                                    <li>• Peek: <span className="text-green-400 font-mono">O(1)</span></li>
                                    <li>• Search: <span className="text-yellow-400 font-mono">O(n)</span></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-yellow-400 mb-2">Space Complexity</h4>
                                <p className="text-secondary">
                                    <span className="text-yellow-400 font-mono">O(n)</span>
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-yellow-400 mb-2">Key Features</h4>
                                <ul className="space-y-1 text-secondary">
                                    <li>✓ LIFO (Last In First Out)</li>
                                    <li>✓ Fast push/pop operations</li>
                                    <li>✓ Perfect for undo/redo</li>
                                    <li>✓ Function call stack</li>
                                </ul>
                            </div>

                            <div className="code-block">
                                <code>{`// Stack Operations\nstack.push(operation)  // O(1)\n\nconst last = stack.pop() // O(1)\n\nconst top = stack.peek() // O(1)`}</code>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold mb-4">Statistics</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-secondary">Stack Size:</span>
                            <span className="font-bold text-xl">{operations.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-secondary">Top Element:</span>
                            <span className="font-mono text-sm truncate max-w-[150px]">
                                {operations.length > 0 ? operations[operations.length - 1].type : 'Empty'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-secondary">Is Empty:</span>
                            <span className="font-mono text-sm">{operations.length === 0 ? 'true' : 'false'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
