import { calculateBreakEven, calculateDCF, calculateLoan, calculateSIP, calculateStartup } from '../utils/calculations';

export const models = [
  { id: 'dcf', name: 'Discounted Cash Flow (DCF)', summary: 'Estimate enterprise value from projected free cash flows.' },
  { id: 'three-statement', name: '3-Statement Model', summary: 'Connect income statement, balance sheet, and cash flow.' },
  { id: 'startup', name: 'Startup Valuation Model', summary: 'Assess valuation, burn, runway, and dilution.' },
  { id: 'break-even', name: 'Break-even Analysis', summary: 'Identify unit economics and break-even sales volume.' },
  { id: 'budget', name: 'Budget Forecast Model', summary: 'Forecast operating plans and spending allocation.' },
  { id: 'ratio', name: 'Ratio Analysis', summary: 'Track profitability, leverage, and liquidity metrics.' },
  { id: 'loan', name: 'Loan Amortization Model', summary: 'Model EMI, total interest, and principal schedule.' },
  { id: 'sip', name: 'SIP / Investment Growth Calculator', summary: 'Simulate long-term wealth from recurring investments.' }
];

export const modelConfigs = {
  dcf: {
    formula: 'EV = Σ FCFt/(1+WACC)^t + TV/(1+WACC)^n',
    defaults: { revenueGrowth: 12, ebitMargin: 18, taxRate: 24, discountRate: 10, terminalGrowth: 3, years: 5 },
    compute: calculateDCF
  },

  'three-statement': {
    formula: 'Revenue drives net income, which flows into retained earnings and cash.',
    defaults: { growthRate: 8, marginImprovement: 2 },
    compute: (input, revenue = 1000) => {
      const rev = revenue * (1 + input.growthRate / 100);
      const netIncome = rev * (0.12 + input.marginImprovement / 100);
      const assets = rev * 1.8;
      const liabilities = rev * 0.9;
      const freeCashFlow = netIncome * 0.8;
      return { rev, netIncome, assets, liabilities, freeCashFlow };
    }
  },
  budget: {
    formula: 'Forecast = Prior spend × (1 + growth assumptions)',
    defaults: { revenuePlan: 1200000, opex: 600000, headcountGrowth: 12 },
    compute: (input) => ({
      projectedRevenue: input.revenuePlan,
      projectedOpex: input.opex,
      forecastProfit: input.revenuePlan - input.opex,
      nextYearHeadcount: 50 * (1 + input.headcountGrowth / 100)
    })
  },
  ratio: {
    formula: 'Ratios compare profitability, leverage, and liquidity.',
    defaults: { pe: 18, roe: 0.17, de: 0.8, current: 1.6 },
    compute: (input) => ({
      pe: input.pe,
      roe: input.roe,
      de: input.de,
      current: input.current
    })
  },
  startup: {
    formula: 'Valuation = ARR × Revenue Multiple',
    defaults: { monthlyRevenue: 50000, growthRate: 8, burnRate: 60000, runwayMonths: 18, revenueMultiple: 6, equityRaised: 1000000, preMoney: 9000000 },
    compute: calculateStartup
  },
  'break-even': {
    formula: 'Break-even units = Fixed Cost / (Price - Variable Cost)',
    defaults: { fixedCosts: 200000, variableCost: 25, price: 55 },
    compute: calculateBreakEven
  },
  loan: {
    formula: 'EMI = P×r×(1+r)^n / ((1+r)^n - 1)',
    defaults: { loanAmount: 500000, interestRate: 9.5, tenureYears: 5 },
    compute: calculateLoan
  },
  sip: {
    formula: 'FV = P × [((1+r)^n -1)/r] × (1+r)',
    defaults: { monthlyInvestment: 500, annualReturn: 12, years: 15 },
    compute: calculateSIP
  }
};

export const commonEducation = {
  mistakes: ['Ignoring seasonality', 'Using optimistic assumptions without sensitivity checks', 'Mixing nominal and real growth rates'],
  interview: ['How do you derive WACC?', 'When should you use terminal multiple vs Gordon growth?', 'How do you validate model outputs?']
};
