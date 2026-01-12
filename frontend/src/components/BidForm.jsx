import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBid } from '../store/slices/bidsSlice';
import toast from 'react-hot-toast';
import { FiMessageSquare, FiSend, FiZap } from 'react-icons/fi';

const BidForm = ({ gigId, onSuccess }) => {
  const [formData, setFormData] = useState({
    message: '',
    price: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.message.trim() || !formData.price) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await dispatch(
        createBid({
          gigId,
          message: formData.message,
          price: Number(formData.price),
        })
      ).unwrap();
      
      toast.success('Bid submitted successfully!');
      setFormData({ message: '', price: '' });
      if (onSuccess) onSuccess(result.bid);
    } catch (error) {
      toast.error(error || 'Failed to submit bid');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card border-2 border-primary-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex-center">
          <FiZap className="text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Submit Your Bid</h3>
          <p className="text-xs text-gray-500">Stand out with a competitive offer</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="form-label">Your Bid Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
            <input
              type="number"
              min="1"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="input-field pl-9"
              placeholder="5,000"
              required
            />
          </div>
        </div>

        <div>
          <label className="form-label flex items-center gap-2">
            <FiMessageSquare className="text-gray-400" />
            Your Proposal
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="input-field min-h-[120px] resize-none"
            placeholder="Describe why you're the best fit for this job..."
            required
          />
          <p className="text-xs text-gray-400 mt-2">Tip: Highlight your relevant experience and skills</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full flex-center gap-2 py-3"
        >
          {isSubmitting ? (
            <>
              <div className="spinner w-5 h-5" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <FiSend />
              <span>Submit Bid</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BidForm;
