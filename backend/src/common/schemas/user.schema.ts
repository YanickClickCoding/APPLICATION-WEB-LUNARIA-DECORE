import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true }) firstName: string;
  @Prop({ required: true }) lastName: string;
  @Prop({ unique: true, sparse: true }) email: string;
  @Prop({ required: true, unique: true }) phone: string;
  @Prop() password: string;
  @Prop({ enum: ['CLIENT', 'ADMIN', 'LIVREUR'], default: 'CLIENT' })
  role: string;
  @Prop() avatar: string;
  @Prop({
    type: {
      quartier: String,
      ville: String,
      commune: String,
      indications: String,
    },
  })
  address: {
    quartier: string;
    ville: string;
    commune: string;
    indications?: string;
  };
  @Prop({ default: false }) isVerified: boolean;
  @Prop({ default: true }) isActive: boolean;
  @Prop() otpCode: string;
  @Prop() otpExpires: Date;
  @Prop([String]) favorites: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
