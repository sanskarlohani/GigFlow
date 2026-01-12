import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { gigsAPI } from '../../services/api';

const initialState = {
  gigs: [],
  currentGig: null,
  myGigs: [],
  isLoading: false,
  error: null,
};

export const fetchGigs = createAsyncThunk(
  'gigs/fetchAll',
  async (search = '', { rejectWithValue }) => {
    try {
      const response = await gigsAPI.getAll(search);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gigs');
    }
  }
);

export const fetchGig = createAsyncThunk(
  'gigs/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await gigsAPI.getOne(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gig');
    }
  }
);

export const createGig = createAsyncThunk(
  'gigs/create',
  async (gigData, { rejectWithValue }) => {
    try {
      const response = await gigsAPI.create(gigData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create gig');
    }
  }
);

export const fetchMyGigs = createAsyncThunk(
  'gigs/fetchMyGigs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await gigsAPI.getMyGigs();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your gigs');
    }
  }
);

export const deleteGig = createAsyncThunk(
  'gigs/delete',
  async (id, { rejectWithValue }) => {
    try {
      await gigsAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete gig');
    }
  }
);

const gigsSlice = createSlice({
  name: 'gigs',
  initialState,
  reducers: {
    clearCurrentGig: (state) => {
      state.currentGig = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all gigs
      .addCase(fetchGigs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGigs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gigs = action.payload.gigs;
      })
      .addCase(fetchGigs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch single gig
      .addCase(fetchGig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGig = action.payload.gig;
      })
      .addCase(fetchGig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create gig
      .addCase(createGig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gigs.unshift(action.payload.gig);
      })
      .addCase(createGig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch my gigs
      .addCase(fetchMyGigs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyGigs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myGigs = action.payload.gigs;
      })
      .addCase(fetchMyGigs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete gig
      .addCase(deleteGig.fulfilled, (state, action) => {
        state.myGigs = state.myGigs.filter((gig) => gig._id !== action.payload);
        state.gigs = state.gigs.filter((gig) => gig._id !== action.payload);
      });
  },
});

export const { clearCurrentGig, clearError } = gigsSlice.actions;
export default gigsSlice.reducer;
