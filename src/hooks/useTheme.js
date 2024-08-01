import { createTheme } from "@mui/material";
import appConfig from "../configs/app-config.json";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import useAutoMode from "./useAutoMode";

const useTheme = () => {
  const autoMode = useAutoMode();
  const { mode: themeMode, opacity, blur } = useSelector((store) => store.app);

  const mode = useMemo(
    () => (themeMode === "auto" ? autoMode : themeMode),
    [themeMode, autoMode]
  );

  const { main, paper, ...otherKey } = useMemo(
    () => appConfig.colors.primary[mode || 'dark'],
    [mode]
  );
  
  const theme = useMemo(() =>  createTheme({
    palette: {
      mode,
      primary: { main  },
      background: { ...otherKey, paper },
    },
    customOptions: {
      opacity: Math.round(255 * opacity).toString(16),
      blur: `${blur}px`,
    },
  }), [mode, main, paper, opacity, blur, otherKey])

  return theme;
};

export default useTheme;
