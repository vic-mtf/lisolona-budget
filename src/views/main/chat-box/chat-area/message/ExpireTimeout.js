import React from 'react';
import CancelScheduleSendOutlinedIcon from '@mui/icons-material/CancelScheduleSendOutlined';
import ScheduleSendOutlinedIcon from '@mui/icons-material/ScheduleSendOutlined';
import { Box as MuiBox } from '@mui/material';

const ExpireTimeout = ({ timeout, createdAt, invisible }) => {
    if (invisible) {
        return null;
    }

    const currentTime = new Date().getTime();
    const createdTime = new Date(createdAt).getTime();
    const timeDifference = currentTime - createdTime;

    return (
        <MuiBox
            mx={.25}
        >
            {timeDifference > timeout ?
            (<CancelScheduleSendOutlinedIcon fontSize="small" color="error.main" />): 
            (<ScheduleSendOutlinedIcon fontSize="small" />)}
        </MuiBox>
    )
};

export default ExpireTimeout;
