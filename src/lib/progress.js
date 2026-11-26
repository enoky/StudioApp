// Checklist progress, stored only in this browser (localStorage).
const KEY = 'bs-checks-v1';

export function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}') || {};
  } catch {
    return {};
  }
}

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked: progress just won't persist */
  }
}

export function countFor(stage, state = load()) {
  const prefix = `${stage}:`;
  return Object.keys(state).filter((k) => k.startsWith(prefix) && state[k]).length;
}

export function clearAll() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
