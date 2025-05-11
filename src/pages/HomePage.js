import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import MovieGrid from '../components/movie/MovieGrid';
import MovieFilter from '../components/movie/MovieFilter';
import { fetchTrendingMovies, fetchGenres, discoverMovies } from '../redux/movieSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const { data, loading, error, page, totalPages, totalResults } = useSelector((state) => state.movies.trending);
  const genres = useSelector((state) => state.movies.genres);
  
  // State for trending time periods
  const [timeWindow, setTimeWindow] = useState('day');
  
  // State for filters
  const [activeFilters, setActiveFilters] = useState({});
  const [isFiltered, setIsFiltered] = useState(false);
  
  useEffect(() => {
    // Fetch trending movies when component mounts
    if (data.length === 0) {
      dispatch(fetchTrendingMovies({ timeWindow, page: 1 }));
    }
    
    // Fetch genres for filtering if not already loaded
    if (genres.length === 0) {
      dispatch(fetchGenres());
    }
  }, [dispatch, data.length, genres.length, timeWindow]);
  
  const handleTimeWindowChange = (event, newValue) => {
    setTimeWindow(newValue);
    setIsFiltered(false);
    setActiveFilters({});
    dispatch(fetchTrendingMovies({ timeWindow: newValue, page: 1 }));
  };
  
  const loadMoreMovies = (specificPage) => {
    const pageToLoad = specificPage || page + 1;
    
    if (isFiltered) {
      // If filters are active, use discover endpoint
      const params = {
        page: pageToLoad,
        ...createDiscoverParams(activeFilters)
      };
      dispatch(discoverMovies({ params, replace: specificPage ? true : false }));
    } else {
      // Otherwise load trending
      dispatch(fetchTrendingMovies({ 
        timeWindow, 
        page: pageToLoad,
        replace: specificPage ? true : false
      }));
    }
  };
  
  // Create params for discover API
  const createDiscoverParams = (filters) => {
    const params = { sort_by: 'popularity.desc' };
    
    if (filters.genre) {
      params.with_genres = filters.genre;
    }
    
    if (filters.year) {
      params.primary_release_year = filters.year;
    }
    
    if (filters.rating && (filters.rating[0] > 0 || filters.rating[1] < 10)) {
      params.vote_average_gte = filters.rating[0];
      params.vote_average_lte = filters.rating[1];
    }
    
    return params;
  };
  
  // Handle filter changes
  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    
    // If there are active filters, use discover endpoint
    if (Object.keys(filters).length > 0) {
      setIsFiltered(true);
      const params = createDiscoverParams(filters);
      dispatch(discoverMovies({ params, replace: true }));
    } else {
      // If filters are cleared, revert to trending
      setIsFiltered(false);
      dispatch(fetchTrendingMovies({ timeWindow, page: 1 }));
    }
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setActiveFilters({});
    setIsFiltered(false);
    dispatch(fetchTrendingMovies({ timeWindow, page: 1 }));
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {isFiltered ? 'Discover Movies' : 'Trending Movies'}
      </Typography>
      
      {/* Trending time period tabs */}
      {!isFiltered && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={timeWindow} 
            onChange={handleTimeWindowChange}
            aria-label="trending time period"
          >
            <Tab label="Today" value="day" />
            <Tab label="This Week" value="week" />
          </Tabs>
        </Box>
      )}
      
      {/* Filter component */}
      <MovieFilter 
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        activeFilters={activeFilters}
      />
      
      <MovieGrid
        movies={data}
        loading={loading}
        error={error}
        hasMore={page < totalPages}
        loadMore={loadMoreMovies}
        emptyMessage={isFiltered ? "No movies match your filters. Try changing your criteria." : "No trending movies found. Please try again later."}
        totalResults={totalResults}
        currentPage={page}
      />
    </Box>
  );
};

export default HomePage;
