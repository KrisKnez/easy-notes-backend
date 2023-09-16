import { Request } from '@nestjs/common';

import { RetrieveUserDto } from 'src/modules/users/dto/retrieve-user.dto';

export interface RequestWithUser extends Request {
  user: RetrieveUserDto;
}
