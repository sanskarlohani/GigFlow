import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createGig } from '../store/slices/gigsSlice';
import toast from 'react-hot-toast';
import { FiFileText, FiDollarSign, FiAlignLeft } from 'react-icons/fi';

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
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Post a New Gig</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiFileText className="inline mr-1" />
              Job Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              placeholder="e.g., Build a React Dashboard"
              maxLength={100}
              required
            />
            <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiAlignLeft className="inline mr-1" />
              Job Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field min-h-[200px]"
              placeholder="Describe the job in detail. Include requirements, deliverables, and any specific skills needed..."
              maxLength={2000}
              required
            />
            <p className="text-xs text-gray-500 mt-1">{formData.description.length}/2000 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiDollarSign className="inline mr-1" />
              Budget ($)
            </label>
            <input
              type="number"
              min="1"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="input-field"
              placeholder="Enter your budget"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Posting...' : 'Post Gig'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGig;
