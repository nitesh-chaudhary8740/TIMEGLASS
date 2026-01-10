import React, { useState } from 'react';
import { Truck, CheckCircle, Send, ShieldCheck, XCircle, Clock } from 'lucide-react';
import { 
  useUpdateItemStatusMutation, 
  useSendDeliveryOtpMutation, 
  useVerifyDeliveryOtpMutation,
  useRollbackDeliveryMutation 
} from '../../../features/api/adminOrderApi';

const OrderItem = ({ item, orderId }) => {
  const [isHandoverActive, setIsHandoverActive] = useState(false);
  const [otpValue, setOtpValue] = useState('');

  const [updateStatus, { isLoading: isDispatching }] = useUpdateItemStatusMutation();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendDeliveryOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyDeliveryOtpMutation();
  const [rollbackDelivery] = useRollbackDeliveryMutation();

  const pId = item.product?.$oid || (typeof item.product === 'string' ? item.product : item.product?._id);

  const handleInitiate = async () => {
    try {
      // Passing productId so backend targets this specific item's OTP
      await sendOtp({ id: orderId, productId: pId }).unwrap();
      setIsHandoverActive(true);
    } catch (err) { alert("Failed to send security code"); }
  };

  const handleVerify = async () => {
    if (otpValue.length !== 6) return alert("Security code must be 6 digits");
    try {
      await verifyOtp({ id: orderId, otp: otpValue, productId: pId }).unwrap();
      setIsHandoverActive(false);
      setOtpValue('');
    } catch (err) { alert(err.data?.message || "Verification Failed"); }
  };

  return (
    <div className="flex flex-col bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300">
      
      {/* Upper Content: Details Section */}
      <div className="flex items-center gap-5 p-5">
        <div className="relative group">
          <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
            <img src={item.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={item.name} />
          </div>
          {item.status === 'Delivered' && (
            <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-sm">
              <CheckCircle size={12} strokeWidth={3} />
            </div>
          )}
        </div>

        <div className="grow">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full border ${
              item.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
              item.status === 'Shipped' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400'
            }`}>
              {item.status}
            </span>
          </div>
          <h4 className="font-bold text-slate-800 text-sm leading-tight line-clamp-1">{item.name}</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
            Price: ₹{item.price.toLocaleString()} • Qty: {item.quantity}
          </p>
        </div>
      </div>

      {/* Lower Content: Action Zone (Full Width) */}
      <div className="bg-slate-50/50 border-t border-slate-100 p-4">
        
        {/* PHASE 1: DISPATCH */}
        {item.status === 'Processing' && (
          <button 
            disabled={isDispatching}
            onClick={() => updateStatus({ orderId, productId: pId, status: 'Shipped' })}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Truck size={14} /> Dispatch from Warehouse
          </button>
        )}

        {/* PHASE 2: INITIATE DELIVERY */}
        {item.status === 'Shipped' && !isHandoverActive && (
          <button 
            disabled={isSendingOtp}
            onClick={handleInitiate}
            className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-200 hover:bg-amber-600 active:scale-[0.98] transition-all"
          >
            {isSendingOtp ? <Clock size={14} className="animate-spin" /> : <Send size={14} />}
            Initiate Secure Handover
          </button>
        )}

        {/* PHASE 3: OTP VERIFICATION CONSOLE */}
        {isHandoverActive && (
          <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-300">
             <div className="flex items-center gap-2">
                <div className="relative flex-grow">
                   <input 
                    type="text" 
                    maxLength={6}
                    placeholder="ENTER 6-DIGIT OTP"
                    value={otpValue}
                    className="w-full bg-white border-2 border-slate-200 rounded-2xl py-3 px-4 text-center text-sm font-black tracking-[0.5em] text-slate-900 focus:border-slate-900 focus:ring-0 placeholder:text-slate-300 placeholder:tracking-normal"
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                    <ShieldCheck size={18} />
                  </div>
                </div>
             </div>
             
             <div className="flex gap-2">
                <button 
                  disabled={isVerifying}
                  onClick={handleVerify}
                  className="flex-grow flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                >
                  {isVerifying ? <Clock size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                  Confirm Delivery
                </button>
                <button 
                  onClick={() => {
                    rollbackDelivery({id: orderId, productId: pId});
                    setIsHandoverActive(false);
                  }}
                  className="px-4 py-3 bg-white border-2 border-slate-200 text-slate-400 rounded-xl hover:text-red-500 hover:border-red-100 transition-all"
                >
                  <XCircle size={18} />
                </button>
             </div>
          </div>
        )}

        {/* PHASE 4: DELIVERED STATUS */}
        {item.status === 'Delivered' && (
          <div className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <CheckCircle size={14} /> 
            <span className="text-[10px] font-black uppercase tracking-widest">Handover Complete</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderItem;