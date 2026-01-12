import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyGigs, deleteGig } from '../store/slices/gigsSlice';
import toast from 'react-hot-toast';
import { FiBriefcase, FiPlus, FiTrash2, FiEye, FiDollarSign } from 'react-icons/fi';

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Posted Gigs</h1>
          <p className="text-gray-600">Manage the jobs you've posted</p>
        </div>
        <Link to="/create-gig" className="btn-primary flex items-center space-x-2">
          <FiPlus />
          <span>Post New Gig</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : myGigs.length > 0 ? (
        <div className="space-y-4">
          {myGigs.map((gig) => (
            <div key={gig._id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{gig.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        gig.status === 'open'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {gig.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{gig.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center space-x-1 text-green-600 font-medium">
                      <FiDollarSign />
                      <span>${gig.budget}</span>
                    </span>
                    <span>Posted {formatDate(gig.createdAt)}</span>
                    {gig.hiredFreelancerId && (
                      <span className="text-primary-600">
                        Hired: {gig.hiredFreelancerId.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Link
                    to={`/gig/${gig._id}`}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <FiEye className="text-xl" />
                  </Link>
                  {gig.status === 'open' && (
                    <button
                      onClick={() => handleDelete(gig._id, gig.title)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        <div className="text-center py-20">
          <FiBriefcase className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No gigs posted yet</h3>
          <p className="text-gray-500 mb-6">Start by posting your first gig</p>
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
