import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MovieGrid from '../components/movie/MovieGrid';
import { loadFavorites } from '../redux/movieSlice';

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { favorites } = useSelector((state) => state.movies);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  useEffect(() => {
    // Load favorites from localStorage
    dispatch(loadFavorites());
  }, [dispatch]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/favorites' } });
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Favorite Movies
      </Typography>
      
      <MovieGrid
        movies={favorites}
        loading={false}
        error={null}
        hasMore={false}
        loadMore={() => {}}
        emptyMessage="You haven't added any movies to your favorites yet."
      />
      
      {favorites.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
          >
            Explore Trending Movies
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FavoritesPage;
