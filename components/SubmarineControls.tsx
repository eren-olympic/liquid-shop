'use client';

import { useState } from 'react';
import { FluidSettings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

interface SubmarineControlsProps {
  settings: FluidSettings;
  onSettingsChange: (settings: Partial<FluidSettings>) => void;
  onSearch: (query: string) => void;
}

export function SubmarineControls({ settings, onSettingsChange, onSearch }: SubmarineControlsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isControlsVisible, setIsControlsVisible] = useState(true);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      // Create ripple effect (simplified)
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Depth Control (Left) */}
      <Card className="fixed left-4 top-1/2 -translate-y-1/2 p-4 bg-black/20 backdrop-blur-md border-cyan-500/30">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-cyan-300 text-sm font-mono text-center">
            深度計<br />DEPTH
          </div>
          <div className="writing-mode-vertical-lr text-xs text-cyan-200 h-32 flex items-center">
            <Slider
              value={[settings.depth]}
              onValueChange={(value) => onSettingsChange({ depth: value[0] })}
              max={100}
              min={0}
              step={1}
              orientation="vertical"
              className="h-32"
            />
          </div>
          <div className="text-cyan-100 text-xs font-mono">
            {settings.depth}m
          </div>
        </div>
      </Card>

      {/* Temperature Control (Right) */}
      <Card className="fixed right-4 top-1/2 -translate-y-1/2 p-4 bg-black/20 backdrop-blur-md border-orange-500/30">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-orange-300 text-sm font-mono text-center">
            溫度計<br />TEMP
          </div>
          <div className="writing-mode-vertical-lr text-xs text-orange-200 h-32 flex items-center">
            <Slider
              value={[settings.temperature]}
              onValueChange={(value) => onSettingsChange({ temperature: value[0] })}
              max={100}
              min={0}
              step={1}
              orientation="vertical"
              className="h-32"
            />
          </div>
          <div className="text-orange-100 text-xs font-mono">
            {settings.temperature}°C
          </div>
        </div>
      </Card>

      {/* Compass (Top) */}
      <Card className="fixed top-4 left-1/2 -translate-x-1/2 p-4 bg-black/20 backdrop-blur-md border-green-500/30">
        <div className="flex items-center space-x-4">
          <div className="text-green-300 text-sm font-mono">
            羅盤 COMPASS
          </div>
          <div className="relative w-16 h-16">
            <div 
              className="absolute inset-0 border-2 border-green-400 rounded-full"
              style={{
                background: `conic-gradient(from ${settings.currentDirection}deg, transparent 340deg, #22c55e 360deg)`
              }}
            />
            <div 
              className="absolute top-1/2 left-1/2 w-1 h-6 bg-green-400 origin-bottom transform -translate-x-1/2 -translate-y-6"
              style={{ transform: `translate(-50%, -24px) rotate(${settings.currentDirection}deg)` }}
            />
          </div>
          <Slider
            value={[settings.currentDirection]}
            onValueChange={(value) => onSettingsChange({ currentDirection: value[0] })}
            max={360}
            min={0}
            step={1}
            className="w-32"
          />
          <div className="text-green-100 text-xs font-mono">
            {settings.currentDirection}°
          </div>
        </div>
      </Card>

      {/* Sonar Search (Bottom) */}
      <Card className="fixed bottom-4 left-1/2 -translate-x-1/2 p-4 bg-black/20 backdrop-blur-md border-blue-500/30">
        <div className="flex items-center space-x-4">
          <div className="text-blue-300 text-sm font-mono">
            聲納 SONAR
          </div>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜尋商品..."
              className="bg-black/30 border border-blue-400/50 rounded px-3 py-2 text-blue-100 placeholder-blue-300/50 focus:outline-none focus:border-blue-400"
            />
            {searchQuery && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 border border-blue-400 rounded animate-pulse" />
                <div className="absolute -inset-2 border border-blue-400/30 rounded-lg animate-ping" />
              </div>
            )}
          </div>
          <Button
            onClick={handleSearch}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            掃描
          </Button>
        </div>
      </Card>

      {/* Flow Speed Control (Hidden panel) */}
      {isControlsVisible && (
        <Card className="fixed bottom-20 right-4 p-4 bg-black/20 backdrop-blur-md border-purple-500/30">
          <div className="flex flex-col items-center space-y-2">
            <div className="text-purple-300 text-xs font-mono">
              洋流速度
            </div>
            <Slider
              value={[settings.flowSpeed]}
              onValueChange={(value) => onSettingsChange({ flowSpeed: value[0] })}
              max={100}
              min={0}
              step={1}
              className="w-24"
            />
            <div className="text-purple-100 text-xs">
              {settings.flowSpeed}
            </div>
          </div>
        </Card>
      )}

      {/* Toggle controls visibility */}
      <Button
        onClick={() => setIsControlsVisible(!isControlsVisible)}
        size="sm"
        className="fixed bottom-4 right-4 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
      >
        {isControlsVisible ? '隱藏' : '顯示'}控制
      </Button>
    </>
  );
}