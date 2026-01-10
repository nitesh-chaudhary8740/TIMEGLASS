import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  useGetOrderDetailsQuery, 
  useVerifyDeliveryOtpMutation, 
  useSendDeliveryOtpMutation,
  useRollbackDeliveryMutation,
  useCancelOrderMutation // Added for Master Cancel
} from '../features/api/adminOrderApi';

import { ArrowLeft, Ban } from 'lucide-react';
import OrderHeader from './components/OrderDetail/OrderHeader';
import ItemList from './components/OrderDetail/ItemList'; 
import VerificationCard from './components/OrderDetail/VerificationCard';
import DestinationCard from './components/OrderDetail/DestinationCard';
import BuyerCard from './components/OrderDetail/BuyerCard';
import SettlementCard from './components/OrderDetail/SettlementCard';
import HandoverDetails from './components/OrderDetail/HandoverDetails';

const OrderDetailsDummy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const { data, isLoading } = useGetOrderDetailsQuery(id);
  
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyDeliveryOtpMutation();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendDeliveryOtpMutation();
  const [rollbackDelivery] = useRollbackDeliveryMutation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const order = data?.order;
  const transaction = data?.transaction;

  const handleFullCancel = async () => {
    if (window.confirm("CRITICAL: Cancel entire order? This stops all fulfillment and voids security codes.")) {
      try {
        await cancelOrder(id).unwrap();
        alert("Order and all items voided.");
      } catch (err) {
        alert(err.data?.message || "Cancellation failed");
      }
    }
  };

  const handleGenerateOtp = async () => {
    try {
      await sendOtp(id).unwrap();
      setIsOtpSent(true);
    // eslint-disable-next-line no-unused-vars
    } catch (err) { alert("Failed to dispatch security code."); }
  };

  const handleVerifyDelivery = async () => {
    try {
      await verifyOtp({ id, otp }).unwrap();
      alert("Verification successful.");
      setOtp('');
      setIsOtpSent(false);
    } catch (err) { alert(err.data?.message || "Invalid Code"); }
  };

  if (isLoading) return <div className="p-20 text-center animate-pulse font-black uppercase tracking-[0.3em] text-slate-400 text-xs">Accessing Secure Ledger...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 px-4">
      <div className="flex justify-between items-end">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-amber-600 transition-colors mt-10">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Return to Ledger
        </button>
        
        {order?.orderStatus === 'Processing' && (
          <button 
            onClick={handleFullCancel}
            disabled={isCancelling}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            <Ban size={14} /> Cancel Full Order
          </button>
        )}
      </div>

      <OrderHeader order={order} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <HandoverDetails order={order}/>
          {/* CRITICAL: Passing orderId as 'id' to ItemList */}
          <ItemList items={order?.items} orderId={id} /> 
          
          <VerificationCard 
            status={order?.orderStatus} 
            isOtpSent={isOtpSent}
            isSendingOtp={isSendingOtp}
            isVerifying={isVerifying}
            otp={otp}
            setOtp={setOtp}
            onGenerate={handleGenerateOtp}
            onVerify={handleVerifyDelivery}
            recipientEmail={order?.recipient.email}
            onRollback={() => rollbackDelivery(id)}
          />
        </div>

        <div className="space-y-8">
          <DestinationCard recipient={order?.recipient} address={order?.shippingAddress} />
          <BuyerCard user={order?.user} />
        </div>
      </div>
      <SettlementCard order={order} transaction={transaction} />
    </div>
  );
};

export default OrderDetailsDummy;