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
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongooseUserEntity.name,
        schema: MongooseUserSchema,
      },
    ]),
    ClientsModule.register([
      {
        name: 'Store',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost'],
          queue: 'create-score',
          queueOptions: {
            durable: true,
          },
        },
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
