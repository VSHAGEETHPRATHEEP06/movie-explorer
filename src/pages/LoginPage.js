import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Check if there was a specific location the user was trying to access
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);
  
  return (
    <Box>
      <LoginForm />
    </Box>
  );
};

export default LoginPage;
