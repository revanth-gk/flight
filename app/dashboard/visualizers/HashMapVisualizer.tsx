'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Search, Trash2, Hash, ArrowRight, Table } from 'lucide-react';
import { SeatHashMap, type Booking } from '@/lib/dataStructures';
import { generateId, getRandomName, generateSeatNumber } from '@/lib/utils';

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
            <div className="lg:col-span-2 panel relative overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-8 z-10 relative">
                    <div>
                        <h2 className="text-2xl font-bold mb-1 text-shadow-sm flex items-center gap-2">
                            <Table className="w-6 h-6 text-teal-400" />
                            HashMap - Seat Booking
                        </h2>
                        <p className="text-secondary text-sm">Hash table with O(1) average lookup</p>
                    </div>
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(20, 184, 166, 0.6)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={createBooking}
                            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 border border-teal-400/50 rounded-xl font-bold text-white shadow-lg text-sm flex items-center gap-2"
                        >
                            <Ticket className="w-4 h-4" />
                            Book Seat
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={searchBooking}
                            className="px-4 py-2 bg-white/5 border border-white/20 hover:border-teal-400/50 hover:bg-teal-500/20 rounded-xl font-bold text-white shadow-lg text-sm flex items-center gap-2 transition-colors"
                        >
                            <Search className="w-4 h-4" />
                            Search
                        </motion.button>
                    </div>
                </div>

                {/* Hash Function Visualization */}
                <AnimatePresence>
                    {hashAnimation && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 overflow-hidden"
                        >
                            <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-xl flex items-center justify-center gap-6">
                                <div className="text-center">
                                    <div className="text-[10px] text-secondary uppercase tracking-widest mb-1">Key</div>
                                    <code className="text-xl font-mono text-white bg-black/20 px-2 py-1 rounded">"{hashAnimation.key}"</code>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-xs text-secondary font-mono">hash(key) % 8</span>
                                    <ArrowRight className="w-6 h-6 text-teal-500 animate-pulse" />
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] text-secondary uppercase tracking-widest mb-1">Index</div>
                                    <div className="text-3xl font-bold text-teal-400">{hashAnimation.hash}</div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Buckets Grid */}
                <div className="flex-1 bg-black/20 rounded-2xl border border-white/5 p-6 relative">
                    <div className="absolute inset-0 grid-pattern opacity-30" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                        {buckets.map((bucket, bucketIndex) => {
                            const bucketBookings = Array.from(bucket.values());
                            const isHighlighted = highlightedBucket === bucketIndex;

                            return (
                                <motion.div
                                    key={bucketIndex}
                                    layout
                                    animate={{
                                        scale: isHighlighted ? 1.05 : 1,
                                        borderColor: isHighlighted ? 'rgba(20, 184, 166, 0.8)' : 'rgba(255, 255, 255, 0.1)',
                                        backgroundColor: isHighlighted ? 'rgba(20, 184, 166, 0.1)' : 'rgba(255, 255, 255, 0.05)'
                                    }}
                                    className="glass-card p-3 min-h-[160px] flex flex-col border border-white/10"
                                >
                                    {/* Bucket Header */}
                                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                                        <span className="text-xs font-mono text-teal-400 font-bold">
                                            #{bucketIndex}
                                        </span>
                                        <span className="text-[10px] text-secondary bg-white/5 px-1.5 py-0.5 rounded">
                                            {bucketBookings.length}
                                        </span>
                                    </div>

                                    {/* Bucket Contents */}
                                    <div className="space-y-2 flex-1 relative">
                                        {bucketBookings.length === 0 ? (
                                            <div className="absolute inset-0 flex items-center justify-center text-xs text-white/10 font-mono">
                                                EMPTY
                                            </div>
                                        ) : (
                                            <AnimatePresence mode="popLayout">
                                                {bucketBookings.map((booking) => (
                                                    <motion.div
                                                        key={booking.id}
                                                        layout
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        className="bg-teal-500/10 p-2 rounded border border-teal-500/20 group hover:border-teal-500/50 transition-all cursor-pointer"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="font-mono text-xs font-bold text-teal-300">
                                                                {booking.seatNumber}
                                                            </div>
                                                            <motion.button
                                                                whileHover={{ scale: 1.2, color: "#ef4444" }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    deleteBooking(booking.seatNumber);
                                                                }}
                                                                className="text-white/20 group-hover:text-white/60 transition-colors"
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
                                        <div className="mt-2 pt-1 border-t border-yellow-500/20 flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                            <div className="text-[10px] text-yellow-400/80">
                                                Collision
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
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
                            <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-xl flex items-center gap-3 shadow-lg backdrop-blur-sm">
                                <div className="p-2 bg-teal-500/20 rounded-lg">
                                    <Hash className="w-5 h-5 text-teal-400" />
                                </div>
                                <p className="font-mono text-sm text-teal-100">{operation}</p>
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
                        className="glass-card p-6 border-l-4 border-l-teal-500"
                    >
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-2xl">📚</span> Properties
                        </h3>
                        <div className="space-y-5 text-sm">
                            <div className="p-3 bg-white/5 rounded-lg">
                                <h4 className="font-bold text-teal-400 mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-teal-400" /> Time Complexity
                                </h4>
                                <ul className="space-y-2 text-secondary ml-1">
                                    <li className="flex justify-between">Insert <span className="text-green-400 font-mono font-bold bg-green-400/10 px-2 rounded">O(1)*</span></li>
                                    <li className="flex justify-between">Search <span className="text-green-400 font-mono font-bold bg-green-400/10 px-2 rounded">O(1)*</span></li>
                                    <li className="flex justify-between">Delete <span className="text-green-400 font-mono font-bold bg-green-400/10 px-2 rounded">O(1)*</span></li>
                                    <li className="text-[10px] text-muted italic mt-1">* Amortized / Average case</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-teal-400 mb-2">Space Complexity</h4>
                                <p className="text-secondary p-2 border border-white/10 rounded-lg bg-black/20">
                                    <span className="text-teal-400 font-mono font-bold">O(n)</span> - Linear growth
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-teal-400 mb-2">Key Features</h4>
                                <ul className="space-y-2 text-secondary">
                                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Ultra-fast lookups</li>
                                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Key-Value mapping</li>
                                    <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Collision handling</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 relative overflow-hidden group"
                >
                    <div className="absolute -right-4 -top-4 w-40 h-40 bg-teal-500/10 rounded-full blur-[50px] group-hover:bg-teal-500/20 transition-colors" />

                    <h3 className="text-xl font-bold mb-4 relative z-10 flex items-center gap-2">
                        <span className="text-teal-400">📊</span> Live Statistics
                    </h3>
                    <div className="relative z-10 space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-xs font-bold text-secondary uppercase tracking-widest border-b border-white/10 pb-2">
                            <div>Metric</div>
                            <div className="text-right">Value</div>
                        </div>

                        <div className="space-y-1">
                            <div className="grid grid-cols-2 gap-4 p-3 bg-gradient-to-r from-white/5 to-transparent rounded-lg border border-white/5 hover:border-teal-500/30 transition-colors group/row">
                                <div className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 group-hover/row:shadow-[0_0_8px_rgba(45,212,191,1)] transition-shadow"></div>
                                    Total Bookings
                                </div>
                                <div className="text-right font-mono font-bold text-lg text-white text-shadow-sm">
                                    {bookings.length}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 p-3 bg-gradient-to-r from-white/5 to-transparent rounded-lg border border-white/5 hover:border-teal-500/30 transition-colors group/row">
                                <div className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 group-hover/row:shadow-[0_0_8px_rgba(250,204,21,1)] transition-shadow"></div>
                                    Collisions
                                </div>
                                <div className="text-right font-mono font-bold text-sm text-teal-300">
                                    {buckets.filter(b => b.size > 1).length}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-secondary">Load Factor</span>
                                <span className="font-mono text-teal-400">{(bookings.length / 8).toFixed(2)}</span>
                            </div>
                            <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 origin-left"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((bookings.length / 8) * 100, 100)}%` }}
                                    transition={{ duration: 0.5, ease: "backOut" }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
