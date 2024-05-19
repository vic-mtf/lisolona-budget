import React, { useMemo } from 'react';
import { SnackbarContent } from 'notistack'; 
import { Alert, AlertTitle, SnackbarContent as MuiSnackbarContent, Box as MuiBox  } from '@mui/material';
import PropTypes from 'prop-types';

const ReportComplete = React.forwardRef((props, ref) => {

  const { 
    id, 
    sx,
    icon,
    title,
    action, 
    variant,
    message,
    persist,
    iconVariant,
    anchorOrigin,
    hideIconVariant, 
    autoHideDuration,
    ...otherProps 
  } = props;

  const children = useMemo(() => (
    <>
      {title && <AlertTitle>{title}</AlertTitle>} {message}
    </>
  ), [title, message]
);

const snackbarProps = useMemo(() => variant === 'default' ? 
  { message: children } : { children }, 
  [children, variant]
);

  return (
    <MuiBox
      role="alert" 
      component={SnackbarContent }
      ref={ref} 
      sx={{
        maxWidth: {
          xs: '100%',
          md: 400,
          lg: 500,
          xl: 600,
        },
      }}
      {...otherProps}
    >
      <MuiBox
        component={variant === 'default' ? MuiSnackbarContent : Alert}
        {...snackbarProps}
        severity={variant}
        action={
          typeof action === 'function' ? 
          action({ id, persist, autoHideDuration, anchorOrigin }) : action
        }
        icon={hideIconVariant === true ? false : icon}
      />
    </MuiBox>
  );

});

ReportComplete.propTypes = {
 id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
 sx: PropTypes.object,
 icon: PropTypes.node,
 action: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
 variant: PropTypes.oneOf(['success', 'error', 'warning', 'info', 'default']),
 message: PropTypes.string.isRequired,
 title: PropTypes.string,
 persist: PropTypes.bool,
 iconVariant: PropTypes.object,
 anchorOrigin: PropTypes.object,
 hideIconVariant: PropTypes.bool,
 autoHideDuration: PropTypes.number,
};

export const snackbarComponents = { 
  success: ReportComplete,
  error: ReportComplete,
  warning: ReportComplete,
  info: ReportComplete,
  default: ReportComplete,
};

export default ReportComplete;