// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import DisabledByDefaultOutlinedIcon from '@mui/icons-material/DisabledByDefaultOutlined';
import store from '../../../../../redux/store';
import { addData } from '../../../../../redux/data';

const options = (contact, callback) => [
    {
        label: `Fermer la discution`,
        //icon: <DisabledByDefaultOutlinedIcon/>,
        onClick() {
            store.dispatch(addData({key: 'chatId', data: null}));
            if(typeof callback === 'function')
                callback();
        },
    },
    {
        label: `Infos du ${contact?.type === 'room' ? 'Lisanga' : 'contact'}`,
        //icon: <InfoOutlinedIcon/>,
        disabled: true,
        onClick() {
            const name = '_user-infos';
            const customEvent = new CustomEvent(
                name, {
                    detail: {name, contact}
                }
            );
            document.getElementById('root')
            .dispatchEvent(customEvent);
            if(typeof callback === 'function')
                callback();
        }
    },
]
export default options;