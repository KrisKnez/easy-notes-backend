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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContactsService } from '../contacts/contacts.service';
import { RetrieveContactDto } from '../contacts/dto/retrieve-contact.dto';
import { UpdateContactDto } from '../contacts/dto/update-contact.dto';
import { CreateUserContactDto } from './dto/create-user-contact';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '~/modules/core/auth/types/request-with-user';

@ApiTags('users-contacts')
@Controller('users/contacts')
@UseGuards(AuthGuard)
export class UsersContactsController {
  constructor(private contactService: ContactsService) {}

  @Post()
  async createUserContact(
    @Body() createUserContactDto: CreateUserContactDto,
    @Request() request: RequestWithUser,
  ): Promise<RetrieveContactDto> {
    return await this.contactService.create({
      ...createUserContactDto,
      userId: request.user.id,
    });
  }

  @Get()
  async findAllUserContacts(
    @Request() request: RequestWithUser,
  ): Promise<RetrieveContactDto[]> {
    return await this.contactService.findAll({
      userId: request.user.id,
    });
  }

  @Get(':id')
  async findOneUserContact(
    @Param('id') id: string,
    @Request() request: RequestWithUser,
  ): Promise<RetrieveContactDto> {
    return await this.contactService.findOne({
      id: +id,
      userId: request.user.id,
    });
  }

  @Patch(':id')
  async updateUserContact(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ): Promise<RetrieveContactDto> {
    return this.contactService.update(+id, updateContactDto);
  }

  @Delete(':id')
  async removeUserContact(
    @Param('id') id: string,
  ): Promise<RetrieveContactDto> {
    return this.contactService.remove(+id);
  }
}
