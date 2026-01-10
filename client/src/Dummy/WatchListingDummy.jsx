import { Filter, SlidersHorizontal } from 'lucide-react';
import { WATCHES } from '../data/products'; // Use the array we defined earlier
import ProductCard from './ProductCard';

const WatchListingDummy = () => {
  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-light uppercase tracking-widest">All Watches</h1>
        <div className="flex space-x-4">
          <button className="flex items-center space-x-2 text-xs font-bold uppercase bg-gray-50 px-4 py-2 border">
            <Filter size={14}/> <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 text-xs font-bold uppercase bg-gray-50 px-4 py-2 border">
            <SlidersHorizontal size={14}/> <span>Sort By</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {WATCHES.map(watch => (
          <ProductCard key={watch.id} product={watch} />
        ))}
      </div>
    </div>
  );
};
export default WatchListingDummy