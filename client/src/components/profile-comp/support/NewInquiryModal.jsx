import React, { useState } from 'react';
import { useGetMyOrdersQuery } from "../../../app/features/api/orderApiSlice.js"
import { useCreateTicketMutation } from "../../../app/features/api/userTicketApi.js"
import { X, Package, AlertCircle, Send } from 'lucide-react';

const NewInquiryModal = ({ isOpen, onClose, onCreated }) => {
  const { data: orderData } = useGetMyOrdersQuery();
  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();
  
  const [formData, setFormData] = useState({
    orderId: '',
    subject: '',
    message: ''
  });

  const orders = orderData?.orders || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createTicket({
        order: formData.orderId,
        subject: formData.subject,
        message: formData.message
      }).unwrap();
      
      // Pass the new ticket ID back to parent to open the chat
      onCreated(result.ticket._id); 
      onClose();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Failed to create inquiry. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest text-gray-900">New Dossier</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Lodge a formal service inquiry</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Order Selection Dropdown */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Relating to Order</label>
            <div className="relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select 
                required
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold appearance-none focus:ring-2 focus:ring-black/5 outline-none transition-all"
                value={formData.orderId}
                onChange={(e) => setFormData({...formData, orderId: e.target.value})}
              >
                <option value="">General Inquiry (No Order)</option>
                {orders.map(order => (
                  <option key={order._id} value={order._id}>
                    Order #{order._id.slice(-8).toUpperCase()} — ₹{order.totalAmount}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Subject / Issue</label>
            <input 
              required
              placeholder="e.g. Bezel alignment concern"
              className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-xs font-bold focus:ring-2 focus:ring-black/5 outline-none transition-all"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
            />
          </div>

          {/* Initial Message */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Detailed Description</label>
            <textarea 
              required
              rows="4"
              placeholder="Please describe your concern in detail..."
              className="w-full bg-gray-50 border-none rounded-3xl py-4 px-6 text-xs font-medium focus:ring-2 focus:ring-black/5 outline-none transition-all resize-none"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={isCreating}
            className="w-full bg-black text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all disabled:opacity-50"
          >
            {isCreating ? "Initializing..." : <><Send size={14} /> Open Inquiry</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewInquiryModal;