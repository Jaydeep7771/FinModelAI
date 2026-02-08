import { env } from '../config/env.js';
import { withCache } from '../services/cacheService.js';
import { safeFetchJson } from '../services/fetchService.js';

export async function getCompanyFinancials(req, res, next) {
  try {
    const { symbol } = req.params;
    const data = await withCache(`fmp-${symbol}`, async () => {
      const [income] = await safeFetchJson(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=1&apikey=${env.fmpKey}`);
      const [balance] = await safeFetchJson(`https://financialmodelingprep.com/api/v3/balance-sheet-statement/${symbol}?limit=1&apikey=${env.fmpKey}`);
      const [cashflow] = await safeFetchJson(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?limit=1&apikey=${env.fmpKey}`);
      return {
        symbol,
        revenue: income?.revenue || 0,
        netIncome: income?.netIncome || 0,
        assets: balance?.totalAssets || 0,
        liabilities: balance?.totalLiabilities || 0,
        freeCashFlow: cashflow?.freeCashFlow || 0
      };
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function getRatios(req, res, next) {
  try {
    const { symbol } = req.params;
    const ratios = await withCache(`ratio-${symbol}`, async () => {
      const overview = await safeFetchJson(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${env.alphaVantageKey}`);
      return {
        pe: Number(overview.PERatio || 0),
        roe: Number(overview.ReturnOnEquityTTM || 0),
        de: Number(overview.DebtToEquityRatio || 0),
        current: Number(overview.CurrentRatio || 0)
      };
    });
    res.json(ratios);
  } catch (error) {
    next(error);
  }
}

export async function getMacroData(req, res, next) {
  try {
    const { country } = req.params;
    const data = await withCache(`macro-${country}`, async () => {
      const response = await safeFetchJson(`https://api.worldbank.org/v2/country/${country}/indicator/NY.GDP.MKTP.KD.ZG?format=json`);
      const gdpGrowth = response?.[1]?.find((item) => item.value !== null)?.value || 0;
      return { country, gdpGrowth };
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
}


export async function getFxRates(req, res, next) {
  try {
    const { base } = req.params;
    const data = await withCache(`fx-${base}`, async () => {
      const result = await safeFetchJson(`https://openexchangerates.org/api/latest.json?app_id=${env.openExchangeKey}&base=${base}`);
      return { base: result.base, rates: { EUR: result.rates?.EUR, INR: result.rates?.INR, GBP: result.rates?.GBP } };
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
}
