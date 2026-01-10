import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../app/features/api/orderApiSlice';
import { downloadInvoice } from '../utils/invoiceGenerator.js';
import { 
  CheckCircle, Download, ShoppingBag, Package, 
  Truck, User, ArrowLeft, Clock, MapPin, 
  ChevronRight, Calendar
} from 'lucide-react';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetOrderByIdQuery(orderId);
  const order = data?.order;

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-zinc-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">Verifying Shipment</p>
      </div>
    </div>
  );

  if (!order) return <div className="pt-40 text-center">Order not found.</div>;

  return (
    <div className="pt-32 pb-20 max-w-6xl mx-auto px-6 animate-in fade-in duration-700">
      
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-12">
        <button 
          onClick={() => navigate('/profile/orders')}
          className="flex items-center gap-2 text-zinc-400 hover:text-black transition-all group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Order History</span>
        </button>
        
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <Calendar size={12} />
          Placed on {new Date(order.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Confirmation Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6 text-green-500">
          <CheckCircle size={40} strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl font-light text-zinc-900 mb-2">Thank you for your order.</h1>
        <p className="text-sm text-zinc-500">We've sent a confirmation email to <span className="text-black font-medium">{order.recipient.email}</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Content: Items Tracking */}
        <div className="lg:col-span-8 space-y-10">
          
          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                <Package size={14} /> Item Tracking & Status
              </h3>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100">
                ID: {order._id}
              </span>
            </div>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="group relative bg-white rounded-[32px] border border-zinc-100 p-6 hover:shadow-2xl hover:border-zinc-200 transition-all duration-500">
                  <div className="flex flex-col sm:flex-row gap-8">
                    {/* Image Section */}
                    <div 
                      onClick={() => navigate(`/product/${item.product?._id || item.product}`)}
                      className="w-32 h-32 rounded-2xl overflow-hidden bg-zinc-50 flex-shrink-0 cursor-pointer relative"
                    >
                      <img src={item.product.defaultImage.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                    </div>

                    {/* Content Section */}
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                            item.status === 'Delivered' ? 'bg-green-50 text-green-600' : 
                            item.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {item.status || 'Processing'}
                          </span>
                          <p className="text-sm font-black text-zinc-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                        <h4 
                          onClick={() => navigate(`/product/${item.product?._id || item.product}`)}
                          className="text-lg font-medium text-zinc-900 cursor-pointer hover:text-amber-600 transition-colors inline-block"
                        >
                          {item.name}
                        </h4>
                        <p className="text-xs text-zinc-400 mt-1">Quantity: {item.quantity} units</p>
                      </div>

                      {/* Logistical Timeline Mini */}
                      <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-zinc-50">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                          <Clock size={12} className="text-zinc-300" /> Placed
                        </div>
                        {item.shippedAt && (
                          <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-900 uppercase tracking-widest">
                            <Truck size={12} className="text-amber-600" /> Shipped {new Date(item.shippedAt).toLocaleDateString()}
                          </div>
                        )}
                        {item.deliveredAt && (
                          <div className="flex items-center gap-1.5 text-[9px] font-bold text-green-600 uppercase tracking-widest">
                            <CheckCircle size={12} /> Delivered
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Delivery Logistics Details */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-[32px] bg-zinc-50/50 border border-zinc-100">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                <User size={14} /> Recipient Information
              </h4>
              <p className="font-bold text-zinc-900 mb-1">{order.recipient.name}</p>
              <p className="text-sm text-zinc-500 mb-4">{order.recipient.email}</p>
              <div className="inline-flex items-center px-3 py-1 bg-white border border-zinc-100 rounded-full text-[10px] font-bold text-zinc-600">
                {order.recipient.phone}
              </div>
            </div>

            <div className="p-8 rounded-[32px] bg-zinc-50/50 border border-zinc-100">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                <MapPin size={14} /> Delivery Address
              </h4>
              <p className="text-sm text-zinc-700 leading-relaxed font-medium">
                {order.shippingAddress.street},<br />
                {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                {order.shippingAddress.postalCode}
              </p>
            </div>
          </section>
        </div>

        {/* Sidebar: Financial Summary */}
        <aside className="lg:col-span-4">
          <div className="sticky top-32 p-8 rounded-[40px] border border-zinc-100 bg-white shadow-2xl shadow-zinc-200/50">
            <h3 className="text-sm font-black uppercase tracking-widest mb-8">Financial Summary</h3>
            
            <div className="space-y-4 mb-10">
              <div className="flex justify-between text-sm text-zinc-500">
                <span>Items Subtotal</span>
                <span>₹{order.itemsPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-500">
                <span>Shipping Fee</span>
                <span className={order.shippingPrice === 0 ? 'text-green-600 font-bold' : ''}>
                  {order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}
                </span>
              </div>
              <div className="pt-6 border-t border-zinc-100 flex justify-between items-end">
                <div>
                  <p className="text-[9px] font-black uppercase text-zinc-400 mb-1">Total Paid</p>
                  <p className="text-3xl font-light text-zinc-900 tracking-tighter">₹{order.totalAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                   <span className="text-[9px] font-black bg-zinc-900 text-white px-2 py-1 rounded-md">PREPAID</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => downloadInvoice(order)}
                className="w-full py-4 rounded-2xl bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all hover:scale-[1.02] active:scale-95"
              >
                <Download size={16} /> Download Official Invoice
              </button>
              <Link 
                to="/products"
                className="w-full py-4 rounded-2xl border border-zinc-200 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-50 transition-all"
              >
                Continue Shopping <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OrderSuccess;