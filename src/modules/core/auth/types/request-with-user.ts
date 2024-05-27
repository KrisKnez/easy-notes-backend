import { UserDto } from 'modules/feature/users/dto/user.dto';

export interface RequestWithUser extends Request {
  user: UserDto;
}
