import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { FilterUserDto } from './dto/filter-user.dto';
import { plainToClass } from 'class-transformer';
import { RetrieveUserDto } from './dto/retrieve-user.dto';

import * as hash from 'hash.js';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create({ password, ...restCreateUserDto }: CreateUserDto) {
    return await this.prismaService.user.create({
      data: {
        ...restCreateUserDto,
        password: hash.sha256().update(password).digest('hex'),
      },
    });
  }

  async findAll(filterUserDto: FilterUserDto): Promise<RetrieveUserDto[]> {
    return plainToClass(
      RetrieveUserDto,
      await this.prismaService.user.findMany({
        ...(Object.keys(filterUserDto).length && {
          where: filterUserDto,
        }),
      }),
    );
  }

  async findOne(id: number) {
    return plainToClass(
      RetrieveUserDto,
      await this.prismaService.user.findFirstOrThrow({
        where: {
          id,
        },
      }),
    );
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return await this.prismaService.user.delete({
      where: { id },
    });
  }
}
