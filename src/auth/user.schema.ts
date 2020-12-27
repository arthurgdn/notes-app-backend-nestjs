import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Note } from 'src/notes/note.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  _id: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  name: string;

  @Prop()
  notes: Note[];

  @Prop()
  tokens: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
