import { Watch, User2, Cpu, Palette, Ruler, Droplets } from 'lucide-react';

const TechnicalDetails = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inputStyles = "w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-sm font-medium border border-transparent focus:border-amber-200";
  const labelStyles = "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2";

  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
          <Watch size={24} />
        </div>
        <div>
          <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-800">Engineering & Specs</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Technical Attributes for Global Filters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Gender Filter */}
        <div>
          <label className={labelStyles}><User2 size={14}/> Target Gender</label>
          <select name="gender" value={formData.gender} className={inputStyles} onChange={handleChange}>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        {/* Movement Spec */}
        <div>
          <label className={labelStyles}><Cpu size={14}/> Movement</label>
          <select name="movement" value={formData.movement} className={inputStyles} onChange={handleChange}>
            <option value="Analog">Analog</option>
            <option value="Digital">Digital</option>
            <option value="Automatic">Automatic</option>
            <option value="Quartz">Quartz</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* Material Spec */}
        <div>
          <label className={labelStyles}><Palette size={14}/> Case Material</label>
          <select name="material" value={formData.material} className={inputStyles} onChange={handleChange}>
            <option value="Stainless Steel">Stainless Steel</option>
            <option value="Leather">Leather</option>
            <option value="Titanium">Titanium</option>
            <option value="Gold">Gold</option>
            <option value="Ceramic">Ceramic</option>
            <option value="Silicone">Silicone</option>
          </select>
        </div>

        {/* Colorway */}
        <div>
          <label className={labelStyles}>Primary Color</label>
          <input 
            name="color" 
            value={formData.color} 
            className={inputStyles} 
            placeholder="e.g. Rose Gold" 
            onChange={handleChange} 
          />
        </div>

        {/* Case Size */}
        <div>
          <label className={labelStyles}><Ruler size={14}/> Case Size (mm)</label>
          <input 
            type="number" 
            name="caseSize" 
            value={formData.caseSize} 
            className={inputStyles} 
            placeholder="42" 
            onChange={handleChange} 
          />
        </div>

        {/* Water Resistance */}
        <div>
          <label className={labelStyles}><Droplets size={14}/> Water Resistance</label>
          <select name="waterResistance" value={formData.waterResistance} className={inputStyles} onChange={handleChange}>
            <option value="30m">30m (Daily)</option>
            <option value="50m">50m (Swimming)</option>
            <option value="100m">100m (Diving)</option>
            <option value="200m">200m (Professional)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TechnicalDetails;