import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import ScoreProducer from 'src/application/queue/ScoreProducer.interface';
import CalculateScoreUseCase from 'src/application/usecases/score/CalculateScore.usecase';
import UpdateScoreUseCase from 'src/application/usecases/score/UpdateScore.usecase';
import {
  RABBITMQ_CREATE_SCORE_EXCHANGE,
  RABBITMQ_UPDATE_SCORE_EXCHANGE,
} from 'src/commons/envs';

@Injectable()
export default class ScoreProducerRabbitMQ implements ScoreProducer {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async createScorePublish(userId: any): Promise<void> {
    const exchange = RABBITMQ_CREATE_SCORE_EXCHANGE;
    const routeKey = 'createScore';
    await this.amqpConnection.publish(exchange, routeKey, { userId: userId });
  }

  async updateScorePublish(userId: any): Promise<void> {
    const exchange = RABBITMQ_UPDATE_SCORE_EXCHANGE;
    const routeKey = 'updateScore';
    await this.amqpConnection.publish(exchange, routeKey, {
      userId: userId,
    });
  }
}
