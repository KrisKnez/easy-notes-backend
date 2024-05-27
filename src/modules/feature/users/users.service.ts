import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UserDto } from './dto/user.dto';

import * as bcrypt from 'bcrypt';
import { PrismaService } from '~/shared/services/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create({
    password,
    ...restCreateUserDto
  }: CreateUserDto): Promise<UserDto> {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await this.prismaService.user.create({
      data: {
        ...restCreateUserDto,
        password: hashedPassword,
      },
    });

    return UserDto.fromEntity(user);
  }

  async findAll(filterUserDto: FilterUserDto): Promise<UserDto[]> {
    const users = await this.prismaService.user.findMany({
      ...(Object.keys(filterUserDto).length && {
        where: filterUserDto,
      }),
    });

    return users.map((user) => UserDto.fromEntity(user));
  }

  async findOne(id: number): Promise<UserDto | null> {
    const user = await this.prismaService.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) return null;

    return UserDto.fromEntity(user);
  }

  async findOneByFilter(filter: FilterUserDto): Promise<UserDto | null> {
    const user = await this.prismaService.user.findFirstOrThrow({
      where: filter,
    });

    if (!user) return null;

    return UserDto.fromEntity(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
        password: updateUserDto.password,
      },
    });

    return UserDto.fromEntity(user);
  }

  async remove(id: number): Promise<UserDto> {
    const user = await this.prismaService.user.delete({
      where: { id },
    });

    return UserDto.fromEntity(user);
  }
}
