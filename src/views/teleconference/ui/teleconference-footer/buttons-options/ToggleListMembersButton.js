import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { BottomNavigationAction, Tooltip } from '@mui/material';
import Typography from '../../../../../components/Typography';

export default function ToggleListMembersButton () {

    return (
            <div>
                <BottomNavigationAction
                    disabled
                    icon={<GroupsOutlinedIcon fontSize="small" />} 
                    label={
                        <Typography
                            variant="caption" 
                            fontSize="10px" 
                            color="inherit"
                        >
                            Participants
                        </Typography>
                    }
                    color="inherit"
                    showLabel
                    //onClick={() => setTurnOn(state => !state)}
                    sx={{
                        borderRadius: 1,
                    }}
                />
            </div>
    )
}