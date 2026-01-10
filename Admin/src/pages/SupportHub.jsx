import React, { useState } from 'react';
import { useGetAllTicketsQuery } from '../features/api/adminTicketApi.js';

import { ChevronLeft } from 'lucide-react';
import TicketTable from './components/support/TicketTable';
import ChatConsole from './components/support/ChatConsole';

const SupportHub = () => {
  const { data: listData, isLoading } = useGetAllTicketsQuery();
  const [selectedId, setSelectedId] = useState(null);

  const tickets = listData?.tickets || [];
  const activeTicket = tickets.find(t => t._id === selectedId);

  if (isLoading) return (
    <div className="h-[60vh] flex items-center justify-center text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
      Loading Archives...
    </div>
  );

  return (
    <div className="p-8 max-w-400 mx-auto">
      {selectedId ? (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <button 
            onClick={() => setSelectedId(null)}
            className="flex items-center text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black mb-6 transition-all"
          >
            <ChevronLeft size={14} className="mr-1" /> Return to Dossiers
          </button>
          <ChatConsole ticket={activeTicket} />
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-10">
            <h2 className="text-2xl font-light text-zinc-900 uppercase tracking-[0.2em]">Concierge Management</h2>
            <p className="text-[10px] text-zinc-400 font-bold uppercase mt-2 tracking-widest">Global Support Inquiries</p>
          </div>
          <TicketTable tickets={tickets} onOpenChat={setSelectedId} />
        </div>
      )}
    </div>
  );
};

export default SupportHub;