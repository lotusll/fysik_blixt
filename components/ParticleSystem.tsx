
import React, { useEffect, useRef, useState } from 'react';
import { Particle } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, PARTICLE_COUNT } from '../constants';

interface Props {
  step: number;
  isStriking: boolean;
}

const ParticleSystem: React.FC<Props> = ({ step, isStriking }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const requestRef = useRef<number>();

  useEffect(() => {
    const initialParticles: Particle[] = Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
      id: i,
      x: Math.random() * 400 + 200,
      y: Math.random() * 200 + 100,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      charge: i % 2 === 0 ? 'positive' : 'negative',
      type: i % 2 === 0 ? 'ice' : 'hail'
    }));
    setParticles(initialParticles);
  }, []);

  const animate = () => {
    setParticles(prev => prev.map(p => {
      let nx = p.x + p.vx;
      let ny = p.y + p.vy;

      // Stage 0-1: Random or rising
      if (step <= 1) {
        if (nx < 200 || nx > 600) p.vx *= -1;
        if (ny < 100 || ny > 300) p.vy *= -1;
        if (step === 1) p.vy -= 0.05; // Gentle rising effect
      } 
      // Stage 2+: Drift based on charge
      else {
        const targetY = p.charge === 'positive' ? 140 : 260;
        p.vy += (targetY - ny) * 0.01;
        p.vx *= 0.95;
        p.vy *= 0.95;
        
        if (nx < 220 || nx > 580) p.vx *= -1;
      }

      return { ...p, x: nx + p.vx, y: ny + p.vy };
    }));
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [step]);

  return (
    <g>
      {particles.map(p => (
        <g key={p.id} transform={`translate(${p.x}, ${p.y})`}>
          {/* Particle body - only show charges from step 2 onwards */}
          <circle 
            r={p.type === 'hail' ? 8 : 6} 
            fill={step < 2 ? '#cbd5e1' : (p.charge === 'positive' ? '#93c5fd' : '#fde047')} 
            className="transition-colors duration-500"
          />
          {step >= 2 && (
            <text 
              fontSize="12" 
              textAnchor="middle" 
              dy="4" 
              fill={p.charge === 'positive' ? '#1e3a8a' : '#854d0e'}
              className="font-black select-none pointer-events-none"
            >
              {p.charge === 'positive' ? '+' : '-'}
            </text>
          )}
        </g>
      ))}
    </g>
  );
};

export default ParticleSystem;
