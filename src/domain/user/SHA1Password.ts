import Password from './Password';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

export default class SHA1Password implements Password {
  password: string;
  private constructor(readonly value: string) {}

  static create(password: string) {
    const value = crypto.createHash('sha1').update(password).digest('hex');
    return new SHA1Password(value);
  }

  static restore(password: string) {
    return new SHA1Password(password);
  }

  validate(password: string): boolean {
    const value = crypto.createHash('sha1').update(password).digest('hex');
    return this.value === value;
  }
}
