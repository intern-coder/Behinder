import React, { useState, useMemo } from 'react';
import { ShippingOrder } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, Search, Filter, X, MapPin, Phone, User, Calendar, Hash, Building2, CheckCircle2, ChevronDown } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { supabase } from '../lib/supabase';

interface ShippingViewProps {
  orders: ShippingOrder[];
}

export const ShippingView: React.FC<ShippingViewProps> = ({ orders }) => {
  const { t } = useLanguage();
  const [selectedOrder, setSelectedOrder] = useState<ShippingOrder | null>(null);
  const [showShipModal, setShowShipModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('1');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPrize, setFilterPrize] = useState<string>('all');

  // Form state
  const [carrier, setCarrier] = useState('USPS');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipDate, setShipDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch =
        (order.order_no && order.order_no.toLowerCase().includes(searchQuery.toLowerCase())) ||
        String(order.id).includes(searchQuery) ||
        order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.prize.toLowerCase().includes(searchQuery.toLowerCase());

      const isRejected = !!order.rejection_reason;
      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'rejected' ? isRejected : (order.status === filterStatus && !isRejected));
      const matchesPrize = filterPrize === 'all' || order.prize === filterPrize;

      return matchesSearch && matchesStatus && matchesPrize;
    });
  }, [orders, searchQuery, filterStatus, filterPrize]);

  const uniquePrizes = useMemo(() => {
    return Array.from(new Set(orders.map(o => o.prize)));
  }, [orders]);

  const handleConfirmShip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'completed',
          carrier: carrier,
          tracking_no: trackingNumber,
          ship_date: shipDate,
          rejection_reason: null,
        })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setShowShipModal(false);
        setSelectedOrder(null);
      }, 2000);
    } catch (error: any) {
      console.error('Failed to update order status:', error);
      alert(error.message || '操作失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedOrder) return;

    let finalReason = '';
    if (rejectionReason === '1') finalReason = 'Multiple entries, invalid';
    else if (rejectionReason === '2') finalReason = 'Phone number mismatch with order';
    else finalReason = customReason || 'Other reason';

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('orders')
        .update({
          rejection_reason: finalReason
        })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      alert(t('reject_success'));
      setShowRejectModal(false);
      setSelectedOrder(null);
      setCustomReason('');
    } catch (error: any) {
      console.error('Failed to reject order:', error);
      alert(error.message || '操作失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('delete_confirm'))) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      alert(t('delete_success'));
    } catch (error: any) {
      console.error('Failed to delete order:', error);
      alert(error.message || '操作失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-black tracking-tight">{t('shipping_title')}</h2>
        <p className="text-slate-500">{t('shipping_desc')}</p>
      </div>

      <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-primary/10 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${showFilters
                  ? 'bg-primary text-white border-primary'
                  : 'text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
              >
                <Filter size={16} />
                <span>{t('filter')}</span>
                <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-primary/10 z-20 p-4 space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('status')}</label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
                      >
                        <option value="all">{t('view_all')}</option>
                        <option value="pending">{t('pending')}</option>
                        <option value="reviewing">{t('reviewing')}</option>
                        <option value="rejected">{t('rejected')}</option>
                        <option value="completed">{t('completed')}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('prize_name')}</label>
                      <select
                        value={filterPrize}
                        onChange={(e) => setFilterPrize(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
                      >
                        <option value="all">{t('view_all')}</option>
                        {uniquePrizes.map(prize => (
                          <option key={prize} value={prize}>{prize}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        setFilterStatus('all');
                        setFilterPrize('all');
                        setSearchQuery('');
                      }}
                      className="w-full py-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      {t('reset_filter')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
              <Truck size={16} />
              <span>{t('bulk_ship')}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">{t('order_id')}</th>
                <th className="px-6 py-4">{t('winner')}</th>
                <th className="px-6 py-4">{t('prize_name')}</th>
                <th className="px-6 py-4">{t('address')}</th>
                <th className="px-6 py-4">{t('status')}</th>
                <th className="px-6 py-4 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-primary/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-mono text-slate-500">{order.order_no || `#ORD-${String(order.id).padStart(4, '0')}`}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {order.initials}
                        </div>
                        <span className="font-semibold text-sm">{order.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{order.prize}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{order.location}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${order.rejection_reason
                        ? 'bg-red-100 text-red-700'
                        : order.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : order.status === 'reviewing'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                        {order.rejection_reason ? t('rejected') : t(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowRejectModal(true);
                          }}
                          className="p-1 px-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-amber-100 text-xs font-bold"
                        >
                          {t('reject')}
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-1 px-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100 text-xs font-bold"
                        >
                          {t('delete')}
                        </button>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-primary hover:underline text-sm font-bold ml-2"
                        >
                          {t('details')}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                    {t('no_orders_found')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && !showShipModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-primary/10 flex items-center justify-between bg-primary text-white">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <Truck size={24} />
                  {t('order_details')} {selectedOrder.order_no || `#ORD-${String(selectedOrder.id).padStart(4, '0')}`}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('winner')}</p>
                    <p className="font-bold text-lg text-slate-900">{selectedOrder.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('prize_name')}</p>
                    <p className="font-bold text-lg text-primary">{selectedOrder.prize}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-primary/5 pb-2">
                    <MapPin className="text-primary" size={20} />
                    <h4 className="font-bold text-slate-900">{t('shipping_info')}</h4>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex items-start gap-4">
                      <div className="size-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                        <User size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase">{t('full_name')}</p>
                        <p className="font-medium text-slate-900">{selectedOrder.full_name || t('not_provided')}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="size-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                        <MapPin size={20} />
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-400 uppercase">{t('address1')}</p>
                          <p className="font-medium text-slate-900">{selectedOrder.address1 || t('not_provided')}</p>
                        </div>
                        {selectedOrder.address2 && (
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase">{t('address2')}</p>
                            <p className="font-medium text-slate-900">{selectedOrder.address2}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase">{t('city')}</p>
                            <p className="font-medium text-slate-900">{selectedOrder.city || t('not_provided')}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase">{t('state')}</p>
                            <p className="font-medium text-slate-900">{selectedOrder.state || t('not_provided')}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase">{t('zip')}</p>
                            <p className="font-medium text-slate-900">{selectedOrder.zip || t('not_provided')}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="size-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                        <Phone size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase">{t('phone')}</p>
                        <p className="font-medium text-slate-900">{selectedOrder.phone || t('not_provided')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-primary/10 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {t('close')}
                </button>
                <button
                  onClick={() => setShowShipModal(true)}
                  className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  {t('confirm_ship')}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showShipModal && selectedOrder && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-primary/10 flex items-center justify-between bg-slate-900 text-white">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Truck size={20} />
                  {t('ship_form_title')}
                </h3>
                <button
                  onClick={() => setShowShipModal(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleConfirmShip} className="p-8 space-y-6">
                {isSuccess ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="size-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={40} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">{t('ship_success')}</h4>
                      <p className="text-slate-500 mt-1">{t('ship_success_desc')}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <Building2 size={16} className="text-primary" />
                          {t('carrier')}
                        </label>
                        <select
                          required
                          value={carrier}
                          onChange={(e) => setCarrier(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        >
                          <option value="USPS">USPS</option>
                          <option value="FedEx">FedEx</option>
                          <option value="UPS">UPS</option>
                          <option value="DHL">DHL</option>
                          <option value="Amazon Shipping">Amazon Shipping</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <Hash size={16} className="text-primary" />
                          {t('tracking_no')}
                        </label>
                        <input
                          required
                          type="text"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder={t('tracking_placeholder')}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <Calendar size={16} className="text-primary" />
                          {t('ship_date')}
                        </label>
                        <input
                          required
                          type="date"
                          value={shipDate}
                          onChange={(e) => setShipDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowShipModal(false)}
                        className="flex-1 px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        {t('cancel')}
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {t('submitting')}
                          </>
                        ) : (
                          t('submit_ship')
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">{t('reject_reason_title')}</h3>
              <button onClick={() => setShowRejectModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                {[1, 2, 3].map((num) => (
                  <label key={num} className="flex flex-col gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="reason"
                        value={String(num)}
                        checked={rejectionReason === String(num)}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="size-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium">{t(`reject_reason_${num}` as any)}</span>
                    </div>
                    {num === 3 && rejectionReason === '3' && (
                      <textarea
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder={t('reject_reason_placeholder')}
                        className="w-full mt-1 p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none min-h-[100px]"
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                disabled={isSubmitting}
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleReject}
                className="flex-[2] px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl transition-opacity flex items-center justify-center gap-2"
                disabled={isSubmitting || (rejectionReason === '3' && !customReason.trim())}
              >
                {isSubmitting ? t('submitting') : t('reject')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

