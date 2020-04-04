export const LocalStorageManager = {
  setItem: (key, value) => localStorage.setItem(key, value),
  getBoolean: (key) => localStorage.getItem(key) === 'true',
};
