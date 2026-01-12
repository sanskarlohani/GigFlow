import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyBids } from '../store/slices/bidsSlice';
import { FiFileText, FiExternalLink } from 'react-icons/fi';

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
        <h1 className="page-title">My Bids</h1>
        <p className="page-subtitle">Track the status of your submitted bids</p>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : myBids.length > 0 ? (
        <div className="space-y-4">
          {myBids.map((bid) => (
            <div key={bid._id} className="card">
              <div className="flex-between">
                <div className="flex-1">
                  <div className="flex-gap-4 mb-2">
                    <h3 className="card-title">
                      {bid.gigId?.title || 'Gig Deleted'}
                    </h3>
                    <span className={`badge ${getStatusBadge(bid.status)}`}>
                      {bid.status}
                    </span>
                  </div>
                  
                  <div className="flex-gap-4 text-muted mb-3">
                    <span className="text-price">Your bid: ₹{bid.price}</span>
                    {bid.gigId?.budget && (
                      <span>Budget: ₹{bid.gigId.budget}</span>
                    )}
                    <span>Submitted {formatDate(bid.createdAt)}</span>
                  </div>

                  <div className="info-box-gray">
                    <p className="text-body text-sm">{bid.message}</p>
                  </div>

                  {bid.status === 'hired' && (
                    <div className="mt-3 info-box-success">
                      <p className="text-green-700 font-medium">
                        🎉 Congratulations! You've been hired for this gig!
                      </p>
                      <p className="text-green-600 text-sm mt-1">
                        Client: {bid.gigId?.ownerId?.name} ({bid.gigId?.ownerId?.email})
                      </p>
                    </div>
                  )}

                  {bid.status === 'rejected' && (
                    <div className="mt-3 info-box-danger">
                      <p className="text-red-600 text-sm">
                        Unfortunately, another freelancer was selected for this gig.
                      </p>
                    </div>
                  )}
                </div>

                {bid.gigId && (
                  <Link
                    to={`/gig/${bid.gigId._id}`}
                    className="btn-icon-primary ml-4"
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
        <div className="empty-state">
          <FiFileText className="empty-icon" />
          <h3 className="empty-title">No bids yet</h3>
          <p className="empty-text">Browse available gigs and submit your first bid</p>
          <Link to="/" className="btn-primary">
            Browse Gigs
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBids;
