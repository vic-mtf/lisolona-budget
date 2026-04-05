import React from 'react';
import QRCode from 'react-qr-code';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';

const CodeQRBox = React.forwardRef(({ value }, ref) => {
  const theme = useTheme();
  return (
    <Box
      component={QRCode}
      bgColor="transparent"
      fgColor={theme.palette.text.primary}
      //onLoad={console.log}
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

export default React.memo(CodeQRBox);
