import Email from '../../src/domain/user/Email';

describe('Unit Test - Email', () => {
  it('Should valid a email', () => {
    const email = new Email('john.doe@gmail.com');
    expect(email).toBeTruthy();
  });

  it('Should not valid a email', () => {
    const email = 'john.doe@gmail';
    expect(() => new Email(email)).toThrow(new Error('Invalid email'));
  });
});
