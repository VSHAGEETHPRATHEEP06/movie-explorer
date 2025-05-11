import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Layout
import Layout from './components/layout/Layout';
import ThemeProvider from './components/layout/ThemeProvider';

// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';

// Redux actions
import { loadFavorites, loadLastSearch, fetchGenres } from './redux/movieSlice';
import { loadUser } from './redux/authSlice';

// CSS
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  useEffect(() => {
    // Load user data from localStorage if available
    dispatch(loadUser());
    
    // Load favorites from localStorage
    dispatch(loadFavorites());
    
    // Load last search from localStorage
    dispatch(loadLastSearch());
    
    // Load movie genres
    dispatch(fetchGenres());
  }, [dispatch]);
  
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
            <Route 
              path="/favorites" 
              element={
                isAuthenticated ? 
                <FavoritesPage /> : 
                <Navigate to="/login" state={{ from: '/favorites' }} />
              } 
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
