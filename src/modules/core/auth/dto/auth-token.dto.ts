import { Transform } from 'class-transformer';
import { UserDto } from '~/modules/feature/users/dto/user.dto';

export class AuthTokenDto {
  @Transform(({ value }) => new UserDto(value))
  user: UserDto;

  constructor(partial: Partial<AuthTokenDto> = {}) {
    if (partial.user) {
      if (partial.user instanceof UserDto) this.user = partial.user;
      else throw new Error('Invalid user type');
    }
  }
}
