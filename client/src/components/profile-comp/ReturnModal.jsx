import React, { useState } from "react";
import { XCircle, AlertCircle } from "lucide-react";

 const ReturnModal = ({ isOpen, onClose, onSubmit, item }) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const reasons = [
    'Defective', 
    'Wrong Item', 
    'Size/Fit Issue', 
    'Changed Mind', 
    'Quality not as expected'
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Request Return</h4>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              {item?.name}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-900 transition-colors">
            <XCircle size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Reason Dropdown (Matches Enum) */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">
              Select Reason
            </label>
            <select 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-slate-900 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">Choose a reason...</option>
              {reasons.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Description Textarea */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">
              Additional Comments (Optional)
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more details to help us approve your request..."
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-[2rem] p-6 text-sm focus:bg-white focus:border-slate-900 transition-all h-32 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <button onClick={onClose} className="py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button 
            disabled={!reason}
            onClick={() => {
                if(!reason||!description) return alert("fill both fields")
                onSubmit({ reason, description} )
                setDescription("")
                setReason("")
              
            }}
            className={`py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${
              reason ? 'bg-slate-900 text-white hover:bg-black shadow-slate-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};
export default ReturnModal