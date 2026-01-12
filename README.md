# GigFlow - Mini Freelance Marketplace

A full-stack freelance marketplace platform where clients can post jobs (Gigs) and freelancers can apply for them (Bids).

## 🚀 Features

- **User Authentication**: Secure signup/login with JWT HttpOnly cookies
- **Gig Management**: Create, browse, search, and manage job postings
- **Bidding System**: Freelancers can submit bids with price and proposal
- **Hiring Logic**: Atomic hire operation with transactional integrity
- **Real-time Notifications**: Socket.io integration for instant hire notifications
- **Responsive Design**: Modern UI with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- Redux Toolkit
- React Router DOM
- Socket.io Client
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Socket.io
- bcryptjs

## 📁 Project Structure

```
GigFlow/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── gig.controller.js
│   │   └── bid.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Gig.js
│   │   └── Bid.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── gig.routes.js
│   │   └── bid.routes.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## 📡 API Endpoints

| Category | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| Auth | POST | `/api/auth/register` | Register new user |
| Auth | POST | `/api/auth/login` | Login & set HttpOnly Cookie |
| Auth | POST | `/api/auth/logout` | Logout user |
| Auth | GET | `/api/auth/me` | Get current user |
| Gigs | GET | `/api/gigs` | Fetch all open gigs (with search) |
| Gigs | GET | `/api/gigs/:id` | Get single gig |
| Gigs | POST | `/api/gigs` | Create a new job post |
| Gigs | PUT | `/api/gigs/:id` | Update a gig |
| Gigs | DELETE | `/api/gigs/:id` | Delete a gig |
| Gigs | GET | `/api/gigs/user/my-gigs` | Get user's posted gigs |
| Bids | POST | `/api/bids` | Submit a bid for a gig |
| Bids | GET | `/api/bids/:gigId` | Get all bids for a gig (Owner only) |
| Bids | PATCH | `/api/bids/:bidId/hire` | Hire a freelancer (Atomic) |
| Bids | GET | `/api/bids/my-bids` | Get user's submitted bids |

## 🔐 Bonus Features Implemented

### Bonus 1: Transactional Integrity (Race Conditions)
The hire logic uses MongoDB transactions to ensure atomic updates. If two people click "Hire" simultaneously on different freelancers, only one will succeed.

```javascript
// Uses mongoose session for transaction
const session = await mongoose.startSession();
session.startTransaction();
// ... atomic operations
await session.commitTransaction();
```

### Bonus 2: Real-time Updates (Socket.io)
When a client hires a freelancer, the freelancer receives an instant notification without refreshing the page.

## 📊 Database Schema

### User
- `name`: String (required)
- `email`: String (unique, required)
- `password`: String (hashed, required)

### Gig
- `title`: String (required)
- `description`: String (required)
- `budget`: Number (required)
- `ownerId`: ObjectId (ref: User)
- `status`: Enum ['open', 'assigned']
- `hiredFreelancerId`: ObjectId (ref: User)

### Bid
- `gigId`: ObjectId (ref: Gig)
- `freelancerId`: ObjectId (ref: User)
- `message`: String (required)
- `price`: Number (required)
- `status`: Enum ['pending', 'hired', 'rejected']

## 👤 Author

Sanskar Lohani

## 📝 License

MIT
