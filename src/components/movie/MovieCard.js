import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Rating,
  Tooltip,
  Skeleton
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Info as InfoIcon
} from '@mui/icons-material';

import { getImageUrl } from '../../services/tmdbConfig';
import { addToFavorites, removeFromFavorites } from '../../redux/movieSlice';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const favorites = useSelector((state) => state.movies.favorites);
  const isFavorite = favorites.some((favMovie) => favMovie.id === movie.id);
  
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average / 2 : 0; // Convert to 5-star scale
  
  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent card click
    if (isFavorite) {
      dispatch(removeFromFavorites(movie.id));
    } else {
      dispatch(addToFavorites(movie));
    }
  };
  
  const handleInfoClick = (e) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/movie/${movie.id}`);
  };
  
  return (
    <Card 
      elevation={2}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        borderRadius: 2,
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 6,
          cursor: 'pointer'
        } 
      }}
      onClick={handleCardClick}
    >
      {!imageLoaded && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={0}
          sx={{ 
            paddingTop: '150%', // 2:3 aspect ratio
            bgcolor: 'grey.800'
          }}
        />
      )}
      
      <CardMedia
        component="img"
        image={getImageUrl(movie.poster_path) || 'https://via.placeholder.com/300x450?text=No+Image'}
        alt={movie.title}
        sx={{ 
          aspectRatio: '2/3',
          display: imageLoaded ? 'block' : 'none'
        }}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageLoaded(true)}
      />
      
      <CardContent sx={{ flexGrow: 1, pb: 0 }}>
        <Typography variant="h6" component="div" noWrap title={movie.title}>
          {movie.title}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {releaseYear}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(0, 0, 0, 0.04)', px: 1, py: 0.5, borderRadius: 1 }}>
            <Rating 
              value={rating} 
              precision={0.5} 
              size="small" 
              readOnly 
            />
            <Typography variant="body2" color="primary" sx={{ ml: 0.5, fontWeight: 'medium' }}>
              {rating.toFixed(1)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      
      <CardActions disableSpacing>
        <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
          <IconButton 
            aria-label={isFavorite ? "remove from favorites" : "add to favorites"}
            onClick={handleFavoriteClick}
            color={isFavorite ? "secondary" : "default"}
          >
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Tooltip>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Tooltip title="View details">
          <IconButton 
            aria-label="view details"
            onClick={handleInfoClick}
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default MovieCard;
