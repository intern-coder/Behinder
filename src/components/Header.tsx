import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const Header: React.FC = () => {
  const { t } = useLanguage();

  return (
    <header className="h-16 border-b border-primary/10 bg-white/80 flex items-center justify-between px-8 sticky top-0 z-10 backdrop-blur-md">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            className="w-full bg-slate-100 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder={t('search_placeholder')}
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="size-10 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
          <Bell size={20} />
        </button>
        <button className="size-10 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
          <HelpCircle size={20} />
        </button>
      </div>
    </header>
  );
};
