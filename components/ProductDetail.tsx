'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetail({ product, onClose }: ProductDetailProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ x: number; y: number; opacity: number }>>([]);

  useEffect(() => {
    if (product) {
      setIsVisible(true);
      // Create explosion effect particles
      const newParticles = Array.from({ length: 30 }, () => ({
        x: Math.random() * 400,
        y: Math.random() * 400,
        opacity: 1
      }));
      setParticles(newParticles);

      // Animate particles
      const interval = setInterval(() => {
        setParticles(prev => prev.map(p => ({
          ...p,
          opacity: Math.max(0, p.opacity - 0.05)
        })));
      }, 100);

      return () => clearInterval(interval);
    } else {
      setIsVisible(false);
    }
  }, [product]);

  if (!product) return null;

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        background: 'radial-gradient(circle at center, rgba(0,255,240,0.1) 0%, rgba(10,25,47,0.9) 70%)'
      }}
      onClick={onClose}
    >
      {/* Particle explosion effect */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              opacity: particle.opacity,
              filter: 'blur(1px)',
              animation: `float ${2 + Math.random() * 2}s ease-in-out infinite`
            }}
          />
        ))}
      </div>

      <Card 
        className={`relative max-w-2xl w-full bg-slate-900/80 backdrop-blur-xl border-cyan-500/30 transform transition-all duration-500 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* Close button */}
          <Button
            onClick={onClose}
            size="sm"
            className="absolute top-4 right-4 bg-red-600/20 hover:bg-red-600/40 text-red-300 border-red-500/30"
          >
            ✕
          </Button>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-4">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover rounded-lg opacity-80 hover:opacity-100 transition-opacity"
                />
                
                {/* Holographic overlay effect */}
                <div className="absolute inset-4 rounded-lg bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-pulse" />
              </div>
              
              {/* Floating particles around image */}
              <div className="absolute -inset-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animation: `pulse ${2 + Math.random()}s ease-in-out infinite`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-cyan-100 mb-2">
                  {product.name}
                </h2>
                <Badge className="bg-cyan-600/20 text-cyan-300 border-cyan-500/30">
                  深海精選
                </Badge>
              </div>

              <div className="text-4xl font-mono font-bold text-green-400">
                {formatPrice(product.price_in_cents)}
              </div>

              {/* Product description (placeholder) */}
              <div className="text-slate-300 space-y-3">
                <p>
                  探索深海中的珍貴發現。這件商品承載著海洋的神秘力量，
                  經過時光的淬煉，帶來獨特的質感與價值。
                </p>
                <p className="text-sm text-slate-400">
                  • 深海工藝製作<br />
                  • 限量發行<br />
                  • 生物發光認證<br />
                  • 可與其他商品形成共生關係
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-4">
                <Button 
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-3"
                  onClick={() => {
                    // Add swirl animation effect
                    alert('商品已被吸入購物車漩渦！');
                  }}
                >
                  <span className="mr-2">🌊</span>
                  吸入購物車
                </Button>
                
                <Button 
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 px-6"
                  onClick={() => {
                    // Add pressure wave effect
                    alert('緊急購買按鈕已啟動！');
                  }}
                >
                  ⚡ 立即購買
                </Button>
              </div>

              {/* Related products hint */}
              <div className="mt-8 p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg border border-purple-500/30">
                <div className="text-sm text-purple-300 mb-2">🐟 生態系統提示</div>
                <div className="text-xs text-purple-200">
                  購買此商品後，相關配件會自動游過來形成共生關係...
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 via-transparent to-blue-500/20 pointer-events-none animate-pulse" />
      </Card>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}