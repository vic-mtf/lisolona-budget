import { Badge, Stack } from "@mui/material";
import Typography from "../../../../components/Typography";
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import {  useMemo } from "react";
import { convert } from "html-to-text";

export default function Notice ({badgeContent, id, type, name, description, message}) {
    const isNew = useMemo(() => badgeContent > 0, [badgeContent]);
    const defaultContent = useMemo(() => 
        type === 'direct' ?
        `Votre invitaion a été accepté, vous en contact avec ${name}` :
        `Nouveau Lisanga: \n${description}`,
        [name, description]
    );
    
    const notice =  useMemo(() => {
        const label = convert( 
            message?.content || defaultContent, { wordwrap: 130 }
        );
        return (
            message?.type === 'text' ? {label} : types[
            message?.type === 'media' ?
            message.subtype.toLowerCase() : message?.type
        ]) || {label};
    }, [message?.content, defaultContent]);

    return (
        <Stack direction="row" spacing={1} >
            <Typography 
                variant="caption"
                noWrap
                textOverflow="ellipsis"
                title={notice.label}
                flexGrow={1} 
                children={notice.label || notice.icon}
                color={isNew ? "primary" : "text.secondary"}
            />
            <Badge
                badgeContent={badgeContent} 
                color="primary"
                sx={{
                    width: 20,
                    [`& .MuiBadge-badge`]: {
                        right: 10,
                        top: 10,
                        padding: '0 4px',
                    }
                }}
            />
        </Stack>
    )
}

Notice.defaultProps = {
    badgeContent: 0,
}

const  types = {
    image: {
        icon: <PhotoOutlinedIcon  sx={{fontSize: '15px'}}  />,
        //label: "Image"
    },
    video: {
        icon: <SlideshowOutlinedIcon sx={{fontSize: '15px'}}  />,
        //label: "Vidéo"
    },
    audio: {
        icon: <KeyboardVoiceOutlinedIcon sx={{fontSize: '15px'}}  />,
        //label: "Audio"
    },
    document: {
        icon: <ArticleOutlinedIcon sx={{fontSize: '15px'}}  />,
        //label: "Document"
    },
    call: {
        icon: <ContactPhoneOutlinedIcon sx={{fontSize: '15px'}}  />,
        //label: "Appel"
    },
};