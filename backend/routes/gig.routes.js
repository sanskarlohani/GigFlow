import express from 'express';
import {
  getGigs,
  getGig,
  createGig,
  updateGig,
  deleteGig,
  getMyGigs,
} from '../controllers/gig.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getGigs);
router.get('/:id', getGig);

// Protected routes
router.post('/', protect, createGig);
router.put('/:id', protect, updateGig);
router.delete('/:id', protect, deleteGig);
router.get('/user/my-gigs', protect, getMyGigs);

export default router;
