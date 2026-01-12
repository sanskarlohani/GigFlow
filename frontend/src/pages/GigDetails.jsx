import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGig, clearCurrentGig } from '../store/slices/gigsSlice';
import { fetchBidsForGig, hireBid, clearBids } from '../store/slices/bidsSlice';
import BidCard from '../components/BidCard';
import BidForm from '../components/BidForm';
import toast from 'react-hot-toast';
import { FiDollarSign, FiUser, FiClock, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

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
    // Check if current user has already bid
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
      // Refresh gig data
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentGig) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Gig not found</h2>
        <Link to="/" className="text-primary-600 hover:text-primary-700">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <FiArrowLeft className="mr-1" />
        Back to Gigs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-800">{currentGig.title}</h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentGig.status === 'open'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {currentGig.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center space-x-1">
                <FiDollarSign className="text-green-600" />
                <span className="font-semibold text-green-600">${currentGig.budget}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FiUser />
                <span>Posted by {currentGig.ownerId?.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FiClock />
                <span>{formatDate(currentGig.createdAt)}</span>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Job Description</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{currentGig.description}</p>
            </div>

            {currentGig.status === 'assigned' && currentGig.hiredFreelancerId && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 text-green-700">
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
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Bids ({bids.length})
              </h2>

              {bidsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
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
                <p className="text-gray-500 text-center py-10">
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
                <div className="card bg-green-50 border border-green-200">
                  <div className="flex items-center space-x-2 text-green-700">
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
            <div className="card bg-gray-50">
              <h3 className="font-semibold text-gray-800 mb-2">Want to bid?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Sign in or create an account to submit your bid
              </p>
              <Link to="/login" className="btn-primary block text-center">
                Sign In
              </Link>
            </div>
          )}

          {isOwner && (
            <div className="card bg-blue-50 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">You posted this gig</h3>
              <p className="text-blue-600 text-sm">
                Review the bids below and hire the best freelancer for your project
              </p>
            </div>
          )}

          {currentGig.status === 'assigned' && !isOwner && (
            <div className="card bg-yellow-50 border border-yellow-200">
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
