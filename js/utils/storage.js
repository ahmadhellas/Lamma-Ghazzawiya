/* ========================================
   LOCAL STORAGE UTILITIES
======================================== */

const Storage = {
  // Get data from LocalStorage
  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);

      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error("Storage Read Error:", error);

      return defaultValue;
    }
  },

  // Save data to LocalStorage
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));

      return true;
    } catch (error) {
      console.error("Storage Save Error:", error);

      return false;
    }
  },

  // Remove specific data
  remove(key) {
    localStorage.removeItem(key);
  },

  // Clear all data
  clear() {
    localStorage.clear();
  },
};
