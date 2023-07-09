import processData from '../../../../../utils/processData';
import db from '../../../../../database/db';
import { sendFile } from '../useSendMessage';

export default async function sendVoice ({chunksRef, target, downloadsRef}) {
    const data = [{
        File: new Blob([...chunksRef?.current], {type: 'audio/wav'}),
        id: Date.now().toString(16),
    }];
    const { localData, remonteData } = processData(
        data, {
            target,
            date: new Date(),
        }
    );
    sendFile({
        data: {
            ...remonteData[0],
            fileType: 'voice'
        }, 
        downloadsRef,
    });
    await db?.messages.add({
        ...localData[0],
        type: 'voice',
        subType: undefined,
    });


}