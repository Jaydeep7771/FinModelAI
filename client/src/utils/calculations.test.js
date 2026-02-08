import { describe, expect, it } from 'vitest';
import { calculateBreakEven, calculateDCF, calculateLoan, calculateSIP } from './calculations';

describe('financial calculations', () => {
  it('calculates DCF enterprise value', () => {
    const result = calculateDCF({ revenueGrowth: 10, ebitMargin: 20, taxRate: 25, discountRate: 10, terminalGrowth: 3, years: 5 }, 1000);
    expect(result.enterpriseValue).toBeGreaterThan(0);
    expect(result.cashFlows).toHaveLength(5);
  });

  it('calculates break-even point', () => {
    const result = calculateBreakEven({ fixedCosts: 1000, variableCost: 2, price: 5 });
    expect(result.units).toBeCloseTo(333.33, 1);
  });

  it('calculates loan and sip outputs', () => {
    expect(calculateLoan({ loanAmount: 100000, interestRate: 10, tenureYears: 1 }).emi).toBeGreaterThan(0);
    expect(calculateSIP({ monthlyInvestment: 100, annualReturn: 8, years: 10 }).futureValue).toBeGreaterThan(12000);
  });
});
