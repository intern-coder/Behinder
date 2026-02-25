import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { StatCard } from './StatCard';
import { ShippingTable } from './ShippingTable';
import { FeedbackSection } from './FeedbackSection';
import { ProductCard } from './ProductCard';
import { FeedbackView } from './FeedbackView';
import { ShippingView } from './ShippingView';
import { SettingsView } from './SettingsView';
import { StatData, ShippingOrder, Feedback, ProductStat } from '../types';
import { useLanguage } from '../LanguageContext';

import { supabase } from '../lib/supabase';

export const DashboardView: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<StatData[]>([]);
  const [orders, setOrders] = useState<ShippingOrder[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [products, setProducts] = useState<ProductStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: statsData },
          { data: ordersData },
          { data: feedbacksData },
          { data: productsData }
        ] = await Promise.all([
          supabase.from('stats').select('*').order('id', { ascending: true }),
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
          supabase.from('feedbacks').select('*').order('created_at', { ascending: false }),
          supabase.from('products').select('*').order('id', { ascending: true }),
        ]);

        setStats(statsData || []);
        setOrders(ordersData || []);
        setFeedbacks(feedbacksData || []);
        setProducts(productsData || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // 开启实时监听：当抽奖页面产生新订单，或订单状态被修改时，后台自动更新
    const ordersChannel = supabase
      .channel('orders-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        setOrders(prev => [payload.new as ShippingOrder, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
        setOrders(prev => prev.map(order => order.id === payload.new.id ? { ...order, ...payload.new } : order));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'orders' }, (payload) => {
        setOrders(prev => prev.filter(order => order.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'feedback':
        return <FeedbackView feedbacks={feedbacks} />;
      case 'shipping':
        return <ShippingView orders={orders} />;
      case 'settings':
        return <SettingsView />;
      case 'overview':
      default:
        return (
          <div className="space-y-8">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-black tracking-tight">{t('overview_title')}</h2>
              <p className="text-slate-500">{t('overview_desc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <StatCard {...stat} />
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <ShippingTable orders={orders.slice(0, 3)} />
              </div>
              <div>
                <FeedbackSection feedbacks={feedbacks.slice(0, 3)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <ProductCard {...product} />
                </motion.div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-background-light">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <div className="p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
