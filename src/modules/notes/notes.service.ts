import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { RetrieveNoteDto } from './dto/retrieve-note.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { FilterNoteDto } from './dto/filter-note.dto';
import { FindNoteDto } from './dto/find-note.dto';

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

  async update(findNoteDto: FindNoteDto, updateNoteDto: UpdateNoteDto) {
    return this.prismaService.note.update({
      where: findNoteDto,
      data: updateNoteDto,
    });
  }

  async remove(findNoteDto: FindNoteDto) {
    return this.prismaService.note.delete({
      where: findNoteDto,
    });
  }
}
