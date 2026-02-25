import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext';

interface LoginViewProps {
  onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        onLogin();
      } else {
        setError(t('login_error'));
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light">
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[480px] w-full bg-white shadow-2xl rounded-2xl overflow-hidden border border-primary/10"
        >
          <div className="p-8 pb-0">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <div className="size-8 bg-primary rounded-full flex items-center justify-center">
                  <div className="size-4 bg-white rounded-full flex items-center justify-center">
                    <div className="size-2 bg-primary rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mb-8">
              <h1 className="text-slate-900 tracking-tight text-3xl font-bold leading-tight">{t('login_title')}</h1>
              <p className="text-slate-600 text-base font-normal mt-2">{t('login_desc')}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-4">
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-slate-800 text-sm font-semibold leading-normal pb-2 px-1">{t('admin_account')}</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex w-full rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-slate-200 bg-white focus:border-primary h-12 placeholder:text-slate-400 pl-11 pr-4 text-base font-normal transition-all"
                    placeholder={t('username_placeholder')}
                    type="text"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-slate-800 text-sm font-semibold leading-normal pb-2 px-1">{t('password')}</label>
                <div className="relative flex w-full items-stretch">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex w-full rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-slate-200 bg-white focus:border-primary h-12 placeholder:text-slate-400 pl-11 pr-12 text-base font-normal transition-all"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 px-1">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4" type="checkbox" />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{t('remember_me')}</span>
              </label>
              <a className="text-sm font-medium text-primary hover:underline" href="#">{t('forgot_password')}</a>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-primary text-sm font-medium mt-4 text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              disabled={isLoading}
              className="w-full mt-8 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-70"
            >
              {isLoading ? t('logging_in') : t('login')}
            </button>
          </form>
          <div className="h-2 w-full bg-gradient-to-r from-primary via-primary/80 to-primary"></div>
        </motion.div>
      </div>

      <footer className="py-6 px-4">
        <div className="max-w-[960px] mx-auto text-center">
          <p className="text-slate-500 text-sm">© 2024 {t('app_title')}。保留所有权利。</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a className="text-xs text-slate-400 hover:text-primary transition-colors" href="#">{t('privacy_policy')}</a>
            <a className="text-xs text-slate-400 hover:text-primary transition-colors" href="#">{t('terms_of_service')}</a>
            <a className="text-xs text-slate-400 hover:text-primary transition-colors" href="#">{t('help_center')}</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
