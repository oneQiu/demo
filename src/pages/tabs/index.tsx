import {
  AppBar,
  Box,
  Button,
  Container,
  createTheme,
  CssBaseline,
  IconButton,
  Stack,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
  useScrollTrigger,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { cloneElement, useState } from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import LightModeIcon from '@mui/icons-material/LightMode';
import { orange } from '@mui/material/colors';

declare module '@mui/material/styles' {
  interface Theme {
    x: {
      a: string;
    };
    layout: {
      side: string;
    };
  }

  interface ThemeOptions {
    x?: {
      a?: string;
    };
    layout?: {
      side?: string;
    };
  }
}

const lightTheme = createTheme({
  x: {
    a: '#f00',
  },
  palette: {
    mode: 'light',
    primary: {
      main: orange[300],
    },
  },
});
const darkTheme = createTheme({
  x: {
    a: '#fff',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: orange[900],
    },
    background: {
      paper: orange[900],
    },
  },
});

const ElevationScroll = (props) => {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
};

const TabsPage = (props) => {
  const [themeMode, setThemeMode] = useState('light');

  const onThemeChange = (_, newValue) => {
    setThemeMode(newValue);
  };

  return (
    <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      <ElevationScroll {...props}>
        <AppBar>
          <Toolbar>
            <IconButton>
              <MenuIcon />
            </IconButton>
            <Box flexGrow={1} />
            <IconButton>
              <AccountCircleIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Container sx={{ minHeight: 1200 }}>
        <Toolbar />
        <Stack p={2} gap={4}>
          <Box>
            <ToggleButtonGroup
              value={themeMode}
              exclusive
              onChange={onThemeChange}
            >
              <ToggleButton value={'light'}>
                <LightModeIcon />
              </ToggleButton>
              <ToggleButton value={'dark'}>
                <Brightness4Icon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box>
            <Button variant="contained">当前{themeMode}</Button>
          </Box>
        </Stack>
        <Typography
          sx={{
            color: (theme) => theme.x.a,
          }}
        >
          this is one some theme container
        </Typography>
      </Container>
    </ThemeProvider>
  );
};

export default TabsPage;
