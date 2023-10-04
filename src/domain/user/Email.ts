import { HttpStatus } from '@nestjs/common';
import { SERVICE_NAME } from 'src/commons/envs';
import { DomainError } from 'src/commons/errors/domain-error';

export default class Email {
  value: string;

  constructor(value: string) {
    if (!this.validate(value))
      throw new DomainError(
        'Invalid email',
        `${SERVICE_NAME}/invalid-email`,
        HttpStatus.BAD_REQUEST,
      );
    this.value = value;
  }

  validate(email: string) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  }
}
