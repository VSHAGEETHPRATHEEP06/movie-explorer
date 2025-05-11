import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  InputBase, 
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  alpha,
  styled
} from '@mui/material';
import {
  Search as SearchIcon,
  Movie as MovieIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  AccountCircle,
  Favorite as FavoriteIcon
} from '@mui/icons-material';

import { toggleThemeMode } from '../../redux/themeSlice';
import { searchMovies, clearSearchResults } from '../../redux/movieSlice';
import { logout } from '../../redux/authSlice';

// Styled search component
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { lastSearch, favorites } = useSelector((state) => state.movies);
  const { mode: themeMode } = useSelector((state) => state.theme);
  
  const [searchQuery, setSearchQuery] = useState(lastSearch || '');
  const [anchorEl, setAnchorEl] = useState(null);

  // Handle menu open/close
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(clearSearchResults());
      dispatch(searchMovies({ query: searchQuery, page: 1 }));
      navigate('/search');
    }
  };

  // Handle logout
  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout());
    navigate('/');
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    dispatch(toggleThemeMode());
  };

  // Navigate to favorites
  const handleFavoritesClick = () => {
    navigate('/favorites');
  };

  // Navigate to home/trending
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleLogoClick}>
          <MovieIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Movie Explorer
          </Typography>
        </Box>

        {/* Mobile Logo */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <MovieIcon />
        </Box>
        <Typography
          variant="h6"
          noWrap
          sx={{
            mr: 2,
            display: { xs: 'flex', md: 'none' },
            flexGrow: 1,
            fontWeight: 700,
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          Movies
        </Typography>

        {/* Search Bar */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <form onSubmit={handleSearch}>
            <StyledInputBase
              placeholder="Search movies…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </Search>

        <Box sx={{ flexGrow: 1 }} />

        {/* Theme Toggle */}
        <Tooltip title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
          <IconButton onClick={handleThemeToggle} color="inherit">
            {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>

        {/* Favorites Button */}
        <Tooltip title="Favorites">
          <IconButton onClick={handleFavoritesClick} color="inherit">
            <Badge badgeContent={favorites.length} color="secondary">
              <FavoriteIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User Menu / Login Button */}
        {isAuthenticated ? (
          <>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleMenuOpen}
                size="large"
                edge="end"
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {user?.username?.charAt(0).toUpperCase() || <AccountCircle />}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleMenuClose}>
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/login"
            sx={{ ml: 1 }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
