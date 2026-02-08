import NodeCache from 'node-cache';
import { env } from '../config/env.js';

export const cache = new NodeCache({ stdTTL: env.cacheTtl });

export async function withCache(key, fetcher) {
  const found = cache.get(key);
  if (found) return found;
  const data = await fetcher();
  cache.set(key, data);
  return data;
}
