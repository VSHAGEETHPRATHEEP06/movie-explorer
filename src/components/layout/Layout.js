import { Box, Container } from '@mui/material';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto', 
          backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800] 
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center' }}>
            © {new Date().getFullYear()} Movie Explorer. All rights reserved.
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
