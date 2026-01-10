// src/pages/ProductDetail.jsx
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from "../app/cartSlice.js"
import { WATCHES } from '../data/products.js';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const WatchDetailsDummy = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  // Find the product based on URL ID
  const product = WATCHES.find(w => w.id === parseInt(id));

  if (!product) return <div className="pt-40 text-center">Product not found</div>;

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Image Gallery */}
        <div className="bg-gray-50 flex items-center justify-center p-10">
          <img 
            src={product.image} 
            alt={product.name} 
            className="max-h-125 object-contain hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col justify-center space-y-6">
          <p className="text-amber-600 font-bold uppercase tracking-[0.2em] text-xs">{product.category}</p>
          <h1 className="text-4xl font-light text-gray-900">{product.name}</h1>
          <p className="text-2xl font-medium">₹{product.price.toLocaleString('en-IN')}</p>
          <p className="text-gray-600 leading-relaxed border-b pb-6">
            A masterpiece of precision and style. This timepiece features a premium build, 
            water resistance up to 5 ATM, and a scratch-resistant sapphire crystal.
          </p>

          <div className="flex space-x-4">
            <button 
              onClick={() => dispatch(addToCart(product))}
              className="flex-1 bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-amber-700 transition"
            >
              Add to Bag
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t">
            <div className="flex flex-col items-center text-center space-y-2">
              <ShieldCheck size={20} className="text-gray-400" />
              <span className="text-[10px] uppercase font-bold">2 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <Truck size={20} className="text-gray-400" />
              <span className="text-[10px] uppercase font-bold">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <RotateCcw size={20} className="text-gray-400" />
              <span className="text-[10px] uppercase font-bold">7 Day Return</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchDetailsDummy;