import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../app/cartSlice.js';
import { 
  useUpdateCartItemMutation, 
  useRemoveCartItemMutation 
} from '../app/features/api/cartApiSlice.js';
import { Trash2, Plus, Minus, ArrowRight, Loader2, ShoppingBag, ArrowLeft, Truck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Cart = () => {
  const { items = [], totalAmount = 0 } = useSelector((state) => state.cart || {});
  const { user } = useSelector((state) => state.auth || { user: null });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [updateItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
  const [removeItem, { isLoading: isRemoving }] = useRemoveCartItemMutation();

  // --- Shipping Configuration ---
  const SHIPPING_THRESHOLD = 2000;
  const SHIPPING_FEE = 149;
  const isFreeShipping = totalAmount >= SHIPPING_THRESHOLD;
  const shippingCharges = isFreeShipping ? 0 : SHIPPING_FEE;
  const finalTotal = totalAmount + shippingCharges;
  
  // const shippingProgress = Math.min((totalAmount / SHIPPING_THRESHOLD) * 100, 100);

  const handleQtyChange = async (item, action) => {
    if (action === 'inc') {
      dispatch(addToCart(item));
    } else {
      dispatch(removeFromCart({ id: item._id, deleteAll: false }));
    }

    if (user) {
      try {
        await updateItem({ productId: item._id, action }).unwrap();
      } catch (err) {
        console.error("Sync failed:", err);
      }
    }
  };

  const handleRemoveProduct = async (productId) => {
    dispatch(removeFromCart({ id: productId, deleteAll: true }));
    if (user) {
      try {
        await removeItem(productId).unwrap();
      } catch (err) {
        console.error("Remove failed:", err);
      }
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-40 pb-20 flex flex-col items-center justify-center space-y-6 px-6 text-center">
        <ShoppingBag size={48} strokeWidth={1} className="text-gray-200" />
        <h2 className="text-xl font-light uppercase tracking-widest text-gray-900">Your Bag is Empty</h2>
        <Link to="/products" className="px-10 py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-amber-600 transition-colors">
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 font-['Poppins']">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-gray-100 pb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-light uppercase tracking-widest text-gray-900">Your Bag</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {items.length} {items.length === 1 ? 'Product' : 'Products'} Selected
          </p>
        </div>
        
        {(isUpdating || isRemoving) && (
          <div className="flex items-center text-amber-600 text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-amber-50 rounded-md">
            <Loader2 size={14} className="animate-spin mr-2"/> Syncing Changes...
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-10">
          {/* Shipping Status Bar */}
          <div className="bg-[#fcfcfc] rounded-xl p-5 border border-gray-100">
            <div className="flex items-center justify-between ">
              <span className='text-4xl tracking-normal'>TIMEPICES</span>
              {/* <div className="flex items-center space-x-3">
                <Truck size={16} className={isFreeShipping ? "text-emerald-600" : "text-gray-400"} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {isFreeShipping 
                    ? "Free Shipping Applied" 
                    : `Add ₹${(SHIPPING_THRESHOLD - totalAmount).toLocaleString('en-IN')} for Free Shipping`}
                </span>
              </div> */}
            </div>
            {/* <div className="w-full bg-gray-100 h-1 rounded-full">
              <div 
                className="bg-black h-full transition-all duration-700 ease-in-out" 
                style={{ width: `${shippingProgress}%` }}
              />
            </div> */}
          </div>

          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center py-10 first:pt-0 group">
                <div className="w-28 h-36 bg-[#f9f9f9] shrink-0 rounded-xl overflow-hidden p-2 flex items-center justify-center">
                  <img src={item.defaultImage?.url || item.images?.[0]?.url} className="max-h-full w-auto object-contain group-hover:scale-105 transition-transform duration-500" alt={item.name} />
                </div>
                
                <div className="grow sm:ml-8 space-y-6 w-full pt-4 sm:pt-0">
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-widest text-gray-900 mb-1 leading-relaxed">{item.name}</h3>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">ID: {item._id?.slice(-6).toUpperCase()}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-start sm:space-x-12">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                      <button onClick={() => handleQtyChange(item, 'dec')} disabled={item.quantity <= 1 || isUpdating} className="p-3 transition-colors text-gray-400 hover:text-black disabled:opacity-20"><Minus size={11} /></button>
                      <span className="px-4 text-xs font-black tabular-nums">{item.quantity}</span>
                      <button onClick={() => handleQtyChange(item, 'inc')} disabled={isUpdating} className="p-3 text-gray-400 hover:text-black"><Plus size={11} /></button>
                    </div>
                    
                    <button onClick={() => handleRemoveProduct(item._id)} disabled={isRemoving} className="text-gray-300 hover:text-red-500 transition-all flex items-center space-x-1.5"><Trash2 size={14}/><span className="text-[9px] font-black uppercase tracking-widest">Remove</span></button>
                  </div>
                </div>

                <div className="text-right w-full sm:w-auto mt-4 sm:mt-0 flex sm:flex-col justify-between items-center sm:items-end">
                  <p className="font-black text-lg text-[#222222]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-gray-400 font-bold">₹{item.price?.toLocaleString('en-IN')} each</p>
                </div>
              </div>
            ))}
          </div>
          
          <Link to="/products" className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors pt-4">
            <ArrowLeft size={14} /> <span>Back to Store</span>
          </Link>
        </div>

        {/* Right: Summary */}
        <div className="lg:sticky lg:top-32 h-fit bg-gray-50 p-8 rounded-2xl space-y-8 border border-gray-100 shadow-sm">
          <div className="space-y-6">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold uppercase text-gray-600">
                <span>Subtotal</span>
                <span>₹{(totalAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between text-xs font-bold uppercase text-gray-600">
                <span>Shipping</span>
                <span className={isFreeShipping ? 'text-emerald-600' : ''}>
                  {isFreeShipping ? 'FREE' : `₹${SHIPPING_FEE}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between font-black text-2xl border-t border-gray-200 pt-8 text-[#222222]">
              <span className="uppercase tracking-tighter">Total</span>
              <span>₹{(finalTotal || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button 
            onClick={() => user ? navigate('/checkout') : navigate('/auth?redirect=checkout')}
            disabled={isUpdating || isRemoving}
            className="w-full flex justify-center items-center space-x-4 bg-black text-white py-5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-amber-600 transition-all disabled:bg-gray-200"
          >
            <span>{user ? 'Checkout Now' : 'Login to Checkout'}</span>
            <ArrowRight size={16} />
          </button>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center">
              All prices include GST
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;