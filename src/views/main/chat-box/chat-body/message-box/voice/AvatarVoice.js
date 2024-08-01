import { ListItemAvatar, useTheme, Box as MuiBox } from "@mui/material";
import { generateColorsFromId } from "../../../../../../utils/genColorById";
import CustomBadge from "../../../../../../components/CustomBadge";
import Avatar from "../../../../../../components/Avatar";
import getShort from "../../../../../../utils/getShort";
import { useMemo } from "react";
import { AudioVisualizer } from "../../../../../../components/AudioVisualizer";

export default function AvatarVoice ({name, avatarSrc, id}) {
    const theme = useTheme();
    const { background, text } = generateColorsFromId(id, theme.palette.mode);
    
    const avatarSx = useMemo(() => ({
        color: text,
        bgcolor: background,
        fontWeight: 'bold',
        fontSize: 15,
    }), [background, text]);


    return (
        <ListItemAvatar
            sx={{ 
                display: "flex",
                flexDirection: 'row-reverse'
            }}
        >

            <MuiBox
                sx={{
                    position: 'relative',
                }}
            >
                <MuiBox 
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <AudioVisualizer
                        maxSize={52}
                        size={40}
                    />
                </MuiBox>
                <MuiBox
                    position="relative"
                    zIndex={1}
                >
                    <CustomBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                        <Avatar
                            src={avatarSrc}
                            srcSet={avatarSrc}
                            alt={name}
                            children={getShort(name)}
                            imgProps={{
                                loading: "lazy"
                            }}
                            sx={{
                                ...avatarSx,
                                textTransform: 'capitalize',
                                width: 38,
                                height: 38,
                            }}
                        />
                    </CustomBadge>
                </MuiBox>
                
            </MuiBox>
        </ListItemAvatar>
    )
}

