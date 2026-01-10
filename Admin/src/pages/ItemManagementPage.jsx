import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, ArrowLeft, User, MapPin, 
  Clock, CheckCircle, Package, Truck, RotateCcw, Mail, Smartphone 
} from 'lucide-react';
import { useGetOrderDetailsQuery } from "../features/api/adminOrderApi.js";
import ManagementModal from './ManagementModal';

const ItemManagementPage = () => {
  const { id, productId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data, isLoading } = useGetOrderDetailsQuery(id);
  const order = data?.order;

  const item = order?.items?.find(i => {
    const itemId = i._id?.$oid || i._id;
    const prodId = i.product?.$oid || i.product?._id || i.product;
    return String(itemId) === String(productId) || String(prodId) === String(productId);
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center font-black text-slate-400 animate-pulse">SYNCING ASSET...</div>;
  if (!item) return <div className="h-screen flex items-center justify-center font-black text-red-500">ASSET NOT FOUND</div>;

  // Determine current active date for the status display
  const currentStatusDate = item.deliveredAt || item.shippedAt || order.createdAt;

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-8">
      {/* Top Nav */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors">
        <ArrowLeft size={14} /> Back to Manifest
      </button>

      {/* MAIN COMMAND SECTION (60/40 Split) */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* LEFT: 40% Product Visual */}
        <div className="lg:w-[40%] bg-white rounded-[2.5rem] p-3 border border-slate-100 shadow-sm self-start">
          <img 
            src={item.image} 
            className="w-full aspect-square object-cover rounded-[2rem] shadow-inner" 
            alt={item.name} 
          />
          <div className="p-6">
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-1">{item.name}</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {productId.slice(-8)}</p>
          </div>
        </div>

        {/* RIGHT: 60% Status & Integrated Buttons */}
        <div className="lg:w-[60%] flex flex-col gap-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden flex-grow">
            {/* Background Accent */}
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Current Asset Phase</p>
                <h2 className="text-5xl font-black uppercase tracking-tighter mb-2">
                  {item.status.replace('_', ' ')}
                </h2>
                <div className="flex items-center gap-3 text-slate-400">
                  <Clock size={16} />
                  <p className="text-sm font-bold">
                    {new Date(currentStatusDate?.$date || currentStatusDate).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* INTEGRATED ACTION BUTTONS */}
              <div className="mt-12">
                {['Processing', 'Shipped', 'Return_Requested'].includes(item.status) ? (
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="group w-full py-6 bg-white text-slate-900 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-indigo-500 hover:text-white transition-all shadow-xl"
                  >
                    {item.status === 'Processing' && <><Truck size={20}/> Authorize Dispatch</>}
                    {item.status === 'Shipped' && <><CheckCircle size={20}/> Confirm Handover</>}
                    {item.status === 'Return_Requested' && <><RotateCcw size={20}/> Verify Return Pickup</>}
                  </button>
                ) : (
                  <div className="flex items-center gap-3 py-6 px-8 bg-white/10 rounded-3xl border border-white/10">
                    <CheckCircle className="text-emerald-400" size={20} />
                    <p className="text-xs font-black uppercase tracking-widest">Lifecycle Phase Completed</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mini Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <StatBox label="Unit Price" value={`₹${item.price}`} />
            <StatBox label="Quantity" value={item.quantity} />
            <StatBox label="Net Worth" value={`₹${item.price * item.quantity}`} highlight />
          </div>
        </div>
      </div>

      {/* BOTTOM: Full Width Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <User size={14}/> Registered Recipient
            </h3>
            <p className="text-2xl font-black text-slate-900 uppercase tracking-tight">{order.recipient.name}</p>
          </div>
          <div className="mt-6 space-y-2">
            <p className="text-sm font-bold text-slate-600 flex items-center gap-3"><Mail size={16} className="text-slate-300"/> {order.recipient.email}</p>
            <p className="text-sm font-bold text-slate-600 flex items-center gap-3"><Smartphone size={16} className="text-slate-300"/> {order.recipient.phone}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <MapPin size={14}/> Full Destination Address
          </h3>
          <p className="text-lg font-black text-slate-800 leading-snug uppercase">
            {order.shippingAddress.street}<br/>
            {order.shippingAddress.city}, {order.shippingAddress.state}<br/>
            <span className="text-indigo-600">Postal Code: {order.shippingAddress.postalCode}</span>
          </p>
        </div>
      </div>

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        item={item} 
        orderId={id} 
        recipient={order.recipient} 
        address={order.shippingAddress}
      />
    </div>
  );
};

// UI Atoms
const StatBox = ({ label, value, highlight }) => (
  <div className={`p-6 rounded-3xl border ${highlight ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-slate-100'} text-center`}>
    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">{label}</p>
    <p className={`text-lg font-black ${highlight ? 'text-indigo-600' : 'text-slate-900'}`}>{value}</p>
  </div>
);

export default ItemManagementPage;