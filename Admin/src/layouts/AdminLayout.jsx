import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, PackagePlus, Box, 
  LifeBuoy, Users, LogOut, ShoppingBag, CreditCard 
} from 'lucide-react';
import { BRAND_NAME } from '../utils/constants';
import { adminAuthApi, useAdminLogoutMutation } from '../features/api/adminAuthApi';
import { useDispatch } from 'react-redux';

const AdminLayout = () => {
  const [logout] = useAdminLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout().unwrap().then(() => {
        dispatch(adminAuthApi.util.resetApiState());
        navigate("/admin/login");
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  // Refined Menu Items
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18}/> },
    { name: 'Inventory', path: '/inventory', icon: <Box size={18}/> },
    { name: 'Add Product', path: '/add-product', icon: <PackagePlus size={18}/> },
    { name: 'Orders', path: '/orders', icon: <ShoppingBag size={18}/> }, // New: Shipping/Delivery management
    { name: 'Payments', path: '/transactions', icon: <CreditCard size={18}/> }, // New: Revenue/Gateway logs
    { name: 'Users List', path: '/users', icon: <Users size={18}/> },
    { name: 'Support Hub', path: '/support', icon: <LifeBuoy size={18}/> },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FC]">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-white flex flex-col border-r border-slate-800">
        <div className="p-8 border-b border-slate-900">
          <h1 className="text-xl font-light tracking-[0.3em] uppercase">
            {BRAND_NAME}<span className="text-amber-500 font-bold">.</span>
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Admin Domain</p>
        </div>
        
        <nav className="grow p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm ${
                  isActive 
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="font-medium tracking-wide">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-900">
          <button 
            onClick={handleLogout}
            className="cursor-pointer flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform"/>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="grow flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10">
          <div className="flex flex-col">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Management / Portal</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">Super Admin</p>
              <div className="flex items-center justify-end space-x-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] text-green-600 font-bold uppercase">System Active</p>
              </div>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full border border-gray-200 flex items-center justify-center overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=Admin&background=0f172a&color=fff" alt="admin" />
            </div>
          </div>
        </header>

        <main className="grow overflow-y-auto p-10 bg-slate-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;