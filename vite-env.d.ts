/// <reference types="vite/client" />

declare global {
  interface Window {
    __GEMINI_API_KEY__: string;
  }
}

declare const __GEMINI_API_KEY__: string;

export {};
