import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ShieldCheck, Truck, RotateCcw, Star, 
  Loader, ShoppingBag, ArrowLeft, 
  Clock, HardDrive, Maximize, Droplets, Heart // Added Heart
} from 'lucide-react';

// State & API
import { addToCart } from "../app/cartSlice.js";
import { useGetProductDetailsQuery } from '../app/features/api/productApiSlice';
import { useUpdateCartItemMutation } from '../app/features/api/cartApiSlice';
// Added Wishlist hooks
import { useGetWishlistQuery, useToggleWishlistMutation } from '../app/features/api/wishlistApiSlice';

// Components
import RatingReview from './RatingReview.jsx';

// --- Sub-components (Moved up to prevent ReferenceErrors) ---

const SpecItem = ({ icon: Icon, label, value }) => (
  <div className="space-y-1">
    <div className="flex items-center space-x-2">
      {Icon && <Icon size={12} className="text-amber-600" />}
      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{label}</p>
    </div>
    <p className="text-[12px] font-bold text-gray-900">{value || '---'}</p>
  </div>
);

// eslint-disable-next-line no-unused-vars
const FeatureBadge = ({ Icon, label }) => (
  <div className="flex flex-col items-center text-center space-y-2 group">
    <div className="p-3 rounded-full bg-gray-50 group-hover:bg-amber-50 transition-colors">
      <Icon size={20} className="text-gray-400 group-hover:text-amber-600 transition-colors" />
    </div>
    <span className="text-[8px] uppercase font-black tracking-widest text-gray-400 group-hover:text-gray-900">
      {label}
    </span>
  </div>
);

const LoadingState = () => (
  <div className="h-screen flex flex-col items-center justify-center space-y-4">
    <Loader className="animate-spin text-amber-600" size={32} />
    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Consulting Registry</p>
  </div>
);

const ErrorState = ({ onBack }) => (
  <div className="min-h-screen flex items-center justify-center px-6">
    <div className="text-center max-w-sm">
      <h2 className="text-2xl font-light tracking-tight text-gray-900 mb-4">Registry Error</h2>
      <p className="text-gray-500 text-xs leading-relaxed mb-8">This timepiece is currently unavailable in our archives.</p>
      <button onClick={onBack} className="w-full py-4 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl">
        Return to Boutique
      </button>
    </div>
  </div>
);

const WatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [selectedImg, setSelectedImg] = useState(0);

  const { user } = useSelector(state => state.auth);
  const { items: cartItems } = useSelector(state => state.cart);

  const { data, isLoading, error } = useGetProductDetailsQuery(id);
  const [updateCart, { isLoading: isSyncing }] = useUpdateCartItemMutation();

  // --- Wishlist Integration ---
  const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !user });
  const [toggleWishlist, { isLoading: isToggling }] = useToggleWishlistMutation();

  const product = data?.product;
  const isInCart = cartItems.some(item => item._id === product?._id);

  // Check if current product is in wishlist
  const isWishlisted = wishlistData?.wishlist?.some(item => 
    (item._id?.toString() || item.toString()) === product?._id
  );

