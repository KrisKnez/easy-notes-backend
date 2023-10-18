import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { FilterUserDto } from './dto/filter-user.dto';
import { plainToClass } from 'class-transformer';
import { RetrieveUserDto } from './dto/retrieve-user.dto';

import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create({ password, ...restCreateUserDto }: CreateUserDto) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    return await this.prismaService.user.create({
      data: {
        ...restCreateUserDto,
        password: hashedPassword,
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
    // Check if new passwords are the same
    if (changePasswordDto.newPassword !== changePasswordDto.repeatNewPassword)
      throw new BadRequestException([
        'repeatNewPassword New passwords do not match',
      ]);

    // Check if new password is the same as current password
    if (changePasswordDto.newPassword === changePasswordDto.currentPassword)
      throw new BadRequestException([
        'newPassword Cannot be the same as current password',
      ]);

    // Check if current password is correct
    const user = await this.prismaService.user.findFirst({
      where: {
        id,
      },
    });
    if (!bcrypt.compareSync(changePasswordDto.currentPassword, user.password))
      throw new BadRequestException(['currentPassword Incorrect password']);

    // Process with update
    try {
      const salt = bcrypt.genSaltSync(10);
      const hashedNewPassword = bcrypt.hashSync(
        changePasswordDto.newPassword,
        salt,
      );

      return await this.prismaService.user.update({
        data: {
          password: hashedNewPassword,
        },
        where: {
          id,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
}
