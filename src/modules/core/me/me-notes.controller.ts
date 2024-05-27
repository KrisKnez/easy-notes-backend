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
import { NotesService } from '~/modules/feature/notes/notes.service';
import { CreateUserNoteDto } from '~/modules/feature/users/dto/create-user-note.dto';
import { RequestWithUser } from '../auth/types/request-with-user';
import { NoteDto } from '~/modules/feature/notes/dto/note.dto';
import { SortNotesDto } from '~/modules/feature/notes/dto/sort-notes.dto';
import FilterUserNotesDto from '~/modules/feature/users/dto/filter-user-notes.dto';
import { FilterNotesDto } from '~/modules/feature/notes/dto/filter-notes.dto';
import { UpdateNoteDto } from '~/modules/feature/notes/dto/update-note.dto';

@ApiTags('me-notes')
@Controller('me/notes')
@UseGuards(AuthGuard)
export class MeNotesController {
  constructor(private notesService: NotesService) {}

  @Post()
  async createUserNote(
    @Body() createUserNoteDto: CreateUserNoteDto,
    @Request() request: RequestWithUser,
  ): Promise<NoteDto> {
    return await this.notesService.create({
      ...createUserNoteDto,
      userId: request.user.id,
    });
  }

  @Get()
  async findAllUserNotes(
    @Request() request: RequestWithUser,
    @Query() sortNotesDto: SortNotesDto,
    @Query() filterUserNotesDto: FilterUserNotesDto,
  ): Promise<NoteDto[]> {
    return await this.notesService.findAll(
      sortNotesDto,
      filterUserNotesDto.toFilterNotesDto(request.user.id),
    );
  }

  @Get(':id')
  async findOneUserNote(
    @Param('id') id: string,
    @Request() request: RequestWithUser,
  ): Promise<NoteDto> {
    return await this.notesService.findOne(
      new FilterNotesDto({
        idEquals: +id,
        userIdEquals: request.user.id,
      }),
    );
  }

  @Patch(':id')
  async updateUserNote(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() request: RequestWithUser,
  ): Promise<NoteDto> {
    return this.notesService.update(+id, updateNoteDto, {
      userId: request.user.id,
    });
  }

  @Delete(':id')
  async removeUserNote(
    @Param('id') id: string,
    @Request() request: RequestWithUser,
  ): Promise<NoteDto> {
    return this.notesService.remove(+id, { userId: request.user.id });
  }
}
