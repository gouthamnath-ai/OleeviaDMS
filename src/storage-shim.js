// Must load before App.jsx — ESM hoists imports, so this cannot live in main.jsx after the App import.
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
