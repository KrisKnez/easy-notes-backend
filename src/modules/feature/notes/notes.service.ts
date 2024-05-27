import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteDto } from './dto/note.dto';
import { Prisma } from '@prisma/client';
import { SortNotesDto } from './dto/sort-notes.dto';
import { FilterNotesDto } from './dto/filter-notes.dto';
import { PrismaService } from '~/shared/services/prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prismaService: PrismaService) {}

  async create(createNoteDto: CreateNoteDto) {
    return this.prismaService.note.create({
      data: createNoteDto,
    });
  }

  async findAll(
    sortNotesDto: SortNotesDto,
    filterNotesDto: FilterNotesDto,
  ): Promise<NoteDto[]> {
    return this.prismaService.note.findMany({
      where: filterNotesDto.toPrismaObject(),
      orderBy: sortNotesDto.toPrismaObject(),
    });
  }

  async findOne(filterNotesDto: FilterNotesDto): Promise<NoteDto> {
    return this.prismaService.note.findFirstOrThrow({
      where: filterNotesDto.toPrismaObject(),
    });
  }

  async update(
    id: number,
    updateNoteDto: UpdateNoteDto,
    noteWhereInput?: Prisma.NoteWhereInput,
  ) {
    return this.prismaService.note.update({
      where: {
        ...noteWhereInput,
        id,
      },
      data: updateNoteDto,
    });
  }

  async remove(id: number, noteWhereInput?: Prisma.NoteWhereInput) {
    return this.prismaService.note.delete({
      where: { ...noteWhereInput, id },
    });
  }

  // Search by title and content
  async search(
    search: string,
    noteWhereInput?: Prisma.NoteWhereInput,
  ): Promise<NoteDto[]> {
    return this.prismaService.note.findMany({
      where: {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            content: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
        ...noteWhereInput,
      },
    });
  }
}
