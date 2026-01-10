const OrderHeader = ({ order }) => {
  const isDelivered = order?.orderStatus === 'Delivered';
  
  return (
    <div className="flex justify-between items-end border-b border-slate-100 pb-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Order #{order?._id.slice(-6).toUpperCase()}
        </h2>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isDelivered ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
          Transaction Date: {new Date(order?.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
      </div>
      <div className={`px-8 py-3 rounded-2xl border font-black text-[10px] uppercase tracking-widest shadow-sm transition-colors ${
        isDelivered 
          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
          : 'bg-amber-50 text-amber-600 border-amber-100'
      }`}>
        Logistic Status: {order?.orderStatus}
      </div>
    </div>
  );
};

export default OrderHeader;