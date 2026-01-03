'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Search, RefreshCw, Database } from 'lucide-react';
import { FlightArray, type Flight } from '@/lib/dataStructures';
import { generateId, generateFlightNumber, getRandomAirport, statusColor } from '@/lib/utils';

interface Props {
    learningMode: boolean;
    demoMode: boolean;
}

export default function ArrayVisualizer({ learningMode, demoMode }: Props) {
    const [flightArray] = useState(() => new FlightArray());
    const [flights, setFlights] = useState<Flight[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
    const [operation, setOperation] = useState<string>('');

    const addFlight = () => {
        const origin = getRandomAirport();
        const destination = getRandomAirport();
        const now = new Date();
        const departure = new Date(now.getTime() + Math.random() * 24 * 60 * 60 * 1000);
        const arrival = new Date(departure.getTime() + Math.random() * 5 * 60 * 60 * 1000);

        const flight: Flight = {
            id: generateId(),
            flightNumber: generateFlightNumber(),
            origin: origin.code,
            destination: destination.code,
            departureTime: departure.toISOString(),
            arrivalTime: arrival.toISOString(),
            status: 'scheduled',
            capacity: 180,
        };

        const index = flightArray.push(flight);
        setAnimatingIndex(index - 1);
        setOperation(`Push O(1): Added ${flight.flightNumber} at index ${index - 1}`);
        setFlights(flightArray.getAll());

        setTimeout(() => setAnimatingIndex(null), 500);
    };

    const runDemo = useCallback(async () => {
        // Auto-add 5 flights with animations
        for (let i = 0; i < 5; i++) {
            await new Promise(resolve => setTimeout(resolve, 800));
            addFlight();
        }
    }, [addFlight, flightArray]);

    useEffect(() => {
        if (demoMode) {
            runDemo();
        }
    }, [demoMode, runDemo]);

    const removeFlight = (index: number) => {
        const removed = flightArray.remove(index);
        if (removed) {
            setOperation(`Remove O(n): Removed ${removed.flightNumber} from index ${index}`);
            setAnimatingIndex(index);
            setTimeout(() => {
                setFlights(flightArray.getAll());
                setAnimatingIndex(null);
            }, 400);
        }
    };

    const accessFlight = (index: number) => {
        const flight = flightArray.get(index);
        if (flight) {
            setSelectedIndex(index);
            setOperation(`Access O(1): Retrieved ${flight.flightNumber} at index ${index}`);
            setTimeout(() => setSelectedIndex(null), 2000);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Visualization */}
            <div className="lg:col-span-2 panel relative overflow-hidden">
                <div className="flex items-center justify-between mb-8 z-10 relative">
                    <div>
                        <h2 className="text-2xl font-bold mb-1 text-shadow-sm flex items-center gap-2">
                            <Database className="w-6 h-6 text-indigo-400" />
                            Array - Flight Schedule
                        </h2>
                        <p className="text-secondary text-sm">Contiguous memory allocation with O(1) access</p>
                    </div>
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={addFlight}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-xl font-bold text-white shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Add Flight
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, rotate: 180 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => {
                                setFlights([]);
                                setOperation('Clear: Removed all flights');
                            }}
                            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white/80 hover:text-white transition-colors"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>

                {/* Array Visualization */}
                <div className="relative min-h-[300px] flex items-center bg-black/20 rounded-2xl border border-white/5 p-6 overflow-hidden">
                    <div className="absolute inset-0 grid-pattern opacity-30" />

                    <div className="flex items-start gap-4 overflow-x-auto pb-6 w-full px-2 no-scrollbar z-10">
                        {flights.length === 0 ? (
                            <div className="text-center w-full py-12 text-secondary flex flex-col items-center">
                                <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                    <Database className="w-10 h-10 text-indigo-400 opacity-60" />
                                </div>
                                <p className="text-lg font-medium">Array is empty</p>
                                <p className="text-sm opacity-60">Click "Add Flight" to initialize schedule</p>
                            </div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {flights.map((flight, index) => (
                                    <motion.div
                                        key={flight.id}
                                        initial={{ opacity: 0, scale: 0.8, y: -20 }}
                                        animate={{
                                            opacity: 1,
                                            scale: selectedIndex === index ? 1.05 : 1,
                                            y: 0,
                                            zIndex: selectedIndex === index ? 10 : 0
                                        }}
                                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 25
                                        }}
                                        className="flex-shrink-0 w-64"
                                    >
                                        <motion.div
                                            className={`glass-card p-5 cursor-pointer relative group transition-all duration-300 ${selectedIndex === index
                                                    ? 'border-indigo-400 ring-2 ring-indigo-400/30'
                                                    : 'hover:border-indigo-400/50'
                                                }`}
                                            onClick={() => accessFlight(index)}
                                            whileHover={{ y: -5 }}
                                            style={{
                                                background: selectedIndex === index
                                                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(30, 27, 75, 0.8) 100%)'
                                                    : undefined
                                            }}
                                        >
                                            <div className="absolute -top-3 left-4">
                                                <span className="text-xs font-bold font-mono bg-indigo-500 text-white px-2 py-1 rounded shadow-lg">
                                                    [{index}]
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between mb-4 mt-1">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${flight.status === 'scheduled' ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]' :
                                                            flight.status === 'boarding' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-blue-400'
                                                        }`} />
                                                    <span className="text-xs font-mono opacity-70 tracking-wider">FLIGHT</span>
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.2, color: '#ef4444' }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFlight(index);
                                                    }}
                                                    className="text-white/40 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </motion.button>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="text-2xl font-bold tracking-tight text-white">{flight.flightNumber}</div>

                                                <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                                                    <div className="text-center">
                                                        <div className="text-xl font-bold text-indigo-300">{flight.origin}</div>
                                                        <div className="text-[10px] text-secondary">DEP</div>
                                                    </div>
                                                    <motion.div
                                                        animate={{ x: [0, 5, 0] }}
                                                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                                    >
                                                        <span className="text-indigo-400 text-lg">✈</span>
                                                    </motion.div>
                                                    <div className="text-center">
                                                        <div className="text-xl font-bold text-indigo-300">{flight.destination}</div>
                                                        <div className="text-[10px] text-secondary">ARR</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-xs pt-1">
                                                    <span className="text-secondary">{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${flight.status === 'scheduled' ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/30' :
                                                            flight.status === 'boarding' ? 'bg-green-500/20 text-green-200 border border-green-500/30' :
                                                                'bg-blue-500/20 text-blue-200 border border-blue-500/30'
                                                        }`}>
                                                        {flight.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Memory Connector Visualization */}
                                        {index < flights.length - 1 && (
                                            <div className="absolute top-1/2 -right-4 w-4 h-1 bg-white/10 z-0" />
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>

                {/* Operation Display */}
                <AnimatePresence>
                    {operation && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            className="mt-4"
                        >
                            <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center gap-3 shadow-lg backdrop-blur-sm">
                                <div className="p-2 bg-indigo-500/20 rounded-lg">
                                    <Search className="w-5 h-5 text-indigo-400" />
                                </div>
                                <p className="font-mono text-sm text-indigo-100">{operation}</p>
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
                        className="glass-card p-6 border-l-4 border-l-indigo-500"
                    >
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-2xl">📚</span> Array Properties
                        </h3>
                        <div className="space-y-5 text-sm">
                            <div className="p-3 bg-white/5 rounded-lg">
                                <h4 className="font-bold text-indigo-300 mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-400" /> Time Complexity
                                </h4>
                                <ul className="space-y-2 text-secondary ml-1">
                                    <li className="flex justify-between">Access <span className="text-green-400 font-mono font-bold bg-green-400/10 px-2 rounded">O(1)</span></li>
                                    <li className="flex justify-between">Search <span className="text-red-400 font-mono font-bold bg-red-400/10 px-2 rounded">O(n)</span></li>
                                    <li className="flex justify-between">Insert (end) <span className="text-green-400 font-mono font-bold bg-green-400/10 px-2 rounded">O(1)</span></li>
                                    <li className="flex justify-between">Insert (idx) <span className="text-yellow-400 font-mono font-bold bg-yellow-400/10 px-2 rounded">O(n)</span></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-indigo-300 mb-2">Space Complexity</h4>
                                <p className="text-secondary p-2 border border-white/10 rounded-lg bg-black/20">
                                    <span className="text-purple-400 font-mono font-bold">O(n)</span> - Contiguous memory block
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-indigo-300 mb-2">Key Features</h4>
                                <ul className="space-y-2 text-secondary">
                                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Random access via index</li>
                                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Cache-friendly (contiguous)</li>
                                    <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Fixed size (usually)</li>
                                </ul>
                            </div>

                            <div className="code-block text-xs">
                                <code>{`// Array Access
flight = array[index]  // O(1)

// Array Insert (end)
array.push(flight)     // O(1)

// Array Delete
array.splice(i, 1)     // O(n)`}</code>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Stats Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 relative overflow-hidden group"
                >
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl group-hover:bg-indigo-500/30 transition-colors" />

                    <h3 className="text-xl font-bold mb-4 relative z-10">Statistics</h3>
                    <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <span className="text-secondary">Total Flights</span>
                            <span className="font-bold text-2xl text-white">{flights.length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <span className="text-secondary">Memory Usage</span>
                            <span className="font-mono text-sm text-indigo-300">{flights.length * 64} bytes</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-2">
                            <motion.div
                                className="h-full bg-indigo-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((flights.length / 10) * 100, 100)}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <div className="text-xs text-center text-muted">
                            {flights.length} / 10 recommended capacity
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
