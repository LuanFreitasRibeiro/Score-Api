import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import MongooseUserEntity, {
  MongooseUserSchema,
} from '../database/repositories/mongoose/schemas/User.schema';
import CreateUserUseCase from 'src/application/usecases/user/CreateUser.usecase';
import MongooseUserRepositoryDatabase from '../database/repositories/mongoose/User.repository';
import UserController from 'src/presentation/controllers/User.controller';
import GetUserByEmailUseCase from 'src/application/usecases/user/GetUserByEmail.usecase';
import GetUserByIdUseCase from 'src/application/usecases/user/GetUserById.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongooseUserEntity.name,
        schema: MongooseUserSchema,
      },
    ]),
  ],
  providers: [
    CreateUserUseCase,
    GetUserByEmailUseCase,
    GetUserByIdUseCase,
    {
      provide: 'UserRepository',
      useClass: MongooseUserRepositoryDatabase,
    },
  ],
  controllers: [UserController],
})
export default class UserModule {}
