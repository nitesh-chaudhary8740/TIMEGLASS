import { MapPin, Mail, Phone } from 'lucide-react';

const DestinationCard = ({ recipient, address }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
    <h3 className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] mb-6 text-amber-600">
      <MapPin size={14}/> 01. Destination
    </h3>
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Receiver</p>
        <p className="font-bold text-slate-800 text-lg">{recipient?.name}</p>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Security Email</p>
        <p className="text-sm text-slate-700 font-medium flex items-center gap-2">
          <Mail size={14} className="text-amber-500"/> {recipient?.email}
        </p>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Contact</p>
        <p className="text-sm text-slate-700 font-medium flex items-center gap-2">
          <Phone size={12} className="text-slate-400"/> {recipient?.phone}
        </p>
      </div>
      <div className="pt-4 border-t border-slate-50">
        <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Delivery Address</p>
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          {address?.street},<br />
          {address?.city}, {address?.state} {address?.postalCode}
        </p>
      </div>
    </div>
  </div>
);

export default DestinationCard;