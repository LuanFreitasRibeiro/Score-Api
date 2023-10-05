import { hashSync } from 'bcrypt';

export default class Password {
  password: string;
  private constructor(readonly value: string) {}

  static create(password: string) {
    const value = hashSync(password, 10);
    return new Password(value);
  }
}
