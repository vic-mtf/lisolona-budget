const errorsRefBase = {
    'call': {
        title: 'Problème de connexion',
        message: `
        <b>Lisolo na budget</b> a des difficultés à établir la connexion, 
        votre appareil semble être débranché de l'Internet ou 
        la qualité de votre connexion est mauvaise.`
    },
    'offline-direct': {
        title: 'Correspondant inactif',
        message: `
        Impossible de passer l'appel maintenant, 
        <b>&###name###&</b> est déconnecté, 
        veuillez réessayer ultérieurement.`
    },
    'timeout-direct': {
        title: 'Pas de réponse',
        message: `
        Aucune réponse de <b>&###name###&</b> , 
        il est peut-être occupé en ce moment, 
        rappelez plus tard.`
    },
    'offline-room': {
        title: 'Correspondants inactifs',
        message: `
        Pour l'instant, 
        aucun membre de Lisanga <b>&###name###&</b> n'est connecté, 
        veuillez réessayer plus tard.`
    },
    'timeout-room': {
        title: 'Pas de réponse',
        message: `
        Personne n'a répondu, il se peut que tous les 
        membres de Lisanga <b>&###name###&</b> soient occupés pour le moment, 
        essayez de nouveau plus tard.`
    }
};

export default errorsRefBase;