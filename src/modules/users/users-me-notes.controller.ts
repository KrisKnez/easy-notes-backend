import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RequestWithUser } from '../auth/entities/request-with-user';
import { RetrieveNoteDto } from '../notes/dto/retrieve-note.dto';
import { CreateUserNoteDto } from './dto/create-user-note.dto';
import { UpdateNoteDto } from '../notes/dto/update-note.dto';
import { NotesService } from '../notes/notes.service';

@ApiTags('users-me-notes')
@Controller('users/me/notes')
@UseGuards(AuthGuard)
export class UsersMeNotesController {
  constructor(private notesService: NotesService) {}

  @Post()
  async createUserNote(
    @Body() createUserNoteDto: CreateUserNoteDto,
    @Request() request: RequestWithUser,
  ): Promise<RetrieveNoteDto> {
    return await this.notesService.create({
      ...createUserNoteDto,
      userId: request.user.id,
    });
  }

  @Get()
  async findAllUserNotes(
    @Request() request: RequestWithUser,
  ): Promise<RetrieveNoteDto[]> {
    return await this.notesService.findAll({
      userId: request.user.id,
    });
  }

  @Get('search')
  searchUserNotes(
    @Query('term') term: string,
    @Request() request: RequestWithUser,
  ) {
    return this.notesService.search(term, { userId: request.user.id });
  }

  @Get(':id')
  async findOneUserNote(
    @Param('id') id: string,
    @Request() request: RequestWithUser,
  ): Promise<RetrieveNoteDto> {
    return await this.notesService.findOne({
      id: +id,
      userId: request.user.id,
    });
  }

  @Patch(':id')
  async updateUserNote(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() request: RequestWithUser,
  ): Promise<RetrieveNoteDto> {
    return this.notesService.update(+id, updateNoteDto, {
      userId: request.user.id,
    });
  }

  @Delete(':id')
  async removeUserNote(
    @Param('id') id: string,
    @Request() request: RequestWithUser,
  ): Promise<RetrieveNoteDto> {
    return this.notesService.remove(+id, { userId: request.user.id });
  }
}
