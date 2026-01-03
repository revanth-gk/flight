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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen grid-pattern">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <motion.div
              className="animate-float"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            >
              <div className="p-4 rounded-full bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-md glow">
                <Plane className="w-20 h-20 text-indigo-400 drop-shadow-lg" />
              </div>
            </motion.div>
          </div>
          <h1 className="text-7xl font-extrabold mb-6 tracking-tight">
            <span className="text-gradient drop-shadow-sm">Flight Management System</span>
          </h1>
          <p className="text-2xl text-secondary mb-3 font-light tracking-wide">Visual Data Structures Laboratory</p>
          <p className="text-lg text-muted max-w-3xl mx-auto leading-relaxed">
            An interactive platform demonstrating core data structures through real-world flight operations.
            Watch algorithms come to life with stunning visualizations and animations.
          </p>

          <div className="flex gap-6 justify-center mt-10">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(102, 126, 234, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="btn-gradient text-lg px-10 py-4 shadow-xl"
              >
                Launch Dashboard
              </motion.button>
            </Link>
            <Link href="/demo">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.95 }}
                className="glass-card px-10 py-4 text-lg font-bold text-white shadow-lg border-white/20 hover:border-white/40"
              >
                Watch Demo
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Data Structures Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {dataStructures.map((ds, index) => (
            <Link
              key={ds.name}
              href={`/dashboard?structure=${ds.name.toLowerCase().replace(' ', '')}`}
            >
              <motion.div
                variants={itemVariants}
                whileHover={{
                  y: -12,
                  scale: 1.03,
                  transition: { duration: 0.3, type: "spring", stiffness: 300 }
                }}
                whileTap={{ scale: 0.98 }}
                className="glass-card p-8 cursor-pointer group h-full relative overflow-hidden"
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-20"
                  style={{ background: ds.color }}
                />

                <div className="flex items-start gap-5 relative z-10">
                  <div
                    className="p-4 rounded-2xl group-hover:rotate-6 transition-transform duration-500 shadow-lg ring-1 ring-white/10"
                    style={{
                      background: `linear-gradient(135deg, ${ds.color}25 0%, ${ds.color}10 100%)`,
                      border: `1px solid ${ds.color}66`,
                      boxShadow: `0 8px 20px ${ds.color}33`
                    }}
                  >
                    <ds.icon className="w-8 h-8 drop-shadow-md" style={{ color: ds.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-indigo-300 transition-colors">{ds.name}</h3>
                    <p className="text-base text-secondary mb-3 font-medium">{ds.description}</p>
                    <div className="complexity-badge shadow-sm" style={{
                      background: `${ds.color}20`,
                      color: ds.color,
                      borderColor: `${ds.color}50`
                    }}>
                      ⏱ {ds.complexity}
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-sm">
                  <span className="text-muted font-medium group-hover:text-white transition-colors">Click to visualize</span>
                  <motion.div
                    className="bg-white/10 p-2 rounded-full"
                    animate={{ x: 0 }}
                    whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.2)" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="panel relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
          <h2 className="text-4xl font-bold mb-10 text-center text-shadow-sm">Why use this platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center group p-4 rounded-2xl hover:bg-white/5 transition-colors duration-300">
              <div className="text-5xl mb-5 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">🎨</div>
              <h3 className="font-bold text-xl mb-3 text-white">Beautiful Animations</h3>
              <p className="text-secondary leading-relaxed px-4">
                Every operation is visualized with smooth, professional animations that make algorithms intuitive
              </p>
            </div>
            <div className="text-center group p-4 rounded-2xl hover:bg-white/5 transition-colors duration-300">
              <div className="text-5xl mb-5 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">🧠</div>
              <h3 className="font-bold text-xl mb-3 text-white">Learning Mode</h3>
              <p className="text-secondary leading-relaxed px-4">
                Step-by-step explanations with detailed time & space complexity analysis for deep understanding
              </p>
            </div>
            <div className="text-center group p-4 rounded-2xl hover:bg-white/5 transition-colors duration-300">
              <div className="text-5xl mb-5 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">⚡</div>
              <h3 className="font-bold text-xl mb-3 text-white">Real-time Operations</h3>
              <p className="text-secondary leading-relaxed px-4">
                Interact with live data structures and see operations execute instantly with visual feedback
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-20 pb-10 text-muted">
          <p className="font-medium">Built with Next.js, TypeScript, Framer Motion, and Tailwind CSS</p>
          <p className="text-sm mt-3 opacity-70">Data Structures Laboratory Project © 2026</p>
        </div>
      </div>
    </div>
  );
}
