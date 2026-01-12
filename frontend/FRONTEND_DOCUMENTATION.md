# GigFlow Frontend Documentation

## Overview

The GigFlow frontend is a modern React.js application built with Vite, featuring Redux Toolkit for state management, Tailwind CSS for styling, and Socket.io for real-time notifications.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [State Management](#state-management)
5. [Routing](#routing)
6. [Components](#components)
7. [Pages](#pages)
8. [API Integration](#api-integration)
9. [Real-time Features](#real-time-features)
10. [Styling](#styling)
11. [Environment Configuration](#environment-configuration)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       React Application                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    App Component                      │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │   Navbar    │  │   Routes    │  │   Toaster   │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                               │
│              ┌───────────────┼───────────────┐              │
│              ▼               ▼               ▼              │
│       ┌───────────┐   ┌───────────┐   ┌───────────┐        │
│       │   Pages   │   │Components │   │  Services │        │
│       └───────────┘   └───────────┘   └───────────┘        │
│                              │                               │
│                              ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  Redux Store                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │authSlice │  │gigsSlice │  │bidsSlice │           │   │
│  │  └──────────┘  └──────────┘  └──────────┘           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │      Backend API (Express)     │
              │      Socket.io Server          │
              └───────────────────────────────┘
```

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **Vite** | Build tool & dev server |
| **Redux Toolkit** | State management |
| **React Router DOM** | Client-side routing |
| **Tailwind CSS** | Utility-first CSS |
| **Axios** | HTTP client |
| **Socket.io Client** | Real-time communication |
| **React Hot Toast** | Toast notifications |
| **React Icons** | Icon library |

---

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.jsx        # Navigation bar
│   │   ├── BidCard.jsx           # Single bid display
│   │   ├── BidForm.jsx           # Bid submission form
│   │   ├── GigCard.jsx           # Single gig card
│   │   └── ProtectedRoute.jsx    # Auth guard component
│   ├── pages/
│   │   ├── Home.jsx              # Gig listing page
│   │   ├── Login.jsx             # Login page
│   │   ├── Register.jsx          # Registration page
│   │   ├── CreateGig.jsx         # Gig creation page
│   │   ├── GigDetails.jsx        # Single gig view
│   │   ├── MyGigs.jsx            # User's posted gigs
│   │   └── MyBids.jsx            # User's submitted bids
│   ├── services/
│   │   ├── api.js                # Axios API configuration
│   │   └── socket.js             # Socket.io client
│   ├── store/
│   │   ├── store.js              # Redux store configuration
│   │   └── slices/
│   │       ├── authSlice.js      # Authentication state
│   │       ├── gigsSlice.js      # Gigs state
│   │       └── bidsSlice.js      # Bids state
│   ├── App.jsx                   # Root component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── index.html                    # HTML template
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.js             # PostCSS configuration
└── package.json                  # Dependencies
```

---

## State Management

### Redux Store Configuration (`store/store.js`)

```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import gigsReducer from './slices/gigsSlice';
import bidsReducer from './slices/bidsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    gigs: gigsReducer,
    bids: bidsReducer,
  },
});
```

### Auth Slice (`store/slices/authSlice.js`)

**State Structure:**
```javascript
{
  user: null | { _id, name, email },
  isLoading: boolean,
  isAuthenticated: boolean,
  error: null | string
}
```

**Async Thunks:**
| Action | Description |
|--------|-------------|
| `register` | Create new user account |
| `login` | Authenticate user |
| `logout` | Clear authentication |
| `getMe` | Fetch current user profile |

**Usage Example:**
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleLogin = async (credentials) => {
    const result = await dispatch(login(credentials));
    if (login.fulfilled.match(result)) {
      // Success
    }
  };
};
```

### Gigs Slice (`store/slices/gigsSlice.js`)

**State Structure:**
```javascript
{
  gigs: [],           // All open gigs
  currentGig: null,   // Single gig details
  myGigs: [],         // User's posted gigs
  isLoading: boolean,
  error: null | string
}
```

**Async Thunks:**
| Action | Description |
|--------|-------------|
| `fetchGigs` | Get all open gigs (with search) |
| `fetchGig` | Get single gig by ID |
| `createGig` | Create new gig post |
| `fetchMyGigs` | Get user's posted gigs |
| `deleteGig` | Delete a gig |

### Bids Slice (`store/slices/bidsSlice.js`)

**State Structure:**
```javascript
{
  bids: [],           // Bids for current gig
  myBids: [],         // User's submitted bids
  isLoading: boolean,
  error: null | string
}
```

**Async Thunks:**
| Action | Description |
|--------|-------------|
| `createBid` | Submit a bid |
| `fetchBidsForGig` | Get bids for a specific gig |
| `hireBid` | Hire a freelancer |
| `fetchMyBids` | Get user's submitted bids |

---

## Routing

### Route Configuration (`App.jsx`)

```javascript
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/gig/:id" element={<GigDetails />} />

  {/* Protected Routes */}
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
```

### Protected Route Component

```javascript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
```

---

## Components

### Navbar (`components/layout/Navbar.jsx`)

**Features:**
- Logo with link to home
- Navigation links
- User authentication status
- Mobile responsive menu
- Logout functionality

**Conditional Rendering:**
```javascript
{isAuthenticated ? (
  <>
    <Link to="/create-gig">Post a Gig</Link>
    <Link to="/my-gigs">My Gigs</Link>
    <Link to="/my-bids">My Bids</Link>
    <span>{user?.name}</span>
    <button onClick={handleLogout}>Logout</button>
  </>
) : (
  <>
    <Link to="/login">Login</Link>
    <Link to="/register">Sign Up</Link>
  </>
)}
```

### GigCard (`components/GigCard.jsx`)

**Props:**
```javascript
{
  gig: {
    _id: string,
    title: string,
    description: string,
    budget: number,
    status: 'open' | 'assigned',
    ownerId: { name: string },
    createdAt: string
  }
}
```

**Features:**
- Clickable card linking to gig details
- Status badge (open/assigned)
- Budget display
- Owner name
- Date formatting

### BidCard (`components/BidCard.jsx`)

**Props:**
```javascript
{
  bid: {
    _id: string,
    freelancerId: { name, email },
    message: string,
    price: number,
    status: 'pending' | 'hired' | 'rejected'
  },
  onHire: (bidId) => void,
  isOwner: boolean,
  isHiring: boolean
}
```

**Features:**
- Freelancer info display
- Bid price and message
- Status badge with colors
- Hire button (for gig owners)

### BidForm (`components/BidForm.jsx`)

**Props:**
```javascript
{
  gigId: string,
  onSuccess: (bid) => void
}
```

**Features:**
- Price input
- Message textarea
- Submission handling
- Loading state
- Toast notifications

---

## Pages

### Home Page (`pages/Home.jsx`)

**Features:**
- Hero section with title
- Search bar for filtering gigs
- Grid display of gig cards
- Loading state
- Empty state handling

**Search Implementation:**
```javascript
const handleSearch = (e) => {
  e.preventDefault();
  dispatch(fetchGigs(searchTerm));
};
```

### GigDetails Page (`pages/GigDetails.jsx`)

**Features:**
- Full gig information display
- Conditional rendering based on user role:
  - **Owner**: View all bids, hire freelancers
  - **Freelancer**: Submit bid (if not already bid)
  - **Visitor**: Prompt to login
- Real-time status updates
- Bid list with hire functionality

**Role-based Logic:**
```javascript
const isOwner = user && currentGig?.ownerId?._id === user._id;

// Fetch bids only if owner
useEffect(() => {
  if (currentGig && isOwner) {
    dispatch(fetchBidsForGig(id));
  }
}, [currentGig, isOwner]);
```

### MyGigs Page (`pages/MyGigs.jsx`)

**Features:**
- List of user's posted gigs
- Status indicators
- View/Delete actions
- Empty state with CTA

### MyBids Page (`pages/MyBids.jsx`)

**Features:**
- List of user's submitted bids
- Status tracking (pending/hired/rejected)
- Hired notification display
- Link to original gig

---

## API Integration

### Axios Configuration (`services/api.js`)

```javascript
import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,  // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// API modules
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const gigsAPI = {
  getAll: (search) => api.get(`/gigs${search ? `?search=${search}` : ''}`),
  getOne: (id) => api.get(`/gigs/${id}`),
  create: (data) => api.post('/gigs', data),
  update: (id, data) => api.put(`/gigs/${id}`, data),
  delete: (id) => api.delete(`/gigs/${id}`),
  getMyGigs: () => api.get('/gigs/user/my-gigs'),
};

export const bidsAPI = {
  create: (data) => api.post('/bids', data),
  getForGig: (gigId) => api.get(`/bids/${gigId}`),
  hire: (bidId) => api.patch(`/bids/${bidId}/hire`),
  getMyBids: () => api.get('/bids/my-bids'),
};
```

### Vite Proxy Configuration (`vite.config.js`)

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

---

## Real-time Features

### Socket.io Client (`services/socket.js`)

```javascript
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

let socket = null;

export const initializeSocket = (userId, dispatch) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io('http://localhost:5000', {
    withCredentials: true,
  });

  socket.on('connect', () => {
    // Register user with socket
    socket.emit('register', userId);
  });

  // Listen for hire notifications
  socket.on('hired', (data) => {
    toast.success(data.message, {
      duration: 5000,
      icon: '🎉',
    });
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
```

### Integration in App.jsx

```javascript
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
```

---

## Styling

### Tailwind Configuration (`tailwind.config.js`)

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          // ... full color scale
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
}
```

### Custom CSS Classes (`index.css`)

```css
@layer components {
  .btn-primary {
    @apply bg-primary-600 text-white px-4 py-2 rounded-lg 
           hover:bg-primary-700 transition-colors duration-200 font-medium;
  }
  
  .btn-secondary {
    @apply bg-gray-200 text-gray-800 px-4 py-2 rounded-lg 
           hover:bg-gray-300 transition-colors duration-200 font-medium;
  }
  
  .btn-success {
    @apply bg-green-600 text-white px-4 py-2 rounded-lg 
           hover:bg-green-700 transition-colors duration-200 font-medium;
  }
  
  .btn-danger {
    @apply bg-red-600 text-white px-4 py-2 rounded-lg 
           hover:bg-red-700 transition-colors duration-200 font-medium;
  }
  
  .input-field {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg 
           focus:ring-2 focus:ring-primary-500 focus:border-transparent 
           outline-none transition-all duration-200;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-md p-6 
           hover:shadow-lg transition-shadow duration-200;
  }
}
```

---

## Environment Configuration

### Development Setup

The frontend proxies API requests to the backend during development:

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

### Production Considerations

For production deployment:
1. Update Socket.io URL to production server
2. Configure environment variables
3. Build with `npm run build`
4. Serve static files from backend or CDN

---

## Running the Application

### Development
```bash
npm run dev    # Starts Vite dev server on http://localhost:5173
```

### Production Build
```bash
npm run build  # Creates optimized build in /dist
npm run preview # Preview production build locally
```

---

## User Flows

### 1. Authentication Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│ Register│ ──▶ │  Login  │ ──▶ │Dashboard│
└─────────┘     └─────────┘     └─────────┘
                     │
                     ▼
              ┌─────────────┐
              │ JWT Cookie  │
              │ Set by API  │
              └─────────────┘
```

### 2. Posting a Gig Flow

```
┌─────────┐     ┌────────────┐     ┌─────────┐
│ My Gigs │ ──▶ │ Create Gig │ ──▶ │ Success │
└─────────┘     │   Form     │     │Redirect │
                └────────────┘     └─────────┘
```

### 3. Bidding Flow

```
┌─────────┐     ┌────────────┐     ┌─────────┐
│Browse   │ ──▶ │ Gig Detail │ ──▶ │ Submit  │
│Gigs     │     │   Page     │     │  Bid    │
└─────────┘     └────────────┘     └─────────┘
```

### 4. Hiring Flow

```
┌─────────┐     ┌────────────┐     ┌─────────────┐
│ My Gigs │ ──▶ │ View Bids  │ ──▶ │Click "Hire" │
└─────────┘     └────────────┘     └─────────────┘
                                          │
                                          ▼
                                   ┌─────────────┐
                                   │ Real-time   │
                                   │Notification │
                                   │to Freelancer│
                                   └─────────────┘
```

---

## Future Improvements

- [ ] Dark mode support
- [ ] Pagination for large lists
- [ ] Image upload for gigs
- [ ] Advanced search filters
- [ ] User profile pages
- [ ] Messaging system
- [ ] Payment integration UI
- [ ] Mobile app (React Native)
