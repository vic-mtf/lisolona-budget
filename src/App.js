import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import BoxGradient from "./components/BoxGradient";
import router from "./router/router";
import {decrypt} from "./utils/crypt";
import { changeValues } from "./redux/user";
import { useTimer } from "react-timer-hook";
import { useSocket } from "./utils/SocketIOProvider";

function App() {
  const [startApp, setStartApp] = useState(false);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();
  const connected = useSelector(store => store?.user?.connected);
  const timerRef = useRef();
  const userSave = useSelector(store => 
    store?.app?.user && decrypt(store.app?.user)
  );
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
    const root =  document.getElementById('root');
    let handleAutoConnexion;
    if (!connected && isHome) 
      (handleAutoConnexion = () => {
            timerRef.current = window.setTimeout(() => {
              const key = '_auto_connexion_data';
              const data = localStorage.getItem(key);
              if(data) {
                  window.clearTimeout(timerRef.current);
                  localStorage.removeItem(key);
                  dispatch(changeValues(decrypt(data)));
              } else handleAutoConnexion()
            }, 100);
      })();
    root.addEventListener('_deconnected', handleAutoConnexion);
    return () => {
      root.removeEventListener('_deconnected', handleAutoConnexion);
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
