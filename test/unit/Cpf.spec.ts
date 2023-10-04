import Cpf from '../../src/domain/user/Cpf';

describe('Unit Test - Cpf', () => {
  it.each(['22668510040', '75010609088', '57504044040'])(
    'Should test the CPFs valid',
    (value: string) => {
      const cpf = new Cpf(value);
      expect(cpf.value).toBe(value);
    },
  );

  it.each(['22668510044', '99999999999', '834326160', ''])(
    'Should test the CPFs invalid',
    async (value: string) => {
      await expect(() => new Cpf(value)).toThrow(new Error('Invalid CPF'));
    },
  );
});
