import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, MapPin, Trash2, Edit2, Home, Briefcase, Navigation, CheckCircle2, Globe } from 'lucide-react';
import { useDeleteAddressMutation, useUpdateAddressMutation } from '../../app/features/api/userApiSlice.js';
import AddressForm from './AddressForm.jsx';
import { setCredentials } from '../../app/userSlice.js';

const AddressBook = () => {
  const { user } = useSelector((state) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch()
  const [editingAddress, setEditingAddress] = useState(null);
  
  const [deleteAddress] = useDeleteAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();

  const addresses = user?.addresses || [];

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = async (addressId) => {
    if (window.confirm("Are you sure you want to remove this address?")) {
      try {
        await deleteAddress(addressId).unwrap().then(addAddressData=>{
                  dispatch(setCredentials(addAddressData.user))
                });;
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await updateAddress({ addressId, data: { isDefault: true } }).unwrap();
    } catch (err) {
      console.error("Failed to update default address:", err);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-light text-[#222222] uppercase tracking-[0.2em]">
            {showForm ? (editingAddress ? 'Modify Address' : 'New Location') : 'Address Book'}
          </h3>
          <div className="h-1 w-10 bg-amber-600 mt-2"></div>
        </div>
        
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-[#222222] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg"
          >
            <Plus size={14} />
            <span>Add New Address</span>
          </button>
        )}
      </header>

      {showForm ? (
        <AddressForm
    // THIS KEY IS THE SECRET SAUCE
    key={editingAddress?._id || 'new-address-form'} 
    existingData={editingAddress} 
    onCancel={() => {
      setShowForm(false);
      setEditingAddress(null);
    }} 
  />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.length === 0 ? (
            <div className="md:col-span-2 py-24 border border-dashed border-gray-200 rounded-3xl text-center">
              <MapPin className="text-gray-200 mx-auto mb-4" size={40} />
              <p className="text-gray-400 text-[10px] uppercase font-black tracking-[0.3em]">No Saved Destinations</p>
              <button onClick={() => setShowForm(true)} className="mt-4 text-amber-700 text-[10px] font-bold uppercase border-b border-amber-700">Add First Address</button>
            </div>
          ) : (
            addresses.map((addr) => (
              <AddressCard 
                key={addr._id} 
                address={addr} 
                onEdit={() => handleEdit(addr)} 
                onDelete={() => handleDelete(addr._id)}
                onSetDefault={() => handleSetDefault(addr._id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => (
  <div className={`group relative p-8 border transition-all duration-500 rounded-2xl ${address.isDefault ? 'border-amber-600 bg-amber-50/20' : 'border-gray-100 hover:border-gray-200'}`}>
    
    {address.isDefault ? (
      <div className="absolute -top-3 left-6 px-4 py-1.5 bg-amber-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full flex items-center">
        <CheckCircle2 size={10} className="mr-1.5" /> Primary Address
      </div>
    ) : (
      <button 
        onClick={onSetDefault}
        className="absolute -top-3 left-6 px-4 py-1.5 bg-white border border-gray-200 text-gray-400 text-[8px] font-black uppercase tracking-widest rounded-full opacity-0 group-hover:opacity-100 hover:text-amber-600 hover:border-amber-600"
      >
        Set as Default
      </button>
    )}
    
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center space-x-2.5">
        <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:text-amber-600">
          {address.label === 'Home' ? <Home size={16} /> : address.label === 'Work' ? <Briefcase size={16} /> : <Globe size={16} />}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{address.label}</span>
      </div>
      
      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-all">
        <button onClick={onEdit} className="p-2.5 hover:bg-white rounded-full text-gray-400 hover:text-amber-600 border border-transparent hover:border-gray-100 transition shadow-sm"><Edit2 size={14} /></button>
        <button onClick={onDelete} className="p-2.5 hover:bg-white rounded-full text-gray-400 hover:text-red-500 border border-transparent hover:border-gray-100 transition shadow-sm"><Trash2 size={14} /></button>
      </div>
    </div>

    <div className="space-y-2">
      <h4 className="text-sm font-bold text-[#222222] uppercase tracking-tight">{address.recipientName}</h4>
      <p className="text-[12px] text-gray-500 leading-[1.6] font-medium">
        {address.street}, <br />
        {address.city}, {address.state} — {address.postalCode}
      </p>
      <div className="pt-4 flex items-center text-[11px] font-bold text-gray-400 border-t border-gray-50 mt-4">
        <Navigation size={12} className="mr-2 text-amber-600" /> {address.phone}
      </div>
    </div>
  </div>
);

export default AddressBook;