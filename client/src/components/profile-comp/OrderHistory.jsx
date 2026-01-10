import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../app/features/api/orderApiSlice.js";
import { 
  SortAsc, SortDesc, ChevronRight, 
  Package, Search, Hash
} from "lucide-react";

const OrderHistory = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetMyOrdersQuery();
  const [activeTab, setActiveTab] = useState("All");
  const [isNewestFirst, setIsNewestFirst] = useState(true);

  const allItems = useMemo(() => {
    if (!data?.orders) return [];
    return data.orders.flatMap(order => 
      order.items.map(item => ({
        ...item,
        orderId: order._id,
        purchaseDate: order.createdAt,
        statusDate: item.updatedAt || order.updatedAt,
      }))
    );
  }, [data]);

  const counts = useMemo(() => {
    return {
      All: allItems.length,
      Shipped: allItems.filter(i => i.status === "Shipped").length,
      Delivered: allItems.filter(i => i.status === "Delivered").length,
      Return_Requested: allItems.filter(i => i.status === "Return_Requested").length,
      Returned: allItems.filter(i => i.status === "Returned").length,
      Cancelled: allItems.filter(i => i.status === "Cancelled").length,
    };
  }, [allItems]);

  const filteredItems = useMemo(() => {
    let items = [...allItems];
    if (activeTab !== "All") items = items.filter(item => item.status === activeTab);
    return items.sort((a, b) => {
      const dateA = new Date(a.purchaseDate);
      const dateB = new Date(b.purchaseDate);
      return isNewestFirst ? dateB - dateA : dateA - dateB;
    });
  }, [allItems, activeTab, isNewestFirst]);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Delivered': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Shipped': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'Cancelled': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'Returned': return 'text-zinc-600 bg-zinc-100 border-zinc-200';
      case 'Return_Requested': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-zinc-600 bg-zinc-50 border-zinc-100';
    }
  };

  if (isLoading) return <div className="py-20 flex items-center justify-center italic text-zinc-400">Loading History...</div>;

  return (
    <div className="w-full"> {/* Removed max-width and large pt-32 because Outlet handles it */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-light text-zinc-900 mb-1">Order History</h1>
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Package size={10}/> {counts.All} Items Found
          </p>
        </div>
        <button 
          onClick={() => setIsNewestFirst(!isNewestFirst)} 
          className="flex items-center gap-2.5 bg-white border border-zinc-200 px-5 py-3 rounded-xl hover:border-zinc-900 transition-all shadow-sm active:scale-95"
        >
          {isNewestFirst ? <SortDesc size={14}/> : <SortAsc size={14}/>}
          <span className="text-[9px] font-black uppercase tracking-widest">{isNewestFirst ? "Newest First" : "Oldest First"}</span>
        </button>
      </div>

      {/* TABS - Optimized for Outlet Width */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar border-b border-zinc-50">
        {["All", "Shipped", "Delivered", "Return_Requested", "Returned", "Cancelled"].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            className={`flex items-center gap-2 px-5 py-3 rounded-full text-[9px] font-black uppercase transition-all border whitespace-nowrap ${
              activeTab === tab 
              ? "bg-zinc-900 text-white border-zinc-900 shadow-lg shadow-zinc-200" 
              : "bg-zinc-50 text-zinc-400 border-zinc-100 hover:border-zinc-300"
            }`}
          >
            {tab.replace('_', ' ')}
            <span className={`px-1.5 py-0.5 rounded-full text-[8px] ${
              activeTab === tab ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-500"
            }`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-4"> {/* Reduced gap between cards */}
        {filteredItems.map((item, idx) => (
          <div 
            key={`${item.orderId}-${idx}`}
            onClick={() => navigate(`/account/orders/${item.orderId}/item/${item.product?._id || item.product}`)}
            className="group bg-white border border-zinc-100 rounded-[24px] overflow-hidden hover:shadow-xl hover:border-zinc-300 transition-all duration-500 cursor-pointer"
          >
            {/* COMPACT HEADER */}
            <div className="bg-zinc-50/50 px-6 py-4 border-b border-zinc-100 flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[6px] font-black text-zinc-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                    <Hash size={7}/> Ref
                  </span>
                  <span className="text-[10px] font-mono font-bold text-zinc-900 bg-white px-1.5 py-0.5 rounded border border-zinc-200 shadow-xs">
                    {item.orderId.slice(-8).toUpperCase()}
                  </span>
                </div>

                <div className="w-px h-6 bg-zinc-200" />

                <div className="flex flex-col">
                  <span className="text-[6px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Date</span>
                  <span className="text-[10px] font-bold text-zinc-900">{new Date(item.purchaseDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                </div>

                <div className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-full border ${getStatusStyles(item.status)}`}>
                   {item.status.replace('_', ' ')}
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center border border-zinc-200 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                 <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* COMPACT ITEM CONTENT */}
            <div className="p-5 flex items-center gap-6">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-16 h-16 rounded-xl object-cover bg-zinc-50 border border-zinc-100 group-hover:scale-105 transition-transform duration-500" 
              />
              
              <div className="flex-grow min-w-0">
                <h4 className="text-base font-medium text-zinc-900 mb-0.5 truncate">{item.name}</h4>
                <div className="flex gap-3 items-center">
                  <p className="text-[9px] text-zinc-400 uppercase font-black tracking-widest">Qty: {item.quantity}</p>
                  <div className="w-0.5 h-0.5 rounded-full bg-zinc-200" />
                  <p className="text-[9px] text-zinc-400 uppercase font-black tracking-widest">₹{item.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-[7px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Total</p>
                <p className="text-xl font-light text-zinc-900 tracking-tight">₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center justify-center bg-zinc-50/50 rounded-[32px] border border-dashed border-zinc-200">
           <Search size={32} className="text-zinc-200 mb-3" />
           <p className="text-zinc-400 text-xs font-medium italic">No items found in {activeTab.replace('_', ' ')}</p>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;