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
      xs: 425,
      sm: 768,
      md: 900,
      lg: 1024,
      xl: 1440,
    },
  },
});
