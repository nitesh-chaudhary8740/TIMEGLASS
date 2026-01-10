import { useParams, useNavigate } from 'react-router-dom';
import { useGetUserDetailsQuery } from '../features/api/adminDataApi';
import { 
  ArrowLeft, Mail, Phone, Calendar, MapPin, 
  ShoppingBag, ShieldCheck, ShieldAlert, ChevronRight 
} from 'lucide-react';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetUserDetailsQuery(id);

  const user = data?.user;
  const orders = data?.orders || [];
  console.log(data)

  if (isLoading) return <div className="p-20 text-center animate-pulse font-black uppercase tracking-widest text-slate-400 text-xs">Accessing Client Dossier...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      {/* 1. Navigation */}
      <button 
        onClick={() => navigate(-1)} 
        className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-amber-600 transition-colors mt-10"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Directory
      </button>

      {/* 2. Top Profile Header */}
      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-900 text-amber-500 rounded-4xl flex items-center justify-center text-2xl font-black shadow-2xl shadow-slate-200">
            {(user?.name || user.email).charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{user?.name || "Anonymous Client"}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                user?.isVerified ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
              }`}>
                {user?.isVerified ? 'Identity Verified' : 'Pending Verification'}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Member since {new Date(user?.createdAt).getFullYear()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">

          <button className="px-6 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
            Restrict Account
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Order History */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <ShoppingBag size={16} /> Purchase History
              </h3>
              <span className="text-[10px] font-black text-slate-400">{orders.length} Total Orders</span>
            </div>
            
            <div className="divide-y divide-gray-50">
              {orders.length > 0 ? orders.map((order) => (
                <div 
                  key={order._id}
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="p-8 hover:bg-slate-50/50 transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-amber-500 transition-all">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-sm uppercase">Order #{order._id.slice(-6)}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="font-black text-slate-900">₹{order.totalAmount.toLocaleString()}</p>
                      <p className={`text-[9px] font-black uppercase mt-1 ${
                        order.orderStatus === 'Delivered' ? 'text-emerald-500' : 'text-amber-500'
                      }`}>{order.orderStatus}</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-200 group-hover:text-amber-500 transition-all" />
                  </div>
                </div>
              )) : (
                <div className="p-20 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No transaction records found.</div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Contact & Logistics */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-black text-[10px] uppercase tracking-widest text-amber-600">Contact Intel</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Primary Email</p>
                  <p className="text-sm font-bold text-slate-700">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Phone Link</p>
                  <p className="text-sm font-bold text-slate-700">{user?.phone || 'Not Linked'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-black text-[10px] uppercase tracking-widest text-emerald-600">Registered Addresses</h3>
            <div className="space-y-4">
              {user?.addresses?.length > 0 ? user.addresses.map((addr, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                  <MapPin size={14} className="absolute right-4 top-4 text-slate-300" />
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Address 0{idx + 1}</p>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {addr.street}, {addr.city}<br />
                    {addr.state} - {addr.postalCode}
                  </p>
                </div>
              )) : (
                <p className="text-[10px] text-slate-400 italic font-medium">No saved addresses on file.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;