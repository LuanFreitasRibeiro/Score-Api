import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'debts' })
export default class MongooseDebtEntity extends Document {
  @Prop({ type: String, required: true })
  debtId: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date, required: true })
  updatedAt: Date;
}

export type MongooseDebtDocument = MongooseDebtEntity & Document;

export const MongooseDebtSchema = SchemaFactory.createForClass(
  MongooseDebtEntity,
).index({ debtId: 1 }, { unique: true });
