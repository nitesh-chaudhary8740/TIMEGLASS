import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EditorHeader = ({ isEdit, id }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center space-x-6 mb-10">
      <button 
        onClick={() => navigate('/inventory')} 
        className="group p-3 bg-white hover:bg-slate-900 rounded-2xl transition-all shadow-sm border border-slate-100"
      >
        <ArrowLeft size={20} className="text-slate-600 group-hover:text-white" />
      </button>
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
          {isEdit ? 'Refine Entry' : 'New Acquisition'}
        </h1>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
          {isEdit ? `Registry ID: #${id}` : 'TIMEGLASS Registry Console'}
        </p>
      </div>
    </div>
  );
};

export default EditorHeader;