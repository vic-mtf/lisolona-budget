import { useLayoutEffect, useState } from "react";
import { Tooltip, Zoom } from "@mui/material";
import IconButton from "../../../../../components/IconButton";
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import CustomZoom from '../../../../../components/CustomZoom';

const PushPinOutlined = (props) => {
    return (<PushPinOutlinedIcon {...props} sx={{ transform: 'rotate(45deg)' }}/>);
};

const UnpinOutlined = (props) => {
  return (
    <PushPinOutlined {...props}>
      <rect x="5" y="11" width="14" height="2" />
    </PushPinOutlined>
  );
}

export default function PinOption ({pined, onPin, rootRef}) {
    const [show, setShow] = useState(false);

    useLayoutEffect(() => {
        const root =  rootRef?.current;
        const onMouseEnter = () => {
            if(!show) setShow(true);
        }
        const onMouseLeave = () => {
            if(show) setShow(false);
        }
        root?.addEventListener('mouseenter', onMouseEnter);
        root?.addEventListener('mouseleave', onMouseLeave);
        return () => {
            root?.removeEventListener('mouseenter', onMouseEnter);
            root?.removeEventListener('mouseleave', onMouseLeave);
        }
    }, [rootRef, show]);

    return (
        <Tooltip
            title={pined ? 'Détacher' : 'Epingler'} 
            arrow
        >
            <div>
                <IconButton
                    onClick={onPin}
                    selected={pined}
                >
                    {pined ? <UnpinOutlined/> : <PushPinOutlined/>}
                </IconButton>
            </div>
        </Tooltip>

    );
}