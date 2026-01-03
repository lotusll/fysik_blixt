
import React, { useMemo } from 'react';

interface Props {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  segments?: number;
  amplitude?: number;
}

const LightningBolt: React.FC<Props> = ({ startX, startY, endX, endY, segments = 8, amplitude = 20 }) => {
  const path = useMemo(() => {
    let d = `M ${startX} ${startY}`;
    const dx = (endX - startX) / segments;
    const dy = (endY - startY) / segments;

    for (let i = 1; i < segments; i++) {
      const midX = startX + dx * i + (Math.random() - 0.5) * amplitude;
      const midY = startY + dy * i + (Math.random() - 0.5) * amplitude;
      d += ` L ${midX} ${midY}`;
    }

    d += ` L ${endX} ${endY}`;
    return d;
  }, [startX, startY, endX, endY, segments, amplitude]);

  return (
    <g>
      <path 
        d={path} 
        fill="none" 
        stroke="#fff" 
        strokeWidth="4" 
        strokeLinecap="round" 
        className="animate-pulse"
        style={{ filter: 'drop-shadow(0 0 8px #fff) drop-shadow(0 0 20px #fbbf24)' }}
      />
      <path 
        d={path} 
        fill="none" 
        stroke="#fde047" 
        strokeWidth="1" 
        strokeLinecap="round"
      />
    </g>
  );
};

export default LightningBolt;
