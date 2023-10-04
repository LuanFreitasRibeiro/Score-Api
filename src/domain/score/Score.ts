import UUIDGenerator from '../identity/UUIDGenerator';

export default class Score {
  readonly updatedAt: Date;
  readonly createdAt: Date;

  constructor(
    readonly scoreId: string,
    readonly userId: string,
    readonly score: number,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.updatedAt = updatedAt ?? this.updatedAt ?? new Date();
    this.createdAt = createdAt ?? this.createdAt ?? new Date();
  }

  static create(userId: string, score: number) {
    const scoreId = UUIDGenerator.create();
    return new Score(scoreId, userId, score);
  }

  toJSON(): Required<{ id: string } & Score> {
    return {
      scoreId: this.scoreId,
      userId: this.userId,
      score: this.score,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    } as Required<{ id: string } & Score>;
  }
}
