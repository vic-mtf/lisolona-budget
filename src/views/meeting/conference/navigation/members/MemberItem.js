import { ListItem, ListItemAvatar, ListItemText } from "@mui/material"
import AvatarStatus from "../../../../../components/AvatarStatus";
import LoadingIndicator from "./LoadingIndicator";
import { useMemo, useRef } from "react";
import MemberOptions from "./MemberOptions";
import CallbackOption from "./CallbackOption";
import getFullName from "../../../../../utils/getFullName";

export default function MemberItem ({id, type, identity, state}) {
    const rootRef = useRef();
    const name = useMemo(() => getFullName(identity), [identity]);
    const avatarSrc = useMemo(() => identity?.imageUrl, [identity]);

    /* 
      state : {
        handRaised
        isInRoom
        isOrganizer
        screenShared
    }  
    dentity : {
        email
        fname
        grade
        {grade, role}
        imageUrl
        lname
        mname
        _id   
    }
    auth: {shareScreen: false}
    */

    return (
        <ListItem
            ref={rootRef}
                secondaryAction={
                    type === 'found' ? 
                    (
                        <MemberOptions 
                            rootRef={rootRef}
                            state={state}
                            name={name}
                            id={id}
                        />
                    ):
                    (
                        <CallbackOption rootRef={rootRef}/>
                    )
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