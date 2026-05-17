import { motion } from "framer-motion";

interface FieldVisualizationProps {
  positions: string[];
}

export function FieldVisualization({ positions }: FieldVisualizationProps) {
  // Approximate mapping of fielding positions to x,y coordinates (0-100)
  // assuming batter is at bottom center (50, 80) facing top center (50, 20)
  const positionMap: Record<string, { x: number; y: number }> = {
    "long-off": { x: 30, y: 15 },
    "long-on": { x: 70, y: 15 },
    "straight-hit": { x: 50, y: 10 },
    "deep square": { x: 90, y: 50 },
    "deep square leg": { x: 90, y: 50 },
    "deep mid-wicket": { x: 85, y: 35 },
    "cow corner": { x: 80, y: 25 },
    "fine leg": { x: 70, y: 90 },
    "third man": { x: 20, y: 90 },
    "third man wide": { x: 15, y: 85 },
    "deep point": { x: 10, y: 50 },
    "deep cover": { x: 15, y: 35 },
    "deep extra cover": { x: 20, y: 25 },
    "point": { x: 25, y: 65 },
    "cover": { x: 35, y: 55 },
    "extra cover": { x: 40, y: 45 },
    "mid-off": { x: 45, y: 35 },
    "mid-on": { x: 55, y: 35 },
    "mid-wicket": { x: 65, y: 55 },
    "square leg": { x: 75, y: 65 },
    "slip": { x: 40, y: 85 },
    "gully": { x: 30, y: 80 },
    "short fine leg": { x: 60, y: 85 },
  };

  const normalizePosition = (pos: string) => pos.toLowerCase().trim();

  // Find coordinates, default to generic ring if unknown
  const getCoordinates = (pos: string, index: number) => {
    const normPos = normalizePosition(pos);
    for (const key of Object.keys(positionMap)) {
      if (normPos.includes(key)) {
        return positionMap[key];
      }
    }
    // Randomish fallback around the circle
    const angle = (index * (360 / Math.max(1, positions.length))) * (Math.PI / 180);
    return {
      x: 50 + Math.cos(angle) * 40,
      y: 50 + Math.sin(angle) * 40,
    };
  };

  return (
    <div className="relative w-full aspect-[4/5] bg-emerald-950/40 rounded-full border-2 border-slate-700/50 overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
      {/* Pitch */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-32 bg-amber-900/30 border border-amber-800/40" />
      
      {/* 30 yard circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[50%] border border-white/20 rounded-[50%]" />

      {/* Creases */}
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-10 border-t border-white/40" />
      <div className="absolute top-[75%] left-1/2 -translate-x-1/2 w-10 border-t border-white/40" />

      {/* Wickets */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-2 h-1 bg-white/60" />
      <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-2 h-1 bg-white/60" />

      {/* Fielders */}
      {positions.map((pos, i) => {
        const { x, y } = getCoordinates(pos, i);
        return (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
            className="absolute w-3 h-3 bg-red-500 rounded-full border border-white shadow-[0_0_8px_rgba(239,68,68,0.8)] z-10 group"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 bg-slate-900/90 text-[10px] text-white whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 border border-slate-700">
              {pos}
            </div>
            {/* Pulse effect */}
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-50" />
          </motion.div>
        );
      })}
    </div>
  );
}
