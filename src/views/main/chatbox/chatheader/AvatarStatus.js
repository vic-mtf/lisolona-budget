import { 
    createTheme, 
    Stack, 
    ThemeProvider, 
    Box as MuiBox,
    AvatarGroup,
} from '@mui/material';
import React from 'react';
import Avatar from '../../../../components/Avatar';
import Typography from '../../../../components/Typography';
import appConfig from '../../../../configs/app-config.json';
import { useSelector } from 'react-redux';
import timeHumanReadable from '../../../../utils/timeHumanReadable';

export default function AvatarStatus ({online}) {
    const { name, type, members, updatedAt, user } = useSelector(store => {
        const { chatId, contacts, conversations } = store.data;
        const contact = conversations?.find(({id}) => id === chatId) || 
        contacts?.find(({id}) => id === chatId);
        return {
            ...contact, 
            members: contact?.origin?.members?.map(
                ({_id: user, role}) => store.user?.id !== user?._id && ({
                    ...user,
                    role,
                    id: user?._id,
                    origin: user,
                    name: `${user?.fname || ''} ${ user?.lname || ''} ${user?.mname || ''}`.trim(),
                })
            )?.filter(name => name),
        };
    } );

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
                            children={name}
                            fontWeight="bold"
                            textOverflow="ellipsis"
                            overflow="hidden"
                            noWrap
                        />
                        {type !== 'room' ?
                        <Typography
                            color="text.secondary" 
                            variant="caption" 
                            textOverflow="ellipsis"
                            overflow="hidden"
                            noWrap
                            children={
                                updatedAt ? 
                                'Dernière interaction, ' 
                                + timeHumanReadable(updatedAt, true)
                                .toLocaleLowerCase() : 
                                'Commencer nouvelle discussion'
                            } 
                        /> :
                        <Typography
                            color="text.secondary" 
                            variant="caption" 
                            noWrap
                            textOverflow="ellipsis"
                            children={`Membres: ${
                                members?.map((member, index, members) => 
                                `${member?.name}`
                                ).join(', ')
                            }`} 
                        />
                        }
                    </Stack>
                </ThemeProvider>
            </React.Fragment>
    );

}