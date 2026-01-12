import mongoose from 'mongoose';
import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';

// @desc    Submit a bid for a gig
// @route   POST /api/bids
// @access  Private
export const createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    // Check if gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
    }

    // Check if gig is open
    if (gig.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This gig is no longer accepting bids',
      });
    }

    // Check if user is not bidding on their own gig
    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot bid on your own gig',
      });
    }

    // Check if user already bid on this gig
    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.user._id,
    });

    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a bid for this gig',
      });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price,
    });

    const populatedBid = await Bid.findById(bid._id)
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title');

    res.status(201).json({
      success: true,
      bid: populatedBid,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all bids for a specific gig (Owner only)
// @route   GET /api/bids/:gigId
// @access  Private (Gig Owner only)
export const getBidsForGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
    }

    // Check if user is the owner of the gig
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the gig owner can view bids',
      });
    }

    const bids = await Bid.find({ gigId: req.params.gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bids.length,
      bids,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Hire a freelancer (Atomic update with transaction)
// @route   PATCH /api/bids/:bidId/hire
// @access  Private (Gig Owner only)
export const hireBid = async (req, res) => {
  // Start a session for transaction (Bonus 1: Race Condition handling)
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the bid with session
    const bid = await Bid.findById(req.params.bidId).session(session);

    if (!bid) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Bid not found',
      });
    }

    // Find the gig with session
    const gig = await Gig.findById(bid.gigId).session(session);

    if (!gig) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
    }

    // Check if user is the owner of the gig
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message: 'Only the gig owner can hire',
      });
    }

    // Check if gig is still open (Race condition check)
    if (gig.status !== 'open') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'This gig has already been assigned',
      });
    }

    // Check if bid is still pending
    if (bid.status !== 'pending') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'This bid is no longer pending',
      });
    }

    // Update gig status to assigned
    gig.status = 'assigned';
    gig.hiredFreelancerId = bid.freelancerId;
    await gig.save({ session });

    // Update chosen bid status to hired
    bid.status = 'hired';
    await bid.save({ session });

    // Reject all other bids for this gig
    await Bid.updateMany(
      {
        gigId: gig._id,
        _id: { $ne: bid._id },
        status: 'pending',
      },
      { status: 'rejected' },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Get the hired freelancer info for notification
    const populatedBid = await Bid.findById(bid._id)
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title');

    // Bonus 2: Real-time notification via Socket.io
    const io = req.app.get('io');
    const connectedUsers = req.app.get('connectedUsers');
    const freelancerSocketId = connectedUsers.get(bid.freelancerId.toString());

    if (freelancerSocketId) {
      io.to(freelancerSocketId).emit('hired', {
        message: `Congratulations! You have been hired for "${gig.title}"!`,
        gig: {
          _id: gig._id,
          title: gig.title,
        },
      });
    }

    res.json({
      success: true,
      message: 'Freelancer hired successfully',
      bid: populatedBid,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's bids (as freelancer)
// @route   GET /api/bids/my-bids
// @access  Private
export const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user._id })
      .populate('gigId', 'title description budget status ownerId')
      .populate({
        path: 'gigId',
        populate: {
          path: 'ownerId',
          select: 'name email',
        },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bids.length,
      bids,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
