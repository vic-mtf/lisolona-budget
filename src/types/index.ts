import type { Theme } from "@mui/material/styles";

// ─── App Config ──────────────────────────────────────────────────────────────

export interface AppConfig {
  name: string;
  version: string;
  lang: string;
  languages: Language[];
  colors: {
    main: string;
    primary: {
      mode: ThemeMode;
      dark: ColorScheme;
      light: ColorScheme;
    };
  };
}

export interface Language {
  name: string;
  code: string;
}

export interface ColorScheme {
  main: string;
  default: string;
  paper: string;
}

// ─── Theme ───────────────────────────────────────────────────────────────────

export type ThemeMode = "light" | "dark" | "auto";

export interface ThemeState {
  mode: ThemeMode;
  opacity: number;
  blur: number;
}

// ─── Redux State ─────────────────────────────────────────────────────────────

export interface AppSliceState {
  theme: ThemeState;
  lang: string;
  users: UserProfile[];
  user: {
    stayConnected: boolean;
    data: UserProfile | null;
  };
  guest: GuestInfo | null;
}

export interface UserSliceState {
  id: string | null;
  token: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  name: string | null;
  docTypes: string[] | null;
  number: string | null;
  image: string | null;
  grade: string | null;
  role: string | null;
  auth: UserAuth | null;
  connected: boolean;
  isGuest: boolean;
}

export interface DataSliceState {
  targetView: string | null;
  discussionTarget: string | null;
  notifications: Notification[];
  calls: Call[];
  dialog: unknown;
  activeCall: boolean;
  app: {
    loaded: boolean;
    contacts: Contact[];
    discussions: Discussion[];
    notifications: Notification[];
    calls: Call[];
    messages: Record<string, Message[]>;
    setting: {
      network: {
        rttData: number[];
      };
    };
    actions: DataActions;
  };
  chatBox: ChatBoxState;
}

export interface ConferenceSliceState {
  callData: unknown;
  roomId: string | null;
  loading: boolean;
  callTarget: unknown;
  step: ConferenceStep;
  AGORA_DATA: AgoraData;
  setup: ConferenceSetup;
  meeting: MeetingState;
}

export type ConferenceStep = "setup" | "meeting" | "end";

export interface AgoraData {
  TOKEN: string | null;
  APP_ID: string | null;
  EXPIRE_AT: string | null;
  CHANNEL: string | null;
}

export interface RootState {
  app: AppSliceState;
  user: UserSliceState;
  data: DataSliceState;
  conference: ConferenceSliceState;
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  name?: string;
  email: string;
  image?: string;
  grade?: string;
  role?: string;
}

export interface UserAuth {
  name: string;
  privileges: Record<string, unknown>;
}

export interface GuestInfo {
  id: string;
  name: string;
  email?: string;
}

// ─── Communication ───────────────────────────────────────────────────────────

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  status?: "online" | "offline" | "busy";
}

export interface Discussion {
  id: string;
  name?: string;
  type: "private" | "group";
  members: string[];
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  clientId?: string;
  content: string;
  type: "text" | "audio" | "file" | "image" | "video";
  sender: string;
  targetId: string;
  createdAt: string;
  updatedAt?: string;
  files?: FileAttachment[];
  reply?: string;
  read?: boolean;
}

export interface Call {
  id: string;
  type: "audio" | "video";
  caller: string;
  callee: string;
  status: "pending" | "active" | "ended" | "missed";
  startedAt?: string;
  endedAt?: string;
}

export interface Notification {
  id: string;
  type: string;
  content: string;
  read: boolean;
  createdAt: string;
}

// ─── Files ───────────────────────────────────────────────────────────────────

export interface FileAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

// ─── Conference ──────────────────────────────────────────────────────────────

export interface DeviceInfo {
  deviceId: string | null;
  enabled: boolean;
  label: string | null;
  permission?: string | null;
}

