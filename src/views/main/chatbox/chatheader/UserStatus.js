import { Badge } from "@mui/material";
import React, { useMemo} from "react";
import { greenColor } from "../../../../components/CustomBadge";
import Typography from "../../../../components/Typography";
import timeHumanReadable from "../../../../utils/timeHumanReadable";
import { useSelector } from "react-redux";

export default function UserStatus ({target}) {
    const status = useSelector(store => store.status[target?.id]);
    const online = useMemo(() => status === 'online', [status]);
    return ( Boolean(status) &&
            <Badge 
                variant={online ? "dot" : undefined}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                sx={{
                    '& .MuiBadge-badge': {
                        bgcolor: greenColor,
                        left: 8,
                        top: 9,
                        boxShadow:  theme => `0 0 0 1.5px ${theme.palette.text.primary}`,
                        padding: '0 4px',
                      },
                }}
            >
                <Typography
                    color="text.secondary" 
                    variant="caption" 
                    textOverflow="ellipsis"
                    overflow="hidden"
                    pl={online ? 2 : 0}
                    noWrap
                    children={
                        `en ligne ${
                            online ? 'maintenant' : 
                            timeHumanReadable(status, true, { showDetail: true})
                            .toLocaleLowerCase()
                        }`
                    } 
                />
            </Badge>
    )
}