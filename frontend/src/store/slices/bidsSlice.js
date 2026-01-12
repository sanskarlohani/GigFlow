import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bidsAPI } from '../../services/api';

const initialState = {
  bids: [],
  myBids: [],
  isLoading: false,
  error: null,
};

export const createBid = createAsyncThunk(
  'bids/create',
  async (bidData, { rejectWithValue }) => {
    try {
      const response = await bidsAPI.create(bidData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit bid');
    }
  }
);

export const fetchBidsForGig = createAsyncThunk(
  'bids/fetchForGig',
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await bidsAPI.getForGig(gigId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bids');
    }
  }
);

export const hireBid = createAsyncThunk(
  'bids/hire',
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await bidsAPI.hire(bidId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to hire');
    }
  }
);

export const fetchMyBids = createAsyncThunk(
  'bids/fetchMyBids',
  async (_, { rejectWithValue }) => {
    try {
      const response = await bidsAPI.getMyBids();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your bids');
    }
  }
);

const bidsSlice = createSlice({
  name: 'bids',
  initialState,
  reducers: {
    clearBids: (state) => {
      state.bids = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create bid
      .addCase(createBid.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBid.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bids.push(action.payload.bid);
      })
      .addCase(createBid.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch bids for gig
      .addCase(fetchBidsForGig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBidsForGig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bids = action.payload.bids;
      })
      .addCase(fetchBidsForGig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Hire bid
      .addCase(hireBid.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(hireBid.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the hired bid and reject others
        state.bids = state.bids.map((bid) => {
          if (bid._id === action.payload.bid._id) {
            return { ...bid, status: 'hired' };
          }
          return { ...bid, status: 'rejected' };
        });
      })
      .addCase(hireBid.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch my bids
      .addCase(fetchMyBids.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyBids.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBids = action.payload.bids;
      })
      .addCase(fetchMyBids.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBids, clearError } = bidsSlice.actions;
export default bidsSlice.reducer;
