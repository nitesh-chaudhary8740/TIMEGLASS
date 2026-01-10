import { useState } from 'react';
import { useAddProductMutation } from '../features/api/productApi';
import { 
  Package, ShieldCheck, Truck, Cpu, Watch, User2, 
  Palette, Ruler, PlusCircle, Image as ImageIcon, X, Droplets, Check
} from 'lucide-react';

const AddProduct = () => {
  const [addProduct, { isLoading }] = useAddProductMutation();
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    tier: 'Standard',
    gender: 'Men',
    movement: 'Analog',
    material: 'Stainless Steel',
    color: '',
    caseSize: '',
    waterResistance: '30m', // Added to match schema
    stock: 0,
    shippingType: 'Free',
    shippingCost: 0,
    warrantyValue: 2,
    warrantyUnit: 'Years',
    returnDays: 7,
    status: 'Published'
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [defaultImageIndex, setDefaultImageIndex] = useState(0); // For Schema's defaultImage

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
    if (defaultImageIndex === index) setDefaultImageIndex(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    // Append all schema fields
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    
    // Append images and the index for the default image
    images.forEach(file => data.append('images', file));
    data.append('defaultImageIndex', defaultImageIndex);

    try {
      await addProduct(data).unwrap();
      alert("Timepiece added to vault successfully!");
    } catch (err) {
      alert(err?.data?.message || "Critical error during upload");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 pt-10 font-sans">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-zinc-900 tracking-tighter">New Timepiece</h1>
          <p className="text-zinc-500 mt-1 uppercase text-[10px] font-bold tracking-widest">Database Entry / Product Schema V2</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Identity */}
          <section className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm space-y-6">
            <h3 className="font-black flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-400">
              <Package size={16} /> Identity & Pricing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase mb-2 block">Model Name</label>
                <input required name="name" className="w-full p-5 bg-zinc-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/20 transition-all" placeholder="e.g. Royal Oak Offshore" onChange={handleChange} />
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase mb-2 block">Price (INR)</label>
                <input required name="price" type="number" className="w-full p-5 bg-zinc-50 rounded-2xl outline-none" placeholder="₹ 0.00" onChange={handleChange} />
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase mb-2 block">Collection Tier</label>
                <select name="tier" className="w-full p-5 bg-zinc-50 rounded-2xl outline-none appearance-none" onChange={handleChange}>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="Limited Edition">Limited Edition</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 2: Technical Specifications */}
          <section className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm space-y-6">
            <h3 className="font-black flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-400">
              <Watch size={16} /> Engineering Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase flex items-center gap-1 mb-2"><User2 size={12}/> Target Gender</label>
                <select name="gender" className="w-full p-4 bg-zinc-50 rounded-xl outline-none" onChange={handleChange}>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase flex items-center gap-1 mb-2"><Cpu size={12}/> Movement</label>
                <select name="movement" className="w-full p-4 bg-zinc-50 rounded-xl outline-none" onChange={handleChange}>
                  <option value="Analog">Analog</option>
                  <option value="Digital">Digital</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Quartz">Quartz</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase flex items-center gap-1 mb-2"><Palette size={12}/> Primary Material</label>
                <select name="material" className="w-full p-4 bg-zinc-50 rounded-xl outline-none" onChange={handleChange}>
                  <option value="Stainless Steel">Stainless Steel</option>
                  <option value="Leather">Leather</option>
                  <option value="Titanium">Titanium</option>
                  <option value="Gold">Gold</option>
                  <option value="Ceramic">Ceramic</option>
                  <option value="Silicone">Silicone</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase mb-2 block">Color Way</label>
                <input name="color" className="w-full p-4 bg-zinc-50 rounded-xl outline-none" placeholder="e.g. Midnight Blue" onChange={handleChange} />
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase flex items-center gap-1 mb-2"><Ruler size={12}/> Case Size (mm)</label>
                <input name="caseSize" type="number" className="w-full p-4 bg-zinc-50 rounded-xl outline-none" placeholder="42" onChange={handleChange} />
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase flex items-center gap-1 mb-2"><Droplets size={12}/> Water Resist</label>
                <select name="waterResistance" className="w-full p-4 bg-zinc-50 rounded-xl outline-none" onChange={handleChange}>
                  <option value="30m">30m (Splashproof)</option>
                  <option value="50m">50m (Swim ready)</option>
                  <option value="100m">100m (Diving)</option>
                  <option value="200m+">200m+ (Professional)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 3: Media */}
          <section className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-black flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-400">
                <ImageIcon size={16} /> Visual Assets
              </h3>
              <span className="text-[10px] text-zinc-400 font-bold italic">* Click an image to set as Default</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previews.map((src, i) => (
                <div 
                  key={i} 
                  onClick={() => setDefaultImageIndex(i)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${defaultImageIndex === i ? 'border-amber-500 scale-95 shadow-inner' : 'border-zinc-100'}`}
                >
                  <img src={src} className="w-full h-full object-cover" alt="Preview" />
                  {defaultImageIndex === i && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white p-1 rounded-lg">
                      <Check size={12} strokeWidth={4} />
                    </div>
                  )}
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); removeImage(i); }} 
                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                  >
                    <X size={12}/>
                  </button>
                </div>
              ))}
              <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-2xl cursor-pointer hover:bg-zinc-50 transition-all group">
                <PlusCircle size={28} className="text-zinc-200 group-hover:text-amber-500 transition-colors" />
                <input type="file" multiple className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </section>
        </div>

        {/* Sidebar: Logic & Logistics */}
        <div className="space-y-6">
          <div className="bg-zinc-900 text-white p-10 rounded-[2.5rem] space-y-8 sticky top-10 shadow-2xl">
            <div>
              <h3 className="text-amber-500 font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Truck size={18} /> Logistics & Status
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase mb-3 block">Inventory Stock</label>
                  <input name="stock" type="number" className="w-full p-4 bg-zinc-800 rounded-xl outline-none font-mono text-amber-500" placeholder="0" onChange={handleChange} />
                </div>

                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase mb-3 block">Shipping Policy</label>
                  <div className="grid grid-cols-2 gap-2 p-1.5 bg-zinc-800 rounded-2xl">
                    {['Free', 'Paid'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(p => ({...p, shippingType: type}))}
                        className={`py-3 rounded-xl text-[10px] font-black transition-all ${formData.shippingType === type ? 'bg-zinc-700 text-amber-500 shadow-xl' : 'text-zinc-500'}`}
                      >
                        {type.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase mb-3 block">Publication Status</label>
                  <select name="status" className="w-full p-4 bg-zinc-800 rounded-xl outline-none text-xs font-bold" onChange={handleChange}>
                    <option value="Published">PUBLISHED</option>
                    <option value="Draft">DRAFT</option>
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-zinc-800" />

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-amber-500 text-black py-6 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-amber-400 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Syncing..." : "Publish to Shop"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;