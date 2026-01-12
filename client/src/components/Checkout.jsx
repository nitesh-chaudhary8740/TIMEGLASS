import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateOrderMutation } from '../app/features/api/orderApiSlice.js';
import { useClearCartMutation } from '../app/features/api/cartApiSlice.js'; // Ensure path is correct
import { clearCart } from '../app/cartSlice.js';
import { initializeRazorpayPayment } from '../utils/paymentHanlder.js';

// Sub-components
import AddressSection from './checkout-sub/AddressSection';
import AddressForm from './profile-comp/AddressForm';
import RecipientForm from './checkout-sub/RecipientForm';
import OrderSummary from './checkout-sub/OrderSummary';
import { User } from 'lucide-react';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { items, totalAmount } = useSelector(state => state.cart);
  
  const [createOrder, { isLoading: isSavingOrder }] = useCreateOrderMutation();
  const [clearCartApi] = useClearCartMutation();

  const [orderData, setOrderData] = useState({
    recipient: { 
      name: user?.name || '', 
      phone: '', 
      email: user?.email || '' 
    },
    shippingAddress: { 
      street: '', 
      city: '', 
      state: '', 
      postalCode: '' 
    },
    selectedAddressId: null
  });

  const [isManualAddress, setIsManualAddress] = useState(false);

  useEffect(() => {
    if (user?.addresses?.length > 0) {
      const primary = user.addresses.find(a => a.isDefault) || user.addresses[0];
      handleAddressSelect(primary);
    }
  }, [user]);

  const handleAddressSelect = (addr) => {
    setIsManualAddress(false);
    setOrderData(prev => ({
      ...prev,
      selectedAddressId: addr._id,
      shippingAddress: {
        street: addr.street,
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode
      }
    }));
  };

  const handleRecipientChange = (field, value) => {
    setOrderData(prev => ({
      ...prev,
      recipient: { ...prev.recipient, [field]: value }
    }));
  };

  const validation = useMemo(() => {
    const { name, phone, email } = orderData.recipient;
    const { street, postalCode } = orderData.shippingAddress;

    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const postalRegex = /^[1-9][0-9]{5}$/; 

    return {
      name: nameRegex.test(name.trim()),
      phone: phoneRegex.test(phone),
      email: emailRegex.test(email),
      address: street.length > 5,
      postal: postalRegex.test(postalCode),
      isValid: nameRegex.test(name.trim()) && phoneRegex.test(phone) && 
               emailRegex.test(email) && street.length > 5 && postalRegex.test(postalCode)
    };
  }, [orderData]);

  const handlePlaceOrder = async () => {
    if (!validation.isValid) return;

    // Trigger external payment logic
    await initializeRazorpayPayment({
      totalAmount,
      recipient: orderData.recipient,
      shippingAddress: orderData.shippingAddress,
      items,
      user,
      createOrder,
      clearCartApi,
      dispatch,
      navigate,
      clearCartLocal: clearCart
    });
  };
// 1. DATA GUARD: Check if profile is incomplete
  const isProfileIncomplete = !user?.name || !user?.phone;

  // 2. GUARD JSX: Render this instead of the checkout form if data is missing
  if (isProfileIncomplete) {
    return (
      <div className="pt-40 pb-20 max-w-xl mx-auto px-6 text-center">
        <div className="bg-amber-50 border border-amber-100 p-10 rounded-[40px] space-y-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <User size={30} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-light text-zinc-900">Complete Your Profile</h2>
            <p className="text-sm text-amber-800/70 leading-relaxed">
              To proceed with your order, we need your full name and contact number for delivery updates and payment security.
            </p>
          </div>

          <button 
            onClick={() => navigate('/profile', { state: { fromCheckout: true } })}
            className="w-full py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
          >
            Go to Profile Settings
          </button>
          
          <Link to="/cart" className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
            Back to Cart
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-8 space-y-12">
        <AddressSection 
          addresses={user?.addresses || []}
          selectedId={orderData.selectedAddressId}
          onSelect={handleAddressSelect}
          onManualMode={() => {
            setIsManualAddress(true);
            setOrderData(p => ({...p, selectedAddressId: 'manual'}));
          }}
        />

        {isManualAddress && (
          <div className="p-8 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/30">
            <h3 className="text-[10px] font-black uppercase mb-6 text-amber-600">Manual Entry</h3>
            <AddressForm onCancel={() => setIsManualAddress(false)} setOrderData={setOrderData}/>
          </div>
        )}

        <RecipientForm 
          data={orderData.recipient} 
          onChange={handleRecipientChange} 
          validation={validation} 
        />
      </div>

      <div className="lg:col-span-4">
        <OrderSummary 
          totalAmount={totalAmount}
          shippingFee={totalAmount > 2000 ? 0 : 150}
          onCheckout={handlePlaceOrder}
          isProcessing={isSavingOrder} // Connected to RTK state
          isValid={validation.isValid && items.length > 0}
        />
      </div>
    </div>
  );
};

export default Checkout;