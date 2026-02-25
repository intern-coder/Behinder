import React from 'react';
import { ShippingOrder } from '../types';
import { useLanguage } from '../LanguageContext';

interface ShippingTableProps {
  orders: ShippingOrder[];
}

export const ShippingTable: React.FC<ShippingTableProps> = ({ orders }) => {
  const { t } = useLanguage();

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
              <th className="px-6 py-3">{t('winner')}</th>
              <th className="px-6 py-3">{t('prize_name')}</th>
              <th className="px-6 py-3">{t('status')}</th>
              <th className="px-6 py-3 text-right">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-primary/5 transition-colors">
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
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${
                    order.status === 'pending' 
                      ? 'bg-amber-100 text-amber-700' 
                      : order.status === 'reviewing'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {t(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="bg-primary text-white text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-primary/90 transition-opacity">
                    {t('details')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
