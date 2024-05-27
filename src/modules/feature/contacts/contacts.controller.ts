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
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ApiTags } from '@nestjs/swagger';
import { RetrieveContactDto } from './dto/retrieve-contact.dto';
import { FilterContactDto } from './dto/filter-contact.dto';

@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async create(
    @Body() createContactDto: CreateContactDto,
  ): Promise<RetrieveContactDto> {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  async findAll(
    @Query() filterContactDto: FilterContactDto,
  ): Promise<RetrieveContactDto[]> {
    return this.contactsService.findAll(filterContactDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RetrieveContactDto> {
    return this.contactsService.findOne({ id: +id });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ): Promise<RetrieveContactDto> {
    return this.contactsService.update(+id, updateContactDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<RetrieveContactDto> {
    return this.contactsService.remove(+id);
  }
}
