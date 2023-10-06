import UUIDGenerator from '../identity/UUIDGenerator';
import Cpf from './Cpf';
import Email from './Email';
import SHA1Password from './Password';
import Password from './Password';
import { Role } from 'src/commons/enums/Role.enum';
import { DomainError } from 'src/commons/errors/domain-error';
import { HttpStatus } from '@nestjs/common';
import { SERVICE_NAME } from 'src/commons/envs';

export default class User {
  readonly updatedAt: Date;
  readonly createdAt: Date;

  constructor(
    readonly userId: string,
    readonly name: string,
    readonly email: Email,
    readonly password: Password,
    readonly document: Cpf,
    readonly role: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.updatedAt = updatedAt ?? this.updatedAt ?? new Date();
    this.createdAt = createdAt ?? this.createdAt ?? new Date();
    if (!this.validateRole(role))
      throw new DomainError(
        'Invalid role',
        `${SERVICE_NAME}/invalid-role`,
        HttpStatus.BAD_REQUEST,
      );
  }

  validateRole(role: string) {
    return Object.values(Role).some((r) => r === role);
  }

  static create(
    email: string,
    name: string,
    password: string,
    document: string,
    role: string,
  ) {
    const userId = UUIDGenerator.create();
    return new User(
      userId,
      name,
      new Email(email),
      SHA1Password.create(password),
      new Cpf(document),
      role,
    );
  }

  static restore(
    userId: string,
    name: string,
    email: string,
    password: string,
    document: string,
    role: string,
  ) {
    return new User(
      userId,
      name,
      new Email(email),
      SHA1Password.create(password),
      new Cpf(document),
      role,
    );
  }

  toJSON(): Required<{ id: string } & User> {
    return {
      userId: this.userId,
      name: this.name,
      document: this.document,
      email: this.email,
      password: this.password,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    } as Required<{ id: string } & User>;
  }
}
