import { Package, IndianRupee, Box } from 'lucide-react';

const GeneralDetails = ({ formData, setFormData }) => {
  const blockInvalidChar = (e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();
  const blockPriceChar = (e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
      <div className="flex items-center space-x-3 border-b border-slate-50 pb-6">
        <div className="p-2 bg-slate-900 rounded-lg"><Package size={18} className="text-white" /></div>
        <h3 className="font-black uppercase tracking-tighter text-sm text-slate-800">Master Details</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Model Reference Name</label>
          <input required value={formData.name} onChange={(e) => updateField('name', e.target.value)} className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold" placeholder="e.g. Rolex Cosmograph Daytona" />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Market Value (INR)</label>
          <div className="relative">
            <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input required type="number" min="0" step="0.01" onKeyDown={blockPriceChar} value={formData.price} onChange={(e) => updateField('price', e.target.value)} className="w-full pl-12 pr-5 py-5 bg-slate-50 rounded-2xl outline-none font-black" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Stock Allocation</label>
          <div className="relative">
            <Box className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input required type="number" min="0" step="1" onKeyDown={blockInvalidChar} value={formData.stock} onChange={(e) => updateField('stock', e.target.value)} className="w-full pl-12 pr-5 py-5 bg-slate-50 rounded-2xl outline-none font-black" />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Specifications</label>
          <textarea value={formData.description} onChange={(e) => updateField('description', e.target.value)} rows="6" className="w-full p-6 bg-slate-50 rounded-4xl outline-none resize-none font-medium text-slate-600"></textarea>
        </div>
      </div>
    </div>
  );
};

export default GeneralDetails;