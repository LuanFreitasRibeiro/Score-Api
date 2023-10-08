import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Controller } from '@nestjs/common';
import CalculateScoreUseCase from 'src/application/usecases/score/CalculateScore.usecase';
import CreateScoreUseCase from 'src/application/usecases/score/CreateScore.usecase';
import UpdateScoreUseCase from 'src/application/usecases/score/UpdateScore.usecase';
import {
  RABBITMQ_CREATE_SCORE_EXCHANGE,
  RABBITMQ_CREATE_SCORE_QUEUE,
  RABBITMQ_UPDATE_SCORE_EXCHANGE,
  RABBITMQ_UPDATE_SCORE_QUEUE,
} from 'src/commons/envs';

@Controller()
export default class ScoreConsumerController {
  constructor(
    private readonly createScoreUseCase: CreateScoreUseCase,
    private readonly calculateScoreUseCase: CalculateScoreUseCase,
    private readonly updateScoreUseCase: UpdateScoreUseCase,
  ) {}

  @RabbitSubscribe({
    exchange: RABBITMQ_CREATE_SCORE_EXCHANGE,
    routingKey: 'createScore',
    queue: RABBITMQ_CREATE_SCORE_QUEUE,
  })
  public async createScoreEvent(userId: any) {
    await this.createScoreUseCase.execute(userId);
  }

  @RabbitSubscribe({
    exchange: RABBITMQ_UPDATE_SCORE_EXCHANGE,
    routingKey: 'updateScore',
    queue: RABBITMQ_UPDATE_SCORE_QUEUE,
  })
  public async updateScoreEvent(userId: any) {
    const { score } = await this.calculateScoreUseCase.execute(userId);
    await this.updateScoreUseCase.execute({
      ...userId,
      score: score,
    });
  }
}
