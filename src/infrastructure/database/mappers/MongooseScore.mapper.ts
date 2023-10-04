import Score from 'src/domain/score/Score';
import MongooseScoreEntity from '../repositories/mongoose/schemas/Score.schema';

export default class MongooseScoreMapper {
  static toEntity(data: MongooseScoreEntity): Score {
    return new Score(
      data.scoreId,
      data.userId,
      data.score,
      data.createdAt,
      data.updatedAt,
    );
  }
}
