import { Badge, createTheme, Stack, ThemeProvider, Toolbar } from '@mui/material';
import React from 'react';
import Avatar from '../../../../components/Avatar';
import Typography from '../../../../components/Typography';
import CustomBadge, { greenColor } from '../../../../components/CustomBadge'; 

export default function AvatarStatus ({online}) {
    return (
            <React.Fragment>
                {/* <CustomBadge
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    overlap="circular"
                    online={online}
                >
                    <Avatar
                        sx={{
                            border: theme => `2px solid ${theme.palette.background.paper}`,
                            bgcolor: 'primary.main'
                        }}
                    />
                </CustomBadge> */}
                <ThemeProvider theme={createTheme({palette: {mode: 'dark'}})}>
                    <Stack spacing={-.5} flexGrow={1}>
                        <Typography
                            color="text.primary" 
                            variant="body1" 
                            children="Mongolo fataki" 
                            fontWeight="bold"
                        />
                        <Typography
                            color="text.secondary" 
                            variant="caption" 
                            children="Actif maintenant" 
                        />
                    </Stack>
                </ThemeProvider>
            </React.Fragment>
    );

}