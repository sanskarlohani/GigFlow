import express from 'express';
import {
  createBid,
  getBidsForGig,
  hireBid,
  getMyBids,
} from '../controllers/bid.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', createBid);
router.get('/my-bids', getMyBids);
router.get('/:gigId', getBidsForGig);
router.patch('/:bidId/hire', hireBid);

export default router;
