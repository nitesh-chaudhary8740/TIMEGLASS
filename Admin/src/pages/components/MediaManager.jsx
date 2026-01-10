import { Upload, Star, X } from 'lucide-react';

const MediaManager = ({ previews, defaultIndex, onImageChange, onRemove, onSetDefault }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-50 rounded-lg"><Upload size={18} className="text-amber-600" /></div>
          <h3 className="font-black uppercase tracking-tighter text-sm text-slate-800">Visual Assets</h3>
        </div>
        <label className="cursor-pointer bg-slate-900 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest">
          Upload Media
          <input type="file" multiple className="hidden" onChange={onImageChange} accept="image/*" />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {previews.map((src, index) => (
          <div key={index} className={`relative group aspect-4/5 rounded-3xl overflow-hidden border-2 transition-all duration-500 ${defaultIndex === index ? 'border-amber-500 ring-4 ring-amber-500/10' : 'border-slate-50'}`}>
            <img src={typeof src === 'string' ? src : src.url} className="w-full h-full object-cover" alt="preview" />
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
              <button type="button" onClick={() => onSetDefault(index)} className="p-3 bg-white rounded-2xl text-amber-600 hover:scale-110 shadow-xl">
                <Star size={18} fill={defaultIndex === index ? "currentColor" : "none"} />
              </button>
              <button type="button" onClick={() => onRemove(index)} className="p-3 bg-white rounded-2xl text-red-600 hover:scale-110 shadow-xl">
                <X size={18} />
              </button>
            </div>
            {defaultIndex === index && (
              <div className="absolute top-3 left-3 bg-amber-500 text-[7px] text-white px-3 py-1 rounded-full font-black tracking-widest shadow-lg">COVER</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaManager;