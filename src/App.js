import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import BoxGradient from "./components/BoxGradient";
import router from "./router/router";
import { decrypt } from "./utils/crypt";
import { changeValues } from "./redux/user";
import { setData } from "./redux/meeting";
import scrollBarSx from "./utils/scrollBarSx";

const channel = new BroadcastChannel("_geid_sign_in_connection_channel");

function App() {
  const [startApp, setStartApp] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = useSelector((store) => store?.user);
  const connected = useMemo(() => user?.connected, [user?.connected]);
  const dispatch = useDispatch();
  const isStarted = useRef(true);

  useEffect(() => {
    let handleAutoConnexion;
    if (!connected)
      handleAutoConnexion = (event) => {
        const { data } = event;
        if (data) dispatch(changeValues(decrypt(data)));
      };
    else dispatch(setData({ data: { me: user } }));
    channel.addEventListener("message", handleAutoConnexion);
    return () => {
      channel.removeEventListener("message", handleAutoConnexion);
    };
  }, [connected, dispatch, user]);

  return (
    <BoxGradient
      overflow='hidden'
      sx={{
        "& *": { ...scrollBarSx },
      }}>
      <RouterProvider
        router={router(
          {
            connected,
            loading,
            startApp,
            isStarted,
          },
          {
            setLoading,
            setStartApp,
          }
        )}
      />
    </BoxGradient>
  );
}

export default App;
