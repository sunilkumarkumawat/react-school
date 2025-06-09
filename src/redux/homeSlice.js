import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch top projects data
export const fetchTopProjects = createAsyncThunk(
  'home/fetchTopProjects',
  async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getTopProjects`);
    if (!response.ok) {
      throw new Error('Failed to fetch top projects');
    }
    const data = await response.json();
    return data.data; // Assuming the response contains the `topProjects` array
  }
);

export const fetchPlotTopProjects = createAsyncThunk(
  'home/fetchPlotTopProjects',
  async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getPlotTopProjects`);
    if (!response.ok) {
      throw new Error('Failed to fetch plot top projects');
    }
    const data = await response.json();
    return data.data; // Assuming the response contains the `topProjects` array
  }
);

export const fetchCommercialTopProjects = createAsyncThunk(
  'home/fetchCommercialTopProjects',
  async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getCommercialTopProjects`);
    if (!response.ok) {
      throw new Error('Failed to fetch commercial top projects');
    }
    const data = await response.json();
    return data.data; // Assuming the response contains the `topProjects` array
  }
);


// Async thunk to fetch premium projects data
export const fetchPremiumProjects = createAsyncThunk(
  'home/fetchPremiumProjects',
  async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getPremiumProjects`);
    if (!response.ok) {
      throw new Error('Failed to fetch premium projects');
    }
    const data = await response.json();
    return data.data; // Assuming the response contains the `premiumProjects` array
  }
);
// Async thunk to fetch premium projects data
export const fetchPlotPremiumProjects = createAsyncThunk(
  'home/fetchPlotPremiumProjects',
  async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getPlotPremiumProjects`);
    if (!response.ok) {
      throw new Error('Failed to fetch plot premium projects');
    }
    const data = await response.json();
    return data.data; // Assuming the response contains the `premiumProjects` array
  }
);
// Async thunk to fetch commercial sell premium projects data
export const fetchCommercialSellProjects = createAsyncThunk(
  'home/fetchCommercialSellProjects',
  async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getCommercialSellProjects`);
    if (!response.ok) {
      throw new Error('Failed to fetch commerical sell projects');
    }
    const data = await response.json();
    return data.data; // Assuming the response contains the `premiumProjects` array
  }
);
// Async thunk to fetch commercial rent premium projects data
export const fetchCommercialRentProjects = createAsyncThunk(
  'home/fetchCommercialRentProjects',
  async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getCommercialRentProjects`);
    if (!response.ok) {
      throw new Error('Failed to fetch commerical sell projects');
    }
    const data = await response.json();
    return data.data; // Assuming the response contains the `premiumProjects` array
  }
);

export const fetchAffordableProjects = createAsyncThunk(
  'home/fetchAffordableProjects',
  async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getAffordableProjects`);
    if (!response.ok) {
      throw new Error('Failed to fetch premium projects');
    }
    const data = await response.json();
    return data.data; // Assuming the response contains the `premiumProjects` array
  }
);

export const fetchRentAffordableProjects = createAsyncThunk(
  'home/fetchRentAffordableProjects',
  async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getAffordableProjects?query=rent`);
    if (!response.ok) {
      throw new Error('Failed to fetch Rent Affordable Projects');
    }
    const data = await response.json();
    return data.data; // Assuming the response contains the `premiumProjects` array
  }
);
// export const fetchRentAffordableProjects = createAsyncThunk(
//   'home/fetchRentAffordableProjects',
//   async () => {
//     const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getRentAffordableProjects`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch Rent Affordable Projects');
//     }
//     const data = await response.json();
//     return data.data; // Assuming the response contains the `premiumProjects` array
//   }
// );

export const fetchPlotAffordableProjects = createAsyncThunk(
  'home/fetchPlotAffordableProjects',
  async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getPlotAffordableProjects`);
    if (!response.ok) {
      throw new Error('Failed to fetch Rent Affordable Projects');
    }
    const data = await response.json();
    return data.data; // Assuming the response contains the `premiumProjects` array
  }
);

// Initial state for home data
const initialState = {
  topProjects: [],
  plotTopProjects: [],
  commercialTopProjects: [],
  premiumProjects: [],
  plotPremiumProjects: [],
  commercialRentProjects: [],
  commercialSellProjects: [],
  affordableProjects: [],
  rentAffordableProjects: [],
  plotAffordableProjects: [],
  status: 'idle', // idle, loading, succeeded, failed
  error: null,
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Top Projects
      .addCase(fetchTopProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTopProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.topProjects = action.payload; // Set fetched top projects
      })
      .addCase(fetchTopProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Fetch Plot Top Projects
      .addCase(fetchPlotTopProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlotTopProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.plotTopProjects = action.payload; // Set fetched top projects
      })
      .addCase(fetchPlotTopProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Fetch Commercial Top Projects
      .addCase(fetchCommercialTopProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCommercialTopProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.commercialTopProjects = action.payload; // Set fetched top projects
      })
      .addCase(fetchCommercialTopProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Fetch Premium Projects
      .addCase(fetchPremiumProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPremiumProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.premiumProjects = action.payload; // Set fetched premium projects
      })
      .addCase(fetchPremiumProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Fetch Plot Premium Projects
      .addCase(fetchPlotPremiumProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlotPremiumProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.plotPremiumProjects = action.payload; // Set fetched premium projects
      })
      .addCase(fetchPlotPremiumProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Fetch commercial sell Projects
      .addCase(fetchCommercialSellProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCommercialSellProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.commercialSellProjects = action.payload; // Set fetched premium projects
      })
      .addCase(fetchCommercialSellProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Fetch commercial rent Projects
      .addCase(fetchCommercialRentProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCommercialRentProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.commercialRentProjects = action.payload; // Set fetched premium projects
      })
      .addCase(fetchCommercialRentProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Fetch Affordable Projects
      .addCase(fetchAffordableProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAffordableProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.affordableProjects = action.payload; // Set fetched premium projects
      })
      .addCase(fetchAffordableProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

       // Fetch Rent Affordable Projects
       .addCase(fetchRentAffordableProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRentAffordableProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rentAffordableProjects = action.payload; // Set fetched premium projects
      })
      .addCase(fetchRentAffordableProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

       // Fetch Plot Affordable Projects
       .addCase(fetchPlotAffordableProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlotAffordableProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.plotAffordableProjects = action.payload; // Set fetched premium projects
      })
      .addCase(fetchPlotAffordableProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default homeSlice.reducer;
