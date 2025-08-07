const initialState = {
  room: {
    name: null,
    description: null,
    type: null,
    status: null,
    createdAt: null,
    updatedAt: null,
    startedAt: null,
    endedAt: null,
    AGORA_DATA: {
      channel: null,
      token: null,
      uid: null,
      screenUid: null,
    },
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
          url: null,
          loaded: false,
          uploadProgress: 0,
          downloadProgress: 0,
        },
        enhanced: false,
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
      index: 0,
    },
  },
};

export default initialState;
