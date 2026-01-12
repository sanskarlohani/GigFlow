import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyBids } from '../store/slices/bidsSlice';
import { FiFileText, FiExternalLink, FiClock, FiCheck, FiX, FiMessageSquare, FiArrowRight } from 'react-icons/fi';

const MyBids = () => {
  const dispatch = useDispatch();
  const { myBids, isLoading } = useSelector((state) => state.bids);

  useEffect(() => {
    dispatch(fetchMyBids());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: 'badge-pending',
      hired: 'badge-hired',
      rejected: 'badge-rejected',
    };
    return statusMap[status] || 'badge-default';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FiClock className="text-yellow-500" />;
      case 'hired': return <FiCheck className="text-green-500" />;
      case 'rejected': return <FiX className="text-red-500" />;
      default: return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const pendingBids = myBids.filter(b => b.status === 'pending');
  const hiredBids = myBids.filter(b => b.status === 'hired');
  const rejectedBids = myBids.filter(b => b.status === 'rejected');

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Bids</h1>
        <p className="text-gray-500 mt-1">Track the status of your submitted bids</p>
      </div>

      {/* Stats */}
      {myBids.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500 flex-center">
                <FiClock className="text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-yellow-700">{pendingBids.length}</p>
                <p className="text-xs text-yellow-600">Pending</p>
              </div>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500 flex-center">
                <FiCheck className="text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-green-700">{hiredBids.length}</p>
                <p className="text-xs text-green-600">Hired</p>
              </div>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-400 flex-center">
                <FiX className="text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-600">{rejectedBids.length}</p>
                <p className="text-xs text-gray-500">Not Selected</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex-center py-20">
          <div className="spinner" />
        </div>
      ) : myBids.length > 0 ? (
        <div className="space-y-4">
          {myBids.map((bid, index) => (
            <div 
              key={bid._id} 
              className="card group hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1">
                  {/* Status & Date Row */}
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className={`badge ${getStatusBadge(bid.status)} flex items-center gap-1`}>
                      {getStatusIcon(bid.status)}
                      {bid.status}
                    </span>
                    <span className="text-xs text-gray-400">Submitted {formatDate(bid.createdAt)}</span>
                  </div>

                  {/* Gig Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                    {bid.gigId?.title || 'Gig Deleted'}
                  </h3>
                  
                  {/* Price Comparison */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl px-4 py-2">
                      <p className="text-xs text-gray-500">Your Bid</p>
                      <p className="text-lg font-bold text-primary-600">₹{bid.price?.toLocaleString()}</p>
                    </div>
                    {bid.gigId?.budget && (
                      <div className="bg-gray-50 rounded-xl px-4 py-2">
                        <p className="text-xs text-gray-500">Gig Budget</p>
                        <p className="text-lg font-bold text-gray-700">₹{bid.gigId.budget?.toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex-center shadow-sm flex-shrink-0">
                        <FiMessageSquare className="text-gray-400" />
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{bid.message}</p>
                    </div>
                  </div>

                  {/* Hired Success Message */}
                  {bid.status === 'hired' && (
                    <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex-center flex-shrink-0">
                          <FiCheck className="text-white text-sm" />
                        </div>
                        <div>
                          <p className="text-green-800 font-semibold">🎉 Congratulations! You've been hired!</p>
                          <p className="text-green-600 text-sm mt-1">
                            Contact: {bid.gigId?.ownerId?.name} ({bid.gigId?.ownerId?.email})
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rejected Message */}
                  {bid.status === 'rejected' && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                      <p className="text-red-600 text-sm">
                        Another freelancer was selected for this gig. Keep bidding!
                      </p>
                    </div>
                  )}
                </div>

                {/* View Button */}
                {bid.gigId && (
                  <Link
                    to={`/gig/${bid.gigId._id}`}
                    className="btn-secondary flex-center gap-2 lg:w-auto"
                  >
                    <span>View Gig</span>
                    <FiArrowRight />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 flex-center mx-auto mb-6">
            <FiFileText className="text-primary-500 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No bids yet</h3>
          <p className="text-gray-500 mb-6">Browse available gigs and submit your first bid</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <span>Browse Gigs</span>
            <FiArrowRight />
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBids;
