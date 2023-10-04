import UUIDGenerator from '../identity/UUIDGenerator';

export default class Asset {
  readonly updatedAt: Date;
  readonly createdAt: Date;

  constructor(
    readonly assetId: string,
    readonly userId,
    readonly type: string,
    readonly amount: number,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.updatedAt = updatedAt ?? this.updatedAt ?? new Date();
    this.createdAt = createdAt ?? this.createdAt ?? new Date();
  }

  static create(userId: string, type: string, amount: number) {
    const assetId = UUIDGenerator.create();
    return new Asset(assetId, userId, type, amount);
  }

  toJSON(): Required<{ id: string } & Asset> {
    return {
      id: this.assetId,
      userId: this.userId,
      type: this.type,
      amount: this.amount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    } as Required<{ id: string } & Asset>;
  }
}
