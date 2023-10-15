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
    const { userId, email, role } = input;
    const payload = {
      sub: userId,
      email: email,
      role: role,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
