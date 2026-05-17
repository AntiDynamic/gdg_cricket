"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, BrainCircuit, MessageSquareText, ShieldAlert, Swords, Trophy, Loader2, Target, Crosshair, TrendingUp, AlertTriangle, Zap, Gauge } from "lucide-react";
import axios from "axios";
import { FieldVisualization } from "@/components/FieldVisualization";

export default function Home() {
  const [formData, setFormData] = useState({
    match_id: "",
    batting_team: "MI",
    bowling_team: "CSK",
    score: 172,
    wickets: 5,
    overs: 17.0,
    target: 207,
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
  const [error, setError] = useState<string | null>(null);

  // Visual metrics
  const [metrics, setMetrics] = useState({ winProb: 50, momentum: 50, reqRr: 0, currRr: 0, pressure: 50 });

  const [matchUrl, setMatchUrl] = useState("");
  const [ingesting, setIngesting] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'number' ? Number(value) : value 
    });
  };

  const runAnalysisWithState = async (stateData: any) => {
    setLoading(true);
    setResults(null);
    setError(null);
    try {
      const payload: any = { 
        ...stateData,
        score: String(stateData.score),
        target: String(stateData.target),
        overs: String(stateData.overs),
        wickets: String(stateData.wickets)
      };
      if (payload.match_id) payload.match_id = parseInt(payload.match_id, 10);
      else payload.match_id = null;
      
      // Calculate realistic dummy metrics based on form inputs for demo
      const runsNeeded = stateData.target - stateData.score;
      const ballsLeft = 120 - Math.floor(stateData.overs) * 6 - (stateData.overs % 1) * 10;
      const reqRate = runsNeeded > 0 && ballsLeft > 0 ? (runsNeeded / ballsLeft) * 6 : 0;
      const currRate = stateData.overs > 0 ? (stateData.score / stateData.overs) : 0;
      
      let wp = 50 + (currRate - reqRate) * 10 - stateData.wickets * 5;
      if (wp < 5) wp = 5;
      if (wp > 95) wp = 95;
      
      const pressureLevel = Math.min(100, Math.max(0, reqRate * 8 + stateData.wickets * 5));

      setMetrics({ 
        winProb: Math.round(wp), 
        momentum: Math.round(wp + (Math.random() * 20 - 10)), 
        reqRr: reqRate, 
        currRr: currRate,
        pressure: Math.round(pressureLevel)
      });

      const res = await axios.post("http://localhost:8000/api/tactics", payload);
      setResults(res.data);
    } catch (err: any) {
      console.error("Analysis failed", err);
      if (err.response?.status === 429 || err.response?.status === 500 || err.response?.data?.error?.includes('exhausted')) {
        setError("API key exhausted");
      } else if (err.message === "Network Error") {
        setError("Network Error: Backend unreachable. Ensure FastAPI is running on 127.0.0.1:8000.");
      } else {
        setError("API key exhausted");
      }
    }
    setLoading(false);
  };

  const handleAnalyze = async () => {
    await runAnalysisWithState(formData);
  };

  const handleIngest = async () => {
    if (!matchUrl) return;
    setIngesting(true);
    setSyncStatus("Connecting live scraper feed...");
    setError(null);
    
    // Multi-stage loader status transition
    setTimeout(() => {
      setSyncStatus("Extracting tactical entities...");
    }, 1000);

    setTimeout(() => {
      setSyncStatus("Normalizing match-state variables...");
    }, 2000);

    try {
      const res = await axios.post("http://localhost:8000/api/ingest", { url: matchUrl });
      if (res.data && res.data.status === "success") {
        const data = res.data.data;
        
        // Normalize values safely
        const parsedScore = parseInt(data.score, 10) || 172;
        const parsedWickets = parseInt(data.wickets, 10) || 5;
        const parsedOvers = parseFloat(data.overs) || 17.0;
        const parsedTarget = data.target === "N/A" ? 0 : (parseInt(data.target, 10) || 0);
        
        const newFormData = {
          match_id: "",
          batting_team: data.batting_team || "MI",
          bowling_team: data.bowling_team || "CSK",
          score: parsedScore,
          wickets: parsedWickets,
          overs: parsedOvers,
          target: parsedTarget,
          striker: data.striker || "Hardik",
          non_striker: data.non_striker || "David",
          current_bowler: data.bowler || "Pathirana",
          pitch_type: data.pitch_type || "Slow, Gripping",
          dew_factor: data.dew_factor || "High",
          venue: data.venue || "Wankhede",
          custom_scenario: data.custom_scenario || data.momentum || "Live scenario synced from URL."
        };

        setFormData(newFormData);
        setSyncStatus("Ingestion complete! Syncing multi-agent debate...");
        
        // Trigger multi-agent debate automatically using the fresh form data!
        await runAnalysisWithState(newFormData);
        
        if (res.data.source === "degraded_fallback") {
          setSyncStatus("Live tactical feed partially degraded. Continuing with available match intelligence.");
        } else {
          setSyncStatus("Synced & analyzed in real-time! ⚡");
        }
        
        setTimeout(() => setSyncStatus(null), 4000);
      } else {
        setError("Failed to ingest URL data.");
      }
    } catch (err: any) {
      console.error("URL Ingestion failed", err);
      // Ensure failure handling rules: never expose API failures, parsing errors or traces
      setError("Live tactical feed partially degraded. Continuing with available match intelligence.");
    } finally {
      setIngesting(false);
    }
  };

  const getMatchPhase = () => {
    if (formData.overs < 6) return "POWERPLAY";
    if (formData.overs < 15) return "MIDDLE OVERS";
    return "DEATH OVERS";
  };


  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 lg:p-6 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      {/* Stadium Lights — decorative only, must not block clicks */}
      <div className="stadium-light light-left pointer-events-none" />
      <div className="stadium-light light-right pointer-events-none" />

      <header className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-white/10 gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50 animate-pulse" />
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-3 rounded-xl border border-slate-700 shadow-2xl">
              <Trophy className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm uppercase">
              Captain Cool
            </h1>
            <p className="text-slate-400 text-sm font-medium tracking-widest uppercase mt-1">Multi-Agent Tactical War-Room</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-full backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-sm text-slate-300 font-semibold tracking-wider uppercase">Live Analytics</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* ================================================== */}
        {/* LEFT PANEL — MATCH CONTROL                         */}
        {/* ================================================== */}
        <div className="lg:col-span-3 flex flex-col h-[calc(100vh-8rem)] min-h-[600px] overflow-y-auto custom-scrollbar pr-2 space-y-6 pb-10">
          <div className="glass-panel-heavy p-6 rounded-2xl relative overflow-hidden group shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-100 uppercase tracking-wide">
                <Swords className="w-5 h-5 text-blue-400" /> Match Control
              </h2>
              <div className="px-2 py-1 bg-blue-950/50 border border-blue-900/50 rounded text-[10px] text-blue-400 font-bold tracking-widest uppercase">
                {getMatchPhase()}
              </div>
            </div>
            
            <div className="space-y-5">
              {/* URL Ingestion */}
              <div className="space-y-1.5 border-b border-white/10 pb-4">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" /> Paste Match URL
                </label>
                <div className="relative flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="Cricbuzz / ESPN URL..." 
                    value={matchUrl}
                    onChange={(e) => setMatchUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-205 placeholder-slate-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  {matchUrl && (
                    <button onClick={() => setMatchUrl("")} className="absolute right-2.5 text-slate-400 hover:text-white text-xs">×</button>
                  )}
                </div>
                <button
                  onClick={handleIngest}
                  disabled={ingesting || !matchUrl}
                  className="w-full bg-blue-900/40 hover:bg-blue-800/60 border border-blue-500/30 rounded-lg text-xs font-bold text-blue-300 py-2.5 uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {ingesting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                      Syncing Live Feed...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3 text-emerald-400 animate-pulse" />
                      Sync Match Data
                    </>
                  )}
                </button>
                {syncStatus && (
                  <div className="text-[10px] text-cyan-300 bg-cyan-950/40 border border-cyan-800/30 rounded p-2 text-center animate-pulse font-medium tracking-wide">
                    {syncStatus}
                  </div>
                )}
              </div>

              {/* Teams */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Batting</label>
                  <select name="batting_team" value={formData.batting_team} onChange={handleChange} className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg p-2.5 text-sm font-bold text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all cursor-pointer">
                    <option>MI</option><option>CSK</option><option>RCB</option><option>KKR</option><option>SRH</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Bowling</label>
                  <select name="bowling_team" value={formData.bowling_team} onChange={handleChange} className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg p-2.5 text-sm font-bold text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all cursor-pointer">
                    <option>CSK</option><option>MI</option><option>RCB</option><option>KKR</option><option>SRH</option>
                  </select>
                </div>
              </div>

              {/* Match Situation */}
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1 block">Score</label>
                    <input type="number" name="score" value={formData.score} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-center text-lg font-bold font-mono text-white focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1 block">Wkts</label>
                    <input type="number" name="wickets" value={formData.wickets} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-center text-lg font-bold font-mono text-red-400 focus:ring-1 focus:ring-red-500" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1 block">Overs</label>
                    <input type="number" step="0.1" name="overs" value={formData.overs} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-center text-lg font-bold font-mono text-white focus:ring-1 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1 block">Target</label>
                    <input type="number" name="target" value={formData.target} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-center text-sm font-bold font-mono text-emerald-400" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1 block">Bowler</label>
                    <input type="text" name="current_bowler" value={formData.current_bowler} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm font-bold text-white text-center" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1 block">Striker</label>
                    <input type="text" name="striker" value={formData.striker} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-bold text-white text-center" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1 block">Non-Striker</label>
                    <input type="text" name="non_striker" value={formData.non_striker} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-bold text-white text-center" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1 block">Venue</label>
                  <input type="text" name="venue" value={formData.venue} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-bold text-white text-center" />
                </div>
              </div>

              {/* Conditions */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Pitch</label>
                  <select name="pitch_type" value={formData.pitch_type} onChange={handleChange} className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200">
                    <option>Slow, Gripping</option><option>Flat, Hard</option><option>Green, Seaming</option><option>Two-paced</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Dew</label>
                  <select name="dew_factor" value={formData.dew_factor} onChange={handleChange} className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200">
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Tactical Scenario</label>
                <textarea
                  name="custom_scenario"
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg p-3 text-xs text-slate-300 resize-none focus:ring-1 focus:ring-blue-500 outline-none leading-relaxed"
                  rows={3}
                  value={formData.custom_scenario}
                  onChange={handleChange}
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full relative group overflow-hidden bg-slate-800 rounded-xl font-bold uppercase tracking-wider text-sm shadow-xl transition-all active:scale-[0.98] disabled:opacity-70 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 group-hover:opacity-90 transition-opacity pointer-events-none" />
                {/* Shine effect */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine pointer-events-none" />
                <div className="relative z-10 flex items-center justify-center gap-3 py-3.5 px-4 text-white">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Orchestrating...
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="w-5 h-5" />
                      Engage War-Room
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
          
          {/* Visual Meters (Only show when results exist) */}
          <AnimatePresence>
            {results && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }} 
                className="glass-panel p-5 rounded-2xl space-y-5"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-emerald-400" /> Match Pressure
                  </h2>
                  <span className="text-xs font-mono font-bold text-slate-400">{metrics.pressure}%</span>
                </div>
                
                {/* Pressure Gauge */}
                <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 opacity-20 pointer-events-none" />
                  <motion.div 
                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-600 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.pressure}%` }}
                    transition={{ duration: 1, type: "spring" }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                  <div className="text-center">
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Required RR</div>
                    <div className="text-2xl font-bold font-mono text-red-400 neon-text-red drop-shadow-md">{metrics.reqRr.toFixed(2)}</div>
                  </div>
                  <div className="text-center border-l border-slate-800">
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Current RR</div>
                    <div className="text-2xl font-bold font-mono text-blue-400 drop-shadow-md">{metrics.currRr.toFixed(2)}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ================================================== */}
        {/* CENTER PANEL — AGENT DEBATE TIMELINE               */}
        {/* ================================================== */}
        <div className="lg:col-span-5 space-y-6 flex flex-col h-[calc(100vh-8rem)] min-h-[600px]">
          <div className="glass-panel-heavy p-0 rounded-2xl flex flex-col h-full border border-slate-800/80 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />
            
            <div className="p-5 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex justify-between items-center z-10">
              <h2 className="text-sm font-bold flex items-center gap-2 text-white uppercase tracking-widest">
                <Zap className="w-4 h-4 text-purple-400" /> Strategic Debate
              </h2>
              {loading && <span className="flex items-center gap-2 text-[10px] text-purple-400 font-bold uppercase tracking-wider animate-pulse"><Loader2 className="w-3 h-3 animate-spin" /> Live Syncing...</span>}
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar relative z-0">
              <AnimatePresence mode="wait">
                {error ? (
                  <motion.div key="error" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-red-950/60 border border-red-500/40 rounded-2xl p-5 flex flex-col items-center text-center shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <ShieldAlert className="w-10 h-10 text-red-500 mb-3 animate-pulse" />
                    <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-2">System Failure</h3>
                    <p className="text-xs text-red-200/90 font-medium mb-4">{error}</p>
                    <button
                      onClick={() => setError(null)}
                      className="px-4 py-1.5 bg-red-900/60 hover:bg-red-800/80 border border-red-500/40 rounded-lg text-xs font-bold text-red-300 uppercase tracking-wider transition-colors"
                    >
                      Dismiss
                    </button>
                  </motion.div>
                ) : results ? (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="space-y-8 relative pb-10"
                  >
                    {/* Timeline Line */}
                    <div className="absolute top-8 bottom-0 left-[23px] w-[2px] bg-gradient-to-b from-blue-500/30 via-purple-500/30 to-red-500/30 z-[-1]" />

                    {/* Stats Analyst */}
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex gap-4 relative">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] z-10">
                        <Activity className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl rounded-tl-none p-4 w-full shadow-lg backdrop-blur-sm group hover:border-blue-500/30 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest bg-blue-950/50 px-2 py-1 rounded">Data Intel</h3>
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider">Agent 01</span>
                        </div>
                        <div className="text-sm text-slate-300 font-medium leading-relaxed">
                          {results.stats_analysis}
                        </div>
                      </div>
                    </motion.div>

                    {/* Strategist */}
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="flex gap-4 relative">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)] z-10">
                        <BrainCircuit className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl rounded-tl-none p-4 w-full shadow-lg backdrop-blur-sm group hover:border-purple-500/30 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest bg-purple-950/50 px-2 py-1 rounded">Primary Strategy</h3>
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider">Agent 02</span>
                        </div>
                        <p className="text-sm text-slate-200 font-medium leading-relaxed border-l-2 border-purple-500/50 pl-3">
                          "{results.strategist_proposal}"
                        </p>
                      </div>
                    </motion.div>

                    {/* Devil's Advocate */}
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex gap-4 relative">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] z-10">
                        <ShieldAlert className="w-6 h-6 text-red-400" />
                      </div>
                      <div className="bg-red-950/10 border border-red-900/30 rounded-2xl rounded-tl-none p-4 w-full shadow-lg backdrop-blur-sm group hover:border-red-500/30 transition-colors relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full" />
                        <div className="flex justify-between items-start mb-3 relative z-10">
                          <h3 className="text-[10px] font-extrabold text-red-400 uppercase tracking-widest bg-red-950/50 px-2 py-1 rounded flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Critical Risk</h3>
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider">Agent 03</span>
                        </div>
                        <p className="text-sm text-red-200/90 font-semibold leading-relaxed relative z-10">
                          {results.devils_advocate_challenge}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : !loading ? (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50 relative z-10">
                    <div className="relative">
                      <Swords className="w-16 h-16 mb-4" />
                      <div className="absolute inset-0 bg-slate-500 blur-xl opacity-20" />
                    </div>
                    <p className="font-mono text-sm uppercase tracking-widest">Awaiting Context Parameters</p>
                  </motion.div>
                ) : (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center mt-20 text-blue-500 relative z-10 space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <div className="font-mono text-xs uppercase tracking-widest flex flex-col items-center gap-1">
                      <span className="text-blue-400">Initializing Sub-Agents...</span>
                      <span className="text-slate-500">Cross-referencing Matchups...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* RIGHT PANEL — FINAL CAPTAIN'S CALL                 */}
        {/* ================================================== */}
        <div className="lg:col-span-4 space-y-6 flex flex-col h-[calc(100vh-8rem)] min-h-[600px]">
          <div className="glass-panel-heavy p-0 rounded-2xl flex-1 border border-slate-800/80 shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="p-5 border-b border-emerald-900/30 bg-emerald-950/10 backdrop-blur-md z-10">
              <h2 className="text-sm font-bold flex items-center justify-between text-emerald-400 uppercase tracking-widest">
                <div className="flex items-center gap-2"><Target className="w-4 h-4" /> Executive Decision</div>
                {results && (
                  <div className="flex items-center gap-2 text-[10px] font-bold">
                    <span className="text-slate-400">Win Prob</span>
                    <span className="bg-emerald-950 border border-emerald-800 px-2 py-1 rounded text-emerald-400">{metrics.winProb}%</span>
                  </div>
                )}
              </h2>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto custom-scrollbar relative z-10">
              {results && results.final_captains_call ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }} className="space-y-5">
                  
                  {/* NEXT MOVE CARD */}
                  <div className="bg-emerald-950/40 border-l-4 border-emerald-500 rounded-r-xl p-4 shadow-lg">
                    <h4 className="text-[10px] text-emerald-500/80 font-bold uppercase tracking-widest mb-2">Direct Order</h4>
                    <p className="text-lg font-bold text-white leading-tight">
                      {results.final_captains_call.next_move}
                    </p>
                  </div>

                  {/* FIELD VISUALIZATION (PREMIUM FEATURE) */}
                  <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 space-y-4">
                     <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2"><Crosshair className="w-3 h-3"/> Tactical Field Setup</h4>
                     <div className="flex flex-col md:flex-row gap-4 items-center">
                       <div className="w-full md:w-1/2 flex justify-center">
                          <div className="w-32 sm:w-40">
                             <FieldVisualization positions={results.final_captains_call.field_setup || []} />
                          </div>
                       </div>
                       <div className="w-full md:w-1/2">
                          <ul className="text-xs text-slate-300 space-y-2 font-medium">
                            {(results.final_captains_call.field_setup || []).map((field: string, idx: number) => (
                              <li key={idx} className="flex items-center gap-2 bg-slate-800/50 px-2 py-1.5 rounded border border-slate-700/50">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                {field}
                              </li>
                            ))}
                          </ul>
                       </div>
                     </div>
                  </div>

                  {/* TACTICAL GOAL & RISK */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
                      <h4 className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Tactical Objective</h4>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed">
                        {results.final_captains_call.tactical_goal}
                      </p>
                    </div>

                    <div className="bg-red-950/10 border border-red-900/20 rounded-xl p-4">
                      <h4 className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">Failure Condition</h4>
                      <p className="text-xs text-red-200/80 font-medium leading-relaxed">
                        {results.final_captains_call.key_risk}
                      </p>
                    </div>
                  </div>

                  {/* COUNTERFACTUAL / WHY IT WORKS */}
                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
                    <h4 className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-1">Strategic Logic</h4>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
                      "{results.final_captains_call.why_this_works}"
                    </p>
                  </div>

                  {/* CONFIDENCE METER */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Execution Confidence</span>
                      <span className="text-xs font-bold text-emerald-400">{results.final_captains_call.confidence_score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" 
                        initial={{ width: 0 }}
                        animate={{ width: `${results.final_captains_call.confidence_score}%` }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                      />
                    </div>
                  </div>

                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50 relative z-10">
                   <Target className="w-12 h-12 mb-3" />
                   <p className="font-mono text-xs uppercase tracking-widest">Awaiting Orchestration</p>
                </div>
              )}
            </div>
            
            {/* Live Commentary Ticker */}
            {results && results.commentary && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }} className="border-t border-slate-800/80 bg-slate-900/80 p-3 flex items-center gap-3 backdrop-blur-md z-20">
                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center border border-blue-500/30">
                  <MessageSquareText className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-xs text-cyan-200 font-medium line-clamp-2 italic">
                  "{results.commentary}"
                </p>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
