import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useGetOrderByIdQuery, 
  useCancelOrderItemMutation, 
  useRequestItemReturnMutation 
} from '../app/features/api/orderApiSlice';
import { 
  ChevronLeft, ShieldCheck, Clock, Copy, Check, Info, Hash, RotateCcw, XCircle 
} from 'lucide-react';
import ReturnModal from './profile-comp/ReturnModal';

const ItemDetailView = () => {
  const { orderId, productId } = useParams();
  const navigate = useNavigate();
  const [isReturnModalOpen, setReturnModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  const { data, isLoading, isFetching, refetch } = useGetOrderByIdQuery(orderId);
  const [cancelItem, { isLoading: isCancelling }] = useCancelOrderItemMutation();
  const [requestReturn] = useRequestItemReturnMutation();

  // Fresh data on tab focus
  useEffect(() => {
    const onFocus = () => refetch();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refetch]);

  const order = data?.order;
  const item = order?.items.find(i => (i.product?._id || i.product) === productId);

  // Safe Date Parsing for OTP
  const expiryDate = item?.itemOtpExpires ? new Date(item.itemOtpExpires) : null;
  const isOtpActive = item?.itemOTP && expiryDate && expiryDate > new Date();

  // Live Countdown Logic
  useEffect(() => {
    if (!isOtpActive || !expiryDate) return;
    const calculateTime = () => {
      const now = new Date().getTime();
      const distance = expiryDate.getTime() - now;
      if (distance <= 0) {
        setTimeLeft("Expired");
        refetch();
        return;
      }
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${mins}m ${secs}s`);
    };
    const timer = setInterval(calculateTime, 1000);
    calculateTime(); 
    return () => clearInterval(timer);
  }, [item?.itemOtpExpires, isOtpActive, refetch]);

  const copyToClipboard = () => {
    if (item?.itemOTP) {
      navigator.clipboard.writeText(item.itemOTP);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this item?")) {
      try {
        await cancelItem({ orderId, productId }).unwrap();
      } catch (err) { alert(err.data?.message || "Could not cancel item"); }
    }
  };

  const handleReturnSubmit = async (modalData) => {
    try {
      await requestReturn({ orderId, productId, ...modalData }).unwrap();
      setReturnModalOpen(false);
    } catch (err) { alert(err.data?.message || "Could not process return"); }
  };

  if (isLoading || !item) return <div className="min-h-screen flex items-center justify-center text-zinc-400 italic font-light">Loading product journey...</div>;

  return (
    <div className="pt-32 pb-20 max-w-5xl mx-auto px-6 font-['Poppins']">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-black mb-12 group transition-colors">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
        <span className="text-[10px] font-black uppercase tracking-widest">Back to History</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 space-y-12">
          
          {/* OTP CARD - ONLY SHOWN IF ACTIVE */}
          {isOtpActive && (
            <div className={`bg-zinc-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden transition-all ${isFetching ? 'opacity-60 scale-[0.98]' : 'opacity-100'}`}>
              <ShieldCheck className="absolute right-[-20px] bottom-[-20px] text-white/5 w-40 h-40 rotate-12" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                        {item.status === 'Shipped' ? 'Delivery Verification' : 'Return Pickup OTP'}
                      </p>
                    </div>
                    <h2 className="text-5xl font-mono tracking-[0.3em] font-bold">{item.itemOTP}</h2>
                  </div>
                  <button onClick={copyToClipboard} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all">
                    {copied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} className="text-zinc-400" />}
                  </button>
                </div>
                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                   <Clock size={14} className="text-zinc-500" />
                   <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">Expires in: {timeLeft}</span>
                </div>
              </div>
            </div>
          )}

          {/* TIMELINE */}
          <div className="relative pl-8 border-l border-zinc-100 space-y-12 ml-4">
              <div className="relative">
                 <div className="absolute -left-[37px] w-3 h-3 rounded-full bg-zinc-900 ring-4 ring-white" />
                 <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Order Placed</p>
                 <p className="text-sm font-bold text-zinc-900">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '---'}</p>
              </div>
              <div className="relative">
                 <div className={`absolute -left-[37px] w-3 h-3 rounded-full ring-4 ring-white ${item.status === 'Delivered' ? 'bg-emerald-500' : 'bg-zinc-200 animate-pulse'}`} />
                 <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Status: {item.status.replace('_', ' ')}</p>
                 <p className="text-sm font-bold text-zinc-900">{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '---'}</p>
              </div>
          </div>

          {/* DYNAMIC ACTION BUTTONS - Restored and locked if OTP is active */}
          {!isOtpActive ? (
            <div className="flex flex-wrap gap-4 pt-10 border-t border-zinc-100">
              {['Processing', 'Shipped'].includes(item.status) && (
                <button 
                  disabled={isCancelling} 
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-red-100 text-red-600 text-[10px] font-black uppercase hover:bg-red-50 transition-all"
                >
                  {isCancelling ? <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /> : <XCircle size={16} />}
                  Cancel Item
                </button>
              )}

              {item.status === 'Delivered' && (
                <button 
                  onClick={() => setReturnModalOpen(true)}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-zinc-900 text-white text-[10px] font-black uppercase hover:bg-black transition-all shadow-lg shadow-zinc-200"
                >
                  <RotateCcw size={16} /> Request Return
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 p-5 bg-zinc-50 rounded-[32px] border border-zinc-100 text-zinc-400 shadow-inner">
               <Info size={16} />
               <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed">
                 Actions are locked until the current {item.status === 'Shipped' ? 'delivery' : 'return pickup'} is verified.
               </p>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-5">
           <div className="bg-white border border-zinc-100 rounded-[48px] p-8 sticky top-32">
              <div className="aspect-[4/5] rounded-[32px] overflow-hidden bg-zinc-50 mb-8 border border-zinc-100/50">
                 <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" />
              </div>
              <h3 className="text-2xl font-medium text-zinc-900 mb-2 leading-tight">{item.name}</h3>
              <div className="flex justify-between items-center mb-10">
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Quantity: {item.quantity}</span>
                 <div className="px-3 py-1 bg-zinc-50 border border-zinc-100 rounded-full font-mono text-[10px] font-bold text-zinc-400">
                    <Hash size={10} className="inline mr-1" />{order._id.slice(-8).toUpperCase()}
                 </div>
              </div>
              <div className="flex justify-between items-end">
                 <div>
                    <p className="text-[8px] font-black uppercase text-zinc-400 mb-1 tracking-widest">Total Paid</p>
                    <p className="text-4xl font-light text-zinc-900 tracking-tighter">₹{(item.price * item.quantity).toLocaleString()}</p>
                 </div>
                 <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 pb-1 border-b-2 border-zinc-900">
                    {order.paymentInfo?.method || 'Prepaid'}
                 </div>
              </div>
           </div>
        </div>
      </div>

      <ReturnModal 
        isOpen={isReturnModalOpen} 
        item={item} 
        onClose={() => setReturnModalOpen(false)} 
        onSubmit={handleReturnSubmit} 
      />
    </div>
  );
};

export default ItemDetailView;