/* eslint-disable no-unused-vars */
import { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Search, ShoppingBag, User, Menu, Heart, 
  Package, MapPin, Settings, LogOut, ShieldCheck, 
  LifeBuoy, X, ChevronRight
} from 'lucide-react';

// Slices & Constants
import { BRAND_NAME } from '../utils/constants';
import { logout } from '../app/userSlice';
import { clearCart } from '../app/cartSlice.js';
import { useLogoutUserMutation } from '../app/features/api/userApiSlice.js';
import { apiSlice } from '../app/features/api/apiSlice.js';
import SearchModal from './SearchModal.jsx';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoutApi] = useLogoutUserMutation();

  const user = useSelector((state) => state.auth.user);
  const totalQuantity = useSelector((state) => state.cart?.totalQuantity || 0);

  const userInitial = useMemo(() => {
    if (!user) return null;
    return (user.name || user.email || "?").charAt(0).toUpperCase();
  }, [user]);

  const currentSort = searchParams.get('sort');

  const navLinks = [
    { 
      name: 'Collections', 
      path: '/products', 
      isActive: location.pathname === '/products' && !currentSort 
    },
    { 
      name: 'Top Selling', 
      path: '/products?sort=totalSales', 
      isActive: currentSort === 'totalSales' 
    },
    { 
      name: 'Top Rated', 
      path: '/products?sort=rating', 
      isActive: currentSort === 'rating' 
    }
  ];

  const categories = [
    { name: 'Men', path: '/products?gender=Men' },
    { name: 'Women', path: '/products?gender=Women' },
    { name: 'Unisex', path: '/products?gender=Unisex' },
    { name: 'Kids', path: '/products?gender=Kids' },
  ];

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(apiSlice.util.resetApiState());
      dispatch(clearCart()); 
      dispatch(logout());
      setIsProfileOpen(false);
      navigate('/', { replace: true });
    } catch (error) {
      dispatch(apiSlice.util.resetApiState());
      dispatch(clearCart());
      dispatch(logout());
      navigate('/');
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-[100] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="sm:hidden p-2 text-gray-600 hover:text-black transition-colors"
            >
              <Menu size={24} />
            </button>

            <Link to="/" className="text-xl font-light tracking-[0.3em] text-gray-900 transition-opacity hover:opacity-70">
              {BRAND_NAME}<span className="text-amber-600 font-bold">.</span>
            </Link>

            <div className="hidden sm:flex space-x-10 text-[10px] font-black uppercase tracking-[0.2em]">
              {navLinks.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className={`relative py-2 transition-all duration-300 ${
                    item.isActive ? 'text-black' : 'text-gray-400 hover:text-black'
                  }`}
                >
                  {item.name}
                  {item.isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-600 rounded-full animate-in fade-in zoom-in duration-500" />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-5 lg:space-x-7">
              <Search 
                onClick={() => setIsSearchOpen(true)} 
                className="h-5 w-5 text-gray-400 cursor-pointer hover:text-black transition-colors" 
              />
              <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
              
              <Link to="/profile/wishlist" className="relative group">
                <Heart className="h-5 w-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
              </Link>

              <Link to="/cart" className="relative group">
                <ShoppingBag className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-4.5 text-center">
                    {totalQuantity}
                  </span>
                )}
              </Link>

              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 hover:border-amber-500 transition-all bg-gray-50 overflow-hidden"
                >
                  {user ? (
                    <div className="bg-amber-600 w-full h-full flex items-center justify-center text-[10px] font-black text-white">
                      {userInitial}
                    </div>
                  ) : (
                    <User size={16} className="text-gray-400" />
                  )}
                </button>

                {isProfileOpen && (
                  <ProfileDropdown 
                    user={user} 
                    onClose={() => setIsProfileOpen(false)} 
                    onLogout={handleLogout} 
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE DRAWER SECTION (Moved outside <nav> to fix transparency) --- */}
      {/* Dark Overlay (Backdrop) */}
      <div 
        className={`fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm transition-opacity duration-300 sm:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* White Sliding Menu Container */}
      <div 
        className={`fixed inset-y-0 left-0 w-[300px] bg-white z-[120] shadow-2xl transition-transform duration-500 ease-in-out sm:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col bg-white">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <span className="text-xl font-light tracking-[0.2em]">{BRAND_NAME}<span className="text-amber-600 font-bold">.</span></span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="p-2 -mr-2 text-gray-400 hover:text-black transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-10">
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Collections</p>
              <div className="flex flex-col space-y-5">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex justify-between items-center text-[11px] font-bold uppercase tracking-[0.2em] text-gray-800 hover:text-amber-600 transition-colors"
                  >
                    {link.name} <ChevronRight size={14} className="text-gray-300" />
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Gender Categories</p>
              <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                {categories.map((cat) => (
                  <Link 
                    key={cat.name} 
                    to={cat.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-black"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="mt-auto border-t border-gray-100 pt-8 bg-white">
             {!user ? (
               <Link 
                 to="/auth" 
                 onClick={() => setIsMobileMenuOpen(false)}
                 className="flex items-center justify-center w-full py-4 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10"
               >
                 Sign In / Join Now
               </Link>
             ) : (
                <div className="flex items-center space-x-3 px-2">
                  <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-[10px] font-black text-white uppercase">
                    {userInitial}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900">{user.name}</p>
                    <button onClick={handleLogout} className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Logout</button>
                  </div>
                </div>
             )}
          </div>
        </div>
      </div>
    </>
  );
};

const ProfileDropdown = ({ user, onClose, onLogout }) => (
  <>
    <div className="fixed inset-0 z-40" onClick={onClose} />
    <div className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100 py-2 origin-top-right animate-in fade-in zoom-in duration-200">
      {user ? (
        <div className="flex flex-col">
          <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 mb-1">
            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center">
              <ShieldCheck size={10} className="mr-1"/> Verified Session
            </p>
            <p className="text-xs font-bold text-gray-900 truncate">{user.name || user.email}</p>
          </div>
          <MenuLink to="/profile/orders" icon={<Package size={14}/>} label="My Orders" onClick={onClose} />
          <MenuLink to="/profile/addresses" icon={<MapPin size={14}/>} label="Address Book" onClick={onClose} />
          <MenuLink to="/profile" icon={<Settings size={14}/>} label="Account Settings" onClick={onClose} />
          <MenuLink to="/profile/support" icon={<LifeBuoy size={14}/>} label="Support" onClick={onClose} />
          <div className="p-2 mt-1 border-t border-gray-100">
            <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest">
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-2">
          <Link to="/auth" onClick={onClose} className="flex items-center justify-center w-full py-4 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-amber-600 transition-colors">
            Login / Sign Up
          </Link>
        </div>
      )}
    </div>
  </>
);

const MenuLink = ({ to, icon, label, onClick }) => (
  <Link to={to} onClick={onClick} className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-black rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest">
    <span className="text-amber-600">{icon}</span>
    <span>{label}</span>
  </Link>
);

export default Navbar;