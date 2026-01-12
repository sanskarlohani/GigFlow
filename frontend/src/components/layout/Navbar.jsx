import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { FiMenu, FiX, FiBriefcase, FiUser, FiLogOut, FiPlus } from 'react-icons/fi';
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
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FiBriefcase className="text-2xl text-primary-600" />
            <span className="text-xl font-bold text-gray-800">GigFlow</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">
              Browse Gigs
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/create-gig"
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <FiPlus />
                  <span>Post a Gig</span>
                </Link>
                <Link to="/my-gigs" className="text-gray-600 hover:text-primary-600 transition-colors">
                  My Gigs
                </Link>
                <Link to="/my-bids" className="text-gray-600 hover:text-primary-600 transition-colors">
                  My Bids
                </Link>
                <div className="flex items-center space-x-4 border-l pl-6">
                  <span className="text-gray-700 font-medium flex items-center space-x-1">
                    <FiUser />
                    <span>{user?.name}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-600 hover:text-primary-600"
          >
            {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-primary-600"
                onClick={() => setIsOpen(false)}
              >
                Browse Gigs
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/create-gig"
                    className="text-gray-600 hover:text-primary-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Post a Gig
                  </Link>
                  <Link
                    to="/my-gigs"
                    className="text-gray-600 hover:text-primary-600"
                    onClick={() => setIsOpen(false)}
                  >
                    My Gigs
                  </Link>
                  <Link
                    to="/my-bids"
                    className="text-gray-600 hover:text-primary-600"
                    onClick={() => setIsOpen(false)}
                  >
                    My Bids
                  </Link>
                  <div className="border-t pt-4">
                    <span className="text-gray-700 font-medium">{user?.name}</span>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="block mt-2 text-red-600 hover:text-red-700"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-primary-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
