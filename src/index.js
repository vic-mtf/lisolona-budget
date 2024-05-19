import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import store from './redux/store';
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ConfigAppWrapper from './utils/ConfigAppWrapper';
import SocketIOProvider from './utils/SocketIOProvider';
import DataProvider from './utils/DataProvider';
import { snackbarComponents } from './components/ReportComplete';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
      <ReduxProvider store={store}>
        <SocketIOProvider>
          <ConfigAppWrapper>
              <SnackbarProvider Components={snackbarComponents} >
                <DataProvider>
                  <App/>
                </DataProvider>
              </SnackbarProvider>
          </ConfigAppWrapper>
        </SocketIOProvider>
      </ReduxProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(//))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

reportWebVitals();
