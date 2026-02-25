import React from 'react';
import { Leaf, Droplets, Pill, Gift } from 'lucide-react';
import { ProductStat } from '../types';

const iconMap: Record<string, any> = {
  eco: Leaf,
  water_drop: Droplets,
  pill: Pill,
  card_giftcard: Gift,
};

export const ProductCard: React.FC<ProductStat> = ({ name, rewarded, progress, icon }) => {
  const Icon = iconMap[icon] || Leaf;

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-primary/5 group shadow-sm">
      <div className="h-32 bg-primary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="text-primary opacity-50 group-hover:scale-110 transition-transform" size={48} />
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-sm mb-1">{name}</h4>
        <p className="text-xs text-slate-500 mb-3">{rewarded.toLocaleString()} units rewarded</p>
        <div className="w-full bg-slate-100 rounded-full h-1.5">
          <div 
            className="bg-primary h-1.5 rounded-full transition-all duration-1000" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
