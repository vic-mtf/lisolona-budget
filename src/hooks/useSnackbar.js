import {
  Alert,
  AlertTitle,
  styled,
  Box as MuiBox,
  SnackbarContent,
} from "@mui/material";
import { useSnackbar as useOriginalSnackbar } from "notistack";
import { useCallback, Children, createElement } from "react";

export default function useSnackbar() {
  const { enqueueSnackbar, closeSnackbar } = useOriginalSnackbar();
  const enqueueCustomSnackbar = useCallback(
    ({
      message,
      title,
      action,
      severity,
      icon,
      getKey,
      alertProps,
      ...otherPops
    }) =>
      enqueueSnackbar({
        message,
        content: (key, message) => {
          if (typeof getKey === "function") getKey(key);
          return createElement(MuiBox, {
            icon,
            component: severity ? Alert : CustomAlert,
            severity,
            action:
              typeof action === "function" ? action(key, message) : action,
            ...alertProps,
            sx: {
              boxShadow: 1,
              maxWidth: 400,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            },
            children: Children.toArray([
              title && createElement(AlertTitle, null, title),
              message,
            ]),
          });
        },
        ...otherPops,
      }),
    [enqueueSnackbar]
  );
  return { enqueueSnackbar: enqueueCustomSnackbar, closeSnackbar };
}

export function useLongTextSnackbar() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const enqueueCustomSnackbar = useCallback(
    ({
      message,
      content,
      action,
      color = "default",
      getKey,
      SnackbarContentProps,
      ...otherPops
    }) =>
      enqueueSnackbar({
        message,
        content: content
          ? content
          : (key, message) => {
              if (typeof getKey === "function") getKey(key);
              return createElement(SnackbarContent, {
                action:
                  typeof action === "function" ? action(key, message) : action,
                ...SnackbarContentProps,
                message,
                sx: {
                  boxShadow: 1,
                  bgcolor: (theme) =>
                    color === "default"
                      ? "background.paper"
                      : theme.palette[color]?.main,
                  maxWidth: 500,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                },
              });
            },
        ...otherPops,
      }),
    [enqueueSnackbar]
  );
  return { enqueueSnackbar: enqueueCustomSnackbar, closeSnackbar };
}

const CustomAlert = styled(Alert)(({ theme }) => ({
  background: theme.palette.background.paper,
  "& .MuiAlert-icon": {
    color: theme.palette.text.primary,
  },
  "& .MuiAlert-message": {
    color: theme.palette.text.secondary,
  },
}));
