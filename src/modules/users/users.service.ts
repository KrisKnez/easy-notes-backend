import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { FilterUserDto } from './dto/filter-user.dto';
import { plainToClass } from 'class-transformer';
import { RetrieveUserDto } from './dto/retrieve-user.dto';

import * as hash from 'hash.js';
import { ChangePasswordDto } from './dto/change-password.dto';

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

  async findOneByFilter(filter: FilterUserDto) {
    return await this.prismaService.user.findFirstOrThrow({
      where: filter,
    });
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

  async changePassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<RetrieveUserDto> {
    if (changePasswordDto.newPassword !== changePasswordDto.repeatNewPassword)
      throw new BadRequestException([
        'repeatNewPassword New passwords do not match',
      ]);

    const oldPassword = hash
      .sha256()
      .update(changePasswordDto.currentPassword)
      .digest('hex');

    const newPassword = hash
      .sha256()
      .update(changePasswordDto.newPassword)
      .digest('hex');

    if (oldPassword === newPassword)
      throw new BadRequestException([
        'newPassword Cannot be the same as current password',
      ]);

    const user = await this.prismaService.user.findFirst({
      where: {
        id,
        password: oldPassword,
      },
    });

    if (!user)
      throw new BadRequestException(['currentPassword Not current password']);

    try {
      return await this.prismaService.user.update({
        data: {
          password: newPassword,
        },
        where: {
          id,
          password: oldPassword,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
}
