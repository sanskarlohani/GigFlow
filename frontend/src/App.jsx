import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './store/slices/authSlice';
import { initializeSocket, disconnectSocket } from './services/socket';

// Layout
import Navbar from './components/layout/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GigDetails from './pages/GigDetails';
import CreateGig from './pages/CreateGig';
import MyGigs from './pages/MyGigs';
import MyBids from './pages/MyBids';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      initializeSocket(user._id, dispatch);
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [user, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/gig/:id" element={<GigDetails />} />
          <Route
            path="/create-gig"
            element={
              <ProtectedRoute>
                <CreateGig />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-gigs"
            element={
              <ProtectedRoute>
                <MyGigs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bids"
            element={
              <ProtectedRoute>
                <MyBids />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
