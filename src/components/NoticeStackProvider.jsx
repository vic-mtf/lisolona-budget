import React, { useMemo } from "react";
import { SnackbarContent, SnackbarProvider } from "notistack";
import {
  Alert,
  AlertTitle,
  SnackbarContent as MuiSnackbarContent,
  Box,
  alpha,
} from "@mui/material";
import PropTypes from "prop-types";

const ReportComplete = React.forwardRef((props, ref) => {
  const {
    icon,
    title,
    action,
    variant = "default",
    message,
    hideIconVariant,
    persist,
    anchorOrigin,
    autoHideDuration,
    iconVariant,
    ...otherProps
  } = props;

  const children = useMemo(
    () => (
      <>
        {title && <AlertTitle>{title}</AlertTitle>}{" "}
        {typeof message === "function" ? message(props) : message}
      </>
    ),
    [title, message, props]
  );

  const snackbarProps = useMemo(
    () => (variant === "default" ? { message: children } : { children }),
    [children, variant]
  );

  return (
    <Box
      role='alert'
      component={SnackbarContent}
      ref={ref}
      sx={{
        boxShadow: 8,
        "& .MuiSnackbarContent-root": {
          bgcolor: "background.paper",
          backgroundImage: (theme) => {
            const color = alpha(
              theme.palette.common.white,
              theme.palette.action.activatedOpacity
            );
            return `linear-gradient(${color}, ${color})`;
          },
          color: "text.primary",
        },
        "& .MuiSnackbarContent-message": {
          color: "text.secondary",
          maxWidth: {
            xs: "100%",
            md: 400,
            lg: 500,
            xl: 600,
          },
        },
      }}
      {...otherProps}>
      <Box
        component={variant === "default" ? MuiSnackbarContent : Alert}
        {...snackbarProps}
        severity={variant}
        action={
          typeof action === "function"
            ? action({
                ...props,
                persist,
                anchorOrigin,
                autoHideDuration,
                iconVariant,
              })
            : action
        }
        icon={hideIconVariant === true ? false : icon}
      />
    </Box>
  );
});

ReportComplete.displayName = "ReportComplete";

ReportComplete.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sx: PropTypes.object,
  icon: PropTypes.node,
  action: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  variant: PropTypes.oneOf(["success", "error", "warning", "info", "default"]),
  message: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  title: PropTypes.string,
  persist: PropTypes.bool,
  iconVariant: PropTypes.object,
  anchorOrigin: PropTypes.object,
  hideIconVariant: PropTypes.bool,
  autoHideDuration: PropTypes.number,
};

const Components = {
  success: ReportComplete,
  error: ReportComplete,
  warning: ReportComplete,
  info: ReportComplete,
  default: ReportComplete,
};

export default function NoticeStackProvider({ children, ...otherProps }) {
  return (
    <SnackbarProvider maxSnack={10} Components={Components} {...otherProps}>
      {children}
    </SnackbarProvider>
  );
}

NoticeStackProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
