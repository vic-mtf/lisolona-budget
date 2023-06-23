import getServerUri from "../../utils/getServerUri";
import initDataBase from "../initDataBase";

export default function getMedias ({userId, target}) {
    const db = initDataBase();
    return new Promise((resolve, reject) => {
        db?.messages
        .filter(({targetId, subType}) => 
            targetId === target.id && /video|image/.test(subType)
        ).toArray().then(data => {
            const messages = data.sort((a, b) => 
                (new Date(a.createdAt)).getTime() - 
                (new Date(b.createdAt)).getTime()
            )
            resolve(
                messages.map(message => {
                   const src =  getServerUri({pathname: message.content}).toString();
                    return {
                        ...message,
                        type: message.subType,
                        urls: {
                            small: src,
                            regular: src,
                            thumb: src,
                        }
                    }
            })
            );
        }).catch(err => reject(err));
      });
}