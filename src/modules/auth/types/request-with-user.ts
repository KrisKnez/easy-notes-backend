import { UserDto } from 'src/modules/users/dto/user.dto';

export interface RequestWithUser extends Request {
  user: UserDto;
}
