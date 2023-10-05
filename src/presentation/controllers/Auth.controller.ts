import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import LoginUseCase from 'src/application/usecases/auth/Login.usecase';
import { AuthDTO } from '../dto/auth/Auth.dto';

@Controller('auth')
@ApiTags('Auth')
export default class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiBody({ type: AuthDTO })
  async login(@Req() req: any) {
    return await this.loginUseCase.execute(req.user);
  }
}
