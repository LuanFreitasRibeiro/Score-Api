import { Module } from '@nestjs/common';
import ScoreModule from './Score.module';
import CreateScoreUseCase from 'src/application/usecases/score/CreateScore.usecase';
import { MongooseModule } from '@nestjs/mongoose';
import MongooseScoreEntity, {
  MongooseScoreSchema,
} from '../database/repositories/mongoose/schemas/Score.schema';
import MongooseScoreRepositoryDatabase from '../database/repositories/mongoose/Score.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import RabbitMQAdapter from '../queue/RabbitMQAdapter';

@Module({
  imports: [
    ScoreModule,
    RabbitMQAdapter,
    MongooseModule.forFeature([
      {
        name: MongooseScoreEntity.name,
        schema: MongooseScoreSchema,
      },
    ]),
    ClientsModule.register([
      {
        name: 'score-module',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost'],
          noAck: false,
          queue: 'create-store',
        },
      },
    ]),
  ],
  providers: [
    CreateScoreUseCase,
    { provide: 'ScoreRepository', useClass: MongooseScoreRepositoryDatabase },
  ],
  exports: [RabbitMQAdapter],
})
export default class QueueConsumerModule {}
