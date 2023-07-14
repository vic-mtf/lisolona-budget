import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import IconButton from '../../../../../components/IconButton';
import { Badge, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import { setData } from '../../../../../redux/conference';

export default function ListMemberButton ({getVideoStream}) {
    const nav = useSelector(store => store.conference.nav);
    const selected = useMemo(() => nav === 'participant', [nav]);
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
                <IconButton
                    size="small"
                    color="primary"
                    selected={selected}
                    disabled
                    sx={{
                        zIndex: 0,
                        borderRadius: 1,
                        boxShadow: 'none',
                    }}
                    onClick={() => dispatch(
                        setData({
                             data :{ nav: selected ? null : 'participant' }
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
        </Stack>
    );
}
