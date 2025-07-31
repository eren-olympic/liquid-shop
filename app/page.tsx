'use client';

import { useState, useCallback } from 'react';
import { LiquidCanvas } from '@/components/LiquidCanvas';
import { SubmarineControls } from '@/components/SubmarineControls';
import { ProductDetail } from '@/components/ProductDetail';
import { useProducts } from '@/hooks/useProducts';
import { FluidSettings, Product } from '@/lib/types';

export default function Home() {
  const { products, loading, error } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [fluidSettings, setFluidSettings] = useState<FluidSettings>({
    depth: 50,
    temperature: 15,
    currentDirection: 0,
    particleCount: 200,
    flowSpeed: 30
  });

  const handleSettingsChange = useCallback((newSettings: Partial<FluidSettings>) => {
    setFluidSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleProductClose = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handleSearch = useCallback((query: string) => {
    // Filter products based on search query
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    
    // TODO: Implement search highlighting and focus on matching products
    // eslint-disable-next-line no-console
    console.log('Searching for:', query, 'Found:', filteredProducts.length, 'products');
  }, [products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-cyan-400 text-xl mb-4">🌊 正在潛入深海...</div>
          <div className="text-slate-400 text-sm">Loading liquid ecosystem...</div>
          
          {/* Animated loading particles */}
          <div className="mt-8 flex justify-center space-x-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center text-red-400">
          <div className="text-xl mb-4">⚠️ 深海連接失敗</div>
          <div className="text-sm">{error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Main Liquid Canvas */}
      <LiquidCanvas
        products={products}
        settings={fluidSettings}
        onProductSelect={handleProductSelect}
      />

      {/* Submarine Control Interface */}
      <SubmarineControls
        settings={fluidSettings}
        onSettingsChange={handleSettingsChange}
        onSearch={handleSearch}
      />

      {/* Product Detail Modal */}
      <ProductDetail
        product={selectedProduct}
        onClose={handleProductClose}
      />

      {/* Welcome overlay (fades out after initial dive) */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-transparent pointer-events-none opacity-20 transition-opacity duration-[3000ms]">
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-cyan-300 text-sm font-mono">
            歡迎來到液態商店 - 探索數位海洋生態系統
          </div>
          <div className="text-slate-400 text-xs mt-2">
            移動滑鼠產生洋流 • 點擊選擇商品 • 長按產生引力場
          </div>
        </div>
      </div>

      {/* Accessibility: Hidden screen reader content */}
      <div className="sr-only">
        <h1>液態商店 - 革命性的購物體驗</h1>
        <p>
          這是一個創新的電子商務界面，商品以粒子形式在流體環境中移動。
          您可以通過滑鼠互動來探索商品，點擊選擇感興趣的物品。
        </p>
        <div>
          商品列表：
          {products.map(product => (
            <button
              key={product.id}
              onClick={() => handleProductSelect(product)}
              className="block"
            >
              {product.name} - ${(product.price_in_cents / 100).toFixed(2)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
