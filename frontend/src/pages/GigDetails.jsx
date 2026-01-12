import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGig, clearCurrentGig } from '../store/slices/gigsSlice';
import { fetchBidsForGig, hireBid, clearBids } from '../store/slices/bidsSlice';
import BidCard from '../components/BidCard';
import BidForm from '../components/BidForm';
import toast from 'react-hot-toast';
import { FiUser, FiClock, FiArrowLeft, FiCheckCircle, FiAlertCircle, FiInfo, FiBriefcase } from 'react-icons/fi';

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
        <div className="spinner" />
      </div>
    );
  }

  if (!currentGig) {
    return (
      <div className="empty-state">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex-center mx-auto mb-4">
          <FiAlertCircle className="text-gray-400 text-2xl" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Gig not found</h2>
        <p className="text-gray-500 mb-4">This gig may have been removed or doesn't exist</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <FiArrowLeft />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 group"
      >
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex-center group-hover:bg-primary-50 transition-colors">
          <FiArrowLeft className="group-hover:text-primary-600" />
        </div>
        <span className="font-medium">Back to Gigs</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gig Header Card */}
          <div className="card">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className={`badge ${currentGig.status === 'open' ? 'badge-open' : 'badge-assigned'}`}>
                {currentGig.status === 'open' ? '🟢 Open for Bids' : '✓ Assigned'}
              </span>
              <span className="badge bg-gray-100 text-gray-600">
                Posted {formatDate(currentGig.createdAt)}
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">{currentGig.title}</h1>

            {/* Budget & Owner */}
            <div className="flex flex-wrap gap-6 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Budget</p>
                <p className="text-2xl font-bold text-primary-600">₹{currentGig.budget?.toLocaleString()}</p>
              </div>
              <div className="border-l border-gray-200 pl-6">
                <p className="text-sm text-gray-500 mb-1">Posted by</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex-center text-white font-bold text-sm">
                    {currentGig.ownerId?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-800">{currentGig.ownerId?.name}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FiBriefcase className="text-primary-500" />
                Job Description
              </h2>
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-body whitespace-pre-wrap leading-relaxed">{currentGig.description}</p>
              </div>
            </div>

            {/* Hired Notice */}
            {currentGig.status === 'assigned' && currentGig.hiredFreelancerId && (
              <div className="mt-6 bg-green-50 border border-green-100 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex-center">
                    <FiCheckCircle className="text-white text-lg" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Freelancer Hired</p>
                    <p className="text-green-600">{currentGig.hiredFreelancerId.name}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bids Section (Owner only) */}
          {isOwner && (
            <div className="card">
              <div className="flex-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Received Bids</h2>
                <span className="badge bg-primary-100 text-primary-700">{bids.length} bids</span>
              </div>

              {bidsLoading ? (
                <div className="flex-center py-12">
                  <div className="spinner" />
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
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex-center mx-auto mb-4">
                    <FiInfo className="text-gray-400 text-2xl" />
                  </div>
                  <p className="text-gray-500">No bids yet. Share your gig to get more bids!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {!isOwner && isAuthenticated && currentGig.status === 'open' && (
            <>
              {hasBid ? (
                <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500 flex-center flex-shrink-0">
                      <FiCheckCircle className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800">Bid Submitted!</h3>
                      <p className="text-sm text-green-600 mt-1">
                        Check "My Bids" to track its status
                      </p>
                      <Link to="/my-bids" className="btn-primary mt-4 inline-block text-sm">
                        View My Bids
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <BidForm gigId={id} onSuccess={handleBidSuccess} />
              )}
            </>
          )}

          {!isAuthenticated && currentGig.status === 'open' && (
            <div className="card bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex-center mx-auto mb-4">
                  <FiUser className="text-gray-400 text-xl" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Want to bid on this gig?</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Sign in to submit your proposal
                </p>
                <Link to="/login" className="btn-primary w-full flex-center gap-2">
                  Sign In to Bid
                </Link>
                <Link to="/register" className="btn-secondary w-full mt-3">
                  Create Account
                </Link>
              </div>
            </div>
          )}

          {isOwner && (
            <div className="card bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex-center flex-shrink-0">
                  <FiBriefcase className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Your Gig</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Review received bids and hire the best freelancer for your project
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentGig.status === 'assigned' && !isOwner && (
            <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500 flex-center flex-shrink-0">
                  <FiAlertCircle className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-800">Gig Assigned</h3>
                  <p className="text-sm text-yellow-600 mt-1">
                    A freelancer has already been hired for this project
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GigDetails;
