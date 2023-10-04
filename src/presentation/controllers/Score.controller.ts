import { Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import CalculateScoreUseCase from 'src/application/usecases/score/CalculateScore.usecase';

@Controller('scores')
@ApiTags('Score')
export default class ScoreController {
  constructor(private readonly createScoreUseCase: CalculateScoreUseCase) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Calculate score' })
  async calculate(@Param('userId') userId: string) {
    try {
      const output = await this.createScoreUseCase.execute({ userId });
      return output;
    } catch (error) {
      throw error;
    }
  }
}
