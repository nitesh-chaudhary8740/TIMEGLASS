import { useState } from 'react';
import { Edit3, Trash2, Eye, EyeOff, Package, Truck, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  useGetAllProductsQuery, 
  useDeleteProductMutation, 
  useToggleProductStatusMutation 
} from '../features/api/productApi';

const Inventory = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  // 1. RTK Query Hooks
  const { data, isLoading, isError, refetch } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [toggleStatus] = useToggleProductStatusMutation();

  const products = data?.products || [];

  // 2. Filter logic
  const filteredProducts = products.filter(p => 
    filter === 'All' ? true : p.status === filter
  );

  // 3. Handlers
  const handleToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Published' ? 'Draft' : 'Published';
    try {
      await toggleStatus({ id, status: newStatus }).unwrap();
    } catch (err) {
      console.error("Status toggle failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This will permanently remove this timepiece and its images from the cloud.")) {
      try {
        await deleteProduct(id).unwrap();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  if (isLoading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-amber-600" size={40} />
      <p className="text-slate-400 font-bold tracking-[0.2em] text-[10px] uppercase">Accessing Timeglass Vault...</p>
    </div>
  );

  if (isError) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 text-red-500">
      <AlertCircle size={40} />
      <p className="font-bold">Failed to synchronize with the collection.</p>
      <button onClick={() => refetch()} className="text-xs underline uppercase tracking-widest">Retry Connection</button>
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Collection Inventory</h1>
          <p className="text-sm text-slate-500 font-medium">Manage and monitor your luxury timepiece assets.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/50">
          {['All', 'Published', 'Draft'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                filter === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">Product Details</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">Logistics</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">Stock</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">Price</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">Status</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredProducts.map((product) => (
              <tr key={product._id} className="group hover:bg-slate-50/30 transition-colors">
                {/* Image & Name */}
                <td className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src={product.defaultImage?.url || product.coverImage} 
                        alt={product.name}
                        className="w-14 h-14 rounded-2xl object-cover bg-slate-100 border border-slate-100 shadow-sm group-hover:scale-105 transition-transform"
                      />
                      {product.tier === 'Limited Edition' && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                           <span className="text-[8px] text-white font-black">L</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-tight">{product.name}</p>
                      <p className="text-[9px] text-slate-400 font-bold tracking-widest uppercase mt-1">Ref: {product._id.slice(-6)}</p>
                    </div>
                  </div>
                </td>

                {/* Shipping & Warranty */}
                <td className="p-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center text-[10px] font-bold text-slate-500">
                      <Truck size={12} className="mr-2 text-amber-500"/> 
                      {product.shipping?.type === 'Free' ? 'Complimentary' : `₹${product.shipping?.cost}`}
                    </div>
                    <div className="flex items-center text-[10px] font-bold text-slate-500">
                      <ShieldCheck size={12} className="mr-2 text-amber-500"/> 
                      {product.warranty?.value} {product.warranty?.unit}
                    </div>
                  </div>
                </td>

                {/* Stock Quantity */}
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className={`text-sm font-black ${product.stock <= 5 ? 'text-rose-500' : 'text-slate-700'}`}>
                      {product.stock.toString().padStart(2, '0')}
                    </span>
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="text-[8px] font-black uppercase text-rose-500 tracking-widest mt-0.5">Low Stock</span>
                    )}
                    {product.stock === 0 && (
                      <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest mt-0.5">Sold Out</span>
                    )}
                  </div>
                </td>

                {/* Price */}
                <td className="p-6">
                  <p className="text-sm font-black text-slate-900">₹{product.price.toLocaleString()}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{product.tier}</p>
                </td>

                {/* Status Badge */}
                <td className="p-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors ${
                    product.status === 'Published' 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                    <span className={`w-1 h-1 rounded-full mr-1.5 ${product.status === 'Published' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    {product.status}
                  </span>
                </td>

                {/* Quick Actions */}
                <td className="p-6">
                  <div className="flex items-center justify-center space-x-1">
                    <button 
                      title="Toggle Visibility"
                      onClick={() => handleToggle(product._id, product.status)}
                      className="p-2.5 text-slate-400 hover:bg-slate-100 hover:text-amber-600 rounded-xl transition-all"
                    >
                      {product.status === 'Published' ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button 
                      title="Edit Timepiece"
                      onClick={() => navigate(`/inventory/edit/${product._id}`)}
                      className="p-2.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600 rounded-xl transition-all"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      title="Delete Entry"
                      onClick={() => handleDelete(product._id)}
                      className="p-2.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="p-20 text-center">
            <Package className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No Timepieces Found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;