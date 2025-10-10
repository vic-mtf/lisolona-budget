import React, { forwardRef } from 'react';
import Box from '@mui/material/Box';
import AdminHeader from './header/AdminHeader';
import ModerationOptions from './ModerationOptions';
import MessageOptions from './MessageOptions';

const Admin = forwardRef((_, ref) => {
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
        <AdminHeader />
        <Box display="flex" flexGrow={1} position="relative">
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            flexDirection="column"
            overflow="hidden"
            sx={{ overflowY: 'auto' }}
          >
            <ModerationOptions />
            <MessageOptions />
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

Admin.displayName = 'Admin';

export default React.memo(Admin);
