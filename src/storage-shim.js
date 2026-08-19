if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(key) {
      try {
        const value = localStorage.getItem(key);
        return value == null ? null : { value };
      } catch (e) {
        return null;
      }
    },
    async set(key, value) {
      try {
        localStorage.setItem(key, typeof value === "string" ? value : String(value));
      } catch (e) {
        console.error("storage.set failed", e);
      }
    },
    async delete(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {}
    },
  };
}
