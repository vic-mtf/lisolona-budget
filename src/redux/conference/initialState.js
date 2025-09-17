import { red } from "@mui/material/colors";

const initialState = {
  roomId: null,
  loading: false,
  callTarget: null,
  step: "setup",
  AGORA_DATA: {
    TOKEN: null,
    APP_ID: null,
    EXPIRE_AT: null,
    CHANNEL: null,
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
        enabled: false,
        displaySurface: null,
        capturedSurfaceControl: null,
        zoom: 1,
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
    view: {
      layoutView: "liveInteractionGrid", // or "presentation"
      liveInteractionGrid: {
        layout: "grid",
        grid: {
          max: 12,
        },
      },
      presentation: {},
      localParticipant: {
        mode: "floating",
      },
    },
    participants: {},
    actions: {
      raiseHand: false,
      search: "",
      localPresentation: {
        annotation: {
          active: false,
          mode: "pencil",
          color: red[500],
        },
      },
    },
  },
};

export default initialState;
