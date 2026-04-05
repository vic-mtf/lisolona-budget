import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { NotificationsProvider } from "@toolpad/core/useNotifications";
import store from "@/redux/store";
import "@/styles/index.css";
import App from "@/App";
import ConfigAppProvider from "@/providers/ConfigAppProvider";
import SocketIOProvider from "@/providers/SocketIOProvider";
import LocalStoreDataProvider from "@/providers/LocalStoreDataProvider";
import InboundUpdateEventDetector from "@/components/InboundUpdateEventDetector";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const slotProps = {
  snackbar: {
    autoHideDuration: 7000,
    sx: {
      "& .MuiPaper-root": { alignItems: "flex-start", m: 0 },
      "& .MuiSnackbarContent-message": {
        m: 0,
        px: 0,
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
