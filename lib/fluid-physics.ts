import { ProductParticle, FluidSettings, Product } from './types';

export class FluidPhysics {
  private particles: ProductParticle[] = [];
  private settings: FluidSettings;
  private mouseX = 0;
  private mouseY = 0;
  private mousePressed = false;

  constructor(settings: FluidSettings) {
    this.settings = settings;
  }

  updateMousePosition(x: number, y: number, pressed = false) {
    this.mouseX = x;
    this.mouseY = y;
    this.mousePressed = pressed;
  }

  updateSettings(settings: Partial<FluidSettings>) {
    this.settings = { ...this.settings, ...settings };
  }

  addParticle(particle: ProductParticle) {
    this.particles.push(particle);
  }

  setParticles(particles: ProductParticle[]) {
    this.particles = particles;
  }

  update(deltaTime: number) {
    this.particles.forEach(particle => {
      this.updateParticlePhysics(particle, deltaTime);
      this.updateSubParticles(particle, deltaTime);
    });
  }

  private updateParticlePhysics(particle: ProductParticle, deltaTime: number) {
    // Calculate mouse influence
    const dx = this.mouseX - particle.x;
    const dy = this.mouseY - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Mouse influence radius
    const influenceRadius = this.mousePressed ? 200 : 100;
    
    if (distance < influenceRadius) {
      const force = (influenceRadius - distance) / influenceRadius;
      const angle = Math.atan2(dy, dx);
      
      if (this.mousePressed) {
        // Attraction when pressed
        particle.vx += Math.cos(angle) * force * 2;
        particle.vy += Math.sin(angle) * force * 2;
      } else {
        // Repulsion on hover
        particle.vx -= Math.cos(angle) * force * 0.5;
        particle.vy -= Math.sin(angle) * force * 0.5;
      }
    }

    // Apply fluid flow based on settings
    const flowForce = this.settings.flowSpeed * 0.01;
    const flowAngle = this.settings.currentDirection * Math.PI / 180;
    particle.vx += Math.cos(flowAngle) * flowForce;
    particle.vy += Math.sin(flowAngle) * flowForce;

    // Apply temperature effects (viscosity)
    const viscosity = Math.max(0.1, 1 - this.settings.temperature * 0.01);
    particle.vx *= viscosity;
    particle.vy *= viscosity;

    // Update position
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;

    // Boundary conditions (wrap around screen)
    if (particle.x < -50) particle.x = window.innerWidth + 50;
    if (particle.x > window.innerWidth + 50) particle.x = -50;
    if (particle.y < -50) particle.y = window.innerHeight + 50;
    if (particle.y > window.innerHeight + 50) particle.y = -50;

    // Update pulse phase for glow effects
    particle.pulsePhase += deltaTime * 0.002;

    // Update hover state
    particle.isHovered = distance < 80;
  }

  private updateSubParticles(mainParticle: ProductParticle, deltaTime: number) {
    mainParticle.particles.forEach(subParticle => {
      // Sub-particles orbit around main particle
      const targetX = mainParticle.x + Math.sin(Date.now() * 0.001 + subParticle.x) * 30;
      const targetY = mainParticle.y + Math.cos(Date.now() * 0.001 + subParticle.y) * 30;
      
      // Smooth movement towards target
      subParticle.vx += (targetX - subParticle.x) * 0.02;
      subParticle.vy += (targetY - subParticle.y) * 0.02;
      
      // Apply damping
      subParticle.vx *= 0.95;
      subParticle.vy *= 0.95;
      
      // Update position
      subParticle.x += subParticle.vx * deltaTime;
      subParticle.y += subParticle.vy * deltaTime;
      
      // Update opacity based on main particle state
      const targetOpacity = mainParticle.isHovered ? 0.8 : 0.3;
      subParticle.opacity += (targetOpacity - subParticle.opacity) * 0.1;
    });
  }

  getParticles(): ProductParticle[] {
    return this.particles;
  }

  // Create particle groups from products
  static createParticleFromProduct(product: Product, x: number, y: number): ProductParticle {
    const particleCount = Math.floor(Math.random() * 15) + 20; // 20-35 particles
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 60,
        y: y + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 2,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    return {
      id: product.id,
      product,
      x,
      y,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      size: 60,
      opacity: 0.6,
      pulsePhase: Math.random() * Math.PI * 2,
      isHovered: false,
      isSelected: false,
      particles
    };
  }
}