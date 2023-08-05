import { Alert, AlertTitle, styled, Box as MuiBox, SnackbarContent } from "@mui/material";
import { useSnackbar } from "notistack";
import { useCallback } from "react";


const CustomAlert = styled(Alert)(({ theme}) => ({
    background: theme.palette.background.paper,
    '& .MuiAlert-icon': {
      color: theme.palette.text.primary,
    },
    '& .MuiAlert-message': {
      color: theme.palette.text.secondary,
    }
  }));

export default function useCustomSnackbar () {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const enqueueCustomSnackbar = useCallback (({message, title, action, severity, icon, getKey, alertProps, ...otherPops}) => 
        enqueueSnackbar({
            message,
            content: (key, message) => { 
              if(typeof getKey === 'function')
                getKey(key);
              return (
                <MuiBox
                    icon={icon}
                    component={severity ? Alert : CustomAlert}
                    severity={severity}
                    action={action}
                    {...alertProps}
                    sx={{
                      boxShadow: 1,
                      maxWidth: 400,
                      border: theme => `1px solid ${theme.palette.divider}`
                    }}
                >
                    {title && <AlertTitle>{title}</AlertTitle>}
                    {message}
                </MuiBox>
            )
          },
          ...otherPops,
        }), 
    [enqueueSnackbar]);
    return {enqueueCustomSnackbar, closeCustomSnackbar: closeSnackbar};
}

export function useLongTextCustomSnackbar () {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const enqueueCustomSnackbar = useCallback (({message, content, action, color = 'default',  getKey, SnackbarContentProps, ...otherPops}) => 
      enqueueSnackbar({
          message,
          content: content ? content :  (key, message) => { 
            if(typeof getKey === 'function')
              getKey(key);
            return (
              <SnackbarContent
                  action={action}
                  {...SnackbarContentProps}
                  message={message}
                  sx={{
                    boxShadow: 1,
                    bgcolor: theme => color === 'default' ? 
                    'background.paper' : theme.palette[color]?.main,
                    maxWidth: 500,
                    border: theme => `1px solid ${theme.palette.divider}`
                  }}
              />
          )
        },
        ...otherPops,
      }), 
  [enqueueSnackbar]);
  return {enqueueCustomSnackbar, closeCustomSnackbar: closeSnackbar};
}