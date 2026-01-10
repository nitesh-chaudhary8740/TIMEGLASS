import { useGetWishlistQuery } from "../../app/features/api/wishlistApiSlice.js";
 // Adjust this path to your ProductCard location
import { Loader2, HeartOff } from "lucide-react";
import ProductCard from "../ProductCard.jsx";

const Wishlist = () => {
  // 1. Fetch the wishlist data
  const { data, isLoading, isError } = useGetWishlistQuery();

  const wishlistItems = data?.wishlist || [];

  // 2. Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-amber-600 mb-4" size={32} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
          Retrieving Your Collection
        </p>
      </div>
    );
  }

  // 3. Error State
  if (isError) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500 text-xs uppercase tracking-widest font-bold">
          Failed to load wishlist. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto px-6">
      <header className="mb-12">
        <h3 className="text-2xl font-light text-[#222222] uppercase tracking-[0.2em] mb-2">
          My Wishlist
        </h3>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          {wishlistItems.length} Curated Timepieces
        </p>
      </header>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlistItems.map((product) => (
            // We pass the product object to ProductCard just like in the Shop/Home page
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        // 4. Empty State
        <div className="flex flex-col items-center justify-center py-32 border border-dashed border-gray-200 rounded-[2rem] bg-gray-50/50">
          <HeartOff size={40} className="text-gray-300 mb-4 stroke-[1px]" />
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.2em]">
            Your vault is currently empty
          </p>
          <button 
            onClick={() => window.history.back()}
            className="mt-6 text-[10px] font-black uppercase tracking-widest text-amber-600 hover:text-amber-700 transition-colors"
          >
            Explore Collection
          </button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;