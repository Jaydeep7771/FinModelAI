export async function safeFetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 429) {
      const err = new Error('Rate limit reached for upstream API');
      err.status = 429;
      throw err;
    }
    const err = new Error(`Upstream API error: ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}
