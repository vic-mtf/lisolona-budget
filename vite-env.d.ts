/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_BASE_URL: string;
  readonly VITE_RESPONSE_TYPE: string;
  readonly VITE_RESPONSE_ENCODING: string;
  readonly VITE_MAX_CONTENT_LENGTH: string;
  readonly VITE_PROXY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
