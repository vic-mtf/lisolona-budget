import HistoryToggleOffRoundedIcon from '@mui/icons-material/HistoryToggleOffRounded';
import Groups3OutlinedIcon from '@mui/icons-material/Groups3Outlined';
import CastRoundedIcon from '@mui/icons-material/CastRounded';
import openNewWindow from '../../../../../utils/openNewWindow';
import { encrypt } from '../../../../../utils/crypt';
import store from '../../../../../redux/store';
import { setData } from '../../../../../redux/data';

const options = [
    {
        icon: Groups3OutlinedIcon,
        label: 'Démarrer une réunion instantanée',
        action ({ target, mode = 'prepare', secretCode, socket }) {
            const wd = openNewWindow({ url: '/meeting/', });
            wd.geidMeetingData = encrypt({ 
                    target, 
                    mode, 
                    secretCode , 
                    defaultCallingState: 'before', 
            });
            if(wd) {
                store.dispatch(setData({ data: { mode }}));
                wd.openerSocket = socket;
            }
        }
    },
    {
        icon: HistoryToggleOffRoundedIcon,
        label: 'Planifier une réunion',
        //disabled: true,
        action ({ target }) {
            const name = '__schedule-meeting-form';
            const customEvent = new CustomEvent(name, {
                detail: { target, name }
            });
            document.getElementById('root').dispatchEvent(customEvent);
        }
    },
    {
        icon: CastRoundedIcon,
        label: 'Diffusion vidéo en direct',
        disabled: true,
    }
];

export default options;