import React from 'react';
import { 
  Plus, Search, Compass, Users, Clock, 
  Sparkles, Heart, Activity, Zap, 
  Mic, Send, SearchCode, PieChart, Apple, MoreHorizontal, Menu,
  ShieldCheck, TrendingDown, ArrowRight
} from 'lucide-react';

const HeartAIDashboard = ({ userName = "Shivam" }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-[#f0f4ff] relative overflow-hidden font-sans antialiased">
      
      {/* --- BACKGROUND MESH GRADIENTS (For that premium feel) --- */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/50 rounded-full blur-[120px] z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-100/50 rounded-full blur-[120px] z-0" />

      {/* --- 1. FLOATING SIDEBAR --- */}
      <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-30">
        <div className="w-12 h-12 bg-[#1a1c1e] rounded-2xl flex items-center justify-center text-white shadow-xl cursor-pointer hover:rotate-90 transition-all duration-300">
          <Plus size={20} />
        </div>
        <div className="flex flex-col gap-3 p-2 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm">
          {[Search, Compass, Users, Clock].map((Icon, i) => (
            <div key={i} className="w-10 h-10 rounded-2xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-white/80 transition-all cursor-pointer">
              <Icon size={20} />
            </div>
          ))}
        </div>
      </div>

      {/* --- 2. MAIN GLASS CONTAINER --- */}
      <div className="relative z-10 w-full max-w-6xl bg-white/40 backdrop-blur-[50px] rounded-[40px] md:rounded-[56px] shadow-[0_32px_120px_rgba(31,38,135,0.15)] border border-white/70 p-6 md:p-12 overflow-hidden">
        
        {/* LOGO & STATUS BAR */}
        <div className="flex justify-between items-center mb-10 md:mb-14">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center shadow-lg">
                <Heart size={16} className="text-red-500 fill-red-500" />
             </div>
             <span className="text-gray-800 font-bold tracking-tight text-sm">HeartAI <span className="text-blue-600">v1.0</span></span>
          </div>
          
          <div className="hidden md:block text-gray-400 text-[12px] font-semibold tracking-[0.2em] uppercase">
            Health Intelligence Platform
          </div>

          <button className="group flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-full text-xs font-bold hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-all active:scale-95">
            <Sparkles size={14} className="text-yellow-400 group-hover:rotate-12 transition-transform" />
            Upgrade to Pro
          </button>
        </div>

        {/* HERO & ROBOT SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 relative">
          <div className="max-w-2xl">
            <h1 className="text-[40px] md:text-[56px] font-extrabold text-slate-900 leading-[1.05] tracking-tight">
              Hi {userName}, Ready to <br /> <span className="text-blue-600">Optimize</span> Your Heart?
            </h1>
            <p className="mt-4 text-slate-500 text-lg font-medium max-w-md">
              Predict risk, simulate lifestyle changes, and receive AI-driven health intelligence.
            </p>
          </div>

          {/* AI ROBOT ASSISTANT */}
          <div className="relative mt-12 md:mt-0 group">
            {/* Speech Bubble */}
            <div className="absolute -top-10 -left-20 bg-white/90 backdrop-blur-md px-5 py-3 rounded-3xl shadow-xl border border-gray-100 text-[12px] font-bold flex flex-col items-start z-20 transition-transform group-hover:scale-105">
              <span className="text-blue-500">System Online ✨</span>
              <span className="text-slate-800">Risk Score: 12% (Low)</span>
            </div>
            {/* Ensure robot.png is transparent for best effect */}
            <img 
              src="/robot.jpg" 
              alt="HeartAI Bot" 
              className="w-32 h-32 md:w-44 md:h-44 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500 group-hover:translate-y-[-10px]"
            />
          </div>
        </div>

        {/* --- 3. DYNAMIC FEATURE CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          {/* Analyze Risk */}
          <div className="relative group bg-gradient-to-b from-white/80 to-white/40 p-8 rounded-[38px] border border-white/60 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Heart size={80} />
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100">
              <Activity size={24} className="text-red-500" />
            </div>
            <h3 className="text-slate-900 font-bold text-xl mb-2">Analyze Risk</h3>
            <p className="text-slate-500 text-[15px] leading-relaxed">
              Execute ML models to predict heart disease probability based on clinical data.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest">
              Launch Model <ArrowRight size={14} />
            </div>
          </div>

          {/* AI Insights */}
          <div className="relative group bg-white p-8 rounded-[38px] border border-blue-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-2xl transition-all duration-500 cursor-pointer">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
              <PieChart size={24} className="text-blue-600" />
            </div>
            <h3 className="text-slate-900 font-bold text-xl mb-2">Health Insights</h3>
            <p className="text-slate-500 text-[15px] leading-relaxed">
              SHAP-powered explanations identifying contributing features like BMI and Cholesterol.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest">
              View Analytics <ArrowRight size={14} />
            </div>
          </div>

          {/* Lifestyle Simulation */}
          <div className="relative group bg-gradient-to-b from-white/80 to-white/40 p-8 rounded-[38px] border border-white/60 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100">
              <Zap size={24} className="text-emerald-500" />
            </div>
            <h3 className="text-slate-900 font-bold text-xl mb-2">Simulate Change</h3>
            <p className="text-slate-500 text-[15px] leading-relaxed">
              Tweak habits (diet, exercise) to see real-time projected risk reduction.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-widest">
              Run Simulation <ArrowRight size={14} />
            </div>
          </div>
        </div>

        {/* --- 4. CONVERSATIONAL COMMAND CENTER --- */}
        <div className="w-full max-w-4xl mx-auto">
           <div className="flex justify-between items-center px-6 mb-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                <ShieldCheck size={14} className="text-blue-500" /> Secure Clinical Environment
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                <TrendingDown size={14} className="text-emerald-500" /> Trend: Improving
              </div>
           </div>

           {/* Input Bar */}
           <div className="bg-white/90 border border-white rounded-[32px] md:rounded-[40px] p-2.5 shadow-[0_30px_60px_rgba(0,0,0,0.1)]">
              <div className="flex items-center px-5 py-3">
                <Plus size={24} className="text-slate-300 mr-4 cursor-pointer hover:text-blue-600 transition-colors" />
                <input 
                  className="flex-1 bg-transparent border-none outline-none text-slate-700 font-medium placeholder:text-slate-300 text-lg"
                  placeholder="Ask AI: 'How can I reduce my cholesterol?'"
                />
                <div className="flex items-center gap-4">
                   <Mic size={22} className="text-slate-300 cursor-pointer hover:text-blue-600 hidden sm:block" />
                   <button className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 hover:scale-105 transition-all">
                      <Send size={20} />
                   </button>
                </div>
              </div>

              {/* Advanced Action Pills */}
              <div className="flex items-center gap-2 px-2 pb-1 overflow-x-auto no-scrollbar">
                {[
                  { label: "Deep Diagnosis", icon: SearchCode, color: "text-blue-400" },
                  { label: "Risk Trends", icon: Activity, color: "text-red-400" },
                  { label: "Diet Plan AI", icon: Apple, color: "text-emerald-400" },
                  { label: "Clinical Papers", icon: Users, color: "text-purple-400" }
                ].map((pill, index) => (
                  <button key={index} className="flex-shrink-0 flex items-center gap-2.5 px-5 py-3 bg-[#1a1c1e] text-white rounded-full text-[11px] font-bold hover:bg-slate-800 transition-all border border-slate-700/50">
                    <pill.icon size={14} className={pill.color}/> {pill.label}
                  </button>
                ))}
                <button className="flex-shrink-0 w-11 h-11 bg-[#1a1c1e] text-white rounded-full flex items-center justify-center hover:bg-slate-800 border border-slate-700/50">
                  <MoreHorizontal size={18} />
                </button>
              </div>
           </div>
        </div>

      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default HeartAIDashboard;