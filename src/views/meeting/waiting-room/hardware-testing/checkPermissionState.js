export default async function checkPermissionState() {
    let title = '';
    let message = '';
    let state = '';
    try {
        const cameraPermissionStatus = await navigator.permissions.query({name:'camera'});
        const microphonePermissionStatus = await navigator.permissions.query({name:'microphone'});
        if (cameraPermissionStatus.state === 'granted' && microphonePermissionStatus.state === 'granted') {
            title = 'Permissions accordées';
            message = 'Félicitations ! Vous avez accordé l\'accès à votre caméra et à votre microphone. Vous êtes maintenant prêt à rejoindre la vidéoconférence.';
            state = 'granted';
        } else if (cameraPermissionStatus.state === 'denied' || microphonePermissionStatus.state === 'denied') {
            title = 'Permission refusée';
            message = 'Il semble que vous ayez refusé l\'accès à votre caméra ou à votre microphone. Pour participer à la vidéoconférence, vous devez modifier les paramètres de votre navigateur pour permettre l\'accès à la caméra et au microphone.';
            state = 'denied';
        } else if (cameraPermissionStatus.state === 'prompt' || microphonePermissionStatus.state === 'prompt') {
            title = 'Permission en attente';
            message = 'Il semble que vous n\'ayez pas encore accordé l\'accès à votre caméra ou à votre microphone. Pour continuer la vidéoconférence, veuillez accorder l\'accès à la caméra et au microphone lorsque vous y êtes invité par votre navigateur.';
            state = 'prompt';
        } else {
            title = 'État de permission inconnu';
            message = 'Désolé, nous ne pouvons pas déterminer l\'état de la permission de votre caméra ou de votre microphone. Veuillez vérifier les paramètres de votre navigateur et vous assurer que les permissions de la caméra et du microphone sont correctement configurées.';
            state = 'unknown';
        }
    } catch(error) {
        title = 'Erreur';
        message = `Une erreur s'est produite lors de la vérification de l'état de la permission. Veuillez vérifier les paramètres de votre navigateur et vous assurer que les permissions de la caméra et du microphone sont correctement configurées. Si le problème persiste, vous pouvez essayer de redémarrer votre navigateur ou de contacter le support technique pour obtenir de l'aide. Détails de l'erreur : ${error}`;
        state = 'error';
    }

    return { title, message, state };
}
