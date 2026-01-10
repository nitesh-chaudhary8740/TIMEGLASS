import React from 'react';
import { MessageSquare, ShieldQuestion, ChevronRight, Clock } from 'lucide-react';

const TicketList = ({ tickets, onSelect }) => {
  if (tickets.length === 0) {
    return (
      <div className="py-20 text-center space-y-4 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
        <ShieldQuestion size={40} className="mx-auto text-gray-300" strokeWidth={1} />
        <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">No active support dossiers found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tickets.map((ticket) => (
        <div 
          key={ticket._id}
          onClick={() => onSelect(ticket._id)}
          className="group bg-white border border-gray-100 p-6 rounded-4xl flex items-center justify-between hover:border-black hover:shadow-2xl hover:shadow-gray-200/50 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-5">
            <div className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all duration-500 shadow-inner">
              <MessageSquare size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 tracking-tight group-hover:text-black">{ticket.subject}</h4>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-[9px] font-black uppercase tracking-widest ${ticket.status === 'Open' ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {ticket.status}
                </span>
                <span className="text-gray-200 text-[10px]">|</span>
                <span className="text-[9px] text-gray-400 flex items-center gap-1 uppercase font-bold tracking-tighter">
                  <Clock size={10} /> Updated {new Date(ticket.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
        </div>
      ))}
    </div>
  );
};

export default TicketList;