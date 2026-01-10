import { useGetAllUsersQuery } from '../features/api/adminDataApi';
import { Mail, Calendar, UserCheck, UserX, ChevronRight, Search, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UsersList = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllUsersQuery();
  
  // 1. Filter to only show CUSTOMERS
  const customers = data?.users?.filter(user => user.role === 'customer') || [];

  if (isLoading) return (
    <div className="p-20 text-center animate-pulse font-black uppercase tracking-widest text-slate-300 text-xs">
      Opening Client Registry...
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-[11px] font-bold focus:ring-2 focus:ring-amber-500/20"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Active Consumer Database: {customers.length}
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b border-gray-50">
              <th className="p-8">Client Identity</th>
              <th className="p-8">Communication</th>
              <th className="p-8">Account Created</th>
              <th className="p-8 text-right">Verification Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {customers.map((user) => (
              <tr 
                key={user._id} 
                onClick={() => navigate(`/user/${user._id}`)}
                className="hover:bg-slate-50/80 transition-all cursor-pointer group"
              >
                <td className="p-8 flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-900 text-amber-500 rounded-2xl flex items-center justify-center text-sm font-black shadow-lg shadow-slate-200">
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-black text-slate-800 text-sm block">
                      {user.name || "Anonymous Client"}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                      REF: {user._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                </td>
                
                <td className="p-8">
                  <div className="flex items-center space-x-2 text-slate-500">
                    <Mail size={14} className="text-slate-300" />
                    <span className="text-sm font-medium">{user.email}</span>
                  </div>
                </td>

                <td className="p-8">
                  <div className="flex items-center space-x-2 text-slate-500">
                    <Calendar size={14} className="text-slate-300" />
                    <span className="text-sm font-medium">
                      {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </td>

                <td className="p-8">
                  <div className="flex items-center justify-end space-x-4">
                    {/* 2. DYNAMIC VERIFICATION BADGE */}
                    <span className={`inline-flex items-center space-x-1 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      user.isVerified 
                      ? 'text-emerald-600 bg-emerald-50 border-emerald-100' 
                      : 'text-rose-600 bg-rose-50 border-rose-100'
                    }`}>
                      {user.isVerified ? <UserCheck size={10} /> : <ShieldAlert size={10} />}
                      <span>{user.isVerified ? 'Verified' : 'Pending Auth'}</span>
                    </span>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-amber-500 transition-colors" />
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

export default UsersList;