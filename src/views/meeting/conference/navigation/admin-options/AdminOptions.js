import Box from '../../../../../components/Box';
import { useMeetingData } from '../../../../../utils/MeetingProvider';
import CustomListItemsGroup from '../../../../../components/CustomListItemsGroup';
import { Toolbar } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import Typography from '../../../../../components/Typography';
import { escapeRegExp } from 'lodash';
import useGetClients from '../../actions/useGetClients';
import MeetingManagement from './MeetingManagement';
import MeetingManagementOptions from './MeetingManagementOptions';

export default function AdminOptions () {
    const members =  useGetClients(true);
   

    return (
            <Box
                sx={{
                    bgcolor: 'background.default',
                    overflow: 'hidden'
                }} 
            >
                <Toolbar 
                    variant="dense"
                    sx={{mb: 2}}
                >
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >Options de modérateur</Typography>
                </Toolbar>
                <Typography
                    p={1}
                    color="text.secondary"
                >
                    Ces options de modération vous donnent 
                    la possibilité de superviser votre réunion. 
                    Uniquement les modérateurs ont l’accès à ces commandes.
                </Typography>
                <Box
                    flexGrow={1}
                    overflow="auto"
                >
                    <Typography
                        p={1}
                        variant='body1'
                        fontWeight='bold'
                    > Modération
                    </Typography> 
                    <MeetingManagement/> 
                    <MeetingManagementOptions/>
                </Box>
            </Box>
    );
}