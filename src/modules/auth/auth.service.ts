import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { plainToClass, plainToInstance } from 'class-transformer';
import { RetrieveUserDto } from '../users/dto/retrieve-user.dto';
import { RegisterDto } from './dto/register.dto';

import { AuthTokenDto } from './dto/auth-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) throw new UnauthorizedException(['email Unknown email']);

    if (!bcrypt.compareSync(loginDto.password, user.password))
      throw new UnauthorizedException(['password Incorrect password']);

    const token = await this.createToken(user);

    return {
      user,
      token,
    };
  }

  async register(registerDto: RegisterDto) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(registerDto.password, salt);

    const user = await this.prismaService.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
      },
    });

    const token = await this.createToken(user);

    return {
      user,
      token,
    };
  }

  async createToken(user: RetrieveUserDto) {
    const authToken = plainToInstance(
      AuthTokenDto,
      this.jwtService.sign({
        user: plainToClass(RetrieveUserDto, user),
      }),
    );

    return authToken;
  }

  async validateToken(authToken: string) {
    // Verify and decode the JWT
    const decodedToken = plainToInstance(
      AuthTokenDto,
      this.jwtService.verify(authToken),
    );

    return decodedToken;
  }

  async refreshToken(authToken: string) {
    const token = await this.validateToken(authToken);

    const newAuthToken = await this.createToken(token.user);

    return newAuthToken;
  }
}
