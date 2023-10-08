import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import MongooseDebtEntity, {
  MongooseDebtSchema,
} from '../database/repositories/mongoose/schemas/Debt.schema';
import CreateDebtUseCase from 'src/application/usecases/debt/CreateDebt.usecase';
import GetByIdUseCase from 'src/application/usecases/debt/GetDebtById.usecase';
import UpdateDebtUseCase from 'src/application/usecases/debt/UpdateDebt.usecase';
import DeleteDebtUseCase from 'src/application/usecases/debt/DeleteDebt.usercase';
import MongooseDebtRepositoryDatabase from '../database/repositories/mongoose/Debt.repository';
import DebtController from 'src/presentation/controllers/Debt.controller';
import GetDebtsUseCase from 'src/application/usecases/debt/GetDebts.usecase';
import MongooseUserEntity, {
  MongooseUserSchema,
} from '../database/repositories/mongoose/schemas/User.schema';
import MongooseUserRepositoryDatabase from '../database/repositories/mongoose/User.repository';
import ScoreProducerRabbitMQ from '../rabbitmq/score/Score.producer';
import RabbitModule from './RabbitMQ.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongooseDebtEntity.name,
        schema: MongooseDebtSchema,
      },
      {
        name: MongooseUserEntity.name,
        schema: MongooseUserSchema,
      },
    ]),
    RabbitModule,
  ],
  providers: [
    CreateDebtUseCase,
    GetByIdUseCase,
    GetDebtsUseCase,
    UpdateDebtUseCase,
    DeleteDebtUseCase,
    {
      provide: 'DebtRepository',
      useClass: MongooseDebtRepositoryDatabase,
    },
    {
      provide: 'UserRepository',
      useClass: MongooseUserRepositoryDatabase,
    },
    {
      provide: 'ScoreProducer',
      useClass: ScoreProducerRabbitMQ,
    },
  ],
  controllers: [DebtController],
})
export default class DebtModule {}
