import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { FiMenu, FiX, FiBriefcase, FiUser, FiLogOut, FiPlus, FiGrid, FiFileText } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-gray-200/50">
      <div className="container mx-auto px-4">
        <div className="flex-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-all duration-300">
              <FiBriefcase className="text-xl text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">GigFlow</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="nav-link px-4 py-2 rounded-lg hover:bg-gray-100">Browse Gigs</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/create-gig" className="nav-link flex-gap-2 px-4 py-2 rounded-lg hover:bg-gray-100">
                  <FiPlus className="text-lg" />
                  <span>Post a Gig</span>
                </Link>
                <Link to="/my-gigs" className="nav-link flex-gap-2 px-4 py-2 rounded-lg hover:bg-gray-100">
                  <FiGrid className="text-lg" />
                  <span>My Gigs</span>
                </Link>
                <Link to="/my-bids" className="nav-link flex-gap-2 px-4 py-2 rounded-lg hover:bg-gray-100">
                  <FiFileText className="text-lg" />
                  <span>My Bids</span>
                </Link>
                <div className="flex-gap-3 ml-4 pl-4 border-l border-gray-200">
                  <div className="flex-gap-2 px-3 py-1.5 rounded-full bg-gray-100">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex-center text-white text-sm font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-700 font-medium text-sm">{user?.name}</span>
                  </div>
                  <button onClick={handleLogout} className="nav-link-danger flex-gap-1 px-3 py-2 rounded-lg hover:bg-red-50">
                    <FiLogOut />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-gap-3 ml-4">
                <Link to="/login" className="nav-link px-4 py-2 rounded-lg hover:bg-gray-100">Login</Link>
                <Link to="/register" className="btn-primary">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <FiX className="text-2xl text-gray-600" /> : <FiMenu className="text-2xl text-gray-600" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col gap-1">
              <Link to="/" className="nav-link px-4 py-3 rounded-lg hover:bg-gray-100" onClick={() => setIsOpen(false)}>
                Browse Gigs
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/create-gig" className="nav-link px-4 py-3 rounded-lg hover:bg-gray-100" onClick={() => setIsOpen(false)}>
                    Post a Gig
                  </Link>
                  <Link to="/my-gigs" className="nav-link px-4 py-3 rounded-lg hover:bg-gray-100" onClick={() => setIsOpen(false)}>
                    My Gigs
                  </Link>
                  <Link to="/my-bids" className="nav-link px-4 py-3 rounded-lg hover:bg-gray-100" onClick={() => setIsOpen(false)}>
                    My Bids
                  </Link>
                  <div className="border-t border-gray-100 mt-2 pt-4 px-4">
                    <div className="flex-gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex-center text-white text-sm font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-gray-700 font-medium">{user?.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="nav-link-danger flex-gap-2 w-full py-2"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2 mt-2 px-4">
                  <Link to="/login" className="btn-secondary text-center" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary text-center" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
