import { getCollection } from 'astro:content';
import { countChecklist } from './url';

export async function getStages() {
  const entries = await getCollection('guide');
  return entries
    .sort((a, b) => a.data.order - b.data.order)
    .map((e) => ({ id: e.id, ...e.data, total: countChecklist(e.body), entry: e }));
}
