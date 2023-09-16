import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

import * as hash from 'hash.js';
import { plainToClass } from 'class-transformer';
import { RetrieveUserDto } from '../users/dto/retrieve-user.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prismaService.user.findFirstOrThrow({
      where: {
        email: loginDto.email,
      },
    });

    const password = hash.sha256().update(loginDto.password).digest('hex');
    if (user.password !== password)
      throw new UnauthorizedException('Incorrect password');

    const token = this.jwtService.sign({
      user: plainToClass(RetrieveUserDto, user),
    });

    return {
      user,
      token,
    };
  }

  async register(registerDto: RegisterDto) {
    const password = hash.sha256().update(registerDto.password).digest('hex');

    const user = await this.prismaService.user.create({
      data: {
        email: registerDto.email,
        password,
      },
    });

    const token = this.jwtService.sign({
      user: plainToClass(RetrieveUserDto, user),
    });

    return {
      user,
      token,
    };
  }

  async refresh(user: RetrieveUserDto) {
    const token = this.jwtService.sign({
      user: plainToClass(RetrieveUserDto, user),
    });

    return token;
  }
}
