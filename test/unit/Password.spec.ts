import SHA1Password from '../../src/domain/user/SHA1Password';

describe('Unit Test - Password', () => {
  it('Should create a valid password', () => {
    const password = SHA1Password.create('123456');
    expect(password.validate('123456')).toBe(true);
  });
});
