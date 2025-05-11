import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Divider } from '@mui/material';
import MovieGrid from '../components/movie/MovieGrid';
import MovieFilter from '../components/movie/MovieFilter';
import { searchMovies, fetchGenres } from '../redux/movieSlice';

const SearchPage = () => {
  const dispatch = useDispatch();
  const { data, loading, error, query, page, totalPages, totalResults } = useSelector((state) => state.movies.search);
  const genres = useSelector((state) => state.movies.genres);
  
  // State for filters
  const [activeFilters, setActiveFilters] = useState({});
  
  useEffect(() => {
    // If no search query, use last search from localStorage
    if (!query && localStorage.getItem('lastSearch')) {
      const lastSearch = localStorage.getItem('lastSearch');
      dispatch(searchMovies({ query: lastSearch, page: 1 }));
    }
    
    // Fetch genres for filtering if not already loaded
    if (genres.length === 0) {
      dispatch(fetchGenres());
    }
  }, [dispatch, query, genres.length]);
  
  const loadMoreMovies = (specificPage) => {
    const pageToLoad = specificPage || page + 1;
    
    // Add active filters to the search params
    const searchParams = { query, page: pageToLoad, replace: specificPage ? true : false };
    
    // For filtering search results we need to use the with_genres parameter
    if (activeFilters.genre) {
      searchParams.with_genres = activeFilters.genre;
    }
    
    // Year filtering
    if (activeFilters.year) {
      searchParams.year = activeFilters.year;
    }
    
    // Rating filtering
    if (activeFilters.rating && (activeFilters.rating[0] > 0 || activeFilters.rating[1] < 10)) {
      searchParams.vote_average_gte = activeFilters.rating[0];
      searchParams.vote_average_lte = activeFilters.rating[1];
    }
    
    dispatch(searchMovies(searchParams));
  };
  
  // Handle filter changes
  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    
    // Apply filters to current search
    const searchParams = { query, page: 1, replace: true };
    
    if (filters.genre) {
      searchParams.with_genres = filters.genre;
    }
    
    if (filters.year) {
      searchParams.year = filters.year;
    }
    
    if (filters.rating && (filters.rating[0] > 0 || filters.rating[1] < 10)) {
      searchParams.vote_average_gte = filters.rating[0];
      searchParams.vote_average_lte = filters.rating[1];
    }
    
    dispatch(searchMovies(searchParams));
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setActiveFilters({});
    dispatch(searchMovies({ query, page: 1, replace: true }));
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {query ? `Search Results for "${query}"` : 'Search Results'}
      </Typography>
      
      {data.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          
          {/* Filter component */}
          <MovieFilter 
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            activeFilters={activeFilters}
          />
        </>
      )}
      
      <MovieGrid
        movies={data}
        loading={loading}
        error={error}
        hasMore={page < totalPages}
        loadMore={loadMoreMovies}
        emptyMessage={query ? `No movies found for "${query}"` : "Search for movies using the search bar above"}
        totalResults={totalResults}
        currentPage={page}
      />
    </Box>
  );
};

export default SearchPage;
