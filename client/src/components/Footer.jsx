// src/components/Footer.jsx
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { BRAND_NAME } from '../utils/constants';

const Footer = () => {
  return (
    <footer className="bg-white text-black py-20 px-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="space-y-6">
          <h2 className="text-xl font-light tracking-[0.3em]">{BRAND_NAME}</h2>
          <p className="text-gray-500 text-sm leading-relaxed font-light">
            Defining the future of horology with transparency and precision. Every {BRAND_NAME} timepiece is a testament to the art of time.
          </p>
        </div>
        
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Navigation</h4>
          <ul className="space-y-4 text-xs text-gray-400 uppercase tracking-widest">
            <li className="hover:text-black cursor-pointer transition">All Watches</li>
            <li className="hover:text-black cursor-pointer transition">Store Locator</li>
            <li className="hover:text-black cursor-pointer transition">The Journal</li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Legal</h4>
          <ul className="space-y-4 text-xs text-gray-400 uppercase tracking-widest">
            <li className="hover:text-black cursor-pointer transition">Privacy Policy</li>
            <li className="hover:text-black cursor-pointer transition">Terms of Sale</li>
            <li className="hover:text-black cursor-pointer transition">Warranty</li>
          </ul>
        </div>

        <div className="space-y-8">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Follow Us</h4>
          <div className="flex space-x-6 text-gray-400">
            <Instagram size={18} className="hover:text-black cursor-pointer" />
            <Facebook size={18} className="hover:text-black cursor-pointer" />
            <Twitter size={18} className="hover:text-black cursor-pointer" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-50 text-center text-[9px] text-gray-400 tracking-[0.3em] uppercase">
        © 2025 {BRAND_NAME} STUDIOS. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
};
export default Footer