import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'scores' })
export default class MongooseScoreEntity extends Document {
  @Prop({ type: String, required: true })
  scoreId: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: Number, required: true })
  score: number;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date, required: true })
  updatedAt: Date;
}

export type MongooseScoreDocument = MongooseScoreEntity & Document;

export const MongooseScoreSchema = SchemaFactory.createForClass(
  MongooseScoreEntity,
).index({ scoreId: 1 }, { unique: true });
