import { CheckCircle2, Star, X, Loader2, Trash2, LogIn } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useCreateReviewMutation, 
  useUpdateReviewMutation, 
  useDeleteReviewMutation 
} from '../app/features/api/productApiSlice';
import { useSelector } from 'react-redux';

const RatingBar = ({ star, count, total }) => (
  <div className="flex items-center space-x-4 text-[11px]">
    <span className="w-2 font-bold">{star}</span>
    <div className="grow h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div 
        className="h-full bg-amber-500 transition-all duration-1000" 
        style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
      ></div>
    </div>
    <span className="w-4 text-gray-400 font-medium">{count}</span>
  </div>
);

const ReviewItem = ({ rating, comment, author, date }) => (
  <div className="border-b border-gray-50 pb-8">
    <div className="flex items-center space-x-1 mb-2">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={10} 
          className={`${i < rating ? 'fill-amber-500 text-amber-500' : 'text-gray-200'}`} 
        />
      ))}
    </div>
    <p className="text-sm text-gray-600 mb-4 italic">"{comment}"</p>
    <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
      <div className="flex items-center space-x-2">
        <CheckCircle2 size={12} className="text-emerald-600" />
        <span>Verified Owner: {author}</span>
      </div>
      <span>{new Date(date).toLocaleDateString()}</span>
    </div>
  </div>
);

const RatingReview = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  // RTK Query Hooks
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  // Check if current user has already left a review (Only if authenticated)
  const existingReview = isAuthenticated 
    ? product.reviews?.find(r => r.user === user?._id || r.user?._id === user?._id)
    : null;

  // Sync modal state / Reset on logout
  useEffect(() => {
    if (!isAuthenticated) {
      setRating(5);
      setComment('');
      setIsModalOpen(false);
    } else if (existingReview && isModalOpen) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    }
  }, [existingReview, isModalOpen, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (existingReview) {
        await updateReview({ productId: product._id, rating, comment }).unwrap();
      } else {
        await createReview({ productId: product._id, rating, comment }).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.data?.message || "Review submission failed");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to remove your testimonial from the vault?")) {
      try {
        await deleteReview(product._id).unwrap();
        setIsModalOpen(false);
        setComment('');
        setRating(5);
      } catch (err) {
        alert(err.data?.message || "Failed to delete review");
      }
    }
  };

  const total = product.numReviews || 0;
  const getCount = (s) => product.reviews?.filter(r => Math.round(r.rating) === s).length || 0;

  return (
    <section className="max-w-4xl">
      <div className="flex items-center space-x-4 mb-8">
        <h2 className="text-xl font-bold uppercase tracking-widest text-[#222222]">Reviews & Ratings</h2>
        <div className="h-px grow bg-gray-100"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <div className="text-center md:text-left border-r border-gray-100 pr-8">
          <h3 className="text-5xl font-black text-[#222222] mb-2">{product.rating?.toFixed(1) || '0.0'}</h3>
          <div className="flex justify-center md:justify-start mb-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={18} 
                className={`${i < Math.round(product.rating) ? 'fill-amber-500 text-amber-500' : 'text-gray-200'}`} 
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 font-medium">From {total} Verified Owners</p>
          
          {/* AUTHENTICATION GATED BUTTONS */}
          {!isAuthenticated ? (
             <button 
                onClick={() => navigate('/auth')}
                className="mt-6 w-full py-4 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition shadow-lg flex items-center justify-center gap-2"
             >
               <LogIn size={14} /> Login for Review
             </button>
          ) : (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-6 w-full py-4 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition shadow-lg"
            >
              {existingReview ? 'Edit Your Review' : 'Write A Review'}
            </button>
          )}
        </div>

        <div className="col-span-2 space-y-2.5 flex flex-col justify-center">
          {[5, 4, 3, 2, 1].map(s => (
            <RatingBar key={s} star={s} count={getCount(s)} total={total} />
          ))}
        </div>
      </div>

      <div className="space-y-10">
        {product.reviews?.length > 0 ? (
          product.reviews.map((rev) => (
            <ReviewItem 
              key={rev._id}
              rating={rev.rating}
              comment={rev.comment}
              author={rev.name}
              date={rev.createdAt}
            />
          ))
        ) : (
          <p className="text-center py-10 text-gray-400 text-xs uppercase tracking-widest font-bold bg-gray-50 rounded-3xl">
            No testimonials found in the vault yet.
          </p>
        )}
      </div>

      {/* --- Review Modal (Only renders if authenticated) --- */}
      {isModalOpen && isAuthenticated && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-light uppercase tracking-tight">
                {existingReview ? 'Update Testimonial' : 'Submit Review'}
              </h2>
              <div className="flex items-center space-x-3">
                {existingReview && (
                  <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  </button>
                )}
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none transition-transform active:scale-90">
                      <Star size={24} className={star <= rating ? "fill-amber-500 text-amber-500" : "text-gray-200"} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Testimonial</label>
                <textarea 
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-amber-500 h-32 outline-none resize-none"
                  placeholder="Describe your experience with this timepiece..."
                />
              </div>

              <button 
                type="submit"
                disabled={isCreating || isUpdating}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold uppercase text-[11px] tracking-widest hover:bg-amber-600 transition flex items-center justify-center space-x-2 shadow-xl shadow-black/10"
              >
                {(isCreating || isUpdating) ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <span>{existingReview ? 'Update in Vault' : 'Publish to Vault'}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default RatingReview;