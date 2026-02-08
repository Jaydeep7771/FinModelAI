export async function fetchCompanyData(symbol = 'AAPL') {
  const res = await fetch(`/api/financials/company/${symbol}`);
  if (!res.ok) throw new Error('Failed to fetch company data');
  return res.json();
}

export async function fetchRatios(symbol = 'MSFT') {
  const res = await fetch(`/api/financials/ratios/${symbol}`);
  if (!res.ok) throw new Error('Failed to fetch ratio data');
  return res.json();
}

export async function fetchMacro(country = 'USA') {
  const res = await fetch(`/api/financials/macro/${country}`);
  if (!res.ok) throw new Error('Failed to fetch macro data');
  return res.json();
}

export async function fetchFx(base = 'USD') {
  const res = await fetch(`/api/financials/fx/${base}`);
  if (!res.ok) throw new Error('Failed to fetch fx data');
  return res.json();
}
