export const setToLS = (name, val) => {
  localStorage.setItem(name, JSON.stringify(val));
};

export const getFromLS = (name) => {
  return JSON.parse(localStorage.getItem(name));
};

export const removeFromLS = (name) => {
  localStorage.removeItem(name);
};

export const isLSHasItem = (name) => {
  return !!localStorage.getItem(name);
};
