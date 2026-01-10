// src/components/Hero.jsx (Used in LandingPage)
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRAND_NAME, BRAND_TAGLINE } from '../utils/constants';

const Home = () => {
  return (
    <section className="relative h-[90vh] flex items-center bg-[#0a0a0a] overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2000" 
        className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105"
        alt={`${BRAND_NAME} Hero`}
      />
      <div className="relative max-w-7xl mx-auto px-8 w-full">
        <div className="max-w-2xl space-y-6">
          <h2 className="text-amber-500 font-bold tracking-[0.4em] uppercase text-xs">
            Introducing the Horizon collection
          </h2>
          <h1 className="text-6xl md:text-8xl font-extralight text-white leading-tight">
            {BRAND_NAME}
          </h1>
          <p className="text-gray-300 text-lg font-light italic tracking-wide">
            {BRAND_TAGLINE}
          </p>
          <div className="pt-4">
            <Link to="/products" className="inline-flex items-center space-x-4 bg-white text-black px-10 py-5 font-bold uppercase tracking-widest text-xs hover:bg-amber-600 hover:text-white transition-all group">
              <span>View Collections</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Home 