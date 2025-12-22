import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from './theme.js';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { store } from './redux/store.js';
import { Provider } from 'react-redux';
import { ThemeContext } from './context/theme/theme-context';
import { useContext } from 'react';
import { ThemeProviderCustom } from './context/theme/ThemeContext';
import ToastComponent from './components/common/ToastContainer.jsx';

function RootContent() {
  const { mode, setMode } = useContext(ThemeContext);
  const theme = createAppTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastComponent />
      <App mode={mode} setMode={setMode} />
    </ThemeProvider>
  );
}

function Root() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProviderCustom>
          <RootContent />
        </ThemeProviderCustom>
      </BrowserRouter>
    </Provider>
  );
}
export default Root;
