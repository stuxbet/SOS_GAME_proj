import './App.css'

import {ThemeProvider, CssBaseline, createTheme} from '@mui/material';
import {Gui} from './sp0gui';

function App() {
  
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Gui />
    </ThemeProvider>
  )
}

export default App
