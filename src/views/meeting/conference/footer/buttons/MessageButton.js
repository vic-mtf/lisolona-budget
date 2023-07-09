import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import IconButton from '../../../../../components/IconButton';
import { Badge, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import { setData } from '../../../../../redux/conference';

export default function MessageButton ({getVideoStream}) {
    const nav = useSelector(store => store.conference.nav);
    const selected = useMemo(() => nav === 'message', [nav]);
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
                    onClick={() => dispatch(
                        setData({
                             data :{ nav: selected ? null : 'message' }
                        })
                    )}
                    sx={{
                        zIndex: 0,
                        borderRadius: 1,
                        boxShadow: 'none',
                    }}
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
                        <MessageOutlinedIcon/>
                    </Badge>
                </IconButton>
        </Stack>
    );
}