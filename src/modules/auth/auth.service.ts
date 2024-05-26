import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { UserDto } from '../users/dto/user.dto';
import { RegisterDto } from './dto/register.dto';

import { AuthTokenDto } from './dto/auth-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{
    userDto: UserDto;
    token: string;
  }> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: loginDto.email,
      },
    });

    const userDto = UserDto.fromEntity(user);

    if (!user) throw new UnauthorizedException(['email Unknown email']);

    if (!bcrypt.compareSync(loginDto.password, user.password))
      throw new UnauthorizedException(['password Incorrect password']);

    const token = await this.createToken(userDto);

    return {
      userDto,
      token,
    };
  }

  async register(registerDto: RegisterDto): Promise<{
    userDto: UserDto;
    token: string;
  }> {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(registerDto.password, salt);

    const user = await this.prismaService.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
      },
    });

    const userDto = UserDto.fromEntity(user);

    const token = await this.createToken(user);

    return {
      userDto,
      token,
    };
  }

  async createToken(userDto: UserDto): Promise<string> {
    const authToken = this.jwtService.sign({
      user: userDto,
    });

    return authToken;
  }

  async validateToken(authToken: string): Promise<AuthTokenDto> {
    const authTokenVerified = this.jwtService.verify(authToken);
    const decodedToken = new AuthTokenDto(authTokenVerified);

    return decodedToken;
  }

  async refreshToken(authToken: string): Promise<string> {
    const token = await this.validateToken(authToken);
    const newAuthToken = await this.createToken(token.user);

    return newAuthToken;
  }

  async changePassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<UserDto> {
    // Check if current password is correct
    const user = await this.prismaService.user.findFirst({
      where: {
        id,
      },
    });
    if (!bcrypt.compareSync(changePasswordDto.newPassword, user.password))
      throw new BadRequestException(['currentPassword Incorrect password']);

    // Process with update
    try {
      const salt = bcrypt.genSaltSync(10);
      const hashedNewPassword = bcrypt.hashSync(
        changePasswordDto.newPassword,
        salt,
      );

      const user = await this.prismaService.user.update({
        data: {
          password: hashedNewPassword,
        },
        where: {
          id,
        },
      });

      return UserDto.fromEntity(user);
    } catch (e) {
      console.log(e);
    }
  }
}
