import { useGetTransactionsQuery } from '../features/api/adminOrderApi.js';
import { CreditCard, ExternalLink, Copy, CheckCircle2, Clock, XCircle } from 'lucide-react';
import {Link} from "react-router-dom"
const Payments = () => {
  const { data, isLoading, } = useGetTransactionsQuery();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 size={14} className="text-emerald-500" />;
      case 'Pending': return <Clock size={14} className="text-amber-500" />;
      case 'Failed': return <XCircle size={14} className="text-red-500" />;
      default: return null;
    }
  };

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    // You could add a toast notification here
  };

  if (isLoading) return <div className="p-10 text-center font-black uppercase tracking-widest text-slate-400 animate-pulse">Scanning Ledger...</div>;

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-slate-50/30">
        <div>
          <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-800">Financial Ledger</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Gateway Transaction Logs</p>
        </div>
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
          <CreditCard className="text-slate-400" size={20} />
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction / User</th>
            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gateway ID</th>
            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data?.transactions?.map((txn) => (
            <tr key={txn._id} className="hover:bg-slate-50/30 transition-colors group">
              <td className="px-8 py-6">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800">{txn.user?.name || 'Guest'}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{txn.user?.email}</span>
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center space-x-2 group">
                  <code className="text-[11px] bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono">
                    {txn.gatewayTransactionId}
                  </code>
                  <button 
                    onClick={() => copyToClipboard(txn.gatewayTransactionId)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded transition-all"
                  >
                    <Copy size={12} className="text-slate-400" />
                  </button>
                </div>
              </td>
              <td className="px-8 py-6">
                <span className="text-sm font-black text-slate-900">₹{txn.amount.toLocaleString()}</span>
              </td>
              <td className="px-8 py-6">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                  txn.paymentStatus === 'Completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                  txn.paymentStatus === 'Pending' ? 'bg-amber-50 border-amber-100 text-amber-600' : 
                  'bg-red-50 border-red-100 text-red-600'
                }`}>
                  {getStatusIcon(txn.paymentStatus)}
                  {txn.paymentStatus}
                </div>
              </td>
              <td className="px-8 py-6 text-[11px] font-medium text-slate-500">
                {new Date(txn.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </td>
              <td className="px-8 py-6">
  <Link to={`/order/${txn.order?._id}`} className="hover:text-amber-600 transition-colors">
    <span className="text-sm font-bold text-slate-800">{txn.user?.name}</span>
    <p className="text-[9px] font-black text-slate-400 uppercase">View Order Detail</p>
  </Link>
</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {data?.transactions?.length === 0 && (
        <div className="p-20 text-center">
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">No transactions recorded in the vault.</p>
        </div>
      )}
    </div>
  );
};

export default Payments;