import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigs } from '../store/slices/gigsSlice';
import GigCard from '../components/GigCard';
import { FiSearch, FiBriefcase, FiTrendingUp, FiUsers, FiZap } from 'react-icons/fi';

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
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative text-center mb-16 py-8">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-200 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
          <FiZap className="text-primary-500" />
          <span>Find your perfect freelance Project</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Find Your Next{' '}
          <span className="gradient-text">Gig</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Connect with top clients, showcase your skills, and build your freelance career on the most trusted platform
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
          <div className="flex gap-3 p-2 bg-white rounded-2xl shadow-soft border border-gray-100">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for gigs..."
                className="w-full pl-12 pr-4 py-3.5 bg-transparent border-none focus:ring-0 outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>
            <button type="submit" className="btn-primary px-8">
              Search
            </button>
          </div>
        </form>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="text-center">
            <div className="flex-center gap-2 text-primary-600 mb-1">
              <FiBriefcase className="text-xl" />
              <span className="text-3xl font-bold">{gigs.length}+</span>
            </div>
            <p className="text-gray-500 text-sm">Active Gigs</p>
          </div>
          <div className="text-center">
            <div className="flex-center gap-2 text-emerald-600 mb-1">
              <FiUsers className="text-xl" />
              <span className="text-3xl font-bold">500+</span>
            </div>
            <p className="text-gray-500 text-sm">Freelancers</p>
          </div>
          <div className="text-center">
            <div className="flex-center gap-2 text-amber-500 mb-1">
              <FiTrendingUp className="text-xl" />
              <span className="text-3xl font-bold">98%</span>
            </div>
            <p className="text-gray-500 text-sm">Success Rate</p>
          </div>
        </div>
      </div>

      {/* Gigs Grid */}
      <div className="mb-6">
        <div className="flex-between mb-8">
          <div className="flex-gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex-center">
              <FiBriefcase className="text-xl text-primary-600" />
            </div>
            <div>
              <h2 className="section-title">Open Gigs</h2>
              <p className="text-muted">{gigs.length} opportunities available</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : gigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig, index) => (
              <div key={gig._id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <GigCard gig={gig} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex-center mx-auto mb-6">
              <FiBriefcase className="text-4xl text-gray-300" />
            </div>
            <h3 className="empty-title">No gigs found</h3>
            <p className="empty-text">
              {searchTerm ? 'Try a different search term' : 'Be the first to post a gig!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
