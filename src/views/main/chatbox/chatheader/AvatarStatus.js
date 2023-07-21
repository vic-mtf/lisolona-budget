import { 
    createTheme, 
    Stack, 
    ThemeProvider, 
} from '@mui/material';
import React, { useMemo } from 'react';
import Typography from '../../../../components/Typography';
import { useSelector } from 'react-redux';
import timeHumanReadable from '../../../../utils/timeHumanReadable';
import UserStatus from './UserStatus';
import getFullName from '../../../../utils/getFullName';

export default function AvatarStatus ({target}) {
    const userId = useSelector(store => store.user.id);
    const members = useMemo(() => target?.members?.map(
        ({_id: user, role}) => ({
            ...user,
            role,
            id: user?._id,
            origin: user,
            name: getFullName(user),
        })
    )?.filter(({id}) => userId !== id), [target?.members]);

    const names = useMemo(() => 
        `${members?.map(member => `${member?.name}`).sort().join(', ')}`,
        [members]
    );
    
    return (
            <React.Fragment>
                <ThemeProvider theme={createTheme({palette: {mode: 'dark'}})}>
                    <Stack 
                        spacing={-.2} 
                        flexGrow={1} 
                        textOverflow="ellipsis" 
                        overflow="hidden"
                    >
                        <Typography
                            color="text.primary" 
                            variant="body1" 
                            children={target?.name}
                            textOverflow="ellipsis"
                            overflow="hidden"
                            noWrap
                        />
                        {target?.type !== 'room' ?
                        <UserStatus target={target} /> :
                        <Typography
                            color="text.secondary" 
                            variant="caption" 
                            noWrap
                            textOverflow="ellipsis"
                            children={names} 
                        />
                        }
                    </Stack>
                </ThemeProvider>
            </React.Fragment>
    );

}