import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  fmpKey: process.env.FMP_API_KEY || '',
  alphaVantageKey: process.env.ALPHA_VANTAGE_API_KEY || '',
  openExchangeKey: process.env.OPEN_EXCHANGE_KEY || '',
  cacheTtl: Number(process.env.CACHE_TTL || 600)
};
