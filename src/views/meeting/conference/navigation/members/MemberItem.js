import { ListItem, ListItemAvatar, ListItemText } from "@mui/material"
import AvatarStatus from "../../../../../components/AvatarStatus";
import LoadingIndicator from "./LoadingIndicator";
import { useRef } from "react";
import MemberOptions from "./MemberOptions";
import CallbackOption from "./CallbackOption";

export default function MemberItem ({name, id, avatarSrc, uid, type, joined}) {
    const rootRef = useRef();

    return (
        <ListItem
            ref={rootRef}
            secondaryAction={
                <CallbackOption rootRef={rootRef}/>
            }
        >
            <ListItemAvatar>
                <AvatarStatus
                    avatarSrc={avatarSrc}
                    name={name}
                    id={id}
                    invisible={true}
                />
            </ListItemAvatar>
            <ListItemText
                primary={name}
            />
        </ListItem>
    )
}