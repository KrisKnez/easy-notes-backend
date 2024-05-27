import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateNoteDto implements Prisma.NoteUncheckedCreateInput {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNumber()
  @Type(() => Number)
  userId: number;
}
