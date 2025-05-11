// TMDB API Configuration
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image sizes for posters
export const POSTER_SIZES = {
  SMALL: 'w185',
  MEDIUM: 'w342',
  LARGE: 'w500',
  ORIGINAL: 'original'
};

// Image sizes for backdrops
export const BACKDROP_SIZES = {
  SMALL: 'w300',
  MEDIUM: 'w780',
  LARGE: 'w1280',
  ORIGINAL: 'original'
};

// Get full image URL
export const getImageUrl = (path, size = POSTER_SIZES.MEDIUM) => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

// To use the TMDB API, you'll need to obtain an API key from:
// https://www.themoviedb.org/settings/api
// Once you have the API key, create a .env file in the root of your project and add:
// REACT_APP_TMDB_API_KEY=your_api_key_here
