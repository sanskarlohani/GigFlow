import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigs } from '../store/slices/gigsSlice';
import GigCard from '../components/GigCard';
import { FiSearch, FiBriefcase } from 'react-icons/fi';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const { gigs, isLoading } = useSelector((state) => state.gigs);

  useEffect(() => {
    dispatch(fetchGigs());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchGigs(searchTerm));
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Find Your Next <span className="text-primary-600">Gig</span>
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Browse through hundreds of freelance opportunities or post your own job
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for gigs by title..."
                className="input-field pl-12"
              />
            </div>
            <button type="submit" className="btn-primary">
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Gigs Grid */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <FiBriefcase className="text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Open Gigs ({gigs.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : gigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <FiBriefcase className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No gigs found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try a different search term' : 'Be the first to post a gig!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
