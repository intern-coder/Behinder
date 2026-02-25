import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Globe, Mail, Shield, Bell, Languages, Loader2 } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { Language } from '../i18n';
import { supabase } from '../lib/supabase';

export const SettingsView: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: '管理系统',
    admin_email: 'admin@beetroot.com',
    sys_announcement: '欢迎来到管理系统管理后台。请及时处理待发货订单。',
    maintenance_mode: 'false'
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase.from('settings').select('*');
        if (error) throw error;
        if (data) {
          const settingsMap = data.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
          setSettings(prev => ({ ...prev, ...settingsMap }));
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const upsertData = Object.entries(settings).map(([key, value]) => ({ key, value }));
      const { error } = await supabase.from('settings').upsert(upsertData, { onConflict: 'key' });
      if (error) throw error;
      alert('保存成功！');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-black tracking-tight">{t('settings_title')}</h2>
        <p className="text-slate-500">{t('settings_desc')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-xl border border-primary/10 shadow-sm space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-primary/5 pb-4">
              <Globe className="text-primary" size={20} />
              <h3 className="font-bold text-lg">{t('general_settings')}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">{t('sys_name')}</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={settings.site_name}
                  onChange={(e) => updateSetting('site_name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">{t('admin_email')}</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={settings.admin_email}
                  onChange={(e) => updateSetting('admin_email', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">{t('sys_announcement')}</label>
              <textarea
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                value={settings.sys_announcement}
                onChange={(e) => updateSetting('sys_announcement', e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-70"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                <span>{t('save_changes')}</span>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-xl border border-primary/10 shadow-sm space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-primary/5 pb-4">
              <Shield className="text-primary" size={20} />
              <h3 className="font-bold text-lg">{t('security_settings')}</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-bold text-sm">{t('maintenance_mode')}</p>
                  <p className="text-xs text-slate-500">{t('maintenance_desc')}</p>
                </div>
                <div
                  onClick={() => updateSetting('maintenance_mode', settings.maintenance_mode === 'true' ? 'false' : 'true')}
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${settings.maintenance_mode === 'true' ? 'bg-primary' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 size-4 bg-white rounded-full shadow-sm transition-all ${settings.maintenance_mode === 'true' ? 'left-7' : 'left-1'}`}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-3 border-b border-primary/5 pb-4">
              <Languages className="text-primary" size={20} />
              <h3 className="font-bold text-lg">{t('language')}</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <input
                  type="radio"
                  name="language"
                  checked={language === 'zh'}
                  onChange={() => setLanguage('zh')}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm text-slate-600 font-medium">{t('lang_zh')}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <input
                  type="radio"
                  name="language"
                  checked={language === 'en'}
                  onChange={() => setLanguage('en')}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm text-slate-600 font-medium">{t('lang_en')}</span>
              </label>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-3 border-b border-primary/5 pb-4">
              <Bell className="text-primary" size={20} />
              <h3 className="font-bold text-lg">{t('notification_config')}</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary" />
                <span className="text-sm text-slate-600">{t('notify_new_order')}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary" />
                <span className="text-sm text-slate-600">{t('notify_low_stock')}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                <span className="text-sm text-slate-600">{t('notify_update')}</span>
              </label>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
