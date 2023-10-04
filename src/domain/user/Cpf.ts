import { HttpStatus } from '@nestjs/common';
import { SERVICE_NAME } from 'src/commons/envs';
import { DomainError } from 'src/commons/errors/domain-error';

export default class Cpf {
  value: string;

  constructor(value: string) {
    if (!this.validate(value))
      throw new DomainError(
        'Invalid CPF',
        `${SERVICE_NAME}/invalid-cpf`,
        HttpStatus.BAD_REQUEST,
      );
    this.value = value;
  }

  private validate(cpf: string) {
    cpf = this.clean(cpf);
    if (this.isValidLenght(cpf)) return false;
    if (this.hasAllDigitsEqual(cpf)) return false;
    const digit1 = this.calcuteDigit(cpf, 10);
    const digit2 = this.calcuteDigit(cpf, 11);
    return this.extractCheckDigit(cpf) == `${digit1}${digit2}`;
  }

  private clean(cpf: string) {
    return cpf.replace(/\D/g, '');
  }

  private isValidLenght(cpf: string) {
    return cpf.length !== 11;
  }

  private hasAllDigitsEqual(cpf: string) {
    const [firstDigit] = cpf;
    return [...cpf].every((digit) => digit === firstDigit);
  }

  private calcuteDigit(cpf: string, factor: number) {
    let total = 0;
    for (const digit of cpf) {
      if (factor > 1) total += parseInt(digit) * factor--;
    }
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  }

  private extractCheckDigit(cpf: string) {
    return cpf.slice(9);
  }
}
