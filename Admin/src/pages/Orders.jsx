import { useGetOrdersQuery } from '../features/api/adminOrderApi.js';
import { Package, Calendar, ChevronRight, User, CreditCard } from 'lucide-react';
import { Link } from "react-router-dom";

const Orders = () => {
  const { data, isLoading } = useGetOrdersQuery();

  if (isLoading) return (
    <div className="p-20 text-center animate-pulse font-black uppercase tracking-[0.3em] text-slate-400 text-xs">
      Accessing Secure Ledger...
    </div>
  );

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-slate-50/30">
        <div>
          <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-800">Order Management</h3>
          <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Fulfillment Oversight</p>
        </div>
        <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-100 px-4 py-1.5 rounded-full">
          {data?.orders?.length} TOTAL ENTRIES
        </span>
      </div>

      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference & Date</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Recipient Details</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Manifest</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Financials</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data?.orders?.map((order) => (
            <tr key={order._id} className="hover:bg-slate-50/30 transition-colors group">
              
              {/* Reference & Date */}
              <td className="px-8 py-6">
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-black text-slate-900 uppercase">#{order._id.slice(-8)}</span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">
                    <Calendar size={10} /> 
                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </td>

              {/* Recipient Details */}
              <td className="px-8 py-6">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <User size={12} className="text-slate-300" /> {order.recipient.name}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {order.recipient.email}
                  </span>
                </div>
              </td>

              {/* Manifest (Item Count) */}
              <td className="px-8 py-6 text-center">
                <div className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                  <Package size={12} className="text-slate-500" />
                  <span className="text-[10px] font-black text-slate-700 uppercase">
                    {order.items.length} {order.items.length === 1 ? 'Unit' : 'Units'}
                  </span>
                </div>
              </td>

              {/* Financials */}
              <td className="px-8 py-6">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900">₹{order.totalAmount.toLocaleString()}</span>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                    <CreditCard size={10} /> {order.paymentInfo.method}
                  </div>
                </div>
              </td>

              {/* View Action */}
              <td className="px-8 py-6 text-right">
                <Link 
                  to={`/order/${order._id}`} 
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300 shadow-sm"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Open Ledger</span>
                  <ChevronRight size={16} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;