import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import generateSortOptions from 'src/utils/generateOrderByStringsFromEnum';

export class SortNotesDto {
  @ApiPropertyOptional({
    enum: generateSortOptions(Prisma.NoteScalarFieldEnum),
    isArray: true,
  })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsEnum(generateSortOptions(Prisma.NoteScalarFieldEnum), { each: true })
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
