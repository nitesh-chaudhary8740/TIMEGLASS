import { CheckCircle2, ShieldCheck, Clock, Calendar } from 'lucide-react';

const HandoverDetails = ({ order }) => {
  if (order?.orderStatus !== 'Delivered') return null;

  const deliveryDate = new Date(order?.deliveredAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const deliveryTime = new Date(order?.deliveredAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="bg-emerald-50/50 border border-emerald-100 rounded-[3rem] p-10 relative overflow-hidden">
      {/* Background Decorative Icon */}
      <CheckCircle2 size={120} className="absolute -bottom-4 -right-4 text-emerald-100/50 -rotate-12" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-emerald-500 p-2 rounded-xl text-white">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-[0.2em] text-emerald-700">Handover Authenticated</h3>
            <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-widest">Digital Signature Verified</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-1">
            <p className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-tighter">
              <Calendar size={12} /> Completion Date
            </p>
            <p className="text-lg font-bold text-slate-800">{deliveryDate}</p>
          </div>

          <div className="space-y-1">
            <p className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-tighter">
              <Clock size={12} /> Release Timestamp
            </p>
            <p className="text-lg font-bold text-slate-800">{deliveryTime}</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-emerald-100/50">
          <p className="text-[10px] leading-relaxed text-emerald-700/60 font-medium italic">
            "The recipient has provided the secure 6-digit verification code. 
            By this action, the custody of the items listed in Inventory has been officially transferred 
            to {order?.recipient.name}."
          </p>
        </div>
      </div>
    </div>
  );
};

export default HandoverDetails;