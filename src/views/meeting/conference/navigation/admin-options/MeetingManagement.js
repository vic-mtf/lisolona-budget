import { Switch, ListItem, ListItemText } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import useGetClients from '../../actions/useGetClients';
import { useSelector, useDispatch } from 'react-redux';
import { setConferenceData } from '../../../../../redux/conference';

export default function MeetingManagement () {
    const checked = useSelector(store => store.conference.moderatorOptions.meetingManagement);
    const dispatch = useDispatch();

    return (
        <ListItem alignItems="flex-start">
            <ListItemText
            primary="Gestion des hôtes de réunions"
            secondaryTypographyProps={{
                variant: 'caption'
            }}
            primaryTypographyProps={{
                variant: 'body2'
            }}
            secondary={`
                Ces configurations vous offrent la possibilité 
                de restreindre les actions que les 
                participants peuvent entreprendre lors de la réunion.
            `}
            />
            <Switch
                edge="end"
                onChange={() =>
                    dispatch(
                        setConferenceData({
                            data: {
                                moderatorOptions: {
                                    meetingManagement: !checked,
                                },
                            }
                        })
                    )
                }
                checked={checked}
                inputProps={{
                    'aria-labelledby': 'switch-list-label-meeting-management',
                }}
        />
        </ListItem>
    );
}