import React from 'react';
import { LayoutDashboard, MessageSquare, Truck, Settings, User, LogOut } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'overview', label: t('nav_overview'), icon: LayoutDashboard },
    { id: 'feedback', label: t('nav_feedback'), icon: MessageSquare },
    { id: 'shipping', label: t('nav_shipping'), icon: Truck },
    { id: 'settings', label: t('nav_settings'), icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-primary/10 bg-white hidden lg:flex flex-col sticky top-0 h-screen">
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
          <div className="size-6 bg-white rounded-full flex items-center justify-center">
            <div className="size-3 bg-primary rounded-full" />
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight">{t('app_title')}</h1>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{t('sys_admin')}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              activeTab === item.id
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-slate-600 hover:bg-primary/5'
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-primary/10">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/5 mb-2">
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <User size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{t('admin_user')}</p>
            <p className="text-xs text-slate-500 truncate">{t('sys_admin')}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-primary transition-colors text-sm"
        >
          <LogOut size={16} />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
};
