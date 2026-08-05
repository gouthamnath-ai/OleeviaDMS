import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Oleevia DocFlow was originally built against `window.storage`, a
// key/value API provided by the Claude artifacts sandbox. This app has no
// backend of its own, so on a real deployment we back that same API with
// the browser's localStorage — same per-browser demo behavior (accounts,
// requests, and audit trail persist in this browser only), no external
// dependency required.
if (typeof window !== "undefined" && !window.storage) {
  const PREFIX = "oleevia_docflow:";

  window.storage = {
    async get(key) {
      const raw = window.localStorage.getItem(PREFIX + key);
      if (raw === null) return null;
      return { key, value: raw, shared: false };
    },
    async set(key, value) {
      window.localStorage.setItem(PREFIX + key, value);
      return { key, value, shared: false };
    },
    async delete(key) {
      window.localStorage.removeItem(PREFIX + key);
      return { key, deleted: true, shared: false };
    },
    async list(prefix) {
      const keys = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const fullKey = window.localStorage.key(i);
        if (fullKey && fullKey.startsWith(PREFIX)) {
          const key = fullKey.slice(PREFIX.length);
          if (!prefix || key.startsWith(prefix)) keys.push(key);
        }
      }
      return { keys, prefix, shared: false };
    },
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
