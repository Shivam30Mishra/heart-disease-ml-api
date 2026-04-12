import { motion } from "framer-motion";


export default function Landing() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0f0f1a] to-purple-900 text-white overflow-hidden">
      {/* NAVBAR */}
      <div className="flex justify-between items-center p-6 z-10 relative">
        <h1 className="text-xl font-bold tracking-wide">HeartAI</h1>

        <button className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition">
          Dashboard
        </button>
      </div>

      {/* HERO */}
      <div className="flex flex-col items-center text-center mt-20 px-6 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-bold leading-tight"
        >
          AI-Powered <span className="text-purple-400">Heart Risk</span>
          <br />
          Intelligence
        </motion.h1>

        <p className="mt-6 text-gray-400 max-w-xl">
          Predict. Understand. Improve your heart health with intelligent
          insights and real-time simulations.
        </p>

        <button className="mt-8 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:scale-105 transition duration-300">
          Start Analysis
        </button>
      </div>

      {/* FLOATING CARDS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Card 1 */}
        <div className="absolute top-32 left-10 w-52 p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl rotate-[-10deg] hover:rotate-0 transition duration-500">
          <h3 className="text-sm text-gray-300">Risk Score</h3>
          <p className="text-2xl font-bold text-red-400">72%</p>
        </div>

        {/* Card 2 */}
        <div className="absolute bottom-32 right-10 w-56 p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl rotate-[8deg] hover:rotate-0 transition duration-500">
          <h3 className="text-sm text-gray-300">Improvement</h3>
          <p className="text-2xl font-bold text-green-400">-35%</p>
        </div>

        {/* Card 3 */}
        <div className="absolute top-1/2 right-1/4 w-60 p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl rotate-[5deg] hover:rotate-0 transition duration-500">
          <h3 className="text-sm text-gray-300">AI Insights</h3>
          <p className="text-sm text-gray-400">
            Reduce cholesterol & increase activity
          </p>
        </div>
      </div>

      {/* GLOW BACKGROUND */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 opacity-30 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-500 opacity-30 blur-[120px]" />
    </div>
  );
}
