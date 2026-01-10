// src/pages/Chat.jsx
import { MessageSquare, AlertTriangle } from 'lucide-react';

const Chat = () => {
  return (
    <div className="bg-white h-150 rounded-2xl border shadow-sm flex overflow-hidden">
      <div className="w-1/3 border-r bg-gray-50 p-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Active Tickets</h3>
        <div className="p-3 bg-white border border-amber-200 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-1">
            <span className="font-bold text-sm">Ticket #1024</span>
            <AlertTriangle size={14} className="text-amber-500" />
          </div>
          <p className="text-xs text-gray-500">Subject: Horizon X Glass Fogging...</p>
        </div>
      </div>
      <div className="w-2/3 flex flex-col items-center justify-center text-gray-400">
        <MessageSquare size={48} strokeWidth={1} className="mb-4" />
        <p className="text-sm">Select a conversation to start chatting</p>
      </div>
    </div>
  );
};

export default Chat;