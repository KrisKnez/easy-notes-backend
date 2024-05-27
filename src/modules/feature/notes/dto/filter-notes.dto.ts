import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterNotesDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  idEquals?: number;

  @IsString()
  @IsOptional()
  titleEquals?: string;

  @IsString()
  @IsOptional()
  titleContains?: string;

  @IsString()
  @IsOptional()
  titleStartsWith?: string;

  @IsString()
  @IsOptional()
  titleEndsWith?: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  userIdEquals?: number;

  @IsString()
  @IsOptional()
  search?: string;

  constructor(init?: Partial<FilterNotesDto>) {
    Object.assign(this, init);
  }

  toPrismaObject(): Prisma.NoteWhereInput {
    return {
      id: {
        equals: this.idEquals,
      },
      title: {
        equals: this.titleEquals,
        contains: this.titleContains,
        startsWith: this.titleStartsWith,
        endsWith: this.titleEndsWith,
      },
      userId: {
        equals: this.userIdEquals,
      },
      ...(this.search && {
        OR: [
          {
            title: {
              contains: this.search,
              mode: 'insensitive',
            },
          },
          {
            content: {
              contains: this.search,
              mode: 'insensitive',
            },
          },
        ],
      }),
    };
  }
}
