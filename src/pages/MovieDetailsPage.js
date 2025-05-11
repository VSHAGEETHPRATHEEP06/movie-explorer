import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Rating,
  Button,
  Divider,
  CircularProgress,
  IconButton,
  Tooltip,
  Card,
  CardMedia,
  CardContent,
  Skeleton,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  YouTube as YouTubeIcon
} from '@mui/icons-material';

import { fetchMovieDetails, addToFavorites, removeFromFavorites } from '../redux/movieSlice';
import { getImageUrl, BACKDROP_SIZES, POSTER_SIZES } from '../services/tmdbConfig';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  const { data: movie, loading, error } = useSelector((state) => state.movies.selectedMovie);
  const favorites = useSelector((state) => state.movies.favorites);
  
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [backdropLoaded, setBackdropLoaded] = useState(false);
  
  // Check if movie is in favorites
  const isFavorite = favorites.some((favMovie) => favMovie.id === Number(id));
  
  useEffect(() => {
    // Fetch movie details when component mounts or id changes
    if (id) {
      dispatch(fetchMovieDetails(id));
    }
    
    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, [dispatch, id]);
  
  // Handle back button click
  const handleBack = () => {
    navigate(-1);
  };
  
  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(Number(id)));
    } else if (movie) {
      dispatch(addToFavorites({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date
      }));
    }
  };
  
  // Get YouTube trailer
  const getTrailer = () => {
    if (movie?.videos?.results) {
      // Find official trailer or teaser
      const trailer = movie.videos.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      );
      return trailer || movie.videos.results[0];
    }
    return null;
  };
  
  // State to control trailer modal
  const [trailerOpen, setTrailerOpen] = useState(false);
  
  // Handle YouTube trailer display
  const handleWatchTrailer = () => {
    setTrailerOpen(true);
  };
  
  // Close trailer
  const handleCloseTrailer = () => {
    setTrailerOpen(false);
  };
  
  // Format runtime to hours and minutes
  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };
  
  // Format date to locale format
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <Box>
      {/* Back button */}
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={handleBack}
        sx={{ mb: 3, borderRadius: 2, pl: 1.5, pr: 2 }}
        variant="outlined"
        color="primary"
      >
        Back
      </Button>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          Error: {typeof error === 'object' ? 
            (error.status_message || error.message || JSON.stringify(error)) : 
            error}
        </Alert>
      )}
      
      {movie && !loading && (
        <>
          {/* Backdrop image */}
          <Box 
            sx={{ 
              position: 'relative',
              mb: 4,
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 3,
              height: { xs: 200, sm: 300, md: 400 }
            }}
          >
            {!backdropLoaded && (
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height="100%" 
              />
            )}
            
            <Box
              component="img"
              src={getImageUrl(movie.backdrop_path, BACKDROP_SIZES.ORIGINAL) || 'https://via.placeholder.com/1280x720?text=No+Backdrop'}
              alt={movie.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: backdropLoaded ? 'block' : 'none'
              }}
              onLoad={() => setBackdropLoaded(true)}
              onError={() => setBackdropLoaded(true)}
            />
            
            {/* Overlay gradient */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '70%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
              }}
            />
            
            {/* Movie title on backdrop */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 3,
                color: 'white',
              }}
            >
              <Typography variant="h4" component="h1" fontWeight="bold">
                {movie.title}
              </Typography>
              
              {movie.tagline && (
                <Typography variant="subtitle1" fontStyle="italic" sx={{ mt: 1 }}>
                  {movie.tagline}
                </Typography>
              )}
            </Box>
          </Box>
          
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {/* Movie poster and actions */}
            <Grid item xs={12} sm={4} md={3}>
              <Card sx={{ mb: 2 }}>
                {!posterLoaded && (
                  <Skeleton 
                    variant="rectangular" 
                    width="100%" 
                    height={0}
                    sx={{ paddingTop: '150%' }}
                  />
                )}
                
                <CardMedia
                  component="img"
                  image={getImageUrl(movie.poster_path, POSTER_SIZES.LARGE) || 'https://via.placeholder.com/500x750?text=No+Poster'}
                  alt={movie.title}
                  sx={{ 
                    aspectRatio: '2/3',
                    display: posterLoaded ? 'block' : 'none'
                  }}
                  onLoad={() => setPosterLoaded(true)}
                  onError={() => setPosterLoaded(true)}
                />
              </Card>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  onClick={handleFavoriteToggle}
                  color={isFavorite ? "secondary" : "primary"}
                  fullWidth
                >
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
                
                {getTrailer() && (
                  <Button
                    variant="outlined"
                    startIcon={<YouTubeIcon />}
                    onClick={handleWatchTrailer}
                    fullWidth
                  >
                    Watch Trailer
                  </Button>
                )}
              </Box>
            </Grid>
            
            {/* Movie details */}
            <Grid item xs={12} sm={8} md={9}>
              {/* Ratings and general info */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating
                      value={movie.vote_average / 2} // Convert to 5-star scale
                      precision={0.5}
                      readOnly
                    />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {(movie.vote_average / 2).toFixed(1)}/5 ({movie.vote_count} votes)
                    </Typography>
                  </Box>
                  
                  <Divider orientation="vertical" flexItem />
                  
                  <Typography variant="body1">
                    Release: {formatDate(movie.release_date)}
                  </Typography>
                  
                  <Divider orientation="vertical" flexItem />
                  
                  <Typography variant="body1">
                    Runtime: {formatRuntime(movie.runtime)}
                  </Typography>
                </Box>
                
                {/* Genres */}
                <Box sx={{ mb: 2 }}>
                  {movie.genres && movie.genres.map((genre) => (
                    <Chip
                      key={genre.id}
                      label={genre.name}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
                
                {/* Overview */}
                <Typography variant="h6" gutterBottom>
                  Overview
                </Typography>
                <Typography variant="body1" paragraph>
                  {movie.overview || 'No overview available.'}
                </Typography>
              </Paper>
              
              {/* Cast */}
              {movie.credits && movie.credits.cast && movie.credits.cast.length > 0 && (
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Cast
                  </Typography>
                  <Grid container spacing={2}>
                    {movie.credits.cast.slice(0, 6).map((person) => (
                      <Grid item xs={6} sm={4} md={2} key={person.id}>
                        <Card sx={{ height: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: 2 }}>
                          <CardMedia
                            component="img"
                            image={getImageUrl(person.profile_path) || 'https://via.placeholder.com/185x278?text=No+Image'}
                            alt={person.name}
                            sx={{ aspectRatio: '2/3' }}
                          />
                          <CardContent sx={{ p: 1 }}>
                            <Typography variant="subtitle2" noWrap title={person.name}>
                              {person.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap title={person.character}>
                              {person.character}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              )}
              
              {/* Additional info */}
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
                <Grid container spacing={2}>
                  {movie.production_companies && movie.production_companies.length > 0 && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom>
                        Production Companies
                      </Typography>
                      <Typography variant="body2">
                        {movie.production_companies.map(company => company.name).join(', ')}
                      </Typography>
                    </Grid>
                  )}
                  
                  {movie.production_countries && movie.production_countries.length > 0 && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom>
                        Production Countries
                      </Typography>
                      <Typography variant="body2">
                        {movie.production_countries.map(country => country.name).join(', ')}
                      </Typography>
                    </Grid>
                  )}
                  
                  {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom>
                        Languages
                      </Typography>
                      <Typography variant="body2">
                        {movie.spoken_languages.map(language => language.english_name).join(', ')}
                      </Typography>
                    </Grid>
                  )}
                  
                  {movie.budget > 0 && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom>
                        Budget
                      </Typography>
                      <Typography variant="body2">
                        ${movie.budget.toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                  
                  {movie.revenue > 0 && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom>
                        Revenue
                      </Typography>
                      <Typography variant="body2">
                        ${movie.revenue.toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
      
      {/* Trailer Dialog */}
      <Dialog
        open={trailerOpen}
        onClose={handleCloseTrailer}
        maxWidth="xl"
        fullWidth
        fullScreen={fullScreen}
        aria-labelledby="movie-trailer-dialog"
      >
        <DialogTitle id="movie-trailer-dialog">
          {movie?.title} - Trailer
        </DialogTitle>
        <DialogContent dividers>
          {getTrailer() ? (
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%', // 16:9 Aspect Ratio
                overflow: 'hidden',
                borderRadius: 1,
                boxShadow: 2,
                backgroundColor: 'black'
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${getTrailer()?.key}?autoplay=1`}
                title={`${movie?.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
              />
            </Box>
          ) : (
            <Typography variant="body1" sx={{ py: 4, textAlign: 'center' }}>
              No trailer available for this movie.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTrailer}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MovieDetailsPage;
