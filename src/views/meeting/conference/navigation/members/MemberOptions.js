import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Stack, Tooltip, Zoom } from '@mui/material';
import IconButton from '../../../../../components/IconButton';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LoadingIndicator from './LoadingIndicator';
import { useSocket } from '../../../../../utils/SocketIOProvider';
import MicroOption from './MicroOption';
import PinOption from './PinOption';
import RaiseHandView from './RaiseHandView';


export default function MemberOptions({rootRef, id}) {

    return (
        <Stack
            spacing={1}
            direction="row"
        >
            <RaiseHandView
                title="Mimi a levé la main"
                show={true}
            />
            <PinOption
                rootRef={rootRef}
            />
            <MicroOption
            />
        </Stack>
    );
}