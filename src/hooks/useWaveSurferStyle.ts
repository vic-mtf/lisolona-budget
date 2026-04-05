import { useTheme } from "@mui/material";
import { useMemo } from "react";

const useWaveSurferStyle = () => {
  const theme = useTheme();
  const style = useMemo(
    () => ({
      waveColor: theme.palette.text.secondary,
      progressColor: theme.palette.primary.main,
      height: 35,
      barHeight: 1,
      barGap: 3,
      barWidth: 4,
      barRadius: 100,
      cursorWidth: 0,
      autoCenter: true,
      hideScrollbar: true,
      interact: true,
    }),
    [theme]
  );

  return style;
};

export default useWaveSurferStyle;
