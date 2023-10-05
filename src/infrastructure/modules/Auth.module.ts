import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import UserModule from './User.module';
import { JwtModule } from '@nestjs/jwt';
import { SECRET_KEY } from 'src/commons/envs';
import { MongooseModule } from '@nestjs/mongoose';
import MongooseUserEntity, {
  MongooseUserSchema,
} from '../database/repositories/mongoose/schemas/User.schema';
import MongooseUserRepositoryDatabase from '../database/repositories/mongoose/User.repository';
import LocalStrategy from 'src/application/strategies/Local.strategy';
import AuthController from 'src/presentation/controllers/Auth.controller';
import ValidateUserUseCase from 'src/application/usecases/auth/ValidateUser.usecase';
import LoginUseCase from 'src/application/usecases/auth/Login.usecase';
import JwtStrategy from 'src/application/strategies/Jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongooseUserEntity.name,
        schema: MongooseUserSchema,
      },
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    UserModule,
    JwtModule.register({
      privateKey: SECRET_KEY,
      signOptions: { expiresIn: '90s' },
    }),
  ],
  providers: [
    ValidateUserUseCase,
    LoginUseCase,
    {
      provide: 'UserRepository',
      useClass: MongooseUserRepositoryDatabase,
    },
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export default class AuthModule {}
