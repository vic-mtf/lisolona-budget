import {
    Box as MuiBox,
    Chip
} from '@mui/material';
import RingVolumeOutlinedIcon from '@mui/icons-material/RingVolumeOutlined';
//import CallMadeOutlinedIcon from '@mui/icons-material/CallMadeOutlined';
import PhoneMissedOutlinedIcon from '@mui/icons-material/PhoneMissedOutlined';
//import CallReceivedOutlinedIcon from '@mui/icons-material/CallReceivedOutlined';
import PermPhoneMsgOutlinedIcon from '@mui/icons-material/PermPhoneMsgOutlined';
import CallEndOutlinedIcon from '@mui/icons-material/CallEndOutlined';
import PhoneDisabledOutlinedIcon from '@mui/icons-material/PhoneDisabledOutlined';
import CustomBadge from '../../../../../../components/CustomBadge';
import Typography from '../../../../../../components/Typography';

export default function Announcement ({status, time, name, isMine}) {
    return (
        <MuiBox my={2}>
            <Typography align="center" variant="caption" color="text.secondary">{time}</Typography>
            <MuiBox 
                mb={1} 
                justifyContent="center" 
                display="flex"
            >
                <Chip
                    label={
                        <Typography variant="caption">
                            {messages({name, isMine})[status]}
                        </Typography>
                    }
                    avatar={
                    <Typography variant="caption">
                        {icons[status]}
                    </Typography>
                    }
                    size="small"
                />
            </MuiBox>
        </MuiBox>
    )
}

const sx = {
    fontSize: 15,
}

const icons = [
        <div>
            <RingVolumeOutlinedIcon color="success" sx={sx}/>
        </div>,
            <CustomBadge
                active={true}
                online={true}
                variant="dot"
                sx={{
                    '& .MuiBadge-badge': {
                        right: 25,
                        top: 10,
                        padding: '0 4px',
                      },
                }}
            >
                <PermPhoneMsgOutlinedIcon color="success" sx={sx}/>
            </CustomBadge>
    ,
    <CallEndOutlinedIcon sx={sx} color="success" />,
    <PhoneMissedOutlinedIcon color="error" sx={sx}/>,
    <PhoneDisabledOutlinedIcon sx={sx}color="error"/>,
];

const messages = ({name, isMine}) => [
    isMine ? `Vous avez lancé l'appel`: 
    `${name} a lancé l'appel cliquez pour repondre`,
    `Appel en cours, cliquez pour rejoindre`,
    `Appel sortant` ? `Appel sortant`: `Appel entrant de ${name?.toLowerCase()}`,
    isMine ? `Appel sans reponse` : `Appel manqué de ${name}`,
    `Appel rejetté ${isMine ? '' : ' de ' + name}`,
];