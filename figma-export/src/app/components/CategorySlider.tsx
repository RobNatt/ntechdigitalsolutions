import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DataCard } from './DataCard';

const categoryData = {
  analytics: [
    { title: 'Neural Activity', value: '87.3%', trend: '+12.4%', status: 'optimal' },
    { title: 'Quantum Flux', value: '2.4 PHz', trend: '+0.8 PHz', status: 'stable' },
    { title: 'Data Streams', value: '1,847', trend: '+234', status: 'optimal' },
    { title: 'Processing Power', value: '94.2 QF', trend: '+5.1 QF', status: 'optimal' },
    { title: 'Memory Banks', value: '76.8%', trend: '-2.1%', status: 'warning' },
    { title: 'Neural Links', value: '12,456', trend: '+890', status: 'optimal' },
  ],
  neural: [
    { title: 'Synaptic Load', value: '68.9%', trend: '+3.2%', status: 'optimal' },
    { title: 'Pattern Match', value: '99.1%', trend: '+0.5%', status: 'optimal' },
    { title: 'Learning Rate', value: '0.847', trend: '+0.023', status: 'stable' },
    { title: 'Network Depth', value: '2,048', trend: '+128', status: 'optimal' },
    { title: 'Activation Fn', value: 'ReLU-X', trend: 'Upgraded', status: 'optimal' },
    { title: 'Convergence', value: '94.7%', trend: '+1.2%', status: 'optimal' },
  ],
  energy: [
    { title: 'Core Temperature', value: '312.4 K', trend: '+2.1 K', status: 'stable' },
    { title: 'Power Draw', value: '847 GW', trend: '-23 GW', status: 'optimal' },
    { title: 'Efficiency', value: '99.8%', trend: '+0.2%', status: 'optimal' },
    { title: 'Fusion Output', value: '4.2 TW', trend: '+0.3 TW', status: 'optimal' },
    { title: 'Grid Balance', value: '100%', trend: 'Stable', status: 'optimal' },
    { title: 'Reserve Power', value: '2.8 TW', trend: '+0.1 TW', status: 'optimal' },
  ],
  targets: [
    { title: 'Mission Success', value: '94.2%', trend: '+2.8%', status: 'optimal' },
    { title: 'Target Lock', value: '100%', trend: 'Active', status: 'optimal' },
    { title: 'Objectives Met', value: '847/900', trend: '+47', status: 'optimal' },
    { title: 'Precision Rate', value: '99.6%', trend: '+0.4%', status: 'optimal' },
    { title: 'Response Time', value: '0.03 ms', trend: '-0.01 ms', status: 'optimal' },
    { title: 'Completion ETA', value: '14.2 hrs', trend: '-1.3 hrs', status: 'optimal' },
  ],
  performance: [
    { title: 'CPU Utilization', value: '78.4%', trend: '+5.2%', status: 'optimal' },
    { title: 'Throughput', value: '8.4 Pb/s', trend: '+1.2 Pb/s', status: 'optimal' },
    { title: 'Latency', value: '0.08 ms', trend: '-0.02 ms', status: 'optimal' },
    { title: 'Uptime', value: '99.99%', trend: 'Stable', status: 'optimal' },
    { title: 'Cache Hit Rate', value: '96.7%', trend: '+1.1%', status: 'optimal' },
    { title: 'Queue Depth', value: '234', trend: '-45', status: 'optimal' },
  ],
};

interface CategorySliderProps {
  category: string;
}

export function CategorySlider({ category }: CategorySliderProps) {
  const data = categoryData[category as keyof typeof categoryData] || categoryData.analytics;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-700 uppercase tracking-wider">
            {category}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse" />
            <span className="text-gray-600 text-sm">Live Data Stream</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-3 gap-4 h-full">
          {data.map((item, index) => (
            <DataCard
              key={`${category}-${index}`}
              title={item.title}
              value={item.value}
              trend={item.trend}
              status={item.status}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}