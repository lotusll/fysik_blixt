
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ParticleSystem from './ParticleSystem';
import LightningBolt from './LightningBolt';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';

interface Props {
  step: number;
}

type StrikeType = 'internal' | 'air' | 'ground_tree' | 'ground_house' | null;

interface InternalPath {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const AnimationStage: React.FC<Props> = ({ step }) => {
  const [strike, setStrike] = useState<StrikeType>(null);
  const [strikeLabel, setStrikeLabel] = useState<string>("");
  const [internalPath, setInternalPath] = useState<InternalPath>({ startX: 350, startY: 260, endX: 450, endY: 130 });

  const triggerStrike = useCallback(() => {
    const types: StrikeType[] = ['internal', 'internal', 'air', 'ground_tree', 'ground_house'];
    const selected = types[Math.floor(Math.random() * types.length)];
    
    const labels: Record<string, string> = {
      internal: "Urladdning inuti molnet",
      air: "Lufturladdning",
      ground_tree: "Blixt mot marken (träd)",
      ground_house: "Blixt mot marken (hus)"
    };

    if (selected === 'internal') {
      // Randomize internal strike path within cloud bounds
      // Upper cloud is roughly 100-200y, lower is 200-300y
      // Left-right is 200-600x
      setInternalPath({
        startX: 250 + Math.random() * 300,
        startY: 230 + Math.random() * 50, // Start lower (negative region)
        endX: 250 + Math.random() * 300,
        endY: 120 + Math.random() * 80,   // End higher (positive region)
      });
    }

    setStrike(selected);
    setStrikeLabel(labels[selected as string] || "");
    
    setTimeout(() => {
      setStrike(null);
    }, 150);
  }, []);

  useEffect(() => {
    let interval: any;
    if (step === 4) {
      interval = setInterval(() => {
        triggerStrike();
      }, 2500);
    } else {
      setStrike(null);
      setStrikeLabel("");
    }
    return () => clearInterval(interval);
  }, [step, triggerStrike]);

  return (
    <div className="relative w-full max-w-4xl aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
      {/* Dynamic Label */}
      {step === 4 && strikeLabel && (
        <div className="absolute top-6 left-6 z-20 bg-black/70 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-yellow-400 font-extrabold text-lg uppercase tracking-wider">{strikeLabel}</p>
        </div>
      )}

      <svg 
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} 
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <radialGradient id="cloudGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#475569" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#skyGradient)" />
        
        {/* Height & Temperature Scale */}
        <line x1="750" y1="50" x2="750" y2="500" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
        <g fontSize="16" fill="#cbd5e1" fontWeight="bold">
          <text x="620" y="60" textAnchor="start">12 km (-50°C)</text>
          <text x="620" y="275" textAnchor="start">5 km (-15°C)</text>
          <text x="620" y="490" textAnchor="start">Mark (+25°C)</text>
        </g>

        {/* Updrafts */}
        {(step === 1) && (
          <g className="animate-pulse">
            <path d="M 380 450 L 380 350 M 375 365 L 380 350 L 385 365" stroke="#60a5fa" strokeWidth="3" fill="none" />
            <path d="M 420 450 L 420 350 M 415 365 L 420 350 L 425 365" stroke="#60a5fa" strokeWidth="3" fill="none" />
            <text x="400" y="475" fill="#60a5fa" fontSize="18" fontWeight="black" textAnchor="middle">VARMA UPPVINDAR</text>
          </g>
        )}

        {/* Ground */}
        <rect x="0" y="500" width="800" height="100%" fill="#064e3b" />
        <path d="M 0 500 Q 400 480 800 500" fill="#065f46" />
        
        {/* Ground Objects */}
        <g transform="translate(600, 430)">
          <path d="M 0 70 L 30 70 L 15 0 Z" fill="#064e3b" stroke="#059669" strokeWidth="2" />
        </g>
        <g transform="translate(150, 450)">
          <rect width="40" height="50" fill="#334155" />
          <path d="M -10 0 L 50 0 L 20 -30 Z" fill="#991b1b" />
          <rect x="10" y="25" width="20" height="25" fill="#1e293b" />
        </g>

        {/* Positive Ground Charges */}
        {(step >= 3) && (
          <g className="animate-pulse opacity-80">
            <text x="610" y="470" fill="#93c5fd" fontSize="20" fontWeight="bold">+</text>
            <text x="165" y="440" fill="#93c5fd" fontSize="20" fontWeight="bold">+</text>
            <text x="400" y="490" fill="#93c5fd" fontSize="20" fontWeight="bold">+</text>
          </g>
        )}

        {/* Cloud Body */}
        <g className="transition-all duration-1000">
          <circle cx="400" cy="200" r="180" fill="url(#cloudGlow)" />
          <path 
            d="M 250 250 Q 200 250 200 200 Q 200 150 250 150 Q 250 100 350 100 Q 450 100 450 150 Q 550 150 550 200 Q 550 250 500 250 Q 500 300 350 300 Q 250 300 250 250" 
            fill={step >= 3 ? "#1e293b" : "#475569"} 
            className="transition-colors duration-1000 shadow-2xl"
          />
          {step <= 1 && <line x1="200" y1="275" x2="600" y2="275" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 5" opacity="0.5" />}
          {step <= 1 && <text x="210" y="270" fill="#3b82f6" fontSize="14" fontWeight="bold" opacity="0.8">FRYSGRÄNS (0°C)</text>}
        </g>

        {/* Dynamic Content */}
        <ParticleSystem step={step === 0 ? 0 : step === 1 ? 0 : step - 1} isStriking={!!strike} />

        {/* Lightning Logic */}
        {strike === 'ground_tree' && (
          <g>
            <LightningBolt startX={400} startY={250} endX={615} endY={430} amplitude={40} segments={12} />
            <rect width="800" height="600" fill="white" opacity="0.15" />
          </g>
        )}
        {strike === 'ground_house' && (
          <g>
            <LightningBolt startX={300} startY={260} endX={170} endY={430} amplitude={40} segments={12} />
            <rect width="800" height="600" fill="white" opacity="0.15" />
          </g>
        )}
        {strike === 'internal' && (
          <g>
            <LightningBolt 
              startX={internalPath.startX} 
              startY={internalPath.startY} 
              endX={internalPath.endX} 
              endY={internalPath.endY} 
              amplitude={25} 
              segments={8} 
            />
            <rect width="800" height="600" fill="white" opacity="0.1" />
          </g>
        )}
        {strike === 'air' && (
          <g>
            <LightningBolt startX={500} startY={220} endX={750} endY={350} amplitude={50} segments={8} />
            <rect width="800" height="600" fill="white" opacity="0.05" />
          </g>
        )}
      </svg>
      
      {/* Global Flash Effect */}
      {strike && <div className="absolute inset-0 bg-white/10 pointer-events-none animate-pulse" />}
    </div>
  );
};

export default AnimationStage;
