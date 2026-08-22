let count = 0;
const listeners = new Set();

const notify = () => listeners.forEach((fn) => fn(count));

export const loadingBus = {
  subscribe: (fn) => {
    listeners.add(fn);
    fn(count);
    return () => listeners.delete(fn);
  },
  start: () => {
    count += 1;
    notify();
  },
  end: () => {
    count = Math.max(0, count - 1);
    notify();
  }
};
