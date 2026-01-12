import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyGigs, deleteGig } from '../store/slices/gigsSlice';
import toast from 'react-hot-toast';
import { FiBriefcase, FiPlus, FiTrash2, FiEye } from 'react-icons/fi';

const MyGigs = () => {
  const dispatch = useDispatch();
  const { myGigs, isLoading } = useSelector((state) => state.gigs);

  useEffect(() => {
    dispatch(fetchMyGigs());
  }, [dispatch]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await dispatch(deleteGig(id)).unwrap();
      toast.success('Gig deleted successfully');
    } catch (error) {
      toast.error(error || 'Failed to delete gig');
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
      <div className="flex-between mb-8">
        <div>
          <h1 className="page-title">My Posted Gigs</h1>
          <p className="page-subtitle">Manage the jobs you've posted</p>
        </div>
        <Link to="/create-gig" className="btn-primary flex-gap-2">
          <FiPlus />
          <span>Post New Gig</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : myGigs.length > 0 ? (
        <div className="space-y-4">
          {myGigs.map((gig) => (
            <div key={gig._id} className="card">
              <div className="flex-between">
                <div className="flex-1">
                  <div className="flex-gap-4 mb-2">
                    <h3 className="card-title">{gig.title}</h3>
                    <span className={`badge ${gig.status === 'open' ? 'badge-open' : 'badge-assigned'}`}>
                      {gig.status}
                    </span>
                  </div>
                  <p className="text-body text-sm mb-3 line-clamp-2">{gig.description}</p>
                  <div className="flex-gap-4 text-muted">
                    <span className="text-price">₹{gig.budget}</span>
                    <span>Posted {formatDate(gig.createdAt)}</span>
                    {gig.hiredFreelancerId && (
                      <span className="text-primary-600">
                        Hired: {gig.hiredFreelancerId.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-gap-2 ml-4">
                  <Link
                    to={`/gig/${gig._id}`}
                    className="btn-icon-primary"
                    title="View Details"
                  >
                    <FiEye className="text-xl" />
                  </Link>
                  {gig.status === 'open' && (
                    <button
                      onClick={() => handleDelete(gig._id, gig.title)}
                      className="btn-icon-danger"
                      title="Delete Gig"
                    >
                      <FiTrash2 className="text-xl" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FiBriefcase className="empty-icon" />
          <h3 className="empty-title">No gigs posted yet</h3>
          <p className="empty-text">Start by posting your first gig</p>
          <Link to="/create-gig" className="btn-primary inline-flex items-center space-x-2">
            <FiPlus />
            <span>Post a Gig</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyGigs;
