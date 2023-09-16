import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterNoteDto implements Prisma.NoteWhereInput {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  id?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date | string;

  @IsDate()
  @IsOptional()
  updatedAt?: Date | string;

  @IsNumber()
  @IsOptional()
  userId?: number;
}
