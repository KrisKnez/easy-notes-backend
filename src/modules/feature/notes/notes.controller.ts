import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ApiTags } from '@nestjs/swagger';
import { FilterNotesDto } from './dto/filter-notes.dto';
import { SortNotesDto } from './dto/sort-notes.dto';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Get()
  findAll(
    @Query() sortNotesDto: SortNotesDto,
    @Query() filterNotesDto: FilterNotesDto,
  ) {
    return this.notesService.findAll(sortNotesDto, filterNotesDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(new FilterNotesDto({ idEquals: +id }));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(+id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(+id);
  }
}
