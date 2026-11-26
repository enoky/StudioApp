// Shared helpers for the calculator pages: read inputs, remember them, format money.
export const money = (v) =>
  Number.isFinite(v) ? v.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }) : '–';
export const hours = (v, digits = 0) => (Number.isFinite(v) ? v.toLocaleString('en-CA', { maximumFractionDigits: digits }) : '–');
export const pct = (v) => (v === null || !Number.isFinite(v) ? '–' : `${Math.round(v * 100)}%`);

export function bindTool(slug, onChange) {
  const root = document.querySelector(`[data-tool="${slug}"]`);
  if (!root) return;
  const key = `bs-tool-${slug}`;
  const inputs = Array.from(root.querySelectorAll('form input[type="number"]'));
  const defaults = Object.fromEntries(inputs.map((i) => [i.id, i.defaultValue]));

  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (saved) inputs.forEach((i) => { if (saved[i.id] !== undefined) i.value = saved[i.id]; });
  } catch { /* ignore */ }

  const read = () => Object.fromEntries(inputs.map((i) => [i.id, i.value === '' ? 0 : Number(i.value)]));
  const run = () => {
    const values = read();
    try { localStorage.setItem(key, JSON.stringify(Object.fromEntries(inputs.map((i) => [i.id, i.value])))); } catch { /* ignore */ }
    onChange(values, root);
  };
  inputs.forEach((i) => i.addEventListener('input', run));
  root.querySelector('[data-reset]')?.addEventListener('click', () => {
    inputs.forEach((i) => { i.value = defaults[i.id]; });
    run();
  });
  run();
  return { run, root };
}

export function set(root, name, text) {
  root.querySelectorAll(`[data-out="${name}"]`).forEach((el) => { el.textContent = text; });
}
