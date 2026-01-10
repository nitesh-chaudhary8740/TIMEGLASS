import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMyTicketsQuery, useGetTicketConversationQuery, useReplyToTicketMutation } from "../../app/features/api/userTicketApi.js";
import { Plus } from 'lucide-react';
import NewInquiryModal from './support/NewInquiryModal.jsx';
import TicketList from './support/TicketList.jsx';
import ChatWindow from './support/ChatWindow.jsx';


const SupportTickets = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { data: listData, isLoading: listLoading } = useGetMyTicketsQuery();
  const { data: chatData } = useGetTicketConversationQuery(selectedId, { skip: !selectedId });

  const tickets = listData?.tickets || [];

  if (listLoading) return <div className="py-20 text-center animate-pulse text-gray-400 uppercase text-[10px] tracking-widest font-bold">Consulting Archives...</div>;

  return (
    <div className="h-full">
      {selectedId && chatData ? (
        <ChatWindow 
          ticket={chatData.ticket} 
          onBack={() => setSelectedId(null)} 
          onNavigateOrder={(orderId) => navigate(`/order-success/${orderId}`)}
        />
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-light text-[#222222] uppercase tracking-widest">Concierge Support</h3>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
            >
              <Plus size={14} /> New Inquiry
            </button>
          </div>

          <TicketList tickets={tickets} onSelect={setSelectedId} />
        </div>
      )}

      <NewInquiryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreated={(id) => { setSelectedId(id); setIsModalOpen(false); }}
      />
    </div>
  );
};

export default SupportTickets;