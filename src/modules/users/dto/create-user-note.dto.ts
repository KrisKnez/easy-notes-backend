import { OmitType } from '@nestjs/swagger';
import { CreateNoteDto } from 'src/modules/notes/dto/create-note.dto';

export class CreateUserNoteDto extends OmitType(CreateNoteDto, [
  'userId',
] as const) {}
