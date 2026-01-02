import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Zap, Target, TrendingUp, ArrowLeft } from 'lucide-react'

const AITrainer = ({ showSection }: { showSection?: (section: string) => void }) => {
  const [mode, setMode] = useState('curl')
  const [stats, setStats] = useState({ reps: 0, accuracy: 0, fps: 0 })
  const [isLoading, setIsLoading] = useState(true)

  const modes = [
    { id: 'curl', name: 'Bicep Curl', color: 'from-cyan-500 to-blue-500', icon: '💪' },
    { id: 'pushup', name: 'Push-Up', color: 'from-green-500 to-emerald-500', icon: '🔥' },
    { id: 'squat', name: 'Squat', color: 'from-purple-500 to-pink-500', icon: '🏋️' },
    { id: 'lateral', name: 'Lateral Raise', color: 'from-orange-500 to-red-500', icon: '🎯' },
  ]

  useEffect(() => {
    // Fetch stats every second
    const interval = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:8001/stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleModeChange = async (newMode: string) => {
    try {
      const response = await fetch('http://localhost:8001/set_mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: newMode }),
      })
      const data = await response.json()
      if (data.status === 'success') {
        setMode(newMode)
      }
    } catch (error) {
      console.error('Error changing mode:', error)
    }
  }

  return (
    <section className="min-h-screen px-6 pt-32 pb-16 bg-gradient-to-br from-cyber-black via-slate-900 to-cyber-black relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#39FF14 1px, transparent 1px), linear-gradient(90deg, #39FF14 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Scanning Line Animation */}
      <motion.div
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"
        animate={{ y: ['0vh', '100vh'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 relative"
        >
          {showSection && (
            <button
              onClick={() => showSection('exercises')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Exercises</span>
            </button>
          )}
          <h1 className="text-5xl font-bold text-cyan-400 mb-2">
            AI TRAINER
          </h1>
          <p className="text-gray-400">Real-time Pose Detection & Rep Counting</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Feed - Main Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2"
          >
            <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/30 shadow-2xl bg-slate-800/50 backdrop-blur-sm">
              {/* HUD Overlay */}
              <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none">
                <div className="flex justify-between items-start">
                  {/* Status Indicator */}
                  <div className="bg-black/60 backdrop-blur-md border border-cyan-500/50 rounded-lg px-4 py-2 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                    <span className="text-cyan-500 font-mono text-sm font-bold">LIVE</span>
                  </div>

                  {/* Mode Display */}
                  <div className="bg-black/60 backdrop-blur-md border border-cyan-500/50 rounded-lg px-4 py-2">
                    <span className="text-cyan-500 font-mono text-sm font-bold uppercase">
                      {modes.find(m => m.id === mode)?.icon} {mode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Video Stream */}
              <div className="relative">
                <img
                  src="http://localhost:8001/video_feed"
                  alt="AI Trainer Stream"
                  className="w-full h-auto min-h-[500px] object-cover"
                  onLoad={() => setIsLoading(false)}
                  onError={() => setIsLoading(false)}
                />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-cyan-500 font-mono">Initializing AI Vision...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Stats HUD */}
              <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
                <div className="grid grid-cols-3 gap-4">
                  <StatCard icon={Target} label="Reps" value={stats.reps} color="cyan-500" />
                  <StatCard icon={Zap} label="Accuracy" value={`${stats.accuracy}%`} color="green-400" />
                  <StatCard icon={TrendingUp} label="FPS" value={stats.fps} color="purple-400" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Mode Selector */}
            <div className="bg-slate-800/50 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-cyan-500 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Select Exercise
              </h3>
              <div className="space-y-3">
                {modes.map((m) => (
                  <motion.button
                    key={m.id}
                    onClick={() => handleModeChange(m.id)}
                    className={`w-full p-4 rounded-xl font-semibold transition-all duration-300 ${
                      mode === m.id
                        ? `bg-gradient-to-r ${m.color} text-white shadow-lg shadow-cyan-500/20`
                        : 'bg-slate-900/50 text-gray-400 border border-slate-700 hover:border-cyan-500/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl mr-3">{m.icon}</span>
                      <span className="flex-1 text-left">{m.name}</span>
                      {mode === m.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-white rounded-full"
                        />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Real-time Stats Card */}
            <div className="bg-slate-800/50 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-cyan-500 mb-4">Session Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Reps</span>
                  <span className="text-3xl font-bold text-cyan-500 font-mono">{stats.reps}</span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Form Accuracy</span>
                  <span className="text-2xl font-bold text-green-400 font-mono">{stats.accuracy}%</span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Stream FPS</span>
                  <span className="text-2xl font-bold text-purple-400 font-mono">{stats.fps}</span>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-cyan-500 mb-2">💡 Pro Tip</h3>
              <p className="text-sm text-gray-300">
                Position yourself fully in frame. The AI tracks your body landmarks in real-time for accurate rep counting and form analysis.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Stat Card Component for HUD
const StatCard = ({ icon: Icon, label, value, color }: { 
  icon: any, 
  label: string, 
  value: string | number, 
  color: string 
}) => (
  <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-lg p-3">
    <div className="flex items-center space-x-2 mb-1">
      <Icon className={`w-4 h-4 text-${color}`} />
      <span className="text-xs text-gray-400 font-mono uppercase">{label}</span>
    </div>
    <div className={`text-2xl font-bold font-mono text-${color}`}>{value}</div>
  </div>
)

export default AITrainer