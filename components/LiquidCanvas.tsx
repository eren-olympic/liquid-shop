'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { FluidPhysics } from '@/lib/fluid-physics';
import { ProductParticle, FluidSettings, Product } from '@/lib/types';

interface LiquidCanvasProps {
  products: Product[];
  settings: FluidSettings;
  onProductSelect: (product: Product) => void;
}

export function LiquidCanvas({ products, settings, onProductSelect }: LiquidCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const fluidPhysicsRef = useRef<FluidPhysics | undefined>(undefined);
  const [isInitialized, setIsInitialized] = useState(false);
  const lastTimeRef = useRef<number>(0);

  // Initialize fluid physics system
  useEffect(() => {
    if (!canvasRef.current) return;
    
    fluidPhysicsRef.current = new FluidPhysics(settings);
    
    // Create particles from products
    const particles: ProductParticle[] = products.map((product) => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      return FluidPhysics.createParticleFromProduct(product, x, y);
    });
    
    fluidPhysicsRef.current.setParticles(particles);
    setIsInitialized(true);
  }, [products, settings]);

  // Handle mouse events
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!fluidPhysicsRef.current) return;
    fluidPhysicsRef.current.updateMousePosition(event.clientX, event.clientY);
  }, []);

  const handleMouseDown = useCallback((event: MouseEvent) => {
    if (!fluidPhysicsRef.current) return;
    fluidPhysicsRef.current.updateMousePosition(event.clientX, event.clientY, true);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!fluidPhysicsRef.current) return;
    fluidPhysicsRef.current.updateMousePosition(0, 0, false);
  }, []);

  const handleClick = useCallback((event: MouseEvent) => {
    if (!fluidPhysicsRef.current) return;
    
    const particles = fluidPhysicsRef.current.getParticles();
    const clickX = event.clientX;
    const clickY = event.clientY;
    
    // Find clicked particle
    const clickedParticle = particles.find(particle => {
      const dx = clickX - particle.x;
      const dy = clickY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < particle.size;
    });
    
    if (clickedParticle) {
      onProductSelect(clickedParticle.product);
    }
  }, [onProductSelect]);

  // Set up mouse event listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('click', handleClick);
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp, handleClick]);

  // Resize canvas to match window
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isInitialized || !canvasRef.current || !fluidPhysicsRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Update physics
      fluidPhysicsRef.current!.update(deltaTime);

      // Clear canvas with deep sea gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a192f');
      gradient.addColorStop(1, '#172a45');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      const particles = fluidPhysicsRef.current!.getParticles();
      particles.forEach(particle => drawParticle(ctx, particle));

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInitialized]);

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: ProductParticle) => {
    // Draw sub-particles (particle swarm effect)
    particle.particles.forEach(subParticle => {
      ctx.save();
      ctx.globalAlpha = subParticle.opacity;
      
      // Color based on product type (simplified categorization)
      const productName = particle.product.name.toLowerCase();
      let color = '#64ffda'; // Default blue
      if (productName.includes('服飾') || productName.includes('圍巾') || productName.includes('錢包')) {
        color = '#f76707'; // Orange for fashion
      } else if (productName.includes('馬克杯') || productName.includes('陶瓷')) {
        color = '#22b573'; // Green for home goods
      }
      
      // Glow effect
      const gradient = ctx.createRadialGradient(
        subParticle.x, subParticle.y, 0,
        subParticle.x, subParticle.y, subParticle.size * 2
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(subParticle.x, subParticle.y, subParticle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw main particle (product representation)
    if (particle.isHovered) {
      ctx.save();
      ctx.globalAlpha = 0.8;
      
      // Product image placeholder (blurred circle)
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Product name
      ctx.fillStyle = '#ccd6f6';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(particle.product.name, particle.x, particle.y - particle.size - 10);
      
      // Price
      const price = `$${(particle.product.price_in_cents / 100).toFixed(2)}`;
      ctx.fillStyle = '#00fff0';
      ctx.font = '12px Roboto Mono, monospace';
      ctx.fillText(price, particle.x, particle.y + particle.size + 20);
      
      ctx.restore();
    }

    // Pulsing glow effect
    if (particle.isHovered || Math.sin(particle.pulsePhase) > 0.5) {
      ctx.save();
      ctx.globalAlpha = 0.3 + Math.sin(particle.pulsePhase) * 0.2;
      
      const pulseGradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 1.5
      );
      pulseGradient.addColorStop(0, '#00fff0');
      pulseGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = pulseGradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-auto cursor-none"
      style={{ background: 'linear-gradient(to bottom, #0a192f, #172a45)' }}
    />
  );
}