import Gig from '../models/Gig.js';

// @desc    Get all open gigs (with search)
// @route   GET /api/gigs
// @access  Public
export const getGigs = async (req, res) => {
  try {
    const { search, status = 'open' } = req.query;

    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search by title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const gigs = await Gig.find(query)
      .populate('ownerId', 'name email')
      .populate('hiredFreelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: gigs.length,
      gigs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single gig
// @route   GET /api/gigs/:id
// @access  Public
export const getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('ownerId', 'name email')
      .populate('hiredFreelancerId', 'name email');

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
    }

    res.json({
      success: true,
      gig,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new gig
// @route   POST /api/gigs
// @access  Private
export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id,
    });

    const populatedGig = await Gig.findById(gig._id).populate('ownerId', 'name email');

    res.status(201).json({
      success: true,
      gig: populatedGig,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update gig
// @route   PUT /api/gigs/:id
// @access  Private (Owner only)
export const updateGig = async (req, res) => {
  try {
    let gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
    }

    // Check ownership
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this gig',
      });
    }

    // Cannot update if already assigned
    if (gig.status === 'assigned') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update an assigned gig',
      });
    }

    const { title, description, budget } = req.body;

    gig = await Gig.findByIdAndUpdate(
      req.params.id,
      { title, description, budget },
      { new: true, runValidators: true }
    ).populate('ownerId', 'name email');

    res.json({
      success: true,
      gig,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete gig
// @route   DELETE /api/gigs/:id
// @access  Private (Owner only)
export const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
    }

    // Check ownership
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this gig',
      });
    }

    // Cannot delete if already assigned
    if (gig.status === 'assigned') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete an assigned gig',
      });
    }

    await gig.deleteOne();

    res.json({
      success: true,
      message: 'Gig deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's posted gigs
// @route   GET /api/gigs/my-gigs
// @access  Private
export const getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ ownerId: req.user._id })
      .populate('ownerId', 'name email')
      .populate('hiredFreelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: gigs.length,
      gigs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
