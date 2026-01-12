import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGig, clearCurrentGig } from '../store/slices/gigsSlice';
import { fetchBidsForGig, hireBid, clearBids } from '../store/slices/bidsSlice';
import BidCard from '../components/BidCard';
import BidForm from '../components/BidForm';
import toast from 'react-hot-toast';
import { FiUser, FiClock, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const GigDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentGig, isLoading: gigLoading } = useSelector((state) => state.gigs);
  const { bids, isLoading: bidsLoading } = useSelector((state) => state.bids);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isHiring, setIsHiring] = useState(false);
  const [hasBid, setHasBid] = useState(false);

  const isOwner = user && currentGig?.ownerId?._id === user._id;

  useEffect(() => {
    dispatch(fetchGig(id));

    return () => {
      dispatch(clearCurrentGig());
      dispatch(clearBids());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentGig && isOwner) {
      dispatch(fetchBidsForGig(id));
    }
  }, [dispatch, id, currentGig, isOwner]);

  useEffect(() => {
    if (bids && user) {
      const userBid = bids.find((bid) => bid.freelancerId?._id === user._id);
      setHasBid(!!userBid);
    }
  }, [bids, user]);

  const handleHire = async (bidId) => {
    if (!window.confirm('Are you sure you want to hire this freelancer? All other bids will be rejected.')) {
      return;
    }

    setIsHiring(true);
    try {
      const result = await dispatch(hireBid(bidId)).unwrap();
      toast.success('Freelancer hired successfully!');
      dispatch(fetchGig(id));
    } catch (error) {
      toast.error(error || 'Failed to hire freelancer');
    } finally {
      setIsHiring(false);
    }
  };

  const handleBidSuccess = () => {
    setHasBid(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (gigLoading) {
    return (
      <div className="flex-center min-h-[60vh]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!currentGig) {
    return (
      <div className="empty-state">
        <h2 className="page-title mb-4">Gig not found</h2>
        <Link to="/" className="text-primary-600 hover:text-primary-700">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <FiArrowLeft className="mr-1" />
        Back to Gigs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <div className="flex-between mb-4">
              <h1 className="page-title">{currentGig.title}</h1>
              <span className={`badge-lg ${currentGig.status === 'open' ? 'badge-open' : 'badge-assigned'}`}>
                {currentGig.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-muted mb-6">
              <div className="flex-gap-1">
                <span className="text-price">₹{currentGig.budget}</span>
              </div>
              <div className="flex-gap-1">
                <FiUser />
                <span>Posted by {currentGig.ownerId?.name}</span>
              </div>
              <div className="flex-gap-1">
                <FiClock />
                <span>{formatDate(currentGig.createdAt)}</span>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="card-title mb-3">Job Description</h2>
              <p className="text-body whitespace-pre-wrap">{currentGig.description}</p>
            </div>

            {currentGig.status === 'assigned' && currentGig.hiredFreelancerId && (
              <div className="mt-6 info-box-success p-4">
                <div className="flex-gap-2 text-green-700">
                  <FiCheckCircle />
                  <span className="font-semibold">
                    Hired: {currentGig.hiredFreelancerId.name}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bids Section (Owner only) */}
          {isOwner && (
            <div className="card">
              <h2 className="section-title mb-4">Bids ({bids.length})</h2>

              {bidsLoading ? (
                <div className="loading-container-sm">
                  <div className="spinner-sm"></div>
                </div>
              ) : bids.length > 0 ? (
                <div className="space-y-4">
                  {bids.map((bid) => (
                    <BidCard
                      key={bid._id}
                      bid={bid}
                      onHire={handleHire}
                      isOwner={isOwner}
                      isHiring={isHiring}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-10">
                  No bids yet. Share your gig to get more bids!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {!isOwner && isAuthenticated && currentGig.status === 'open' && (
            <>
              {hasBid ? (
                <div className="card info-box-success">
                  <div className="flex-gap-2 text-green-700">
                    <FiCheckCircle />
                    <span className="font-semibold">You've already submitted a bid</span>
                  </div>
                  <p className="text-sm text-green-600 mt-2">
                    Check "My Bids" to see its status
                  </p>
                </div>
              ) : (
                <BidForm gigId={id} onSuccess={handleBidSuccess} />
              )}
            </>
          )}

          {!isAuthenticated && currentGig.status === 'open' && (
            <div className="card info-box-gray">
              <h3 className="font-semibold text-gray-800 mb-2">Want to bid?</h3>
              <p className="text-body text-sm mb-4">
                Sign in or create an account to submit your bid
              </p>
              <Link to="/login" className="btn-primary block text-center">
                Sign In
              </Link>
            </div>
          )}

          {isOwner && (
            <div className="card info-box-primary">
              <h3 className="font-semibold text-blue-800 mb-2">You posted this gig</h3>
              <p className="text-blue-600 text-sm">
                Review the bids below and hire the best freelancer for your project
              </p>
            </div>
          )}

          {currentGig.status === 'assigned' && !isOwner && (
            <div className="card info-box-warning">
              <h3 className="font-semibold text-yellow-800 mb-2">This gig is assigned</h3>
              <p className="text-yellow-600 text-sm">
                A freelancer has already been hired for this gig
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GigDetails;
