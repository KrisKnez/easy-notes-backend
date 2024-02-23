import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { RetrieveNoteDto } from './dto/retrieve-note.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { FilterNoteDto } from './dto/filter-note.dto';

@Injectable()
export class NotesService {
  constructor(private prismaService: PrismaService) {}

  async create(createNoteDto: CreateNoteDto) {
    return this.prismaService.note.create({
      data: createNoteDto,
    });
  }

  async findAll(filterNoteDto: FilterNoteDto): Promise<RetrieveNoteDto[]> {
    return this.prismaService.note.findMany({
      where: filterNoteDto,
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(filterNoteDto: FilterNoteDto): Promise<RetrieveNoteDto> {
    return this.prismaService.note.findFirstOrThrow({
      where: filterNoteDto,
    });
  }

  async update(
    id: number,
    updateNoteDto: UpdateNoteDto,
    filterNoteDto?: FilterNoteDto,
  ) {
    return this.prismaService.note.update({
      where: {
        id,
        ...filterNoteDto,
      },
      data: updateNoteDto,
    });
  }

  async remove(id: number, filterNoteDto?: FilterNoteDto) {
    return this.prismaService.note.delete({
      where: { id, ...filterNoteDto },
    });
  }

  // Search by title and content
  async search(
    search: string,
    filterNoteDto?: FilterNoteDto,
  ): Promise<RetrieveNoteDto[]> {
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
        ...filterNoteDto,
      },
    });
  }
}
