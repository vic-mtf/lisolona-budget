import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import Messages from '../../nav/messages/Messages';
import Participants from '../../nav/participants/Participants';
import Infos from '../../nav/Infos/Infos';
import Admin from '../../nav/admin/Admin';

const navActions = [
  {
    id: 'chats',
    icon: ChatOutlinedIcon,
    label: 'Messages',
    content: Messages,
    disabled: true,
  },
  {
    id: 'participants',
    icon: PeopleAltOutlinedIcon,
    label: 'Participants',
    content: Participants,
  },
  {
    id: 'infos',
    icon: InfoOutlinedIcon,
    label: 'Infos',
    content: Infos,
  },
  {
    id: 'authParams',
    icon: AdminPanelSettingsOutlinedIcon,
    label: 'Modération',
    content: Admin,
    hiddenKeys: ['isOrganizer'],
  },
];

export default navActions;
