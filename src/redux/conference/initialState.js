const initialState = {
  loading: false,
  callTarget: null,
  step: "setup",

  AGORA_DATA: {
    TOKEN: null,
    APP_CERTIFICATE: null,
    APP_ID: null,
    EXPIRE_AT: null,
  },
  setup: {
    loading: true,
    devices: {
      alertPermission: {
        open: false,
        deviceType: null,
      },
      speaker: {
        deviceId: null,
        volume: 1,
        label: null,
      },
      screen: {
        deviceId: null,
        enabled: false,
        label: null,
      },
      camera: {
        deviceId: null,
        enabled: false,
        label: null,
        permission: null,
      },
      microphone: {
        deviceId: null,
        enabled: false,
        label: null,
        permission: null,
      },
      processedCameraStream: {
        filter: null,
        blurred: false,
        background: {
          enabled: false,
          id: null,
          loaded: false,
          uploadProgress: 0,
          downloadProgress: 0,
          customImages: [],
        },
        enhanced: false,
      },
      processedMicrophoneStream: {
        noiseSuppressor: false,
      },
      microphones: [],
      cameras: [],
      speakers: [],
      screens: [],
    },
  },
  meeting: {
    nav: {
      open: false,
      id: null,
    },
    participants: {},
  },
};

export default initialState;
