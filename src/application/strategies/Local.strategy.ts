import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import ValidateUserUseCase from '../usecases/auth/ValidateUser.usecase';

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(readonly authValidateUserUseCase: ValidateUserUseCase) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    const user = await this.authValidateUserUseCase.execute({
      email,
      password,
    });

    if (!user) throw new UnauthorizedException('Credentials incorrect');

    return user;
  }
}
