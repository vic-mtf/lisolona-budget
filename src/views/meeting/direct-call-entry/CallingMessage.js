
import Typography from "../../../components/Typography";
import { useMemo } from "react";

export default function CallingMessage ({callState}) {
    const message = useMemo(() => messages[callState], [callState]);
    return (
        <Typography
            maxWidth={300}
            height={50}
            align="center"
            variant="body1"
        >
            {message}
        </Typography>
    );
}

const messages = {
    before: `
    Pour démarrer un appel vidéo, veuillez 
    appuyer sur l'icône correspondante de la vidéo`,
    waiting: `Patientez...`,
    ringing: 'Appel en cours...',
    incoming: 'Appel entrant...',
    hangup: `Fin d'appel`,
    reject: 'Rejeter',
    unanswered: 'Pas de reponse',
    busy: 'En communication...',
    network: `Impossible de poursuivre l'appel, problème de réseau`,
    disconnect: 'Hors ligne',
    error: `Impossible de poursuivre l'appel, un problème est survenu`,
}