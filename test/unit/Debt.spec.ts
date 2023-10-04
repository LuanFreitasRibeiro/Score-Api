import Debt from '../../src/domain/debt/Debt';

describe('Unit Test - Debt', () => {
  it('Should create a Debt', () => {
    const debt = Debt.create('', 1300, '');
    expect(debt.debtId).toBeDefined();
    expect(debt.amount).toBe(1300);
  });
});
