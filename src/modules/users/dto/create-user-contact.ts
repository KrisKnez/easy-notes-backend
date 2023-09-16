import { OmitType } from '@nestjs/swagger';
import { CreateContactDto } from 'src/modules/contacts/dto/create-contact.dto';

export class CreateUserContactDto extends OmitType(CreateContactDto, [
  'userId',
] as const) {}
