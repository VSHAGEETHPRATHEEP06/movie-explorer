import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';

const ThemeProvider = ({ children }) => {
  const themeMode = useSelector((state) => state.theme.mode);
  
  // Create theme based on the current mode
  const theme = useMemo(() => 
    createTheme({
      palette: {
        mode: themeMode,
        ...(themeMode === 'light' 
          ? {
              // Light mode colors
              primary: {
                main: '#2196f3',
              },
              secondary: {
                main: '#f50057',
              },
              background: {
                default: '#f5f5f5',
                paper: '#ffffff',
              },
            } 
          : {
              // Dark mode colors
              primary: {
                main: '#90caf9',
              },
              secondary: {
                main: '#f48fb1',
              },
              background: {
                default: '#121212',
                paper: '#1e1e1e',
              },
            }),
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontSize: '2.5rem',
          fontWeight: 700,
        },
        h2: {
          fontSize: '2rem',
          fontWeight: 600,
        },
        h3: {
          fontSize: '1.8rem',
          fontWeight: 600,
        },
        h4: {
          fontSize: '1.5rem',
          fontWeight: 600,
        },
        h5: {
          fontSize: '1.2rem',
          fontWeight: 500,
        },
        h6: {
          fontSize: '1rem',
          fontWeight: 500,
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              textTransform: 'none',
              fontWeight: 500,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              overflow: 'hidden',
            },
          },
        },
      },
    }),
    [themeMode]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