// Inside handleCartAction:
const handleCartAction = async (e) => {
  if (e?.preventDefault) e.preventDefault();
  
  if (isInCart) return navigate('/cart');

  // 1. Local Update
  dispatch(addToCart(product));

  // 2. Database Update (Crucial step you were missing)
  if (user) {
    try {
      await updateCart({ productId: product._id, action: 'add' }).unwrap();
    } catch (err) {
      console.error("Failed to save to DB:", err);
    }
  }
};

  // Wishlist Action
  const handleWishlistToggle = async () => {
    if (!user) return navigate('/login');
    try {
      await toggleWishlist(product._id).unwrap();
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
    }
  };

  if (isLoading) return <LoadingState />;
  if (error || !product) return <ErrorState onBack={() => navigate('/')} />;

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6 font-['Poppins']">
      {/* Navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-amber-600 mb-8 transition-colors group"
      >
        <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
        
        {/* Gallery Section */}
        <section className="space-y-4">
          <div className="bg-[#fcfcfc] aspect-square flex items-center justify-center p-12 border border-gray-100 rounded-[3rem] overflow-hidden group relative">
            <img 
              src={product.images[selectedImg]?.url} 
              alt={product.name} 
              className="max-h-full w-auto object-contain transition-transform duration-1000 group-hover:scale-110"
            />
          </div>
          
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {product.images?.map((img, idx) => (
              <button 
                key={img._id || idx}
                onClick={() => setSelectedImg(idx)}
                className={`w-24 h-24 border-2 shrink-0 bg-gray-50 p-2 transition-all duration-300 rounded-2xl
                  ${selectedImg === idx ? 'border-amber-600 shadow-lg' : 'border-transparent hover:border-gray-200'}`}
              >
                <img src={img.url} className="w-full h-full object-contain" alt="Thumbnail" />
              </button>
            ))}
          </div>
        </section>

        {/* Info Section */}
        <section className="flex flex-col justify-center space-y-8">
          <header className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-amber-600 font-black uppercase tracking-[0.25em] text-[10px]">
                {product.tier} Archive
              </p>
              <div className="flex items-center space-x-2">
                {product.stock > 0 ? (
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    Available
                  </span>
                ) : (
                  <span className="text-[9px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full">
                    Vault Empty
                  </span>
                )}
              </div>
            </div>

            {/* Title Row with Wishlist Heart */}
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-4xl md:text-5xl font-light text-gray-900 leading-[1.1] uppercase tracking-tight">
                {product.name}
              </h1>
              <button 
                onClick={handleWishlistToggle}
                disabled={isToggling}
                className={`p-4 rounded-full border transition-all duration-300 shadow-sm ${
                  isWishlisted 
                  ? 'bg-red-50 border-red-100 text-red-500' 
                  : 'bg-white border-gray-100 text-gray-400 hover:text-gray-900'
                }`}
              >
                <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
              </button>
            </div>
            
            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center bg-gray-50 px-3 py-1 rounded-lg">
                <span className="text-sm font-bold text-gray-900 mr-1.5">{product.rating?.toFixed(1) || '0.0'}</span>
                <Star size={14} className="fill-amber-500 text-amber-500" />
              </div>
              <span className="text-gray-400 text-[11px] font-medium">
                {product.numReviews} Client Reviews
              </span>
            </div>
          </header>

          <div className="space-y-1">
            <p className="text-3xl font-black text-gray-900">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Global Shipping Included</p>
          </div>

          {/* Narrative & Technical Grid */}
          <article className="space-y-8">
            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Design Philosophy</h4>
              <p className="text-gray-600 text-sm leading-relaxed antialiased max-w-lg">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-12 p-6 bg-gray-50 rounded-3xl">
              <SpecItem icon={Clock} label="Movement" value={product.movement} />
              <SpecItem icon={HardDrive} label="Material" value={product.material} />
              <SpecItem icon={Maximize} label="Case Size" value={`${product.caseSize}mm`} />
              <SpecItem icon={Droplets} label="Resistance" value={product.waterResistance} />
              <SpecItem label="Gender" value={product.gender} />
              <SpecItem label="Color" value={product.color} />
            </div>
          </article>

          {/* Actions */}
          <div className="space-y-4 pt-4">
            <button 
              onClick={handleCartAction}
              disabled={product.stock === 0 || isSyncing}
              className={`w-full py-6 font-black uppercase tracking-[0.2em] transition-all text-[11px] flex items-center justify-center space-x-3 rounded-2xl
                ${isInCart 
                  ? 'bg-amber-600 text-white shadow-xl shadow-amber-600/20' 
                  : 'bg-gray-900 text-white hover:bg-black shadow-2xl shadow-black/10'
                } disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none`}
            >
              {isSyncing ? (
                <Loader className="animate-spin" size={16} />
              ) : (
                <>
                  <ShoppingBag size={16} />
                  <span>{product.stock === 0 ? 'Out of Stock' : isInCart ? 'View in Bag' : 'Acquire Timepiece'}</span>
                </>
              )}
            </button>
            
            {product.stock > 0 && product.stock < 5 && (
              <p className="text-red-600 text-[9px] font-black uppercase tracking-widest text-center animate-pulse">
                Scarce Item: Only {product.stock} pieces remaining in vault
              </p>
            )}
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-gray-100">
            <FeatureBadge Icon={ShieldCheck} label={`${product.warranty?.value}Y Warranty`} />
            <FeatureBadge 
              Icon={Truck} 
              label={product.shipping?.type === 'Free' ? 'Free Courier' : `Fixed Delivery`} 
            />
            <FeatureBadge Icon={RotateCcw} label={`${product.returnDays}D Return`} />
          </div>
        </section>
      </div>

      <hr className="my-20 border-gray-100" />
      
      {/* Review Section */}
      <RatingReview product={product} />
    </div>
  );
};

export default WatchDetails;