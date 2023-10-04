import Score from 'src/domain/score/Score';

export default interface ScoreRepository {
  save(score: Score): Promise<void>;
  getOne(filter: Record<string, any>, options?: any): Promise<Score | null>;
  update(
    id: string,
    score: Omit<Score, 'scoreId' | 'toJSON' | 'createdAt'>,
  ): Promise<void>;
}
