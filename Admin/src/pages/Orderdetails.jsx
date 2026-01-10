import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrderDetailsQuery, useCancelOrderMutation } from '../features/api/adminOrderApi';
import { ArrowLeft, Ban, LayoutDashboard, ChevronRight } from 'lucide-react';

import OrderHeader from './components/OrderDetail/OrderHeader';
import DestinationCard from './components/OrderDetail/DestinationCard';
import BuyerCard from './components/OrderDetail/BuyerCard';
import SettlementCard from './components/OrderDetail/SettlementCard';
import HandoverDetails from './components/OrderDetail/HandoverDetails';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetOrderDetailsQuery(id);
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const order = data?.order;
  const transaction = data?.transaction;

  if (isLoading) return <div className="p-20 text-center font-black uppercase tracking-widest animate-pulse">Syncing Secure Ledger...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-6 pt-10 bg-slate-50/30">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Ledger
        </button>
        {order?.orderStatus === 'Processing' && (
          <button onClick={() => cancelOrder(id)} disabled={isCancelling} className="flex items-center gap-2 text-[10px] font-black uppercase text-red-500 hover:text-red-700 transition-colors">
            <Ban size={14} /> Void Entire Order
          </button>
        )}
      </div>

      <OrderHeader order={order} />

      {/* Main Grid: Set to items-stretch to align column heights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Shipping Manifest */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-8 pb-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <LayoutDashboard size={14} /> Shipping Manifest
              </h3>
            </div>

            {/* SCROLLABLE AREA: This container will fill the space and scroll if items exceed it */}
            <div className="flex-grow overflow-y-auto px-8 pb-8 custom-scrollbar max-h-[550px]">
              <div className="space-y-4">
                {order?.items?.map((item) => (
                  <div 
                    key={item._id}
                    onClick={() => navigate(`/order/${id}/item/${item.product?._id || item.product}`)}
                    className="group flex items-center justify-between p-4 bg-slate-50 rounded-3xl border border-transparent hover:border-slate-900 hover:bg-white transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={item.image} className="w-12 h-12 rounded-2xl object-cover" alt="" />
                        <div className="absolute -top-1 -right-1 bg-slate-900 text-white text-[8px] font-bold px-1.5 rounded-md border border-white">
                          x{item.quantity}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight line-clamp-1">{item.name}</h4>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${
                          item.status === 'Delivered' ? 'text-emerald-500' : 'text-amber-500'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <HandoverDetails order={order}/>
        </div>

        {/* Right Column: Cards */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <DestinationCard recipient={order?.recipient} address={order?.shippingAddress} />
          <BuyerCard user={order?.user} />
          
          {/* Subtle placeholder to help maintain visual balance if needed */}
          <div className="flex-grow hidden lg:block" /> 
        </div>
      </div>

      <SettlementCard order={order} transaction={transaction} />

      {/* Optional: Add this to your Global CSS for a cleaner scrollbar */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}} />
    </div>
  );
};

export default OrderDetails;