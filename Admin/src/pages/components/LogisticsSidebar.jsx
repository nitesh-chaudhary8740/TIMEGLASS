import { Tag, ShieldCheck, Clock } from 'lucide-react';

const LogisticsSidebar = ({ formData, setFormData }) => {
  const blockInvalidChar = (e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();
  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl space-y-10 relative overflow-hidden">
      <div className="space-y-4">
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Collection Tier</label>
        <select value={formData.tier} onChange={(e) => updateField('tier', e.target.value)} className="w-full p-5 bg-slate-800 border-none rounded-2xl font-black text-xs">
          <option value="Standard">Standard</option>
          <option value="Premium">Premium</option>
          <option value="Limited Edition">Limited Edition</option>
        </select>
      </div>

      <div className="space-y-4">
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Warranty</label>
        <div className="flex space-x-3">
          <input type="number" min="1" step="1" onKeyDown={blockInvalidChar} value={formData.warrantyValue} onChange={(e) => updateField('warrantyValue', e.target.value)} className="w-1/3 p-5 bg-slate-800 rounded-2xl text-center font-black text-amber-500" />
          <select value={formData.warrantyUnit} onChange={(e) => updateField('warrantyUnit', e.target.value)} className="w-2/3 p-5 bg-slate-800 rounded-2xl font-black text-xs uppercase">
            <option value="Months">Months</option>
            <option value="Years">Years</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Return Window (Days)</label>
        <input type="number" min="0" step="1" onKeyDown={blockInvalidChar} value={formData.returnDays} onChange={(e) => updateField('returnDays', e.target.value)} className="w-full p-5 bg-slate-800 rounded-2xl font-black text-xs" />
      </div>

      <div className="pt-8 border-t border-slate-800">
        <div className="flex bg-slate-800 p-1.5 rounded-2xl">
          {['Draft', 'Published'].map(status => (
            <button key={status} type="button" onClick={() => updateField('status', status)} className={`flex-1 py-4 rounded-xl text-[10px] font-black transition-all ${formData.status === status ? 'bg-amber-600 text-white' : 'text-slate-500'}`}>
              {status.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      {/* Shipping Section inside LogisticsSidebar */}
<div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Logistics & Shipping</h3>
  
  <div className="space-y-4">
    <label className="text-xs font-bold uppercase">Shipping Method</label>
    <div className="flex p-1 bg-slate-100 rounded-2xl">
      <button
        type="button"
        onClick={() => setFormData({ ...formData, shippingType: 'Free', shippingCost: 0 })}
        className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
          formData.shippingType === 'Free' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
        }`}
      >
        FREE
      </button>
      <button
        type="button"
        onClick={() => setFormData({ ...formData, shippingType: 'Paid' })}
        className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
          formData.shippingType === 'Paid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
        }`}
      >
        PAID
      </button>
    </div>

    {/* Conditional Price Input */}
    {formData.shippingType === 'Paid' && (
      <div className="pt-2 animate-in fade-in slide-in-from-top-2">
        <label className="text-[10px] font-black uppercase text-amber-600 ml-2">Shipping Cost (₹)</label>
        <input
          type="number"
          value={formData.shippingCost}
          onChange={(e) => setFormData({ ...formData, shippingCost: e.target.value })}
          placeholder="0.00"
          className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-amber-500 transition-all text-black"
        />
      </div>
    )}
  </div>
</div>
    </div>
  );
};

export default LogisticsSidebar;