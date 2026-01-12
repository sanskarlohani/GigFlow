import { FiUser, FiMessageSquare } from 'react-icons/fi';

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
    <div className="card-bordered">
      <div className="flex-between mb-3">
        <div className="flex-gap-2">
          <div className="avatar-primary">
            <FiUser className="icon-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{bid.freelancerId?.name}</h4>
            <p className="text-muted">{bid.freelancerId?.email}</p>
          </div>
        </div>
        <span className={`badge ${getStatusBadge(bid.status)}`}>
          {bid.status}
        </span>
      </div>

      <div className="text-price mb-3">
        <span>₹{bid.price}</span>
      </div>

      <div className="info-box-gray mb-4">
        <div className="flex-start space-x-2">
          <FiMessageSquare className="icon-muted mt-1 flex-shrink-0" />
          <p className="text-body text-sm">{bid.message}</p>
        </div>
      </div>

      {isOwner && bid.status === 'pending' && (
        <button
          onClick={() => onHire(bid._id)}
          disabled={isHiring}
          className="btn-success w-full btn-disabled"
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
