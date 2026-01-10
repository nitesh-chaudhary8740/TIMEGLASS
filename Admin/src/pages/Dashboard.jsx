import { TrendingUp, Users as UsersIcon, ShoppingCart, IndianRupee, AlertCircle, Loader2 } from 'lucide-react';
import { useAdminGetStatsQuery } from '../features/api/adminDataApi.js'; // Create this hook in your API slice
import DashboardSkeleton from './DashboardSkeleton.jsx';

const StatCard = ({ title, value, icon, color, isLoading }) => (
  <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{title}</p>
      {isLoading ? (
        <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-lg" />
      ) : (
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
      )}
    </div>
    <div className={`p-4 rounded-2xl ${color}`}>
      {icon}
    </div>
  </div>
);

const Dashboard = () => {
  // Use RTK Query to fetch real data
  const { data, isLoading, isError } = useAdminGetStatsQuery(undefined, {
    pollingInterval: 300000, 
  });

  const stats = data?.stats;
  console.log(stats)
  if (isLoading) return <DashboardSkeleton />;
  if (isError) return (
    <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl">
      <AlertCircle size={20} />
      <span className="font-bold text-xs uppercase tracking-widest">Failed to sync vault statistics</span>
    </div>
  );

  return (
    <div className="space-y-10 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`} 
          icon={<IndianRupee size={24} className="text-emerald-600"/>} 
          color="bg-emerald-50"
          isLoading={isLoading}
        />
        <StatCard 
          title="Orders" 
          value={stats?.totalOrders || 0} 
          icon={<ShoppingCart size={24} className="text-blue-600"/>} 
          color="bg-blue-50"
          isLoading={isLoading}
        />
        <StatCard 
          title="Active Users" 
          value={stats?.activeUsers || 0} 
          icon={<UsersIcon size={24} className="text-purple-600"/>} 
          color="bg-purple-50"
          isLoading={isLoading}
        />
        <StatCard 
          title="Growth" 
          value={stats?.growth || "0%"} 
          icon={<TrendingUp size={24} className="text-amber-600"/>} 
          color="bg-amber-50"
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Real-time Order Stream Placeholder */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-slate-800">
             <AlertCircle size={18} className="text-red-500"/>
             <span>High Priority Disputes</span>
          </h4>
          <div className="space-y-4">
              {/* You can map disputes from your API response here */}
              <div className="p-5 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700">Damaged Crystal - Rahul S.</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Order #TXN-9928</span>
                </div>
                <span className="text-[10px] font-black bg-red-500 text-white px-3 py-1.5 rounded-full tracking-widest uppercase shadow-lg shadow-red-200">Urgent</span>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;