import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

window.__GEMINI_API_KEY__ = __GEMINI_API_KEY__;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);