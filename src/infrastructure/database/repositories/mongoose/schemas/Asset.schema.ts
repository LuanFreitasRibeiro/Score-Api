import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'assets' })
export default class MongooseAssetEntity extends Document {
  @Prop({ type: String, required: true })
  assetId: string;

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

export type MongooseAssetDocument = MongooseAssetEntity & Document;

export const MongooseAssetSchema = SchemaFactory.createForClass(
  MongooseAssetEntity,
).index({ assetId: 1 }, { unique: true });
