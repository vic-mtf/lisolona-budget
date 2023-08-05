import { ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import AvatarStatus from "../../../../../components/AvatarStatus";
import { useRef } from "react";
import MemberOptions from "./MemberOptions";
import CallbackOption from "./CallbackOption";
import store from "../../../../../redux/store";
import useClientState from "../../actions/useClientState";

export default function MemberItem ({id, active, name, avatarSrc}) {
    const rootRef = useRef();
    const state = useClientState({id, props: ['isAdmin'], key: 'state'});
 
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
                    secondary={
                        (state?.isAdmin ? 'Modérateur ' : '') +
                        (store.getState().meeting.me.id === id ? `(Vous)`  : '')
                    }
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