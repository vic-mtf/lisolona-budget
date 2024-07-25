import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { SnackbarProvider } from "notistack";
import store from "./redux/store";
import "./styles/index.css";
import App from "./App";
import ConfigAppWrapper from "./utils/ConfigAppWrapper";
import SocketIOProvider from "./utils/SocketIOProvider";
import DataProvider from "./utils/DataProvider";
import { snackbarComponents } from "./components/ReportComplete";
import AgoraProviderClient from "./components/AgoraProviderClient";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <SocketIOProvider>
        <ConfigAppWrapper>
          <SnackbarProvider Components={snackbarComponents}>
            <DataProvider>
              <AgoraProviderClient>
                <App />
              </AgoraProviderClient>
            </DataProvider>
          </SnackbarProvider>
        </ConfigAppWrapper>
      </SocketIOProvider>
    </ReduxProvider>
  </React.StrictMode>
);
