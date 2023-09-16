import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { FilterContactDto } from './dto/filter-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private prismaService: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    return this.prismaService.contact.create({
      data: createContactDto,
    });
  }

  findAll(filterContactDto: FilterContactDto) {
    return this.prismaService.contact.findMany({
      where: filterContactDto,
      orderBy: {
        id: 'asc',
      },
    });
  }

  findOne(filterContactDto: FilterContactDto) {
    return this.prismaService.contact.findFirstOrThrow({
      where: filterContactDto,
    });
  }

  update(id: number, updateContactDto: UpdateContactDto) {
    return this.prismaService.contact.update({
      where: { id },
      data: updateContactDto,
    });
  }

  remove(id: number) {
    return this.prismaService.contact.delete({ where: { id } });
  }
}
