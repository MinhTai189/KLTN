import { createTheme } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

export const themeMUI = createTheme({
  palette: {
    primary: blue,
    secondary: {
      main: '#FFC857',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 425,
      md: 768,
      lg: 900,
      xl: 1024,
    },
  },
});
