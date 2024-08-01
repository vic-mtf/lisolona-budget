const messages = {
  0: {
    severity: "warning",
    message: `
          Votre appareil n'est pas connecté à Internet. 
          Veuillez vérifier votre connexion réseau et réessayer.`,
  },
  404: {
    severity: "error",
    message: `
          Le code de la reunion entré est incorrect. 
          Veuillez vérifier et réessayer. `,
  },
};

export default messages;
