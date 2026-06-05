import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  conversation: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;
  @Prop({ enum: ['TEXT', 'IMAGE', 'DOCUMENT', 'SYSTEM'], default: 'TEXT' })
  type: string;
  @Prop({ required: true }) content: string;
  @Prop([{ url: String, name: String, type: String, size: Number }])
  attachments: object[];
  @Prop([{ type: Types.ObjectId, ref: 'User' }]) readBy: Types.ObjectId[];
  @Prop({ default: false }) isDeleted: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.index({ conversation: 1, createdAt: 1 });
