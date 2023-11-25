import outgoingCallRing from '../assets/ring-ton-outgoing-call.aac';
import incomingCallRing from '../assets/Halloween-Cradles.aac';
import disconnectRing from '../assets/calldisconnect.aac'
import connexionRing from '../assets/mixkit-on-hold-ringtone.aac';
import endCallRing from '../assets/end-call.aac';
import signalRing from '../assets/ton-mobi.aac';
import busyPhoneRing from '../assets/busyphone.aac';
import sendMessageRing from '../assets/banana-peel-slip-zip-sound.aac';
import answeringMachineRing from '../assets/answering-machine.aac';
import actionRing from '../assets/s8note_s1tyd7115333623.aac';
import errorRing from '../assets/computer-error.aac';
import newMessageRing from '../assets/miui12dr_m5r75343.aac'

const nameSpace = 'GEID_LISOLONABUDGET_AUDIO_RINGTONE_SYTEME';

export default function answerRingtone({type, audio: _audio}) {
    let globalAudio;
    if(!_audio && window[nameSpace])
        window[nameSpace] = new Audio();
    globalAudio = window[nameSpace];
    const audio = _audio || globalAudio;
    audio.loop = false;
    if(audio) {
        audio.src = null;
        audio.autoplay = true;
        switch(type) {
            case 'outgoing' : 
                audio.src = outgoingCallRing;
                break;
            case 'incoming' : 
                audio.src = incomingCallRing;
                break;
            case 'signal' : 
                audio.src = signalRing;
                break;
            case 'connexion' : 
                audio.src = connexionRing;
                break;
            case 'end-call' : 
                audio.src = endCallRing;
                break;
            case 'disconnect' : 
                audio.src = disconnectRing;
                break;
            case 'busy' : 
                audio.src = busyPhoneRing;
                break;
            case 'send' : 
                audio.src = sendMessageRing;
                break;
            case 'action' : 
                audio.src = actionRing;
                break;
            case 'answering-machine' : 
                audio.src = answeringMachineRing;
                break;
            case 'error' : 
                audio.src = errorRing;
            case 'receive' :
                audio.src = newMessageRing;
            break;
            default: break;
        };
    }
    return audio;
}