import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNoteDto } from './create-note.dto';
import { Note, NoteDocument } from './note.schema';
@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}
  async getNotes(user_id: string): Promise<Note[]> {
    return await this.noteModel.find({ author: user_id });
  }

  async addNote(user_id: string, createNoteDto: CreateNoteDto): Promise<Note> {
    const createdNote = new this.noteModel({
      author: user_id,
      ...createNoteDto,
    });
    return await createdNote.save();
  }

  async deleteNote(user_id, id): Promise<Note> {
    const note = await this.noteModel.findOneAndDelete({
      author: user_id,
      _id: id,
    });
    if (!note) {
      throw new HttpException('Note does not exist', 404);
    }
    return note;
  }

  async editNote(user_id, id, patchNoteDto): Promise<Note> {
    const note = await this.noteModel.findOneAndUpdate(
      { author: user_id, _id: id },
      patchNoteDto,
    );
    if (!note) {
      throw new HttpException('Note does not exist', 404);
    }
    return note;
  }
}
