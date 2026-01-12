import { FiUser, FiMessageSquare, FiCheck, FiX } from 'react-icons/fi';

const BidCard = ({ bid, onHire, isOwner, isHiring }) => {
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: 'badge-pending',
      hired: 'badge-hired',
      rejected: 'badge-rejected',
    };
    return statusMap[status] || 'badge-default';
  };

  return (
    <div className="card group hover:shadow-lg transition-all duration-300">
      <div className="flex-between mb-4">
        <div className="flex-gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex-center text-white font-bold text-lg">
            {bid.freelancerId?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{bid.freelancerId?.name}</h4>
            <p className="text-muted text-sm">{bid.freelancerId?.email}</p>
          </div>
        </div>
        <span className={`badge ${getStatusBadge(bid.status)}`}>
          {bid.status}
        </span>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-4 mb-4">
        <span className="text-sm text-gray-500">Bid Amount</span>
        <div className="text-price text-2xl">₹{bid.price?.toLocaleString()}</div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-white flex-center shadow-sm">
            <FiMessageSquare className="text-gray-500" />
          </div>
          <p className="text-body text-sm leading-relaxed flex-1">{bid.message}</p>
        </div>
      </div>

      {isOwner && bid.status === 'pending' && (
        <button
          onClick={() => onHire(bid._id)}
          disabled={isHiring}
          className="btn-success w-full flex-center gap-2"
        >
          {isHiring ? (
            <>
              <div className="spinner w-4 h-4" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <FiCheck />
              <span>Hire This Freelancer</span>
            </>
          )}
        </button>
      )}

      {bid.status === 'hired' && (
        <div className="bg-green-50 rounded-xl p-4 flex-center gap-2 text-green-600 font-semibold">
          <div className="w-6 h-6 rounded-full bg-green-500 flex-center">
            <FiCheck className="text-white text-sm" />
          </div>
          <span>Successfully Hired</span>
        </div>
      )}

      {bid.status === 'rejected' && (
        <div className="bg-red-50 rounded-xl p-4 flex-center gap-2 text-red-500">
          <FiX />
          <span className="text-sm">This bid was not selected</span>
        </div>
      )}
    </div>
  );
};

export default BidCard;
