import React from 'react';
import { Tag, XCircle, RotateCcw, Info } from 'lucide-react';

const UserOrderItem = ({ item, onCancel, onReturnInitiate, onNavigate }) => {
  const isReturnAvailable = () => {
    if (item.status !== 'Delivered' || !item.deliveredAt) return false;
    const deliveryDate = new Date(item.deliveredAt).getTime();
    const returnDays = item.product?.returnDays || 7;
    const expiryDate = deliveryDate + (returnDays * 24 * 60 * 60 * 1000);
    return Date.now() < expiryDate;
  };

  const returnLogic = isReturnAvailable();

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-2 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
      <div className="flex flex-col md:flex-row md:items-center gap-6 p-4">
        
        <div 
          onClick={() => onNavigate(item.orderId)}
          className="relative h-24 w-24 bg-slate-50 rounded-[2rem] overflow-hidden flex-shrink-0 border border-slate-100 cursor-pointer"
        >
          <img src={item.image} alt="" className="w-full h-full object-cover" />
        </div>

        <div className="flex-grow space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${
              item.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
              item.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {item.status}
            </span>
          </div>
          <h4 className="font-bold text-slate-800 text-base">{item.name}</h4>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            ₹{item.price.toLocaleString()} • Qty: {item.quantity}
          </p>
        </div>

        <div className="flex flex-col gap-2 min-w-[160px]">
          {['Processing', 'Shipped'].includes(item.status) && (
            <button 
              onClick={() => onCancel(item.orderId, item.product?._id || item.product)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all"
            >
              <XCircle size={14} /> Cancel Item
            </button>
          )}

          {item.status === 'Delivered' && returnLogic && (
            <button 
              onClick={() => onReturnInitiate(item)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200"
            >
              <RotateCcw size={14} /> Request Return
            </button>
          )}

          {item.status === 'Delivered' && !returnLogic && (
            <div className="flex items-center justify-center gap-1.5 py-3 px-4 bg-slate-50 rounded-2xl text-slate-400 text-[9px] font-bold uppercase">
              <Info size={12} /> Return window closed
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default UserOrderItem