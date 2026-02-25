import React from 'react';
import { Star } from 'lucide-react';
import { Feedback } from '../types';
import { useLanguage } from '../LanguageContext';

interface FeedbackSectionProps {
  feedbacks: Feedback[];
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({ feedbacks }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-xl border border-primary/10 flex flex-col shadow-sm">
      <div className="px-6 py-4 border-b border-primary/10 flex items-center justify-between">
        <h3 className="font-bold text-lg">{t('feedback_title')}</h3>
        <div className="flex items-center gap-1 text-amber-500">
          <Star size={14} fill="currentColor" />
          <span className="text-sm font-bold text-slate-900">4.8</span>
        </div>
      </div>
      <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[400px]">
        {feedbacks.map((f) => (
          <div key={f.id} className="space-y-2 border-b border-primary/5 pb-4 last:border-0 last:pb-0">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm">{f.user}</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={12} 
                    fill={i < f.rating ? "currentColor" : "none"} 
                    className={i < f.rating ? "" : "text-slate-200"}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed italic">“{f.comment}”</p>
          </div>
        ))}
      </div>
      <div className="p-4 bg-slate-50 border-t border-primary/10 text-center">
        <button className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest">
          {t('sentiment_analysis')}
        </button>
      </div>
    </div>
  );
};
