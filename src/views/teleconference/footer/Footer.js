import { Pagination, Toolbar } from '@mui/material';
import { useTeleconference } from '../../../utils/useTeleconferenceProvider';
import HangUpCallButton from './HangUpCallButton';
import ToggleCameraButton from './ToggleCameraButton';
import ToggleMicButton from './ToggleMicButton';
import { maxScreen } from '../Container';
import React, { useMemo } from 'react';
import AnswerButton from './AnswerButton';
import { useSelector } from 'react-redux';

export default function Footer ({
    handleChangePage,
    page,
}) {
    const { calls, pickedUp } = useTeleconference();
    const { variant, type } = useSelector(store => {
        const variant = store.teleconference.variant;
        const type = store.teleconference.type;
        return {variant, type};
    })
    const count = useMemo(() => 
        Math.ceil(calls.length / maxScreen), 
        [calls.length]
    );
        
    return (
        <Toolbar
            sx={{
                borderRadius: 2,
                mb: .25,
                display: 'flex',
                justifyContent: 'center'
            }}
            variant="dense"
        >
            {pickedUp &&
            <React.Fragment> 
                {type === 'video' && <ToggleCameraButton/> }
                <ToggleMicButton/>  
            </React.Fragment>}
            {(variant === 'incoming' && !pickedUp) && <AnswerButton/>}  
            <HangUpCallButton/>     
            {count > 1 &&
            <Pagination 
                count={count}
                size="small" 
                onChange={handleChangePage}
                page={page}
            />}
         </Toolbar>
    );
}