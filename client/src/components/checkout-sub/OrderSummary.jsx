import { ShieldCheck, Truck, ArrowRight } from 'lucide-react';

const OrderSummary = ({ totalAmount, shippingFee, onCheckout, isProcessing }) => {
  const finalTotal = totalAmount + shippingFee;

  return (
    <div className="sticky top-32 bg-[#111111] text-white rounded-4xl p-8 space-y-8 shadow-2xl">
      <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Checkout Summary</h2>
      
      <div className="space-y-4 border-b border-white/10 pb-6">
        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
          <span>Subtotal</span>
          <span className="text-white">₹{totalAmount.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
          <span>Shipping</span>
          <span className={shippingFee === 0 ? "text-emerald-400" : "text-white"}>
            {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-baseline">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Payable</span>
        <h3 className="text-3xl font-light">₹{finalTotal.toLocaleString('en-IN')}</h3>
      </div>

      <button 
        onClick={onCheckout}
        disabled={isProcessing}
        className="w-full bg-white text-black py-5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center space-x-3 disabled:bg-gray-700"
      >
        <span>{isProcessing ? 'Connecting...' : 'Secure Payment'}</span>
        {!isProcessing && <ArrowRight size={16} />}
      </button>

      <div className="flex justify-around pt-2">
        <div className="flex flex-col items-center space-y-1">
          <ShieldCheck size={18} className="text-amber-500" />
          <span className="text-[7px] font-bold uppercase text-gray-500 tracking-tighter">Verified</span>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <Truck size={18} className="text-gray-500" />
          <span className="text-[7px] font-bold uppercase text-gray-500 tracking-tighter">Insured</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;