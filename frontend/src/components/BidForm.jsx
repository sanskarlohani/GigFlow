import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBid } from '../store/slices/bidsSlice';
import toast from 'react-hot-toast';
import { FiMessageSquare } from 'react-icons/fi';

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
    <form onSubmit={handleSubmit} className="card-primary">
      <h3 className="card-title mb-4">Submit Your Bid</h3>
      
      <div className="form-group">
        <label className="form-label">Your Price (₹)</label>
        <input
          type="number"
          min="1"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="input-field"
          placeholder="Enter your bid amount"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          <FiMessageSquare className="inline mr-1" />
          Your Proposal
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="textarea-field"
          placeholder="Describe why you're the best fit for this job..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full btn-disabled"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Bid'}
      </button>
    </form>
  );
};

export default BidForm;
