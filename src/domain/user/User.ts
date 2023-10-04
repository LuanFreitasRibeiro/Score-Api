import UUIDGenerator from '../identity/UUIDGenerator';
import Cpf from './Cpf';
import Email from './Email';
import Password from './Password';
import SHA1Password from './SHA1Password';

export default class User {
  readonly updatedAt: Date;
  readonly createdAt: Date;

  constructor(
    readonly userId: string,
    readonly name: string,
    readonly email: Email,
    readonly password: Password,
    readonly document: Cpf,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.updatedAt = updatedAt ?? this.updatedAt ?? new Date();
    this.createdAt = createdAt ?? this.createdAt ?? new Date();
  }

  static create(
    email: string,
    name: string,
    password: string,
    document: string,
  ) {
    const userId = UUIDGenerator.create();
    return new User(
      userId,
      name,
      new Email(email),
      SHA1Password.create(password),
      new Cpf(document),
    );
  }

  static restore(
    userId: string,
    name: string,
    email: string,
    password: string,
    document: string,
  ) {
    return new User(
      userId,
      name,
      new Email(email),
      SHA1Password.create(password),
      new Cpf(document),
    );
  }

  validatePassword(password: string) {
    return this.password.validate(password);
  }

  toJSON(): Required<{ id: string } & User> {
    return {
      userId: this.userId,
      name: this.name,
      document: this.document,
      email: this.email,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    } as Required<{ id: string } & User>;
  }
}
