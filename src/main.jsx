import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { NotificationsProvider } from '@toolpad/core/useNotifications';
import store from './redux/store';
import './styles/index.css';
import App from './App';
import ConfigAppProvider from './components/ConfigAppProvider';
import SocketIOProvider from './components/SocketIOProvider';
import LocalStoreDataProvider from './components/LocalStoreDataProvider';
import InboundUpdateEventDetector from './components/InboundUpdateEventDetector';

const root = ReactDOM.createRoot(document.getElementById('root'));
const slotProps = {
  snackbar: {
    autoHideDuration: 7000,
    sx: {
      '& .MuiPaper-root': { alignItems: 'flex-start', m: 0 },
      '& .MuiSnackbarContent-message': {
        m: 0,
        p: 0,
      },
    },
  },
};

root.render(
  <StrictMode>
    <ReduxProvider store={store}>
      <SocketIOProvider>
        <ConfigAppProvider>
          <LocalStoreDataProvider>
            <NotificationsProvider slotProps={slotProps}>
              <App />
              <InboundUpdateEventDetector />
            </NotificationsProvider>
          </LocalStoreDataProvider>
        </ConfigAppProvider>
      </SocketIOProvider>
    </ReduxProvider>
  </StrictMode>
);
