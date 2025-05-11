import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdbApi from '../services/tmdbApi';

// Async thunks for API calls
export const fetchTrendingMovies = createAsyncThunk(
  'movies/fetchTrending',
  async ({ timeWindow = 'day', page = 1 }, { rejectWithValue }) => {
    try {
      const response = await tmdbApi.getTrending(timeWindow, page);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch trending movies');
    }
  }
);

export const searchMovies = createAsyncThunk(
  'movies/search',
  async ({ query, page = 1, replace = false, ...filters }, { rejectWithValue }) => {
    try {
      // Extract filter parameters
      const params = { query, page };
      
      // Add any filter parameters to the search
      if (filters.with_genres) params.with_genres = filters.with_genres;
      if (filters.year) params.year = filters.year;
      if (filters.vote_average_gte) params.vote_average_gte = filters.vote_average_gte;
      if (filters.vote_average_lte) params.vote_average_lte = filters.vote_average_lte;
      
      const response = await tmdbApi.searchMovies(query, params);
      return { ...response.data, replace };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to search movies');
    }
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchDetails',
  async (movieId, { rejectWithValue }) => {
    try {
      // Get movie details, credits and videos in parallel
      const [detailsResponse, creditsResponse, videosResponse] = await Promise.all([
        tmdbApi.getMovieDetails(movieId),
        tmdbApi.getMovieCredits(movieId),
        tmdbApi.getMovieVideos(movieId)
      ]);
      
      return {
        ...detailsResponse.data,
        credits: creditsResponse.data,
        videos: videosResponse.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch movie details');
    }
  }
);

export const fetchGenres = createAsyncThunk(
  'movies/fetchGenres',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tmdbApi.getGenres();
      return response.data.genres;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch genres');
    }
  }
);

// Discover movies with filters
export const discoverMovies = createAsyncThunk(
  'movies/discover',
  async ({ params, replace = false }, { rejectWithValue }) => {
    try {
      const response = await tmdbApi.discoverMovies(params);
      return { ...response.data, replace };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to discover movies');
    }
  }
);

const initialState = {
  trending: {
    data: [],
    page: 1,
    totalPages: 0,
    totalResults: 0,
    loading: false,
    error: null
  },
  search: {
    data: [],
    query: '',
    page: 1,
    totalPages: 0,
    totalResults: 0,
    loading: false,
    error: null
  },
  selectedMovie: {
    data: null,
    loading: false,
    error: null
  },
  favorites: [],
  genres: [],
  lastSearch: '',
  // Active filters for discovery
  activeFilters: {}
};

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    // Add a movie to favorites
    addToFavorites: (state, action) => {
      if (!state.favorites.find(movie => movie.id === action.payload.id)) {
        state.favorites.push(action.payload);
        // Save to localStorage
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
      }
    },
    // Remove a movie from favorites
    removeFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter(movie => movie.id !== action.payload);
      // Update localStorage
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    // Load favorites from localStorage
    loadFavorites: (state) => {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        state.favorites = JSON.parse(storedFavorites);
      }
    },
    // Load last search from localStorage
    loadLastSearch: (state) => {
      const lastSearch = localStorage.getItem('lastSearch');
      if (lastSearch) {
        state.lastSearch = lastSearch;
      }
    },
    // Clear search results
    clearSearchResults: (state) => {
      state.search.data = [];
      state.search.query = '';
      state.search.page = 1;
      state.search.totalPages = 0;
    },
    // Reset selected movie
    resetSelectedMovie: (state) => {
      state.selectedMovie.data = null;
    }
  },
  extraReducers: (builder) => {
    // Handle fetchTrendingMovies
    builder
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.trending.loading = true;
        state.trending.error = null;
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.trending.loading = false;
        const replace = action.meta.arg.replace || action.meta.arg.page === 1;
        
        // If it's the first page or replace flag is set, replace data, otherwise append
        if (replace) {
          state.trending.data = action.payload.results;
        } else {
          state.trending.data = [...state.trending.data, ...action.payload.results];
        }
        state.trending.page = action.payload.page;
        state.trending.totalPages = action.payload.total_pages;
        state.trending.totalResults = action.payload.total_results;
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.trending.loading = false;
        state.trending.error = action.payload || 'Failed to fetch trending movies';
      })
      
      // Handle discoverMovies
      .addCase(discoverMovies.pending, (state) => {
        state.trending.loading = true;
        state.trending.error = null;
      })
      .addCase(discoverMovies.fulfilled, (state, action) => {
        state.trending.loading = false;
        
        // If replace flag is set or it's page 1, replace data, otherwise append
        if (action.payload.replace || action.payload.page === 1) {
          state.trending.data = action.payload.results;
        } else {
          state.trending.data = [...state.trending.data, ...action.payload.results];
        }
        state.trending.page = action.payload.page;
        state.trending.totalPages = action.payload.total_pages;
        state.trending.totalResults = action.payload.total_results;
      })
      .addCase(discoverMovies.rejected, (state, action) => {
        state.trending.loading = false;
        state.trending.error = action.payload || 'Failed to discover movies';
      })

    // Handle searchMovies
      .addCase(searchMovies.pending, (state) => {
        state.search.loading = true;
        state.search.error = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.search.loading = false;
        const replace = action.payload.replace || action.meta.arg.page === 1;
        
        // If replace flag is set or it's page 1, replace data, otherwise append
        if (replace) {
          state.search.data = action.payload.results;
        } else {
          state.search.data = [...state.search.data, ...action.payload.results];
        }
        
        state.search.query = action.meta.arg.query;
        state.search.page = action.payload.page;
        state.search.totalPages = action.payload.total_pages;
        state.search.totalResults = action.payload.total_results;
        
        // Save last search query to localStorage
        state.lastSearch = action.meta.arg.query;
        localStorage.setItem('lastSearch', action.meta.arg.query);
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.search.loading = false;
        state.search.error = action.payload || 'Failed to search movies';
      })

    // Handle fetchMovieDetails
      .addCase(fetchMovieDetails.pending, (state) => {
        state.selectedMovie.loading = true;
        state.selectedMovie.error = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.selectedMovie.loading = false;
        state.selectedMovie.data = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.selectedMovie.loading = false;
        state.selectedMovie.error = action.payload || 'Failed to fetch movie details';
      })

    // Handle fetchGenres
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
      });
  }
});

export const { 
  addToFavorites, 
  removeFromFavorites, 
  loadFavorites,
  loadLastSearch,
  clearSearchResults,
  resetSelectedMovie
} = movieSlice.actions;

export default movieSlice.reducer;
