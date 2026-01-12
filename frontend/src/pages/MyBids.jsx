import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyBids } from '../store/slices/bidsSlice';
import { FiFileText, FiDollarSign, FiExternalLink } from 'react-icons/fi';

const MyBids = () => {
  const dispatch = useDispatch();
  const { myBids, isLoading } = useSelector((state) => state.bids);

  useEffect(() => {
    dispatch(fetchMyBids());
  }, [dispatch]);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Bids</h1>
        <p className="text-gray-600">Track the status of your submitted bids</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : myBids.length > 0 ? (
        <div className="space-y-4">
          {myBids.map((bid) => (
            <div key={bid._id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {bid.gigId?.title || 'Gig Deleted'}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(bid.status)}`}>
                      {bid.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center space-x-1 text-green-600 font-medium">
                      <FiDollarSign />
                      <span>Your bid: ${bid.price}</span>
                    </span>
                    {bid.gigId?.budget && (
                      <span>Budget: ${bid.gigId.budget}</span>
                    )}
                    <span>Submitted {formatDate(bid.createdAt)}</span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-600 text-sm">{bid.message}</p>
                  </div>

                  {bid.status === 'hired' && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-green-700 font-medium">
                        🎉 Congratulations! You've been hired for this gig!
                      </p>
                      <p className="text-green-600 text-sm mt-1">
                        Client: {bid.gigId?.ownerId?.name} ({bid.gigId?.ownerId?.email})
                      </p>
                    </div>
                  )}

                  {bid.status === 'rejected' && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-red-600 text-sm">
                        Unfortunately, another freelancer was selected for this gig.
                      </p>
                    </div>
                  )}
                </div>

                {bid.gigId && (
                  <Link
                    to={`/gig/${bid.gigId._id}`}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors ml-4"
                    title="View Gig"
                  >
                    <FiExternalLink className="text-xl" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <FiFileText className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No bids yet</h3>
          <p className="text-gray-500 mb-6">Browse available gigs and submit your first bid</p>
          <Link to="/" className="btn-primary">
            Browse Gigs
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBids;
