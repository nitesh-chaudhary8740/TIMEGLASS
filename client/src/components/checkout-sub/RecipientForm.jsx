import React from 'react';
import { User, Phone, Mail, AlertCircle } from 'lucide-react';

const RecipientForm = ({ data, onChange, validation }) => {
  // Destructure validation states (defaults to true so it looks clean on first load)
  const { name = true, phone = true, email = true } = validation || {};

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center space-x-4 border-b border-gray-100 pb-4">
        <div className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold">2</div>
        <h2 className="text-lg font-light uppercase tracking-widest">Recipient Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Name Field */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Recipient Name</label>
            {!name && data.name.length > 0 && <span className="text-[8px] text-amber-600 font-bold uppercase tracking-tighter">Letters only (2-50)</span>}
          </div>
          <div className="relative">
            <User size={14} className={`absolute left-4 top-4 transition-colors ${!name && data.name.length > 0 ? 'text-amber-500' : 'text-gray-400'}`} />
            <input 
              type="text" placeholder="Full Name" 
              className={`w-full border-2 bg-gray-50 p-4 pl-12 rounded-xl text-sm outline-none transition-all ${
                !name && data.name.length > 0 
                ? 'border-amber-200 bg-amber-50/30 ring-2 ring-amber-500/5' 
                : 'border-transparent focus:ring-2 ring-black/5 focus:bg-white'
              }`}
              value={data.name} onChange={(e) => onChange('name', e.target.value)}
            />
          </div>
        </div>

        {/* Phone Field */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Recipient Phone</label>
            {!phone && data.phone.length > 0 && <span className="text-[8px] text-amber-600 font-bold uppercase tracking-tighter">Invalid 10-digit number</span>}
          </div>
          <div className="relative">
            <Phone size={14} className={`absolute left-4 top-4 transition-colors ${!phone && data.phone.length > 0 ? 'text-amber-500' : 'text-gray-400'}`} />
            <input 
              type="tel" placeholder="Mobile Number" 
              className={`w-full border-2 bg-gray-50 p-4 pl-12 rounded-xl text-sm outline-none transition-all ${
                !phone && data.phone.length > 0 
                ? 'border-amber-200 bg-amber-50/30 ring-2 ring-amber-500/5' 
                : 'border-transparent focus:ring-2 ring-black/5 focus:bg-white'
              }`}
              value={data.phone} onChange={(e) => onChange('phone', e.target.value)}
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-1 md:col-span-2">
          <div className="flex justify-between items-center">
            <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Email for Invoice & Updates</label>
            {!email && data.email.length > 0 && <span className="text-[8px] text-amber-600 font-bold uppercase tracking-tighter">Enter a valid email address</span>}
          </div>
          <div className="relative">
            <Mail size={14} className={`absolute left-4 top-4 transition-colors ${!email && data.email.length > 0 ? 'text-amber-500' : 'text-gray-400'}`} />
            <input 
              type="email" placeholder="email@example.com" 
              className={`w-full border-2 bg-gray-50 p-4 pl-12 rounded-xl text-sm outline-none transition-all ${
                !email && data.email.length > 0 
                ? 'border-amber-200 bg-amber-50/30 ring-2 ring-amber-500/5' 
                : 'border-transparent focus:ring-2 ring-black/5 focus:bg-white'
              }`}
              value={data.email} onChange={(e) => onChange('email', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Conditional Warning Box */}
      {(!name || !phone || !email) && (data.name || data.phone || data.email) && (
        <div className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl animate-in zoom-in-95">
          <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-[10px] text-amber-700 leading-relaxed">
            <span className="font-bold uppercase block mb-1">Check your details:</span>
            Ensure name contains only letters, phone is exactly 10 digits starting with 6-9, and email is correctly formatted.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecipientForm;