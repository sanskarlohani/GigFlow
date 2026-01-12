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
        <div className="flex-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-gap-2">
            <FiBriefcase className="text-2xl icon-primary" />
            <span className="text-xl font-bold text-gray-800">GigFlow</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link">Browse Gigs</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/create-gig" className="nav-link flex-gap-1">
                  <FiPlus />
                  <span>Post a Gig</span>
                </Link>
                <Link to="/my-gigs" className="nav-link">My Gigs</Link>
                <Link to="/my-bids" className="nav-link">My Bids</Link>
                <div className="flex-gap-4 border-l pl-6">
                  <span className="text-gray-700 font-medium flex-gap-1">
                    <FiUser />
                    <span>{user?.name}</span>
                  </span>
                  <button onClick={handleLogout} className="nav-link-danger flex-gap-1">
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-gap-4">
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden nav-link"
          >
            {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
                Browse Gigs
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/create-gig" className="nav-link" onClick={() => setIsOpen(false)}>
                    Post a Gig
                  </Link>
                  <Link to="/my-gigs" className="nav-link" onClick={() => setIsOpen(false)}>
                    My Gigs
                  </Link>
                  <Link to="/my-bids" className="nav-link" onClick={() => setIsOpen(false)}>
                    My Bids
                  </Link>
                  <div className="border-t pt-4">
                    <span className="text-gray-700 font-medium">{user?.name}</span>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="block mt-2 nav-link-danger"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary text-center" onClick={() => setIsOpen(false)}>
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
