import ScoreRepository from 'src/application/repository/ScoreRepository.interface';
import UseCase from '../interfaces/UseCase.interface';
import { Inject } from '@nestjs/common';
import Score from 'src/domain/score/Score';

type Input = {
  userId: string;
  score: number;
};
type Output = {
  scoreId: string;
};

export default class CreateScoreUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject('ScoreRepository')
    readonly scoreRepository: ScoreRepository,
  ) {}
  async execute(input: Input): Promise<Output> {
    const score = Score.create(input.userId, input.score);
    await this.scoreRepository.save(score);
    return {
      scoreId: score.scoreId,
    };
  }
}
