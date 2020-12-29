import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './create-note.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/user.decorator';
import { User as UserModel } from '../auth/user.schema';

@ApiBearerAuth()
@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Get()
  async getNotes(@User() user: UserModel) {
    const notes = await this.notesService.getNotes(String(user._id));
    return notes;
  }

  @Post()
  async addNote(@User() user: UserModel, @Body() createNoteDto: CreateNoteDto) {
    const note = await this.notesService.addNote(
      String(user._id),
      createNoteDto,
    );
    return note;
  }

  @Patch(':id')
  async editNote(
    @User() user: UserModel,
    @Param('id') id,
    @Body() patchNoteDto: CreateNoteDto,
  ) {
    const note = await this.notesService.editNote(
      String(user._id),
      id,
      patchNoteDto,
    );
    return note;
  }

  @Delete(':id')
  async deleteNote(@User() user: UserModel, @Param('id') id) {
    const note = await this.notesService.deleteNote(String(user._id), id);
    return note;
  }
}
