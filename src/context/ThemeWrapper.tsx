import createTheme from '@mui/material/styles/createTheme';
import CssBaseline from '@mui/material/CssBaseline';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { createContext, FC, useContext, useMemo, useState } from 'react';
import { contextWrapperProps, themeContext } from '../utils/types';

export const ThemeWrapperContext = createContext<themeContext>({
  toggleColorMode: () => {},
  colorMode: 'light',
});
export const usethemeUtils = () => {
  const themeutils = useContext(ThemeWrapperContext);
  return themeutils;
};
const ThemeWrapper: FC<contextWrapperProps> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const darkTheme = createTheme({
    palette: {
      mode,
      primary: {
        light: '#2D3748',
        dark: '#E2E8F0',
        main: '#2D3748',
      },
      secondary: {
        light: '#4A5568',
        dark: '#A0AEC0',
        main: '#4A5568',
      },
      background: {
        default: mode === 'light' ? '#ECECEC' : '#1f2125',
      },
      common: {
        white: '#ffffff',
        black: '#000000',
      },
    },
    typography: {
      button: {
        textTransform: 'none',
      },
    },
  });
  const themeWrapperUtils = useMemo(
    () => ({
      colorMode: mode,
      toggleColorMode: () => {
        setMode((prevMode) => {
          return prevMode === 'light' ? 'dark' : 'light';
        });
      },
    }),
    [mode]
  );
  return (
    <ThemeWrapperContext.Provider value={themeWrapperUtils}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeWrapperContext.Provider>
  );
};
export default ThemeWrapper;
