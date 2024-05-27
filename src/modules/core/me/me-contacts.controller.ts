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
import { AuthGuard } from '../auth/guards/auth.guard';
import { RequestWithUser } from '../auth/types/request-with-user';
import { ContactsService } from '~/modules/feature/contacts/contacts.service';
import { CreateUserContactDto } from '~/modules/feature/users/dto/create-user-contact';
import { RetrieveContactDto } from '~/modules/feature/contacts/dto/retrieve-contact.dto';
import { UpdateContactDto } from '~/modules/feature/contacts/dto/update-contact.dto';

@ApiTags('me-contacts')
@Controller('me/contacts')
@UseGuards(AuthGuard)
export class MeContactsController {
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
