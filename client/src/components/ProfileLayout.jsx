import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { 
  User, Package, MapPin, Heart, LogOut, 
  ShieldCheck, ChevronRight, LifeBuoy 
} from 'lucide-react';
import { logout } from '../app/userSlice.js';
import { useLogoutUserMutation } from '../app/features/api/userApiSlice.js';
import { clearCart } from '../app/cartSlice.js';

const ProfileLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutUserMutation();
  const { user } = useSelector((state) => state.auth || { user: null });

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      try {
        await logoutApi().unwrap();
        dispatch(clearCart());
        dispatch(logout());
        navigate('/');
      } catch (error) { 
        console.error(error); 
      }
    }
  };

  if (!user) {
    return (
      <div className="pt-40 text-center min-h-screen">
        <p className="text-zinc-400 mb-4 italic">Please login to continue.</p>
        <button 
          onClick={() => navigate('/login')}
          className="px-8 py-3 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full"
        >
          Login
        </button>
      </div>
    );
  }

  const menuItems = [
    { path: '/profile', label: 'Account Info', icon: User, end: true },
    { path: '/profile/orders', label: 'Order History', icon: Package },
    { path: '/profile/wishlist', label: 'My Wishlist', icon: Heart },
    { path: '/profile/addresses', label: 'Address Book', icon: MapPin },
    { path: '/profile/support', label: 'Service & Support', icon: LifeBuoy },
  ];

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6 font-['Poppins']">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        
        {/* STICKY SIDEBAR */}
        <aside className="w-full lg:w-80 lg:sticky lg:top-24">
          
          {/* User Header */}
          <div className="pb-8 mb-8 border-b border-zinc-100 flex items-center space-x-4">
            <div className="h-16 w-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-white text-xl font-light shadow-xl shadow-zinc-200">
              {user.name?.charAt(0) || user.email?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-medium text-zinc-900">{user.name || "Member"}</h2>
              <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest flex items-center mt-1">
                <ShieldCheck size={12} className="mr-1"/> Verified Account
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                end={item.end}
                className={({ isActive }) => `
                  w-full flex items-center justify-between px-6 py-4 transition-all duration-300 rounded-2xl group
                  ${isActive 
                    ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-200 translate-x-2' 
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}
                `}
              >
                {/* isActive is scoped inside the className function, so it works here */}
                <div className="flex items-center space-x-4">
                  <item.icon size={18} /> 
                  <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                </div>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </NavLink>
            ))}

            {/* Logout Button */}
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center space-x-4 px-6 py-4 text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 mt-8 rounded-2xl transition-all"
            >
              <LogOut size={18} /> 
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="grow w-full min-h-[600px] bg-white border border-zinc-100 rounded-[40px] p-4 md:p-10 shadow-sm animate-in fade-in slide-in-from-right-4 duration-700">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default ProfileLayout;