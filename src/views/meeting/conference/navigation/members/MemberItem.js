import { ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import AvatarStatus from "../../../../../components/AvatarStatus";
import { useRef } from "react";
import MemberOptions from "./MemberOptions";
import CallbackOption from "./CallbackOption";
import store from "../../../../../redux/store";
import useClientState from "../../actions/useClientState";

export default function MemberItem ({id, active, name, isGuest, avatarSrc}) {
    const rootRef = useRef();
    const state = useClientState({id, props: [], key: 'state'});
 
    return (
        <ListItem
            ref={rootRef}
            disablePadding
        >
            <ListItemButton
                disableRipple
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
                    primaryTypographyProps={{
                        noWrap: true,
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        title: name,
                        variant: 'body2',
                    }}
                    secondary={getStatus({
                        ...state,
                        isGuest,
                        isSelf: store.getState()?.meeting?.me?.id === id,
                    })}
                    secondaryTypographyProps={{
                        variant: "caption",
                    }}
                />
                <ListItemIcon
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'end'
                    }}
                >
                    {active ? 
                        (
                            <MemberOptions 
                                rootRef={rootRef}
                                name={name}
                                state={state}
                                id={id}
                            />
                        ):
                        (
                            <CallbackOption 
                                rootRef={rootRef}
                                id={id}
                            />
                        )
                    }
                </ListItemIcon>
            </ListItemButton>
        </ListItem>
    )
}

function getStatus({isOrganizer, isSelf, isGuest}) {
    if (isOrganizer) 
        return isSelf ? "Modérateur (vous)" : isGuest ? "Modérateur (invité)": "Modérateur";
    else if (isGuest) 
        return "Invité";
    else if (isSelf)
        return "Vous";
    else return "Collaborateur";
}
