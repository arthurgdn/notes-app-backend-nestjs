import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteSchema } from './note.schema';
import { AuthenticationMiddleware } from 'src/common/auth.middleware';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Note', schema: NoteSchema }]),
    AuthModule,
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(
        { path: 'notes', method: RequestMethod.GET },
        { path: 'notes', method: RequestMethod.POST },
        { path: 'notes/:id', method: RequestMethod.PATCH },
        { path: 'notes/:id', method: RequestMethod.DELETE },
      );
  }
}
