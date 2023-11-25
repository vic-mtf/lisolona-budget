import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import Avatar from "../../../../components/Avatar";
import CustomBadge from "../../../../components/CustomBadge";
import useOnLine from "../../../../utils/useOnLine";
import getFullName from "../../../../utils/getFullName";
import getShort from "../../../../utils/getShort";
import { generateColorsFromId } from "../../../../utils/genColorById";
import { useTheme } from "@mui/material";

export default function AvatarProfile () {
    const user = useSelector(store => store.user)
    const isOnLine = useOnLine()
    const name = useMemo(() => getFullName(user), [user]);
    const theme = useTheme();
    const { background, text } = generateColorsFromId(user?.id, theme.palette.mode);
    const avatarSx = useMemo(() => ({
        color: text,
        bgcolor: background,
        fontWeight: 'bold',
        fontSize: 15,
    }), [background, text]);

    return (
        <React.Fragment>
             <CustomBadge 
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                online={isOnLine}
                invisible={!isOnLine}
            >
                <Avatar
                    src={user?.image}
                    srcSet={user?.image}
                    alt={name}
                    children={(getShort(name)?.toUpperCase() || undefined)}
                    imgProps={{
                        loading: "lazy",
                    }}
                    sx={{
                        ...avatarSx,
                    }}
                />
            </CustomBadge>
        </React.Fragment>
    );
}