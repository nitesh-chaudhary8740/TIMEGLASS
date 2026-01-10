import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, HeartOff, X } from 'lucide-react';
import { useGetProductsQuery } from '../app/features/api/productApiSlice';
import ProductCard from './ProductCard';

const WatchListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const LIMIT = 12;
  const [skip, setSkip] = useState(0);

  // 1. READ STATE FROM URL (Single Source of Truth)
  const sort = searchParams.get('sort') || 'createdAt';
  const priceRange = Number(searchParams.get('maxPrice')) || 100000;
  const gender = searchParams.get('gender') ? searchParams.get('gender').split(',') : [];
  const movement = searchParams.get('movement') ? searchParams.get('movement').split(',') : [];

  // 2. API QUERY (reacts to URL changes)
  const { data, isLoading, isFetching } = useGetProductsQuery({
    limit: LIMIT,
    skip,
    gender: gender.join(','),
    movement: movement.join(','),
    maxPrice: priceRange,
    sort: sort
  });

  // 3. SYNC HANDLERS (Updates the Address Bar)
  const updateUrl = (key, value) => {
    setSearchParams((prev) => {
      if (value && value.length > 0) {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }
      return prev;
    });
    setSkip(0); // Reset pagination on any filter change
  };

  const toggleFilter = (item, currentArray, key) => {
    const newArray = currentArray.includes(item)
      ? currentArray.filter((i) => i !== item)
      : [...currentArray, item];
    updateUrl(key, newArray.join(','));
  };

  const handleLoadMore = () => setSkip((prev) => prev + LIMIT);

  if (isLoading && skip === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-amber-600 mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Syncing Vault</p>
      </div>
    );
  }

  return (
    <div className="pt-28 px-6 max-w-[1600px] mx-auto min-h-screen">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* SIDEBAR */}
        <aside className="w-full lg:w-64 shrink-0 space-y-12">
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 flex justify-between">
              Price Range <span className="text-amber-600 font-bold">₹{priceRange.toLocaleString()}</span>
            </h4>
            <input 
              type="range" min="1000" max="100000" step="1000"
              value={priceRange}
              onChange={(e) => updateUrl('maxPrice', e.target.value)}
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black"
            />
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-5">Gender</h4>
            {['Men', 'Women', 'Unisex', 'Kids'].map((g) => (
              <label key={g} className="flex items-center group cursor-pointer mb-3">
                <input 
                  type="checkbox" 
                  checked={gender.includes(g)}
                  onChange={() => toggleFilter(g, gender, 'gender')}
                  className="w-4 h-4 border-gray-300 rounded accent-black"
                />
                <span className={`ml-3 text-xs uppercase tracking-widest ${gender.includes(g) ? 'font-bold text-black' : 'text-gray-400 group-hover:text-black'}`}>
                  {g}
                </span>
              </label>
            ))}
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-5">Movement</h4>
            {['Analog', 'Digital', 'Automatic', 'Quartz'].map((m) => (
              <label key={m} className="flex items-center group cursor-pointer mb-3">
                <input 
                  type="checkbox" 
                  checked={movement.includes(m)}
                  onChange={() => toggleFilter(m, movement, 'movement')}
                  className="w-4 h-4 border-gray-300 rounded accent-black"
                />
                <span className={`ml-3 text-xs uppercase tracking-widest ${movement.includes(m) ? 'font-bold text-black' : 'text-gray-400 group-hover:text-black'}`}>
                  {m}
                </span>
              </label>
            ))}
          </div>
        </aside>

        {/* MAIN GRID */}
        <main className="grow">
          <div className="flex justify-between items-end mb-10 pb-6 border-b border-gray-100">
            <div>
              <h1 className="text-3xl font-light uppercase tracking-tighter text-gray-900">The Collections</h1>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] mt-1">
                {data?.totalProducts || 0} Timepieces Found
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sort By:</span>
              <select 
                value={sort}
                onChange={(e) => updateUrl('sort', e.target.value)}
                className="text-[10px] font-black uppercase tracking-widest bg-transparent border-none outline-none cursor-pointer focus:ring-0 pr-8"
              >
                <option value="createdAt">New Arrivals</option>
                <option value="totalSales">Top Selling</option>
                <option value="rating">Top Rated</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 mb-16">
            {data?.products?.map((watch) => (
              <ProductCard key={watch._id} product={watch} />
            ))}
          </div>

          {data?.hasMore && (
            <div className="flex justify-center pb-20">
              <button
                onClick={handleLoadMore}
                disabled={isFetching}
                className="px-12 py-4 border border-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all disabled:opacity-50"
              >
                {isFetching ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default WatchListing;