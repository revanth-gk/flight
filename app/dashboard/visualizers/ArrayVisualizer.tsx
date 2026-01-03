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
            <div className="lg:col-span-2 glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">Array - Flight Schedule</h2>
                        <p className="text-secondary text-sm">Contiguous memory allocation with O(1) access</p>
                    </div>
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={addFlight}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg font-semibold"
                        >
                            <Plus className="w-4 h-4" />
                            Add Flight
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setFlights([]);
                                setOperation('Clear: Removed all flights');
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 rounded-lg font-semibold"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>

                {/* Array Visualization */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4 overflow-x-auto pb-4">
                        {flights.length === 0 ? (
                            <div className="text-center w-full py-12 text-secondary">
                                <Database className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                <p>No flights in array. Click "Add Flight" to begin.</p>
                            </div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {flights.map((flight, index) => (
                                    <motion.div
                                        key={flight.id}
                                        initial={{ opacity: 0, scale: 0.8, y: -20 }}
                                        animate={{
                                            opacity: 1,
                                            scale: selectedIndex === index ? 1.1 : 1,
                                            y: 0,
                                            boxShadow: selectedIndex === index ? '0 0 30px rgba(102, 126, 234, 0.6)' : 'none'
                                        }}
                                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                        transition={{ duration: 0.5 }}
                                        className="flex-shrink-0 w-64"
                                    >
                                        <div
                                            className="glass-card p-4 cursor-pointer hover:border-purple-500 transition-all"
                                            onClick={() => accessFlight(index)}
                                        >
                                            {/* Index Badge */}
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-mono bg-purple-500 bg-opacity-20 px-2 py-1 rounded">
                                                    Index: {index}
                                                </span>
                                                <motion.button
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFlight(index);
                                                    }}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </motion.button>
                                            </div>

                                            {/* Flight Info */}
                                            <div className="space-y-2">
                                                <div className="font-bold text-lg">{flight.flightNumber}</div>
                                                <div className="text-sm flex items-center gap-2">
                                                    <span className="font-semibold">{flight.origin}</span>
                                                    <span className="text-purple-400">→</span>
                                                    <span className="font-semibold">{flight.destination}</span>
                                                </div>
                                                <div
                                                    className="text-xs px-2 py-1 rounded inline-block"
                                                    style={{
                                                        background: `${statusColor(flight.status)}22`,
                                                        color: statusColor(flight.status),
                                                        border: `1px solid ${statusColor(flight.status)}`
                                                    }}
                                                >
                                                    {flight.status.toUpperCase()}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>

                {/* Operation Display */}
                {operation && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-purple-500 bg-opacity-10 border border-purple-500 rounded-lg"
                    >
                        <p className="font-mono text-sm">{operation}</p>
                    </motion.div>
                )}
            </div>

            {/* Learning Panel */}
            <div className="space-y-6">
                {learningMode && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-6"
                    >
                        <h3 className="text-xl font-bold mb-4">📚 Array Properties</h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <h4 className="font-semibold text-purple-400 mb-2">Time Complexity</h4>
                                <ul className="space-y-1 text-secondary">
                                    <li>• Access: <span className="text-green-400 font-mono">O(1)</span></li>
                                    <li>• Search: <span className="text-purple-400 font-mono">O(n)</span></li>
                                    <li>• Insert (end): <span className="text-green-400 font-mono">O(1)</span></li>
                                    <li>• Insert (middle): <span className="text-yellow-400 font-mono">O(n)</span></li>
                                    <li>• Delete: <span className="text-yellow-400 font-mono">O(n)</span></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-purple-400 mb-2">Space Complexity</h4>
                                <p className="text-secondary">
                                    <span className="text-purple-400 font-mono">O(n)</span> - Contiguous memory
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-purple-400 mb-2">Key Features</h4>
                                <ul className="space-y-1 text-secondary">
                                    <li>✓ Random access via index</li>
                                    <li>✓ Cache-friendly (locality)</li>
                                    <li>✓ Fixed size or dynamic</li>
                                    <li>✗ Expensive insertions/deletions</li>
                                </ul>
                            </div>

                            <div className="code-block">
                                <code>{`// Array Access\nflight = array[index]  // O(1)\n\n// Array Insert (end)\narray.push(flight)     // O(1)\n\n// Array Delete\narray.splice(index, 1) // O(n)`}</code>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Stats Panel */}
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold mb-4">Statistics</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-secondary">Total Flights:</span>
                            <span className="font-bold text-xl">{flights.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-secondary">Memory Usage:</span>
                            <span className="font-mono text-sm">{flights.length * 64} bytes</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-secondary">Capacity:</span>
                            <span className="font-mono text-sm">Dynamic</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
