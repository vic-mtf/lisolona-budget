export default function errorDevices(camera, micro, speaker) {
    
    let title = "Erreur de périphérique";
    let message = "";
    if (camera === 0 && micro === 0 && speaker === 0) {
        message = "Nous ne pouvons pas trouver votre caméra, votre micro et votre haut-parleur. Veuillez vérifier que tous vos périphériques sont correctement connectés et activés.";
    } else if (camera === 0 && micro === 0) {
        message = "Nous ne pouvons pas trouver votre caméra et votre micro. Veuillez vérifier que votre caméra et votre micro sont correctement connectés et activés.";
    } else if (camera === 0 && speaker === 0) {
        message = "Nous ne détectons pas votre caméra et votre haut-parleur. Assurez-vous que votre caméra est connectée et que votre haut-parleur est connecté avec le volume suffisamment élevé.";
    } else if (micro === 0 && speaker === 0) {
        message = "Votre micro et votre haut-parleur semblent être déconnectés ou désactivés. Veuillez vérifier vos paramètres audio.";
    } else if (camera === 0) {
        message = "Nous ne pouvons pas trouver votre caméra. Veuillez vérifier que votre caméra est correctement connectée et activée.";
    } else if (micro === 0) {
        message = "Votre micro semble être déconnecté ou désactivé. Veuillez vérifier vos paramètres audio.";
    } else if (speaker === 0) {
        message = "Nous ne détectons pas de haut-parleur. Assurez-vous que votre haut-parleur est connecté et que le volume est suffisamment élevé.";
    } else {
        title = "Tous les périphériques sont connectés";
        message = "Votre caméra, votre micro et votre haut-parleur sont tous connectés et prêts à être utilisés.";
    }
    return { title, message };
}