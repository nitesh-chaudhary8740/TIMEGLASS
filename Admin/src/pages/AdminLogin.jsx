import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdminLoginMutation, useGetAdminProfileQuery } from '../features/api/adminAuthApi';
// Added Eye and EyeOff from lucide-react
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@service.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false); // State for toggle
  const [errorMsg, setErrorMsg] = useState(''); // State for UI errors

  const [login, { isLoading }] = useAdminLoginMutation();
  const {data:authData,isLoading:authLoading}=useGetAdminProfileQuery()
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(''); // Reset error
    try {
      await login({ email, password }).unwrap();
      navigate('/'); 
    } catch (err) {
      setErrorMsg(err?.data?.message || "Invalid credentials. Please try again.");
    }
  };
if (authData?.loginState && !authLoading) return <Navigate to={"/"} replace/>
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-[40px] shadow-xl border border-slate-100">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 italic">TIMEGLASS</h1>
          <p className="text-slate-500 mt-2 font-medium uppercase text-xs tracking-[0.2em]">Management Portal</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium border border-red-100 animate-pulse">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
              <input 
                type="email" required placeholder="Admin Email"
                className="w-full pl-12 p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field with Toggle */}
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                placeholder="Password"
                className="w-full pl-12 pr-12 p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-amber-600 disabled:bg-slate-300 transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><span>Enter Portal</span> <ArrowRight size={18} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;