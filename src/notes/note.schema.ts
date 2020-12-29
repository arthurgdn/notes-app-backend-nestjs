import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/auth/user.schema';

export type NoteDocument = Note & Document;

@Schema()
export class Note {
  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  author: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
