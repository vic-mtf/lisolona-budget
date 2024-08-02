import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { SnackbarProvider } from "notistack";
import store from "./redux/store";
import "./styles/index.css";
import App from "./App";
import ConfigAppProvider from "./components/ConfigAppProvider";
import SocketIOProvider from "./components/SocketIOProvider";
import LocalStoreDataProvider from "./components/LocalStoreDataProvider";
import { snackbarComponents } from "./components/ReportComplete";
import InboundUpdateEventDetector from "./components/InboundUpdateEventDetector";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <SocketIOProvider>
        <ConfigAppProvider>
          <SnackbarProvider Components={snackbarComponents}>
            <LocalStoreDataProvider>
              <App />
              <InboundUpdateEventDetector />
            </LocalStoreDataProvider>
          </SnackbarProvider>
        </ConfigAppProvider>
      </SocketIOProvider>
    </ReduxProvider>
  </React.StrictMode>
);
