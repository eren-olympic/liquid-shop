export interface Product {
  id: number;
  name: string;
  price_in_cents: number;
  image_url: string;
}

export interface ProductParticle {
  id: number;
  product: Product;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulsePhase: number;
  isHovered: boolean;
  isSelected: boolean;
  particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
  }>;
}

export interface FluidSettings {
  depth: number;
  temperature: number;
  currentDirection: number;
  particleCount: number;
  flowSpeed: number;
}