import React, { useState } from 'react';
import { Star, MessageSquare, X, Phone, Calendar, User } from 'lucide-react';
import { Feedback } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext';

interface FeedbackViewProps {
  feedbacks: Feedback[];
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({ feedbacks }) => {
  const { t } = useLanguage();
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-black tracking-tight">{t('feedback_title')}</h2>
        <p className="text-slate-500">{t('feedback_desc')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {feedbacks.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedFeedback(f)}
            className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm space-y-4 cursor-pointer hover:border-primary/30 hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{f.user}</p>
                  <div className="flex text-amber-400 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < f.rating ? "currentColor" : "none"} 
                        className={i < f.rating ? "" : "text-slate-200"}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-xs text-slate-400">{f.date || '2024-02-24'}</span>
            </div>
            <p className="text-slate-600 leading-relaxed italic line-clamp-2">“{f.comment}”</p>
            <div className="pt-2 flex justify-end">
              <span className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">{t('details')} →</span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedFeedback && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-primary/10 flex items-center justify-between bg-primary text-white">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <MessageSquare size={24} />
                  {t('feedback_details')}
                </h3>
                <button 
                  onClick={() => setSelectedFeedback(null)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('winner')}</p>
                    <p className="font-bold text-xl text-slate-900">{selectedFeedback.user}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('rating')}</p>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          fill={i < selectedFeedback.rating ? "currentColor" : "none"} 
                          className={i < selectedFeedback.rating ? "" : "text-slate-200"}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('phone')}</p>
                    <div className="flex items-center gap-2 text-slate-900 font-medium">
                      <Phone size={14} className="text-primary" />
                      {selectedFeedback.phone || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('ship_date')}</p>
                  <div className="flex items-center gap-2 text-slate-900 font-medium">
                    <Calendar size={14} className="text-primary" />
                    {selectedFeedback.date || '2024-02-24'}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('comment')}</p>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-slate-700 leading-relaxed italic">“{selectedFeedback.comment}”</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-primary/10 flex justify-end">
                <button 
                  onClick={() => setSelectedFeedback(null)}
                  className="px-8 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  {t('close')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
