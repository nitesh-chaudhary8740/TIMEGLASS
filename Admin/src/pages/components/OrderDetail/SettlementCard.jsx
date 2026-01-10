import { CreditCard, Fingerprint } from 'lucide-react';

const SettlementCard = ({ order, transaction }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
    <h3 className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] mb-6 text-emerald-600">
      <CreditCard size={14}/> 03. Settlement
    </h3>
    <div className="space-y-4 text-sm font-medium">
      <div className="flex justify-between text-slate-400">
        <span>Retail Value</span>
        <span>₹{order?.itemsPrice.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-slate-400">
        <span>Logistics Fee</span>
        <span>{order?.shippingPrice === 0 ? 'FREE' : `₹${order?.shippingPrice}`}</span>
      </div>
      <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-slate-900">
        <span className="font-black text-[10px] uppercase text-slate-400">Total Paid</span>
        <span className="font-black text-2xl text-emerald-600">₹{order?.totalAmount.toLocaleString()}</span>
      </div>
      <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Auth Gateway ID</p>
          <Fingerprint size={12} className="text-slate-300" />
        </div>
        <p className="text-[10px] font-mono text-slate-500 break-all leading-relaxed">
          {transaction?.gatewayTransactionId || order?.paymentInfo?.id || 'SECURE_INTERNAL_LEDGER'}
        </p>
      </div>
    </div>
  </div>
);

export default SettlementCard;