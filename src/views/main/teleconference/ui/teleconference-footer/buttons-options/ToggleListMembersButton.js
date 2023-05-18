import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { Badge, BottomNavigationAction } from '@mui/material';
import Typography from '../../../../../../components/Typography';
import { useTeleconferenceUI } from '../../TeleconferenceUI';
import { useSelector } from 'react-redux';
import { useTeleconference } from '../../../../../../utils/TeleconferenceProvider';

export default function ToggleListMembersButton () {
    const target = useSelector(store => store.teleconference.target);
    const [{participants}] = useTeleconference();
    const [{openNavMembers},{
        setOpenChatBox,
        setOpenNavMembers
    }] = useTeleconferenceUI();
  
    return (
            <div>
                <BottomNavigationAction
                    selected={openNavMembers}
                    disabled={target?.type === 'direct'}
                    icon={
                        <Badge 
                            badgeContent={participants?.length} 
                            color="primary"
                        >
                            <GroupsOutlinedIcon fontSize="small" />
                        </Badge>
                    } 
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
                    onClick={() => {
                        setOpenChatBox(false);
                        setOpenNavMembers(open => !open);
                    }}
                    sx={{
                        borderRadius: 1,
                    }}
                />
            </div>
    )
}