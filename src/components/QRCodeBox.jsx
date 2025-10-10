import React from 'react';
import QRCode from 'react-qr-code';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import PropTypes from 'prop-types';

const CodeQRBox = React.forwardRef(({ value }, ref) => {
  const theme = useTheme();
  return (
    <Box
      component={QRCode}
      bgColor="transparent"
      fgColor={theme.palette.text.primary}
      onLoad={console.log}
      radius={10}
      ref={ref}
      m={2}
      sx={{
        borderRadius: 2,
        '& path': {
          strokeWidth: 100,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        },
      }}
      value={value}
    />
  );
});

CodeQRBox.displayName = 'CodeQRBox';

CodeQRBox.propTypes = {
  value: PropTypes.string.isRequired,
};

export default React.memo(CodeQRBox);
