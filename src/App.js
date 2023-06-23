import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import BoxGradient from "./components/BoxGradient";
import router from "./router/router";
import {decrypt} from "./utils/crypt";
import { changeValues } from "./redux/user";
import { useTimer } from "react-timer-hook";
import { useSocket } from "./utils/SocketIOProvider";
import { useMemo } from "react";

const channel = new BroadcastChannel('_geid_signin_connection_channel');

function App() {
  const [startApp, setStartApp] = useState(false);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();
  const connected = useSelector(store => store?.user?.connected);
  const timerRef = useRef();
  const localUser  = useSelector(store => store?.app?.user)
  const userSave = useMemo(() => localUser && decrypt(localUser), [localUser]);
  const dispatch = useDispatch();
  useTimer({
    expiryTimestamp: (() => {
      const time = new Date();
      time.setMilliseconds(2800);
      return time;
    })(),
    onExpire () {
      if(!startApp) setStartApp(true);
      if(!connected && !startApp) {
        window.clearTimeout(timerRef.current);
          const width = window.innerWidth * .65;
          const height = window.innerHeight * .85;
          const left = (window.innerWidth - width) / 2;
          const top = (window.innerHeight - height) / 2;
          const sizes = `top=${top}, left=${left}, width=${width}, height=${height}`;
          if(isHome)
            window.open(
                `/account/signin?usersession=${!userSave}`,
                '_blank',
                sizes
            );
      }
    }
  });

  useEffect(() => {
    let handleAutoConnexion;
    if (!connected && isHome) 
      handleAutoConnexion = (event) => {
        const {data} = event;
        if(data) dispatch(changeValues(decrypt(data)));
      };
      channel.addEventListener('message', handleAutoConnexion);
    return () => {
      channel.removeEventListener('message', handleAutoConnexion);
    }
}, [connected, dispatch]);

  return (
    <BoxGradient overflow="hidden">
        <RouterProvider 
          router={router({
            connected: startApp && connected && !loading,
            loading,
            startApp
          }, {
            setLoading
          })}
        />
    </BoxGradient>
  );
}

const isHome = window.location.pathname.indexOf('/account/signin') === - 1;

export default App;
