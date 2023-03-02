import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DisabledByDefaultOutlinedIcon from '@mui/icons-material/DisabledByDefaultOutlined';
import store from '../../../../../redux/store';
import { addData } from '../../../../../redux/data';

const options = user => [
    {
        label: `Fermer la discution`,
        icon: <DisabledByDefaultOutlinedIcon/>,
        onClick() {
            store.dispatch(addData({key: 'chatId', data: null}));
        },
    },
    {
        label: `Infos du ${user?.type === 'room' ? 'Lisanga' : 'contact'}`,
        icon: <InfoOutlinedIcon/>
    },
]
export default options;