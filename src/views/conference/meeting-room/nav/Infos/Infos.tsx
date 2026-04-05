import React, { forwardRef } from 'react';
import Box from '@mui/material/Box';
import InfosHeader from './header/InfosHeader';
import MeetingLink from './MeetingLink';
import MeetingQRCode from './MeetingQRCode';
import CodeDisplay from './CodeDisplay';

const Infos = forwardRef((_, ref) => {
  return (
    <Box ref={ref} display="flex" flex={1}>
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        display="flex"
        flexDirection="column"
      >
        <InfosHeader />

        <MeetingLink />
        <CodeDisplay />
        <MeetingQRCode />
      </Box>
    </Box>
  );
});

Infos.displayName = 'Infos';

export default React.memo(Infos);
