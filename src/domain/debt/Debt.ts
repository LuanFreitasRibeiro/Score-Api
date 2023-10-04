import UUIDGenerator from '../identity/UUIDGenerator';

export default class Debt {
  readonly updatedAt: Date;
  readonly createdAt: Date;

  constructor(
    readonly debtId: string,
    readonly userId: string,
    readonly amount: number,
    readonly type: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.updatedAt = updatedAt ?? this.updatedAt ?? new Date();
    this.createdAt = createdAt ?? this.createdAt ?? new Date();
  }

  static create(userId: string, amount: number, type: string) {
    const debtId = UUIDGenerator.create();
    return new Debt(debtId, userId, amount, type);
  }

  toJSON(): Required<{ id: string } & Debt> {
    return {
      id: this.debtId,
      userId: this.userId,
      type: this.type,
      amount: this.amount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    } as Required<{ id: string } & Debt>;
  }
}
