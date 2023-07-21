import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import IconButton from '../../../../../components/IconButton';
import { Badge, Stack, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import { setConferenceData } from '../../../../../redux/conference';

export default function ListMemberButton () {
    const nav = useSelector(store => store.conference.nav);
    const selected = useMemo(() => /participant-open/.test(nav), [nav]);
    const dispatch = useDispatch();

    return (
        <Stack
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            spacing={.1}
        >
            <Tooltip title="Participants" arrow>
                <IconButton
                    size="small"
                    color="primary"
                    selected={selected}
                    sx={{
                        zIndex: 0,
                        borderRadius: 1,
                        boxShadow: 'none',
                    }}
                    onClick={() => dispatch(
                        setConferenceData({
                             data :{ nav: selected ? 'participant-close' : 'participant-open' }
                        })
                    )}
                >
                    <Badge 
                        sx={{
                            '& .MuiBadge-badge': {
                                border: theme => `1px solid ${theme.palette.background.paper}`,
                              },
                        }}
                        badgeContent={0} 
                        color="primary"
                    >
                        <GroupsOutlinedIcon/>
                    </Badge>
                </IconButton>
                </Tooltip>
        </Stack>
    );
}
