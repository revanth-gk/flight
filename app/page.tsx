'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plane, Database, GitBranch, Layers, List, Hash } from 'lucide-react';

export default function Home() {
  const dataStructures = [
    {
      name: 'Array',
      icon: Database,
      color: '#667eea',
      description: 'Flight Schedule Grid',
      complexity: 'O(1) Access',
      gradient: 'from-purple-500 to-purple-700'
    },
    {
      name: 'Linked List',
      icon: GitBranch,
      color: '#38ef7d',
      description: 'Passenger Queue',
      complexity: 'O(1) Insert/Delete',
      gradient: 'from-green-400 to-green-600'
    },
    {
      name: 'Stack',
      icon: Layers,
      color: '#f2c94c',
      description: 'Operation History',
      complexity: 'O(1) Push/Pop',
      gradient: 'from-yellow-400 to-yellow-600'
    },
    {
      name: 'Queue',
      icon: List,
      color: '#f45c43',
      description: 'Boarding Queue',
      complexity: 'O(1) Enqueue/Dequeue',
      gradient: 'from-red-400 to-red-600'
    },
    {
      name: 'Tree',
      icon: GitBranch,
      color: '#764ba2',
      description: 'Route Hierarchy',
      complexity: 'O(log n) Search',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      name: 'HashMap',
      icon: Hash,
      color: '#11998e',
      description: 'Seat Booking',
      complexity: 'O(1) Lookup',
      gradient: 'from-teal-500 to-cyan-600'
    }
  ];

  return (
    <div className="min-h-screen grid-pattern">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Plane className="w-16 h-16 text-purple-500" />
            </motion.div>
          </div>
          <h1 className="text-6xl font-bold mb-4">
            <span className="text-gradient">Flight Management System</span>
          </h1>
          <p className="text-2xl text-secondary mb-2">Visual Data Structures Laboratory</p>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            An interactive platform demonstrating core data structures through real-world flight operations.
            Watch algorithms come to life with stunning visualizations and animations.
          </p>

          <div className="flex gap-4 justify-center mt-8">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-gradient text-lg px-8 py-4"
              >
                Launch Dashboard
              </motion.button>
            </Link>
            <Link href="/demo">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card px-8 py-4 text-lg font-semibold"
              >
                Watch Demo
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Data Structures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {dataStructures.map((ds, index) => (
            <Link
              key={ds.name}
              href={`/dashboard?structure=${ds.name.toLowerCase().replace(' ', '')}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className="glass-card p-6 cursor-pointer group h-full"
                style={{
                  transition: 'all 0.3s ease',
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${ds.color}22 0%, ${ds.color}44 100%)`,
                      border: `1px solid ${ds.color}`,
                    }}
                  >
                    <ds.icon className="w-6 h-6" style={{ color: ds.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1 group-hover:text-purple-400 transition-colors">{ds.name}</h3>
                    <p className="text-sm text-secondary mb-2">{ds.description}</p>
                    <div className="complexity-badge" style={{ background: `${ds.color}22`, color: ds.color }}>
                      ⏱ {ds.complexity}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white border-opacity-10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted group-hover:text-purple-400 transition-colors">Click to visualize</span>
                    <motion.span
                      className="text-purple-400 font-semibold"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="glass-card p-8"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="font-bold text-lg mb-2">Beautiful Animations</h3>
              <p className="text-sm text-secondary">
                Every operation is visualized with smooth, professional animations
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🧠</div>
              <h3 className="font-bold text-lg mb-2">Learning Mode</h3>
              <p className="text-sm text-secondary">
                Step-by-step explanations with time & space complexity analysis
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold text-lg mb-2">Real-time Operations</h3>
              <p className="text-sm text-secondary">
                Interact with live data structures and see immediate results
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-16 text-muted">
          <p>Built with Next.js, TypeScript, Framer Motion, and Supabase</p>
          <p className="text-sm mt-2">Data Structures Laboratory Project © 2026</p>
        </div>
      </div>
    </div>
  );
}
