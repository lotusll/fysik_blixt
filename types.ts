
export interface Step {
  id: number;
  title: string;
  description: string;
  longDescription: string;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  charge: 'positive' | 'negative';
  type: 'ice' | 'hail';
}
