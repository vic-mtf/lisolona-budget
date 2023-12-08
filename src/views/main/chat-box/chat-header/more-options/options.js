// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
//import DisabledByDefaultOutlinedIcon from '@mui/icons-material/DisabledByDefaultOutlined';
import store from '../../../../../redux/store';
import { addData, modifyData } from '../../../../../redux/data';

const options = (contact, callback) => [
    {
        label: `Fermer la discussion`,
        // icon: <DisabledByDefaultOutlinedIcon/>,
        onClick() {
            store.dispatch(addData({key: 'target', data: null}));
            if(typeof callback === 'function')
                callback();
        },
    },
    {
        label: `Infos du ${contact?.type === 'room' ? 'Lisanga' : 'contact'}`,
        //icon: <InfoOutlinedIcon/>,
        // disabled: true,
        onClick() {
            
            store.dispatch(
                modifyData({ 
                    data: true,
                    key: 'target.showDetails',
                 })
            );

            if(typeof callback === 'function')
                callback();
        }
    },
]
export default options;