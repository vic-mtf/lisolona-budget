import { useSelector } from "react-redux";
import { Box as MuiBox } from "@mui/material";
import Avatar from "../../../components/Avatar";
import { useMemo, useRef } from "react";
import { generateColorsFromId } from "../../../utils/genColorById";
import { useTheme } from "@mui/material";
import getShort from "../../../utils/getShort";
import getFullName from "../../../utils/getFullName";

export default function AvatarProfile () {
    const user = useSelector(store => store.meeting.me);
    const cameraActive = useSelector(store => store.meeting.camera.active);
    const theme = useTheme();
    const { background, text } = generateColorsFromId(user?.id, theme.palette.mode);

    const avatarSx = useMemo(() => ({
        color: text,
        bgcolor: background,
        fontWeight: 'bold',
        fontSize: 40,
    }), [background, text]); 

    return (!cameraActive &&
        <MuiBox 
            className="avatar-profile" 
        >
            <MuiBox
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: theme => theme.palette.background.paper + 
                    theme.customOptions.opacity,
                    backdropFilter:  theme => `blur(${theme.customOptions.blur})`,
                }}
            >
                <Avatar
                    sx={{
                        width: 90,
                        height: 90,
                        ...avatarSx,
                        borderColor: avatarSx.color,
                    }}
                    src={user?.image}
                    children={getShort(getFullName(user))}
                />
            </MuiBox>
        </MuiBox>
    )
}