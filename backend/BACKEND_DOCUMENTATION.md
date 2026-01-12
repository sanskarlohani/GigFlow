# GigFlow Backend Documentation

## Overview

The GigFlow backend is a RESTful API built with Node.js and Express.js, providing authentication, gig management, bidding system, and real-time notifications for the freelance marketplace platform.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Authentication System](#authentication-system)
7. [Core Business Logic](#core-business-logic)
8. [Real-time Features](#real-time-features)
9. [Error Handling](#error-handling)
10. [Environment Configuration](#environment-configuration)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (React)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express.js Server                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Routes    │  │ Middleware  │  │ Controllers │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
       ┌───────────┐   ┌───────────┐   ┌───────────┐
       │  MongoDB  │   │   JWT     │   │ Socket.io │
       │ (Mongoose)│   │  Cookies  │   │  Server   │
       └───────────┘   └───────────┘   └───────────┘
```

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **JWT** | Token-based authentication |
| **bcryptjs** | Password hashing |
| **Socket.io** | Real-time communication |
| **cookie-parser** | HTTP cookie parsing |
| **cors** | Cross-Origin Resource Sharing |
| **dotenv** | Environment variables |

---

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/
│   ├── auth.controller.js    # Authentication logic
│   ├── gig.controller.js     # Gig CRUD operations
│   └── bid.controller.js     # Bidding and hiring logic
├── middleware/
│   └── auth.middleware.js    # JWT verification middleware
├── models/
│   ├── User.js               # User schema
│   ├── Gig.js                # Gig schema
│   └── Bid.js                # Bid schema
├── routes/
│   ├── auth.routes.js        # Auth endpoints
│   ├── gig.routes.js         # Gig endpoints
│   └── bid.routes.js         # Bid endpoints
├── server.js                 # Application entry point
├── package.json              # Dependencies
├── .env                      # Environment variables
└── .env.example              # Environment template
```

---

## Database Schema

### User Model (`models/User.js`)

```javascript
{
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false  // Not returned in queries by default
  },
  timestamps: true  // createdAt, updatedAt
}
```

**Features:**
- Password automatically hashed using bcrypt before saving
- `matchPassword()` method for password comparison
- Email validation with regex pattern

### Gig Model (`models/Gig.js`)

```javascript
{
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  budget: {
    type: Number,
    required: true,
    min: 1
  },
  ownerId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'assigned'],
    default: 'open'
  },
  hiredFreelancerId: {
    type: ObjectId,
    ref: 'User',
    default: null
  },
  timestamps: true
}
```

**Indexes:**
- Text index on `title` and `description` for search functionality

### Bid Model (`models/Bid.js`)

```javascript
{
  gigId: {
    type: ObjectId,
    ref: 'Gig',
    required: true
  },
  freelancerId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'hired', 'rejected'],
    default: 'pending'
  },
  timestamps: true
}
```

**Indexes:**
- Compound unique index on `{gigId, freelancerId}` prevents duplicate bids

---

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Create new user account | No |
| POST | `/login` | Login and receive JWT cookie | No |
| POST | `/logout` | Clear JWT cookie | No |
| GET | `/me` | Get current user profile | Yes |

### Gig Routes (`/api/gigs`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all open gigs (with search) | No |
| GET | `/:id` | Get single gig details | No |
| POST | `/` | Create new gig | Yes |
| PUT | `/:id` | Update gig (owner only) | Yes |
| DELETE | `/:id` | Delete gig (owner only) | Yes |
| GET | `/user/my-gigs` | Get user's posted gigs | Yes |

### Bid Routes (`/api/bids`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Submit bid for a gig | Yes |
| GET | `/my-bids` | Get user's submitted bids | Yes |
| GET | `/:gigId` | Get bids for a gig (owner only) | Yes |
| PATCH | `/:bidId/hire` | Hire a freelancer | Yes |

---

## Authentication System

### JWT Implementation

The authentication uses JSON Web Tokens stored in HttpOnly cookies for security.

**Token Generation:**
```javascript
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};
```

**Cookie Configuration:**
```javascript
res.cookie('token', token, {
  httpOnly: true,        // Prevents XSS attacks
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',    // Prevents CSRF attacks
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

### Auth Middleware (`middleware/auth.middleware.js`)

```javascript
export const protect = async (req, res, next) => {
  let token;

  // Check cookies first
  if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Fallback to Authorization header
  if (!token && req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Verify token and attach user to request
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
};
```

---

## Core Business Logic

### Hiring Flow (Critical Feature)

The hiring process is the most critical business logic, implementing **transactional integrity** to handle race conditions.

**Location:** `controllers/bid.controller.js` - `hireBid()`

**Flow:**
1. Start MongoDB session and transaction
2. Find the bid and associated gig
3. Verify ownership and status
4. Update gig status to 'assigned'
5. Update hired bid status to 'hired'
6. Reject all other pending bids
7. Commit transaction
8. Send real-time notification

**Transaction Implementation:**
```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  // Find bid with session lock
  const bid = await Bid.findById(bidId).session(session);
  const gig = await Gig.findById(bid.gigId).session(session);

  // Race condition check
  if (gig.status !== 'open') {
    await session.abortTransaction();
    return res.status(400).json({ message: 'Gig already assigned' });
  }

  // Update gig
  gig.status = 'assigned';
  gig.hiredFreelancerId = bid.freelancerId;
  await gig.save({ session });

  // Update hired bid
  bid.status = 'hired';
  await bid.save({ session });

  // Reject other bids
  await Bid.updateMany(
    { gigId: gig._id, _id: { $ne: bid._id }, status: 'pending' },
    { status: 'rejected' },
    { session }
  );

  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

### Business Rules

1. **Users cannot bid on their own gigs**
2. **Users can only bid once per gig**
3. **Only gig owners can view bids**
4. **Only gig owners can hire freelancers**
5. **Cannot modify assigned gigs**
6. **Hiring one freelancer automatically rejects all other bids**

---

## Real-time Features

### Socket.io Implementation (`server.js`)

**Server Setup:**
```javascript
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Store connected users
const connectedUsers = new Map();

io.on('connection', (socket) => {
  // Register user with their userId
  socket.on('register', (userId) => {
    connectedUsers.set(userId, socket.id);
  });

  socket.on('disconnect', () => {
    // Remove from connected users
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

// Make accessible to routes
app.set('io', io);
app.set('connectedUsers', connectedUsers);
```

**Sending Notifications (in hire flow):**
```javascript
const io = req.app.get('io');
const connectedUsers = req.app.get('connectedUsers');
const freelancerSocketId = connectedUsers.get(bid.freelancerId.toString());

if (freelancerSocketId) {
  io.to(freelancerSocketId).emit('hired', {
    message: `Congratulations! You have been hired for "${gig.title}"!`,
    gig: { _id: gig._id, title: gig.title },
  });
}
```

---

## Error Handling

### Global Error Handler (`server.js`)

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});
```

### Standard Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Environment Configuration

### Required Variables (`.env`)

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/gigflow

# JWT Secret (use strong random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Server Port
PORT=5000

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173

# Environment
NODE_ENV=development
```

### Configuration Usage

```javascript
import dotenv from 'dotenv';
dotenv.config();

// Access variables
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI;
```

---

## Running the Server

### Development
```bash
npm run dev   # Uses nodemon for hot-reload
```

### Production
```bash
npm start     # Direct node execution
```

---

## Security Considerations

1. **Password Hashing**: bcrypt with salt rounds
2. **HttpOnly Cookies**: Prevents XSS token theft
3. **SameSite Cookies**: Prevents CSRF attacks
4. **Input Validation**: Mongoose schema validation
5. **Transaction Integrity**: MongoDB sessions for atomic operations
6. **CORS Configuration**: Restricted to frontend origin

---

## Future Improvements

- [ ] Rate limiting for API endpoints
- [ ] Email verification on signup
- [ ] Password reset functionality
- [ ] File upload for gig attachments
- [ ] Pagination for gigs and bids
- [ ] Admin dashboard
- [ ] Payment integration
