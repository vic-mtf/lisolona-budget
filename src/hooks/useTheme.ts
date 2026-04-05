import { alpha, createTheme, type PaletteMode } from "@mui/material";
import appConfig from "@/configs/app-config.json";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import useAutoMode from "./useAutoMode";
import MuiDialogTransition from "@/components/MuiDialogTransition";
import type { RootState } from "@/redux/store";
import type { ThemeMode } from "@/types";

const MuiTheme = createTheme();

const useTheme = (defaultMode?: PaletteMode) => {
  const autoMode = useAutoMode();
  const {
    mode: themeMode,
    opacity,
    blur,
  } = useSelector((store: RootState) => store.app.theme);

  const mode = useMemo(
    () =>
      defaultMode || ((themeMode === "auto" ? autoMode : themeMode) as PaletteMode),
    [themeMode, autoMode, defaultMode]
  );

  const { main, paper, ...otherKey } = useMemo(
    () =>
      appConfig.colors.primary[mode || "dark"] as {
        main: string;
        paper: string;
        default: string;
      },
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main },
          background: { ...otherKey, paper },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
              },
            },
          },
          MuiTypography: {
            defaultProps: {
              variant: "body2",
              color: "text.primary",
              component: "div",
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: MuiTheme.shape.borderRadius,
              },
            },
          },
          MuiAvatar: {
            defaultProps: {
              variant: "rounded",
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                borderRadius: MuiTheme.shape.borderRadius,
                "& .MuiTouchRipple-root span": {
                  borderRadius: MuiTheme.shape.borderRadius,
                },
              },
            },
          },
          MuiMenu: {
            defaultProps: {
              transformOrigin: { horizontal: "left", vertical: "top" },
              anchorOrigin: { horizontal: "right", vertical: "bottom" },
              onContextMenu: (event: React.MouseEvent) =>
                event.preventDefault(),
            },
            styleOverrides: {
              root: {
                "& .MuiBackdrop-root": {
                  backdropFilter: "none",
                },
              },
            },
          },
          MuiBadge: {
            defaultProps: {
              overlap: "rectangular",
              anchorOrigin: { vertical: "bottom", horizontal: "right" },
            },
          },
          MuiTooltip: {
            defaultProps: { arrow: true },
          },
          MuiDialog: {
            defaultProps: {
              TransitionComponent: MuiDialogTransition,
              slotProps: {
                backdrop: {
                  sx: (theme: ReturnType<typeof createTheme>) => ({
                    ...theme.applyStyles("light", {
                      bgcolor: alpha(theme.palette.background.paper, 0.5),
                    }),
                  }),
                },
              },
              PaperProps: {
                sx: {
                  position: "relative",
                  overflow: "hidden",
                },
              },
            },
            styleOverrides: {
              root: {
                "& .MuiBackdrop-root": {
                  backdropFilter: "blur(10px)",
                },
              },
            },
          },
          MuiModal: {
            defaultProps: {
              slotProps: {
                backdrop: {
                  sx: (theme: ReturnType<typeof createTheme>) => ({
                    ...theme.applyStyles("light", {
                      bgcolor: alpha(theme.palette.background.paper, 0.2),
                    }),
                  }),
                },
              },
            },
            styleOverrides: {
              root: {
                "& .MuiBackdrop-root": {
                  backdropFilter: "blur(10px)",
                },
              },
            },
          },
          MuiBackdrop: {
            styleOverrides: {
              root: {
                userSelect: "none",
                "& *": {
                  userSelect: "none",
                },
              },
            },
          },
          MuiFab: {
            defaultProps: {
              size: "small",
              variant: "extended",
            },
            styleOverrides: {
              root: {
                boxShadow: "none",
                borderRadius: MuiTheme.shape.borderRadius,
              },
            },
          },
          MuiSwitch: {
            defaultProps: {
              size: "small",
            },
          },
        },
        customOptions: {
          opacity: Math.round(255 * opacity).toString(16),
          blur: `${blur}px`,
        },
      }),
    [mode, main, paper, opacity, blur, otherKey]
  );

  return theme;
};

export default useTheme;
