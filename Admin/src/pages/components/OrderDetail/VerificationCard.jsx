import { ShieldCheck, Send, Loader2 } from 'lucide-react';

const VerificationCard = ({ 
  status, 
  isOtpSent, 
  isSendingOtp, 
  isVerifying, // Added this prop
  otp, 
  setOtp, 
  onGenerate, 
  onVerify, 
  recipientEmail, 
  setIsOtpSent,
  onRollback 
}) => {
  if (status !== 'Shipped') return null;

  return (
    <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl border border-slate-800">
      {!isOtpSent ? (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto text-amber-500">
            <ShieldCheck size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-lg uppercase tracking-widest">Secure Handover</h3>
            <p className="text-slate-400 text-xs font-medium max-w-xs mx-auto leading-relaxed">
              Generate a unique signature code to verify the recipient.
            </p>
          </div>
          <button 
            onClick={onGenerate}
            disabled={isSendingOtp}
            className="bg-amber-500 hover:bg-amber-600 px-12 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center gap-3 mx-auto active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSendingOtp ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <Send size={14} />
            )}
            {isSendingOtp ? 'Dispatching...' : 'Generate OTP'}
          </button>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-6">
            <div>
              <h3 className="font-black text-sm uppercase tracking-widest text-amber-500">Awaiting Code</h3>
              <p className="text-slate-500 text-[10px] mt-1 italic">Dispatched to: {recipientEmail}</p>
            </div>
            <button 
              onClick={() => {
                setIsOtpSent(false);
                setOtp(''); // Clear input on retry
              }} 
              className="text-[9px] font-black uppercase text-slate-500 hover:text-white underline underline-offset-4"
            >
              Retry
            </button>
          </div>
          <div className="flex gap-4">
            <input 
              type="text" 
              inputMode="numeric" 
              pattern="[0-9]*" 
              maxLength="6" 
              placeholder="· · · · · ·"
              className="bg-slate-800 border-none rounded-2xl px-6 py-5 text-center font-mono text-3xl tracking-[0.3em] focus:ring-2 focus:ring-amber-500 w-full placeholder:text-slate-700 outline-none"
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              value={otp}
            />
            <button 
              onClick={onVerify}
              disabled={isVerifying || otp.length < 6}
              className="bg-emerald-500 hover:bg-emerald-600 px-10 rounded-2xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:bg-slate-700"
            >
              {isVerifying ? <Loader2 className="animate-spin mx-auto" size={16} /> : 'Verify'}
            </button>
          </div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-6">
    <div>
      <h3 className="font-black text-sm uppercase tracking-widest text-amber-500">Awaiting Code</h3>
      <p className="text-slate-500 text-[10px] mt-1 italic">Dispatched to: {recipientEmail}</p>
    </div>
    {/* NEW ABORT BUTTON */}
    <button 
      onClick={onRollback} 
      className="text-[9px] font-black uppercase text-red-400 hover:text-red-500 border border-red-900/50 hover:border-red-500 px-3 py-1 rounded-lg transition-all"
    >
      Abort Handover
    </button>
  </div>
        </div>
      )}
    </div>
  );
};

export default VerificationCard;