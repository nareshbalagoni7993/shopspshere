let idCounter = 0;
let toasts = [];
const listeners = new Set();

const emit = () => listeners.forEach((fn) => fn(toasts));

const push = (type, message, duration = 3200) => {
  const id = ++idCounter;
  toasts = [...toasts, { id, type, message }];
  emit();
  window.setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, duration);
};

export const toastBus = {
  subscribe: (fn) => {
    listeners.add(fn);
    fn(toasts);
    return () => listeners.delete(fn);
  },
  dismiss: (id) => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }
};

export const toast = {
  success: (message) => push('success', message),
  error: (message) => push('error', message),
  info: (message) => push('info', message)
};
