import React, { useState } from 'react';
import { RotateCcw, ShieldCheck, Send, Loader2, PackageSearch } from 'lucide-react';
import { useSendReturnOtpMutation, useVerifyReturnOtpMutation } from '../../features/api/adminOrderApi';

const ReturnVerificationCard = ({ orderId, productId, currentStatus, recipientEmail }) => {
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const [sendReturnOtp, { isLoading: isSending }] = useSendReturnOtpMutation();
  const [verifyReturnOtp, { isLoading: isVerifying }] = useVerifyReturnOtpMutation();

  const handleSend = async () => {
    try {
      await sendReturnOtp({ orderId, productId }).unwrap();
      setIsOtpSent(true);
      alert("Return Security Code dispatched to customer.");
    } catch (err) {
      alert(err.data?.message || "Failed to send code");
    }
  };

  const handleVerify = async () => {
    try {
      await verifyReturnOtp({ orderId, productId, otp }).unwrap();
      alert("Return Pickup Verified. Item is now In-Transit.");
      setOtp('');
      setIsOtpSent(false);
    } catch (err) {
      alert(err.data?.message || "Invalid Return Code");
    }
  };

  if (currentStatus === 'Returned') return null;

  return (
    <div className="bg-indigo-50 border-2 border-indigo-100 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-900">
        <RotateCcw size={80} />
      </div>

      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <PackageSearch size={20} />
          </div>
          <h3 className="text-xl font-black text-indigo-900 uppercase tracking-tighter text-nowrap">
            Return Handover
          </h3>
        </div>
        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] ml-1">
          Secure Inbound Logistics Verification
        </p>
      </div>

      {!isOtpSent ? (
        <button
          onClick={handleSend}
          disabled={isSending}
          className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-200 group"
        >
          {isSending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} className="group-hover:translate-x-1 transition-transform" />}
          <span className="text-xs font-black uppercase tracking-widest">Generate Return Security Code</span>
        </button>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="relative">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="ENTER 6-DIGIT RETURN CODE"
              className="w-full bg-white border-2 border-indigo-200 rounded-[1.5rem] px-6 py-5 text-center text-lg font-black tracking-[0.5em] text-indigo-900 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300 placeholder:tracking-normal placeholder:font-bold placeholder:text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setIsOtpSent(false)}
              className="py-4 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-white rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleVerify}
              disabled={isVerifying || otp.length < 4}
              className="py-4 bg-indigo-900 hover:bg-black text-white rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
              {isVerifying ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
              <span className="text-[10px] font-black uppercase tracking-widest">Verify Pickup</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-[9px] font-bold text-indigo-400 uppercase tracking-widest bg-white/50 w-fit px-4 py-2 rounded-full border border-indigo-100">
        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
        Target: {recipientEmail}
      </div>
    </div>
  );
};

export default ReturnVerificationCard;