import React from 'react';
import { MessageCircle, Clock, ExternalLink } from 'lucide-react';

const TicketTable = ({ tickets, onOpenChat }) => {
  return (
    <div className="bg-white border border-zinc-100 rounded-[2rem] overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-zinc-50/50 border-b border-zinc-100">
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Reference</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Client</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Subject</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Last Update</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {tickets.map((ticket) => (
            <tr key={ticket._id} className="hover:bg-zinc-50/30 transition-colors group">
              <td className="px-8 py-6">
                <span className="text-[11px] font-mono font-bold text-zinc-400">
                  #{ticket._id.slice(-6).toUpperCase()}
                </span>
              </td>
              <td className="px-8 py-6">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-zinc-800">{ticket.user?.name}</span>
                  <span className="text-[10px] text-zinc-400 font-medium">{ticket.user?.email}</span>
                </div>
              </td>
              <td className="px-8 py-6">
                <span className="text-xs text-zinc-600 font-medium">{ticket.subject}</span>
              </td>
              <td className="px-8 py-6">
                <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-tighter ${
                  ticket.status === 'Open' ? 'bg-amber-100 text-amber-700' : 
                  ticket.status === 'Resolved' ? 'bg-zinc-100 text-zinc-400' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {ticket.status}
                </span>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold">
                  <Clock size={12} />
                  {new Date(ticket.updatedAt).toLocaleDateString()}
                </div>
              </td>
              <td className="px-8 py-6 text-right">
                <button 
                  onClick={() => onOpenChat(ticket._id)}
                  className="inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-md active:scale-95"
                >
                  <MessageCircle size={14} /> Open Chat
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;