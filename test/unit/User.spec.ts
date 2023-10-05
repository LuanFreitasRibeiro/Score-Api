import UUIDGenerator from '../../src/domain/identity/UUIDGenerator';
import User from '../../src/domain/user/User';

describe('Unit Test - User', () => {
  it('Should create a new user', () => {
    const user = User.create(
      'john.doe@gmail.com',
      'John Doe',
      '123456',
      '22668510040',
    );
    expect(user.userId).toBeDefined();
    expect(user.email.value).toBe('john.doe@gmail.com');
  });

  it('Should restore an existing user', () => {
    const userId = UUIDGenerator.create();
    const user = User.restore(
      userId,
      'John Doe',
      'john.doe@gmail.com',
      '123456',
      '22668510040',
    );
    expect(user.userId).toBe(userId);
    expect(user.email.value).toBe('john.doe@gmail.com');
  });
});
