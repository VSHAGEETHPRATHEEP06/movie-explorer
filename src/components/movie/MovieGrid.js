import { useState } from 'react';
import { Grid, Box, Typography, Button, CircularProgress, Pagination } from '@mui/material';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import MovieCard from './MovieCard';

const MovieGrid = ({ 
  movies, 
  loading, 
  error, 
  hasMore, 
  loadMore,
  title,
  emptyMessage = 'No movies found',
  totalResults = 0,
  currentPage = 1
}) => {
  const [showPagination, setShowPagination] = useState(false);
  
  // Handle page change when using pagination
  const handlePageChange = (event, page) => {
    if (page !== currentPage) {
      // Scroll to top before loading new page
      window.scrollTo({ top: 0, behavior: 'smooth' });
      loadMore(page);
    }
  };
  
  // Toggle between "Load More" and pagination
  const togglePaginationMode = () => {
    setShowPagination(prev => !prev);
  };

  return (
    <Box sx={{ mt: 2 }}>
      {title && (
        <Typography variant="h4" component="h2" gutterBottom>
          {title}
        </Typography>
      )}
      
      {error && (
        <Typography color="error" sx={{ my: 2 }}>
          Error: {typeof error === 'object' ? 
            (error.status_message || error.message || JSON.stringify(error)) : 
            error}
        </Typography>
      )}
      
      {movies.length === 0 && !loading && !error && (
        <Typography sx={{ my: 4, textAlign: 'center' }}>
          {emptyMessage}
        </Typography>
      )}
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id} sx={{ mb: 1.5 }}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* Pagination Controls */}
      {!loading && movies.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
          {showPagination ? (
            <>
              <Pagination 
                count={Math.ceil(totalResults / 20)} // 20 items per page is TMDB default
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton 
                showLastButton
                sx={{ mb: 2 }}
              />
              <Button 
                onClick={togglePaginationMode} 
                variant="text" 
                color="primary"
                size="small"
              >
                Switch to Load More
              </Button>
            </>
          ) : (
            <>
              {hasMore && (
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => loadMore()}
                  disabled={loading}
                  size="large"
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{ py: 1.5, px: 4, borderRadius: 2 }}
                >
                  Load More Movies
                </Button>
              )}
              <Button 
                onClick={togglePaginationMode} 
                variant="text" 
                size="small"
                color="primary"
                sx={{ mt: 2 }}
              >
                Switch to Pagination
              </Button>
            </>
          )}
          
          {totalResults > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Showing {movies.length} of {totalResults} movies
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default MovieGrid;
