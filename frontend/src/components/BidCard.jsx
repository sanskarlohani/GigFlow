import { FiUser, FiDollarSign, FiMessageSquare } from 'react-icons/fi';

const BidCard = ({ bid, onHire, isOwner, isHiring }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'hired':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="card border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <FiUser className="text-primary-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{bid.freelancerId?.name}</h4>
            <p className="text-sm text-gray-500">{bid.freelancerId?.email}</p>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(bid.status)}`}>
          {bid.status}
        </span>
      </div>

      <div className="flex items-center space-x-1 text-green-600 font-semibold mb-3">
        <FiDollarSign />
        <span>${bid.price}</span>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="flex items-start space-x-2">
          <FiMessageSquare className="text-gray-400 mt-1 flex-shrink-0" />
          <p className="text-gray-600 text-sm">{bid.message}</p>
        </div>
      </div>

      {isOwner && bid.status === 'pending' && (
        <button
          onClick={() => onHire(bid._id)}
          disabled={isHiring}
          className="btn-success w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isHiring ? 'Hiring...' : 'Hire This Freelancer'}
        </button>
      )}

      {bid.status === 'hired' && (
        <div className="text-center text-green-600 font-semibold">
          ✓ Hired
        </div>
      )}

      {bid.status === 'rejected' && (
        <div className="text-center text-red-500 text-sm">
          This bid was not selected
        </div>
      )}
    </div>
  );
};

export default BidCard;
