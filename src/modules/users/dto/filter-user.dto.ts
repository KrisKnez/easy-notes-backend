import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterUserDto implements Prisma.UserWhereInput {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  id?: number;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
