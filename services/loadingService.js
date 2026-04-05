const listeners = new Set();
let activeRequestCount = 0;

const notifyListeners = () => {
  const isLoading = activeRequestCount > 0;
  listeners.forEach((listener) => listener(isLoading));
};

const loadingService = {
  subscribe: (listener) => {
    listeners.add(listener);
    listener(activeRequestCount > 0);
    return () => {
      listeners.delete(listener);
    };
  },
  increment: () => {
    activeRequestCount += 1;
    notifyListeners();
  },
  decrement: () => {
    activeRequestCount = Math.max(0, activeRequestCount - 1);
    notifyListeners();
  },
  getIsLoading: () => activeRequestCount > 0,
};

export default loadingService;
