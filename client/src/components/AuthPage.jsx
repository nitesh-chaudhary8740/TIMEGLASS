// src/components/AuthPage.jsx
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, ArrowRight, ShieldCheck, Loader2, ChevronLeft, X } from 'lucide-react';

import { BRAND_NAME } from '../utils/constants';
import { syncWithDB } from '../app/cartSlice.js';
import { setCredentials } from '../app/userSlice';
import { useRequestOtpMutation, useVerifyOtpMutation, useGoogleLoginMutation } from '../app/features/api/userApiSlice.js';
import { useMergeCartMutation } from '../app/features/api/cartApiSlice.js';

const AuthPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const [step, setStep] = useState('identity'); 
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));

  const [requestOtp, { isLoading: isOtpLoading }] = useRequestOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();
  const [mergeCart] = useMergeCartMutation();

  const isGlobalLoading = isOtpLoading || isVerifying || isGoogleLoading;

  // The logic that bridges Guest Cart -> Database
// src/components/AuthPage.jsx

// ... existing imports

const finalizeLogin = async (userData) => {
  try {
    // 1. SET USER FIRST - This forces Navbar to show profile icon IMMEDIATELY
    dispatch(setCredentials(userData));

    // 2. Handle Cart Merge
    const localCartString = localStorage.getItem('tg_cart');
    const localData = localCartString ? JSON.parse(localCartString) : { items: [] };
    const guestItems = localData.items?.map(item => ({
      product: item._id,
      quantity: item.quantity
    })) || [];

    if (guestItems.length > 0) {
      const mergeResponse = await mergeCart(guestItems).unwrap();
      const finalItems = mergeResponse.cart || mergeResponse;
      
      // 3. Update Cart State - Navbar quantity & local storage update here
      dispatch(syncWithDB(finalItems));
      localStorage.removeItem('tg_cart');
    }

    // 4. Navigate - User is already "Authenticated" in Redux before this runs
    const dest = redirectTo === 'checkout' ? '/checkout' : '/';
    navigate(dest, { replace: true });

  } catch (err) {
    console.error("Login sync failed:", err);
    navigate('/', { replace: true });
  }
};

  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    try {
      await requestOtp({ email }).unwrap();
      setStep('otp');
    } catch (err) { console.error(err); }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await verifyOtp({ email, otp: otp.join('') }).unwrap();
      await finalizeLogin(res.data);
    } catch (err) { console.error(err); }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await googleLogin(response.credential).unwrap();
      await finalizeLogin(res.data);
    } catch (err) { console.error(err); }
  };

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 relative font-['Poppins']">
      <button onClick={() => navigate("/products")} className="absolute top-10 right-10 p-2 text-gray-400 hover:text-black transition-colors">
        <X size={24} />
      </button>

      <div className="w-full max-w-md">
        <header className="text-center mb-10">
          <h1 className="text-2xl font-light tracking-[0.4em] text-gray-900 uppercase mb-2">
            {BRAND_NAME}<span className="text-amber-600 font-bold">.</span>
          </h1>
          <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.3em]">Secure Access Portal</p>
        </header>

        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
          {step === 'identity' ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="mb-8">
                <h2 className="text-xl text-gray-900 font-semibold tracking-tight">Login or Sign Up</h2>
                <p className="text-gray-500 text-xs mt-1">Enter email for verification.</p>
              </div>
              
              <form onSubmit={handleRequestOtp} className="space-y-5">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="email" required placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-amber-600/50 transition-all"/>
                </div>
                <button type="submit" disabled={!email || isGlobalLoading}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center space-x-2 hover:bg-amber-600 disabled:bg-gray-200">
                  {isOtpLoading ? <Loader2 className="animate-spin" size={16}/> : <><span>Get Code</span> <ArrowRight size={14}/></>}
                </button>
              </form>

              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-gray-400 bg-white px-4"><span>OR</span></div>
              </div>

              <div className="flex justify-center">
                 <GoogleLogin onSuccess={handleGoogleSuccess} shape="pill" theme="outline" width="100%" />
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-2 duration-500">
              <button onClick={() => setStep('identity')} className="text-gray-400 hover:text-amber-600 flex items-center text-[9px] font-black uppercase tracking-widest mb-6">
                <ChevronLeft size={14} className="mr-1"/> Back
              </button>
              <div className="mb-8">
                <h2 className="text-xl text-gray-900 font-semibold tracking-tight">Verify Code</h2>
                <p className="text-gray-500 text-xs mt-1">Sent to <span className="text-gray-900 font-bold">{email}</span></p>
              </div>
              
              <div className="flex justify-between gap-2 mb-8">
                {otp.map((digit, index) => (
                  <input key={index} id={`otp-${index}`} type="text" maxLength="1" value={digit}
                    onChange={e => handleOtpChange(e.target.value, index)}
                    className="w-full h-14 bg-gray-50 border border-gray-100 rounded-xl text-center text-lg font-bold outline-none focus:border-amber-600 transition-all"/>
                ))}
              </div>

              <button onClick={handleVerifyOtp} disabled={otp.some(v => v === '') || isGlobalLoading}
                className="w-full bg-amber-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center space-x-2 hover:bg-amber-700">
                {isVerifying ? <Loader2 className="animate-spin" size={16}/> : <><span>Verify</span> <ShieldCheck size={14}/></>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;