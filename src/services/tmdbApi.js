import axios from 'axios';
import { TMDB_BASE_URL } from './tmdbConfig';

// Create an axios instance with default configurations
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
});

// Add request interceptor to include API key with every request
tmdbApi.interceptors.request.use((config) => {
  // Get API key from environment variables
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;
  
  // Add API key to query parameters
  config.params = {
    ...config.params,
    api_key: apiKey,
  };
  
  return config;
});

// API endpoints
const endpoints = {
  // Get trending movies
  getTrending: (timeWindow = 'day', page = 1) => 
    tmdbApi.get(`/trending/movie/${timeWindow}`, { params: { page } }),
  
  // Search movies by query with optional filters
  searchMovies: (query, params = {}) => 
    tmdbApi.get('/search/movie', { params }),
  
  // Get movie details
  getMovieDetails: (movieId) => 
    tmdbApi.get(`/movie/${movieId}`),
  
  // Get movie credits (cast and crew)
  getMovieCredits: (movieId) => 
    tmdbApi.get(`/movie/${movieId}/credits`),
  
  // Get movie videos (trailers, teasers, etc.)
  getMovieVideos: (movieId) => 
    tmdbApi.get(`/movie/${movieId}/videos`),
  
  // Get movie recommendations
  getMovieRecommendations: (movieId, page = 1) => 
    tmdbApi.get(`/movie/${movieId}/recommendations`, { params: { page } }),
  
  // Get genres list
  getGenres: () => 
    tmdbApi.get('/genre/movie/list'),
  
  // Discover movies with filters
  discoverMovies: (params) => 
    tmdbApi.get('/discover/movie', { params }),
};

export default endpoints;
