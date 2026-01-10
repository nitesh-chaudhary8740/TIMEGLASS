import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Loader2, AlertCircle } from 'lucide-react';
import { 
  useAddProductMutation, 
  useGetProductDetailsQuery, 
  useUpdateProductMutation 
} from '../features/api/productApi';

// Sub-components
import EditorHeader from './components/EditorHeader';
import MediaManager from './components/MediaManager';
import GeneralDetails from './components/GeneralDetails';
import TechnicalDetails from './components/TechnicalDetails'; // NEW
import LogisticsSidebar from './components/LogisticsSidebar';

const ProductEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: response, isLoading: isFetching } = useGetProductDetailsQuery(id, { 
    skip: !isEdit,
    refetchOnMountOrArgChange: true 
  });
  
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // 1. Full Schema State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    tier: 'Standard',
    gender: 'Men',
    movement: 'Analog',
    material: 'Stainless Steel',
    color: '',
    caseSize: '',
    waterResistance: '30m',
    stock: 0,
    status: 'Draft',
    warrantyValue: 2,
    warrantyUnit: 'Years',
    returnDays: 7,
    shippingType: 'Free',
    shippingCost: 0
  });

  const [previews, setPreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [defaultIndex, setDefaultIndex] = useState(0);

  // 2. Critical: Sync state when data is fetched (Solves the "empty form" issue)
  useEffect(() => {
    if (isEdit && response?.product) {
      const p = response.product;
      setFormData({
        name: p.name || '',
        price: p.price || '',
        description: p.description || '',
        tier: p.tier || 'Standard',
        gender: p.gender || 'Men',
        movement: p.movement || 'Analog',
        material: p.material || 'Stainless Steel',
        color: p.color || '',
        caseSize: p.caseSize || '',
        waterResistance: p.waterResistance || '30m',
        stock: p.stock || 0,
        status: p.status || 'Draft',
        warrantyValue: p.warranty?.value || 2,
        warrantyUnit: p.warranty?.unit || 'Years',
        returnDays: p.returnDays || 7,
        shippingType: p.shipping?.type || 'Free',
        shippingCost: p.shipping?.cost || 0
      });
      setPreviews(p.images || []);
      // Find index of defaultImage in the images array if it exists
      const dIndex = p.images.findIndex(img => img.url === p.defaultImage?.url);
      setDefaultIndex(dIndex !== -1 ? dIndex : 0);
    }
  }, [isEdit, response]);

  // Handlers (Keeping your logic intact)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      isNew: true,
      file: file
    }));
    setSelectedFiles(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const target = previews[index];
    if (target.isNew) {
      setSelectedFiles(prev => prev.filter(f => f !== target.file));
    }
    setPreviews(prev => prev.filter((_, i) => i !== index));
    if (defaultIndex === index) setDefaultIndex(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Map all fields including new schema fields
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    
    // Luxury: Handle Images
    selectedFiles.forEach(file => data.append('productImages', file)); // Matches backend array name
    
    const keptImages = previews.filter(p => !p.isNew);
    data.append('existingImages', JSON.stringify(keptImages));
    data.append('defaultImageIndex', defaultIndex);

    try {
      if (isEdit) {
        await updateProduct({ id, data }).unwrap();
      } else {
        await addProduct(data).unwrap();
      }
      navigate('/inventory');
    } catch (err) {
      console.error("Vault Submission Error:", err);
    }
  };

  if (isFetching) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-amber-600" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing with Vault...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 pt-8">
      <EditorHeader isEdit={isEdit} id={id} />
      
      <form key={id || 'new'} onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          
          <MediaManager 
            previews={previews} 
            defaultIndex={defaultIndex} 
            onImageChange={handleImageChange} 
            onRemove={removeImage} 
            onSetDefault={setDefaultIndex} 
          />

          <GeneralDetails 
            formData={formData} 
            setFormData={setFormData} 
          />

          {/* NEW SECTION: Schema Filtering Specs */}
          <TechnicalDetails 
            formData={formData} 
            setFormData={setFormData} 
          />
        </div>

        <div className="space-y-8">
          <LogisticsSidebar 
            formData={formData} 
            setFormData={setFormData} 
          />
          
          <button 
            type="submit" 
            disabled={isAdding || isUpdating} 
            className="w-full bg-slate-900 text-white py-8 rounded-[2.5rem] font-black uppercase tracking-[0.3em] hover:bg-amber-600 disabled:bg-slate-200 transition-all flex items-center justify-center space-x-4 shadow-xl"
          >
            {isAdding || isUpdating ? (
              <Loader2 className="animate-spin" />
            ) : (
              <><Save size={20} /><span>{isEdit ? 'Update Entry' : 'Save Entry'}</span></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditor;