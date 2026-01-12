import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createGig } from '../store/slices/gigsSlice';
import toast from 'react-hot-toast';
import { FiFileText, FiAlignLeft, FiArrowLeft, FiSend, FiZap } from 'react-icons/fi';

const CreateGig = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.gigs);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim() || !formData.budget) {
      toast.error('Please fill in all fields');
      return;
    }

    const result = await dispatch(
      createGig({
        title: formData.title,
        description: formData.description,
        budget: Number(formData.budget),
      })
    );

    if (createGig.fulfilled.match(result)) {
      toast.success('Gig posted successfully!');
      navigate('/my-gigs');
    } else {
      toast.error(result.payload || 'Failed to create gig');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-xl bg-gray-100 flex-center hover:bg-gray-200 transition-colors"
        >
          <FiArrowLeft className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Post a New Gig</h1>
          <p className="text-gray-500 text-sm">Fill in the details to attract the best talent</p>
        </div>
      </div>

      <div className="card">
        {/* Progress indicator */}
        <div className="flex items-center gap-3 mb-8 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex-center">
            <FiZap className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Quick Tip</p>
            <p className="text-sm text-gray-600">Detailed descriptions get 3x more bids!</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="form-label">Job Title</label>
            <div className="relative">
              <FiFileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field pl-11"
                placeholder="e.g., Build a React Dashboard"
                maxLength={100}
                required
              />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-xs text-gray-400">Make it clear and specific</p>
              <p className="text-xs text-gray-400">{formData.title.length}/100</p>
            </div>
          </div>

          <div>
            <label className="form-label">Job Description</label>
            <div className="relative">
              <FiAlignLeft className="absolute left-4 top-4 text-gray-400" />
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field pl-11 min-h-[180px] resize-none"
                placeholder="Describe the job in detail. Include requirements, deliverables, and any specific skills needed..."
                maxLength={2000}
                required
              />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-xs text-gray-400">Include requirements & deliverables</p>
              <p className="text-xs text-gray-400">{formData.description.length}/2000</p>
            </div>
          </div>

          <div>
            <label className="form-label">Budget</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
              <input
                type="number"
                min="1"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="input-field pl-9"
                placeholder="10,000"
                required
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">Set a competitive budget to attract quality freelancers</p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary flex-1 flex-center gap-2"
            >
              <FiArrowLeft />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 flex-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="spinner w-5 h-5" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <FiSend />
                  <span>Post Gig</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGig;
