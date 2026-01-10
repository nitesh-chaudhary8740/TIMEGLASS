import { Star, ShoppingBag, ArrowRight, Loader2, Heart } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../app/cartSlice.js';
import { 
  useGetWishlistQuery, 
  useToggleWishlistMutation 
} from '../app/features/api/wishlistApiSlice';
import { 
  useUpdateCartItemMutation, 
 
} from '../app/features/api/cartApiSlice.js';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
   const [updateCart, ] = useUpdateCartItemMutation();
  // State Selectors
  const { items: cartItems } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  
  // Wishlist Logic
  const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !user });
  const [toggleWishlist, { isLoading: isToggling }] = useToggleWishlistMutation();

  // Helper: Check if product is in Cart
  const isInCart = cartItems.some(item => item._id === product._id);

  // Helper: Check if product is in Wishlist (handles both populated objects and raw IDs)
  const isWishlisted = wishlistData?.wishlist?.some(item => 
    (item._id?.toString() || item.toString()) === product._id
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

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return navigate('/auth');

    try {
      await toggleWishlist(product._id).unwrap();
    } catch (err) {
      console.error("Wishlist sync failed:", err);
    }
  };

  return (
    <Link 
      to={`/product/${product._id}`} 
      className="group relative bg-white flex flex-col h-full border border-transparent hover:border-gray-100 transition-all duration-500 font-['Poppins',sans-serif]"
    >
      {/* --- WISHLIST BUTTON --- */}
      <button 
        disabled={isToggling}
        onClick={handleWishlistToggle}
        className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-all active:scale-90 disabled:opacity-50"
      >
        {isToggling ? (
          <Loader2 size={14} className="animate-spin text-gray-400" />
        ) : (
          <Heart 
            size={14} 
            className={`transition-all duration-300 ${isWishlisted ? "fill-red-500 text-red-500 scale-110" : "text-gray-400 hover:text-gray-600"}`} 
          />
        )}
      </button>

      {/* --- IMAGE SECTION --- */}
      <div className="aspect-[4/5] overflow-hidden bg-[#f9f9f9] relative p-6">
        <img 
          src={product?.defaultImage?.url || product?.images?.[0]?.url} 
          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-1000 group-hover:scale-110" 
          alt={product.name}
          loading="lazy"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute bottom-4 left-4 bg-white px-2 py-1 text-[8px] font-bold uppercase tracking-tighter text-red-500 border border-red-100">
            Low Stock: {product.stock}
          </span>
        )}
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="p-5 flex flex-col grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">
            {product.tier}
          </h3>
          
          {/* Rating Display */}
          <div className="flex items-center space-x-1 bg-gray-50 px-2 py-0.5 rounded-full">
            <span className="text-[10px] font-black text-gray-900">
              {product.rating?.toFixed(1) || "0.0"}
            </span>
            <Star size={8} className="fill-amber-500 text-amber-500" />
            <span className="text-[9px] text-gray-400">({product.numReviews || 0})</span>
          </div>
        </div>

        <h2 className="text-[12px] font-semibold text-[#222222] mb-3 line-clamp-2 h-9 leading-relaxed tracking-tight group-hover:text-amber-700 transition-colors">
          {product.name}
        </h2>

        <div className="mt-auto">
          <p className="text-lg font-black text-[#222222] mb-4">
            ₹{product.price.toLocaleString('en-IN')}
          </p>

          {/* --- ADD TO BAG BUTTON --- */}
          <button 
            onClick={handleCartAction}
            className={`w-full py-3.5 text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2 
            ${isInCart 
              ? 'bg-amber-600 text-white' 
              : 'bg-black text-white hover:bg-amber-700 active:bg-black'}`}
          >
            {isInCart ? (
              <><span>In Your Bag</span><ArrowRight size={12} /></>
            ) : (
              <><span>Add to Bag</span><ShoppingBag size={12} /></>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;