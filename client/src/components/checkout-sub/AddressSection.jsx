import React, { useState } from 'react';
import { MapPin, ChevronDown, Home, Briefcase, Globe, Check, Plus } from 'lucide-react';

const AddressSection = ({ addresses, selectedId, onSelect, onManualMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeAddress = addresses?.find((a) => a._id === selectedId);

  const handleSelect = (addr) => {
    onSelect(addr);
    setIsOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 border-b border-gray-100 pb-4">
        <div className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold">1</div>
        <h2 className="text-lg font-light uppercase tracking-widest">Shipping Address</h2>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between p-5 bg-white border-2 transition-all rounded-2xl ${
            isOpen ? 'border-black shadow-xl ring-4 ring-black/5' : 'border-gray-100 hover:border-gray-200'
          }`}
        >
          <div className="flex items-center space-x-4 text-left overflow-hidden">
            <div className={`p-2 rounded-lg ${activeAddress ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-400'}`}>
              {activeAddress?.label === 'Home' ? <Home size={18} /> : 
               activeAddress?.label === 'Work' ? <Briefcase size={18} /> : <MapPin size={18} />}
            </div>
            <div className="truncate">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
                {activeAddress ? activeAddress.label : 'Select Address'}
              </p>
              <p className="text-sm font-bold text-[#222222] truncate">
                {activeAddress ? `${activeAddress.street}, ${activeAddress.city}-${activeAddress.postalCode}, ${activeAddress.state}` : 'Where should we send your order?'}
              </p>
            </div>
          </div>
          <ChevronDown className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={20} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-60" onClick={() => setIsOpen(false)} />
            <div className="absolute left-0 right-0 z-70 mt-3 bg-white border border-gray-100 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="max-h-70 overflow-y-auto">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    onClick={() => handleSelect(addr)}
                    className="flex items-center justify-between p-5 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-none"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${selectedId === addr._id ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {addr.label === 'Home' ? <Home size={16} /> : addr.label === 'Work' ? <Briefcase size={16} /> : <Globe size={16} />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-[10px] font-black uppercase tracking-widest">{addr.label}</p>
                          {addr.isDefault && <span className="bg-amber-100 text-amber-700 text-[7px] px-1.5 py-0.5 rounded font-black uppercase">Primary</span>}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1">{addr.street}, {addr.city}-{addr.postalCode}, {addr.state}</p>
                      </div>
                    </div>
                    {selectedId === addr._id && <Check size={16} className="text-amber-600" />}
                  </div>
                ))}
              </div>
              <button
                onClick={() => { onManualMode(); setIsOpen(false); }}
                className="w-full flex items-center justify-center space-x-2 p-5 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all"
              >
                <Plus size={14} />
                <span>Use a different address</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddressSection;