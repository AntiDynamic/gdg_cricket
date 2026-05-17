"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, BrainCircuit, MessageSquareText, ShieldAlert, Swords, Trophy, Loader2, Target, Crosshair, TrendingUp, AlertTriangle } from "lucide-react";
import axios from "axios";

export default function Home() {
  const [formData, setFormData] = useState({
    match_id: "",
    batting_team: "MI",
    bowling_team: "CSK",
    score: "172",
    wickets: "5",
    overs: "17.0",
    target: "207",
    striker: "Hardik",
    non_striker: "David",
    current_bowler: "Pathirana",
    pitch_type: "Slow, Gripping",
    dew_factor: "High",
    venue: "Wankhede",
    custom_scenario: "MI needs 35 runs from 18 balls. Dhoni is captaining. Jadeja is bowled out. Bumrah has 1 over left."
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Simulated visual metrics
  const [metrics, setMetrics] = useState({ winProb: 50, momentum: 50, reqRr: 0, currRr: 0 });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setResults(null);
    try {
      const payload: any = { ...formData };
      if (payload.match_id) payload.match_id = parseInt(payload.match_id, 10);
      else payload.match_id = null;
      
      // Calculate realistic dummy metrics based on form inputs for demo
      const runsNeeded = parseInt(formData.target) - parseInt(formData.score);
      const ballsLeft = 120 - parseFloat(formData.overs) * 6;
      const reqRate = runsNeeded > 0 ? (runsNeeded / ballsLeft) * 6 : 0;
      const currRate = (parseInt(formData.score) / parseFloat(formData.overs)) || 0;
      const wp = Math.max(10, Math.min(90, 50 + (currRate - reqRate) * 10 - parseInt(formData.wickets) * 5));
      
      setMetrics({ winProb: Math.round(wp), momentum: Math.round(wp + 10), reqRr: reqRate, currRr: currRate });

      const res = await axios.post("http://localhost:8000/api/tactics", payload);
      setResults(res.data);
    } catch (error) {
      console.error("Analysis failed", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 font-sans selection:bg-blue-500/30">
      <header className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Captain Cool
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
          <Activity className="w-4 h-4 text-green-400 animate-pulse" />
          Live Agentic Intelligence
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-5 rounded-2xl">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-300">
              <Swords className="w-5 h-5" /> Match Context
            </h2>
            
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-slate-400 mb-1">Batting</label>
                  <input type="text" name="batting_team" value={formData.batting_team} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs uppercase text-slate-400 mb-1">Bowling</label>
                  <input type="text" name="bowling_team" value={formData.bowling_team} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs uppercase text-slate-400 mb-1">Score</label>
                  <input type="text" name="score" value={formData.score} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-xs uppercase text-slate-400 mb-1">Wickets</label>
                  <input type="text" name="wickets" value={formData.wickets} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-xs uppercase text-slate-400 mb-1">Overs</label>
                  <input type="text" name="overs" value={formData.overs} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-slate-400 mb-1">Target</label>
                  <input type="text" name="target" value={formData.target} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-xs uppercase text-slate-400 mb-1">Bowler</label>
                  <input type="text" name="current_bowler" value={formData.current_bowler} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-slate-400 mb-1">Pitch</label>
                  <input type="text" name="pitch_type" value={formData.pitch_type} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-xs uppercase text-slate-400 mb-1">Dew</label>
                  <select name="dew_factor" value={formData.dew_factor} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-slate-400 mb-1">Extra Context</label>
                <textarea
                  name="custom_scenario"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 resize-none"
                  rows={3}
                  value={formData.custom_scenario}
                  onChange={handleChange}
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
                Generate Strategy
              </button>
            </div>
          </div>
          
          {/* Tactical Visuals */}
          {results && (
            <div className="glass-panel p-5 rounded-2xl space-y-4">
               <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-white/10 pb-2 flex items-center gap-2">
                 <TrendingUp className="w-4 h-4 text-emerald-400" /> Metrics
               </h2>
               <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Win Prob ({formData.batting_team})</span>
                    <span>{metrics.winProb}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${metrics.winProb}%` }} />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-center">
                   <div className="text-xs text-slate-400 mb-1">Req RR</div>
                   <div className="text-lg font-bold text-red-400">{metrics.reqRr.toFixed(1)}</div>
                 </div>
                 <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-center">
                   <div className="text-xs text-slate-400 mb-1">Curr RR</div>
                   <div className="text-lg font-bold text-blue-400">{metrics.currRr.toFixed(1)}</div>
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* CENTER PANEL */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-5 rounded-2xl min-h-[700px] flex flex-col">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-300 border-b border-white/5 pb-3">
              <BrainCircuit className="w-5 h-5" /> Agent Debate Timeline
            </h2>

            <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar pb-4">
              <AnimatePresence>
                {results && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    {/* Stats Analyst */}
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center shrink-0 border border-blue-500/30">
                        <Activity className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl rounded-tl-none p-4 w-full">
                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Stats Analyst</h3>
                        <div className="text-sm text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                          {results.stats_analysis}
                        </div>
                      </div>
                    </div>

                    {/* Strategist */}
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center shrink-0 border border-purple-500/30">
                        <BrainCircuit className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl rounded-tl-none p-4 w-full shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                        <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Strategist</h3>
                        <p className="text-sm text-slate-300 leading-relaxed italic">
                          "{results.strategist_proposal}"
                        </p>
                      </div>
                    </div>

                    {/* Devil's Advocate */}
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-900/50 flex items-center justify-center shrink-0 border border-red-500/30">
                        <ShieldAlert className="w-5 h-5 text-red-400" />
                      </div>
                      <div className="bg-red-950/20 border border-red-900/50 rounded-2xl rounded-tl-none p-4 w-full">
                        <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">Devil's Advocate</h3>
                        <p className="text-sm text-red-200/90 leading-relaxed font-medium">
                          "{results.devils_advocate_challenge}"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {!results && !loading && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 mt-20">
                    <Swords className="w-12 h-12 mb-3 opacity-20" />
                    <p>Enter match context to begin the think-tank debate.</p>
                  </div>
                )}
                
                {loading && (
                  <div className="flex flex-col items-center justify-center mt-20 text-blue-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <p className="animate-pulse">Agents debating tactics...</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
            
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-emerald-400 border-b border-emerald-900/50 pb-3">
              <Target className="w-5 h-5" /> Final Captain's Call
            </h2>
            
            {results && results.final_captains_call ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                
                <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-xl p-4">
                  <h4 className="text-xs text-emerald-500 font-bold uppercase tracking-wider mb-1">Next Move</h4>
                  <p className="text-base font-medium text-emerald-100">
                    {results.final_captains_call.next_move}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
                    <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><Crosshair className="w-3 h-3"/> Field Setup</h4>
                    <ul className="text-sm text-slate-300 space-y-1 list-disc pl-4">
                      {(results.final_captains_call.field_setup || []).map((field: string, idx: number) => (
                        <li key={idx}>{field}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
                    <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Tactical Goal</h4>
                    <p className="text-sm text-slate-300">
                      {results.final_captains_call.tactical_goal}
                    </p>
                  </div>
                </div>

                <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-3">
                  <h4 className="text-xs text-red-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Key Risk</h4>
                  <p className="text-sm text-red-200">
                    {results.final_captains_call.key_risk}
                  </p>
                </div>

                <div className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-3">
                  <h4 className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Why This Works</h4>
                  <p className="text-sm text-blue-200">
                    {results.final_captains_call.why_this_works}
                  </p>
                </div>

                <div className="flex items-center justify-between bg-slate-900/40 rounded-lg p-3 border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Confidence</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-400" 
                        style={{ width: `${results.final_captains_call.confidence_score}%` }} 
                      />
                    </div>
                    <span className="text-sm font-bold text-emerald-400">{results.final_captains_call.confidence_score}%</span>
                  </div>
                </div>

              </motion.div>
            ) : (
              <div className="text-sm text-slate-500 italic mt-8 text-center py-10">
                Awaiting final decision...
              </div>
            )}
          </div>

          <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-cyan-300 border-b border-cyan-900/50 pb-3">
              <MessageSquareText className="w-5 h-5" /> Live Commentary
            </h2>
            
            {results ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-blue-950/30 border border-blue-900/50 rounded-xl p-4 shadow-inner">
                  <p className="text-sm text-cyan-100 font-medium leading-relaxed italic">
                    " {results.commentary} "
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="text-sm text-slate-500 italic mt-8 text-center">
                Waiting for the next delivery...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
