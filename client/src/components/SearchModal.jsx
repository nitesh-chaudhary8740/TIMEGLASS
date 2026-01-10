import React, { useState } from 'react';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../app/features/api/productApiSlice';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data, isFetching } = useGetProductsQuery(
    { limit: 8, skip: 0, search: searchTerm },
    { skip: searchTerm.length < 2 }
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Background Overlay - starts below navbar */}
      <div 
        className="fixed inset-0 top-20 bg-black/20 z-[90] animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      {/* Main Search Panel - Solid White */}
      <div className="fixed top-20 left-0 w-full bg-white z-[100] border-b border-gray-200 shadow-2xl animate-in slide-in-from-top duration-300">
        <div className="max-w-7xl mx-auto">
          
          {/* Search Input Area */}
          <div className="flex items-center px-6 py-6 border-b border-gray-50">
            <Search className="text-gray-400 mr-4" size={20} />
            <input
              autoFocus
              type="text"
              placeholder="Search by model, series or style..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow text-lg font-medium tracking-tight outline-none placeholder:text-gray-300"
            />
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Results Area - Horizontal Scroll */}
          <div className="h-[400px] flex items-center overflow-hidden">
            {!searchTerm || searchTerm.length < 2 ? (
              <div className="w-full text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">
                  Enter at least 2 characters to search
                </p>
              </div>
            ) : isFetching ? (
              <div className="w-full flex justify-center">
                <Loader2 className="animate-spin text-amber-600" size={30} />
              </div>
            ) : data?.products?.length > 0 ? (
              <div className="flex items-center w-full">
                {/* Fixed Title on the left */}
                <div className="pl-12 pr-8 shrink-0 border-r border-gray-100">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 mb-1">
                    Results
                  </h3>
                  <p className="text-2xl font-light text-gray-900">{data.totalProducts}</p>
                </div>

                {/* Horizontal Track - Growing from left to right */}
                <div className="flex space-x-6 overflow-x-auto px-10 py-10 scrollbar-hide snap-x">
                  {data.products.map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      onClick={onClose}
                      className="flex-shrink-0 w-52 snap-start group"
                    >
                      <div className="aspect-square bg-gray-50 mb-4 overflow-hidden rounded-xl border border-gray-100">
                        <img
                          src={product.images[0]?.url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-800 truncate mb-1">
                        {product.name}
                      </h4>
                      <p className="text-gray-500 text-[10px] font-medium tracking-widest">
                        ₹{product.price.toLocaleString()}
                      </p>
                    </Link>
                  ))}
                  
                  {/* View All Link at the end */}
                  <Link 
                    to={`/products?search=${searchTerm}`}
                    onClick={onClose}
                    className="flex-shrink-0 w-52 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-xl hover:border-amber-500 hover:bg-amber-50/20 transition-all group"
                  >
                    <ArrowRight className="text-gray-300 group-hover:text-amber-600 mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-amber-600">
                      View All
                    </span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="w-full text-center">
                <p className="text-gray-400 text-xs italic font-medium">No results found for "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchModal;