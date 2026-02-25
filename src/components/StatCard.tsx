import React from 'react';
import { Users, PartyPopper, Clock } from 'lucide-react';
import { StatData } from '../types';

const iconMap: Record<string, any> = {
  group: Users,
  celebration: PartyPopper,
  pending_actions: Clock,
};

export const StatCard: React.FC<StatData> = ({ label, value, change, trend, icon }) => {
  const Icon = iconMap[icon] || Users;
  
  return (
    <div className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <span className="p-2 bg-primary/10 text-primary rounded-lg">
          <Icon size={24} />
        </span>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-primary bg-primary/5'
        }`}>
          {change}
        </span>
      </div>
      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
      <h3 className="text-3xl font-bold mt-1">{value}</h3>
    </div>
  );
};
