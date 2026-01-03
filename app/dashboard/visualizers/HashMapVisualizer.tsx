'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Search, Trash2, Hash as HashIcon } from 'lucide-react';
import { SeatHashMap, type Booking } from '@/lib/dataStructures';
import { generateId, getRandomName, generateSeatNumber, statusColor } from '@/lib/utils';

interface Props {
    learningMode: boolean;
    demoMode: boolean;
}

export default function HashMapVisualizer({ learningMode, demoMode }: Props) {
    const [hashMap] = useState(() => new SeatHashMap(8)); // 8 buckets for visibility
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [operation, setOperation] = useState<string>('');
    const [highlightedBucket, setHighlightedBucket] = useState<number | null>(null);
    const [hashAnimation, setHashAnimation] = useState<{ key: string; hash: number } | null>(null);

    useEffect(() => {
        if (demoMode) {
            runDemo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [demoMode]);

    const runDemo = async () => {
        for (let i = 0; i < 6; i++) {
            await new Promise(resolve => setTimeout(resolve, 1200));
            createBooking();
        }
    };

    const hashFunction = (key: string): number => {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash << 5) - hash + key.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash) % 8;
    };

    const createBooking = async () => {
        const seatNumber = generateSeatNumber();
        const passengerName = getRandomName();

        setHashAnimation({ key: seatNumber, hash: hashFunction(seatNumber) });
        await new Promise(resolve => setTimeout(resolve, 800));

        const booking: Booking = {
            id: generateId(),
            passengerId: generateId(),
            flightId: generateId(),
            seatNumber,
            status: 'confirmed',
        };

        hashMap.set(seatNumber, booking);
        const bucketIndex = hashFunction(seatNumber);

        setOperation(`Set O(1): Booked seat ${seatNumber} → Bucket ${bucketIndex}`);
        setHighlightedBucket(bucketIndex);
        setBookings(hashMap.getAll());
        setHashAnimation(null);

        setTimeout(() => setHighlightedBucket(null), 1000);
    };

    const searchBooking = () => {
        if (bookings.length === 0) return;

        const randomBooking = bookings[Math.floor(Math.random() * bookings.length)];
        const found = hashMap.get(randomBooking.seatNumber);
        const bucketIndex = hashFunction(randomBooking.seatNumber);

        if (found) {
            setHashAnimation({ key: randomBooking.seatNumber, hash: bucketIndex });
            setTimeout(() => {
                setOperation(`Get O(1): Found booking for seat ${randomBooking.seatNumber}`);
                setHighlightedBucket(bucketIndex);
                setHashAnimation(null);
                setTimeout(() => setHighlightedBucket(null), 1500);
            }, 800);
        }
    };

    const deleteBooking = (seatNumber: string) => {
        const success = hashMap.delete(seatNumber);
        if (success) {
            const bucketIndex = hashFunction(seatNumber);
            setOperation(`Delete O(1): Cancelled booking for seat ${seatNumber}`);
            setHighlightedBucket(bucketIndex);
            setBookings(hashMap.getAll());
            setTimeout(() => setHighlightedBucket(null), 800);
        }
    };

    const buckets = hashMap.getBuckets();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">HashMap - Seat Booking System</h2>
                        <p className="text-secondary text-sm">Hash table with O(1) average lookup</p>
                    </div>
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={createBooking}
                            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-700 rounded-lg font-semibold text-sm flex items-center gap-2"
                        >
                            <Ticket className="w-4 h-4" />
                            Book Seat
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={searchBooking}
                            className="px-4 py-2 bg-white bg-opacity-10 rounded-lg font-semibold text-sm flex items-center gap-2"
                        >
                            <Search className="w-4 h-4" />
                            Search
                        </motion.button>
                    </div>
                </div>

                {/* Hash Function Visualization */}
                {hashAnimation && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-teal-500 bg-opacity-10 border border-teal-500 rounded-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-secondary mb-1">Hash Function:</div>
                                <code className="text-teal-400 font-mono">hash("{hashAnimation.key}")</code>
                            </div>
                            <motion.div
                                animate={{ x: [0, 20, 0] }}
                                transition={{ repeat: 3, duration: 0.3 }}
                                className="text-2xl"
                            >
                                →
                            </motion.div>
                            <div>
                                <div className="text-sm text-secondary mb-1">Bucket Index:</div>
                                <div className="text-2xl font-bold text-teal-400">{hashAnimation.hash}</div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Buckets Visualization */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {buckets.map((bucket, bucketIndex) => {
                        const bucketBookings = Array.from(bucket.values());
                        const isHighlighted = highlightedBucket === bucketIndex;

                        return (
                            <motion.div
                                key={bucketIndex}
                                animate={{
                                    scale: isHighlighted ? 1.05 : 1,
                                    boxShadow: isHighlighted ? '0 0 30px rgba(17, 153, 142, 0.6)' : 'none'
                                }}
                                className="glass-card p-4 min-h-[200px]"
                            >
                                {/* Bucket Header */}
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white border-opacity-10">
                                    <span className="text-xs font-mono bg-teal-500 bg-opacity-20 px-2 py-1 rounded">
                                        Bucket {bucketIndex}
                                    </span>
                                    <span className="text-xs text-secondary">
                                        {bucketBookings.length} item{bucketBookings.length !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                {/* Bucket Contents */}
                                <div className="space-y-2">
                                    {bucketBookings.length === 0 ? (
                                        <div className="text-center py-4 text-secondary text-xs opacity-50">
                                            Empty
                                        </div>
                                    ) : (
                                        <AnimatePresence mode="popLayout">
                                            {bucketBookings.map((booking) => (
                                                <motion.div
                                                    key={booking.id}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    className="bg-white bg-opacity-5 p-2 rounded group hover:bg-opacity-10 transition-all"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="font-mono text-sm font-bold text-teal-400">
                                                                {booking.seatNumber}
                                                            </div>
                                                            <div className="text-xs text-secondary truncate">
                                                                {booking.status}
                                                            </div>
                                                        </div>
                                                        <motion.button
                                                            whileHover={{ scale: 1.2 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => deleteBooking(booking.seatNumber)}
                                                            className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </motion.button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    )}
                                </div>

                                {/* Collision Indicator */}
                                {bucketBookings.length > 1 && (
                                    <div className="mt-2 pt-2 border-t border-yellow-500 border-opacity-30">
                                        <div className="text-xs text-yellow-400">
                                            ⚠️ {bucketBookings.length - 1} collision{bucketBookings.length > 2 ? 's' : ''}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {operation && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-teal-500 bg-opacity-10 border border-teal-500 rounded-lg"
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
                        <h3 className="text-xl font-bold mb-4">📚 HashMap Properties</h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <h4 className="font-semibold text-teal-400 mb-2">Time Complexity</h4>
                                <ul className="space-y-1 text-secondary">
                                    <li>• Insert: <span className="text-green-400 font-mono">O(1)</span> avg</li>
                                    <li>• Search: <span className="text-green-400 font-mono">O(1)</span> avg</li>
                                    <li>• Delete: <span className="text-green-400 font-mono">O(1)</span> avg</li>
                                    <li className="text-xs">Worst case O(n) with collisions</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-teal-400 mb-2">Space Complexity</h4>
                                <p className="text-secondary">
                                    <span className="text-teal-400 font-mono">O(n)</span>
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-teal-400 mb-2">Key Features</h4>
                                <ul className="space-y-1 text-secondary">
                                    <li>✓ Ultra-fast lookups</li>
                                    <li>✓ Key-value pairs</li>
                                    <li>✓ Collision handling</li>
                                    <li>✓ Dynamic resizing</li>
                                </ul>
                            </div>

                            <div className="code-block">
                                <code>{`// Hash Function\nindex = hash(key) % size\n\n// Set - O(1)\nbuckets[index].set(key, val)\n\n// Get - O(1)\nreturn buckets[index].get(key)`}</code>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold mb-4">Statistics</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-secondary">Total Bookings:</span>
                            <span className="font-bold text-xl">{bookings.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-secondary">Buckets:</span>
                            <span className="font-mono text-sm">8</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-secondary">Load Factor:</span>
                            <span className="font-mono text-sm">{(bookings.length / 8).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-secondary">Collisions:</span>
                            <span className="font-mono text-sm">
                                {buckets.filter(b => b.size > 1).length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
