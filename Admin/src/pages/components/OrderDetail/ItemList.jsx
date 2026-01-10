import React from 'react';
import { Package } from 'lucide-react';
import OrderItem from './OrderItem'; // Import the new sub-component

const ItemList = ({ items, orderId }) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
          <Package size={14} /> Shipping Manifest
        </h3>
      </div>
      
      <div className="space-y-6">
        {items?.map((item) => (
          <OrderItem 
            key={item._id} 
            item={item} 
            orderId={orderId} 
          />
        ))}
      </div>
      
    </div>
  );
};

export default ItemList;