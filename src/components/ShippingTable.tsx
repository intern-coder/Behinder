import React, { useState } from 'react';
import { ShippingOrder } from '../types';
import { useLanguage } from '../LanguageContext';
import { supabase } from '../lib/supabase';
import { X, Trash2, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

interface ShippingTableProps {
  orders: ShippingOrder[];
  onUpdate?: () => void;
}

export const ShippingTable: React.FC<ShippingTableProps> = ({ orders, onUpdate }) => {
  const { t } = useLanguage();
  const [selectedOrder, setSelectedOrder] = useState<ShippingOrder | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('1'); // '1', '2', '3'
  const [customReason, setCustomReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('delete_confirm'))) return;

    setLoading(true);
    const { error } = await supabase.from('orders').delete().eq('id', id);
    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert(t('delete_success'));
      if (onUpdate) onUpdate();
    }
  };

  const handleReject = async () => {
    if (!selectedOrder) return;

    let finalReason = '';
    if (rejectionReason === '1') finalReason = 'Multiple entries, invalid';
    else if (rejectionReason === '2') finalReason = 'Phone number mismatch with order';
    else finalReason = customReason || 'Other reason';

    setLoading(true);
    const { error } = await supabase.from('orders')
      .update({
        status: 'rejected',
        rejection_reason: finalReason
      })
      .eq('id', selectedOrder.id);
    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert(t('reject_success'));
      setShowRejectModal(false);
      setSelectedOrder(null);
      setCustomReason('');
      if (onUpdate) onUpdate();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-primary/10 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-primary/10 flex items-center justify-between">
        <h3 className="font-bold text-lg">{t('shipping_title')}</h3>
        <button className="text-sm text-primary font-semibold hover:underline">{t('view_all')}</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-3">{t('order_id')}</th>
              <th className="px-6 py-3">{t('winner')}</th>
              <th className="px-6 py-3">{t('prize_name')}</th>
              <th className="px-6 py-3">{t('status')}</th>
              <th className="px-6 py-3 text-right">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4 text-xs font-mono text-slate-500">
                  {order.order_no || `#${String(order.id).padStart(4, '0')}`}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {order.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{order.name}</p>
                      <p className="text-xs text-slate-500">{order.location}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium">{order.prize}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${order.status === 'pending'
                    ? 'bg-amber-100 text-amber-700'
                    : order.status === 'reviewing'
                      ? 'bg-blue-100 text-blue-700'
                      : order.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                    {t(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowRejectModal(true);
                      }}
                      className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-amber-100"
                      title={t('reject')}
                    >
                      <ShieldAlert size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                      title={t('delete')}
                    >
                      <Trash2 size={16} />
                    </button>
                    <button className="bg-primary text-white text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-primary/90 transition-opacity">
                      {t('details')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">{t('reject_reason_title')}</h3>
              <button onClick={() => setShowRejectModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="radio"
                    name="reason"
                    value="1"
                    checked={rejectionReason === '1'}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="size-4 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">{t('reject_reason_1')}</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="radio"
                    name="reason"
                    value="2"
                    checked={rejectionReason === '2'}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="size-4 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">{t('reject_reason_2')}</span>
                </label>
                <label className="flex items-center flex-col gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 w-full">
                    <input
                      type="radio"
                      name="reason"
                      value="3"
                      checked={rejectionReason === '3'}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="size-4 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium">{t('reject_reason_3')}</span>
                  </div>
                  {rejectionReason === '3' && (
                    <textarea
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder={t('reject_reason_placeholder')}
                      className="w-full mt-2 p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none min-h-[100px]"
                    />
                  )}
                </label>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 rounded-b-2xl flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                disabled={loading}
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleReject}
                className="flex-[2] px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl transition-opacity flex items-center justify-center gap-2"
                disabled={loading || (rejectionReason === '3' && !customReason.trim())}
              >
                {loading ? t('submitting') : t('reject')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
