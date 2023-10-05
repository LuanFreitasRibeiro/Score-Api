import { InjectModel } from '@nestjs/mongoose';
import ScoreRepository from 'src/application/repository/ScoreRepository.interface';
import Score from 'src/domain/score/Score';
import { Model, QueryOptions } from 'mongoose';
import MongooseScoreEntity, {
  MongooseScoreDocument,
} from './schemas/Score.schema';
import MongooseScoreMapper from '../../mappers/MongooseScore.mapper';

export default class MongooseScoreRepositoryDatabase
  implements ScoreRepository
{
  constructor(
    @InjectModel(MongooseScoreEntity.name)
    public ScoreModel: Model<MongooseScoreDocument>,
  ) {}

  async save(score: Score): Promise<void> {
    await this.ScoreModel.create(score);
  }

  async getOne(
    filter: Record<string, any>,
    options?: QueryOptions,
  ): Promise<Score> {
    const score = await this.ScoreModel.findOne(filter, {}, options);
    return score == null ? null : MongooseScoreMapper.toEntity(score);
  }

  async update(id: string, score: Score): Promise<void> {
    await this.ScoreModel.findOneAndUpdate({ scoreId: id }, score, {
      new: true,
    });
  }
}
