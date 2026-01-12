import React, { useState, useEffect } from 'react';
import { useAddAddressMutation, useUpdateAddressMutation } from '../../app/features/api/userApiSlice.js';
import { Loader2, MapPin, Navigation, CheckCircle2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../app/userSlice.js';


const AddressForm = ({ existingData, onCancel }) => {
const [addAddress ] = useAddAddressMutation();
  const [updateAddress, ] = useUpdateAddressMutation();
  // const { user } = useSelector(state => state.auth);
  const [status, setStatus] = useState({ loading: false, error: '', locating: false });
  const [areas, setAreas] = useState([]);
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    street: existingData?.street || '',
    city: existingData?.city || '',
    state: existingData?.state || '',
    postalCode: existingData?.postalCode || '',
    label: existingData?.label || 'Home',
    isDefault: existingData?.isDefault || false
  });

  // 1. Browser Geolocation (Free & No Packages)
  const handleLocate = () => {
    if (!navigator.geolocation) return setStatus({ ...status, error: "Browser doesn't support geolocation" });
    
    setStatus({ ...status, locating: true, error: '' });

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        // Reverse Geocode using OpenStreetMap (Free, No Key)
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const data = await res.json();
       
        const pin = data.address.postcode?.replace(/\s/g, '').substring(0, 6);
        
        setFormData(prev => ({
          ...prev,
          postalCode: pin || prev.postalCode,
          city: data.address.city || data.address.district || data.address.state_district || '',
          state: data.address.state || ''
        }));
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setStatus(prev => ({ ...prev, error: "Failed to fetch address from coordinates" }));
      } finally {
        setStatus(prev => ({ ...prev, locating: false }));
      }
    }, () => {
      setStatus({ ...status, locating: false, error: "Location access denied by user" });
    });
  };

  // 2. Pincode to Area Logic (Postalpincode.in - No Key)
  useEffect(() => {
    const getAreas = async () => {
      if (formData.postalCode.length === 6 && !status.locating) {
        setStatus(prev => ({ ...prev, loading: true }));
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${formData.postalCode}`);
          const data = await res.json();
          // console.log(data)
          if (data[0].Status === "Success") {
            setAreas(data[0].PostOffice);
            if (data[0].PostOffice.length === 1) {
              const po = data[0].PostOffice[0];
              setFormData(prev => ({ ...prev, city: po.District, state: po.State }));
            }
          }
        // eslint-disable-next-line no-unused-vars
        } catch (e) {
          setStatus(prev => ({ ...prev, error: "Pincode service unreachable" }));
        } finally {
          setStatus(prev => ({ ...prev, loading: false }));
        }
      }
    };
    getAreas();
  }, [formData.postalCode, status.locating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (existingData?._id) {
        await updateAddress({ addressId: existingData._id, data: formData }).unwrap();
      } else {
        // console.log(user,"user")
        await addAddress(formData).unwrap().then(addAddressData=>{
          dispatch(setCredentials(addAddressData.user))
        });
      //    setOrderData(prev => ({
      // ...prev,
      // selectedAddressId: addr._id,
      // shippingAddress: {
      //   street: addr.street,
      //   city: addr.city,
      //   state: addr.state,
      //   postalCode: addr.postalCode
      // }
    // }));
      }
      onCancel();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-4xl border border-gray-100 shadow-2xl shadow-gray-200/50 space-y-8">
      {/* Location Trigger */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-600 rounded-full text-white">
            <MapPin size={18} />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-amber-900">Precision Shipping</p>
            <p className="text-[10px] text-amber-700/70 font-medium">Use GPS for instant address mapping</p>
          </div>
        </div>
        <button 
          type="button" onClick={handleLocate} disabled={status.locating}
          className="w-full md:w-auto px-6 py-3 bg-white text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-amber-200 hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center space-x-2 shadow-sm"
        >
          {status.locating ? <Loader2 className="animate-spin" size={14} /> : <Navigation size={14} />}
          <span>{status.locating ? 'Locating...' : 'Auto-Detect Location'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pincode */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Pincode</label>
            <input 
              type="text" required maxLength="6" value={formData.postalCode}
              onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
              className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 ring-amber-500/20 transition-all outline-none font-bold"
            />
          </div>

          {/* Locality */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Locality / Area</label>
            <select 
              className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 ring-amber-500/20"
              onChange={(e) => {
                const area = areas.find(a => a.Name === e.target.value);
                if(area) setFormData({...formData, city: area.District, state: area.State});
              }}
            >
              <option value="">{areas.length > 0 ? 'Select Locality' : 'Enter Pincode'}</option>
              {areas.map((a, i) => <option key={i} value={a.Name}>{a.Name}</option>)}
            </select>
          </div>

          {/* Street */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Detailed Address (House/Street)</label>
            <input 
              type="text" required value={formData.street}
              onChange={(e) => setFormData({...formData, street: e.target.value})}
              className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 ring-amber-500/20"
            />
          </div>

          <ReadOnlyField label="City" value={formData.city} />
          <ReadOnlyField label="State" value={formData.state} />
        </div>

        {status.error && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">! {status.error}</p>}

        <div className="flex items-center justify-between pt-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} className="w-4 h-4 accent-black" />
            <span className="text-[10px] font-bold uppercase text-gray-400">Set as Primary</span>
          </label>
          <div className="flex space-x-4">
            <button type="button" onClick={onCancel} className="text-[10px] font-black uppercase text-gray-300">Cancel</button>
            <button type="submit" className="bg-black text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl shadow-black/10">
              Save Destination
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const ReadOnlyField = ({ label, value }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">{label}</label>
    <div className="w-full bg-gray-50/50 rounded-xl p-4 text-sm text-gray-400 border border-gray-100 italic">
      {value || 'Auto-filled'}
    </div>
  </div>
);

export default AddressForm;