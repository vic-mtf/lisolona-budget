
import { useData } from "../../../../utils/DataProvider";
import getServerUri from "../../../../utils/getServerUri";

export default function useSendFiles ({target, }) {
    const [{downloadsRef}] = useData();

    return function sendFiles({group}) {
        const xhr = new XMLHttpRequest();
        const initData = {
            xhr,
            type: group.type,
            
        }
        const formData = new FormData();
        formData.append('clientIds',JSON.stringify(group.ids));
    
        group.files.forEach(file => {
          formData.append('files', file);
        });
    
        formData.append('type', group.type);
        if (group.subType !== null) {
          formData.append('subType', group.subType);
        }
      
        const url = getServerUri({pathname: '/api/chat/file'})
        xhr.open('POST', url);
        xhr.send(formData);
        return xhr;
    }
}