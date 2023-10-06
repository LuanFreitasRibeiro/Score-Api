import { JwtService } from '@nestjs/jwt';
import UseCase from '../interfaces/UseCase.interface';
import { Injectable } from '@nestjs/common';

type Input = any;

type Output = {
  token: string;
};

@Injectable()
export default class LoginUseCase implements UseCase<Input, Output> {
  constructor(private readonly jwtService: JwtService) {}
  async execute(input: Input): Promise<Output> {
    const payload = {
      sub: input.userId,
      email: input.email,
      role: input.role,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
