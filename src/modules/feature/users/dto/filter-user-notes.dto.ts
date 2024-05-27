import { OmitType } from '@nestjs/swagger';
import { FilterNotesDto } from '../../notes/dto/filter-notes.dto';

class FilterUserNotesDto extends OmitType(FilterNotesDto, [
  'userIdEquals',
] as const) {
  constructor(init?: Partial<FilterUserNotesDto>) {
    super(init);
  }

  toFilterNotesDto(userIdEquals: number): FilterNotesDto {
    return new FilterNotesDto({
      ...this,
      userIdEquals,
    });
  }
}

export default FilterUserNotesDto;
