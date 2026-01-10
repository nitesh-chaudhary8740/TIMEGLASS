import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, Truck, RotateCcw, CheckCircle, 
  MapPin, User, Mail, Smartphone, AlertCircle 
} from 'lucide-react';
import { 
  useUpdateItemStatusMutation, useSendDeliveryOtpMutation, 
  useVerifyDeliveryOtpMutation, useSendReturnOtpMutation,
  useVerifyReturnOtpMutation, useRollbackDeliveryMutation, 
  useRollbackReturnPickupMutation
} from '../features/api/adminOrderApi';

const ManagementModal = ({ isOpen, onClose, item, orderId, recipient = {}, address = {} }) => {
  const [otpValue, setOtpValue] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Mutations
  const [updateStatus, { isLoading: isDispatching }] = useUpdateItemStatusMutation();
  const [sendDeliveryOtp, { isLoading: isSendingDelivery }] = useSendDeliveryOtpMutation();
  const [verifyDeliveryOtp, { isLoading: isVerifyingDelivery }] = useVerifyDeliveryOtpMutation();
  const [rollbackDelivery] = useRollbackDeliveryMutation();
  const [sendReturnOtp, { isLoading: isSendingReturn }] = useSendReturnOtpMutation();
  const [verifyReturnOtp, { isLoading: isVerifyingReturn }] = useVerifyReturnOtpMutation();
  const [rollbackReturn, { isLoading: isRollingBackReturn }] = useRollbackReturnPickupMutation();

  // Reset state on modal open/close
  useEffect(() => {
    setShowOtpInput(false);
    setOtpValue('');
    setErrorMessage('');
  }, [item?.status, isOpen]);

  if (!isOpen || !item) return null;
  const productId = item.product?.$oid || item.product?._id || item.product;

  const handleAction = async (type) => {
    setErrorMessage('');
    try {
      if (type === 'dispatch') {
        await updateStatus({ orderId, productId, status: 'Shipped' }).unwrap();
        onClose();
      } else if (type === 'delivery_init') {
        await sendDeliveryOtp({ id: orderId, productId }).unwrap();
        setShowOtpInput(true);
      } else if (type === 'return_init') {
        await sendReturnOtp({ orderId, productId }).unwrap();
        setShowOtpInput(true);
      }
    } catch (err) {
      setErrorMessage(err.data?.message || "Operation failed. Please try again.");
    }
  };

  const handleVerify = async (verifyFn, payload) => {
    setErrorMessage('');
    try {
      await verifyFn(payload).unwrap();
      onClose();
    } catch (err) {
      setErrorMessage(err.data?.message || "Verification failed. Check the code.");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Clickable Backdrop */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${errorMessage ? 'animate-shake' : ''}`}>
        
        {/* TOP BAR: Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-8 p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all z-10"
        >
          <X size={20} />
        </button>

        {/* DESTINATION OVERVIEW */}
        <div className="p-8 bg-slate-50 border-b border-slate-100 grid grid-cols-2 gap-6 pr-20">
          <div>
            <p className="text-[9px] font-black text-indigo-600 uppercase mb-3 flex items-center gap-2"><User size={12}/> Receiver</p>
            <p className="text-sm font-black text-slate-900 uppercase leading-none">{recipient?.name || 'N/A'}</p>
            <div className="mt-2 space-y-1">
                <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><Mail size={10}/> {recipient?.email}</p>
                <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><Smartphone size={10}/> {recipient?.phone}</p>
            </div>
          </div>
          <div>
            <p className="text-[9px] font-black text-indigo-600 uppercase mb-3 flex items-center gap-2"><MapPin size={12}/> Destination</p>
            <p className="text-[11px] font-bold text-slate-700 leading-relaxed uppercase">
              {address?.street}, {address?.city}, {address?.state} - {address?.postalCode}
            </p>
          </div>
        </div>

        <div className="p-10">
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} />
              <p className="text-xs font-black uppercase tracking-tight">{errorMessage}</p>
            </div>
          )}

          {/* PHASE: PROCESSING */}
          {item.status === 'Processing' && (
            <button 
              disabled={isDispatching}
              onClick={() => handleAction('dispatch')} 
              className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-black disabled:opacity-50"
            >
              {isDispatching ? <span className="animate-pulse">Dispatching...</span> : <><Truck size={18}/> Confirm Dispatch</>}
            </button>
          )}

          {/* PHASE: SHIPPED */}
          {item.status === 'Shipped' && (
            <div className="space-y-4">
              {!showOtpInput ? (
                <button 
                  disabled={isSendingDelivery}
                  onClick={() => handleAction('delivery_init')} 
                  className="w-full py-6 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-emerald-100"
                >
                  {isSendingDelivery ? "Sending Code..." : <><CheckCircle size={18}/> Request Delivery OTP</>}
                </button>
              ) : (
                <div className="space-y-4">
                  <input 
                    type="text" maxLength={6} placeholder="· · · · · ·" 
                    value={otpValue} 
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))} 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 text-center text-3xl font-black tracking-[0.5em] focus:border-indigo-500 focus:bg-white transition-all outline-none" 
                  />
                  <div className="flex gap-2">
                    <button 
                      disabled={isVerifyingDelivery}
                      onClick={() => handleVerify(verifyDeliveryOtp, { id: orderId, otp: otpValue, productId })} 
                      className="flex-grow py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest disabled:opacity-50"
                    >
                      {isVerifyingDelivery ? "Verifying..." : "Confirm Handover"}
                    </button>
                    <button 
                      onClick={() => rollbackDelivery({ id: orderId, productId }).then(onClose)} 
                      className="px-6 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors"
                    >
                      <RotateCcw size={20}/>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PHASE: RETURN */}
          {item.status === 'Return_Requested' && (
            <div className="space-y-4">
              {!showOtpInput ? (
                <button 
                  disabled={isSendingReturn}
                  onClick={() => handleAction('return_init')} 
                  className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-indigo-100"
                >
                  {isSendingReturn ? "Sending Code..." : <><RotateCcw size={18}/> Request Return OTP</>}
                </button>
              ) : (
                <div className="space-y-4">
                  <input 
                    type="text" maxLength={6} placeholder="· · · · · ·" 
                    value={otpValue} 
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))} 
                    className="w-full bg-indigo-50 border-2 border-indigo-100 rounded-2xl py-4 text-center text-3xl font-black tracking-[0.5em] text-indigo-900 outline-none" 
                  />
                  <div className="flex gap-2">
                    <button 
                      disabled={isVerifyingReturn}
                      onClick={() => handleVerify(verifyReturnOtp, { orderId, productId, otp: otpValue })} 
                      className="flex-grow py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest"
                    >
                      {isVerifyingReturn ? "Verifying..." : "Confirm Return Pickup"}
                    </button>
                    <button 
                      disabled={isRollingBackReturn}
                      onClick={() => rollbackReturn({ orderId, productId }).then(onClose)}
                      className="px-6 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors"
                      title="Cancel & Rollback"
                    >
                      <RotateCcw size={20}/>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagementModal;