import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import getSortOptionsFromEnum from '~/shared/utils/get-sort-options-from-enum';

export class SortNotesDto {
  @ApiPropertyOptional({
    enum: getSortOptionsFromEnum(Prisma.NoteScalarFieldEnum),
    isArray: true,
  })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsEnum(getSortOptionsFromEnum(Prisma.NoteScalarFieldEnum), { each: true })
  @IsOptional()
  orderBy?: string[];

  constructor(init?: Partial<SortNotesDto>) {
    Object.assign(this, init);
  }

  toPrismaObject(): Prisma.NoteOrderByWithRelationInput {
    const prismObject = this.orderBy?.reduce((acc, curr) => {
      const [field, order] = curr.split(':');
      return {
        ...acc,
        [field]: order,
      };
    }, {});

    return prismObject;
  }
}
