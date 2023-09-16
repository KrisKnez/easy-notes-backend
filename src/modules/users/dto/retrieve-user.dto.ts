import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class RetrieveUserDto implements User {
  id: number;
  email: string;

  @Exclude()
  password: string;

  name: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}
