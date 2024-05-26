import { User } from '@prisma/client';

export class UserDto implements Omit<User, 'password'> {
  id: number;
  email: string;

  name: string;
  bio: string;

  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserDto> = {}) {
    this.id = partial.id;
    this.email = partial.email;
    this.name = partial.name;
    this.bio = partial.bio;
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;
  }

  public static fromEntity(user: User): UserDto {
    return new this({
      id: user.id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
