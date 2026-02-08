import test from 'node:test';
import assert from 'node:assert/strict';
import { safeFetchJson } from '../services/fetchService.js';

test('safeFetchJson parses successful response', async () => {
  global.fetch = async () => ({ ok: true, json: async () => ({ hello: 'world' }) });
  const data = await safeFetchJson('https://example.com');
  assert.equal(data.hello, 'world');
});

test('safeFetchJson throws on rate limit', async () => {
  global.fetch = async () => ({ ok: false, status: 429 });
  await assert.rejects(() => safeFetchJson('https://example.com'), /Rate limit/);
});
