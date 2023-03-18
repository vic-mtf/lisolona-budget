import { ThemeProvider } from '@emotion/react'
import { 
    Chip, 
    createTheme,
    Box as MuiBox,
    Avatar,
 } from '@mui/material'
import { useSelector } from 'react-redux'
import Typography from '../../../../../components/Typography';
export default function Subheader ({uid}) {
    const { name } = useSelector(store => {
        const type = store.teleconference.type;
        const id = store.teleconference.meetingId;
        const contact = store.data.contacts.find((user) => user.id === uid);
        const members = store.data.chatGroups?.find((user) => user?._id === id)?.members;
        const name = type === 'direct' ? contact?.name : 
        members?.map(({_id: user, role}) => ({
            ...user,
            role,
            id: user?._id,
            origin: user,
            name: `${user?.fname || ''} ${ user?.lname || ''} ${user?.mname || ''}`.trim(),
            })
        )?.find((user) => user.id === uid)?.name;
        return { name };
    });

    return (
        <MuiBox
            sx={{
                position: 'absolute',
                left: '5px',
                bottom: '5px',
                zIndex: theme => theme.zIndex.drawer,
            }}
        >
            <ThemeProvider theme={createTheme({palette: {mode : 'light'}})}>
                <Chip
                    label={
                        <ThemeProvider theme={createTheme({palette: {mode : 'dark'}})}>
                            <Typography>{name}</Typography>
                        </ThemeProvider>
                    }
                    size="small"
                    avatar={<Avatar/>}
                />
            </ThemeProvider>
        </MuiBox>
    )
}