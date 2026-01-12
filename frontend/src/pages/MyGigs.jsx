import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyGigs, deleteGig } from '../store/slices/gigsSlice';
import toast from 'react-hot-toast';
import { FiBriefcase, FiPlus, FiTrash2, FiEye, FiCheck, FiUser } from 'react-icons/fi';

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

  const openGigs = myGigs.filter(g => g.status === 'open');
  const assignedGigs = myGigs.filter(g => g.status === 'assigned');

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Posted Gigs</h1>
          <p className="text-gray-500 mt-1">Manage the jobs you've posted</p>
        </div>
        <Link to="/create-gig" className="btn-primary flex-center gap-2">
          <FiPlus />
          <span>Post New Gig</span>
        </Link>
      </div>

      {/* Stats */}
      {myGigs.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-500 flex-center">
                <FiBriefcase className="text-white text-lg" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-700">{openGigs.length}</p>
                <p className="text-sm text-primary-600">Open Gigs</p>
              </div>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex-center">
                <FiCheck className="text-white text-lg" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{assignedGigs.length}</p>
                <p className="text-sm text-green-600">Assigned</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex-center py-20">
          <div className="spinner" />
        </div>
      ) : myGigs.length > 0 ? (
        <div className="space-y-4">
          {myGigs.map((gig, index) => (
            <div 
              key={gig._id} 
              className="card group hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className={`badge ${gig.status === 'open' ? 'badge-open' : 'badge-assigned'}`}>
                      {gig.status === 'open' ? '🟢 Open' : '✓ Assigned'}
                    </span>
                    <span className="text-xs text-gray-400">Posted {formatDate(gig.createdAt)}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {gig.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{gig.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="text-lg font-bold text-primary-600">₹{gig.budget?.toLocaleString()}</div>
                    
                    {gig.hiredFreelancerId && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex-center">
                          <FiUser className="text-white text-xs" />
                        </div>
                        <span className="text-sm text-green-700 font-medium">
                          {gig.hiredFreelancerId.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 sm:flex-col">
                  <Link
                    to={`/gig/${gig._id}`}
                    className="flex-1 sm:flex-none btn-secondary flex-center gap-2 text-sm"
                    title="View Details"
                  >
                    <FiEye />
                    <span className="sm:hidden">View</span>
                  </Link>
                  {gig.status === 'open' && (
                    <button
                      onClick={() => handleDelete(gig._id, gig.title)}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex-center gap-2 text-sm"
                      title="Delete Gig"
                    >
                      <FiTrash2 />
                      <span className="sm:hidden">Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 flex-center mx-auto mb-6">
            <FiBriefcase className="text-primary-500 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No gigs posted yet</h3>
          <p className="text-gray-500 mb-6">Start by posting your first gig to find talented freelancers</p>
          <Link to="/create-gig" className="btn-primary inline-flex items-center gap-2">
            <FiPlus />
            <span>Post Your First Gig</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyGigs;
