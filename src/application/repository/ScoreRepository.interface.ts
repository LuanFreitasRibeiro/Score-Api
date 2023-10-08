import Score from 'src/domain/score/Score';

export default interface ScoreRepository {
  save(score: Score): Promise<void>;
  getOne(filter: Record<string, any>, options?: any): Promise<Score | null>;
  update(
    userId: string,
    score: Omit<Score, 'scoreId' | 'userId' | 'toJSON' | 'createdAt'>,
  ): Promise<void>;
}
