// import db from '../database/db';
// import getBase64Image from './getBase64Image';
// import filterByKey from './filterByKey';
import { setDiscussion } from '../database/structureDiscussionData';
import { setContacts } from '../database/structureContact';
import { setMeetingData } from '../database/structureMeetingData';

export default async function getData ({
    discussions=[], 
    contacts=[], 
    invitations=[], 
    meetings=[]
}, callback) {
    const functions = [
        setDiscussion, 
        setContacts, 
        setMeetingData
    ];
    const args = [
        [discussions], 
        [contacts], 
        [meetings]
    ];
    Promise.all(functions.map((fn, index) => fn(...args[index]))).then(() => {
        if(typeof callback === 'function') callback();
    });
}