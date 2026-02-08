export function calculateDCF(input, baseRevenue = 1000) {
  const years = Number(input.years);
  const growth = Number(input.revenueGrowth) / 100;
  const margin = Number(input.ebitMargin) / 100;
  const taxRate = Number(input.taxRate) / 100;
  const discount = Number(input.discountRate) / 100;
  const terminalGrowth = Number(input.terminalGrowth) / 100;
  const cashFlows = [];

  let revenue = baseRevenue;
  for (let year = 1; year <= years; year += 1) {
    revenue *= 1 + growth;
    const ebit = revenue * margin;
    const fcf = ebit * (1 - taxRate);
    const pv = fcf / (1 + discount) ** year;
    cashFlows.push({ year, revenue, fcf, pv });
  }

  const lastFcf = cashFlows[cashFlows.length - 1]?.fcf || 0;
  const terminalValue = (lastFcf * (1 + terminalGrowth)) / (discount - terminalGrowth || 1);
  const pvTerminal = terminalValue / (1 + discount) ** years;
  const enterpriseValue = cashFlows.reduce((sum, row) => sum + row.pv, 0) + pvTerminal;

  return { cashFlows, terminalValue, pvTerminal, enterpriseValue };
}

export function calculateBreakEven({ fixedCosts, variableCost, price }) {
  const units = fixedCosts / (price - variableCost || 1);
  return { units, revenue: units * price };
}

export function calculateLoan({ loanAmount, interestRate, tenureYears }) {
  const n = tenureYears * 12;
  const r = interestRate / 100 / 12;
  const emi = (loanAmount * r * (1 + r) ** n) / ((1 + r) ** n - 1 || 1);
  let balance = loanAmount;
  const schedule = Array.from({ length: n }, (_, i) => {
    const interest = balance * r;
    const principal = emi - interest;
    balance = Math.max(balance - principal, 0);
    return { month: i + 1, principal, interest, balance };
  });
  return { emi, totalInterest: emi * n - loanAmount, schedule };
}

export function calculateSIP({ monthlyInvestment, annualReturn, years }) {
  const n = years * 12;
  const r = annualReturn / 100 / 12;
  const fv = monthlyInvestment * (((1 + r) ** n - 1) / r) * (1 + r);
  return { totalInvested: monthlyInvestment * n, futureValue: fv, wealthGained: fv - monthlyInvestment * n };
}

export function calculateStartup({ monthlyRevenue, growthRate, burnRate, runwayMonths, revenueMultiple, equityRaised, preMoney }) {
  const projectedRevenue = monthlyRevenue * (1 + growthRate / 100) ** runwayMonths;
  const valuation = projectedRevenue * 12 * revenueMultiple;
  const runway = burnRate ? runwayMonths + monthlyRevenue / burnRate : runwayMonths;
  const dilution = equityRaised / (preMoney + equityRaised || 1);
  return { projectedRevenue, valuation, runway, dilution };
}
