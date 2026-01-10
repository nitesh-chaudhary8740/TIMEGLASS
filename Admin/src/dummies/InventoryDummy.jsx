// src/pages/Inventory.jsx
import { useState } from 'react';
import { Edit3, Trash2, Eye, EyeOff, Package, Truck, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InventoryDummy = () => {
  // Local Dummy Data - Keeping the Redux Reducer clean
  const navigate = useNavigate()
  const [products, setProducts] = useState([
    {
      id: 1001,
      name: "Horizon Sapphire X",
      price: 45000,
      tier: "Premium",
      isFreeShipping: true,
      warranty: "2 Years",
      status: "Published"
    },
    {
      id: 1002,
      name: "Eclipse Onyx Edition",
      price: 82000,
      tier: "Limited Edition",
      isFreeShipping: true,
      warranty: "5 Years",
      status: "Published"
    },
    {
      id: 1003,
      name: "Nomad Field Watch",
      price: 12500,
      tier: "Standard",
      isFreeShipping: false,
      warranty: "6 Months",
      status: "Draft"
    },
    {
      id: 1004,
      name: "Rose Gold Serenity",
      price: 38000,
      tier: "Premium",
      isFreeShipping: true,
      warranty: "2 Years",
      status: "Draft"
    }
  ]);

  const [filter, setFilter] = useState('All');

  const filteredProducts = products.filter(p => 
    filter === 'All' ? true : p.status === filter
  );

  // Local handler for the "Eye" toggle
  const toggleStatus = (id) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, status: p.status === 'Published' ? 'Draft' : 'Published' } : p
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Collection Inventory</h1>
          <p className="text-sm text-slate-500">Manage visibility and details of your TIMEGLASS timepieces.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl">
          {['All', 'Published', 'Draft'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                filter === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-gray-100">
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Product Details</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Tier</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Logistics</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Price</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{product.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium tracking-widest">#{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="text-[10px] font-black px-3 py-1 bg-slate-100 text-slate-600 rounded-lg uppercase">
                    {product.tier}
                  </span>
                </td>
                <td className="p-6">
                  <div className="space-y-1">
                    <div className="flex items-center text-[10px] font-bold text-slate-500">
                      <Truck size={12} className="mr-1 text-amber-500"/> {product.isFreeShipping ? 'Free' : 'Paid'}
                    </div>
                    <div className="flex items-center text-[10px] font-bold text-slate-500">
                      <ShieldCheck size={12} className="mr-1 text-amber-500"/> {product.warranty}
                    </div>
                  </div>
                </td>
                <td className="p-6 text-sm font-black text-slate-900">₹{product.price.toLocaleString()}</td>
                <td className="p-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    product.status === 'Published' 
                    ? 'bg-green-50 text-green-600 border-green-100' 
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex items-center justify-center space-x-1">
                    <button onClick={() => toggleStatus(product.id)} className="p-2 text-slate-400 hover:bg-white hover:text-amber-600 hover:shadow-sm rounded-xl transition-all">
                      {product.status === 'Published' ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button
                    onClick={() => navigate(`/inventory/edit/${product.id}`)}
                    className="p-2 text-slate-400 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-xl transition-all">
                      <Edit3 size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:bg-white hover:text-red-600 hover:shadow-sm rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryDummy;