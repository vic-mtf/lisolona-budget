import outgoingCallRing from '../assets/ring-ton-outgoing-call.wav';
import incomingCallRing from '../assets/Halloween-Cradles.mp3';
import disconnectRing from '../assets/calldisconnect.mp3'
import connexionRing from '../assets/mixkit-on-hold-ringtone.wav';
import endCallRing from '../assets/end-call.wav';
import signalRing from '../assets/ton-mobi.mp3';
import busyPhoneRing from '../assets/busyphone.mp3';
import sendMessageRing from '../assets/banana-peel-slip-zip-sound.wav';
import answeringMachineRing from '../assets/answering-machine.wav';
import actionRing from '../assets/s8note_s1tyd7115333623.mp3';
import errorRing from '../assets/computer-error.wav';

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
            break;
            default: break;
        };
    }
    return audio;
}