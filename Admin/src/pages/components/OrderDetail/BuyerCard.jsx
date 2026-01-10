import { User, Mail, Calendar, Hash } from 'lucide-react';

const BuyerCard = ({ user }) => (
  <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
    <h3 className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] mb-6 text-slate-400">
      <User size={14}/> 02. Buyer Account
    </h3>
    <div className="space-y-4">
      <div>
        <p className="text-sm font-bold text-slate-800">{user?.name}</p>
        <p className="text-[11px] text-slate-500 flex items-center gap-2 font-medium mt-1">
          <Mail size={12} className="text-slate-300"/> {user?.email}
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
        <div>
          <p className="text-[9px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1">
             <Hash size={10}/> Account ID
          </p>
          <p className="text-[9px] font-mono text-slate-400 uppercase truncate">
            {user?._id.slice(-8)}
          </p>
        </div>
        <div>
          <p className="text-[9px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1">
             <Calendar size={10}/> Member Since
          </p>
          <p className="text-[9px] font-bold text-slate-500 uppercase">
            {new Date(user?.createdAt).getFullYear() || '2024'}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default BuyerCard;