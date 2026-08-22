let listeners = new Set();
let current = null;

export const cartPopupBus = {
  subscribe: (fn) => {
    listeners.add(fn);
    fn(current);
    return () => listeners.delete(fn);
  },
  show: (product, quantity = 1) => {
    current = { product, quantity, key: Date.now() };
    listeners.forEach((fn) => fn(current));
  },
  hide: () => {
    current = null;
    listeners.forEach((fn) => fn(current));
  }
};
