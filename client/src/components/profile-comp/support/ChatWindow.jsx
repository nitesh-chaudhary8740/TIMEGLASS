import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, Send, Paperclip, X } from 'lucide-react';
import { useReplyToTicketMutation, useGetTicketConversationQuery } from "../../../app/features/api/userTicketApi.js";
import socketService from "../../../services/socket.js";

const ChatWindow = ({ ticket, onBack }) => {
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const cleanId = ticket._id?.$oid || ticket._id?.toString() || ticket._id;

  const { data, refetch } = useGetTicketConversationQuery(cleanId, { skip: !cleanId });
  const [sendReply, { isLoading: isSending }] = useReplyToTicketMutation();

  const activeTicket = data?.ticket || ticket;

  // Stable refresh function
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!cleanId) return;
    
    const socket = socketService.connect();
    socketService.joinTicket(cleanId);

    // Clean up before adding to prevent duplicate listeners
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
    if (selectedFiles.length + files.length > 5) return alert("Max 5 files allowed");
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if ((!message.trim() && selectedFiles.length === 0) || isSending) return;

    const formData = new FormData();
    formData.append('content', message.trim());
    selectedFiles.forEach(file => formData.append('attachments', file));

    try {
      await sendReply({ id: cleanId, formData }).unwrap();
      setMessage('');
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Reply failed:", err);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-white shadow-lg rounded-3xl overflow-hidden border border-gray-100">
      <div className="flex-none p-4 border-b border-gray-50"> 
        <button onClick={onBack} className="flex items-center text-[10px] font-black uppercase text-gray-400 mb-3 hover:text-black transition-colors">
          <ChevronLeft size={14} /> Back
        </button>
        <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
            <h3 className="text-sm font-bold truncate mr-2">{activeTicket.subject}</h3>
            <span className="text-[8px] font-black uppercase bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg">{activeTicket.status}</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-white">
        {activeTicket.messages?.map((m, i) => {
          const isMe = m.senderRole === 'user';
          return (
            <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <span className="text-[7px] font-black uppercase text-gray-400 mb-1 px-1">{isMe ? 'You' : 'Support'}</span>
              <div className={`max-w-[85%] p-4 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
                isMe ? 'bg-black text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'
              }`}>
                {m.content}
                {m.attachments?.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200/30 space-y-1">
                    {m.attachments.map((file, idx) => (
                      <a key={idx} href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[9px] underline opacity-80 hover:opacity-100">
                        <Paperclip size={10} /> Attachment {idx + 1}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-white border-t border-gray-50">
        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-[9px] font-bold">
                <span className="truncate max-w-[100px]">{file.name}</span>
                <X size={12} className="text-red-500 cursor-pointer" onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))} />
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleReply} className="relative flex items-center gap-2">
          <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*,.pdf" />
          <button type="button" onClick={() => fileInputRef.current.click()} className="flex-none h-11 w-11 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:text-black">
            <Paperclip size={18} />
          </button>
          <div className="relative flex-1">
            <input value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-gray-50 rounded-xl py-4 pl-5 pr-12 text-xs outline-none" placeholder="Write a reply..." />
            <button type="submit" disabled={isSending} className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 bg-black text-white rounded-lg flex items-center justify-center disabled:opacity-50">
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;