export interface ScreenDevice {
  enabled: boolean;
  displaySurface: string | null;
  capturedSurfaceControl: string | null;
  zoom: number;
}

export interface ProcessedCameraStream {
  filter: string | null;
  blurred: boolean;
  background: {
    enabled: boolean;
    id: string | null;
    loaded: boolean;
    uploadProgress: number;
    downloadProgress: number;
    customImages: string[];
  };
  enhanced: boolean;
}

export interface ConferenceSetup {
  loading: boolean;
  devices: {
    alertPermission: {
      open: boolean;
      deviceType: string | null;
    };
    speaker: {
      deviceId: string | null;
      volume: number;
      label: string | null;
    };
    screen: ScreenDevice;
    camera: DeviceInfo;
    microphone: DeviceInfo;
    processedCameraStream: ProcessedCameraStream;
    processedMicrophoneStream: {
      noiseSuppressor: boolean;
    };
    microphones: MediaDeviceInfo[];
    cameras: MediaDeviceInfo[];
    speakers: MediaDeviceInfo[];
    screens: MediaDeviceInfo[];
  };
}

export type LayoutView = "liveInteractionGrid" | "presentation";
export type LocalParticipantMode = "floating" | "grid" | "fullscreen";
export type AnnotationMode = "pencil" | "eraser" | "text" | "shape";

export interface MeetingState {
  organizerAuth: {
    controlAuthorization: boolean;
    shareScreen: boolean;
    writeMessage: boolean;
    allowPrivateMessage: boolean;
    react: boolean;
    activateCam: boolean;
    activateMic: boolean;
  };
  nav: {
    open: boolean;
    id: string | null;
  };
  view: {
    layoutView: LayoutView;
    liveInteractionGrid: {
      layout: string;
      grid: { max: number };
    };
    presentation: Record<string, unknown>;
    localParticipant: {
      mode: LocalParticipantMode;
    };
  };
  participants: Record<string, unknown>;
  guests: Record<string, unknown>;
  actions: MeetingActions;
}

export interface MeetingActions {
  raiseHand: boolean;
  search: string;
  localPresentation: {
    annotation: {
      active: boolean;
      mode: AnnotationMode;
      color: string;
    };
    view: {
      activeId: string | null;
      showAll: boolean;
    };
  };
  liveInteractionGrid: {
    fullScreen: boolean;
    activeId: string | null;
    participant: {
      hide: Record<string, string>;
    };
  };
}

// ─── Chat Box ────────────────────────────────────────────────────────────────

export interface ChatBoxState {
  footer: {
    toolbar: boolean;
    emojiBar: boolean;
    recording: boolean;
    files: Record<string, unknown[]>;
  };
}

export interface DataActions {
  messaging: {
    info: { open: boolean };
    draft: Record<string, unknown>;
    reply: Record<string, unknown>;
    medias: {
      viewer: { open: boolean; id: string | null };
      playings: { targetId: string | null; id: string | null };
    };
    blink: Record<string, unknown>;
    scrollTo: string | null;
  };
  notifications: {
    blink: Record<string, unknown>;
    confirmDelete: { open: boolean };
  };
  contacts: {
    blink: Record<string, unknown>;
    confirmDelete: { open: boolean };
  };
  calls: {
    blink: Record<string, unknown>;
    confirmDelete: unknown;
    info: { open: boolean };
  };
}

// ─── MUI Theme Extension ─────────────────────────────────────────────────────

declare module "@mui/material/styles" {
  interface Theme {
    customOptions: {
      opacity: string;
      blur: string;
    };
  }
  interface ThemeOptions {
    customOptions?: {
      opacity?: string;
      blur?: string;
    };
  }
}

// ─── Component Props ─────────────────────────────────────────────────────────

export interface ChildrenProps {
  children: React.ReactNode;
}

export interface WithSxProps {
  sx?: Record<string, unknown>;
}
