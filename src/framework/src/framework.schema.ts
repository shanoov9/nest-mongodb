import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Framework extends Document {
  @Prop({ required: true })
  frameworkTitle: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: [String] })
  frameworkCategory: string[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy: string;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy: string;
}

export const FrameworkSchema = SchemaFactory.createForClass(Framework);
