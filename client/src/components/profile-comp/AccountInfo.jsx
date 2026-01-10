import React, { useState,} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdateProfileMutation } from '../../app/features/api/userApiSlice';
import { setCredentials } from '../../app/userSlice';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const AccountInfo = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(!user?.name); // Auto-edit if name is missing
 const [formData, setFormData] = useState({ 
  name: user?.name || '', 
  email: user?.email || '',
  phone: user?.phone || '' // Initialize phone
});
  
  const [updateProfile, { isLoading, isSuccess }] = useUpdateProfileMutation();
const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    // Send both name and phone to the mutation
    const res = await updateProfile({ 
      name: formData.name, 
      phone: formData.phone 
    }).unwrap();
    
    dispatch(setCredentials(res.user));
    setIsEditing(false);
  } catch (err) {
    console.error("Failed to update profile", err);
  }
};

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h3 className="text-xl font-light text-[#222222] uppercase tracking-widest">Account Details</h3>
          <div className="h-1 w-10 bg-amber-600 mt-2"></div>
        </div>
        {user?.name && (
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="text-[10px] font-bold uppercase tracking-widest text-amber-700 underline"
          >
            {isEditing ? 'Cancel' : 'Edit Details'}
          </button>
        )}
      </header>

      {!user?.name && (
        <div className="flex items-center p-4 mb-4 text-amber-800 rounded-lg bg-amber-50 border border-amber-100">
          <AlertCircle size={18} className="mr-2" />
          <p className="text-xs font-medium">Please complete your profile by adding your full name to proceed with orders.</p>
        </div>
      )}

      <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[9px] uppercase font-black text-gray-400 tracking-widest">Full Name</label>
          <input 
            type="text" 
            placeholder="e.g. Nitesh Chaudhary"
            disabled={!isEditing} 
            value={formData.name}
            maxLength={50}
            required
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className={`w-full border-b py-2 text-sm outline-none transition disabled:bg-transparent ${
              !user?.name ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200 focus:border-black'
            }`}
          />
        </div>
            <div className="space-y-2">
  <label className="text-[9px] uppercase font-black text-gray-400 tracking-widest">Mobile Number</label>
  <input 
    type="tel" 
    placeholder="10-digit mobile number"
    disabled={!isEditing} 
    value={formData.phone}
    maxLength={10}
    required
    onChange={(e) => setFormData({...formData, phone: e.target.value})}
    className={`w-full border-b py-2 text-sm outline-none transition disabled:bg-transparent ${
      !user?.phone ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200 focus:border-black'
    }`}
  />
</div>
        <div className="space-y-2">
          <label className="text-[9px] uppercase font-black text-gray-400 tracking-widest">Email Address (Verified)</label>
          <input 
            type="email" 
            disabled 
            value={formData.email} 
            className="w-full border-b border-gray-100 py-2 text-sm text-gray-400 cursor-not-allowed" 
          />
        </div>

        {isEditing && (
          <div className="md:col-span-2 flex items-center space-x-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-10 py-3 bg-[#222222] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition flex items-center"
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" size={14} /> : 'Save and Continue'}
            </button>
            {isSuccess && <span className="text-emerald-600 text-[10px] font-bold uppercase flex items-center"><CheckCircle2 size={14} className="mr-1"/> Updated</span>}
          </div>
        )}
      </form>
    </div>
  );
};

export default AccountInfo;