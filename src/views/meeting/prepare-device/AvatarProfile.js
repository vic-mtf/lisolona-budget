import { useSelector } from "react-redux";
import { Box as MuiBox } from "@mui/material";
import Avatar from "../../../components/Avatar";
import { useMemo } from "react";
import { generateColorsFromId } from "../../../utils/genColorById";
import { useTheme } from "@mui/material";
import getShort from "../../../utils/getShort";

export default function AvatarProfile () {
    const user = useSelector(store => store.meeting.me);
    const cameraActive = useSelector(store => store.meeting.camera.active);
    const name = useMemo(() => `${user?.firstname} ${user?.lastname}`,  [user]);
    const theme = useTheme();
    const { background, text } = generateColorsFromId(user?.id, theme.palette.mode);

    const avatarSx = useMemo(() => ({
        color: text,
        bgcolor: background,
        fontWeight: 'bold',
        fontSize: 40,
    }), [background, text]); 

    return (!cameraActive &&
        <MuiBox className="avatar-profile">
            <Avatar
                sx={{
                    width: 100,
                    height: 100,
                    ...avatarSx,
                    borderColor: avatarSx.color,
                }}
                src={user?.image}
                children={getShort(name)}
            />
        </MuiBox>
    )
}