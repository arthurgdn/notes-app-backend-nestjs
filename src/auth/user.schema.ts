import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Note } from 'src/notes/note.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  _id: MongooseSchema.Types.ObjectId;

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
const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  // <-- change to a function instead
  const user = this;
  if (user.password) {
    user.password = await argon2.hash(user.password);
    next();
  }
});

export { UserSchema };
