import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { useAdminReplyToTicketMutation, useResolveTicketMutation, useGetAdminTicketDetailsQuery } from "../../../features/api/adminTicketApi.js";
import socketService from "../../../services/socket.js";

const ChatConsole = ({ ticket }) => {
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const cleanId = ticket._id?.$oid || ticket._id?.toString() || ticket._id;

  const { data, refetch } = useGetAdminTicketDetailsQuery(cleanId, { skip: !cleanId });
  const [adminReply, { isLoading: isSending }] = useAdminReplyToTicketMutation();
  const [resolveTicket] = useResolveTicketMutation();

  const activeTicket = data?.ticket || ticket;

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!cleanId) return;

    const socket = socketService.connect();
    socketService.joinTicket(cleanId);

    socket.off("receive_message", handleRefresh);
    socket.on("receive_message", handleRefresh);

    return () => {
      socket.off("receive_message", handleRefresh);
    };
  }, [cleanId, handleRefresh]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeTicket.messages]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (selectedFiles.length + files.length > 5) return alert("Max 5 files");
    setSelectedFiles(prev => [...prev, ...files]);
  };

const handleSend = async (e) => {
    e.preventDefault();
    if ((!message.trim() && selectedFiles.length === 0) || isSending) return;

    const formData = new FormData();
    
    // 1. ALWAYS APPEND TEXT FIRST
    formData.append('content', message.trim());

    // 2. APPEND FILES SECOND
    if (selectedFiles.length > 0) {
      selectedFiles.forEach(file => {
        formData.append('attachments', file); 
      });
    }

    try {
      // Note: Ensure your adminReply mutation expects { id, formData }
     // Add this right before your adminReply call to see the real data
for (let [key, value] of formData.entries()) {
  console.log(`${key}:`, value);
}
      await adminReply({ id: cleanId,formData}).unwrap();
      setMessage('');
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Admin reply failed:", err);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-8 h-[calc(100vh-220px)]">
      <div className="col-span-2 flex flex-col bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div ref={scrollRef} className="flex-1 p-10 overflow-y-auto space-y-6 bg-[#fcfcfc]">
          {activeTicket.messages?.map((m, i) => {
            const isMe = m.senderRole === 'admin';
            return (
              <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-1 px-2">
                  {isMe ? 'Concierge (You)' : (activeTicket.user?.name || 'Customer')}
                </span>
                <div className={`max-w-[75%] p-5 rounded-[1.8rem] text-xs shadow-sm ${
                  isMe ? 'bg-zinc-900 text-white rounded-tr-none' : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none'
                }`}>
                  {m.content}
                  {m.attachments?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-zinc-200 space-y-2">
                      {m.attachments.map((file, idx) => (
                        <a key={idx} href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] hover:underline opacity-80">
                          <Paperclip size={12} /> Attachment {idx + 1}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSend} className="p-6 bg-white border-t border-zinc-50 flex flex-col gap-3">
          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-1 bg-zinc-100 px-3 py-1.5 rounded-full text-[10px] font-bold">
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <X size={14} className="cursor-pointer text-red-500" onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))} />
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-4">
            <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*,.pdf" />
            <button type="button" onClick={() => fileInputRef.current.click()} className="bg-zinc-100 p-4 rounded-2xl hover:bg-zinc-200 transition-colors">
              <Paperclip size={20} className="text-zinc-500" />
            </button>
            <input 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              className="flex-1 bg-zinc-50 rounded-2xl px-6 py-4 text-xs outline-none" 
              placeholder="Type your response..." 
            />
            <button type="submit" disabled={isSending} className="bg-black text-white px-8 rounded-2xl active:scale-95 disabled:opacity-50">
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>

      <div className="col-span-1 space-y-6">
        <div className="bg-white border border-zinc-100 rounded-[2.2rem] p-8 shadow-sm">
          <h3 className="text-[10px] font-black uppercase text-zinc-400 mb-4 tracking-widest">Ticket Details</h3>
          <p className="text-xs font-bold mb-6 leading-relaxed">{activeTicket.subject}</p>
          <div className="space-y-2 mb-8">
            <div className="flex justify-between text-[10px]"><span className="text-zinc-400">Status</span><span className="font-bold uppercase text-emerald-600">{activeTicket.status}</span></div>
            <div className="flex justify-between text-[10px]"><span className="text-zinc-400">Customer</span><span className="font-bold">{activeTicket.user?.name}</span></div>
          </div>
          <button onClick={() => resolveTicket(cleanId)} className="w-full bg-emerald-50 text-emerald-700 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
            Mark as Resolved
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatConsole;