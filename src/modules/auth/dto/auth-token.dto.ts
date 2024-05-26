import { Transform } from 'class-transformer';
import { UserDto } from 'src/modules/users/dto/user.dto';

export class AuthTokenDto {
  @Transform(({ value }) => new UserDto(value))
  user: UserDto;

  constructor(partial: Partial<AuthTokenDto> = {}) {
    this.user = new UserDto(partial.user);
  }
}
