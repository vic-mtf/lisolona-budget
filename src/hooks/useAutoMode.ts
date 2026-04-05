import { useCallback, useEffect, useState } from "react";
import type { PaletteMode } from "@mui/material";

const darkThemeMediaquery = window.matchMedia("(prefers-color-scheme: dark)");

export default function useAutoMode(): PaletteMode {
  const [mode, setMode] = useState<PaletteMode>(
    darkThemeMediaquery.matches ? "dark" : "light"
  );

  const handleChange = useCallback(
    (event: MediaQueryListEvent) =>
      setMode(event.matches ? "dark" : "light"),
    []
  );

  useEffect(() => {
    darkThemeMediaquery.addEventListener("change", handleChange);
    return () =>
      darkThemeMediaquery.removeEventListener("change", handleChange);
  }, [handleChange]);

  return mode;
}
